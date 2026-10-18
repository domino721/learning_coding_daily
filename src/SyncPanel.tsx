import { useEffect, useState } from "react";
import {
  connection,
  remember,
  requestServer,
  serverURL,
  synchronize,
  syncStatus,
} from "./sync";

export function SyncAgent() {
  useEffect(() => {
    if (import.meta.env.MODE !== "web") return;
    let timer: number | undefined;
    const schedule = () => {
      if (!connection()) return;
      clearTimeout(timer);
      timer = window.setTimeout(() => void synchronize().catch(() => {}), 2000);
    };
    window.addEventListener("learning-record-saved", schedule);
    window.addEventListener("online", schedule);
    schedule();
    return () => {
      clearTimeout(timer);
      window.removeEventListener("learning-record-saved", schedule);
      window.removeEventListener("online", schedule);
    };
  }, []);
  return null;
}
export default function SyncPanel({
  refresh,
}: {
  refresh: () => Promise<unknown>;
}) {
  const [url, setURL] = useState(() => connection()?.url ?? ""),
    [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [code, setCode] = useState(""),
    [message, setMessage] = useState(syncStatus),
    [connected, setConnected] = useState(!!connection()),
    [busy, setBusy] = useState(false),
    [consent, setConsent] = useState(false),
    [recovery, setRecovery] = useState("");
  useEffect(() => {
    const update = () => {
      setMessage(syncStatus);
      setConnected(!!connection());
    };
    window.addEventListener("learning-sync-status", update);
    return () => window.removeEventListener("learning-sync-status", update);
  }, []);
  if (import.meta.env.MODE !== "web") return null;
  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "연결하지 못했어요.");
    } finally {
      setBusy(false);
    }
  }
  async function connect(mode: string) {
    if (!consent) throw Error("이 서버에 기록을 전송하는 데 동의해 주세요.");
    const target = serverURL(url);
    const data = await requestServer(target, `/auth/${mode}`, {
      username,
      password,
      ...(mode === "recover" ? { recovery_code: code } : {}),
    });
    remember({ ...data, url: target });
    setPassword("");
    if (data.recovery_code) setRecovery(data.recovery_code);
    await synchronize();
    await refresh();
    setMessage(
      data.recovery_code
        ? `복구 코드를 안전한 곳에 보관해 주세요. 다시 표시하지 않습니다: ${data.recovery_code}`
        : syncStatus,
    );
  }
  return (
    <details className="quality-panel">
      <summary>선택한 서버에 계정 연결·동기화</summary>
      <p>
        계정을 연결하기 전에는 학습 기록을 외부로 보내지 않습니다. 연결 후
        답안·문제 원본·활동 로그·사용 후기가 지정 서버의 본인 계정으로
        전송됩니다. 탭을 닫으면 다시 로그인해야 할 수 있어요.
      </p>
      <p role="status">{message}</p>
      {recovery && (
        <p>
          복구 코드를 기기 밖의 안전한 곳에 보관하세요: <code>{recovery}</code>
        </p>
      )}
      {!connected ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(() => connect("login"));
          }}
        >
          <label>
            계정 서버 주소
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setURL(e.target.value)}
              placeholder="https://your-server.example"
            />
          </label>
          <label>
            아이디
            <input
              required
              minLength={3}
              maxLength={40}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            비밀번호 (12자 이상)
            <input
              type="password"
              required
              minLength={12}
              maxLength={128}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            지정한 서버에 본인의 기록을 전송하고 합치는 데 동의합니다.
          </label>
          <button disabled={busy} className="extra-button">
            로그인하고 동기화
          </button>
          <button
            disabled={busy}
            type="button"
            className="extra-button"
            onClick={() => void run(() => connect("register"))}
          >
            계정 만들고 연결
          </button>
          <details>
            <summary>복구 코드로 비밀번호 변경</summary>
            <label>
              복구 코드
              <input value={code} onChange={(e) => setCode(e.target.value)} />
            </label>
            <p>위 비밀번호 칸에 새 비밀번호를 입력하세요.</p>
            <button
              type="button"
              disabled={busy}
              className="extra-button"
              onClick={() => void run(() => connect("recover"))}
            >
              계정 복구
            </button>
          </details>
        </form>
      ) : (
        <>
          <p>연결 서버: {connection()?.url}</p>
          <button
            disabled={busy}
            className="extra-button"
            onClick={() =>
              void run(async () => {
                await synchronize();
                await refresh();
              })
            }
          >
            지금 동기화
          </button>
          <button
            disabled={busy}
            className="extra-button"
            onClick={() =>
              void run(async () => {
                const c = connection()!;
                try {
                  await requestServer(c.url, "/auth/logout", {}, c.token);
                } finally {
                  remember(null);
                  setMessage("기기 기록은 유지하고 계정 연결을 해제했어요.");
                }
              })
            }
          >
            로그아웃
          </button>
          <details>
            <summary>서버 계정과 기록 삭제</summary>
            <p>
              서버의 계정과 기록을 삭제합니다. 기기 기록·기존 백업 파일은 별도로
              남습니다.
            </p>
            <label>
              비밀번호 확인
              <input
                type="password"
                minLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              disabled={busy || password.length < 12}
              className="extra-button"
              onClick={() =>
                void run(async () => {
                  const c = connection()!;
                  await requestServer(
                    c.url,
                    "/auth/delete",
                    { password },
                    c.token,
                  );
                  remember(null);
                  setPassword("");
                  setMessage(
                    "서버 계정을 삭제했습니다. 이미 내려받은 백업은 별도로 삭제해 주세요.",
                  );
                })
              }
            >
              서버 계정 삭제
            </button>
          </details>
        </>
      )}
    </details>
  );
}
