const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function recordDemo() {
  const outputDir = path.join(__dirname, '../videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching browser to record FastTalk demo...');

  // Use local Google Chrome or default chromium
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (err) {
    console.log('Falling back to default chromium launcher...');
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({
    recordVideo: {
      dir: outputDir,
      size: { width: 1440, height: 900 }
    },
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('Navigating to FastTalk at http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Hero view (3 seconds)
  console.log('Capturing Hero and Voice Orb...');
  await page.waitForTimeout(3000);

  // 2. Click Preset Demo 1: Prod Outage Incident
  console.log('Selecting Prod Outage preset...');
  const presetBtn = page.locator('text=Prod Outage Incident').first();
  if (await presetBtn.isVisible()) {
    await presetBtn.click();
    await page.waitForTimeout(2500);
  }

  // 3. Scroll to Voice Console & Waveform
  console.log('Highlighting Voice Orb & AssemblyAI Purifier...');
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(2500);

  // 4. Scroll to Telemetry Speedometer
  console.log('Highlighting 500+ WPM Speedometer and Multiplier...');
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
  await page.waitForTimeout(3000);

  // 5. Walk through the 5 Artifact Tabs
  console.log('Cycling through Slack, Email, Jira, CLI, and Doc tabs...');

  // Email Tab
  const emailTab = page.locator('button:has-text("Executive Email")');
  if (await emailTab.isVisible()) {
    await emailTab.click();
    await page.waitForTimeout(2500);
  }

  // Jira Tab
  const jiraTab = page.locator('button:has-text("Linear / Jira")');
  if (await jiraTab.isVisible()) {
    await jiraTab.click();
    await page.waitForTimeout(2500);
  }

  // CLI Tab
  const cliTab = page.locator('button:has-text("CLI / Shell")');
  if (await cliTab.isVisible()) {
    await cliTab.click();
    await page.waitForTimeout(2500);
  }

  // Doc Tab
  const docTab = page.locator('button:has-text("Markdown Spec")');
  if (await docTab.isVisible()) {
    await docTab.click();
    await page.waitForTimeout(2500);
  }

  // Return to Slack Tab
  const slackTab = page.locator('button:has-text("Slack / Discord")');
  if (await slackTab.isVisible()) {
    await slackTab.click();
    await page.waitForTimeout(1500);
  }

  // 6. Test Non-Linear Voice Refinement Bar
  console.log('Demonstrating Voice Refinement...');
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  const quickTweak = page.locator('button:has-text("Make the email more urgent with 15m ETA")');
  if (await quickTweak.isVisible()) {
    await quickTweak.click();
    await page.waitForTimeout(3000);
  }

  // Final view
  console.log('Concluding video capture...');
  await page.waitForTimeout(2000);

  // Close context to write the video file
  await page.close();
  await context.close();
  await browser.close();

  // Find the generated video file and rename it
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latestVideo = files[files.length - 1];
    const targetPath = path.join(outputDir, 'fasttalk-demo.webm');
    fs.renameSync(path.join(outputDir, latestVideo), targetPath);
    console.log(`Demo video successfully saved at: ${targetPath}`);
    return targetPath;
  }

  return null;
}

recordDemo().then((videoPath) => {
  if (videoPath) {
    console.log('SUCCESS: Video recorded at ' + videoPath);
    process.exit(0);
  } else {
    console.error('No video file produced');
    process.exit(1);
  }
}).catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
