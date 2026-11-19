// Back up or restore the DSH web frontend CSS block inside app.asar.
//
// The patch script writes an exact-size replacement tail, so restoring means writing the
// original 76338 bytes back from the backup this script creates.

const fs = require('fs');

const ASAR = 'C:\\Users\\user\\AppData\\Local\\Programs\\DeepSeek Harness\\resources\\app.asar';
const DATA_START = 3392064;
const CSS_OFFSET = 60669957;
const CSS_SIZE = 76338;
const ABS_START = DATA_START + CSS_OFFSET;
const BACKUP = 'F:\\My Work\\Sigma\\reviews\\Support\\index-BPHePDI_.css.original';

const mode = process.argv[2] || 'save';

if (mode === 'save') {
  const fd = fs.openSync(ASAR, 'r');
  const buf = Buffer.alloc(CSS_SIZE);
  const read = fs.readSync(fd, buf, 0, CSS_SIZE, ABS_START);
  fs.closeSync(fd);
  if (read !== CSS_SIZE) throw new Error('short read: ' + read);
  fs.mkdirSync(require('path').dirname(BACKUP), { recursive: true });
  fs.writeFileSync(BACKUP, buf);
  console.log('saved ' + read + ' bytes -> ' + BACKUP);
  process.exit(0);
}

if (mode === 'restore') {
  const original = fs.readFileSync(BACKUP);
  if (original.length !== CSS_SIZE) throw new Error('backup size is ' + original.length + ', expected ' + CSS_SIZE);
  const fd = fs.openSync(ASAR, 'r+');
  fs.writeSync(fd, original, 0, original.length, ABS_START);
  fs.closeSync(fd);
  const verifyFd = fs.openSync(ASAR, 'r');
  const check = Buffer.alloc(CSS_SIZE);
  fs.readSync(verifyFd, check, 0, CSS_SIZE, ABS_START);
  fs.closeSync(verifyFd);
  console.log('restored=' + check.equals(original) + ' size=' + fs.statSync(ASAR).size);
  process.exit(0);
}

if (mode === 'verify') {
  const fd = fs.openSync(ASAR, 'r');
  const buf = Buffer.alloc(CSS_SIZE);
  fs.readSync(fd, buf, 0, CSS_SIZE, ABS_START);
  fs.closeSync(fd);
  const text = buf.toString('utf8');
  console.log('patched=' + text.includes('RTL readability'));
  console.log('tail=' + JSON.stringify(text.slice(-140)));
  process.exit(0);
}

throw new Error('usage: node apply-chat-rtl-backup.js [save|restore|verify]');
