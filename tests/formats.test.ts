import test from "node:test";
import assert from "node:assert/strict";
import curriculum from "../src/curriculum.json" with { type: "json" };
import {
  answerText,
  isLayoutKind,
  validChoiceAnswer,
} from "../src/answerFormat.ts";

const layouts = curriculum.exercises.filter((ex) => isLayoutKind(ex.kind));

test("every line/order/multi answer has the shape the server also accepts", () => {
  assert.ok(layouts.length >= 3);
  assert.deepEqual(
    new Set(layouts.map((ex) => ex.kind)),
    new Set(["line", "order", "multi"]),
  );
  for (const ex of layouts) {
    assert.equal(ex.response_mode, "choice", ex.id);
    for (const value of [ex.answer, ...ex.accepted])
      assert.ok(validChoiceAnswer(ex.kind, value, ex.choices), ex.id);
  }
});

test("malformed structured answers are rejected before grading", () => {
  const choices = ["a", "b", "c"];
  for (const bad of ["", "1,", "1,1", "0,2", "4", "1, 2", "x", "2;1"])
    assert.equal(validChoiceAnswer("order", bad, choices), false, bad);
  assert.equal(validChoiceAnswer("order", "3,1,2", choices), true);
  assert.equal(validChoiceAnswer("order", "2,1", choices), true);
  assert.equal(validChoiceAnswer("multi", "3,1", choices), false);
  assert.equal(validChoiceAnswer("multi", "1,3", choices), true);
  assert.equal(validChoiceAnswer("line", "2", ["2", "3"]), true);
  assert.equal(validChoiceAnswer("line", "1", ["2", "3"]), false);
  assert.equal(validChoiceAnswer("choice", "b", choices), true);
});

test("stored answers read back as lines and options, not numbers", () => {
  const order = layouts.find((ex) => ex.kind === "order")!;
  const first = Number(order.answer.split(",")[0]);
  assert.equal(
    answerText(order, order.answer).split("\n")[0],
    order.choices[first - 1],
  );
  const line = layouts.find((ex) => ex.kind === "line")!;
  assert.match(
    answerText(line, line.answer),
    new RegExp(`^${line.answer}번 줄 · `),
  );
  const multi = layouts.find((ex) => ex.kind === "multi")!;
  assert.equal(
    answerText(multi, multi.answer).split("\n").length,
    multi.answer.split(",").length,
  );
  assert.equal(answerText({ kind: "choice", choices: [], code: "" }, "7"), "7");
});
