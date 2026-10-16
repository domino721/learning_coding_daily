import type { Exercise } from "./api";
import CodeBlock from "./CodeBlock";

export default function ExerciseReview({
  item,
  includeSubmission = true,
}: {
  item: Exercise;
  includeSubmission?: boolean;
}) {
  const choice =
    (item.response_mode ?? (item.kind === "choice" ? "choice" : "short")) ===
    "choice";
  return (
    <details className="review-details">
      <summary>문제와 해설 보기</summary>
      <div className="review-content">
        <p className="prompt">{item.prompt}</p>
        <CodeBlock code={item.code} language={item.domain} />
        {choice && (
          <ol className="review-choices" aria-label="문제 보기">
            {item.choices.map((value) => (
              <li key={value}>
                <code>{value}</code>
                {value === item.answer && <span> · 정답</span>}
              </li>
            ))}
          </ol>
        )}
        {includeSubmission && (
          <p className="submitted-answer">
            마지막 제출 답{" "}
            <code>{item.last_answer ?? "제출 없이 해설 확인"}</code>
          </p>
        )}
        <p className="solution">
          정답 <code>{item.answer}</code>
        </p>
        <p>{item.explanation}</p>
      </div>
    </details>
  );
}
