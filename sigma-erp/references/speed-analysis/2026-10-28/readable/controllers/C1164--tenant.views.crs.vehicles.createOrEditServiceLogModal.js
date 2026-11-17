// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:307841-308045
appModule.controller('tenant.views.crs.vehicles.createOrEditServiceLogModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicle', 'vehicleId', 'abp.services.app.vehicleService', 'abp.services.app.registrationState', 'abp.services.app.vehicleModel', 'abp.services.app.location', '$q', 'abp.services.app.commonLookup', 'abp.services.app.costCenter', 'appSession', 'utilities', 'abp.services.app.uaeFine', 'abp.services.app.vehicleInvestorsLog', 'abp.services.app.vehicleServiceLog', 'abp.services.app.directory', 'abp.services.app.vehicleAlerts',
        function ($scope, $uibModal, $uibModalInstance, vehicleService, vehicleId, vehicleServiceService, stateService, vehicleModelService, locationService, $q, lookupService, costCenterService, appSession, utilities, finesService, vehicleInvestorService, vehicleServicelogService, directoryService, vehicleAlertsService) {

            var vm = this;
            vm.service = null;
            vm.saving = false;
            vm.models = null;
            vm.isEditMod = false;
            vm.selectedModel = null;
            vm.modelSearchText = null;
            vm.locations = [];
            vm.tariffGroups = [];
            vm.editMode = true;           
            vm.filters = {
                name: '',
                makeId: null
            };
            vm.dueService = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function getLocations() {
                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            vm.locationPermission = function (row) {
                if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId) {
                    vm.disable = false;
                    return false;
                }
                return true;
            };
            vm.getTeriffGroups = function () {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;

                });
            };
            vm.vehicleSelected = function (vehicle) {
                if (vehicle != null)
                    vm.service.vehicle = vehicle;
                vm.service.vehicleId = vm.service.vehicle.id;
            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                vehicleService.searchVehicles({ plateNo: $select.search })
                    .then(function (response) {
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
                                //fromDateTime: moment(vm.limo.pickupDateTime ? vm.limo.pickupDateTime : moment().startOf('day')).utc(),
                                //toDateTime: moment(vm.limo.dropOffDateTime ? vm.limo.dropOffDateTime : moment().endOf('day')).utc(),                                
                                allSelectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.service.vehicle = result;
                        vm.service.vehicleId = vm.service.vehicle.id
                        vm.vehicleSelected();
                    }
                });
            };
            vm.searchContacts = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.clearWorkShop = function () {
                vm.service.workShop = null;
                vm.service.workShopId = null;
            };
            vm.searchContactPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.service.workshop = result;
                        vm.service.workshopId = result.id;
                    }
                });
            };
            function getDueServices(getServiceAlert) {
                if (getServiceAlert == null) getServiceAlert = false;

                vm.loading = true;
                vehicleServiceService.getVehicleServices().success(function (servicesData) {
                    //vm.dueServices = servicesData.items;
                    //if (getServiceAlert) {
                    //    vehicleAlertsService.getServiceAlerts({ vehicleId: vm.vehicle.id }).success(function (result) {
                    //        vm.serviceAlerts = result.items;
                    //        if (vm.serviceAlerts.length > 0 && servicesData.items.length > 0) {
                    //            vm.dueService = vm.serviceAlerts[0].dueService;
                    //            fillDueServices(servicesData.items);
                    //        }
                    //    }).finally(function () {
                    //        vm.loading = false;
                    //    });
                    //} else {

                        fillDueServices(servicesData.items);
                    //}

                }).finally(function () {
                    if (!getServiceAlert)
                        vm.loading = false;
                });
            }

            function fillDueServices(servicesList) {
                if (vm.dueService != null) {
                    vm.dueServices = [];
                    angular.forEach(servicesList, function (service) {
                        if (service.dueOnKMs >= vm.dueService.dueOnKMs && service.dueOnMonths >= vm.dueService.dueOnMonths)
                            vm.dueServices.push(service);
                    });
                } else {
                    vm.dueServices = servicesList;
                }
            }


            vm.save = function () {
                vm.saving = true;
                if (vm.service.vehicle) {
                    vm.service.vehicleId = vm.service.vehicle.id;
                }
                //if (vm.service.serviceId) {
                //    vm.service.serviceId = vm.service.service.id;
                //}
                if (vm.service.workshop) {
                    vm.service.workshopId = vm.service.workshop.id;
                }
                vm.service.vehicle = null;
                vm.service.service = null;
                vm.service.workshop = null;

                vm.service.isHistorical = true;
                vehicleServicelogService.createOrUpdateServiceLog({
                    service: vm.service,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function init() {
                vm.loading = true;
                getLocations();
                vm.getTeriffGroups();
                getDueServices(true);
                
                vehicleServicelogService.getServiceLogForEdit({
                    id: vehicleId
                }).success(function (result) {
                    vm.service = result;
                    if (!vm.service.id || vm.service.id < 0) {
                        vm.service.date = new Date();
                    }
                }).finally(function () {
                    vm.loading = false;
                });

                vm.loading = false;
            }

            init();
        }
    ]);
