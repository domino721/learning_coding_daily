import { readFileSync } from "node:fs";
import { mergeSubmission } from "../src/recordContract.ts";
const cases = JSON.parse(readFileSync(process.argv[2], "utf8"));
console.log(
  JSON.stringify(
    cases.map((c: any) => {
      try {
        return { name: c.name, value: mergeSubmission(c.a, c.b) };
      } catch {
        return { name: c.name, error: true };
      }
    }),
  ),
);
