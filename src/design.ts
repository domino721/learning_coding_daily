import "./design.css";
import curriculum from "./curriculum.json";
import fixtures from "../tests/fixtures/learning-paths.json";
import {
  active,
  conceptStates,
  selectExercises,
  reviewDue,
  recommendationTrace,
  taskForm,
} from "./recommendation";
import type { Session } from "./api";
import { answerText, isLayoutKind, type ItemKind } from "./answerFormat";
import type { Progress } from "./records";

const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const escape = (s: unknown) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const byId = new Map(curriculum.exercises.map((e) => [e.id, e]));
const paths = curriculum.learning_paths.items as Record<
  string,
  {
    requires: string[];
    family: string;
    role: string;
    remediation: string[];
    objective: string;
  }
>;
const concept = $<HTMLSelectElement>("concept-select"),
  exercise = $<HTMLSelectElement>("exercise-select");
$("catalog-stats").innerHTML = [
  ["활성 문항", curriculum.exercises.filter(active).length],
  ["보관 원본", curriculum.exercises.length],
  ["학습 개념", curriculum.concepts.length],
  ["트랙", curriculum.tracks.filter((t) => t.available).length],
]
  .map(([label, value]) => `<div><strong>${value}</strong>${label}</div>`)
  .join("");
$("algorithm-version").textContent = curriculum.learning_paths.version;
concept.innerHTML = curriculum.concepts
  .map(
    (c) =>
      `<option value="${escape(c.id)}">${escape(c.domain)} / ${escape(c.name)}</option>`,
  )
  .join("");

function showExercise() {
  const e = byId.get(exercise.value)!;
  const path = paths[e.id];
  const route = (id: string, seen = new Set<string>()): string => {
    if (seen.has(id)) return "";
    seen.add(id);
    const node = paths[id],
      ex = byId.get(id)!;
    return (
      (node?.requires ?? []).map((p) => route(p, seen)).join("") +
      `<div class="path-node"><span class="badge">${escape(node?.role)}</span> L${ex.level} · ${escape(ex.title)} <small>${escape(id)}</small></div>`
    );
  };
  $("exercise-detail").innerHTML =
    `<article><h3>${escape(e.title)}</h3><p><code>${escape(e.id)}</code> · v${e.version} · ${escape(e.response_mode)} · ${active(e) ? "활성 문항" : "보류 문항"}</p><p>${escape(e.prompt)}</p><pre>${escape(e.code)}</pre><details><summary>정답·힌트·해설 확인</summary><p>정답: <code>${escape(isLayoutKind(e.kind) ? answerText(e, e.answer) : e.answer)}</code></p><ol>${e.hints.map((h) => `<li>${escape(h)}</li>`).join("")}</ol><p>${escape(e.explanation)}</p><p>보기: ${e.choices.map((c) => escape(c)).join(" / ")}</p></details><h3>이 문항의 난이도 판단</h3><pre>${escape(JSON.stringify(e.difficulty, null, 2))}</pre><p>유형군: <code>${escape(path.family)}</code> · 과제 형식: <code>${escape(taskForm(e))}</code></p><p>목표: ${escape(path.objective)}</p><h3>선수에서 목표까지</h3>${route(e.id)}<p>보충 후보: ${path.remediation.map((id) => escape(byId.get(id)?.title ?? id)).join(" → ")}</p></article>`;
}
function showConcept() {
  const c = curriculum.concepts.find((c) => c.id === concept.value)!;
  const items = curriculum.exercises.filter((e) => e.concept_id === c.id);
  $("concept-detail").innerHTML =
    `<p>선수 개념: ${c.prerequisites.length ? c.prerequisites.map((id) => escape(curriculum.concepts.find((c) => c.id === id)?.name ?? id)).join(" → ") : "별도 선수 개념 없음"}</p><div class="flow">${[1, 2, 3].map((level) => `<div>단계 ${level}<br/><strong>${items.filter((e) => e.level === level && active(e)).length}개 활성</strong></div>`).join("")}</div>`;
  exercise.innerHTML = items
    .map(
      (e) =>
        `<option value="${escape(e.id)}">L${e.level} · ${escape(e.title)}${active(e) ? "" : " (보류)"}</option>`,
    )
    .join("");
  showExercise();
}
concept.addEventListener("change", showConcept);
exercise.addEventListener("change", showExercise);
showConcept();
$("rules").innerHTML = Object.entries(curriculum.learning_paths.rules)
  .map(
    ([key, value]) =>
      `<article><code>${escape(key)}</code><h3>${value}</h3></article>`,
  )
  .join("");
const presets = [
  {
    name: "처음 사용하는 학습자",
    track: "python",
    day: "2026-10-18",
    records: [],
  },
  ...fixtures,
];
const scenario = $<HTMLSelectElement>("scenario-select");
scenario.innerHTML = presets
  .map((p, i) => `<option value="${i}">${escape(p.name)}</option>`)
  .join("");
