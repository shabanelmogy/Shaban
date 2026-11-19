// One-time authoring helper for the source-supported in-app list guide additions.
const fs = require('fs');
const path = require('path');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts = require(path.join(root, 'node_modules/typescript'));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const parse = file => ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
function objectProperty(node, key) { return node?.properties?.find(p => p.name && (p.name.text ?? p.name.getText()) === key)?.initializer; }
function localeData(lang) {
  const sf = parse(`src/app/modules/i18n/vocabs/${lang}.ts`);
  let result;
  function walk(n) { if (ts.isVariableDeclaration(n) && n.name.getText(sf) === 'locale') result = objectProperty(n.initializer, 'data'); ts.forEachChild(n, walk); }
  walk(sf); return result;
}
const locales = { en: localeData('en'), ar: localeData('ar') };
function label(key, lang) {
  let node = locales[lang];
  for (const segment of key.split('.')) node = objectProperty(node, segment);
  return node && ts.isStringLiteralLike(node) ? node.text : key;
}
const routing = parse('src/app/pages/routing.ts');
const routes = [];
function routeWalk(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const route = objectProperty(node, 'path'), lazy = objectProperty(node, 'loadChildren');
    const match = lazy?.getText(routing).match(/modules\/([^'"]+)/);
    if (route && ts.isStringLiteralLike(route) && match) routes.push({ route: route.text, module: match[1] });
  }
  ts.forEachChild(node, routeWalk);
}
routeWalk(routing);
const manifest = JSON.parse(fs.readFileSync('F:/My Work/Sigma/reviews/MS_LIB_REMOVAL_SOURCE_MANIFEST.json', 'utf8').replace(/^\uFEFF/, ''));
const tuples = [];
for (const original of manifest.filter(file => /components[\\/]list[\\/]/.test(file))) {
  const file = original.replace(/\\/g, '/');
  const module = file.split('src/app/modules/')[1].split('/components/')[0];
  const text = read(file);
  const templateName = text.match(/templateUrl:\s*['"]([^'"]+)/)?.[1];
  const template = read(path.posix.join(path.posix.dirname(file), templateName));
  const titleKey = template.match(/\[title\]="'([^']+)'\s*\|\s*translate"/)?.[1];
  if (!titleKey) throw new Error(`Missing title key: ${file}`);
  const found = routes.find(route => route.module.toLowerCase().startsWith(module.toLowerCase() + '/'));
  const shadowed = found && routes.find(route => route.route === found.route)?.module !== found.module;
  const group = module.startsWith('Vouchers/') ? 'invoices' : module.startsWith('Administration/') ? 'administration' : module.startsWith('Billing/') ? 'billing' : module.startsWith('Customers/') ? 'customers' : module.startsWith('Fleet/') ? 'fleet' : 'lease';
  tuples.push({ group, module, titleKey: 'recordListsGuide.' + module.replace(/[^A-Za-z0-9]/g, '_'), en: label(titleKey, 'en'), ar: label(titleKey, 'ar'), route: found ? '/' + found.route : '', unavailable: !found || !!shadowed });
}
for (const lang of ['en', 'ar']) {
  const file = path.join(root, `src/app/modules/i18n/vocabs/${lang}.ts`);
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/    recordListsGuide: \{[\s\S]*?\n    \},\r?\n/, '');
  const block = '    recordListsGuide: {\n' + tuples.map(row => `      ${row.titleKey.split('.')[1]}: ${JSON.stringify(row[lang])},`).join('\n') + '\n    },\n';
  text = text.replace(/data:\s*\{\r?\n/, match => match + block);
  fs.writeFileSync(file, text);
}
const quoted = value => JSON.stringify(value);
const out = [
  "import type { GuideTopic } from '../models/user-guide.model';",
  '',
  'function recordList(titleKey: string, en: string, ar: string, route: string, unavailable = false): GuideTopic {',
  '  return {',
  '    titleKey, title: { en, ar }, route, icon: \'bi bi-table\',',
  "    ...(unavailable ? { status: 'unavailable' as const } : {}),",
  "    purpose: { en: 'Review the records returned for this list using its displayed fields.', ar: 'مراجعة السجلات التي تعيدها هذه القائمة باستخدام حقولها المعروضة.' },",
  '    steps: [',
  "      { en: 'Use Keyboard Search and the status selector, where shown, to filter the loaded rows. Use the footer to change the page or page size.', ar: 'استخدم البحث بالكتابة واختيار الحالة، عند ظهوره، لتصفية الصفوف المحمّلة. استخدم التذييل لتغيير الصفحة أو حجمها.' },",
  "      { en: 'Labelled field filters with Search request matching records from the server. Reset clears the current filters. Use a linked cell for its existing record destination and Create for the existing entry form.', ar: 'تطلب مرشحات الحقول مع زر البحث السجلات المطابقة من الخادم. يمسح إعادة الضبط المرشحات الحالية. استخدم الخلية المرتبطة لوجهة السجل الحالية وإنشاء لنموذج الإدخال الموجود.' },",
  '    ],',
  '    notes: [',
  "      { en: 'Local filtering, sorting and paging cover the rows returned by the current request; the table count is not a guarantee that all server records were loaded. Existing record validation and financial operations remain with the owning screen.', ar: 'تشمل التصفية والفرز وترقيم الصفحات محليًا الصفوف التي أعادها الطلب الحالي؛ ولا يضمن عدد الجدول تحميل كل سجلات الخادم. يظل التحقق من السجلات والعمليات المالية تابعًا للشاشة المالكة.' },",
  "      ...(unavailable ? [{ en: 'This list has no distinct reachable route in the current navigation. Use the module’s available screens; no replacement entry or accounting workflow is implied.', ar: 'لا تملك هذه القائمة مسارًا مستقلًا متاحًا في التنقل الحالي. استخدم شاشات الوحدة المتاحة؛ ولا يعني ذلك توفير إدخال بديل أو دورة محاسبية جديدة.' }] : []),",
  '    ],',
  '  };',
  '}',
  '',
  'export const RECORD_LIST_TOPICS = {',
];
for (const group of ['invoices', 'administration', 'billing', 'customers', 'fleet', 'lease']) {
  out.push(`  ${group}: [`);
  for (const row of tuples.filter(row => row.group === group)) out.push(`    recordList(${[row.titleKey, row.en, row.ar, row.route].map(quoted).join(', ')}${row.unavailable ? ', true' : ''}),`);
  out.push('  ],');
}
out.push('} satisfies Record<string, ReadonlyArray<GuideTopic>>;', '');
fs.writeFileSync(path.join(root, 'src/app/modules/UserGuide/content/record-list-topics.ts'), out.join('\n'));
for (const [guide, group] of [['invoice','invoices'],['administration','administration'],['billing','billing'],['customers','customers'],['fleet','fleet'],['lease','lease']]) {
  const file = path.join(root, `src/app/modules/UserGuide/content/${guide}-guide.ts`);
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes("import { RECORD_LIST_TOPICS }")) text = "import { RECORD_LIST_TOPICS } from './record-list-topics';\n" + text;
  if (!text.includes(`...RECORD_LIST_TOPICS.${group}`)) {
    text = text.replace(/topics:\s*([A-Z_]+),/, `topics: [...$1, ...RECORD_LIST_TOPICS.${group}],`);
    if (!text.includes(`...RECORD_LIST_TOPICS.${group}`)) text = text.replace('topics: [', `topics: [...RECORD_LIST_TOPICS.${group}, `);
  }
  fs.writeFileSync(file, text);
}
fs.writeFileSync('F:/My Work/Sigma/reviews/MS_LIB_REMOVAL_GUIDE_ROUTE_EVIDENCE.json', JSON.stringify(tuples, null, 2));
console.log(JSON.stringify({ topics: tuples.length, guides: 6, unavailable: tuples.filter(row => row.unavailable).map(row => row.module) }));
console.log(JSON.stringify({ generalIdArabic: label('general.id', 'ar') }));
