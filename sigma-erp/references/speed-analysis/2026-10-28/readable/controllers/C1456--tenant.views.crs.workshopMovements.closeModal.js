// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:398308-398470
appModule.controller('tenant.views.crs.workshopMovements.closeModal', ['workshopMovementId', '$uibModalInstance', 'abp.services.app.workshopMovement', 'abp.services.app.commonLookup', 'abp.services.app.directory', '$uibModal', 'abp.services.app.job', 'utilities',
        function (workshopMovementId, $uibModalInstance, workshopMovementService, commonLookupService, directoryService, $uibModal, jobService, utilities) {

            var vm = this;

            vm.isVehicleRepairHistoryInCrsEnabled = abp.features.isEnabled("CRS.CustomFeatures.LinkCrsToWorkShop.VehicleRepairHistoryInCRSBasedOnJobs");
            vm.locationDetailsInMovements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LocationDetailsInMovements"));

            vm.loading = false;
            vm.movementOut = null;
            vm.locations = [];
            vm.drivers = [];
            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.workshopMovementTypes = [
                { id: 1, name: 'Maintenance' }, { id: 2, name: 'Repair' }, { id: 3, name: 'Accident Repair' }, { id: 10, name: 'Inspection' }, { id: 14, name: 'Breakdown' }
            ];

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
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.searchDriverPopoup = function () {
                var modalInstance = openSearchContactModel(null, 1);
                modalInstance.result.then(function (driver) {
                    if (driver != null) {
                        vm.workshopMovement.inDetail_Driver = driver;
                    }
                });
            };

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }

            vm.searchDriver = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function saveMovement() {
                vm.saving = true;
                if (moment.utc(vm.workshopMovement.outDetail.dateTime) > moment(vm.workshopMovement.inDetail.dateTime)) {
                    vm.saving = false;
                    abp.message.info(app.localize("In Date can not less than Out Date"));
                    return;
                }
                if (vm.workshopMovement.outDetail.km > vm.workshopMovement.inDetail.km) {
                    vm.saving = false;
                    abp.message.info(app.localize("In Km can not less than Out Km"));
                    return;
                }

                workshopMovementService.closeWorkshopMovement({
                    workshopMovement: vm.workshopMovement,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }


            vm.save = function () {
                utilities.confirmKmPopUp(vm.workshopMovement.outDetail.km, vm.workshopMovement.inDetail.km, saveMovement);
            };


            vm.openJobViewModel = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/viewModal.cshtml',
                    controller: 'tenant.views.workshop.jobs.viewModalRental as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        jobId: function () {
                            return id;
                        }
                    }
                });
            };

            function getJobsForRentalTenant() {
                vm.loading = true;
                jobService.getJobsForRentalTenant({
                    vehicleId: vm.workshopMovement.vehicleId,
                    status : 2 //closed jobs
                }).success(function (result) {
                    if (result)
                        vm.jobsOnMovement = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                getLocations();
                allFuelLevels();
                vm.loading = true;
                workshopMovementService.getWorkshopMovementForEdit({ id: workshopMovementId }
                ).success(function (result) {
                    vm.workshopMovement = result;
                    getJobsForRentalTenant();
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
