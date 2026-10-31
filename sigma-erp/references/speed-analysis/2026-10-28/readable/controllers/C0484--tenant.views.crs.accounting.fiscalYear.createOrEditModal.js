// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:123089-123144
appModule.controller('tenant.views.crs.accounting.fiscalYear.createOrEditModal', ['$uibModal', '$uibModalInstance', 'abp.services.app.fiscalYear', 'fiscalYearId',
    function ($uibModal, $uibModalInstance, fiscalYearService, fiscalYearId) {
        var vm = this;
        vm.localize = function (input) {
            if (input == null)
                return "";
            return app.localize(input);
        };
        vm.save = function () {
            vm.saving = true;
            //var fiscalDate = new Date(vm.fiscalYear.startDate);
            //var fiscalEndDate = new Date(vm.fiscalYear.endDate);
            //fiscalDate.setHours(0);
            //fiscalDate.setMinutes(0);
            //fiscalDate.setSeconds(0);
            //fiscalDate.setMilliseconds(0);
            //vm.fiscalYear.startDate = fiscalDate;
            //fiscalEndDate.setHours(23);
            //fiscalEndDate.setMinutes(59);
            //fiscalEndDate.setSeconds(59);
            //fiscalEndDate.setMilliseconds(999);
            //vm.fiscalYear.endDate = fiscalEndDate;
            //.utc()
            //vm.fiscalYear.startDate = moment(moment(vm.fiscalYear.startDate).startOf('Day').format('YYYY-MM-DD'));
            //.utc()
           // vm.fiscalYear.endDate = moment(moment(vm.fiscalYear.endDate).format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds');
            vm.fiscalYear.startDate = moment(vm.fiscalYear.startDate).startOf('day');
            vm.fiscalYear.endDate = moment(vm.fiscalYear.endDate).endOf('day');

            fiscalYearService.createOrUpdateFiscalYear({
                fiscalYear: vm.fiscalYear,
            }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function init() {
            vm.loading = true;
            fiscalYearService.getFiscalYearForEdit({
                id: fiscalYearId
            }).success(function (result) {
                vm.fiscalYear = result;
            }).finally(function () {
                vm.loading = false;
            });
        }
        init();

    }]);
