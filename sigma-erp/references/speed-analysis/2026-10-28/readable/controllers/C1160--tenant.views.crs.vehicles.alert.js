// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:306054-306728
appModule.controller('tenant.views.crs.vehicles.alert', [
        '$scope', '$uibModal', 'uiGridConstants', '$filter', 'abp.services.app.vehicleAlerts', 'abp.services.app.vehicleAlertEmail'
        , 'abp.services.app.commonLookup', 'abp.services.app.vehicleModel', 'utilities',
        function ($scope, $uibModal, uiGridConstants, $filter, vehicleAlertsService, vehicleAlertEmailService, lookupService, vehicleModelService, utilities) {

            var vm = this;
            vm.allInsurance = false;
            vm.allRegistration = false;
            vm.allVehicleCustomAlerts1 = false;
            vm.allVehicleCustomAlerts2 = false;
            vm.vehicleAlertsService = [];
            vm.vehicleAlertsWarranty = [];
            vm.filters = {
                type: 1,
            };
            vm.isMileageAlertEmailEnabled = abp.features.isEnabled("Notifications.EmailMileageAlerts");
            vm.isWarrantyAlertEmailEnabled = abp.features.isEnabled("Notifications.EmailWarrantyAlerts");
            vm.isServiceAlertEmailEnabled = abp.features.isEnabled("Notifications.EmailServiceAlerts");
            vm.isServicesEnabled = abp.features.isEnabled("CRS.FleetManagement_Services");
            vm.vehicle_EnableCustomAlert1Date = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_CustomAlert1"));
            vm.vehicle_EnableCustomAlert2Date = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_CustomAlert2"));
         
            vm.isCrsEnabled = (abp.features.isEnabled("CRS.Rental") || abp.features.isEnabled("CRS.Limo")
                || abp.features.isEnabled("CRS.Transportation") || abp.features.isEnabled("CRS.Lease") || abp.features.isEnabled("ERS") ||
                abp.features.isEnabled("FMS.VehicleAssignment"));

            //if (!vm.isCrsEnabled && vm.isServicesEnabled)
            //    vm.filters.type = 3;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.disbleDateRange = function () {
                if (vm.filters.ownership !== 2 && vm.filters.ownership !== 3) {
                    vm.filters.enableDateRange = false;
                    initDate();
                }
            }

            vm.statuses = [
                { name: app.localize('Hired'), statusId: 'HIR', subStatus: null },
                { name: app.localize('OnNRM'), statusId: 'NRM', subStatus: null },
                { name: app.localize('InWorkshop'), statusId: 'WRK', subStatus: null },
                { name: app.localize('ForSale'), statusId: 'IDL', subStatus: 3 },
                { name: app.localize('TotalLoss'), statusId: 'IDL', subStatus: 4 },
                { name: app.localize('Custody'), statusId: 'IDL', subStatus: 8 },
                { name: app.localize('PendingCustomerDelivery'), statusId: 'IDL', subStatus: 5 },
                { name: app.localize('PendingWorkshopDelivery'), statusId: 'IDL', subStatus: 6 },
                { name: app.localize('NotReady'), statusId: 'IDL', subStatus: 2 },
                { name: app.localize('Available'), statusId: 'IDL', subStatus: 1 },
                { name: app.localize('ReadyToGo'), statusId: 'IDL', subStatus: 7 },
                { name: app.localize('Booked'), statusId: 'BKD', subStatus: null },
                { name: app.localize('Defleeted'), statusId: 'DFL', subStatus: null },

            ];

            vm.vehicleOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 },
            ];

            vm.clearSearchFilter = function () {
                vm.filters.plateNo = null;
                vm.filters.make = null;
                vm.filters.makeId = null;
                vm.filters.model = null;
                vm.filters.modelId = null;
                vm.filters.status = null;
                vm.filters.statusId = null;
                vm.filters.locationId = null;
                vm.filters.ownership = null;
            };

            vm.statusFilterChanged = function () {
                if (vm.filters.status !== null) {
                    vm.filters.statusId = vm.filters.status.statusId;
                    vm.filters.subStatus = vm.filters.status.subStatus;
                } else {
                    vm.filters.statusId = '';
                    vm.filters.subStatus = null;
                }
            };


            vm.locations = [];

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getRenewType = function () {
                if (vm.filters.type == 1)
                    return app.localize("RenewInsurance");
                if (vm.filters.type == 2)
                    return app.localize("RenewRegistration");
                if (vm.filters.type == 5)
                    return app.localize("Renew") + " " + app.localize("VehicleCustomAlert1");
                if (vm.filters.type == 6)
                    return app.localize("Renew") + " " + app.localize("VehicleCustomAlert2");
                return "";
            };

            vm.getVehicleStatus = function (row) {
                if (row.statusId == "HIR")
                    return app.localize("Hired");
                else if (row.statusId == "NRM")
                    return app.localize("OnNRM");
                else if (row.statusId == "WRK")
                    return app.localize("InWorkshop");
                else if (row.statusId == "IDL" && row.subStatus == 3)
                    return app.localize("ForSale");
                else if (row.statusId == "IDL" && row.subStatus == 4)
                    return app.localize("TotalLoss");
                else if (row.statusId == "IDL" && row.subStatus == 2)
                    return app.localize("NotReady");
                else if (row.statusId == "IDL" && row.subStatus == 1)
                    return app.localize("Available");
                else if (row.statusId == "BKD")
                    return app.localize("Booked");
                else if (row.statusId == "DFL")
                    return app.localize("Defleeted");
                else return null;

            };

            vm.allBoxTicked = function () {
                if (vm.filters.type == 1) {
                    if (vm.vehicleAlertsInsurance == null) return;
                    angular.forEach(vm.vehicleAlertsInsurance, function (row) {
                        row.generate = vm.allInsurance;
                    });
                }
                if (vm.filters.type == 2) {
                    if (vm.vehicleAlertsRegistration == null) return;
                    angular.forEach(vm.vehicleAlertsRegistration, function (row) {
                        row.generate = vm.allRegistration;
                    });
                }
                if (vm.filters.type == 5) {
                    if (vm.vehicleCustomAlerts1 == null) return;
                    angular.forEach(vm.vehicleCustomAlerts1, function (row) {
                        row.generate = vm.allVehicleCustomAlerts1;
                    });
                }
                if (vm.filters.type == 6) {
                    if (vm.vehicleCustomAlerts2 == null) return;
                    angular.forEach(vm.vehicleCustomAlerts2, function (row) {
                        row.generate = vm.allVehicleCustomAlerts2;
                    });
                }

            };
            function getInsuranceAlerts() {
                vm.loading = true;
                vm.allInsurance = false;
                vehicleAlertsService.getInsuranceAlerts(vm.filters).success(function(data) {
                    vm.vehicleAlertsInsurance = data.items;
                }).finally(function() {
                    vm.loading = false;
                });
            }
            function getRegistrationAlerts() {
                vm.loading = true;
                vm.allRegistration = false;
                vehicleAlertsService.getRegistrationAlerts(vm.filters).success(function(data) {
                    vm.vehicleAlertsRegistration = data.items;
                }).finally(function() {
                    vm.loading = false;
                });
            }

            function getServiceAlerts() {
                vm.loading = true;
                vehicleAlertsService.getServiceAlerts(vm.filters).success(function (data) {
                    vm.vehicleAlertsService = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getMileageAlerts() {

                vm.loading = true;

                vehicleAlertsService.getMileageAlerts(vm.filters).success(function (data) {
                    vm.vehicleAlertsMileage = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getWarrantyType = function (id) {
                return utilities.getWarrantyTypes(id);
            };

            vm.getWarrantyPeriod = function (id) {
                return utilities.getWarrantyPeriodTypes(id);
            };

            function getWarrantyAlerts() {

                vm.loading = true;

                vehicleAlertsService.getWarrantyAlerts(vm.filters).success(function (data) {
                    vm.vehicleAlertsWarranty = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getVehicleCustomAlerts1() {

                vm.loading = true;
                vm.allVehicleCustomAlerts1 = false;

                vehicleAlertsService.getVehicleCustomAlerts1(vm.filters).success(function (data) {
                    vm.vehicleCustomAlerts1 = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getVehicleCustomAlerts2() {

                vm.loading = true;
                vm.allVehicleCustomAlerts2 = false;

                vehicleAlertsService.getVehicleCustomAlerts2(vm.filters).success(function (data) {
                    vm.vehicleCustomAlerts2 = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getAlerts = function () {
                if (vm.filters.type == 1)
                    getInsuranceAlerts();
                else if (vm.filters.type == 2)
                    getRegistrationAlerts();
                else if (vm.filters.type == 3)
                    getServiceAlerts();
                else if (vm.filters.type == 4 && parseInt(abp.setting.get("App.General.MileageUpdateAlertAfterMonths")) >= 1)
                    getMileageAlerts();
                else if (vm.filters.type == 5)
                    getVehicleCustomAlerts1();
                else if (vm.filters.type == 6)
                    getVehicleCustomAlerts2();
                else if (vm.filters.type == 7)
                    getWarrantyAlerts();
            };

            function openRenewInsuranceModal(renewInsurances) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/renewInsuranceModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.renewInsuranceModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        renewInsurances: function () {
                            return renewInsurances;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    getInsuranceAlerts();
                });
            }


            function openRenewRegistrationModal(renewRegistrations) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/renewRegistrationModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.renewRegistrationModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        renewRegistrations: function () {
                            return renewRegistrations;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    getRegistrationAlerts();
                });
            }

            function openRenewCustomAlerts1Modal(renewCustomAlerts1) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/renewCustomAlert1Modal.cshtml',
                    controller: 'tenant.views.crs.vehicles.renewCustomAlert1Modal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        renewCustomAlerts1: function () {
                            return renewCustomAlerts1;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    getVehicleCustomAlerts1();
                });
            }
            function openRenewCustomAlerts2Modal(renewCustomAlerts2) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/renewCustomAlert2Modal.cshtml',
                    controller: 'tenant.views.crs.vehicles.renewCustomAlert2Modal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        renewCustomAlerts2: function () {
                            return renewCustomAlerts2;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    getVehicleCustomAlerts2();
                });
            }
            vm.renew = function () {
                if (vm.filters.type == 1) {
                    var renewInsurances = [];
                    angular.forEach(vm.vehicleAlertsInsurance, function (row) {
                        if (row.generate == true)
                            renewInsurances.push({
                                id: row.id, plateNo: row.plateNo
                            });
                    });
                    openRenewInsuranceModal(renewInsurances);
                }
                else if (vm.filters.type == 2) {
                    var renewRegistrations = [];
                    angular.forEach(vm.vehicleAlertsRegistration, function (row) {
                        if (row.generate == true)
                            renewRegistrations.push({
                                id: row.id, plateNo: row.plateNo
                            });
                    });
                    openRenewRegistrationModal(renewRegistrations);
                }
                else if (vm.filters.type == 5) {
                    var renewCustomAlerts1 = [];
                    angular.forEach(vm.vehicleCustomAlerts1, function (row) {
                        if (row.generate == true)
                            renewCustomAlerts1.push({
                                id: row.id, plateNo: row.plateNo
                            });
                    });
                    openRenewCustomAlerts1Modal(renewCustomAlerts1);
                }
                else if (vm.filters.type == 6) {
                    var renewCustomAlerts2 = [];
                    angular.forEach(vm.vehicleCustomAlerts2, function (row) {
                        if (row.generate == true)
                            renewCustomAlerts2.push({
                                id: row.id, plateNo: row.plateNo
                            });
                    });
                    openRenewCustomAlerts2Modal(renewCustomAlerts2);
                }
            };
            vm.updateService = function (serviceAlert) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/updateServiceModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.updateServiceModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        serviceAlert: function () {
                            return serviceAlert;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    getServiceAlerts();
                });
            };

            vm.clearModelData = function () {
                if (vm.filters && vm.filters.model) {
                    vm.models = null; vm.filters.model = null; vm.filters.modelId = null;
                }
            };

            vm.searchModel = function ($select) {
                if (vm.filters && vm.filters.make) {
                    var makeAndModel = "";
                    makeAndModel = vm.filters.make.name + $select.search;
                    if (makeAndModel == '')
                        makeAndModel = "~";  //to avoid default suggestions 

                    return vehicleModelService.searchVehicleModelsNew({ name: makeAndModel }).then(function (response) {
                        vm.models = response.data.items;
                    });
                }
            };

            vm.searchMake = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleMakes(vm.filters).then(function (response) {
                    vm.makes = response.data.items;
                });
            };

            vm.openWorkShopMovement = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/workshopMovements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.workshopMovements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                workshopMovementId: null,
                                fromAlerts: true,
                                vehicle: {
                                    id: row.id,
                                    plateNo: row.plateNo,
                                    fuelLevel: row.fuelLevel,
                                    kMs: row.kms,
                                    modelId: row.model.id,
                                    locationId: row.locationId,
                                },
                                serviceId: row.dueService.id,
                                dueService: row.dueService,
                                dueDate: row.dueDate,
                                dueKms: row.dueKms,
                                dueReason: row.dueReason
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    getServiceAlerts();
                });

            };

            vm.updateVehicleService = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/updateVehicleServiceModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.updateVehicleServiceModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                workshopMovementId: null,
                                fromAlerts: true,
                                vehicle: {
                                    id: row.id,
                                    plateNo: row.plateNo,
                                    fuelLevel: row.fuelLevel,
                                    kMs: row.kms,
                                    modelId: row.model.id,
                                    locationId: row.locationId,
                                },
                                serviceId: row.dueService.id,
                                dueService: row.dueService,
                                dueDate: row.dueDate,
                                dueKms: row.dueKms,
                                dueReason: row.dueReason
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    getServiceAlerts();
                });

            };

            vm.exportToExcel = function () {
                vm.loading = true;

                if (vm.filters.type == 1) {
                    vehicleAlertsService.exportToExcelInsuranceAlerts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 2) {
                    vehicleAlertsService.exportToExcelRegisterationAlerts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 3) {
                    vehicleAlertsService.exportToExcelServiceAlerts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 4 && parseInt(abp.setting.get("App.General.MileageUpdateAlertAfterMonths")) >= 1) {
                    vehicleAlertsService.exportToExcelMileageAlerts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 5) {
                    vehicleAlertsService.exportToExcelGetVehicleCustomAlerts1(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 6) {
                    vehicleAlertsService.exportToExcelGetVehicleCustomAlerts2(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 7) {
                    vehicleAlertsService.exportToExcelWarrantyAlerts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            };

            vm.updateMileage = function (mileageAlert) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/updateMileageAlertModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.updateMileageAlertModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        mileageAlert: function () {
                            return mileageAlert;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    getMileageAlerts();
                });
            };

            function init() {
                getLocations();
                vm.getAlerts();
            }

            function getLocations() {
                lookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.checkCheckeditems = function () {
                if (vm.filters.type == 1) {
                    if (vm.vehicleAlertsInsurance == null) return false;
                    var foundLines = $filter('filter')(vm.vehicleAlertsInsurance, {
                        generate: true,
                    }, true);
                    if (foundLines.length >= 1)
                        return true;
                }
                if (vm.filters.type == 2) {
                    if (vm.vehicleAlertsRegistration == null) return false;
                    var foundLines = $filter('filter')(vm.vehicleAlertsRegistration, {
                        generate: true,
                    }, true);
                    if (foundLines.length >= 1)
                        return true;
                }
                if (vm.filters.type == 5) {
                    if (vm.vehicleCustomAlerts1 == null) return false;
                    var foundLines = $filter('filter')(vm.vehicleCustomAlerts1, {
                        generate: true,
                    }, true);
                    if (foundLines.length >= 1)
                        return true;
                }
                if (vm.filters.type == 6) {
                    if (vm.vehicleCustomAlerts2 == null) return false;
                    var foundLines = $filter('filter')(vm.vehicleCustomAlerts2, {
                        generate: true,
                    }, true);
                    if (foundLines.length >= 1)
                        return true;
                }

            }
            init();

            vm.mileageEmailAllChanged = function () {
                vm.vehicleAlertsMileage.filter(e => e.statusId == 'HIR' && e.email).forEach(function (value) {
                    value.generate = vm.mileageEmailAll;
                });
            };
            vm.serviceEmailAllChanged = function () {
                vm.vehicleAlertsService.filter(e => e.statusId == 'HIR' && e.email).forEach(function (value) {
                    value.generate = vm.serviceEmailAll;
                });
            };

            var sendVehicleMileageAlertEmails = function () {
                var emailVehicleMileageAlerts = vm.vehicleAlertsMileage.filter(e => e.statusId == 'HIR' && e.email && e.generate);
                //var emailVehicleMileageAlerts = [];
                vm.loading = true;

                if (emailVehicleMileageAlerts.length == 0) {
                    vm.loading = false;
                    return;
                }

                vehicleAlertEmailService.emailVehicleAlertMileageDetails({ emailVehicleAlerts: emailVehicleMileageAlerts }).success(function () {
                    abp.notify.info('Emails Send Successfully');
                    getMileageAlerts();
                }).finally(function () {
                    vm.loading = false;
                });


            };

            var sendVehicleServiceAlertEmails = function () {
                var emailVehicleServiceAlerts = vm.vehicleAlertsService.filter(e => e.statusId == 'HIR' && e.email && e.generate);

                vm.loading = true;

                if (emailVehicleServiceAlerts.length == 0) {
                    vm.loading = false;
                    return;
                }

                vehicleAlertEmailService.emailVehicleAlertServiceDetails({ emailVehicleAlerts: emailVehicleServiceAlerts }).success(function () {
                    abp.notify.info('Emails Send Successfully');
                    getServiceAlerts();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.emailAlerts = function () {
                if (vm.filters.type == 4 && vm.isMileageAlertEmailEnabled)
                    sendVehicleMileageAlertEmails();
                else if (vm.filters.type == 3 && vm.isServiceAlertEmailEnabled)
                    sendVehicleServiceAlertEmails();
            };
            vm.getEmailCount = function () {
                if (vm.filters.type == 4 && vm.isMileageAlertEmailEnabled && vm.vehicleAlertsMileage)
                    return vm.vehicleAlertsMileage.filter(e => e.statusId == 'HIR' && e.email && e.generate).length;
                else if (vm.filters.type == 3 && vm.isServiceAlertEmailEnabled && vm.vehicleAlertsService)
                    return vm.vehicleAlertsService.filter(e => e.statusId == 'HIR' && e.email && e.generate).length;
                else
                    return 0;
            };
        }
    ]);
