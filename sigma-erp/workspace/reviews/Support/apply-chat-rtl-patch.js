// Apply an exact-size RTL stylesheet patch to the DSH web frontend CSS inside app.asar.
//
// Why exact size: the CSS sits at a fixed offset inside app.asar and every later file has a
// recorded offset. Rewriting the tail of the block with an identical byte count keeps every
// offset valid, so the archive stays consistent and no repack is needed.
//
// The appended block always reserves the same byte count and is space-padded, which makes the
// change reversible: patched and original states are told apart by the marker comment.

const fs = require('fs');

const ASAR = 'C:\\Users\\user\\AppData\\Local\\Programs\\DeepSeek Harness\\resources\\app.asar';
const DATA_START = 3392064; // 8-byte pickle prefix + declared header length
const CSS_OFFSET = 60669957; // the CSS file's offset as recorded in the asar index
const CSS_SIZE = 76338;
const BLOCK_SIZE = 1200; // bytes reserved for the appended stylesheet
const MARKER = 'RTL readability patch';
const ANCHOR = 'code,pre,[data-diff],[data-read],[data-search],[data-terminal]{text-autospace:no-autospace}';

const RULES = [
  '/* --- ' + MARKER + ' for Arabic chat content (user-applied) --- */',
  // A text run that starts with Arabic renders as an RTL paragraph, while Latin lines,
  // code and paths keep reading left-to-right.
  '[class*="_bubble"],[class*="_userRow"],[class*="_userStack"]{unicode-bidi:plaintext}',
  // Arabic-first lines read from the right edge; Latin-first lines stay left.
  '[class*="_bubble"],[class*="_userStack"]{text-align:start}',
  '[class*="_bubble"],[class*="_userStack"],[class*="_prose"]{overflow-wrap:anywhere}',
  // Fenced code, diffs and terminal output always read left-to-right.
  'code,pre,[data-diff],[data-read],[data-search],[data-terminal]{direction:ltr}',
  // List markers follow their list's own direction.
  'ol,ul{unicode-bidi:plaintext}'
];

function buildBlock() {
  const body = ['@media (min-width:0px){', ...RULES.map((rule) => rule + '\n'), '}'].join('\n');
  if (body.replace(/\/\*[\s\S]*?\*\//g, '').includes('/*')) {
    throw new Error('patch must not contain a comment opener outside its own comment');
  }
  const size = Buffer.byteLength(body, 'utf8');
  if (size > BLOCK_SIZE) throw new Error('patch block is too large: ' + size + ' > ' + BLOCK_SIZE);
  const padded = body + ' '.repeat(BLOCK_SIZE - size);
  if (Buffer.byteLength(padded, 'utf8') !== BLOCK_SIZE) throw new Error('block size mismatch');
  return padded;
}

// Locate the anchor by reading a window that ends at the CSS file's declared end.
function locateAnchor(fd) {
  const cssEnd = DATA_START + CSS_OFFSET + CSS_SIZE;
  const windowSize = 4096;
  const buf = Buffer.alloc(windowSize);
  const read = fs.readSync(fd, buf, 0, windowSize, cssEnd - windowSize);
  const text = buf.slice(0, read).toString('utf8');
  const index = text.lastIndexOf(ANCHOR);
  if (index === -1) throw new Error('anchor rule not found in the CSS tail; refusing to write');
  const absolute = cssEnd - windowSize + Buffer.byteLength(text.slice(0, index), 'utf8');
  const probe = Buffer.alloc(ANCHOR.length);
  fs.readSync(fd, probe, 0, probe.length, absolute);
  if (probe.toString('utf8') !== ANCHOR) throw new Error('anchor verification failed; refusing to write');
  return absolute;
}

const block = buildBlock();
const fd = fs.openSync(ASAR, 'r+');
const anchorAt = locateAnchor(fd);

const head = Buffer.alloc(ANCHOR.length + 320);
fs.readSync(fd, head, 0, head.length, anchorAt);
const headText = head.toString('utf8');
const already = headText.includes(MARKER);
const atAnchor = headText.slice(0, ANCHOR.length) === ANCHOR;

if (process.argv.includes('--check')) {
  fs.closeSync(fd);
  console.log('anchorAt=' + anchorAt);
  console.log('anchorIntact=' + atAnchor);
  console.log('state=' + (already ? 'patched' : 'original'));
  process.exit(0);
}

if (!atAnchor) {
  fs.closeSync(fd);
  throw new Error('anchor bytes are not the expected rule; refusing to write');
}

const sizeBefore = fs.statSync(ASAR).size;
if (already) {
  fs.closeSync(fd);
  console.log('already patched; archive untouched (size=' + sizeBefore + ')');
  process.exit(0);
}

const payload = Buffer.from(ANCHOR + block, 'utf8');
if (payload.length !== ANCHOR.length + BLOCK_SIZE) throw new Error('unexpected patched length');
fs.writeSync(fd, payload, 0, payload.length, anchorAt);
fs.closeSync(fd);

const verifyFd = fs.openSync(ASAR, 'r');
const written = Buffer.alloc(payload.length);
fs.readSync(verifyFd, written, 0, written.length, anchorAt);
fs.closeSync(verifyFd);

const writtenText = written.toString('utf8');
const sizeAfter = fs.statSync(ASAR).size;
console.log('markerWritten=' + writtenText.includes(MARKER));
console.log('anchorIntact=' + (writtenText.slice(0, ANCHOR.length) === ANCHOR));
console.log('sizeBefore=' + sizeBefore + ' sizeAfter=' + sizeAfter + ' unchanged=' + (sizeBefore === sizeAfter));
