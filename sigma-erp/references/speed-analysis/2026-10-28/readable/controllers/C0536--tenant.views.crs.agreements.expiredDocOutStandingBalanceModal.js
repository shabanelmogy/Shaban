// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:141562-141632
appModule.controller('tenant.views.crs.agreements.expiredDocOutStandingBalanceModal', [
        '$uibModal', '$uibModalInstance', 'contactId','abp.services.app.directory',
        function ($uibModal, $uibModalInstance, contactId, directoryService) {

            var vm = this;
            vm.loading = false;
            vm.agreement = null;

            vm.getlocalDate = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD');
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.rounding = function (value) {

                return utilities.round(value, 2);
            };

            vm.getDocumentType = function (value) {
                if (value == null)
                    return "";
                if (value == 1) {
                    return app.localize('TradeLicense');
                } else if (value == 2) {
                    return app.localize('Passport');
                } else if (value == 3) {
                    return app.localize('NationalId');
                } else if (value == 4) {
                    return app.localize('DrivingLicense');
                } else if (value == 5) {
                    return app.localize('Other');
                } else if (value == 6) {
                    return app.localize('StaffDocument1');
                }else if (value == 7) {
                    return app.localize('HealthCard');
                } else if (value == 8) {
                    return app.localize('Visa');
                } else if (value == 9) {
                    return app.localize('CreditApplication');
                } else if (value == 15) {
                    return app.localize('OtherDocument2');
                } else if (value == 16) {
                    return app.localize('OtherDocument3');
                } else if (value == 17) {
                    return app.localize('OtherDocument4');
                } else {
                    return "";
                }
            }

            function init() {
                vm.loading = true;
                directoryService.getExpiredDocumentAndOutStandingBalance({ id: contactId }).success(function (result) {
                    vm.expiredDoc = result.expiredDocument;
                    vm.currentBalance = result.currentBalance;
                }).finally(function () {
                        vm.loading = false;
                });

            }

            init();
        }
    ]);
