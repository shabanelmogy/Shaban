// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:311890-312200
appModule.controller('tenant.views.crs.vehicles.openDamageRevenueLedger', [
        '$scope', '$stateParams', '$uibModal', '$uibModalInstance','uiGridConstants', 'abp.services.app.vehicle', 'vehicleId', 'abp.services.app.journal', 'abp.services.app.account', 'utilities', 'abp.services.app.directory', 'appSession', 'abp.services.app.costCenter',
        function ($scope, $stateParams, $uibModal, $uibModalInstance,uiGridConstants, vehicleService, vehicleId, journalService, accountService, utilities, directoryService, appSession, costCenterService) {

            var vm = this;
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.isDamageRevenueLedgerEnabled = abp.features.isEnabled("CRS.Reports.DamageRevenueLedger");
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.ledger = null;
            vm.isVehicleShow = false;
            vm.isShowSubLookup = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.accounts = [];
            //vm.formatNumber = function (amount) {
            //    if (amount == null) return null;
            //    amount = amount.toFixed(2);
            //    return amount.toLocaleString('en');
            //};
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return Number(amount).toLocaleString('en-US');
            };
            vm.rounding = function (value) {
                //  return utilities.round(value, 2);
                // var result = Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);

                var result = utilities.round(value, 2);
                if (result % 1 != 0) {
                    return result;
                }
                else {
                    return result.toFixed(2);
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            }
            vm.setPrintDateTime = function () {
                vm.printDateTime = moment().format(vm.dateTimeFormat);
            }
            vm.filters = {
                accountId: null,
                fromDate: null,
                costCenterId: null,
                costCenter2Id: null,
                toDate: null,
                state: null,
                locationId: null,
                vehicleId: null,
            };
            vm.clearLocation = function () {
                vm.filters.state = null;
                vm.filters.locationId = null;
                vm.filters.locationName = null;
            };
            vm.stateBranchPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/locations/stateBranchModal.cshtml',
                    controller: 'tenant.views.common.locations.searchContactModal as vm',
                    backdrop: 'static',
                }).result.then(function (branch) {
                    if (branch.id != null) {
                        vm.filters.state = null;
                        vm.filters.locationName = branch.name;
                        vm.filters.locationId = branch.id;
                    }
                    else {
                        vm.filters.locationId = null;
                        vm.filters.state = branch;
                        vm.filters.locationName = branch;

                    }
                });
            };
            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }
            getCostCenters();

            if ($stateParams.filters) {
                vm.loading = true;
                //replace signs back to original 
                $stateParams.filters.account.name = $stateParams.filters.account.name.replaceAll('slash', '/');
                $stateParams.filters.account.name = $stateParams.filters.account.name.replaceAll('-and-', '&');

                vm.dateRangeOptions.startDate = moment($stateParams.filters.fromDate);
                vm.dateRangeOptions.endDate = moment($stateParams.filters.toDate);
                vm.dateRangeModel = {
                    startDate: $stateParams.filters.fromDate,
                    endDate: $stateParams.filters.toDate
                };
                vm.filters = $stateParams.filters;
                vm.filters.accountId = vm.filters.account.id;
                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }


                journalService.getDamageRevenueLedger(vm.filters).success(function (result) {
                    vm.ledger = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getVoucherType = function (type, subType) {
                //if (type == 1) return app.localize('Invoice');
                //else if (type == 2) return app.localize('Receipt');
                //else if (type == 3) return app.localize('Expense');
                //else if (type == 4) return app.localize('Refund');
                //else if (type == 5) return app.localize('Bill');
                //else if (type == 6) return app.localize('JV');
                //else return "";
                return utilities.getVoucherType(type, subType);
            };
            vm.accountChanged = function () {

                vm.filters.contact = null;
                vm.isShowSubLookup = false;


                if (vm.filters.account.contactGroup) {
                    vm.filters.contactShow = false;
                    vm.filters.vehicleId = null;
                    vm.filters.account.contactGroupId = null;
                    vm.filters.accountId = vm.filters.account.id;

                    if (!vm.filters.account.contactGroup.isDefault)
                        vm.filters.account.contactGroupId = vm.filters.account.contactGroup.id;
                    if (vm.filters.account.contactGroup.contactType === 1) {
                        vm.filters.showContactMessage = "Please Select Staff";
                        vm.isShowSubLookup = true;
                    }
                    else if (vm.filters.account.contactGroup.contactType === 2) {
                        vm.filters.showContactMessage = "Please Select Customer";
                        vm.isShowSubLookup = true;
                    }
                    else if (vm.filters.account.contactGroup.contactType === 3) {
                        vm.filters.showContactMessage = "Please Select Supplier";
                        vm.isShowSubLookup = true;
                    }
                    else {
                        vm.filters.showContactMessage = "";
                        vm.isShowSubLookup = false;

                    }
                }
                else if (vm.filters.account.accountCategory === 4 || vm.filters.account.accountCategory === 5) {
                    vm.filters.showVehicleMessage = "Please Select Vehicle";
                    vm.isVehicleShow = true;
                }
                else {
                    vm.filters.contactShow = false;
                    vm.isShowSubLookup = false;
                    vm.filters.contactId = null;
                    vm.filters.contact = null;
                    vm.filters.accountId = vm.filters.account.id;
                    vm.filters.showContactMessage = "";
                }

            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            // search from dropdown
            vm.searchAccounts = function ($select) {
                //get leaf accounts only
                if ($select.search == "") { vm.accounts = null; return null; }
                //return accountService.searchAccounts({ filter: $select.search, isLeaf: true }).then(function (response) {
                //    vm.accounts = response.data.items;
                //});
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            // Searching Contacts
            vm.searchContact = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.clearContact = function () {
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };
            function initDate() {

                if ($stateParams.filters) {
                    vm.dateRangeOptions.startDate = moment($stateParams.filters.fromDate);
                    vm.dateRangeOptions.endDate = moment($stateParams.filters.toDate);
                    vm.dateRangeModel = {


                        startDate: $stateParams.filters.fromDate,
                        endDate: $stateParams.filters.toDate
                    };
                }
            };

            if (abp.auth.hasPermission('Pages.Tenant.Reports.DamageRevenueLedger')) {

                if (vehicleId) {
                    vehicleService.getVehicleById({ id: vehicleId }).then(function (response) {
                        vm.filters.vehicle = response.data;
                        vm.filters.vehicleId = vehicleId;

                    }).finally(function () {
                        vm.getDamageRevenueLedger();
                    });
                }
            }

            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };
            vm.getDamageRevenueLedger = function () {
                vm.loading = true;
                if (!vm.dateRangeModel) {
                    initDate();
                }

                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!angular.isUndefined(vm.filters.account)) {
                    vm.filters.accountId = vm.filters.account.id;
                }
                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                if (vm.isDamageRevenueLedgerEnabled) {
                    if (abp.auth.hasPermission('Pages.Tenant.Reports.DamageRevenueLedger')) {

                        if (vehicleId) {
                            vm.filters.fromDate = moment(moment().format('1970-01-01')).utc(); /*Setting date to 1970 so all the data is fetched on first call*/
                            vm.filters.toDate = moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                        }
                    }
                }
                journalService.getDamageRevenueLedger(vm.filters).success(function (result) {
                    vm.ledger = result;
                    vm.filters.account = vm.ledger.account;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                if (!vm.dateRangeModel) {
                    initDate();
                }
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!angular.isUndefined(vm.filters.account)) {
                    vm.filters.accountId = vm.filters.account.id;
                }

                journalService.exportDamageRevenueLedgerToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
        }
    ]);
