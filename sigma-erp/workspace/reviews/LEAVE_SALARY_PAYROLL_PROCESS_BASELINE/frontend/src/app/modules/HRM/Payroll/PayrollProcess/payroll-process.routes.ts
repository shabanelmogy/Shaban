import { CanDeactivateFn, Routes } from '@angular/router';
import { PayrollProcessComponent } from './components/process/payroll-process.component';

const preventUnsavedPayrollExit: CanDeactivateFn<PayrollProcessComponent> = component =>
  component.canDeactivate();

export const PayrollProcess_Routes: Routes = [
  { path: '', component: PayrollProcessComponent, canDeactivate: [preventUnsavedPayrollExit] },
];
