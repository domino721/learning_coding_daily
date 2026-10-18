import type { Dashboard, Session } from "./api";
export function TodayCompleted({ dashboard }: { dashboard: Dashboard }) {
  const basic = dashboard.today_sessions
    .filter((s) => !s.batch)
    .reduce((n, s) => n + s.completed_count, 0);
  const total = dashboard.today_completed_count ?? basic;
  return (
    <div className="today-completed" role="group" aria-label="오늘 누적 학습">
      <p>
        오늘 총 <strong>{total}문제</strong> 풀었어요.
      </p>
      <span>
        전체 트랙 · 기본 {basic}문제 · 추가·이전 {total - basic}문제
      </span>
    </div>
  );
}

function week(day: string) {
  const date = new Date(`${day}T12:00:00Z`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() - 6 + i);
    return {
      key: d.toISOString().slice(0, 10),
      label: ["일", "월", "화", "수", "목", "금", "토"][d.getUTCDay()],
    };
  });
}

export default function Activity({
  dashboard,
  todaySession,
  recordMode,
  activeCount,
}: {
  dashboard: Dashboard;
  todaySession?: Session | null;
  recordMode: boolean;
  activeCount: number;
}) {
  return (
    <section className="activity" aria-labelledby="activity-title">
      <div className="section-heading">
        <h2 id="activity-title">최근 7일의 발자국</h2>
        <span>{dashboard.weekly_days.length}일 학습했어요</span>
      </div>
      <TodayCompleted dashboard={dashboard} />
      {recordMode && (
        <p className="achievement-note">
          {todaySession?.finished
            ? (dashboard.today_completed_count ?? 0) > todaySession.total
              ? "목표를 채우고, 한 걸음 더 나아갔어요."
              : "오늘의 목표를 채웠어요. 차곡차곡 쌓이고 있어요."
            : (dashboard.today_completed_count ?? 0) > 0
              ? "오늘도 한 걸음을 남겼어요."
              : "작은 한 문제부터, 오늘의 발자국을 남겨 봐요."}
        </p>
      )}
      <div className="week">
        {week(dashboard.local_day).map((d) => (
          <div
            className={`day ${dashboard.weekly_days.includes(d.key) ? "practiced" : ""}`}
            key={d.key}
          >
            <span>{d.label}</span>
            <span
              className="day-circle"
              aria-label={`${d.key} ${dashboard.weekly_days.includes(d.key) ? "학습함" : "학습 전"}`}
            >
              {dashboard.weekly_days.includes(d.key) ? "✓" : "·"}
            </span>
          </div>
        ))}
      </div>
      <div className="activity-bottom">
        <p>
          지금까지 만난 문제 <strong>{dashboard.learned_count}개</strong>
        </p>
        <span>현재 제공 {activeCount}개</span>
      </div>
      {recordMode && (
        <p className="record-note">
          정답과 해설 학습을 모두 기록해요. 도움을 받은 문제는 다음날, 혼자 푼
          문제는 3일 뒤 복습 후보로 돌아옵니다.
        </p>
      )}
    </section>
  );
}
