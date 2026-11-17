// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:299036-299252
appModule.controller('tenant.views.crs.transportation.agreements.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'agreementId', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.commonLookup', 'abp.services.app.transAgreement', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, agreementId, vehicleService, directoryService, commonLookupService, transAgreementService,utilities) {
            var vm = this;
            vm.loading = false;
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            vm.isEditMod = false;
            vm.disableCustomer = false;
            vm.requiredDropOffLocation = true;
            vm.showTransportVehiclesOnlyInTransportAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowTransportVehiclesOnlyInTransportAgreements"));

            vm.localizeWeekDays = function (weekDay) {
                //if (!weekDay) return '';
                if (weekDay == 0) return app.localize('Sunday');
                else if (weekDay == 1) return app.localize('Monday');
                else if (weekDay == 2) return app.localize('Tuesday');
                else if (weekDay == 3) return app.localize('Wednesday');
                else if (weekDay == 4) return app.localize('Thursday');
                else if (weekDay == 5) return app.localize('Friday');
                else if (weekDay == 6) return app.localize('Saturday');

            }

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                if (vm.showTransportVehiclesOnlyInTransportAgreements) {
                    return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL',vehicleType:'Transportation', source: 'openagreement' }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                }
                else {
                    return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', source: 'openagreement' }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                }
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);
                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.transAgreement.customer = result;
                        vm.transAgreement.customerId = vm.transAgreement.customer.id;
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
                        vm.transAgreement.driver = result;
                    vm.transAgreement.driverId = vm.transAgreement.driver.id;
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
                            var opts = {
                                fromDateTime: moment(vm.transAgreement.dateTime ? vm.transAgreement.dateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.transAgreement.endDate ? vm.transAgreement.endDate : moment().endOf('day')).utc(),
                                tariffGroup: null,
                                statusId: 'IDL',
                                source: 'openagreement',
                                selectable: true
                            };

                            if (vm.showTransportVehiclesOnlyInTransportAgreements) {
                                opts.vehicleType = 'Transportation'; // or correct enum name from backend
                            }
                            return opts;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.transAgreement.vehicle = result;
                        vm.transAgreement.vehicleId = vm.transAgreement.vehicle.id;
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


            vm.removeRow = function (obj) {
                if (vm.transAgreement.schedule.length <= 1) return;
                var index = vm.transAgreement.schedule.indexOf(obj);
                vm.transAgreement.schedule.splice(index, 1);

            };

            vm.addRow = function () {
                vm.transAgreement.schedule.push(transAgreementScheduleLineObject());
            };

            function transAgreementScheduleLineObject() {
                var line = new Object();
                line.pickupTime = '';
                line.pickupLocation = null;
                line.dropOffLocation = null;
                return line;
            }

            // Searching Places Google MapApi
            vm.searchLocations = function ($select) {
                if (vm.transAgreement.customer == null) return null;

                return commonLookupService.searchTransportationLocations({ keyWord: $select.search }).then(function (response) {
                    vm.locations = response.data.items;
                });


            };

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
                vm.transAgreement.startDate = moment(vm.transAgreement.startDate).startOf('day').utc();
                transAgreementService.createOrUpdateTransAgreement({
                    agreement: vm.transAgreement
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };


            function init() {
                vm.loading = true;
                transAgreementService.getTransAgreementForEdit({ id: agreementId }).success(function (data) {
                    vm.transAgreement = data;

                }).finally(function () {
                    vm.loading = false;
                });

            }

            init();
        }
    ]);
