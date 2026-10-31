// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:317503-317612
appModule.controller('tenant.views.crs.vehicles.snagReport.createOrEditModal', [
        '$uibModal', '$uibModalInstance', 'snagReportId', 'isViewModal', 'abp.services.app.snagReport', 'abp.services.app.vehicle',
        function ($uibModal,$uibModalInstance, snagReportId, isViewModal, snagReportService, vehicleService) {

            var vm = this;
            vm.isViewModal = isViewModal;

            vm.saving = false;
            vm.snagReport = null;
            vm.isEditMod = false;



            vm.snagStatuses = [
                {
                    id: 1, name: app.localize("New")
                },
                {
                    id: 2, name: app.localize("In-Progress")
                },
                {
                    id: 3, name: app.localize("Closed")
                },

            ];


            vm.getStatuses = function (status) {
                if (status == 1)
                    return app.localize("New");
                if (status == 2)
                    return app.localize("In-Progress");
                if (status == 3)
                    return app.localize("Closed");
                return '';
            };


            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: {
                        }
                    }

                });

                modalInstance.result.then(function (result) {
                    if (result !== null) {
                        vm.snagReport.vehicle = result;
                    }
                });
            }

            vm.save = function () {

                vm.saving = true;
                snagReportService.createOrUpdateSnagReport({
                    snagReport: vm.snagReport
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            function init() {

                snagReportService.getSnagReportForEdit({
                    id: snagReportId
                }).success(function (result) {
                    vm.snagReport = result;

                    if (!vm.snagReport.status) {
                        vm.snagReport.status = 1;   // Default "New" for create case
                    }
                    if (vm.snagReport.vehicleId) {
                        vehicleService.getVehicleForSelect({ id: vm.snagReport.vehicleId }).success(function (vehicleResult) {
                            vm.snagReport.vehicle = vehicleResult;
                            vm.vehicles = [vehicleResult];
                        });
                    }
                });

            }

            init();
        }
    ]);
