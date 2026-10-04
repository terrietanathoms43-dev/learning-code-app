import { expect, test } from "@playwright/test";

const testEmail = process.env.E2E_TEST_EMAIL || "";
const testPassword = process.env.E2E_TEST_PASSWORD || "";
const hasAuthCredentials = Boolean(testEmail && testPassword);

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
}

test("mobile public learning flow stays usable", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /learn to code|coding/i }).first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Start Python" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start Web" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("link", { name: "Start Web" }).click();
  await expect(page).toHaveURL(/\/learn\/web$/);
  await expect(page.getByRole("heading", { name: "Pixel Garden" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.goto("/login?next=/projects");
  await expect(page.getByRole("heading", { name: /learner account|continue learning/i })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test.describe("authenticated learner flow", () => {
  test.skip(
    !hasAuthCredentials,
    "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run authenticated production checks.",
  );

  test("sign in, build a Web App project, export it, and sign out", async ({
    page,
  }) => {
    const uniqueTitle = `E2E Web App ${Date.now()}`;

    await page.goto("/login?next=/projects");
    await page
      .getByRole("button", { name: "Already have an account? Sign in" })
      .click();

    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/projects$/);
    await expect(
      page.getByRole("heading", { name: "Your coding workspace." }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByTitle("Create project").click();
    await page.getByRole("menuitem", { name: /Web App/ }).click();

    const title = page.getByLabel("Project title");
    await expect(title).toBeVisible();
    await title.fill(uniqueTitle);
    await title.press("Control+s");
    await expect(page.getByText("Saved", { exact: true })).toBeVisible();

    await page.getByRole("tab", { name: /HTML/ }).click();
    await page
      .getByLabel("index.html code")
      .fill('<main><h1 id="e2e-heading">E2E Web App</h1><button id="e2e-button">Change text</button></main>');

    await page.getByRole("tab", { name: /CSS/ }).click();
    await page
      .getByLabel("styles.css code")
      .fill("body { font-family: sans-serif; } h1 { color: rgb(24, 32, 59); }");

    await page.getByRole("tab", { name: /JavaScript/ }).click();
    await page
      .getByLabel("script.js code")
      .fill(
        'document.querySelector("#e2e-button")?.addEventListener("click", () => { document.querySelector("#e2e-heading").textContent = "JavaScript works"; });',
      );

    await page.getByLabel("script.js code").press("Control+s");
    await expect(page.getByText("Saved", { exact: true })).toBeVisible();

    const preview = page.frameLocator('iframe[title$="preview"]');
    await expect(preview.getByRole("heading", { name: "E2E Web App" })).toBeVisible();
    await preview.getByRole("button", { name: "Change text" }).click();
    await expect(preview.getByRole("heading", { name: "JavaScript works" })).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.html$/);

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(
      page.getByRole("button", { name: new RegExp(uniqueTitle) }),
    ).toHaveCount(0);

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: /learner profile/i })).toBeVisible();
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
