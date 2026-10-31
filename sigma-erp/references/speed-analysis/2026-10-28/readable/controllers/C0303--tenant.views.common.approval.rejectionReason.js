// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85043-85077
appModule.controller('tenant.views.common.approval.rejectionReason', [
        'appSession', '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.approval', 'abp.services.app.user', 'companyId', 'abp.services.app.purchaseRequest',
        function (appSession, $uibModal, $uibModalInstance, utilities, approvalAppService, userService, companyId, purchaseRequestAppService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.viewMode = null;
            vm.rejectionReason = null;

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.saveRejectionReason = function () {
                $uibModalInstance.close(vm.rejectionReason);
            }
            function init() {
                console.log(companyId);
            }

            init();
        }
    ]);
