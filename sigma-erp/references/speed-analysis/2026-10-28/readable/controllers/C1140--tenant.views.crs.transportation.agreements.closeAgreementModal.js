// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:298984-299032
appModule.controller('tenant.views.crs.transportation.agreements.closeAgreementModal', [
         '$uibModalInstance', 'agreementId', 'abp.services.app.transAgreement',
        function ($uibModalInstance, agreementId, transAgreementService) {
            var vm = this;
            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.closeTransAgreement = function () {
                vm.saving = true;
                vm.transAgreement.endDate = moment(vm.transAgreement.endDate).endOf('day');
                transAgreementService.closeTransAgreement({ agreement: vm.transAgreement }
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                vm.loading = true;
                transAgreementService.getTransAgreement({ id: agreementId }).success(function (data) {
                    vm.transAgreement = data;
                }).finally(function () {
                    vm.loading = false;
                });

            }

            init();
        }
    ]);
