// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:167430-167448
appModule.controller('tenant.views.crs.banking.chequesReceivables.convertToCdcModal', [
        '$uibModalInstance', 'row',
        function ($uibModalInstance, row) {
            var vm = this;
            var cheque = row.cheque || (row.billingDetail && row.billingDetail.cheque);
            vm.chequeNo = cheque.chequeNo;
            vm.minimumDate = moment.utc(cheque.chequeDate).local().startOf('day');
            vm.date = vm.minimumDate.clone().toDate();

            vm.isDateValid = function () {
                return vm.date && moment(vm.date).startOf('day').isSameOrAfter(vm.minimumDate, 'day');
            };
            vm.save = function () {
                if (!vm.isDateValid()) return;
                $uibModalInstance.close({ date: moment(vm.date).format('YYYY-MM-DD') });
            };
            vm.cancel = function () { $uibModalInstance.dismiss(); };
        }
    ]);
