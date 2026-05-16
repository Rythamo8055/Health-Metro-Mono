const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to form...');
    await page.goto('http://localhost:3001/register/corporate', { waitUntil: 'networkidle' });

    // Step 0: Provider Info
    console.log('Filling Step 0...');
    // We wait for the inputs to appear
    await page.waitForSelector('input[name="provider_name"]');
    await page.fill('input[name="provider_name"]', 'CLI Playwright Test Hospital');
    await page.fill('input[name="registration_number"]', 'REG-CLI-PW-12345');
    await page.fill('input[name="gst_number"]', '29ABCDE1234F1Z5');
    
    // Click Continue
    await page.click('button:has-text("CONTINUE")');

    // Step 1: Location & Contact
    console.log('Filling Step 1...');
    await page.waitForSelector('input[name="address"]');
    await page.fill('input[name="address"]', '123 Test Playwright Ave');
    
    // Select state
    await page.selectOption('select[name="state_code"]', 'TN');
    // Wait for city options to populate
    await page.waitForTimeout(500);
    await page.selectOption('select[name="city"]', 'Chennai');
    
    await page.fill('input[name="pin_code"]', '600001');
    await page.fill('input[name="contact_name"]', 'Admin');
    await page.fill('input[name="designation"]', 'Manager');
    await page.fill('input[name="mobile"]', '9999999999');
    await page.fill('input[name="email"]', 'test.pw@hospital.com');
    
    await page.click('button:has-text("CONTINUE")');

    // Step 2: Documents
    console.log('Filling Step 2...');
    await page.waitForSelector('input[type="file"]');
    
    // Create dummy files for upload
    const dummyLicense = path.join(__dirname, 'dummy_license.pdf');
    const dummyId = path.join(__dirname, 'dummy_id.pdf');
    fs.writeFileSync(dummyLicense, 'dummy content license');
    fs.writeFileSync(dummyId, 'dummy content id');

    const fileInputs = await page.$$('input[type="file"]');
    await fileInputs[0].setInputFiles(dummyLicense);
    await fileInputs[1].setInputFiles(dummyId);
    
    await page.click('button:has-text("CONTINUE")');

    // Step 3: Declaration
    console.log('Filling Step 3...');
    await page.waitForSelector('input[name="confirm_accurate"]');
    
    // Check all checkboxes
    const checkboxes = await page.$$('input[type="checkbox"]');
    for (const cb of checkboxes) {
      await cb.check();
    }
    
    await page.fill('input[name="signatory_name"]', 'Authorized Signatory');
    
    const today = new Date().toISOString().split('T')[0];
    await page.fill('input[name="declaration_date"]', today);
    
    console.log('Submitting...');
    // Intercept network request to check action
    page.on('response', async (response) => {
      if (response.url().includes('register/corporate') && response.request().method() === 'POST') {
        console.log('POST Response Status:', response.status());
      }
    });

    await page.click('button:has-text("SUBMIT APPLICATION")');
    
    // Wait for success screen
    await page.waitForSelector('text="Application Submitted!"', { timeout: 10000 });
    console.log('✅ Form submitted successfully!');

    fs.unlinkSync(dummyLicense);
    fs.unlinkSync(dummyId);
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: path.join(__dirname, 'error_screenshot.png') });
    console.log('Saved error screenshot.');
  } finally {
    await browser.close();
  }
})();
