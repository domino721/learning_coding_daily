import type { Exercise } from "./api";
import { answerText, isLayoutKind, optionNumbers } from "./answerFormat";
import CodeBlock from "./CodeBlock";
import { LinePicker } from "./StructuredAnswer";

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
  const layout = isLayoutKind(item.kind);
  const text = (value: string) => (layout ? answerText(item, value) : value);
  const correct = (value: string, index: number) =>
    item.kind === "multi"
      ? optionNumbers(item.answer ?? "").includes(index + 1)
      : value === item.answer;
  return (
    <details className="review-details">
      <summary>문제와 해설 보기</summary>
      <div className="review-content">
        <p className="prompt">{item.prompt}</p>
        {item.kind === "line" ? (
          <LinePicker
            item={item}
            value={item.last_answer ?? ""}
            onChange={() => undefined}
            disabled
            done
            readOnly
          />
        ) : (
          item.code && (
            <CodeBlock
              code={item.code}
              language={item.domain}
              exerciseId={item.id}
            />
          )
        )}
        {choice && item.kind !== "line" && (
          <ol
            className="review-choices"
            aria-label={item.kind === "order" ? "제시된 줄" : "문제 보기"}
          >
            {item.choices.map((value, index) => (
              <li key={value}>
                <code>{value}</code>
                {correct(value, index) && <span> · 정답</span>}
              </li>
            ))}
          </ol>
        )}
        {includeSubmission && (
          <p className="submitted-answer">
            마지막 제출 답{" "}
            <code>
              {item.last_answer
                ? text(item.last_answer)
                : "제출 없이 해설 확인"}
            </code>
          </p>
        )}
        <p className={`solution${layout ? " layout-answer" : ""}`}>
          정답 <code>{text(item.answer ?? "")}</code>
        </p>
        <p>{item.explanation}</p>
      </div>
    </details>
  );
}
