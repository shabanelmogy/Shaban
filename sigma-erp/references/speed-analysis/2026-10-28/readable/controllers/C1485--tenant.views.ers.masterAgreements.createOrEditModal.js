// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:405422-405462
appModule.controller('tenant.views.ers.masterAgreements.createOrEditModal', ['$uibModalInstance', 'utilities',
        'abp.services.app.masterAgreement','options',
        function ($uibModalInstance, utilities, masterAgreementService, options) {
            var vm = this;
            vm.customers = [];

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };
           
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                if (options.quotationId) {
                    vm.quotation = options;
                    vm.masterAgreement = {
                        quotationId: options.quotationId
                    };
                }
            }

            vm.save = function () {

                vm.saving = true;
                masterAgreementService.createOrUpdateMasterAgreement({ masterAgreement: vm.masterAgreement  }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            init();

        }]);
