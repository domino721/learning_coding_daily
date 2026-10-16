import { useEffect, useState } from "react";
import { api, type Dashboard, type Session } from "./api";
import {
  createBackup,
  parseBackup,
  type Backup,
  type LearningEvent,
  type Store,
} from "./records";

type History = { sessions: Session[]; events: LearningEvent[] };
export function Lifetime({ dashboard }: { dashboard: Dashboard }) {
  return (
    <section className="lifetime-card" aria-label="누적 학습">
      <p>지금까지 쌓은 연습</p>
      <strong>
        {dashboard.all_time_completed_count ?? 0}
        <span>문제 풀이</span>
      </strong>
      <p>오늘의 목표가 새로 시작해도 누적 기록은 이어져요.</p>
    </section>
  );
}
export function LearningRecord({
  dashboard,
  refresh,
}: {
  dashboard: Dashboard | null;
  refresh: () => Promise<unknown>;
}) {
  const [history, setHistory] = useState<History | null>(null),
    [message, setMessage] = useState(""),
    [working, setWorking] = useState(false),
    [candidate, setCandidate] = useState<Backup | null>(null),
    [owner, setOwner] = useState(false),
    [recover, setRecover] = useState(false),
    [visible, setVisible] = useState(20);
  const load = () => api<History>("/history").then(setHistory);
  useEffect(() => {
    void load().catch((e) => setMessage(e.message));
  }, []);
  const foreign =
    !!candidate &&
    !!dashboard?.learner_id &&
    candidate.data.learner_id !== dashboard.learner_id;
  async function exportFile() {
    setWorking(true);
    setMessage("");
    try {
      const data = await api<Store>("/backup"),
        backup = await createBackup(data);
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(backup, null, 2)], {
          type: "application/json",
        }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `매일코딩-${data.learner_id?.slice(0, 8) ?? "기록"}-${new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date())}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(
        "백업 파일 다운로드를 요청했어요. 파일을 안전한 곳에 보관해 주세요.",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "백업하지 못했어요.");
    } finally {
      setWorking(false);
    }
  }
  async function importFile() {
    if (!candidate) return;
    setWorking(true);
    setMessage("");
    try {
      await api("/restore", {
        data: candidate.data,
        confirm_owner: owner,
        recover_unreadable: recover,
      });
      setCandidate(null);
      await refresh();
      await load();
      setMessage("가져온 기록을 아래 날짜별 목록에서 확인해 주세요.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "복구하지 못했어요.");
    } finally {
      setWorking(false);
    }
  }
  return (
    <section className="records-panel" aria-labelledby="records-title">
      <h2 id="records-title">내 학습 기록과 백업</h2>
      {dashboard?.storage_notice && (
        <p className="storage-notice" role="status">
          {dashboard.storage_notice}
        </p>
      )}
      <p className="record-note">
        {dashboard?.storage_mode === "device"
          ? "이 브라우저에 자동 저장하고 복구본도 보관해요. 사이트 데이터 삭제·기기 분실에 대비해 백업 파일도 보관해 주세요."
          : "이 서버에 저장해요. 서버를 바꾸거나 이전할 때 사용할 백업 파일을 보관할 수 있어요."}
      </p>
      <div className="backup-actions">
        <button
          type="button"
          className="extra-button"
          onClick={() => void exportFile()}
          disabled={working || !dashboard}
        >
          백업 파일 내려받기
        </button>
        <label className="backup-upload">
          백업 파일 가져오기
          <input
            type="file"
            accept=".json,application/json"
            disabled={working}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setCandidate(null);
              setMessage("");
              setOwner(false);
              try {
                if (file.size > 10 * 1024 * 1024)
                  throw Error("백업 파일은 10MB까지 가져올 수 있어요.");
                setCandidate(await parseBackup(await file.text()));
              } catch (e) {
                setMessage(
                  e instanceof Error ? e.message : "파일을 확인해 주세요.",
                );
              }
            }}
          />
        </label>
      </div>
      <p className="mode-note">
        학습 ID {dashboard?.learner_id?.slice(0, 8) ?? "확인 중"} · 계정
        동기화는 아직 제공하지 않아요. 다른 기기로 옮길 때는 본인의 백업 파일을
        사용해 주세요.
      </p>
      {candidate && (
        <div
          className="import-preview"
          role="group"
          aria-label="백업 복구 확인"
        >
          <h3>가져올 기록 확인</h3>
          <p>
            {candidate.data.sessions.length}개 학습 묶음 ·{" "}
            {candidate.data.sessions.reduce((n, s) => n + s.completed_count, 0)}
            문제 풀이 · {candidate.data.events?.length ?? 0}개 로그
          </p>
          <p>
            학습 ID {candidate.data.learner_id?.slice(0, 8) ?? "이전 버전"}.
            기존 기록과 합치며 같은 ID는 중복 계산하지 않아요.
          </p>
          {foreign && (
            <label>
              <input
                type="checkbox"
                checked={owner}
                onChange={(e) => setOwner(e.target.checked)}
              />
              다른 학습 ID지만 본인의 기록이 맞아요.
            </label>
          )}
          {!dashboard && (
            <label>
              <input
                type="checkbox"
                checked={recover}
                onChange={(e) => setRecover(e.target.checked)}
              />
              읽지 못한 저장본은 보관하고 이 백업으로 복구할게요.
            </label>
          )}
          <button
            type="button"
            className="primary"
            disabled={
              working || (foreign && !owner) || (!dashboard && !recover)
            }
            onClick={() => void importFile()}
          >
            확인한 기록 합치기
          </button>
          <button
            type="button"
            className="text-button"
            disabled={working}
            onClick={() => setCandidate(null)}
          >
            취소
          </button>
        </div>
      )}
      {message && (
        <p className="record-message" role="status">
          {message}
        </p>
      )}
      {dashboard?.concepts && (
        <details className="curriculum-view">
          <summary>개념별 학습 경로</summary>
          <p>
            처음에는 기초를 확인하고, 다른 문제를 여러 날 혼자 풀면 적용·전이
            문제를 늘려요. 힌트·재시도·서술형 해설 비교는 독립 정답 근거로 세지
            않아요.
          </p>
          <div className="concept-grid">
            {dashboard.concepts.map((c) => (
              <article key={c.id}>
                <strong>
                  {c.domain} · {c.name}
                </strong>
                <p>
                  {c.label} · {c.status}
                </p>
                <small>
                  다른 문제 {c.independent_count}개 · {c.evidence_days}일의 독립
                  풀이
                </small>
              </article>
            ))}
          </div>
        </details>
      )}
      <h3>날짜별 전체 풀이</h3>
      {!history?.sessions.some((s) => s.completed_count > 0) && (
        <p>
          아직 완료한 문제가 없어요. 이전 기록이 보이지 않으면 백업 복구를 먼저
          확인해 주세요.
        </p>
      )}
      {history?.sessions
        .filter((s) => s.completed_count > 0)
        .slice(0, visible)
        .map((s) => (
          <details className="history-session" key={s.id}>
            <summary>
              {s.local_day} · {s.batch ? `추가 학습 ${s.batch}` : "기본 학습"} ·{" "}
              {s.completed_count}문제
            </summary>
            <ul>
              {s.items
                .filter((i) => i.status !== "pending")
                .map((i) => (
                  <li key={i.id}>
                    <strong>{i.title}</strong>
                    <span>
                      {i.status === "correct" ? "정답으로 마침" : "해설로 배움"}{" "}
                      · {i.attempts_count}회 제출 · 힌트 {i.hints_used}개
                    </span>
                    {i.last_answer && (
                      <p className="submitted-answer">
                        내 답안: {i.last_answer}
                      </p>
                    )}
                    <p>
                      정답: <code>{i.answer}</code>
                    </p>
                    <p>{i.explanation}</p>
                  </li>
                ))}
            </ul>
          </details>
        ))}
      {history &&
        history.sessions.filter((s) => s.completed_count > 0).length >
          visible && (
          <button
            type="button"
            className="text-button"
            onClick={() => setVisible((v) => v + 20)}
          >
            이전 기록 더 보기
          </button>
        )}
      {history && (
        <details className="event-view">
          <summary>학습 활동 로그 {history.events.length}개</summary>
          <p>
            이전 버전에서 복원한 기록은 정확한 시각이 없을 수 있어요. 로그와
            답안은 외부로 자동 전송하지 않아요.
          </p>
          <ol>
            {history.events.slice(0, 100).map((e) => (
              <li key={e.id}>
                <time>
                  {e.occurred_at
                    ? new Date(e.occurred_at).toLocaleString("ko-KR", {
                        timeZone: "Asia/Seoul",
                      })
                    : "이전 기록 · 시각 미상"}
                </time>
                <span>
                  {(
                    {
                      session_started: "학습 시작",
                      attempt: "답안 제출",
                      hint: "힌트 확인",
                      reveal: "해설 확인",
                      completed: "문제 완료",
                      imported: "백업 가져오기",
                    } as Record<string, string>
                  )[e.kind] ?? e.kind}
                  {e.exercise_id ? ` · ${e.exercise_id}` : ""}
                </span>
              </li>
            ))}
          </ol>
          {history.events.length > 100 && (
            <p>최근 100개를 표시해요. 전체 로그는 백업 파일에 포함돼요.</p>
          )}
        </details>
      )}
    </section>
  );
}
