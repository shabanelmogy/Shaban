import { CanDeactivateFn, Routes } from '@angular/router';

import { PayrollProcessComponent } from '../PayrollProcess/components/process/payroll-process.component';

const preventUnsavedLeaveSalaryExit: CanDeactivateFn<PayrollProcessComponent> = component =>
  component.canDeactivate();

export const LeaveSalaryPayrollProcess_Routes: Routes = [
  {
    path: '',
    component: PayrollProcessComponent,
    data: { payrollType: 'LeaveSalary' },
    canDeactivate: [preventUnsavedLeaveSalaryExit],
  },
];
