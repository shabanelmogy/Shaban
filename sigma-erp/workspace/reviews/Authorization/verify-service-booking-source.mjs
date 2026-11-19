// Source parsing/import existence only. No type checking, build, tests or application execution.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const require = createRequire(root + '/package.json');
const ts = require('typescript');
const { parseTemplate } = await import(pathToFileURL(require.resolve('@angular/compiler')).href);
const scope = root + '/src/app/modules/Fleet/ServiceBookings';
const files = [];
function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(filename);
    else if (/\.(ts|html)$/.test(filename)) files.push(filename);
  }
}
const standalone = ['--billing', '--provisions', '--lease-customer-sms', '--bill-detail-retirement', '--lease-inquiry', '--lease-cost-setting', '--lease-legacy-children-retirement', '--lease-quotation', '--lease-master-agreement', '--rental-quotation']
  .some(flag => process.argv.includes(flag));
if (!standalone) collect(scope);
if (process.argv.includes('--rental-quotation')) {
  collect(root + '/src/app/modules/Rental/RentalQuotation');
  files.push(root + '/src/app/modules/Rental/MasterAgreement/services/masteragreement.service.ts');
  files.push(root + '/src/app/modules/UserGuide/content/rental-guide.ts');
}
if (process.argv.includes('--lease-master-agreement')) {
  collect(root + '/src/app/modules/Lease/LeaseMasterAgreement');
  collect(root + '/src/app/modules/Lease/LeaseAgreement/components/details');
  files.push(...['src/app/modules/Lease/LeaseAgreement/services/leaseagreement.service.ts',
    'src/app/modules/Lease/LeaseAgreement/services/leaseagreement.service.spec.ts',
    'src/app/modules/UserGuide/content/lease-guide.ts'].map(p => root + '/' + p));
}
if (process.argv.includes('--lease-quotation')) {
  collect(root + '/src/app/modules/Lease/LeaseQuotation');
  collect(root + '/src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details');
  files.push(...['src/app/modules/Lease/LeaseMasterAgreement/services/leasemasteragreement.service.ts',
    'src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/services/purchaseorder.service.ts',
    'src/app/modules/shared/components/file-link/file-link.component.ts',
    'src/app/modules/shared/components/file-link/file-link-private-image.spec.ts',
    'src/app/modules/shared/service/document-upload-tracker.service.ts',
    'src/app/modules/shared/service/document-upload-tracker.access.spec.ts',
    'src/app/modules/shared/components/mock-data/mock-data-form.component.ts',
    'src/app/modules/shared/components/mock-data/mock-data-form.component.html',
    'src/app/modules/shared/components/mock-data/mock-data-form-access.spec.ts',
    'src/app/modules/UserGuide/content/lease-guide.ts'].map(p => root + '/' + p));
}
if (process.argv.includes('--lease-legacy-children-retirement')) {
  files.push(...['src/app/pages/routing.ts', 'src/app/layout/layout.module.ts',
    'src/app/modules/UserGuide/content/record-list-topics.ts', 'src/app/modules/UserGuide/content/lease-guide.ts',
    'src/app/modules/i18n/vocabs/en.ts', 'src/app/modules/i18n/vocabs/ar.ts'].map(p => root + '/' + p));
}
if (process.argv.includes('--lease-cost-setting')) {
  collect(root + '/src/app/modules/Lease/LeaseCostSetting');
  files.push(root + '/src/app/modules/UserGuide/content/lease-guide.ts');
}
if (process.argv.includes('--lease-inquiry')) {
  collect(root + '/src/app/modules/Lease/LeaseInquiry');
  files.push(root + '/src/app/modules/UserGuide/content/lease-guide.ts');
}
if (process.argv.includes('--bill-detail-retirement')) {
  files.push(...['src/app/pages/routing.ts', 'src/app/layout/layout.module.ts',
    'src/app/modules/UserGuide/content/bills-topic.ts', 'src/app/modules/UserGuide/content/invoice-guide.ts',
    'src/app/modules/UserGuide/content/record-list-topics.ts',
    'src/app/modules/i18n/vocabs/en.ts', 'src/app/modules/i18n/vocabs/ar.ts'].map(p => root + '/' + p));
}
if (process.argv.includes('--lease-customer-sms')) {
  collect(root + '/src/app/modules/Lease/LeaseCustomerSms');
  files.push(root + '/src/app/modules/UserGuide/content/lease-guide.ts');
}
if (process.argv.includes('--billing')) {
  collect(root + '/src/app/modules/Billing/BillingInvoice');
  collect(root + '/src/app/modules/Billing/BillSettings');
  files.push(...['src/app/modules/Billing/billing-access.ts',
    'src/app/modules/UserGuide/content/billing-guide.ts',
    'src/app/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts',
    'src/app/modules/i18n/vocabs/en.ts', 'src/app/modules/i18n/vocabs/ar.ts'].map(p => root + '/' + p));
}
if (process.argv.includes('--provisions')) {
  collect(root + '/src/app/modules/Vouchers/Provisions/Provision');
  collect(root + '/src/app/modules/shared/components/document-journal');
  files.push(...['src/app/modules/UserGuide/content/provisions-topic.ts',
    'src/app/modules/UserGuide/content/invoice-guide.ts', 'src/app/modules/UserGuide/content/record-list-topics.ts',
    'src/app/modules/i18n/vocabs/provisions.ts', 'src/app/pages/routing.ts', 'src/app/layout/layout.module.ts',
    'src/app/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts'].map(p => root + '/' + p));
}
if (process.argv.includes('--corrections')) {
  collect(root + '/src/app/modules/Data Entry Corrections');
  files.push(...['src/app/modules/shared/components/file-link/file-link.component.ts',
    'src/app/modules/shared/components/file-link/file-link-private-image.spec.ts',
    'src/app/modules/shared/components/file-field/file-field.component.ts',
    'src/app/modules/shared/components/file-field/file-field.access.spec.ts',
    'src/app/modules/UserGuide/content/data-entry-corrections-guide.ts',
    'src/app/modules/i18n/vocabs/en.ts', 'src/app/modules/i18n/vocabs/ar.ts'].map(p => root + '/' + p));
}
if (process.argv.includes('--vehicles')) {
  collect(root + '/src/app/modules/Fleet/Vehicle');
  files.push(...['src/app/modules/shared/components/file-field/file-field.component.ts',
    'src/app/modules/shared/components/file-field/file-field.access.spec.ts',
    'src/app/modules/shared/components/file-link/file-link.component.ts',
    'src/app/modules/shared/components/file-link/file-link-private-image.spec.ts',
    'src/app/modules/shared/utils/editable-rows.ts', 'src/app/modules/shared/utils/editable-rows-focus.spec.ts',
    'src/app/modules/shared/service/document-upload-tracker.service.ts', 'src/app/modules/shared/service/file-upload.service.ts',
    'src/app/modules/shared/utils/focus-field.ts'].map(p => root + '/' + p));
}
if (process.argv.includes('--accidents')) {
  collect(root + '/src/app/modules/Fleet/Accidents');
  files.push(...['src/app/modules/shared/components/file-link/file-link.component.ts',
    'src/app/modules/shared/components/file-link/file-link-private-image.spec.ts',
    'src/app/modules/shared/utils/focus-field.ts', 'src/app/modules/shared/utils/focus-field-access.spec.ts',
    'src/app/modules/shared/service/file-upload.service.ts',
    'src/app/modules/i18n/vocabs/en.ts', 'src/app/modules/i18n/vocabs/ar.ts'].map(p => root + '/' + p));
}
if (process.argv.includes('--daily-service-logs')) {
  collect(root + '/src/app/modules/Fleet/DailyServiceLogs');
}
if (process.argv.includes('--workshop-required-branches')) {
  collect(root + '/src/app/modules/Workshop/Job');
  collect(root + '/src/app/modules/Workshop/LubricationJob');
  collect(root + '/src/app/modules/Workshop/JobEstimation');
  files.push(root + '/src/app/modules/UserGuide/content/workshop-guide.ts');
}
if (process.argv.includes('--service-log')) {
  collect(root + '/src/app/modules/Fleet/ServiceLog');
  collect(root + '/src/app/modules/Movements/WorkshopMovement');
  collect(root + '/src/app/modules/Fleet/Alerts');
  files.push(root + '/src/app/modules/Fleet/Alerts/models/list.ts', root + '/src/app/modules/UserGuide/content/movements-guide.ts',
    root + '/src/app/modules/Movements/logsMovement/components/view/view.component.ts',
    root + '/src/app/modules/i18n/vocabs/en.ts', root + '/src/app/modules/i18n/vocabs/ar.ts');
}
files.push(...[
  'src/app/modules/shared/authorization/route-access-policy.ts',
  'src/app/modules/shared/authorization/route-access-policy.spec.ts',
  ...(standalone ? [] : ['src/app/modules/UserGuide/content/fleet-guide.ts']),
].map(p => root + '/' + p));
const problems = [];
for (const filename of files) {
  const source = fs.readFileSync(filename, 'utf8');
  if (filename.endsWith('.html')) {
    for (const issue of parseTemplate(source, filename).errors ?? []) problems.push(String(issue));
    continue;
  }
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  for (const issue of ast.parseDiagnostics) problems.push(filename + ': ' + ts.flattenDiagnosticMessageText(issue.messageText, '\n'));
  for (const node of ast.statements) {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) continue;
    const specifier = node.moduleSpecifier.text;
    if (!specifier.startsWith('.') && !specifier.startsWith('src/')) continue;
    const base = specifier.startsWith('.') ? path.resolve(path.dirname(filename), specifier) : path.resolve(root, specifier);
    if (![base + '.ts', base + '.d.ts', path.join(base, 'index.ts')].some(p => fs.existsSync(p))) problems.push(filename + ': unresolved local import ' + specifier);
  }
}
let translationKeys;
if (process.argv.includes('--lease-inquiry') || process.argv.includes('--lease-cost-setting') || process.argv.includes('--lease-quotation') || process.argv.includes('--lease-master-agreement') || process.argv.includes('--rental-quotation')) {
  const vocabulary = process.argv.includes('--rental-quotation') ? 'rentalQuotation' : process.argv.includes('--lease-master-agreement') ? 'masterAgreement' : process.argv.includes('--lease-quotation') ? 'leaseQuotation'
    : process.argv.includes('--lease-cost-setting') ? 'leaseCostSetting' : 'leaseInquiry';
  const used = new Set();
  for (const filename of files.filter(file => !file.endsWith('.spec.ts'))) {
    for (const match of fs.readFileSync(filename, 'utf8').matchAll(new RegExp("['\"]" + vocabulary + "\\.([A-Za-z0-9_.]+)['\"]", 'g'))) used.add(match[1]);
  }
  if (vocabulary === 'leaseCostSetting') {
    // enumOptions/enumKey consume a namespace, then append each real member name.
    used.delete('rateTypes');
    const enumFile = root + '/src/app/modules/shared/enums/ChargeRateTypeEnum.ts';
    const ast = ts.createSourceFile(enumFile, fs.readFileSync(enumFile, 'utf8'), ts.ScriptTarget.Latest, true);
    for (const statement of ast.statements)
      if (ts.isEnumDeclaration(statement) && statement.name.text === 'ChargeRateTypeEnum')
        for (const member of statement.members) used.add('rateTypes.' + member.name.text);
  }
  for (const language of ['en', 'ar']) {
    const filename = root + '/src/app/modules/i18n/vocabs/' + language + '.ts';
    const ast = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
    const keys = new Set();
    function collectKeys(object, prefix = '') {
      for (const property of object.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const name = property.name.text;
        const key = prefix ? prefix + '.' + name : name;
        if (ts.isObjectLiteralExpression(property.initializer)) collectKeys(property.initializer, key);
        else keys.add(key);
      }
    }
    function visit(node) {
      if (ts.isPropertyAssignment(node) && node.name.text === vocabulary
        && ts.isObjectLiteralExpression(node.initializer)) collectKeys(node.initializer);
      ts.forEachChild(node, visit);
    }
    visit(ast);
    for (const key of used) {
      // Authored enum/dynamic label prefixes are namespaces, not literal messages.
      const prefix = key.endsWith('.') ? key : key + '.';
      if (!keys.has(key) && ![...keys].some(candidate => candidate.startsWith(prefix)))
        problems.push(language + ': missing ' + vocabulary + '.' + key);
    }
    if (keys.size === 0) problems.push(language + ': missing ' + vocabulary + ' vocabulary');
  }
  translationKeys = used.size;
}
if (process.argv.includes('--provisions')) {
  const filename = root + '/src/app/modules/i18n/vocabs/provisions.ts';
  const ast = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
  const maps = {};
  function objectKeys(object, prefix, keys) {
    for (const property of object.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const name = property.name.text;
      const key = prefix ? prefix + '.' + name : name;
      if (ts.isObjectLiteralExpression(property.initializer)) objectKeys(property.initializer, key, keys);
      else keys.add(key);
    }
  }
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!['provisionsEn', 'provisionsAr'].includes(declaration.name.text) || !declaration.initializer) continue;
      const keys = new Set();
      objectKeys(declaration.initializer, '', keys);
      maps[declaration.name.text] = keys;
    }
  }
  const used = new Set();
  for (const filename of files.filter(file => !file.endsWith('.spec.ts') && !file.endsWith('/vocabs/provisions.ts'))) {
    const source = fs.readFileSync(filename, 'utf8');
    for (const match of source.matchAll(/['"]provisionScreen\.([A-Za-z0-9_.]+)['"]/g)) used.add(match[1]);
  }
  for (const [language, keys] of Object.entries(maps)) {
    for (const key of used) if (!keys.has(key)) problems.push(language + ': missing provisionScreen.' + key);
  }
  if (Object.keys(maps).length !== 2) problems.push('Expected both provision vocabularies for the static translation check.');
  translationKeys = used.size;
}
console.log(JSON.stringify({ kind: 'source-parsing-and-local-import-existence', files: files.length, translationKeys, problems }, null, 2));
if (problems.length) process.exitCode = 1;
