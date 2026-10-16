import { useCallback, useEffect, useRef, useState } from "react";

export function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function useActiveTime(id: string, initial: number, running: boolean) {
  const elapsed = useRef(initial);
  const since = useRef<number | null>(null);
  const [seconds, setSeconds] = useState(initial);
  const readSeconds = useCallback(
    () =>
      Math.min(
        86400,
        Math.floor(
          elapsed.current +
            (since.current === null
              ? 0
              : (performance.now() - since.current) / 1000),
        ),
      ),
    [],
  );

  useEffect(() => {
    elapsed.current = initial;
    setSeconds(initial);
    // A response to a retry/hint must not reset the current question's clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const pause = () => {
      if (since.current !== null)
        elapsed.current += (performance.now() - since.current) / 1000;
      since.current = null;
    };
    const visibility = () => {
      pause();
      if (running && !document.hidden) since.current = performance.now();
      setSeconds(readSeconds());
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const interval = running
      ? window.setInterval(() => setSeconds(readSeconds()), 250)
      : undefined;
    return () => {
      pause();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [id, running, readSeconds]);

  return { seconds, readSeconds };
}
