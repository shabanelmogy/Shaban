// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:432376-432712
appModule.controller('tenant.views.fms.vehicleAssignments.returnVehicleModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.vehicle', 'abp.services.app.vehicleAssignment',
        'vehicleAssignmentId', 'chargesCalculator', 'abp.services.app.commonLookup',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, directoryService, vehicleService, vehicleAssignmentService, vehicleAssignmentId, chargesCalculator, commonLookupService) {

            var vm = this;
            vm.vehicleAssignment = {};

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.actionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements') || abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements');

            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            vm.locations = [];
            vm.vehicleAssignment = {};
            vm.vehicleAssignment.movements = [];

            vm.rateTypes = [
                { id: 1, name: '/Day' },
                { id: 2, name: '/Week' },
                { id: 3, name: '/Month' },
                { id: 5, name: '/KM' },
                { id: 7, name: '/Hour' },
                { id: 6, name: '/Trip' }
            ];

            vm.getRateTypeName = function (rateTypeId) {
                var name = "";
                for (var i = 0; i < vm.rateTypes.length; i++) {
                    if (vm.rateTypes[i].id == rateTypeId) {
                        name = vm.rateTypes[i].name;
                        break;
                    }
                }

                return name;
            }

            vm.billTypes = [
                { id: 1, name: app.localize('Internal') },
                { id: 2, name: app.localize('ExternalCustomer') }
            ];

            vm.billTypeId = 1;   // Bill to type 'Internal Customer' by default selected

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
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

            vm.searchOrganizationContactPopup = function () {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/flt/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.flt.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    vm.vehicleAssignment.customerId = result.id;
                    vm.customerName = result.name;
                });
            }

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.vehicleAssignment.customer = result;
                        vm.vehicleAssignment.customerId = result.id;
                        //vm.customerSelected();
                    }
                });
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // Search Requested by staff
            vm.searchAdditionalDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). contactType: 2 (customer) get individual customers/drivers
                return directoryService.search({ keyword: $select.search, contactCategory: null, contactType: 1 }).then(function (response) {
                    vm.additionaldrivers = response.data.items; // additional driver means reuested by staff
                });
            };

            // Additional driver popup is used for 'requested by' staff
            vm.searchAdditionalDriverPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.vehicleAssignment.additionalDriver = result;  // Additional driver means 'Requested by staff'
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

            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                var modalInstance = openSearchContactModel(null, 1);
                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.vehicleAssignment.driver = result;
                });
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, source: 'openagreement', tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
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
                        options: function () {
                            return {
                                statusId: 'IDL',
                                subStatuses: [1, 7], //1: Available, 7: Ready to go
                                source: 'openagreement',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.vehicleAssignment.vehicle = result;
                        vm.vehicleSelected();
                    }
                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                vm.vehicleAssignment.vehicleId = vm.vehicleAssignment.vehicle.id;
                vm.vehicleAssignment.driverId = vm.vehicleAssignment.driver.id;

                // Note: Additional Driver field is used as 'Requested by'
                if (vm.vehicleAssignment.additionalDriver != null && vm.billTypeId == 1)
                    vm.vehicleAssignment.additionalDriverId = vm.vehicleAssignment.additionalDriver.id;
                else
                    vm.vehicleAssignment.additionalDriverId = null;
                //

                vehicleAssignmentService.returnVehicle({
                    vehicleAssignment: vm.vehicleAssignment,
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };


            vm.vehicleSelected = function () {

                vm.vehicleAssignment.movements[0].outDetail.fuelLevel = vm.vehicleAssignment.vehicle.fuelLevel;
                vm.vehicleAssignment.movements[0].outDetail.km = vm.vehicleAssignment.vehicle.kMs;
            };

            vm.changeBillType = function () {
                vm.vehicleAssignment.customer = null;
                vm.customerName = null;
                vm.vehicleAssignment.customerId = null;
            }

            vm.calculate = function () {
                chargesCalculator.calculate(vm.vehicleAssignment);
            };

            var endDateLoaded = true;
            vm.endDateChanged = function () {

                var dateOut = utilities.jsonUtcDateToLocalMoment(vm.vehicleAssignment.movements[0].outDetail.dateTime);
                var dateIn = moment(vm.vehicleAssignment.movements[vm.vehicleAssignment.movements.length - 1].inDetail.dateTime);
                var duration = moment.duration(dateIn.diff(dateOut));
                var hours = duration.asHours();
                var days = 0;


                days = Math.floor(hours / 24);
                //if ((hours - days * 24) * 60 > gracePeriod) // if extra minutes are greater than grace period then calculate 1 day extra
                //    days += 1;
                // vm.vehicleAssignment.endDate = vm.vehicleAssignment.movements[vm.vehicleAssignment.movements.length - 1].inDetail.dateTime;

                if (vm.originalAgreementType == 3
                    && isTariffEnabled &&
                    (vm.dailyRateFromDays > 0 || vm.dailyRateToDays > 0
                        || vm.weeklyRateFromDays > 0 || vm.weeklyRateToDays > 0)
                    && vm.vehicleAssignment.vehicle.tariffGroupId) {
                    if (days >= vm.dailyRateFromDays && days <= vm.dailyRateToDays && days < 30) {
                        vm.vehicleAssignmentCutShortType = 1;

                        if (vm.originalAgreement == null)
                            vm.originalAgreement = angular.copy(vm.vehicleAssignment);

                        tariffHelper.loadTariff(vm.vehicleAssignment.vehicle.tariffGroupId, 1, function () {
                            cutShortExtendApplyTariff();
                        }, vm.vehicleAssignment.tariffCardId);
                    }
                    else if (days >= vm.weeklyRateFromDays && days <= vm.weeklyRateToDays && days < 30) {
                        vm.vehicleAssignmentCutShortType = 2;

                        if (vm.originalAgreement == null)
                            vm.originalAgreement = angular.copy(vm.vehicleAssignment);

                        tariffHelper.loadTariff(vm.vehicleAssignment.vehicle.tariffGroupId, 1, function () {
                            cutShortExtendApplyTariff();
                        }, vm.vehicleAssignment.tariffCardId);

                    }
                    else if (vm.vehicleAssignment.agreementType != 3) {
                        if (vm.originalAgreement != null) {
                            var endDate = angular.copy(vm.vehicleAssignment.movements[vm.vehicleAssignment.movements.length - 1].inDetail.dateTime);
                            var orignalAgreement = angular.copy(vm.originalAgreement);
                            orignalAgreement.movements[vm.vehicleAssignment.movements.length - 1].inDetail.dateTime = endDate;
                            endDateLoaded = false;
                            vm.vehicleAssignment = orignalAgreement;
                            vm.calculate();
                            return;

                        }

                    }

                }

                if (endDateLoaded)
                    vm.calculate();
                else
                    endDateLoaded = true;
                //vm.vehicleAssignment.movements[vm.vehicleAssignment.movements.length - 1].inDetail.dateTime
            };

            vm.sumCharges = function () {
                return chargesCalculator.sumCharges(vm.vehicleAssignment);
            };

            function init() {
                vm.loading = true;
                allFuelLevels();

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                vehicleAssignmentService.getVehicleAssignmentForEdit({ id: vehicleAssignmentId}).success(function (result) {
                    vm.vehicleAssignment = result.vehicleAssignment;
                    console.log(vm.vehicleAssignment);
                    if (vehicleAssignmentId) {
                        vm.vehicleAssignment.rateTypeId = vm.vehicleAssignment.charges[0].rateTypeId;
                        vm.vehicleAssignment.rate = vm.vehicleAssignment.charges[0].rate;
                        vm.customerName = vm.vehicleAssignment.customer.name;
                        if (!vm.vehicleAssignment.additionalDriverId) {
                            vm.billTypeId = 2;
                        }

                        if (vm.billTypeId == 1) {
                            vm.billTypeName = app.localize('Internal');
                        }
                        else if (vm.billTypeId == 2) {
                            vm.billTypeName = app.localize('ExternalCustomer')
                        }
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
