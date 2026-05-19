const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Track logs
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] [${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.error(`[BROWSER EXCEPTION] ${err.stack || err.message}`);
  });

  try {
    console.log('Navigating to Customer Registration Form on port 3003...');
    await page.goto('http://localhost:3003/register/customer?client_id=CLI-LD-2026-HOS-000001&token=a8c70c365fed7dc1&src=qr', { waitUntil: 'networkidle' });

    // Step 0: Personal Details
    console.log('Filling Step 0 (Personal Details)...');
    await page.waitForSelector('input[name="full_name"]');
    await page.fill('input[name="full_name"]', 'CLI Playwright Tester');
    
    // Select Gender (Male)
    await page.click('button:has-text("Male"), select, div[role="combobox"]');
    await page.click('text="Male"');
    
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="mobile"]', '9632148521');
    await page.fill('input[name="email"]', 'pwtest@healthmetro.in');
    
    await page.click('button:has-text("CONTINUE")');

    // Step 1: Address Details
    console.log('Filling Step 1 (Address Details)...');
    await page.waitForSelector('input[name="address"]');
    await page.fill('input[name="address"]', '123 Playwright Lane, Gachibowli');
    
    // Select State (Telangana)
    await page.click('button:has-text("Select state"), div[role="combobox"]');
    await page.click('text="Telangana"');
    
    // Wait for city list to load
    await page.waitForTimeout(500);
    
    // Select City (Hyderabad)
    await page.click('button:has-text("Select city"), div[role="combobox"]');
    await page.click('text="Hyderabad"');
    
    await page.fill('input[name="pin_code"]', '500032');
    
    await page.click('button:has-text("CONTINUE")');

    // Step 2: Collection Mode
    console.log('Filling Step 2 (Collection Mode)...');
    // Select 'Collected by Healthcare Provider'
    await page.click('text="Collected by Healthcare Provider"');
    
    await page.click('button:has-text("CONTINUE")');

    // Step 3: Appointment
    console.log('Filling Step 3 (Appointment)...');
    await page.waitForSelector('input[type="date"]');
    
    // Set a date 7 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateStr);
    
    // Select a Time Slot (07:00 AM – 09:00 AM)
    await page.click('button:has-text("Select preferred time"), div[role="combobox"]');
    await page.click('text="07:00 AM – 09:00 AM"');
    
    await page.click('button:has-text("CONTINUE")');

    // Step 4: Consent & Declaration
    console.log('Filling Step 4 (Declaration)...');
    await page.waitForSelector('input[name="customer_signature"]');
    
    // Check all 4 consent checkboxes
    const checkboxes = await page.$$('input[type="checkbox"]');
    console.log(`Found ${checkboxes.length} checkboxes on Step 4.`);
    for (let i = 0; i < checkboxes.length; i++) {
      console.log(`Checking checkbox ${i}...`);
      await checkboxes[i].check();
    }
    
    await page.fill('input[name="customer_signature"]', 'CLI Playwright Tester');
    
    const today = new Date().toISOString().split('T')[0];
    await page.fill('input[name="signature_date"]', today);
    
    console.log('Intercepting network requests before submitting...');
    page.on('response', async (response) => {
      if (response.url().includes('customer') && response.request().method() === 'POST') {
        console.log(`[NETWORK POST] URL: ${response.url()} | Status: ${response.status()}`);
      }
    });

    console.log('Clicking CONFIRM BOOKING...');
    await page.click('button:has-text("CONFIRM BOOKING")');
    
    // Wait for the confirmation screen or errors to show up
    console.log('Waiting for success or error screen...');
    await page.waitForTimeout(5000); // Wait 5 seconds to capture what happens
    
    const successTitle = await page.locator('text="Booking Confirmed!"').isVisible();
    if (successTitle) {
      console.log('✅ SUCCESS: Booking confirmed successfully in Playwright test!');
      await page.screenshot({ path: path.join(__dirname, 'pw_success.png') });
      console.log('Saved success screenshot to scratch/pw_success.png.');
    } else {
      console.log('❌ FAIL: Booking not confirmed after 5 seconds.');
      
      // Let's inspect errors on screen
      const pageText = await page.innerText('body');
      console.log('--- Page text content snapshot ---');
      console.log(pageText);
      console.log('----------------------------------');
      
      await page.screenshot({ path: path.join(__dirname, 'pw_error.png') });
      console.log('Saved error screenshot to scratch/pw_error.png.');
    }
  } catch (error) {
    console.error('❌ Automation Script Failed:', error);
    await page.screenshot({ path: path.join(__dirname, 'pw_error_fatal.png') });
    console.log('Saved fatal error screenshot to scratch/pw_error_fatal.png.');
  } finally {
    await browser.close();
  }
})();
