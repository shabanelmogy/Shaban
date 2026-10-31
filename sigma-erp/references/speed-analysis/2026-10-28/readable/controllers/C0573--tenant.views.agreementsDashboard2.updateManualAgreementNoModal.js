// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:157103-157160
appModule.controller('tenant.views.agreementsDashboard2.updateManualAgreementNoModal', [
        '$scope', 'utilities', '$uibModalInstance', '$uibModal', 'abp.services.app.commonAgreement', 'options',
        function ($scope, utilities, $uibModalInstance, $uibModal, commonAgreementService, options) {

            //  CloseAgreement Portion
            var vm = this;
            vm.agreement = {

            };
            vm.loading = false;

            vm.options = options.agreement;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };


            vm.save = function () {
                vm.saving = true;

                commonAgreementService.upgradeManualAgreementNumber({
                    id: vm.agreement.id,
                    manualAgreementNo: vm.agreement.manualAgreementNo
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
                if (vm.options) {
                    vm.agreement = vm.options;
                }
                vm.loading = false;
              
            }

            init();

        }
    ]);
