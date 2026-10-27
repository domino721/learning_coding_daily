// Line, order and multi items keep response_mode "choice"; only the answer shape differs.
// Order/multi answers are 1-based option numbers ("3,1,2"), never code to run.
// Mirrored by valid_choice_answer in backend/content.py.
export type ItemKind = "choice" | "blank" | "line" | "order" | "multi";

export function isLayoutKind(kind: string | undefined) {
  return kind === "line" || kind === "order" || kind === "multi";
}

export function optionNumbers(value: string): number[] {
  return /^\d+(,\d+)*$/.test(value) ? value.split(",").map(Number) : [];
}

export function validChoiceAnswer(
  kind: string,
  answer: string,
  choices: string[],
): boolean {
  if (kind !== "order" && kind !== "multi") return choices.includes(answer);
  const picked = optionNumbers(answer);
  return (
    picked.length > 0 &&
    picked.every((n) => n >= 1 && n <= choices.length) &&
    new Set(picked).size === picked.length &&
    (kind === "order" || picked.every((n, i) => i === 0 || picked[i - 1] < n))
  );
}

// Readable form of a stored answer for feedback, review and history screens.
export function answerText(
  item: { kind: string; choices: string[]; code: string },
  value: string,
): string {
  if (item.kind === "line") {
    const line = item.code.split("\n")[Number(value) - 1];
    return line === undefined ? value : `${value}번 줄 · ${line.trim()}`;
  }
  if (item.kind !== "order" && item.kind !== "multi") return value;
  const picked = optionNumbers(value);
  if (!picked.length) return value;
  return picked.map((n) => item.choices[n - 1] ?? "?").join("\n");
}
