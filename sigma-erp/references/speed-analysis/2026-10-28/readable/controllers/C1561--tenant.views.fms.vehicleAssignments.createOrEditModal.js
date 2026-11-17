// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:431447-431754
appModule.controller('tenant.views.fms.vehicleAssignments.createOrEditModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.vehicle', 'abp.services.app.vehicleAssignment', 'vehicleAssignmentId',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, directoryService, vehicleService, vehicleAssignmentService, vehicleAssignmentId) {

            var vm = this;
            vm.vehicleAssignment = {};

            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            vm.vehicleAssignment = {};
            vm.vehicleAssignment.movements = [];
           
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));

            vm.rateTypes = [
                { id: 1, name: '/Day' },
                { id: 2, name: '/Week' },
                { id: 3, name: '/Month' },
                { id: 5, name: '/KM' },
                { id: 7, name: '/Hour' },
                { id: 6, name: '/Trip' }
            ];

            vm.billTypes = [
                { id: 1, name: app.localize('Internal') },
                { id: 2, name: app.localize('External') + ' ' + app.localize('Customer') }
            ];

            vm.billTypeId = 1;   // Bill to type 'Internal Customer' by default selected

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
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
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    vm.vehicleAssignment.customerId = result.id;
                    vm.customerName = result.code !=null ? result.name + ' (' + result.code + ')' : result.name;
                    vm.organizationUnitOrStaffSelected();
                });
            }

            vm.searchAdditionalDriverPopoup = function () {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    //vm.vehicleAssignment.customerId = result.id;
                    vm.requestedByName = result.code != null ? result.name + ' (' + result.code + ')' : result.name;
                    vm.vehicleAssignment.additionalDriver = result
                    //vm.organizationUnitOrStaffSelected();
                });
            }

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.vehicleAssignment.customer = result;
                        vm.vehicleAssignment.customerId = result.id;
                        vm.customerSelected();
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

            vm.customerSelected = function () {
                vm.vehicleAssignment.customerId = vm.vehicleAssignment.customer.id

                if (vm.isEditMod && vm.assignmentTaxPercent > 0) {
                    vm.vehicleAssignment.taxPercent = vm.vehicleAssignment.customer.isTaxExempted ? 0 : vm.assignmentTaxPercent;
                    vm.vehicleAssignment.isTaxExempted = vm.vehicleAssignment.customer.isTaxExempted;
                }
                else {
                    vm.vehicleAssignment.taxPercent = vm.vehicleAssignment.customer.isTaxExempted ? 0 : vm.taxPercent;
                    vm.vehicleAssignment.isTaxExempted = vm.vehicleAssignment.customer.isTaxExempted;
                }
            };

            vm.organizationUnitOrStaffSelected = function () {
                vm.vehicleAssignment.taxPercent = 0;
                vm.vehicleAssignment.isTaxExempted = true;
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.vehicleAssignment.taxPercent = vm.taxPercent;
                else
                    vm.vehicleAssignment.taxPercent = 0;
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
            //vm.searchAdditionalDriverPopoup = function () {
            //    var modalInstance = openSearchContactModel(null, 2);

            //    modalInstance.result.then(function (result) {
            //        if (result != null)
            //            vm.vehicleAssignment.additionalDriver = result;  // Additional driver means 'Requested by staff'
            //    });
            //};

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

            vm.documents = [];

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    result.documentType = 5;
                    vm.documents.push(result);
                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

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

                vehicleAssignmentService.createOrUpdateVehicleAssignment({
                    vehicleAssignment: vm.vehicleAssignment,
                    assignmentDocuments: vm.documents
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

            function init() {
                vm.loading = true;
                allFuelLevels();
                vehicleAssignmentService.getVehicleAssignmentForEdit({ id: vehicleAssignmentId}).success(function (result) {
                    vm.vehicleAssignment = result.vehicleAssignment;
                    
                    if (vm.vehicleAssignment.id > 0) {
                        vm.vehicleAssignment.rateTypeId = vm.vehicleAssignment.charges[0].rateTypeId;
                        vm.vehicleAssignment.rate = vm.vehicleAssignment.charges[0].rate;
                        vm.customerName = vm.vehicleAssignment.customer.code != null ? vm.vehicleAssignment.customer.name + ' (' + vm.vehicleAssignment.customer.code + ')'
                            : vm.vehicleAssignment.customer.name;
                        vm.requestedByName = vm.vehicleAssignment.additionalDriver.code != null ? vm.vehicleAssignment.additionalDriver.name + ' (' + vm.vehicleAssignment.additionalDriver.code + ')'
                            : vm.vehicleAssignment.additionalDriver.name; 
                        if (!vm.vehicleAssignment.additionalDriverId) {
                            vm.billTypeId = 2;
                        }
                        vm.assignmentTaxPercent = vm.vehicleAssignment.taxPercent;
                    }
                    else {
                        vm.vehicleAssignment.movements[vm.vehicleAssignment.movements.length - 1].outDetail.dateTime = moment().utc();
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
