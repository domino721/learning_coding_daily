import type { Exercise } from "./api";
import { optionNumbers } from "./answerFormat";
import { highlight } from "./CodeBlock";

type Props = {
  item: Exercise;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  done: boolean;
};

// Code shown line by line; only the authored candidate lines can be chosen.
export function LinePicker({
  item,
  value,
  onChange,
  disabled,
  done,
  readOnly = false,
}: Props & { readOnly?: boolean }) {
  const sql = item.domain === "SQL";
  const candidates = new Set(item.choices);
  return (
    <fieldset className="line-picker" disabled={disabled || readOnly}>
      <legend className="sr-only">줄 선택</legend>
      <div className={`code-lines ${sql ? "sql-code" : ""}`}>
        {item.code.split("\n").map((line, i) => {
          const no = String(i + 1);
          const state = `${value === no ? " selected" : ""}${done && item.answer === no ? " answer" : ""}`;
          const body = (
            <>
              <span className="line-no" aria-hidden="true">
                {no}
              </span>
              <code>{highlight(line, sql)}</code>
            </>
          );
          if (!candidates.has(no) || readOnly)
            return (
              <div
                key={no}
                className={`code-line${candidates.has(no) ? " candidate" : ""}${state}`}
              >
                {body}
              </div>
            );
          return (
            <label key={no} className={`code-line candidate${state}`}>
              <input
                type="radio"
                name={`line-${item.id}`}
                value={no}
                checked={value === no}
                onChange={() => onChange(no)}
                aria-label={`${no}번 줄: ${line.trim()}`}
              />
              {body}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Tap a remaining line to append it; tap a placed line to send it back.
export function OrderBuilder({ item, value, onChange, disabled }: Props) {
  const sql = item.domain === "SQL";
  const placed = optionNumbers(value);
  const remaining = item.choices
    .map((_, i) => i + 1)
    .filter((n) => !placed.includes(n));
  const set = (next: number[]) => onChange(next.join(","));
  return (
    <div className="order-builder">
      <p className="order-label" id={`placed-${item.id}`}>
        배치한 순서
      </p>
      <ol className="order-placed" aria-labelledby={`placed-${item.id}`}>
        {placed.length === 0 && (
          <li className="order-empty">
            아래 줄을 눌러 위에서부터 쌓아 보세요.
          </li>
        )}
        {placed.map((n, position) => (
          <li key={n}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => set(placed.filter((x) => x !== n))}
              aria-label={`${position + 1}번째에서 빼기: ${item.choices[n - 1]}`}
            >
              <span className="order-position" aria-hidden="true">
                {position + 1}
              </span>
              <code>{highlight(item.choices[n - 1] ?? "", sql)}</code>
              <span className="order-remove" aria-hidden="true">
                ✕
              </span>
            </button>
          </li>
        ))}
      </ol>
      {remaining.length > 0 && (
        <>
          <p className="order-label" id={`pool-${item.id}`}>
            남은 줄
          </p>
          <ul className="order-pool" aria-labelledby={`pool-${item.id}`}>
            {remaining.map((n) => (
              <li key={n}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => set([...placed, n])}
                  aria-label={`추가: ${item.choices[n - 1]}`}
                >
                  <code>{highlight(item.choices[n - 1], sql)}</code>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function MultiPicker({ item, value, onChange, disabled, done }: Props) {
  const picked = new Set(optionNumbers(value));
  const correct = new Set(optionNumbers(item.answer ?? ""));
  const toggle = (n: number) => {
    const next = new Set(picked);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    onChange([...next].sort((a, b) => a - b).join(","));
  };
  return (
    <fieldset disabled={disabled} className="choices multi">
      <legend className="sr-only">해당하는 답 모두 선택</legend>
      {item.choices.map((choice, i) => (
        <label
          key={choice}
          className={`choice ${picked.has(i + 1) ? "selected" : ""} ${done && correct.has(i + 1) ? "answer" : ""}`}
        >
          <input
            aria-label={choice}
            type="checkbox"
            checked={picked.has(i + 1)}
            onChange={() => toggle(i + 1)}
          />
          <span className="choice-letter">{i + 1}</span>
          <code>{choice}</code>
          <span className="check-mark" aria-hidden="true" />
        </label>
      ))}
    </fieldset>
  );
}
