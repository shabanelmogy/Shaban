// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:300860-301046
appModule.controller('tenant.views.crs.transportation.tripSheet.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'options', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.commonLookup', 'abp.services.app.transAgreement', 'abp.services.app.transTrip',
        function ($scope, $uibModal, $uibModalInstance, options, vehicleService, directoryService, commonLookupService, transAgreementService, transTripService) {
            var vm = this;
            vm.loading = false;

            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            vm.isEditMod = false;
            vm.disableCustomer = false;
            vm.requiredDropOffLocation = true;


            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', source: 'openagreement' }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);
                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.transTrip.customer = result;
                        vm.transTrip.customerId = vm.transTrip.customer.id;
                    }
                });
            };

            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                var modalInstance = openSearchContactModel(1, null);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.transTrip.driver = result;
                    vm.transTrip.driverId = vm.transTrip.driver.id;
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
                                fromDateTime: moment(vm.transTrip.dateTime ? vm.transTrip.dateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.transTrip.endDate ? vm.transTrip.endDate : moment().endOf('day')).utc(),
                                tariffGroup: null,
                                statusId: 'IDL',
                                source: 'openagreement',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.transTrip.vehicle = result;
                        vm.transTrip.vehicleId = vm.transTrip.vehicle.id;
                    }
                });
            }

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

            // Searching Places Google MapApi
            vm.searchLocations = function ($select) {
                //if (vm.transTrip.customer == null) return null;

                return commonLookupService.searchTransportationLocations({ keyWord: $select.search }).then(function (response) {
                    vm.locations = response.data.items;
                });


            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                }
                else {
                    return "";
                }
            };

            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                }
                else {
                    return "";
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                
                transTripService.createOrUpdateTransTrip({
                    trip: vm.transTrip
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                vm.loading = true;
                transTripService.getTransTripForEdit({ id: options.transTripId }).success(function (data) {
                    vm.transTrip = data;
                    if (options.transTripId == null || options.transTripId <= 0) {
                       
                        vm.transTrip.customer = options.agreement.customer;
                        vm.transTrip.customerId = options.agreement.customer.id;
                        vm.transTrip.driver = options.agreement.driver;
                        vm.transTrip.driverId = options.agreement.driver.id;
                        vm.transTrip.vehicle = options.agreement.vehicle;
                        vm.transTrip.vehicleId = options.agreement.vehicle.id;
                        vm.transTrip.agreementNo = options.agreement.agreementNo;
                        //vm.transTrip.pickupDateTime = options.agreement.startDate;
                        vm.transTrip.agreementId = options.agreement.id;
                        vm.transTrip.isExtraTrip = true;
                    }
                    else
                        vm.transTrip.agreementNo = options.agreement.agreementNo;

                    // vm.transTrip.customerId = 30154;
                    // vm.transTrip.agreementId = 9;
                }).finally(function () {
                    vm.loading = false;
                });

            }

            init();
        }
    ]);