function simulate() {
  try {
    const records = JSON.parse($<HTMLTextAreaElement>("lab-records").value);
    if (!Array.isArray(records) || records.length > 500)
      throw Error("가상 이력은 배열이며 최대500개입니다.");
    const day = $<HTMLInputElement>("lab-day").value;
    const track = $<HTMLSelectElement>("lab-track").value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day))
      throw Error("학습 기준일을 선택하세요.");
    const sessions: Session[] = [],
      progress: Record<string, Progress> = {};
    for (const [i, r] of records.entries()) {
      const ex = byId.get(r.id);
      if (
        !ex ||
        !/^\d{4}-\d{2}-\d{2}$/.test(r.day) ||
        ![undefined, "correct", "incorrect", "revealed"].includes(r.status)
      )
        throw Error(`${i + 1}번째 문항 ID·날짜·상태를 확인하세요.`);
      const status = r.status ?? "correct",
        hints = r.hints ?? 0,
        attempts = r.attempts ?? 1;
      if (
        !Number.isInteger(hints) ||
        hints < 0 ||
        hints > 2 ||
        !Number.isInteger(attempts) ||
        attempts < 0
      )
        throw Error("힌트는0~2, 시도는0이상 정수입니다.");
      const item = {
        ...ex,
        kind: ex.kind as ItemKind,
        response_mode: ex.response_mode as "choice" | "short" | "essay",
        estimated_seconds: ex.seconds,
        category: "new" as const,
        status,
        hints: ex.hints.slice(0, hints),
        hints_used: hints,
        attempts_count: attempts,
        last_answer: ex.answer,
        last_correct: status === "correct",
        active_seconds: 60,
      };
      sessions.push({
        id: `lab-${i}`,
        track_id: track,
        local_day: r.day,
        timezone: "Asia/Seoul",
        batch: i,
        items: [item],
        total: 1,
        completed_count: 1,
        correct_count: status === "correct" ? 1 : 0,
        finished: true,
      });
      const prior = progress[ex.id] ?? { completed: 0, due: r.day };
      const p = reviewDue(
        r.day,
        prior,
        status === "correct" && hints === 0 && attempts === 1,
      );
      progress[ex.id] = {
        ...p,
        last_day: r.day,
        completed: prior.completed + 1,
      };
    }
    const relevant = sessions.filter((s) => s.local_day <= day),
      selected = selectExercises(sessions, progress, day, false, track),
      trace = recommendationTrace(selected, relevant),
      states = conceptStates(relevant);
    $("lab-error").textContent = "";
    $("simulation-result").innerHTML =
      `<h3>다음 묶음 · ${selected.length}문항</h3>${selected.length ? trace.items.map((item, i) => `<div class="path-node"><strong>${i + 1}. ${escape(byId.get(item.id)?.title)}</strong> <span class="badge">${selected[i][1]}</span><p>${escape(item.reason)}</p><small>${escape(item.id)} · ${escape(item.role)}</small></div>`).join("") : "<p>조건에 맞는 후보가 없습니다. 기한 전 반복으로 채우지 않습니다.</p>"}<h3>개념별 관찰</h3><div class="table-wrap"><table><thead><tr><th>개념</th><th>단계·상태</th><th>독립 문항</th><th>관찰일</th><th>유형</th><th>지연복습</th></tr></thead><tbody>${states.map((s) => `<tr><td>${escape(s.name)}</td><td>${s.level} · ${escape(s.status)}</td><td>${s.independent_count}</td><td>${s.evidence_days}</td><td>${s.family_count}</td><td>${s.retention_observed ? "확인" : "대기"}</td></tr>`).join("")}</tbody></table></div><details><summary>추천 근거 원본 JSON</summary><pre>${escape(JSON.stringify(trace, null, 2))}</pre></details><p class="note">가상 이력의 규칙 실행 결과입니다. 실제 능력이나 학습 효과를 입증하지 않습니다.</p>`;
  } catch (e) {
    $("lab-error").textContent =
      e instanceof Error ? e.message : "이력을 확인하세요.";
  }
}
function preset() {
  const p = presets[Number(scenario.value)];
  $<HTMLTextAreaElement>("lab-records").value = JSON.stringify(
    p.records,
    null,
    2,
  );
  $<HTMLInputElement>("lab-day").value = p.day;
  $<HTMLSelectElement>("lab-track").value = p.track;
  simulate();
}
scenario.addEventListener("change", preset);
$("simulate").addEventListener("click", simulate);
preset();
const files = [
  ["backend/content.py", "문제·정답·정규화"],
  ["backend/difficulty.json", "문항별 편집 난이도"],
  ["backend/learning_paths.json", "선수·유형군·운영 임계값"],
  ["curriculum/problem_bank.json", "설계 카드·검수 상태"],
  ["curriculum/reviews/2026-10-18.json", "기존60문항 항목별 검토"],
  ["src/recommendation.ts", "브라우저 관찰·추천·복습"],
  ["backend/curriculum.py", "서버의 같은 계약"],
  ["src/records.ts", "기기 기록·이전·복구·병합"],
  ["backend/accounts.py", "인증·사용자 격리"],
  ["src/sync.ts", "선택적 동기화"],
  ["src/learningMetrics.ts", "관찰 지표 정의"],
  [".github/workflows/quality.yml", "게시 전 전체 검사"],
  ["docs/SERVICE_ADR.md", "서비스 약속·책임"],
  ["docs/OBSERVATION_PROTOCOL.md", "실제7일 관찰 절차"],
];
$("source-map").innerHTML =
  `<ul>${files.map(([file, label]) => `<li><a href="https://github.com/domino721/learning_coding_daily/blob/main/${file}">${escape(file)}</a> — ${escape(label)}</li>`).join("")}</ul>`;
