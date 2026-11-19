// Parse templates from source; no Angular compilation, app execution or tests.
import fs from 'node:fs';
import path from 'node:path';
import { parseTemplate } from 'file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/node_modules/@angular/compiler/fesm2022/compiler.mjs';
const diagnostics = [];
let count = 0;
function inspect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) inspect(file);
    else if (file.endsWith('.html')) {
      count++;
      const result = parseTemplate(fs.readFileSync(file, 'utf8'), file);
      for (const error of result.errors || []) diagnostics.push({ file, message: error.toString() });
    }
  }
}
inspect('F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Rental');
console.log(JSON.stringify({ templatesParsed: count, diagnostics }, null, 2));
