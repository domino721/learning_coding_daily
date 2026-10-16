import { useCallback, useEffect, useRef, useState } from "react";
import {
  api,
  ApiError,
  type Dashboard,
  type Exercise,
  type Session,
  type Track,
  type ResponseMode,
} from "./api";

type Screen = "home" | "lesson" | "summary" | "record";
const labels = { new: "새 개념", review: "복습", practice: "다시 연습" };

const modes: { value: ResponseMode; label: string; detail: string }[] = [
  { value: "choice", label: "객관식", detail: "보기에서 답을 골라요." },
  {
    value: "short",
    label: "단답형",
    detail: "보기 없이 결과값이나 코드를 직접 입력해요.",
  },
  {
    value: "essay",
    label: "서술형",
    detail:
      "답과 이유를 적고 해설과 비교해요. 자동 채점 없이 ‘해설로 배움’으로 기록해요.",
  },
];
function ModePicker({
  value,
  disabled,
  onChange,
}: {
  value: ResponseMode;
  disabled: boolean;
  onChange: (mode: ResponseMode) => void;
}) {
  return (
    <div className="mode-picker">
      <div className="mode-options" role="group" aria-label="풀이 모드">
        {modes.map((mode) => (
          <button
            key={mode.value}
            type="button"
            disabled={disabled}
            aria-pressed={value === mode.value}
            onClick={() => onChange(mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <p className="mode-note">
        {modes.find((mode) => mode.value === value)?.detail}
      </p>
    </div>
  );
}

function TodayCompleted({ dashboard }: { dashboard: Dashboard }) {
  const basic = dashboard.today?.completed_count ?? 0;
  const total = dashboard.today_completed_count ?? basic;
  return (
    <div className="today-completed" role="group" aria-label="오늘 누적 학습">
      <p>
        오늘 총 <strong>{total}문제</strong> 풀었어요.
      </p>
      <span>
        기본 학습 {basic}문제 · 추가 학습 {total - basic}문제
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

function useActiveTime(id: string | undefined, initial: number) {
  const elapsed = useRef(initial);
  const since = useRef<number | null>(null);
  useEffect(() => {
    elapsed.current = initial;
    since.current = document.hidden ? null : performance.now();
    const visibility = () => {
      if (since.current !== null)
        elapsed.current += (performance.now() - since.current) / 1000;
      since.current = document.hidden ? null : performance.now();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
    // Restore the persisted total only when changing questions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return () =>
    Math.min(
      86400,
      Math.floor(
        elapsed.current +
          (since.current === null
            ? 0
            : (performance.now() - since.current) / 1000),
      ),
    );
}

function ExerciseCard({
  item,
  index,
  total,
  busy,
  onAnswer,
  onMode,
  onHint,
  onReveal,
  onNext,
}: {
  item: Exercise;
  index: number;
  total: number;
  busy: boolean;
  onAnswer: (answer: string, seconds: number) => void;
  onMode: (mode: ResponseMode) => void;
  onHint: () => void;
  onReveal: () => void;
  onNext: () => void;
}) {
  const [draft, setDraft] = useState(
    item.status === "pending" ? "" : (item.last_answer ?? ""),
  );
  const mode =
    item.response_mode ?? (item.kind === "choice" ? "choice" : "short");
  const priorMode = useRef(mode);
  useEffect(() => {
    if (priorMode.current !== mode) {
      setDraft("");
      priorMode.current = mode;
    }
  }, [mode]);
  const seconds = useActiveTime(item.id, item.active_seconds);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const done = item.status !== "pending";
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
        <p className="eyebrow">
          {item.kind === "choice"
            ? "결과를 생각해 보세요"
            : "작은 빈칸을 채워 보세요"}{" "}
          <span>약 {Math.ceil(item.estimated_seconds / 60)}분</span>
        </p>
        <h1 ref={heading} tabIndex={-1} id="question-title">
          {item.title}
        </h1>
        <p className="prompt">
          {mode === "choice"
            ? item.prompt
            : item.prompt.replaceAll("고르세요", "입력하세요")}
        </p>
        <pre>
          <code>{item.code}</code>
        </pre>
        <ModePicker value={mode} disabled={busy || done} onChange={onMode} />
        {!done && (
          <p className="mode-note">
            변경하면 입력 중인 답은 초기화되고, 미완료 문제에도 적용돼요.
          </p>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy && !done && draft.trim()) onAnswer(draft, seconds());
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
          {wrong && (
            <div className="feedback retry" role="status">
              <strong>한 번 더 생각해 볼까요?</strong>
              <p>
                아직 마친 문제로 처리되지 않았어요. 다른 답을 시도하거나 힌트를
                열어 보세요.
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
              className={`feedback ${item.status === "correct" ? "success" : "reviewed"}`}
              role="status"
            >
              <span className="eyebrow">
                {item.status === "correct" ? "잘 풀었어요" : "해설로 배웠어요"}
              </span>
              <h2>
                {item.status === "correct"
                  ? "작은 한 걸음, 완료!"
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
                onClick={onReveal}
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
        서두르지 않아도 괜찮아요. 막히면 힌트로 한 걸음씩.
      </p>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [newMode, setNewMode] = useState<ResponseMode>("short");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const guard = useRef(false);
  const pendingSubmission = useRef<{
    answer: string;
    attempt_id: string;
  } | null>(null);
  const focusTarget = useRef<HTMLHeadingElement>(null);

  const refresh = useCallback(async () => {
    const [data, available] = await Promise.all([
      api<Dashboard>("/dashboard"),
      api<Track[]>("/tracks"),
    ]);
    setDashboard(data);
    setTracks(available);
    return data;
  }, []);
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
  function openSession(extra: boolean) {
    void action(async () => {
      const data = await api<Session>(
        extra ? "/sessions/extra" : "/sessions/today",
        {
          track_id: "pandas",
          response_mode: newMode,
        },
      );
      if (data.finished) await refresh();
      setSession(data);
      setIndex(
        Math.max(
          0,
          data.items.findIndex((item) => item.status === "pending"),
        ),
      );
      pendingSubmission.current = null;
      setScreen(data.finished ? "summary" : "lesson");
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
  function changeMode(mode: ResponseMode) {
    if (!session || session.items[index].response_mode === mode) return;
    void action(async () => {
      setSession(
        await api<Session>(`/sessions/${session.id}/mode`, {
          exercise_id: session.items[index].id,
          response_mode: mode,
        }),
      );
      setNewMode(mode);
      pendingSubmission.current = null;
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
  function reveal() {
    if (session)
      void action(async () => {
        setSession(
          await api<Session>(`/sessions/${session.id}/reveal`, {
            exercise_id: session.items[index].id,
          }),
        );
        pendingSubmission.current = null;
      });
  }
  function next() {
    if (!session) return;
    const pending = session.items.findIndex(
      (item) => item.status === "pending",
    );
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
          (s) => s.local_day === session.local_day && s.id !== session.id,
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
      : "추가로 5문제 풀기";
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
        <span className="header-note">작은 문제, 꾸준한 성장</span>
      </header>
      <main className={screen === "lesson" ? "lesson-main" : ""}>
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
                    {screen === "record" ? (
                      "쌓여 가는 작은 실력."
                    ) : (
                      <>
                        오늘도, 가볍게
                        <br />한 걸음 더.
                      </>
                    )}
                  </h1>
                  <p>
                    {screen === "record"
                      ? "해설로 배운 것도 소중한 연습이에요."
                      : "하루 10분의 연습이 내일의 자신감이 되도록."}
                  </p>
                </div>
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
                      <span>
                        총{" "}
                        {tracks.find((t) => t.id === "pandas")
                          ?.exercise_count ?? 10}
                        개 중
                      </span>
                    </div>
                    {screen === "record" && (
                      <p className="record-note">
                        정답과 해설 학습을 모두 기록해요. 도움을 받은 문제는
                        다음날, 혼자 푼 문제는 3일 뒤 복습 후보로 돌아옵니다.
                      </p>
                    )}
                  </section>
                )}
                {screen === "home" && (
                  <>
                    <section
                      className="daily-card"
                      aria-labelledby="daily-title"
                    >
                      <div className="daily-top">
                        <span className="pill">오늘의 루틴</span>
                        <span>01 / DATA</span>
                      </div>
                      <div className="daily-card-content">
                        <div>
                          <p className="daily-kicker">DATA ANALYSIS PRACTICE</p>
                          <h2 id="daily-title">
                            데이터를 읽는
                            <br />
                            작은 습관
                          </h2>
                          <p>
                            NumPy부터 SQL·머신러닝까지,
                            <br />
                            작은 실무 문제로 연습해요.
                          </p>
                        </div>
                        <div className="data-art" aria-hidden="true">
                          <div className="art-label">one step a day</div>
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <div className="art-check">✓</div>
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
                      <div className="new-mode">
                        <p>새 학습의 풀이 모드</p>
                        <ModePicker
                          value={newMode}
                          disabled={busy}
                          onChange={setNewMode}
                        />
                        <p className="mode-note">
                          진행 중인 학습의 모드는 문제 화면에서 바꿀 수 있어요.
                        </p>
                      </div>
                      <button
                        className="light-button"
                        disabled={busy || !dashboard}
                        onClick={start}
                      >
                        {todaySession?.finished
                          ? "오늘 학습 돌아보기"
                          : todaySession && todaySession.completed_count > 0
                            ? "이어서 학습하기"
                            : "오늘 학습 시작하기"}
                        <span aria-hidden="true">↗</span>
                      </button>
                    </section>
                    {todaySession?.finished && (
                      <div className="extra-prompt">
                        <button
                          className="extra-button"
                          disabled={busy}
                          onClick={startExtra}
                        >
                          {extraLabel} <span aria-hidden="true">→</span>
                        </button>
                        <p className="gentle-note">
                          오늘의 목표는 달성했어요. 원하면 더 연습할 수 있어요.
                        </p>
                      </div>
                    )}
                    <section
                      className="tracks-section"
                      aria-labelledby="tracks-title"
                    >
                      <div className="section-heading">
                        <h2 id="tracks-title">어떤 실력을 키워 볼까요?</h2>
                        <span>학습 트랙</span>
                      </div>
                      <div className="track-list">
                        {tracks.map((track, i) => (
                          <button
                            key={track.id}
                            disabled={!track.available || busy}
                            onClick={start}
                            className={`track-card ${track.available ? "available" : ""}`}
                          >
                            <span className="track-icon" aria-hidden="true">
                              {["▥", "⌘", "∿"][i]}
                            </span>
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
                  </>
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
                  <span>데이터 분석</span>
                </div>
                <ExerciseCard
                  key={item.id}
                  item={item}
                  index={index}
                  total={session.total}
                  busy={busy}
                  onAnswer={(value, seconds) => {
                    void answer(value, seconds);
                  }}
                  onMode={changeMode}
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
                <p className="batch-result-label">오늘 푼 전체 문제 결과</p>
                <div className="summary-stats">
                  <div>
                    <strong>{summaryCorrect}</strong>
                    <span>정답으로 마침</span>
                  </div>
                  <div>
                    <strong>{summaryItems.length - summaryCorrect}</strong>
                    <span>해설로 배움</span>
                  </div>
                </div>
                <div className="extra-prompt">
                  <button
                    className="primary"
                    disabled={busy}
                    onClick={startExtra}
                  >
                    {extraLabel} <span aria-hidden="true">→</span>
                  </button>
                  <p className="gentle-note">
                    안 푼 문제를 먼저 드리고, 모두 풀면 기존 문제로 연습해요.
                  </p>
                </div>
                <ul className="summary-list">
                  {summaryItems.map(({ exercise: ex, sessionId, batch }) => (
                    <li key={`${sessionId}:${ex.id}`}>
                      <span
                        className={
                          ex.status === "correct"
                            ? "outcome-correct"
                            : "outcome-reviewed"
                        }
                        aria-label={
                          ex.status === "correct" ? "정답" : "해설 학습"
                        }
                      >
                        {ex.status === "correct" ? "✓" : "↺"}
                      </span>
                      <span>
                        <strong>{ex.title}</strong>
                        <small>
                          {batch ? `추가 학습 ${batch}` : "기본 학습"} ·{" "}
                          {ex.domain ?? "데이터 분석"} · {ex.concept}
                        </small>
                      </span>
                      <details>
                        <summary>해설</summary>
                        {ex.response_mode === "essay" && ex.last_answer && (
                          <p className="submitted-answer">
                            <strong>내 답안</strong>
                            <br />
                            {ex.last_answer}
                          </p>
                        )}
                        <p>
                          <code>{ex.answer}</code> · {ex.explanation}
                        </p>
                      </details>
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
