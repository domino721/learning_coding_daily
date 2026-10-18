import { useEffect, useRef, useState } from "react";
import type { Exercise } from "./api";
import CodeBlock from "./CodeBlock";
import { formatTime, useActiveTime } from "./useActiveTime";
const labels = { new: "새 개념", review: "복습", practice: "다시 연습" };
export default function ExerciseCard({
  recommendation,
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
  recommendation?: string;
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
        {recommendation && (
          <p className="recommended-note" aria-label="이 문제를 고른 이유">
            {recommendation}
          </p>
        )}
        <p className="prompt">
          {mode === "choice"
            ? item.prompt
                .replaceAll("입력하세요", "고르세요")
                .replaceAll("구하세요", "고르세요")
            : item.prompt.replaceAll("고르세요", "입력하세요")}
        </p>
        <CodeBlock
          code={item.code}
          language={item.domain}
          exerciseId={item.id}
        />
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
