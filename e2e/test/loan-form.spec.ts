import { test, expect } from "@playwright/test";

test("กรอกแบบฟอร์ม loan และตรวจสอบ dialog ผลลัพธ์", async ({ page }) => {
  await page.goto("http://localhost:30080/loan");


  await page.getByLabel("Full Name").fill("สมชาย ใจดี");


  await page.getByLabel("📞 Phone Number").fill("0891234567");


  await page.getByLabel("Monthly Income").fill("30000");


  await page.getByLabel("Loan Amount").fill("100000");


  await page.getByLabel("Loan Purpose").click(); 
  await page.getByRole("option", { name: "Home" }).click(); 


  await page.getByLabel("Age").fill("35");


  await page.getByLabel("Email").fill("somchai@example.com");


  await page.getByRole("button", { name: /submit/i }).click();

 
  const dialog = page.locator("mat-dialog-container");


  await expect(dialog).toContainText(/eligible|not eligible/i);
});


test("ฟอร์มไม่สมบูรณ์ต้องแสดง error", async ({ page }) => {
  await page.goto("http://localhost:30080/loan");
  
  // ไม่กรอกอะไรเลย แล้ว submit
  await page.getByRole("button", { name: /submit/i }).click();

  const errors = page.locator('mat-error');
  const count = await errors.count();

  expect(count).toBeGreaterThan(0); 
});

test("ฟอร์มไม่สมบูรณ์ ต้องแสดง error หลายจุด", async ({ page }) => {
  await page.goto("http://localhost:30080/loan");
  await page.getByRole("button", { name: /submit/i }).click();

  const errors = page.locator("mat-error");
  const count = await errors.count();
  expect(count).toBeGreaterThan(0);

  // Optional: พิมพ์ข้อความ error ทั้งหมด
  for (let i = 0; i < count; i++) {
    console.log(await errors.nth(i).textContent());
  }
});

test("เบอร์มือถือไม่ครบ 10 หลัก ควรแสดง error", async ({ page }) => {
  await page.goto("http://localhost:30080/loan");

  await page.getByLabel("📞 Phone Number").fill("08123"); // สั้นเกินไป
  await page.getByRole("button", { name: /submit/i }).click();

  const error = page.locator("mat-error", { hasText: "10 digits" });
  await expect(error).toBeVisible();
});

test("Loan Amount มากเกิน 12 เท่ารายได้ ต้องขึ้น dialog ว่าไม่ผ่าน", async ({ page }) => {
  await page.goto("http://localhost:30080/loan");

  await page.getByLabel("Full Name").fill("สมชาย ใจดี");
  await page.getByLabel("📞 Phone Number").fill("0891234567");
  await page.getByLabel("Monthly Income").fill("10000");
  await page.getByLabel("Loan Amount").fill("150000"); // มากกว่า 120000
  await page.getByLabel("Loan Purpose").click();
  await page.getByRole("option", { name: /home/i }).click();
  await page.getByLabel("Age").fill("35");
  await page.getByLabel("Email").fill("somchai@example.com");

  await page.getByRole("button", { name: /submit/i }).click();

  const dialog = page.locator("mat-dialog-container");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Loan amount cannot exceed 12 months of income");
});

