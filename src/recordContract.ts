import type { Submission } from "./records";

// Immutable submission identity is shared with backend/record_contract.py.
// Optional metadata is merged separately; JSON property order has no meaning.
export function sameSubmission(a: Submission, b: Submission): boolean {
  return ["session", "exercise", "answer", "correct"].every(
    (key) => a[key as keyof Submission] === b[key as keyof Submission],
  );
}

export function mergeSubmission(a: Submission, b: Submission): Submission {
  if (!sameSubmission(a, b)) throw Error("Conflicting submission");
  const mode = a.response_mode ?? b.response_mode;
  if (a.response_mode && b.response_mode && a.response_mode !== b.response_mode)
    throw Error("Conflicting response mode");
  return {
    ...b,
    ...a,
    ...(mode ? { response_mode: mode } : {}),
    ...(a.created_at || b.created_at
      ? { created_at: a.created_at || b.created_at }
      : {}),
    hints_used: Math.max(a.hints_used ?? 0, b.hints_used ?? 0),
    active_seconds: Math.max(a.active_seconds ?? 0, b.active_seconds ?? 0),
  };
}
