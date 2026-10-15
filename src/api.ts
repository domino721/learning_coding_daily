import { browserApi } from "./browserApi";
import { ApiError } from "./errors";
export { ApiError } from "./errors";
export type Track = {
  id: string;
  name: string;
  description: string;
  available: boolean;
  exercise_count: number;
};
export type Exercise = {
  domain?: string;
  level?: number;
  id: string;
  version: number;
  concept: string;
  kind: "choice" | "blank";
  title: string;
  prompt: string;
  code: string;
  choices: string[];
  estimated_seconds: number;
  category: "new" | "review" | "practice";
  status: "pending" | "correct" | "revealed";
  hints: string[];
  hints_used: number;
  attempts_count: number;
  last_answer: string | null;
  last_correct: boolean | null;
  active_seconds: number;
  answer?: string;
  explanation?: string;
};
export type Session = {
  batch?: number;
  id: string;
  track_id: string;
  local_day: string;
  timezone: string;
  items: Exercise[];
  completed_count: number;
  correct_count: number;
  total: number;
  finished: boolean;
};
export type Dashboard = {
  storage_mode?: "server" | "device";
  local_day: string;
  timezone: string;
  learned_count: number;
  weekly_days: string[];
  today: Session | null;
  extra?: Session | null;
  today_completed_count?: number;
};
export async function api<T>(path: string, body?: unknown): Promise<T> {
  if (import.meta.env.MODE === "web") return browserApi<T>(path, body);
  let response: Response;
  try {
    response = await fetch(
      `/api${path}`,
      body === undefined
        ? undefined
        : {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          },
    );
  } catch {
    throw new ApiError(
      "연결하지 못했어요. 인터넷 연결과 서버 상태를 확인하고 다시 시도해 주세요.",
      0,
    );
  }
  const result = await response.json().catch(() => null);
  if (!response.ok)
    throw new ApiError(
      typeof result?.detail === "string"
        ? result.detail
        : "처리하지 못했어요. 잠시 후 다시 시도해 주세요.",
      response.status,
    );
  return result as T;
}
