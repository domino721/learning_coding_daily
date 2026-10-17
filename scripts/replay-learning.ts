import fs from "node:fs";
import curriculum from "../src/curriculum.json" with { type: "json" };
import {
  conceptStates,
  selectExercises,
  reviewDue,
  recommendationTrace,
} from "../src/recommendation.ts";
import type { Session, Exercise } from "../src/api.ts";
import type { Progress } from "../src/records.ts";

const cases = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const results = cases.map(
  (sample: {
    name: string;
    track: string;
    day: string;
    records: {
      id: string;
      day: string;
      status?: Exercise["status"];
      hints?: number;
      attempts?: number;
      version?: number;
    }[];
  }) => {
    const progress: Record<string, Progress> = {};
    const sessions: Session[] = sample.records.map((record, index) => {
      const ex = curriculum.exercises.find((item) => item.id === record.id)!;
      const status = record.status ?? "correct";
      const item = {
        ...ex,
        status,
        version: record.version ?? ex.version,
        response_mode: ex.response_mode as Exercise["response_mode"],
        kind: ex.kind as Exercise["kind"],
        category: "new" as const,
        hints: [],
        hints_used: record.hints ?? 0,
        attempts_count: record.attempts ?? 1,
        last_answer: null,
        last_correct: status === "correct",
        active_seconds: 0,
        estimated_seconds: ex.seconds,
      };
      const independent =
        status === "correct" && !item.hints_used && item.attempts_count === 1;
      progress[ex.id] = {
        ...reviewDue(record.day, progress[ex.id] ?? {}, independent),
        completed: 1,
        last_day: record.day,
      };
      return {
        id: `s-${index}`,
        track_id: sample.track,
        local_day: record.day,
        timezone: "Asia/Seoul",
        batch: index,
        items: [item],
        total: 1,
        completed_count: 1,
        correct_count: status === "correct" ? 1 : 0,
        finished: true,
      };
    });
    const selected = selectExercises(
      sessions,
      progress,
      sample.day,
      false,
      sample.track,
    );
    return {
      name: sample.name,
      states: conceptStates(sessions),
      selected: selected.map(([ex, category]) => [ex.id, category]),
      trace: recommendationTrace(selected, sessions),
    };
  },
);
process.stdout.write(JSON.stringify(results));
