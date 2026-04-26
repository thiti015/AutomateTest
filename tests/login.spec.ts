import { test, expect } from '@playwright/test';

test.describe('AGNOS AI Screening Dashboard', () => {
  
  // Test Case 1: ทดสอบ Login และตรวจสอบหน้า Dashboard
  test('should login successfully and verify dashboard elements', async ({ page }) => {
    // 1. ไปที่หน้าเว็บไซต์ 
    await page.goto('https://dev.app.agnoshealth.com/ai_dashboard/login');

    // 2. ตรวจสอบว่าหน้าเว็บโหลดสำเร็จและมีคำว่า Log-in
    await expect(page.getByText(/log-in/i)).toBeVisible();

    // 3. กรอก E-mail
    await page.locator('input[type="email"]').fill('test@gmail.com');

    // 4. กรอก Password
    await page.locator('input[type="password"]').fill('12345');

    // 5. คลิกปุ่ม Sign in
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 6. รอให้ระบบพาเปลี่ยนหน้าไปยัง Dashboard
    await page.waitForURL(/.*dashboard/i);
    
    // 7. ตรวจสอบองค์ประกอบในหน้า Dashboard 
    
    // ตรวจสอบหัวข้อหน้า (Diagnosis List)
    await expect(page.getByText('Diagnosis List').first()).toBeVisible();

    // ตรวจสอบว่ามีชื่อผู้ใช้งานแสดงใน Sidebar
    await expect(page.getByText('Guest null')).toBeVisible();

    // ตรวจสอบเมนู Log Out
    await expect(page.getByText('Log Out')).toBeVisible();

    // ตรวจสอบช่องค้นหาผู้ป่วย (Search Bar)
    const searchInput = page.getByPlaceholder('Patient name, Patient contact, Record ID, Record code');
    await expect(searchInput).toBeVisible();

    // ตรวจสอบปุ่ม Search
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();

    // ตรวจสอบแท็บสถานะต่างๆ
    await expect(page.getByText('Open', { exact: true })).toBeVisible();
    await expect(page.getByText('In progress', { exact: true })).toBeVisible();
    await expect(page.getByText('Completed', { exact: true })).toBeVisible();
  });

  // Test Case 2: ตรวจสอบการทำงานของปุ่มเปิด/ปิดตา (Show/Hide Password)
  test('should toggle password visibility', async ({ page }) => {
    await page.goto('https://dev.app.agnoshealth.com/ai_dashboard/login');
    
    // ดึง input ตัวที่ 2 ในหน้าเว็บ (index 1 คือ Password)
    const passwordInput = page.locator('input').nth(1);
    
    // กรอกรหัสผ่าน
    await passwordInput.fill('12345');
    
    // ตรวจสอบสถานะเริ่มต้นต้องเป็น type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // คลิกที่ไอคอนเปิด/ปิดตา
    const toggleIcon = page.getByRole('img', { name: 'password_visible' });
    await toggleIcon.click();
    
    // ตรวจสอบว่า type เปลี่ยนเป็น text สำเร็จ
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

});