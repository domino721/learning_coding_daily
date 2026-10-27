import curriculum from "./curriculum.json";

// Render tokens as text, never as HTML or executable code.
export default function CodeBlock({
  code,
  language,
  exerciseId,
}: {
  code: string;
  language?: string;
  exerciseId?: string;
}) {
  const sql = language === "SQL";
  if (sql && exerciseId && !code.includes("--")) {
    const corrected = curriculum.exercises.find(
      (item) => item.id === exerciseId,
    );
    // Supply missing inputs for the identical saved query without changing its snapshot.
    if (corrected?.domain === "SQL" && corrected.code.endsWith("\n" + code)) {
      const prefix = corrected.code.slice(0, -code.length);
      if (
        prefix
          .trim()
          .split("\n")
          .every((line) => line.startsWith("--"))
      )
        code = corrected.code;
    }
  }
  return (
    <pre className={sql ? "sql-code" : undefined}>
      <code>{highlight(code, sql)}</code>
    </pre>
  );
}

// Render tokens as text spans; shared by the line picker for per-line highlighting.
export function highlight(code: string, sql: boolean) {
  const pattern = sql
    ? /--[^\n]*|'(?:''|[^'])*'|"(?:""|[^"])*"|\b(?:SELECT|FROM|WHERE|GROUP|BY|ORDER|HAVING|AS|JOIN|LEFT|RIGHT|INNER|ON|AND|OR|NOT|NULL|IS|IN|DISTINCT|WITH|OVER|PARTITION|ASC|DESC|CASE|WHEN|THEN|ELSE|END|LIMIT|COUNT|SUM|AVG|MIN|MAX|COALESCE|ROW_NUMBER)\b|\b\d+(?:\.\d+)?\b/gi
    : /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:import|from|as|True|False|None|print|len|for|in|if|else|def|return)\b|\b\d+(?:\.\d+)?\b|\.[a-zA-Z_]\w*(?=\()/g;
  const parts = [];
  let offset = 0;
  for (const match of code.matchAll(pattern)) {
    parts.push(code.slice(offset, match.index));
    const token = match[0];
    const kind =
      token.startsWith("#") || token.startsWith("--")
        ? "comment"
        : /^["']/.test(token)
          ? "string"
          : /^\d/.test(token)
            ? "number"
            : token.startsWith(".") ||
                /^(print|len)$/i.test(token) ||
                (sql &&
                  /^(COUNT|SUM|AVG|MIN|MAX|COALESCE|ROW_NUMBER)$/i.test(token))
              ? "function"
              : "keyword";
    parts.push(
      <span className={`syntax-${kind}`} key={match.index}>
        {token}
      </span>,
    );
    offset = match.index + token.length;
  }
  parts.push(code.slice(offset));
  return parts;
}
