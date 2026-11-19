const fs = require('fs');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Rental';
const file = process.argv[2];
const old = fs.readFileSync(`${root}/${file}`, 'utf8').replace(/\r\n/g, '\n');
let value = old;
if (file.endsWith('.html') && file.includes('components/details/')) {
  for (const field of ['discount', 'taxPercent', 'advance', 'deposit']) {
    const re = new RegExp(`(formControlName="${field}"[^]*?)(<\\/div>)`);
    value = value.replace(re, (match, body, close) => body.includes('app-field-error') ? match : `${body}<app-field-error [control]="form.controls.${field}" />${close}`);
  }
  value = value.replace(/<div class="agreement-(delivery|collection)-charge-field">/g, '<div class="sigma-field">');
  value = value.replace(/<div class="agreement-(delivery|collection)-charge-details">/g, '<div class="sigma-editor-grid">');
  value = value.replace(/<small class="agreement-delivery-charge-error">{{ countriesError\(\) \| translate }}<\/small>/g, '<app-state-message kind="error" [message]="countriesError()" />');
  value = value.replace(/<div class="agreement-alert"><i[^]*?{{ 'rentalAgreement.charges.loading' \| translate }}<\/div>/g, '<app-state-message kind="loading" message="rentalAgreement.charges.loading" />');
  value = value.replace(/<div class="booking-alert"><i[^]*?{{ 'rentalBooking.charges.loading' \| translate }}<\/div>/g, '<app-state-message kind="loading" message="rentalBooking.charges.loading" />');
  value = value.replace('class="agreement-status-badge"', 'class="sigma-status-badge"');
  value = value.replace('class="booking-status-badge status-{{ booking()?.status }}"', 'class="sigma-status-badge"');
  value = value.replace(/<span class="booking-charge-rate">({{ control.controls.rate.value[^]*?<\/small>)<\/span>/, '<span class="app-editable-collection-table__value app-editable-collection-table__value--highlight">$1</span>');
  for (const field of ['allowedPerDay', 'excessRate']) value = value.replace(new RegExp(`<strong>({{ control.controls.${field}.value[^]*?<\\/small>)<\\/strong>`, 'g'), '<span class="app-editable-collection-table__value app-editable-collection-table__value--highlight">$1</span>');
  value = value.replace(/(formControlName="excess"[^]*?\/>)<small>/g, '$1<app-field-error [control]="control.controls.excess" /><small>');
  value = value.replace(/(formControlName="deliveryDateAndTime"[^]*?<\/p-calendar>)/g, '$1<app-field-error [control]="control.controls.deliveryDateAndTime" />');
  if (file.startsWith('Agreement/')) value = value.replace(/(formControlName="rate"[^]*?\/>)/, '$1<app-field-error [control]="control.controls.rate" />');
  value = value.replace(/\s*@if \(booking\(\)\) \{  \}/g, '');
  value = value.replace(/^[ \t]+$/gm, '');
}
if (file === 'Agreement/components/deposit/deposit.component.html') {
  value = value.replace('class="rental-agreement-deposit__document-content"', 'class="rental-agreement-deposit__document-content sigma-field"');
  value = value.replace('class="rental-agreement-deposit__static-label"', 'class="sigma-field__label"');
}
console.log(JSON.stringify({ path: `${root}/${file}`, old, value }));
