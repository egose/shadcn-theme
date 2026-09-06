// Runs the Karma suite once in a headless browser and refuses to pass with
// zero executed specs. Karma's default "Executed N of M" summary is parsed so
// a broken spec glob or an empty build can never look like a green run.
import { spawn } from 'node:child_process';

const child = spawn('pnpm', ['exec', 'ng', 'test', '--watch=false', '--progress=false'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: process.env,
});

let output = '';
child.stdout.on('data', (chunk) => {
  output += chunk;
  process.stdout.write(chunk);
});
child.stderr.on('data', (chunk) => {
  output += chunk;
  process.stderr.write(chunk);
});

const exitCode = await new Promise((resolve) => child.on('close', resolve));

const executed = [...output.matchAll(/Executed (\d+) of (\d+)/g)].at(-1);
const executedCount = executed ? Number(executed[1]) : 0;

if (exitCode !== 0) {
  console.error(`test:ci failed: ng test exited with code ${exitCode}.`);
  process.exit(1);
}
if (!executed || executedCount === 0) {
  console.error('test:ci failed: karma reported zero executed specs; refusing a silent green run.');
  process.exit(1);
}
console.log(`test:ci: ${executedCount} specs executed.`);
