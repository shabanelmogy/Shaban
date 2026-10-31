// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:240924-241000
appModule.controller('tenant.views.crs.lease.masterAgreements.extendAgreements', [
        '$uibModalInstance', 'utilities', 'abp.services.app.leaseMasterAgreement', 'agreementId',
        function ($uibModalInstance, utilities, masterAgreementService, agreementId) {
            var vm = this;
            vm.customers = [];


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

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                masterAgreementService.getMasterAgreementForView({ id: agreementId })
                    .success(function (data) {
                        vm.loading = false;
                        vm.masterAgreement = data;
                        vm.masterAgreement.extendMonths = 0;

                    })
                    .error(function (error) {
                        vm.loading = false;
                    });

            }

            vm.save = function () {
                vm.saving = true;
               // vm.masterAgreement.extendDays = 0;//why? start me nullable rakhny k liye ye apka saving kka funcrtion  start apka 
                masterAgreementService.extendMasterLeaseAgreement(vm.masterAgreement)
                    .success(function (data) {
                        masterAgreementService.getMasterAgreementForView({ id: agreementId })
                            .success(function (data) {
                                vm.masterAgreement = data;
                                abp.notify.info(app.localize('SavedSuccessfully'));
                                $uibModalInstance.close();
                            })
                            .finally(function () {
                                vm.saving = false;
                            });
                    })
                    .error(function (error) {
                        vm.saving = false;
                    });
            };


            init();

        }]);
