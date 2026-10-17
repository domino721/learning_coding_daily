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
import CodeBlock from "./CodeBlock";
import ExerciseReview from "./ExerciseReview";
import { readTheme, saveTheme } from "./theme";
import { formatTime, useActiveTime } from "./useActiveTime";

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
const labels = { new: "새 개념", review: "복습", practice: "다시 연습" };

function TodayCompleted({ dashboard }: { dashboard: Dashboard }) {
  const basic = dashboard.today_sessions
    .filter((s) => !s.batch)
    .reduce((n, s) => n + s.completed_count, 0);
  const total = dashboard.today_completed_count ?? basic;
  return (
    <div className="today-completed" role="group" aria-label="오늘 누적 학습">
      <p>
        오늘 총 <strong>{total}문제</strong> 풀었어요.
      </p>
      <span>
        전체 트랙 · 기본 {basic}문제 · 추가·이전 {total - basic}문제
      </span>
    </div>
  );
}

function week(day: string) {
  const date = new Date(`${day}T12:00:00Z`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() - 6 + i);
    return {
      key: d.toISOString().slice(0, 10),
      label: ["일", "월", "화", "수", "목", "금", "토"][d.getUTCDay()],
    };
  });
}

function ExerciseCard({
  item,
  index,
  total,
  busy,
  onAnswer,
  onDraft,
  onHint,
  onReveal,
  onNext,
}: {
  item: Exercise;
  index: number;
  total: number;
  busy: boolean;
  onAnswer: (answer: string, seconds: number) => void;
  onDraft: (draft: string) => Promise<void>;
  onHint: () => void;
  onReveal: (seconds: number) => void;
  onNext: () => void;
}) {
  const [draft, setDraft] = useState(
    item.status === "pending" ? (item.draft ?? "") : (item.last_answer ?? ""),
  );
  const mode =
    item.response_mode ?? (item.kind === "choice" ? "choice" : "short");
  const [draftStatus, setDraftStatus] = useState("");
  useEffect(() => {
    if (
      item.status !== "pending" ||
      mode === "choice" ||
      draft === (item.draft ?? "")
    )
      return;
    const timer = setTimeout(() => {
      void onDraft(draft)
        .then(() => setDraftStatus("입력한 답을 저장했어요."))
        .catch(() =>
          setDraftStatus(
            "임시 답안 저장에 실패했어요. 입력 내용은 화면에 유지됩니다.",
          ),
        );
    }, 700);
    return () => clearTimeout(timer);
  }, [draft, item.id, item.status, mode]);
  const done = item.status !== "pending";
  const { seconds, readSeconds } = useActiveTime(
    item.id,
    item.active_seconds,
    !done && !busy,
  );
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const wrong = !done && item.last_correct === false;
  return (
    <>
      <div className="lesson-meta">
        <span>
          {labels[item.category]} · {item.domain ?? "데이터 분석"}
          {done ? ` · ${item.concept}` : ""}
        </span>
        <span>
          {index + 1} / {total}
        </span>
      </div>
      <div
        className="step-dots"
        aria-label={`${total}문제 중 ${index + 1}번째`}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={i < index ? "done" : i === index ? "current" : ""}
          />
        ))}
      </div>
      <section className="exercise-card" aria-labelledby="question-title">
        <div className="exercise-heading">
          <p className="eyebrow">
            {item.kind === "choice"
              ? "결과를 생각해 보세요"
              : "작은 빈칸을 채워 보세요"}
          </p>
          <div className="exercise-time">
            <span>예상 {Math.ceil(item.estimated_seconds / 60)}분</span>
            <span
              className="elapsed-time"
              role="timer"
              aria-label="풀이 경과 시간"
            >
              {done ? "풀이" : "경과"}{" "}
              {formatTime(done ? item.active_seconds : seconds)}
            </span>
          </div>
        </div>
        <h1 ref={heading} tabIndex={-1} id="question-title">
          {item.title}
        </h1>
        <p className="prompt">
          {mode === "choice"
            ? item.prompt
                .replaceAll("입력하세요", "고르세요")
                .replaceAll("구하세요", "고르세요")
            : item.prompt.replaceAll("고르세요", "입력하세요")}
        </p>
        <CodeBlock code={item.code} language={item.domain} />
        <p className="question-format">
          {mode === "choice"
            ? "객관식"
            : mode === "essay"
              ? "서술형"
              : "단답형"}{" "}
          ·{" "}
          {item.difficulty?.label ?? (item.level === 2 ? "적용" : "기초 확인")}
        </p>
        {mode === "choice" && !done && (
          <p className="attempt-note">
            최대 2회 제출 · 남은 기회 {Math.max(0, 2 - item.attempts_count)}회
          </p>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy && !done && draft.trim()) onAnswer(draft, readSeconds());
          }}
        >
          {mode === "choice" ? (
            <fieldset disabled={busy || done} className="choices">
              <legend className="sr-only">답안 선택</legend>
              {item.choices.map((choice, i) => (
                <label
                  key={choice}
                  className={`choice ${draft === choice ? "selected" : ""} ${done && item.answer === choice ? "answer" : ""}`}
                >
                  <input
                    aria-label={choice}
                    type="radio"
                    name="answer"
                    value={choice}
                    checked={draft === choice}
                    onChange={() => setDraft(choice)}
                  />
                  <span className="choice-letter">{i + 1}</span>
                  <code>{choice}</code>
                  <span className="radio-mark" aria-hidden="true" />
                </label>
              ))}
            </fieldset>
          ) : mode === "essay" ? (
            <label className="blank-label">
              답과 풀이 이유
              <textarea
                className="blank-input essay-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={busy || done}
                placeholder="답과 그렇게 생각한 이유를 적어 주세요."
                rows={6}
                maxLength={2000}
                aria-describedby="essay-help"
              />
              <span id="essay-help" className="mode-note">
                최대 2,000자 · 제출하면 작성한 답을 저장하고 정답·해설을
                보여드려요.
              </span>
            </label>
          ) : (
            <label className="blank-label">
              {item.code.includes("____") ? "빈칸에 들어갈 답" : "답 입력"}
              <input
                className="blank-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={busy || done}
                placeholder={
                  item.code.includes("____")
                    ? "빈칸에 들어갈 답"
                    : "결과값이나 답을 입력하세요"
                }
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={200}
              />
            </label>
          )}
          {draftStatus && (
            <p className="mode-note" role="status">
              {draftStatus}
            </p>
          )}
          {wrong && (
            <div className="feedback retry" role="status">
              <strong>한 번 더 생각해 볼까요?</strong>
              <p>
                {mode === "choice"
                  ? `남은 기회는 ${Math.max(0, 2 - item.attempts_count)}회예요. 다시 틀리면 오답으로 마치고 해설을 보여드려요.`
                  : "아직 마친 문제로 처리되지 않았어요. 다른 답을 시도하거나 힌트를 열어 보세요."}
              </p>
            </div>
          )}
          {item.hints.length > 0 && (
            <aside className="hints" aria-label="문제 힌트">
              {item.hints.map((hint, i) => (
                <p key={i}>
                  <strong>힌트 {i + 1}</strong> {hint}
                </p>
              ))}
            </aside>
          )}
          {done ? (
            <div
              className={`feedback ${item.status === "correct" ? "success" : item.status === "incorrect" ? "incorrect" : "reviewed"}`}
              role="status"
            >
              <span className="result-symbol" aria-hidden="true">
                {item.status === "correct"
                  ? "○"
                  : item.status === "incorrect"
                    ? "×"
                    : "↺"}
              </span>
              <span className="eyebrow">
                {item.status === "incorrect"
                  ? "오답으로 기록했어요"
                  : mode === "essay"
                    ? "미채점 · 답안 보관"
                    : item.status === "correct"
                      ? "정답이에요"
                      : "해설로 배웠어요"}
              </span>
              <h2>
                {item.status === "correct"
                  ? "작은 한 걸음, 완료!"
                  : item.status === "incorrect"
                    ? "두 번의 기회를 모두 사용했어요."
                    : mode === "essay"
                      ? "작성한 답과 해설을 비교해 보세요."
                      : "다음에 다시 꺼내 볼게요."}
              </h2>
              {mode === "essay" && item.last_answer && (
                <>
                  <p className="mode-note">
                    서술형은 자동 채점하지 않아요. 작성한 답과 해설의 핵심을
                    비교해 보세요.
                  </p>
                  <p className="submitted-answer">
                    <strong>내 답안</strong>
                    <br />
                    {item.last_answer}
                  </p>
                </>
              )}
              <p className="solution">
                정답 <code>{item.answer}</code>
              </p>
              <p>{item.explanation}</p>
            </div>
          ) : (
            <div className="learning-tools">
              <button
                type="button"
                className="text-button"
                disabled={busy || item.hints_used >= 2}
                onClick={onHint}
              >
                ✦{" "}
                {item.hints_used >= 2
                  ? "힌트를 모두 봤어요"
                  : `힌트 보기 (${item.hints_used}/2)`}
              </button>
              <button
                type="button"
                className="text-button muted"
                disabled={busy}
                onClick={() => onReveal(readSeconds())}
              >
                해설 보고 마치기
              </button>
            </div>
          )}
          <div className="lesson-action">
            {done ? (
              <button type="button" className="primary" onClick={onNext}>
                다음으로 <span aria-hidden="true">→</span>
              </button>
            ) : (
              <button
                className="primary"
                type="submit"
                disabled={busy || !draft.trim()}
              >
                {busy
                  ? "확인하는 중…"
                  : mode === "essay"
                    ? "답 저장하고 해설 비교하기"
                    : "답 확인하기"}{" "}
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </form>
      </section>
      <p className="gentle-note">
        시간 제한은 없어요. 다른 탭을 보는 동안에는 잠시 멈춰요.
      </p>
    </>
  );
}

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
  return (
    <div className="app-shell">
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
                <div className="page-heading">
                  <p className="eyebrow">
                    {day?.replaceAll("-", ".")} ·{" "}
                    {screen === "record" ? "MY LEARNING" : "DAILY PRACTICE"}
                  </p>
                  <h1 ref={focusTarget} tabIndex={-1}>
                    {screen === "record"
                      ? "쌓여 가는 작은 실력."
                      : "오늘도, 한 걸음 더."}
                  </h1>
                  <p>
                    {screen === "record"
                      ? "해설로 배운 것도 소중한 연습이에요."
                      : "하루 10분의 연습이 내일의 자신감이 되도록."}
                  </p>
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
                {dashboard && (
                  <section
                    className="activity"
                    aria-labelledby="activity-title"
                  >
                    <div className="section-heading">
                      <h2 id="activity-title">최근 7일의 발자국</h2>
                      <span>{dashboard.weekly_days.length}일 학습했어요</span>
                    </div>
                    <TodayCompleted dashboard={dashboard} />
                    {screen === "record" && (
                      <p className="achievement-note">
                        {todaySession?.finished
                          ? (dashboard.today_completed_count ?? 0) >
                            todaySession.total
                            ? "목표를 채우고, 한 걸음 더 나아갔어요."
                            : "오늘의 목표를 채웠어요. 차곡차곡 쌓이고 있어요."
                          : (dashboard.today_completed_count ?? 0) > 0
                            ? "오늘도 한 걸음을 남겼어요."
                            : "작은 한 문제부터, 오늘의 발자국을 남겨 봐요."}
                      </p>
                    )}
                    <div className="week">
                      {week(dashboard.local_day).map((d) => (
                        <div
                          className={`day ${dashboard.weekly_days.includes(d.key) ? "practiced" : ""}`}
                          key={d.key}
                        >
                          <span>{d.label}</span>
                          <span
                            className="day-circle"
                            aria-label={`${d.key} ${dashboard.weekly_days.includes(d.key) ? "학습함" : "학습 전"}`}
                          >
                            {dashboard.weekly_days.includes(d.key) ? "✓" : "·"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="activity-bottom">
                      <p>
                        지금까지 만난 문제{" "}
                        <strong>{dashboard.learned_count}개</strong>
                      </p>
                      <span>총 {60}개 중</span>
                    </div>
                    {screen === "record" && (
                      <p className="record-note">
                        정답과 해설 학습을 모두 기록해요. 도움을 받은 문제는
                        다음날, 혼자 푼 문제는 3일 뒤 복습 후보로 돌아옵니다.
                      </p>
                    )}
                  </section>
                )}
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
