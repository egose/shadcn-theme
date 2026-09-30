import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { setTimeout as delay } from 'node:timers/promises';
import puppeteer from 'puppeteer';

// Reuse the installed-browser resolver, and compile only the source test fixture.
createRequire(import.meta.url)('./karma.conf.js');
const port = Number(process.env.PHONE_KEYBOARD_PORT ?? 9877);
const url = `http://localhost:${port}`;
const runner = spawn(
  'pnpm',
  [
    'exec',
    'ng',
    'test',
    'phone-input',
    '--watch=false',
    '--progress=false',
    '--karma-config=test/phone-keyboard.karma.cjs',
    '--include=**/hlm-phone-input.keyboard.spec.ts',
  ],
  { cwd: new URL('..', import.meta.url), stdio: 'inherit', detached: true },
);
const exited = new Promise((resolve) => runner.once('exit', resolve));
let browser;
let frame;
let failure;
try {
  for (let attempt = 0; ; attempt++) {
    if (runner.exitCode !== null) throw new Error(`Fixture runner exited: ${runner.exitCode}`);
    if (
      await fetch(url)
        .then((response) => response.ok)
        .catch(() => false)
    )
      break;
    if (attempt === 240) throw new Error('Timed out waiting for Karma');
    await delay(250);
  }
  browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  console.log(`Keyboard probe: ${await browser.version()}; ${process.env.CHROME_BIN}`);
  const page = await browser.newPage();
  await page.goto(url);
  for (let attempt = 0; ; attempt++) {
    for (const candidate of page.frames()) {
      if (await candidate.evaluate(() => !!window.phoneKeyboard).catch(() => false)) frame = candidate;
    }
    if (frame) break;
    if (attempt === 240) throw new Error('Timed out waiting for Angular keyboard fixture');
    await delay(250);
  }
  const reset = (options = {}) => frame.evaluate((options) => window.phoneKeyboard.reset(options), options);
  const read = (id = 'primitive') => frame.evaluate((id) => window.phoneKeyboard.read(id), id);
  // All caret/range placement uses actual keyboard navigation from Home.
  const select = async (start, end = start, id = 'primitive') => {
    await frame.click(`input#${id}`);
    await page.keyboard.press('Home');
    for (let i = 0; i < start; i++) await page.keyboard.press('ArrowRight');
    await page.keyboard.down('Shift');
    for (let i = start; i < end; i++) await page.keyboard.press('ArrowRight');
    await page.keyboard.up('Shift');
  };
  let passed = 0;
  for (const [key, positions, model, caret] of [
    ['Delete', [4, 5, 6], '415552671', 4],
    ['Backspace', [4, 5, 6], '415552671', 3],
    ['Delete', [9, 10], '415555671', 9],
    ['Backspace', [9, 10], '415552671', 8],
  ]) {
    for (const position of positions) {
      await reset();
      await select(position);
      await page.keyboard.press(key);
      const result = await read();
      console.log(`${key} at ${position}: ${JSON.stringify(result)}`);
      assert.equal(result.model, model);
      assert.deepEqual(result.selection, [caret, caret]);
      assert.deepEqual(result.changes, [model]);
      assert.equal(result.events[0].inputType, key === 'Delete' ? 'deleteContentForward' : 'deleteContentBackward');
      assert.equal(result.events[0].trusted, true);
      assert.equal(result.events[0].cancelable, true);
      passed++;
    }
  }
  for (const id of ['primitive', 'wrapper']) {
    for (const formatted of [false, true]) {
      const expectedModel = (digits, text) => (formatted ? text : digits);
      await reset({ formatted });
      await select(9, 9, id);
      await page.keyboard.press('Delete');
      let result = await read(id);
      assert.equal(result.model, expectedModel('415555671', '(415) 555-671'));
      assert.equal(result.text, '(415) 555-671');
      assert.deepEqual(result.selection, [9, 9]);
      // A second Delete must progress from the restored separator caret.
      await page.keyboard.press('Delete');
      result = await read(id);
      assert.equal(result.model, expectedModel('41555571', '(415) 555-71'));
      assert.deepEqual(result.selection, [9, 9]);
      passed++;

      for (const key of ['Delete', 'Backspace']) {
        for (const [start, end, digits, text, caret] of [
          [3, 7, '41552671', '(415) 526-71', 3],
          [4, 6, '4155552671', '(415) 555-2671', 4],
          [9, 10, '4155552671', '(415) 555-2671', 9],
          [0, 14, null, '', 0],
        ]) {
          const initial = expectedModel('4155552671', '(415) 555-2671');
          await reset({ formatted, value: initial });
          await select(start, end, id);
          await page.keyboard.press(key);
          result = await read(id);
          assert.equal(result.model, digits === null ? null : expectedModel(digits, text));
          assert.equal(result.text, text);
          assert.deepEqual(result.selection, [caret, caret]);
          assert.deepEqual(result.changes, digits === '4155552671' ? [] : [result.model]);
          passed++;
        }
      }

      await reset({ formatted });
      await select(3, 7, id);
      await page.keyboard.type('9');
      result = await read(id);
      assert.equal(result.model, expectedModel('419552671', '(419) 552-671'));
      assert.equal(result.text, '(419) 552-671');
      assert.deepEqual(result.selection, [4, 4]);
      passed++;

      // Real clipboard copy/paste, including the browser's insertFromPaste event.
      await frame.click('#clipboard');
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyA');
      await page.keyboard.press('KeyC');
      await page.keyboard.up('Control');
      await select(0, result.text.length, id);
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyV');
      await page.keyboard.up('Control');
      result = await read(id);
      assert.equal(result.model, expectedModel('1202867530', '(120) 286-7530'));
      assert.equal(result.text, '(120) 286-7530');
      assert.deepEqual(result.selection, [14, 14]);
      assert.ok(result.events.some((event) => event.inputType === 'insertFromPaste' && event.trusted));
      passed++;

      await reset({ formatted, value: null });
      await select(0, 0, id);
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Delete');
      assert.equal((await read(id)).model, null);
      await page.keyboard.type('415555267199');
      result = await read(id);
      assert.equal(result.model, expectedModel('4155552671', '(415) 555-2671'));
      assert.deepEqual(result.selection, [14, 14]);
      await select(14, 14, id);
      for (let i = 0; i < 11; i++) await page.keyboard.press('Backspace');
      result = await read(id);
      assert.equal(result.model, null);
      assert.equal(result.text, '');
      assert.deepEqual(result.selection, [0, 0]);
      await page.keyboard.press('Tab');
      assert.equal((await read(id)).touched, true);
      passed++;
    }

    for (const lock of ['readonly', 'disabled', 'formDisabled']) {
      await reset({ [lock]: true });
      await frame.click(`input#${id}`);
      await page.keyboard.press('Home');
      await page.keyboard.press('Delete');
      await page.keyboard.type('9');
      const result = await read(id);
      assert.equal(result.model, '4155552671');
      assert.equal(result.text, '(415) 555-2671');
      assert.deepEqual(result.changes, []);
      passed++;
    }
  }
  for (const [key, model, caret] of [
    ['Delete', '123567890', 3],
    ['Backspace', '124567890', 2],
  ]) {
    await reset({ custom: true, value: '1234567890' });
    await select(4);
    await page.keyboard.press(key);
    const result = await read();
    assert.equal(result.model, model);
    assert.deepEqual(result.selection, [caret, caret]);
    passed++;
  }
  console.log(`PASS: ${passed} real-keyboard scenarios`);
  await frame.evaluate(() => window.phoneKeyboard.finish());
  const code = await exited;
  assert.equal(code, 0, 'Angular fixture suite must pass');
} catch (error) {
  failure = error;
  console.error(error);
  if (frame) await frame.evaluate((message) => window.phoneKeyboard?.finish(message), String(error)).catch(() => {});
} finally {
  if (runner.exitCode === null) {
    try {
      process.kill(-runner.pid, 'SIGTERM');
    } catch {
      /* Already exited. */
    }
    await exited;
  }
  await browser?.close();
}
if (failure) process.exitCode = 1;
