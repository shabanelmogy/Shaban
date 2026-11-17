// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:207939-208021
appModule.controller('tenant.views.crs.equipmentSales.agreements.transferVehicleModal', [
        '$scope',
        '$uibModalInstance',
        'abp.services.app.salesAgreement',
        'agreementId',
        function (
            $scope,
            $uibModalInstance,
            salesAgreementService,
            agreementId
        ) {

            var vm = this;

            vm.loading = false;

            // ---------- FORMAT HELPERS ----------
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
            vm.datePickerOptions = {
                format: vm.dateFormat
            };

            vm.transferDate = new Date(); // already correct

            vm.save = function () {

                var input = {
                    agreementId: agreementId,
                    transferDate: vm.transferDate
                };

                vm.loading = true;

                salesAgreementService.transferVehicle(input)
                    .then(function () {

                        abp.notify.success(app.localize('SavedSuccessfully'));

                        $uibModalInstance.close();

                    }).finally(function () {

                        vm.loading = false;

                    });
            };

            vm.close = function () {
                $uibModalInstance.dismiss();
            };

            function init() {

                vm.loading = true;

                salesAgreementService.getTransferVehicleData({
                    id: agreementId
                }).then(function (result) {

                    vm.agreement = result.data;

                }).finally(function () {

                    vm.loading = false;

                });
            }

            init();

        }
    ]);
