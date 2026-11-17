// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:308572-309557
appModule.controller('tenant.views.crs.vehiclesDashboard', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicleDashboard', 'abp.services.app.make', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.vehicleModel', 'abp.services.app.vehicleAlertEmail', '$filter',
        'abp.services.app.commonLookup',
        function ($scope, $uibModal, uiGridConstants, vehicleDashboardService, vehicleMakeService, appSession, lookupService, utilities, vehicleModelService, vehicleAlertEmailService, $filter,
            commonLookupService) {

            var vm = this;
            vm.showAvailbleColumns = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.models = [];
            vm.makes = [];
            vm.makeModel = null;
            vm.vehicleTypes = [];
            vm.vehicleDashBoardData = [];
            $scope.vehicleDashBoardRow = $scope.contact;
            vm.milageAlerEnable = parseInt(abp.setting.get("App.General.MileageUpdateAlertAfterMonths")) >= 1;
            vm.totalVehicleCount = 0;

            vm.isMileageAlertEmailEnabled = abp.features.isEnabled("Notifications.EmailMileageAlerts");
            vm.isServiceAlertEmailEnabled = abp.features.isEnabled("Notifications.EmailServiceAlerts");
            vm.isServicesEnabled = abp.features.isEnabled("CRS.FleetManagement_Services");
            vm.vehicle_EnableCustomAlert1Date = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_CustomAlert1"));
            vm.vehicle_EnableCustomAlert2Date = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_CustomAlert2"));
            vm.showTransportVehiclesOnlyInTransportAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowTransportVehiclesOnlyInTransportAgreements"));

            vm.isCrsEnabled = (abp.features.isEnabled("CRS.Rental") || abp.features.isEnabled("CRS.Limo")
                || abp.features.isEnabled("CRS.Transportation") || abp.features.isEnabled("CRS.Lease") || abp.features.isEnabled("ERS") ||
                abp.features.isEnabled("FMS.VehicleAssignment"));


            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = dateRangeCheck;
            function dateRangeCheck() {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.filters = {
                enableDateRange: false,
                fleetCode: null,
                vehicleType: null,
                ownership: null,
                plateNo: '',
                statusId: '',
                subStatus: null,
                modelId: null,
                locationId: '',
                status: null, //to be used only on client side will have both statusId and subStatus
                skipCount: 0,
                dueType: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                agreementTypes: []
            };
            vm.workshopMovementTypes = [
                { id: 1, name: 'Maintenance' }, { id: 2, name: 'Repair' }, { id: 3, name: 'Accident Repair' }, { id: 10, name: 'Inspection' }
            ];
            vm.statuses = [
                { name: app.localize('Hired'), statusId: 'HIR', subStatus: null },
                { name: app.localize('OnNRM'), statusId: 'NRM', subStatus: null },
                { name: app.localize('InWorkshop'), statusId: 'WRK', subStatus: 9 },
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

            var getNotReadyReasons = function () {
                commonLookupService.getNotReadyReasons().success(function (data) {
                    vm.notReadyReasons = data;
                })
            };


            vm.localizeString = function (key) {
                if (key)
                    return app.localize(key);
                else return key;
            };

            vm.disbleDateRange = function () {
                if (vm.filters.ownership !== 2 && vm.filters.ownership !== 3) {
                    vm.filters.enableDateRange = false;
                    initDate();
                } else {
                    vm.filters.enableDateRange = true;
                    initDate();
                }
                vm.filters.enableDateRange = false;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
            };

            function PopulateVehicleTypes() {
                isRentalEnabled = abp.features.isEnabled("CRS.Rental");
                isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
                isLimoEnabled = abp.features.isEnabled("CRS.Limo");

                //---------------------------------------------------------------------
                //---------------------------------------------------------------------
                if (isRentalEnabled) vm.vehicleTypes.push({ key: 'Rental', value: 1 });
                if (isLeaseEnabled) vm.vehicleTypes.push({ key: 'Lease', value: 2 });
                if (isRentalEnabled || isLeaseEnabled)
                    vm.vehicleTypes.push({ key: 'Replacement', value: 3 });
                if (isLimoEnabled) vm.vehicleTypes.push({ key: 'Limousine', value: 4 });
                if (vm.showTransportVehiclesOnlyInTransportAgreements) vm.vehicleTypes.push({ key: 'Transportation', value: 7 });
            }

            vm.vehicleOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 },
                { key: 'Buy Back', value: 3 }
            ];
            vm.getVehicleValue = function () {
                vm.filters.vehicleType = vm.vehicle.vehicleType.value;
            };
            vm.getOwnershipValue = function () {
                vm.filters.ownership = vm.vehicle.ownership.value;
            };

            vm.agreementTypes = [
                { id: 1, name: "Daily" },
                { id: 2, name: "Weekly" },
                { id: 3, name: "Monthly" },
                { id: 4, name: "Lease" },
                //{ id: 5, name: "LeaseToOwn" }
            ];

            vm.locations = [];
            vm.features = {
                rental: abp.features.isEnabled('CRS.Rental'),
                lease: abp.features.isEnabled('CRS.Lease'),
                chauffeur: abp.features.isEnabled('CRS.Chauffeur'),
                vehicleLog: abp.features.isEnabled("CRS.CustomFeatures.VehicleLog")
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vehicles.Addnew'),
                view: abp.auth.hasPermission('Pages.Tenant.Vehicles.View'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vehicles.Edit'),
                defleet: abp.auth.hasPermission('Pages.Tenant.Vehicles.DeFleet'),
                onfleet: abp.auth.hasPermission('Pages.Tenant.Vehicles.OnFleet'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vehicles.Delete'),
                changeSubStatus: abp.auth.hasPermission('Pages.Tenant.Vehicles.ChangeSubStatus'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vehicles.ViewOtherBranchVehicles'),
                alert: abp.auth.hasPermission('Pages.Tenant.Vehicles.Alerts')
            };

            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.statusChanged = function () {
                vm.filters.notReadyReason = null;

                if (vm.filters.status !== null) {
                    vm.filters.statusId = vm.filters.status.statusId;
                    vm.filters.subStatus = vm.filters.status.subStatus;
                } else {
                    vm.filters.statusId = '';
                    vm.filters.subStatus = null;
                }
                if (vm.filters.enableDateRange === false) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                if (vm.filters.status !== null) {
                    if (vm.filters.status.name === "Hired") {
                        vm.isShowAgreementType = true;
                    } else {
                        vm.isShowAgreementType = false;
                    }
                } else {
                    vm.isShowAgreementType = false;
                }
                vm.agreementType = null;
            };

            //vm.getVehicleSubStatuses = function (substatus) {
            //    return utilities.getVehicleSubStatuses(substatus);
            //};
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchPreUsedVehicleModels(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.getModels = function (makeId) {
                return vehicleModelService.getVehicleModels({ makeId: makeId }).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.setActiveTabIndex = function (index) {
                vm.activeTabIndex = index;
                vm.filters.status = null;

                vm.statusChanged();

                if (index == 1) {
                    vm.getVehicleDashBoard();
                }
                if (index == 2) {
                    vm.filters.type = 1;
                    vm.getVehicleAlerts();
                }
            };


            vm.dueTypeChange = function (dueType) {
                vm.filters.status = null;
                vm.statusChanged();
                vm.filters.type = dueType;
                vm.getVehicleAlerts();
            }

            vm.getVehicleAlerts = function () {
                vm.loading = true;
                if (vm.filters.type == 1) {
                    vehicleDashboardService.getInsuranceAlerts(vm.filters).success(function (data) {
                        vm.vehicleAlertsInsurance = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (vm.filters.type == 2) {
                    vehicleDashboardService.getRegistrationAlerts(vm.filters).success(function (data) {
                        vm.vehicleAlertsRegistration = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (vm.filters.type == 3) {
                    vehicleDashboardService.getServiceAlerts(vm.filters).success(function (data) {
                        vm.vehicleAlertsService = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (vm.filters.type == 4) {
                    vehicleDashboardService.getMileageAlerts(vm.filters).success(function (data) {
                        vm.vehicleAlertsMileage = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                else if (vm.filters.type == 5) {
                    vehicleDashboardService.getVehicleCustomAlerts1(vm.filters).success(function (data) {
                        vm.vehicleCustomAlerts1 = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (vm.filters.type == 6) {
                    vehicleDashboardService.getVehicleCustomAlerts2(vm.filters).success(function (data) {
                        vm.vehicleCustomAlerts2 = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            vm.exportToExcelVehicleAlert = function () {
                vm.loading = true;

                if (vm.filters.type == 1) {
                    vehicleDashboardService.exportToExcelInsuranceAlerts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 2) {
                    vehicleDashboardService.exportToExcelRegisterationAlerts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 3) {
                    vehicleDashboardService.exportToExcelServiceAlerts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 4) {
                    vehicleDashboardService.exportToExcelMileageAlerts(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 5) {
                    vehicleDashboardService.exportToExcelGetVehicleCustomAlerts1(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.type == 6) {
                    vehicleDashboardService.exportToExcelGetVehicleCustomAlerts2(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
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
                    vm.getVehicleAlerts();
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
                    vm.getVehicleAlerts();
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
                    vm.getVehicleAlerts();
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
                    vm.getVehicleAlerts();
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
            }

            function getTariffGroups() {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };

            vm.locationPermission = function (row) {
                if (!vm.permissions.allActionsOnOtherBranch && row.locationId !== appSession.user.locationId)
                    return false;

                return true;
            };
            vm.getMakeAndModel = function (model, modelYear) {
                return model.make + ' ' + model.name + ' ' + modelYear;

            };

            vm.getModelYear = function (model, modelYear) {
                return model.name + ' ' + modelYear;
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

            }

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

            vm.getEmailCount = function () {
                if (vm.filters.type == 4 && vm.isMileageAlertEmailEnabled && vm.vehicleAlertsMileage)
                    return vm.vehicleAlertsMileage.filter(e => e.statusId == 'HIR' && e.email && e.generate).length;
                else if (vm.filters.type == 3 && vm.isServiceAlertEmailEnabled && vm.vehicleAlertsService)
                    return vm.vehicleAlertsService.filter(e => e.statusId == 'HIR' && e.email && e.generate).length;
                else
                    return 0;
            };

            function getMileageAlerts() {
                vm.loading = true;

                vehicleAlertsService.getMileageAlerts(vm.filters).success(function (data) {
                    vm.vehicleAlertsMileage = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

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

            function getServiceAlerts() {
                vm.loading = true;

                vehicleAlertsService.getServiceAlerts(vm.filters).success(function (data) {
                    vm.vehicleAlertsService = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

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
                if (vm.filters.type == 4)
                    sendVehicleMileageAlertEmails();
                else if (vm.filters.type == 3)
                    sendVehicleServiceAlertEmails();
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

            vm.getVehicleType = function (id) {
                if (id === 1)
                    return app.localize("Rental");
                if (id === 2)
                    return app.localize("Lease");
                if (id === 3)
                    return app.localize("Replacement");
                if (id === 4)
                    return app.localize("Limousine");
                else
                    return "";
            };

            vm.getOwnershipName = function (id) {
                if (id === 1)
                    return app.localize("Own");
                if (id === 2)
                    return app.localize("External");
                else
                    return "";
            };
            function getLocationsActiveAndInActive() {

                lookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.getVehicleDashBoard = function () {
                vm.loading = true;

                if (vm.filters.ownership !== 2 || vm.filters.ownership !== 3 ||
                    !vm.filters.enableDateRange || vm.filters.dueType > 0) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                if (vm.filters.statusId === "") {
                    vehicleDashboardService.getAllVehicleDashboard(vm.filters).success(function (data) {
                        vm.vehicleDashBoardData = data;

                        vm.totalVehicleCount = 0;
                        if (data.makes)
                            for (var i in data.makes) {
                                vm.totalVehicleCount += data.makes[i].totalVehicles;
                            }
                        

                    }).finally(function () {
                        setSearchFilter();
                        vm.loading = false;
                        vm.showAvailbleColumns = false;
                        vm.showHiredColumns = false;
                        vm.showNrmColumns = false;
                        vm.showWorkShopColumns = false;
                    });
                }
                else if (vm.filters.status.name === "Available") {
                    vehicleDashboardService.getAvailableVehicleDashboard(vm.filters).success(function (data) {
                        vm.vehicleDashBoardData = data;

                        vm.totalVehicleCount = 0;
                        if (data.makes)
                            for (var i in data.makes) {
                                vm.totalVehicleCount += data.makes[i].totalVehicles;
                            }

                    }).finally(function () {
                        setSearchFilter();
                        vm.loading = false;
                        vm.showAvailbleColumns = true;
                        vm.showHiredColumns = false;
                        vm.showNrmColumns = false;
                        vm.showWorkShopColumns = false;
                    });
                }
                else if (vm.filters.status.name === "Hired") {
                    vm.filters.agreementTypes = [];
                    if (vm.agreementType != null) {
                        vm.agreementType.forEach(function (agrType) {
                            vm.filters.agreementTypes.push(agrType.id);
                        });
                    }
                    vehicleDashboardService.getHiredVehicleDashboard(vm.filters).success(function (data) {
                        vm.vehicleDashBoardData = data;
                        vm.totalVehicleCount = 0;
                        if (data.makes)
                            for (var i in data.makes) {
                                vm.totalVehicleCount += data.makes[i].totalVehicles;
                            }
                        

                    }).finally(function () {
                        setSearchFilter();

                        vm.loading = false;
                        vm.showHiredColumns = true;
                        vm.showAvailbleColumns = false;
                        vm.showNrmColumns = false;
                        vm.showWorkShopColumns = false;
                    });
                }
                else if (vm.filters.status.name === "NRM") {
                    vehicleDashboardService.getNrmVehicleDashboard(vm.filters).success(function (data) {
                        vm.vehicleDashBoardData = data;
                        vm.totalVehicleCount = 0;
                        if (data.makes)
                            for (var i in data.makes) {
                                vm.totalVehicleCount += data.makes[i].totalVehicles;
                            }

                    }).finally(function () {
                        setSearchFilter();
                        vm.loading = false;
                        vm.showNrmColumns = true;
                        vm.showHiredColumns = false;
                        vm.showAvailbleColumns = false;
                        vm.showWorkShopColumns = false;
                    });
                }
                else if (vm.filters.status.name === "Workshop") {
                    vehicleDashboardService.getWorkshopVehicleDashboard(vm.filters).success(function (data) {
                        vm.vehicleDashBoardData = data;
                        vm.totalVehicleCount = 0;
                        if (data.makes)
                            for (var i in data.makes) {
                                vm.totalVehicleCount += data.makes[i].totalVehicles;
                            }
                    }).finally(function () {
                        setSearchFilter();
                        vm.loading = false;
                        vm.showWorkShopColumns = true;
                        vm.showNrmColumns = false;
                        vm.showHiredColumns = false;
                        vm.showAvailbleColumns = false;
                    });
                }
                else if (vm.filters.status.name === "Booked") {
                    vehicleDashboardService.getBookedVehiclesDashboard(vm.filters).success(function (data) {
                        vm.vehicleDashBoardData = data;
                        vm.totalVehicleCount = 0;
                        if (data.makes)
                            for (var i in data.makes) {
                                vm.totalVehicleCount += data.makes[i].totalVehicles;
                            }

                    }).finally(function () {
                        setSearchFilter();
                        vm.loading = false;
                        vm.showWorkShopColumns = false;
                        vm.showNrmColumns = false;
                        vm.showHiredColumns = false;
                        vm.showAvailbleColumns = false;
                    });
                }
                else if (vm.filters.status.name === "Defleeted") {
                    vehicleDashboardService.getDeFleetedVehiclesDashboard(vm.filters).success(function (data) {
                        vm.vehicleDashBoardData = data;

                        vm.totalVehicleCount = 0;
                        if (data.makes)
                            for (var i in data.makes) {
                                vm.totalVehicleCount += data.makes[i].totalVehicles;
                            }

                    }).finally(function () {
                        setSearchFilter();
                        vm.loading = false;
                        vm.showWorkShopColumns = false;
                        vm.showNrmColumns = false;
                        vm.showHiredColumns = false;
                        vm.showAvailbleColumns = false;
                    });
                }
                else if (vm.filters.status.name === "For Sale" || vm.filters.status.name === "Pending Customer Delivery" ||
                    vm.filters.status.name === "Not Ready" || vm.filters.status.name === "Pending Workshop Delivery" ||
                    vm.filters.status.name === "Ready To Go" || vm.filters.status.name === "Total Loss" || vm.filters.status.name === "Custody") {
                    vehicleDashboardService.getVehicleDashboard(vm.filters).success(function (data) {
                        vm.vehicleDashBoardData = data;
                        vm.totalVehicleCount = 0;
                        if (data.makes)
                            for (var i in data.makes) {
                                vm.totalVehicleCount += data.makes[i].totalVehicles;
                            }

                    }).finally(function () {
                        setSearchFilter();
                        vm.loading = false;
                        vm.showWorkShopColumns = false;
                        vm.showNrmColumns = false;
                        vm.showHiredColumns = false;
                        vm.showAvailbleColumns = false;
                    });
                }
            };

            vm.exportToExcel = function () {
                var tab_text = "<style>table tr td {text-align:left;}</style><table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab = document.getElementById("mainDiv");
                
                // id of table
                //for (j = 0; j < 3; j++) {
                //    tab_text = tab_text;
                //    tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
                //}
                vm.vehicleDashBoardData.makes.forEach(function (make) {
                    make.models.forEach(function (model) {
                        var tab1 = document.getElementById(model.model); // id of table
                        for (j = 0; j < tab1.rows.length; j++) {
                            tab_text = tab_text;
                            tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                        }
                    });
                });

                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                if (vm.filters.status != null)
                {
                    a.download = vm.filters.status.name;
                } else
                {
                    a.download = 'Due DeFleet Vehicles';
                }
               
                a.click();

            };

            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }

            function getMakes() {
                vehicleMakeService.getMakes()
                    .success(function (r) {
                        vm.makes = r.items;
                    });
            }

            function init() {
                getLocationsActiveAndInActive();
                getNotReadyReasons();
                getTariffGroups();
                PopulateVehicleTypes(); // make vehilce type array on module enabled basis.
                getMakes();
                vm.getVehicleDashBoard();
            }

            //To show/hide columns for different filter of Due Filter
            vm.searchFilterSet = null;
            function setSearchFilter() {
                if (vm.filters.dueType === "1") vm.searchFilterSet = 'Ins';
                else if (vm.filters.dueType === "2") vm.searchFilterSet = 'Reg';
                else if (vm.filters.dueType === "3") vm.searchFilterSet = 'Ser';
                else if (vm.filters.dueType === "5") vm.searchFilterSet = 'VCA1'; //VehicleCustomAlerts1
                else if (vm.filters.dueType === "6") vm.searchFilterSet = 'VCA2'; //VehicleCustomAlerts2

                else vm.setSearchFilter = null;
            }

            vm.printElement = function () {
                var mywindow = window.open('', 'PRINT');

                mywindow.document.write('<html><head><title>' + document.title + '</title>');
                mywindow.document.write('</head><body >');
                mywindow.document.write('<h1>' + document.title + '</h1>');
                mywindow.document.write(document.getElementById('mainDiv').innerHTML);
                mywindow.document.write('</body></html>');

                mywindow.document.close(); // necessary for IE >= 10
                mywindow.focus(); // necessary for IE >= 10*/

                mywindow.print();
                mywindow.close();

                return true;
            };

            

            init();
        }
    ]);
