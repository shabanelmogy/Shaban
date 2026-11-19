const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const label = process.argv[2];
if (!/^(webpack|esbuild)$/.test(label)) throw new Error('Expected webpack or esbuild');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const log = path.join(__dirname, label + '.log');
const resultPath = path.join(__dirname, label + '.json');
fs.writeFileSync(log, '');
const started = Date.now();
const child = spawn(process.execPath, ['--max-old-space-size=6144', './node_modules/@angular/cli/bin/ng.js', 'serve', '--configuration=development', '--host=127.0.0.1', '--port=4301', '--open=false'], { cwd: root, windowsHide: true, env: { ...process.env, NG_CLI_ANALYTICS: 'false', FORCE_COLOR: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
let finished = false;
let recent = '';
let timer;
function finish(status, exitCode = null) {
  if (finished) return;
  finished = true;
  clearTimeout(timer);
  const result = { label, status, elapsedSeconds: (Date.now() - started) / 1000, exitCode, pid: child.pid, nodeVersion: process.version, command: child.spawnargs, log };
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n');
  if (child.pid && exitCode === null) spawnSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  process.stdout.write(JSON.stringify(result) + '\n');
}
function consume(chunk) {
  const value = chunk.toString();
  fs.appendFileSync(log, value);
  recent = (recent + value).slice(-100000);
  if (/Compiled successfully\.|Application bundle generation complete\./.test(recent)) finish('compiled');
  else if (/Failed to compile\.|Application bundle generation failed\./.test(recent)) finish('compilation-failed');
}
child.stdout.on('data', consume);
child.stderr.on('data', consume);
child.on('error', error => { fs.appendFileSync(log, error.stack + '\n'); finish('launch-failed', 1); });
child.on('exit', code => finish('exited', code));
timer = setTimeout(() => finish('timeout'), 480000);
