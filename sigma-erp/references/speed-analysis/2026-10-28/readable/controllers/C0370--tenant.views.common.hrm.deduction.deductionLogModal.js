// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:95922-95954
appModule.controller('tenant.views.common.hrm.deduction.deductionLogModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.deduction', 'options',
        function ($scope, $uibModal, $uibModalInstance, directoryService, deductionService, options) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.tripNo = options.tripNo;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            function init() {
                vm.loading = true;
                deductionService.getDeductionLogs({ id: options.deductionId }).success(function (result) {
                    vm.deductionLog = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
