import { useEffect, useState } from "react";
import { api } from "./api";
import type { Store } from "./records";
import { learningMetrics } from "./learningMetrics";

export default function LearningQuality({ today }: { today: string }) {
  const [data, setData] = useState<Store | null>(null),
    [message, setMessage] = useState("");
  const [device, setDevice] = useState(""),
    [difficulty, setDifficulty] = useState("적당함"),
    [comment, setComment] = useState(""),
    [real, setReal] = useState(false);
  const load = () => api<Store>("/backup").then(setData);
  useEffect(() => {
    void load().catch((e) => setMessage(e.message));
  }, []);
  const m = data ? learningMetrics(data, today) : null;
  async function record(kind: string, detail: unknown) {
    try {
      await api("/observations", { kind, detail: JSON.stringify(detail) });
      await load();
      setMessage("이 기기의 관찰 기록에 저장했어요.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "저장하지 못했어요.");
    }
  }
  function download() {
    if (!m) return;
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { version: 1, generated_day: today, metrics: m },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `매일코딩-학습관찰-${today}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <details className="quality-panel">
      <summary>학습 품질과 7일 관찰</summary>
      <p>
        내 기기의 기록으로 학습 과정을 살펴봐요. 실제 사용 자료가 없는 항목은
        0건으로 표시합니다.
      </p>
      {message && <p role="status">{message}</p>}
      {m && (
        <>
          <dl className="quality-grid">
            <div>
              <dt>독립 정답</dt>
              <dd>
                {m.independent} / {m.completed}문항
              </dd>
            </div>
            <div>
              <dt>도움 후 정답</dt>
              <dd>{m.assisted}문항</dd>
            </div>
            <div>
              <dt>최종 오답 / 해설 학습</dt>
              <dd>
                {m.incorrect} / {m.revealed}문항
              </dd>
            </div>
            <div>
              <dt>힌트 후 성공</dt>
              <dd>
                {m.hint_success} / {m.hinted}문항
              </dd>
            </div>
            <div>
              <dt>지연 복습 독립 정답</dt>
              <dd>
                {m.review_independent} / {m.review}문항
              </dd>
            </div>
            <div>
              <dt>다른 유형 독립 정답</dt>
              <dd>
                {m.transfer_independent} / {m.transfer}문항
              </dd>
            </div>
            <div>
              <dt>활성 풀이 중앙값</dt>
              <dd>
                {m.median_seconds === null
                  ? "측정 자료 없음"
                  : `${m.median_seconds}초`}{" "}
                · 표본 {m.measured}개
              </dd>
            </div>
            <div>
              <dt>시간 누락 / 3분 초과</dt>
              <dd>
                {m.missing_time} / {m.over_three_minutes}문항
              </dd>
            </div>
            <div>
              <dt>과거 미완료 묶음</dt>
              <dd>{m.unfinished_past}개</dd>
            </div>
            <div>
              <dt>학습한 날짜</dt>
              <dd>{m.days.length}일</dd>
            </div>
          </dl>
          <p>
            {m.followups
              .map(
                (f) =>
                  `D${f.gap}: ${!f.eligible ? "관찰 기간 대기" : f.returned ? "재방문 기록 있음" : "재방문 기록 없음"}`,
              )
              .join(" · ")}{" "}
            · 이 기기의 개인 관찰입니다.
          </p>
          <details>
            <summary>문제별 관찰 표본</summary>
            <ul>
              {m.items.map((i) => (
                <li key={i.key}>
                  {i.title} · {i.observations}회 · 독립 {i.independent}회 · 힌트{" "}
                  {i.hints}회 · 중앙 {i.median_seconds ?? "미측정"}초
                </li>
              ))}
            </ul>
          </details>
          <button className="extra-button" onClick={download}>
            관찰 지표 내려받기
          </button>
          {!m.enrolled_at && (
            <button
              className="extra-button"
              onClick={() => void record("study_enrolled", { day: today })}
            >
              오늘부터 7일 관찰 시작
            </button>
          )}
          {m.enrolled_at && (
            <ol className="study-days">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date(m.enrolled_at!);
                const start = new Intl.DateTimeFormat("sv-SE", {
                  timeZone: "Asia/Seoul",
                }).format(d);
                const date = new Date(`${start}T12:00:00Z`);
                date.setUTCDate(date.getUTCDate() + i);
                const day = date.toISOString().slice(0, 10);
                const note = m.notes.filter((n) => n.day === day).at(-1);
                return (
                  <li key={day}>
                    {day} ·{" "}
                    {note?.real_device
                      ? `실제 기기 후기: ${note.difficulty}`
                      : "실제 기기 관찰 대기"}{" "}
                    ·{" "}
                    {m.days.includes(day) ? "풀이 기록 있음" : "풀이 기록 없음"}
                  </li>
                );
              })}
            </ol>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void record("observation_note", {
                day: today,
                device,
                difficulty,
                comment,
                real_device: real,
              });
            }}
          >
            <label>
              사용한 휴대폰·브라우저
              <input
                required
                maxLength={120}
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                placeholder="예: iPhone / Safari"
              />
            </label>
            <label>
              오늘 난이도
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option>너무 쉬움</option>
                <option>적당함</option>
                <option>너무 어려움</option>
              </select>
            </label>
            <label>
              막힌 부분·지루함·기억에 남은 점
              <textarea
                maxLength={1000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
            <label>
              <input
                type="checkbox"
                required
                checked={real}
                onChange={(e) => setReal(e.target.checked)}
              />
              실제 휴대폰에서 사용한 후기입니다.
            </label>
            <button className="extra-button">오늘 사용 후기 저장</button>
          </form>
          <ul>
            {m.limitations.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      )}
    </details>
  );
}
