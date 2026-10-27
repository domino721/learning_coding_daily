import { SyncAgent } from "./SyncPanel";
import Activity, { TodayCompleted } from "./Activity";
import { Lifetime, LearningRecord } from "./LearningRecord";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  api,
  ApiError,
  type Dashboard,
  type Exercise,
  type Session,
  type Track,
} from "./api";
import ExerciseCard from "./ExerciseCard";
import ExerciseReview from "./ExerciseReview";
import { readTheme, saveTheme } from "./theme";
import { recommendationReason } from "./recommendation";

const trackName = (id: string) =>
  id === "sql"
    ? "SQL"
    : id === "python"
      ? "Python 데이터 분석"
      : "이전 통합 학습";
const playable = (item: Exercise) =>
  item.status === "pending" && item.response_mode !== "essay";
const outcome = (item: Exercise) =>
  item.response_mode === "essay"
    ? "미채점 · 해설 비교"
    : item.status === "correct"
      ? "정답"
      : item.status === "incorrect"
        ? "오답"
        : "해설 학습";
type Screen = "home" | "lesson" | "summary" | "record";

export default function App() {
  const [theme, setTheme] = useState(readTheme);
  const [screen, setScreen] = useState<Screen>("home");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [trackId, setTrackId] = useState(() => {
    try {
      return localStorage.getItem("learning-coding-daily:track") === "sql"
        ? "sql"
        : "python";
    } catch {
      return "python";
    }
  });
  const refreshSequence = useRef(0);
  useEffect(() => {
    try {
      localStorage.setItem("learning-coding-daily:track", trackId);
    } catch {
      /* Preferences do not block record recovery. */
    }
  }, [trackId]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recordNotice, setRecordNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const guard = useRef(false);
  const pendingSubmission = useRef<{
    answer: string;
    attempt_id: string;
  } | null>(null);
  const focusTarget = useRef<HTMLHeadingElement>(null);

  const refresh = useCallback(async () => {
    const sequence = ++refreshSequence.current;
    const [data, available] = await Promise.all([
      api<Dashboard>(`/dashboard?track_id=${trackId}`),
      api<Track[]>("/tracks"),
    ]);
    if (sequence === refreshSequence.current) {
      setDashboard(data);
      setTracks(available);
    }
    return data;
  }, [trackId]);
  useEffect(() => {
    refresh()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [refresh]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (screen !== "lesson") focusTarget.current?.focus();
  }, [screen, index]);

  async function action(work: () => Promise<void>) {
    if (guard.current) return;
    guard.current = true;
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "처리하지 못했어요. 다시 시도해 주세요.",
      );
      if (e instanceof ApiError && e.status === 409) {
        try {
          await refresh();
          setScreen("home");
        } catch {
          /* Preserve the original error for retry. */
        }
      }
    } finally {
      guard.current = false;
      setBusy(false);
    }
  }
  function start() {
    openSession(false);
  }
  function startExtra() {
    openSession(true);
  }
  function openSession(extra: boolean, previous?: Session) {
    void action(async () => {
      const data = await api<Session>(
        previous
          ? `/sessions/${previous.id}`
          : extra
            ? "/sessions/extra"
            : "/sessions/today",
        previous ? undefined : { track_id: trackId },
      );
      if (data.finished) await refresh();
      setSession(data);
      setIndex(Math.max(0, data.items.findIndex(playable)));
      pendingSubmission.current = null;
      setScreen(
        data.finished || !data.items.some(playable) ? "summary" : "lesson",
      );
    });
  }
  async function answer(value: string, activeSeconds: number) {
    if (!session) return;
    await action(async () => {
      if (
        !pendingSubmission.current ||
        pendingSubmission.current.answer !== value
      ) {
        pendingSubmission.current = {
          answer: value,
          attempt_id: crypto.randomUUID(),
        };
      }
      const result = await api<{ correct: boolean | null; session: Session }>(
        `/sessions/${session.id}/answers`,
        {
          exercise_id: session.items[index].id,
          ...pendingSubmission.current,
          active_seconds: activeSeconds,
        },
      );
      setSession(result.session);
      pendingSubmission.current = null;
    });
  }
  async function saveDraft(draft: string) {
    if (!session) return;
    await api(`/sessions/${session.id}/draft`, {
      exercise_id: session.items[index].id,
      draft,
    });
  }
  function hint() {
    if (session)
      void action(async () => {
        setSession(
          await api<Session>(`/sessions/${session.id}/hint`, {
            exercise_id: session.items[index].id,
          }),
        );
      });
  }
  function reveal(activeSeconds: number) {
    if (session)
      void action(async () => {
        setSession(
          await api<Session>(`/sessions/${session.id}/reveal`, {
            exercise_id: session.items[index].id,
            active_seconds: activeSeconds,
          }),
        );
        pendingSubmission.current = null;
      });
  }
  function next() {
    if (!session) return;
    const pending = session.items.findIndex(playable);
    if (pending < 0) {
      void action(async () => {
        await refresh();
        setScreen("summary");
      });
    } else {
      setIndex(pending);
      pendingSubmission.current = null;
    }
  }
  async function recordsRestored() {
    await refresh();
    setError("");
    setRecordNotice("백업 기록을 합쳤어요. 기존 완료 기록은 유지됩니다.");
    setScreen("record");
  }
  function home(target: "home" | "record" = "home") {
    if (screen === "lesson" && session && !session.finished)
      void api("/observations", {
        kind: "lesson_paused",
        detail: JSON.stringify({
          session_id: session.id,
          exercise_id: session.items[index]?.id,
        }),
      }).catch(() => {});
    setScreen(target);
    setError("");
    void refresh().catch((e) => setError(e.message));
  }
  const day = dashboard?.local_day;
  const todaySession = dashboard?.today;
  const item = session?.items[index];
  // Include every batch, replacing the active one with its latest local result.
  const summarySessions = session
    ? [
        ...(dashboard?.today_sessions ?? []).filter(
          (s) =>
            s.local_day === session.local_day &&
            s.id !== session.id &&
            s.track_id === session.track_id,
        ),
        session,
      ].sort((a, b) => (a.batch ?? 0) - (b.batch ?? 0))
    : [];
  const summaryItems = summarySessions.flatMap((s) =>
    s.items
      .filter((ex) => ex.status !== "pending")
      .map((ex) => ({ exercise: ex, sessionId: s.id, batch: s.batch ?? 0 })),
  );
  const summaryCorrect = summaryItems.filter(
    ({ exercise }) => exercise.status === "correct",
  ).length;
  const extraLabel =
    dashboard?.extra && !dashboard.extra.finished
      ? "추가 학습 이어서 풀기"
      : "추천 문제 더 풀기";
  const activity = dashboard && (
    <Activity
      dashboard={dashboard}
      todaySession={todaySession}
      recordMode={screen === "record"}
      activeCount={tracks.reduce((n, t) => n + t.exercise_count, 0)}
    />
  );
  return (
    <div className={`app-shell${screen === "home" ? " home-shell" : ""}`}>
      <SyncAgent />
      <header className="app-header">
        <button
          className="brand"
          onClick={() => home()}
          aria-label="매일코딩 홈"
        >
          <span className="brand-icon" aria-hidden="true">
            ↗
          </span>
          매일코딩<span className="beta">EARLY</span>
        </button>
        <span className="build-id" title="배포본 식별자">
          {typeof __BUILD_ID__ === "string" ? __BUILD_ID__ : "dev"}
        </span>
        <button
          className="theme-toggle"
          aria-label="다크 테마"
          aria-pressed={theme === "dark"}
          onClick={() => {
            const next = theme === "dark" ? "light" : "dark";
            saveTheme(next);
            setTheme(next);
          }}
        >
          <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
          {theme === "dark" ? "다크" : "라이트"}
        </button>
      </header>
      <main
        className={
          screen === "lesson"
            ? "lesson-main"
            : screen === "home"
              ? "home-main"
              : ""
        }
      >
        {error && (
          <div className="error-banner" role="alert">
            <p>{error}</p>
            <button
              className="text-button"
              onClick={() => {
                void action(async () => {
                  await refresh();
                });
              }}
            >
              다시 연결
            </button>
          </div>
        )}
        {recordNotice && (
          <p className="record-message" role="status">
            {recordNotice}
          </p>
        )}
        {dashboard?.storage_notice && (
          <p className="storage-notice" role="status">
            {dashboard.storage_notice}
          </p>
        )}
        {!loading && !dashboard && (
          <LearningRecord dashboard={null} refresh={recordsRestored} />
        )}
        {loading ? (
          <section className="loading" role="status">
            <span className="loader" />
            오늘의 한 걸음을 준비하고 있어요.
          </section>
        ) : (
          <>
            {(screen === "home" || screen === "record") && (
              <>
                <div className={screen === "home" ? "home-intro" : undefined}>
                  <div className="page-heading">
                    <p className="eyebrow">
                      {day?.replaceAll("-", ".")} ·{" "}
                      {screen === "record" ? "MY LEARNING" : "DAILY PRACTICE"}
                    </p>
                    <h1 ref={focusTarget} tabIndex={-1}>
                      {screen === "record" ? (
                        "쌓여 가는 작은 실력."
                      ) : (
                        <>
                          <span>오늘도,</span> <span>한 걸음 더.</span>
                        </>
                      )}
                    </h1>
                    <p>
                      {screen === "record"
                        ? "해설로 배운 것도 소중한 연습이에요."
                        : "하루 10분의 연습이 내일의 자신감이 되도록."}
                    </p>
                  </div>
                  {screen === "home" && activity}
                </div>
                {screen === "home" && (
                  <>
                    <section
                      className="tracks-section"
                      aria-labelledby="tracks-title"
                    >
                      <div className="section-heading">
                        <h2 id="tracks-title">오늘 학습</h2>
                        <span>학습 트랙 선택</span>
                      </div>
                      <div className="track-list">
                        {tracks
                          .filter((track) => track.available)
                          .map((track) => (
                            <button
                              key={track.id}
                              disabled={!track.available || busy}
                              onClick={() => setTrackId(track.id)}
                              aria-pressed={
                                track.available
                                  ? trackId === track.id
                                  : undefined
                              }
                              className={`track-card ${track.available ? "available" : ""}`}
                            >
                              <span className="track-copy">
                                <strong>{track.name}</strong>
                                <span>{track.description}</span>
                              </span>
                              <span
                                className={`track-tag ${track.available ? "green" : ""}`}
                              >
                                {track.available
                                  ? `${track.exercise_count}문제`
                                  : "준비 중"}
                              </span>
                            </button>
                          ))}
                      </div>
                    </section>
                    <section
                      className="daily-card"
                      aria-labelledby="daily-title"
                    >
                      <div className="daily-card-content">
                        <div>
                          <h2 id="daily-title">{trackName(trackId)}</h2>
                          <p>
                            {trackId === "sql"
                              ? "SQL 기초부터 조건·집계·조인을 연습해요."
                              : "pandas·NumPy와 통계·머신러닝을 연습해요."}
                          </p>
                        </div>
                      </div>
                      <div className="daily-details">
                        <span>◷ 약 10분</span>
                        <span>▤ 목표 5문제</span>
                        <span>기초 → 적용</span>
                      </div>
                      {todaySession && (
                        <div className="daily-progress">
                          <div>
                            <span>기본 목표</span>
                            <strong>
                              {todaySession.completed_count} /{" "}
                              {todaySession.total}
                            </strong>
                          </div>
                          <progress
                            value={todaySession.completed_count}
                            max={todaySession.total}
                            aria-label="기본 목표 진행률"
                          />
                        </div>
                      )}
                      {todaySession && todaySession.total < 5 && (
                        <p>
                          오늘 추천 가능한 {todaySession.total}문제로 시작해요.
                        </p>
                      )}
                      {(!todaySession || todaySession.finished) &&
                        !dashboard?.available_count &&
                        (!dashboard?.extra || dashboard.extra.finished) && (
                          <p className="pool-notice" role="status">
                            오늘 추천할 새 문제와 예정된 복습을 모두 풀었어요.
                            다른 트랙을 연습하거나 다음 복습 때 만나요.
                          </p>
                        )}
                      <button
                        className="light-button"
                        disabled={
                          busy ||
                          !dashboard ||
                          dashboard.track_id !== trackId ||
                          (!todaySession && !dashboard.available_count)
                        }
                        onClick={start}
                      >
                        {todaySession?.finished
                          ? "오늘 학습 돌아보기"
                          : todaySession && todaySession.completed_count > 0
                            ? "이어서 학습하기"
                            : "오늘 학습 시작하기"}
                        <span aria-hidden="true">↗</span>
                      </button>
                      <p className="recommended-note">
                        실력에 맞는 객관식·단답형 문제를 추천해요.
                      </p>
                    </section>
                    {tracks.some((track) => !track.available) && (
                      <p className="upcoming-note">
                        {tracks
                          .filter((track) => !track.available)
                          .map((track) => track.name)
                          .join(" · ")}{" "}
                        트랙은 준비 중이에요.
                      </p>
                    )}
                    {todaySession?.finished && (
                      <div className="extra-prompt">
                        <button
                          className="extra-button"
                          disabled={
                            busy ||
                            (!dashboard?.available_count &&
                              (!dashboard?.extra || dashboard.extra.finished))
                          }
                          onClick={startExtra}
                        >
                          {extraLabel} <span aria-hidden="true">→</span>
                        </button>
                        <p className="gentle-note">
                          오늘의 목표는 달성했어요. 원하면 더 연습할 수 있어요.
                        </p>
                      </div>
                    )}
                    {dashboard?.legacy_session && (
                      <div className="legacy-note">
                        <p>
                          이전 통합 학습 기록과 답안은 그대로 보관했어요. 새
                          트랙의 목표는 별도로 시작하며 전체 누적은 이어져요.
                          서술형 답안은 보류·미채점으로 남깁니다.
                        </p>
                        {dashboard.legacy_session.items.some(playable) && (
                          <button
                            className="extra-button"
                            disabled={busy}
                            onClick={() =>
                              openSession(false, dashboard.legacy_session!)
                            }
                          >
                            이전 통합 학습 이어서
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
                {dashboard && <Lifetime dashboard={dashboard} />}
                {screen === "record" && activity}
                {screen === "record" && (
                  <LearningRecord
                    dashboard={dashboard}
                    refresh={recordsRestored}
                  />
                )}
                <p className="gentle-note">
                  {dashboard?.timezone ?? "Asia/Seoul"} 기준 ·{" "}
                  {dashboard?.storage_mode === "device"
                    ? "이 기기의 브라우저에 학습 기록이 저장돼요."
                    : "이 서버에 개인 학습 기록이 저장돼요."}
                </p>
              </>
            )}
            {screen === "lesson" && session && item && (
              <>
                <div className="lesson-toolbar">
                  <button
                    className="back-button"
                    onClick={() => home()}
                    disabled={busy}
                  >
                    ← 오늘 학습
                  </button>
                  <span>{trackName(session.track_id)}</span>
                </div>
                <ExerciseCard
                  key={`${session.id}:${item.id}`}
                  recommendation={recommendationReason(session, item.id)}
                  item={item}
                  index={index}
                  total={session.total}
                  busy={busy}
                  onAnswer={(value, seconds) => {
                    void answer(value, seconds);
                  }}
                  onDraft={saveDraft}
                  onHint={hint}
                  onReveal={reveal}
                  onNext={next}
                />
              </>
            )}
            {screen === "summary" && session && (
              <section className="summary">
                <span className="summary-symbol" aria-hidden="true">
                  ✦
                </span>
                <p className="eyebrow">
                  {session.batch
                    ? "EXTRA PRACTICE, ONE MORE STEP"
                    : "TODAY, ONE STEP FORWARD"}
                </p>
                <h1 ref={focusTarget} tabIndex={-1}>
                  {session.batch ? "추가 연습도," : "오늘의 한 걸음,"}
                  <br />잘 마쳤어요.
                </h1>
                <p>
                  작게 풀어도 실력은 차곡차곡 쌓여요.
                  <br />
                  오늘 배운 개념을 잠깐 돌아볼까요?
                </p>
                {dashboard && <TodayCompleted dashboard={dashboard} />}
                <p className="batch-result-label">
                  {trackName(session.track_id)} · 오늘 풀이 결과
                </p>
                <div className="summary-stats">
                  <div>
                    <strong>{summaryCorrect}</strong>
                    <span>정답으로 마침</span>
                  </div>
                  <div>
                    <strong>
                      {
                        summaryItems.filter(
                          ({ exercise }) => exercise.status === "incorrect",
                        ).length
                      }
                    </strong>
                    <span>오답으로 마침</span>
                  </div>
                  <div>
                    <strong>
                      {
                        summaryItems.filter(
                          ({ exercise }) => exercise.status === "revealed",
                        ).length
                      }
                    </strong>
                    <span>해설 학습·미채점</span>
                  </div>
                </div>
                {session.track_id !== "pandas" && (
                  <div className="extra-prompt">
                    <button
                      className="primary"
                      disabled={
                        busy ||
                        (!dashboard?.available_count &&
                          (!dashboard?.extra || dashboard.extra.finished))
                      }
                      onClick={startExtra}
                    >
                      {extraLabel} <span aria-hidden="true">→</span>
                    </button>
                    <p className="gentle-note">
                      새 문제와 예정된 복습을 추천해요. 오늘 나온 문제는
                      반복하지 않아요.
                    </p>
                    {!dashboard?.available_count &&
                      (!dashboard?.extra || dashboard.extra.finished) && (
                        <p role="status">
                          오늘 추천할 문제를 모두 풀었어요. 다른 트랙도 연습할
                          수 있어요.
                        </p>
                      )}
                  </div>
                )}
                <ul className="summary-list">
                  {summaryItems.map(({ exercise: ex, sessionId, batch }) => (
                    <li key={`${sessionId}:${ex.id}`}>
                      <span
                        className={
                          ex.status === "correct"
                            ? "outcome-correct"
                            : ex.status === "incorrect"
                              ? "outcome-incorrect"
                              : "outcome-reviewed"
                        }
                        aria-label={outcome(ex)}
                      >
                        {ex.status === "correct"
                          ? "✓"
                          : ex.status === "incorrect"
                            ? "×"
                            : "↺"}
                      </span>
                      <span>
                        <strong>{ex.title}</strong>
                        <small>
                          {batch ? `추가 학습 ${batch}` : "기본 학습"} ·{" "}
                          {ex.domain ?? "데이터 분석"} · {ex.concept}
                        </small>
                      </span>
                      <ExerciseReview item={ex} />
                    </li>
                  ))}
                </ul>
                <p className="gentle-note">
                  복습할 문제는 다음 학습에 다시 섞어 드릴게요.
                  <br />
                  오늘의 목표는 달성했어요. 더 풀거나 여기서 마쳐도 좋아요.
                </p>
                <button className="primary" onClick={() => home()}>
                  오늘 학습으로 돌아가기
                </button>
              </section>
            )}
          </>
        )}
      </main>
      {screen !== "lesson" && (
        <p className="gentle-note">
          <a href="./design.html">커리큘럼·추천·저장 작동 원리 보기</a>
        </p>
      )}
      {screen !== "lesson" && (
        <nav className="bottom-nav" aria-label="주 메뉴">
          <button
            aria-current={screen !== "record" ? "page" : undefined}
            onClick={() => home()}
          >
            <span aria-hidden="true">⌂</span>오늘 학습
          </button>
          <button
            aria-current={screen === "record" ? "page" : undefined}
            onClick={() => home("record")}
          >
            <span aria-hidden="true">▥</span>나의 기록
          </button>
        </nav>
      )}
    </div>
  );
}
