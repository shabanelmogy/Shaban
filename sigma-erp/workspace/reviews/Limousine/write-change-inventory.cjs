const fs = require('fs');
const { execFileSync } = require('child_process');
const frontend = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const backend = 'F:/My Work/Sigma/SigmaBackend';
const invoiceBackendScope = ['SiGma.Business/Services/VouchersServices/InvoiceService.cs', 'SiGma.Business/Services/VouchersServices/LimousineInvoiceService.cs', 'SiGma.Business/Services/LimousinesServices/LimousineBillingService.cs', 'SiGma.Business/IServices/ILimousineBillingService.cs', 'SiGma.Business/IServices/ILimousineInvoiceService.cs', 'SiGma.Business/MapperConfig/LimousineInvoiceProfiler.cs', 'SiGma.Helpers/Dtos/GenerateInvoiceRequest.cs', 'SiGma.Helpers/Dtos/LimousineTripDto.cs', 'SiGma.Helpers/Dtos/LimousineInvoiceTripDetailDto.cs', 'SiGma.Helpers/Dtos/LimousineTripBalance.cs', 'SiGma.Helpers/Dtos/LimousineInvoicePricing.cs', 'SiGma.Helpers/Dtos/LimousineInvoicePartDto.cs', 'SiGma.Helpers/Dtos/LimousineInvoiceGenerationRequest.cs', 'SiGma.ServerAPI/Controller/LimousineInvoiceController.cs', 'SiGma.ViewModels/ViewModels/Invoice/InvoiceUpdateVM.cs', 'SiGma.ViewModels/ViewModels/LimousineInvoice'];
const scopes = [
  [frontend, ['src/app/modules/Limousine', 'src/app/modules/i18n/vocabs/en.ts', 'src/app/modules/i18n/vocabs/ar.ts', 'src/app/_metronic/layout/layout.module.ts', 'src/app/_metronic/layout/components/toolbar/toolbar.component.ts']],
  [backend, ['SiGma.Business/MapperConfig/LimoQuotationProfiler.cs', 'SiGma.Business/MapperConfig/LocationProfiler.cs', 'SiGma.Business/MapperConfig/TripBookingProfiler.cs', 'SiGma.Business/MapperConfig/TripGridCustomizationProfiler.cs', 'SiGma.Business/MapperConfig/TripTypeProfiler.cs', 'SiGma.Business/Services/LimousinesServices/LimoQuotationService.cs', 'SiGma.Business/Services/LimousinesServices/TripBookingService.cs', 'SiGma.Business/Services/LimousinesServices/UtilizationGroupRow.cs', 'SiGma.ServerAPI/Controller/TripBookingController.cs', 'SiGma.ViewModels/ViewModels/LimoQuotation', 'SiGma.ViewModels/ViewModels/Location', 'SiGma.ViewModels/ViewModels/TripBooking', 'SiGma.ViewModels/ViewModels/TripGridCustomization', 'SiGma.ViewModels/ViewModels/TripType', 'SiGma.Helpers/Localization/Shared/GeneralMessage.resx', 'SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx']],
];
scopes[1][1].push(...invoiceBackendScope);
let output = '# Limousine source change inventory\n\n| Status | Implemented — source-only |\n|---|---|\n| Owner verification pending | yes |\n\n2026-10-07. This inventory records scoped working-tree paths, not a commit. Unrelated prior translation content in the same locale files remains preserved. Includes owner-approved partial invoices and participating trip/accounting writers. No schema/entity/EF change.\n';
for (const [repo, scope] of scopes) {
  const git = args => execFileSync('git', ['-c', 'core.safecrlf=false', '-C', repo, ...args], { encoding: 'utf8' }).trim();
  const tracked = git(['diff', '--name-status', '--', ...scope]).split('\n').filter(Boolean);
  const untracked = git(['ls-files', '--others', '--exclude-standard', '--', ...scope]).split('\n').filter(Boolean).map(file => 'A\t' + file);
  const rows = tracked.concat(untracked).map(line => { const [status, file] = line.split('\t'); return { status, file }; }).sort((a,b) => a.file.localeCompare(b.file));
  output += '\n## ' + repo + '\n\n' + rows.length + ' scoped paths. M=modified, D=deleted, A=new untracked.\n\n| Change | Absolute path |\n|---|---|\n';
  for (const row of rows) output += '| ' + row.status + ' | `' + repo + '/' + row.file + '` |\n';
  console.log(repo + ': ' + rows.length + ' scoped paths');
}
fs.writeFileSync('F:/My Work/Sigma/reviews/Limousine/FILES_CHANGED.md', output);
