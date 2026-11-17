// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:288247-288277
appModule.controller('tenant.views.crs.reports.vehicleRentalDetailsReport.sendReportByEmail', [
        '$scope', '$filter', '$uibModal', '$uibModalInstance', 'abp.services.app.documentsEmail', 'html',
        function ($scope, $filter, $uibModal, $uibModalInstance, documentsEmail, html) {

            var vm = this;
            vm.info = {
                html
            }


            vm.cancel = () => {
                $uibModalInstance.dismiss();
            };

            vm.send = () => {
                debugger;
                vm.sendingEmail = true;
                documentsEmail.sendVehicleRentalDetailsReportEmail(vm.info)
                    .success(() => { })
                    .finally(() => {
                        vm.sendingEmail = false;
                        $uibModalInstance.dismiss();
                    });
            }

            function init() {
            }

            init();
        }
    ]);
