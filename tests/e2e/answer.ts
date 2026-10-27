import type { Page } from "@playwright/test";

type Answerable = {
  kind: string;
  answer: string;
  choices: string[];
  response_mode: string;
};

// Enter an authored answer through the controls a learner uses for each kind.
export async function enterAnswer(
  page: Page,
  ex: Answerable,
  value = ex.answer,
) {
  const picked = value.split(",").map(Number);
  if (ex.kind === "line")
    return page
      .getByRole("radio", { name: new RegExp(`^${value}번 줄`) })
      .check();
  if (ex.kind === "order") {
    for (const n of picked)
      await page
        .getByRole("button", {
          name: `추가: ${ex.choices[n - 1]}`,
          exact: true,
        })
        .click();
    return;
  }
  if (ex.kind === "multi") {
    for (const n of picked)
      await page.getByLabel(ex.choices[n - 1], { exact: true }).check();
    return;
  }
  if (ex.response_mode === "choice")
    return page.getByLabel(value, { exact: true }).check();
  return page.getByRole("textbox").fill(value);
}
