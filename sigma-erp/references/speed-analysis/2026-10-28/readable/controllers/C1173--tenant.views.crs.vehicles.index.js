// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:309914-311201
appModule.controller('tenant.views.crs.vehicles.index', [
        '$scope', '$state', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.vehicleStatus', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.vehicleModel', 'abp.services.app.uaeFine', 'abp.services.app.tariffGroup', 'abp.services.app.directory', 'abp.services.app.commonLookup', '$stateParams',
        function ($scope, $state, $uibModal, uiGridConstants, vehicleService, vehicleStatusService, appSession, lookupService, utilities, vehicleModelService, finesService, tariffGroupService, directoryService, commonLookupService, $stateParams) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.models = null;
            vm.vehicleTypes = [];
            vm.server = [];
            vm.trafficFileId = [];
            vm.AcrissTypes = [];
            vm.type = $stateParams.type;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.allowRateTypeChargesWithVehicle = abp.features.isEnabled("CRS.CustomFeatures.AllowRateTypeChargesWithVehicle");
            vm.isDamageRevenueLedgerEnabled = abp.features.isEnabled("CRS.Reports.DamageRevenueLedger");
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.vehicleCustomField1 = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.VehicleCustomField1'));
            vm.vehicle_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_EnableCustomField1"));
            vm.vehicle_EnableInvestor = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Investor"));
            vm.vehicle_EnableMortgage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Mortgage"));
            vm.vehicle_EnableLeaseToOwn = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseToOwn"));
            vm.replacementOfMakeAndModelInGridForVehicles = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ReplacementOfMakeAndModelInGridForVehicles'));
            vm.gpsLocationColoumn = utilities.parseBoolean(abp.setting.get("App.Speed.Common.GPSLocationColoumnInVehicle"));
            vm.showMortgageInVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowMortgageInVehicle"));
            vm.showTransportVehiclesOnlyInTransportAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowTransportVehiclesOnlyInTransportAgreements"));
            vm.showMarkAsLegal = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MarkAsLegal"));


            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            function initPurchaseDate() {
                vm.purchaseDateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.purchaseDateRangeModelChanged = function () {
                vm.filters.purchaseStartDate = vm.purchaseDateRangeModel.startDate != null ? vm.purchaseDateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.purchaseEndDate = vm.purchaseDateRangeModel.endDate != null ? vm.purchaseDateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = dateRangeCheck;
            vm.prchaseDateRangeCheck = purchaseDateRangeCheck;
            function dateRangeCheck() {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };
            function purchaseDateRangeCheck() {
                if (vm.filters.enablePurchaseDateRange) {
                    vm.filters.purchaseStartDate = vm.purchaseDateRangeModel.startDate != null ? vm.purchaseDateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.purchaseEndDate = vm.purchaseDateRangeModel.endDate != null ? vm.purchaseDateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enablePurchaseDateRange) {
                    vm.filters.purchaseStartDate = null;
                    vm.filters.purchaseEndDate = null;
                }
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.isDateBefore = function (paramDate) {
                return (new Date(paramDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0));
            }
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.filters = {
                enableDateRange: false,
                enablePurchaseDateRange: false,
                fleetCode: null,
                vehicleType: null,
                ownership: null,
                plateNo: '',
                statusId: '',
                subStatus: null,
                notReadyReason: null,
                modelId: null,
                server: null,
                locationId: '',
                status: null, //to be used only on client side will have both statusId and subStatus
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                mortgage: null,
                showMarkAsLegal: false,
            };

            vm.statuses = [
                { name: app.localize('Available'), statusId: 'IDL', subStatus: 1 },
                { name: app.localize('Hired'), statusId: 'HIR', subStatus: null },
                { name: app.localize('Booked'), statusId: 'BKD', subStatus: null },
                { name: app.localize('OnNRM'), statusId: 'NRM', subStatus: null },
                { name: app.localize('InWorkshop'), statusId: 'WRK', subStatus: null },
                { name: app.localize('NotReady'), statusId: 'IDL', subStatus: 2 },
                { name: app.localize('ForSale'), statusId: 'IDL', subStatus: 3 },
                { name: app.localize('Defleeted'), statusId: 'DFL', subStatus: null },
                { name: app.localize('TotalLoss'), statusId: 'IDL', subStatus: 4 },
                { name: app.localize('AllActiveDefleeted'), statusId: 'ADFL', subStatus: null },
                { name: app.localize('ReadyToGo'), statusId: 'IDL', subStatus: 7 },
                { name: app.localize('Custody'), statusId: 'IDL', subStatus: 8 },
                { name: app.localize('PendingWorkshopDelivery'), statusId: 'IDL', subStatus: 6 },
                { name: app.localize('PendingCustomerDelivery'), statusId: 'IDL', subStatus: 5 },

            ];

            vm.disbleDateRange = function () {
                if (vm.filters.ownership !== 2 && vm.filters.ownership !== 3) {
                    vm.filters.enableDateRange = false;
                    initDate();
                }
            }


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
                vm.vehicleTypes.push({ key: 'Staff', value: 6 });
                if (vm.showTransportVehiclesOnlyInTransportAgreements) vm.vehicleTypes.push({ key: 'Transportation', value: 7 });
            };
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
            //vm.getStatusToDisplay = function (vehicle) {
            //    if (vehicle == null) return '';

            //    if (vehicle.statusId == 'HIR') return app.localize('Hired');
            //    if (vehicle.statusId == 'NRM') return app.localize('OnNRM');
            //    if (vehicle.statusId == 'WRK') return app.localize('InWorkshop');
            //    if (vehicle.statusId == 'IDL' && vehicle.subStatus == 3) return app.localize('ForSale');
            //    if (vehicle.statusId == 'IDL' && vehicle.subStatus == 4) return app.localize('TotalLoss');
            //    if (vehicle.statusId == 'IDL' && vehicle.subStatus == 2) return app.localize('NotReady');
            //    if (vehicle.statusId == 'IDL' && vehicle.subStatus <= 1) return app.localize('Ready');
            //    if (vehicle.statusId == 'BKD') return app.localize('Booked');
            //    if (vehicle.statusId == 'DFL') return app.localize('Defleeted');

            //    return '';
            //};

            vm.locations = [];

            //vm.vehicleSubstatusArray = utilities.getVehicleSubStatusesArray();
            vm.features = {
                rental: abp.features.isEnabled('CRS.Rental'),
                lease: abp.features.isEnabled('CRS.Lease'),
                chauffeur: abp.features.isEnabled('CRS.Chauffeur'),
                vehicleLog: abp.features.isEnabled("CRS.CustomFeatures.VehicleLog"),
                fines: abp.features.isEnabled("CRS.Fines"),

            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vehicles.Addnew'),
                view: abp.auth.hasPermission('Pages.Tenant.Vehicles.View'),
                viewBooking: abp.auth.hasPermission('Pages.Tenant.Bookings'),
                openDamageRevenueLedgerPermission: abp.auth.hasPermission('Pages.Tenant.Reports.DamageRevenueLedger'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vehicles.Edit'),
                defleet: abp.auth.hasPermission('Pages.Tenant.Vehicles.DeFleet'),
                onfleet: abp.auth.hasPermission('Pages.Tenant.Vehicles.OnFleet'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Vehicles.ExportToExcel'),
                detailExportToExcel: abp.auth.hasPermission('Pages.Tenant.Vehicles.ExportToExcelDetailed'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vehicles.Delete'),
                changeSubStatus: abp.auth.hasPermission('Pages.Tenant.Vehicles.ChangeSubStatus'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vehicles.ViewOtherBranchVehicles'),
                alert: abp.auth.hasPermission('Pages.Tenant.Vehicles.Alerts'),
                tariff: abp.auth.hasPermission('Pages.Tenant.Tariff')
                    || abp.auth.hasPermission('Pages.ERS.Rental.Tariff')
                    || abp.auth.hasPermission('Pages.ERS.Lease.Tariff')
            };

            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.statusChanged = function () {
                if (vm.filters.status != null) {
                    vm.filters.statusId = vm.filters.status.statusId;
                    vm.filters.subStatus = vm.filters.status.subStatus;
                } else {
                    vm.filters.statusId = '';
                    vm.filters.subStatus = null;
                }
            };
            vm.vehicleMortgage = [
                { id: 1, name: app.localize("Mortgage") },
                { id: 2, name: app.localize("NonMortgage") }
            ];


            //vm.getVehicleSubStatuses = function (substatus) {
            //    return utilities.getVehicleSubStatuses(substatus);
            //};
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchPreUsedVehicleModels(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            vm.searchvehicleOwners = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.vehicleOwners = response.data.items;
                });
            };
            vm.searchvehicleOwnersPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return null;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.vehicleOwner = customer;
                    }
                });
            };
            function getTariffGroups() {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };

            vm.locationPermission = function (row) {
                if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                    return false;

                return true;
            };
            vm.getMakeAndModel = function (model, modelYear) {
                return model.make + ' ' + model.name + ' ' + modelYear;

            };

            vm.getModelYear = function (model, modelYear) {
                return model.name + ' ' + modelYear;
            };

            vm.getVehicleType = function (id) {
                if (id == 1)
                    return app.localize("Rental")
                if (id == 2)
                    return app.localize("Lease")
                if (id == 3)
                    return app.localize("Replacement")
                if (id == 4)
                    return app.localize("Limousine")
                else
                    return "";
            };

            vm.getOwnershipName = function (id) {
                if (id == 1)
                    return app.localize("Own")
                if (id == 2)
                    return app.localize("External")
                else
                    return "";
            };
            vm.getMortgageName = function (id) {
                if (id == 0)
                    return app.localize("NonMortgage")
                if (id == 1)
                    return app.localize("Mortgage")
            };
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: ' ',
                        width: "4%",
                        enableSorting: false,
                        cellTemplate:
                            //grid.appScope.permissions.onfleet &&
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewVehicle(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editVehicle(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openStatusDetailModal(row.entity)">' + app.localize('StatusDetail') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.vehiclePrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.changeSubStatus && row.entity.statusId != \'DFL\' && grid.appScope.locationPermission(row.entity) && row.entity.statusId == \'IDL\' && row.entity.subStatus != 8" ng-click="grid.appScope.changeVehicleStatus(row.entity)">' + app.localize('ChangeSubStatus') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.defleet && row.entity.statusId == \'IDL\' && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.defleetVehicle(row.entity)">' + app.localize('Defleet') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.onfleet && row.entity.statusId == \'DFL\' && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.onfleetVehicle(row.entity)">' + app.localize('Onfleet') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.alert && row.entity.statusId != \'DFL\' && row.entity.statusId == \'IDL\' && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.updateMileage(row.entity)">' + app.localize('UpdateMileage') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.features.rental || grid.appScope.features.lease || grid.appScope.features.chauffeur" ng-click="grid.appScope.viewAgreementsHistoryModal(row.entity)">' + app.localize('ViewAgreementsHistory') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deleteVehicle(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isDamageRevenueLedgerEnabled&& grid.appScope.permissions.openDamageRevenueLedgerPermission" ng-click="grid.appScope.damageRevenueLedger(row.entity)">' + app.localize('OpenDamageRevenueLedger') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.features.vehicleLog"  ng-click="grid.appScope.openVehicleLogsModal(row.entity)">' + app.localize('VehicleLogs') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.vehicle_EnableInvestor" ng-click="grid.appScope.openInvestorLogsModal(row.entity)">' + app.localize('InvestorLogs') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.tariff && row.entity.tariffGroupId" ng-click="grid.appScope.defineTariff(row.entity)">' + app.localize('ViewTariff') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.viewBooking" ng-click="grid.appScope.viewBooking(row.entity)">' + app.localize('ViewBookings') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.showMarkAsLegal && row.entity.statusId == \'IDL\' && row.entity.subStatus == 3 && !row.entity.isLegal" ng-click="grid.appScope.markAsLegalVehicle(row.entity)">' + app.localize('MarkAsLegal') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.showMarkAsLegal && row.entity.statusId == \'IDL\' && row.entity.subStatus == 3 && row.entity.isLegal" ng-click="grid.appScope.unMarkAsLegalVehicle(row.entity)">' + app.localize('UnmarkAsLegal') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PlateNo'),
                        width: "10%",
                        field: 'plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.plateNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.ownership==2" class="label label-danger">' + app.localize('External') + '</span>' +
                            ' <span  ng-show="row.entity.ownership==8" class="label label-warning">' + app.localize('Mortgage') + '</span>' +
                            ' <span  ng-show="row.entity.ownership==9" class="label label-success">' + app.localize('LeaseToOwn') + '</span>' +
                            '</div>'
                    },
                       //{
                    //    name: app.localize('VehicleCustomField1'),
                    //    visible: vm.vehicle_EnableCustomField1,
                    //    width: "10%",
                    //    field: 'customField1',
                    //    cellTemplate:
                    //        '<div class="ui-grid-cell">' +
                    //        '<div class="ui-grid-cell-contents">{{row.entity.customField1}}</div>' +
                    //        '</div>',

                    //},
                    ...(vm.vehicle_EnableCustomField1 && vm.gpsLocationColoumn ? [{
                        name: app.localize('VehicleCustomField1'),
                        width: "10%",
                        field: 'customField1',
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents">{{row.entity.customField1}}</div>' +
                            '</div>'
                    }] : []),
                    ...!vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('Make'),
                        width: "10%",
                        field: 'model.make.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.model.make}}</div>' +
                            '</div>'
                    }] : [],
                    ...!vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('Model'),
                        field: 'model.name',
                        width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getModelYear(row.entity.model,row.entity.modelYear)}}</div>' +
                            '</div>'
                    }] : [],
                    {
                        name: app.localize('VehicleType'),
                        width: "10%",
                        field: 'tariffGroup.title'
                    },

                    {
                        name: app.localize('Color'),
                        width: "10%",
                        field: 'exteriorColor',
                    },
                    {
                        name: app.localize('DailyRentRate'),
                        width: "10%",
                        type: 'number',
                        /*displayName: 'D / PRICE',*/
                        field: 'dailyRentRate',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center;">{{ grid.appScope.CurrencyFormate(row.entity.dailyRentRate) }}</div>',


                    },
                    {
                        name: app.localize('MonthlyRentRate'),
                        width: "10%",
                        /*displayName: 'M / PRICE',*/
                        type: 'number',
                        field: 'monthlyRentRate',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center;">{{ grid.appScope.CurrencyFormate(row.entity.monthlyRentRate) }}</div>',


                    },

                    //{
                    //    name: app.localize('WeeklyCDWRate'),
                    //    width: "15%",
                    //    type: 'number',
                    //    field: 'weeklyCDWRate',
                    //    visible: vm.allowRateTypeChargesWithVehicle,

                    //},
                    {
                        name: app.localize('DailyCDWRate'),
                        width: "9%",
                        /*displayName: 'CDW / D',*/
                        type: 'number',
                        field: 'dailyCDWRate',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center;">{{ grid.appScope.CurrencyFormate(row.entity.dailyCDWRate) }}</div>',

                    },
                    {
                        name: app.localize('MonthlyCDWRate'),
                        width: "9%",
                        /*displayName: 'CDW / M',*/
                        type: 'number',
                        field: 'monthlyCDWRate',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center;">{{ grid.appScope.CurrencyFormate(row.entity.monthlyCDWRate) }}</div>',


                    },
                    //{
                    //    name: app.localize('OneTimeExtra2Charges'),
                    //    width: "12%",
                    //    type: 'number',
                    //    field: 'oneTimeExtra2Charges',
                    //    visible: vm.allowRateTypeChargesWithVehicle,
                    //    cellTemplate: '<div style="color: #337ab7; text-align: center; ">{{ grid.appScope.CurrencyFormate(row.entity.oneTimeExtra2Charges) }}</div>',


                    //},
                    {
                        name: app.localize('DailyExtra2Charges'),
                        width: "11%",
                        type: 'number',
                        field: 'dailyExtra2Charges',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center; ">{{ grid.appScope.CurrencyFormate(row.entity.dailyExtra2Charges) }}</div>',


                    },
                    {
                        name: app.localize('MonthlyExtra2Charges'),
                        width: "11%",
                        type: 'number',
                        field: 'monthlyExtra2Charges',
                        visible: vm.allowRateTypeChargesWithVehicle,
                        cellTemplate: '<div style="color: #337ab7; text-align: center; ">{{ grid.appScope.CurrencyFormate(row.entity.monthlyExtra2Charges) }}</div>',


                    },


                    {
                        name: app.localize('Status'),
                        field: 'status.name',
                        width: "10%",
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents" ng-style="{color: row.entity.statusId === \'HIR\' || row.entity.statusId === \'WRK\' ? \'red\' : (row.entity.status === \'Available\' ? \'green\' : \'black\')}">' +
                            '{{grid.appScope.localize(row.entity.status)}}' +
                            '<small ng-if="row.entity.statusId == \'IDL\' && row.entity.subStatus == 2 && row.entity.notReadyReason">({{row.entity.notReadyReason}})</small>' +
                            '<small ng-if="row.entity.statusId == \'IDL\' && row.entity.subStatus == 3 && row.entity.isLegal && grid.appScope.showMarkAsLegal" style= "color:red"> (Legal)</small>' +
                            '</div>' +
                            '</div>',

                    },
                    {
                        name: app.localize('Location'),
                        width: "10%",
                        field: 'location.name'
                    },
                    {
                        name: app.localize('KMs'),
                        width: "8%",
                        type: 'number',
                        field: 'kMs',
                    },
                    {
                        name: app.localize('Fuel'),
                        field: 'fuelLevel',
                        width: "8%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getFuelLevel(row.entity.fuelLevel)}}</div>' +
                            '</div>'
                    },
                    ... vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('Make'),
                        width: "10%",
                        field: 'model.make.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.model.make}}</div>' +
                            '</div>'
                    }] : [],
                    ... vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('Model'),
                        field: 'model.name',
                        width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getModelYear(row.entity.model,row.entity.modelYear)}}</div>' +
                            '</div>'
                    }] : [],
                    {
                        name: app.localize('RegistrationExpiry'),
                        field: 'nextRegistrationDate',
                        width: "10%",
                        cellTemplate: '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents" ng-style="{color: (row.entity.nextRegistrationDate!=null && grid.appScope.isDateBefore(row.entity.nextRegistrationDate)) ? \'red\' : \'black\'}">' +
                            '{{ grid.appScope.getlocalDate(row.entity.nextRegistrationDate) }}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('InsuranceExpiry'),
                        field: 'nextInsuranceDate',
                        width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" ng-style="{color: (row.entity.nextInsuranceDate!=null && grid.appScope.isDateBefore(row.entity.nextInsuranceDate)) ? \'red\' : \'black\'}"' +
                            '> {{ grid.appScope.getlocalDate(row.entity.nextInsuranceDate) }}</div > ' +
                            '</div>'
                    },
                    {
                        name: app.localize('FleetCode'),
                        width: "10%",
                        type: 'number',
                        field: 'fleetCode',
                        

                    },
                    {
                        name: app.localize('EngineCapacity'),
                        width: "10%",
                        field: 'engineCapacity',
                    },
                    ...(vm.vehicle_EnableCustomField1 && !vm.gpsLocationColoumn ? [{
                        name: app.localize('VehicleCustomField1'),
                        width: "10%",
                        field: 'customField1',
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents">{{row.entity.customField1}}</div>' +
                            '</div>'
                    }] : []),


                    //{
                    //    name: app.localize('WeeklyRentRate'),
                    //    width: "15%",
                    //    type: 'number',
                    //    field: 'weeklyRentRate',
                    //    visible: vm.allowRateTypeChargesWithVehicle,

                    //},








                    //{
                    //    name: app.localize('VehicleOwner'),
                    //    width: "10%",
                    //    field: 'supplier.name'
                    //}
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getVehicles();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getVehicles();
                    });
                },
                data: []
            };
            function getLocationsActiveAndInActive() {

                lookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.openVehicleLogsModal = function (vehicle) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/createOrShowVehicleLogsModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.createOrShowVehicleLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicle: function () {
                            return vehicle;
                        }
                    }
                });
            };
            vm.vehiclePrintModal = function (vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vehicles.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            };
            vm.openInvestorLogsModal = function (vehicle) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/investorLogsModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.investorLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicle: function () {
                            return vehicle;
                        }
                    }
                });
            };


            function openViewAgreementsHistoryModal(VehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/viewAgreementsHistoryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.viewAgreementsHistoryModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        VehicleId: VehicleId,
                        ContactId: null
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };

            vm.viewAgreementsHistoryModal = function (Vehicle) {
                openViewAgreementsHistoryModal(Vehicle.id);
            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vehicles/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.detailReport = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vehicles/detailReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.updateMileage = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/updateMileageAlertModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.updateMileageAlertModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        mileageAlert: function () {
                            return {
                                id: row.id,
                                plateNo: row.plateNo,
                                kms: row.kMs
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };


            var tfCopy = [];
            function getFiltersData() {
                finesService.getFiltersData().success(function (data) {

                    finesService.getFiltersData().success(function (data) {
                        vm.trafficFileId.push({ name: '', id: 0, state: '' })
                        angular.forEach(data.trafficFileId, function (value, key) {
                            vm.trafficFileId.push({ name: value.name, id: value.id, state: value.state });
                        });
                        tfCopy = angular.copy(vm.trafficFileId);
                    });
                    angular.forEach(data.server, function (value, key) {
                        vm.server.push({ name: value.name, id: value.name });
                    });

                });
            }

            vm.openStatusDetailModal = function (vehicle) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/statusDetailModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.statusDetailModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicle: function () {
                            return vehicle;
                        }
                    }
                });
            };

            vm.clearVehicleOwner = function () {
                vm.filters.vehicleOwner = null;
                vm.filters.vehicleOwnerId = null;
            };

            vm.getNotReadyReason = function ($select) {
                if (!$select.search) return;
                return commonLookupService.getNotReadyReasons({ keyword: $select.search }).then(function (response) {
                    vm.notReadyReasons = response.data;
                });
            };

            vm.clearNotReadyReason = function () {
                vm.filters.notReadyReason = null;
                vm.filters.notReadyReasonId = null;
            };

            vm.stateChanged = function () {

                vm.filters.trafficFileId = null;
                if (!vm.filters.server) {
                    vm.trafficFileId = tfCopy;
                }
                else {
                    vm.trafficFileId = tfCopy.filter(c => c.state.toLowerCase() === vm.filters.server.toLowerCase());
                }
            }
            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getVehicles();
                    eventOnKeyPress.preventDefault();
                }
            }
            vm.getVehicles = function () {
                vm.loading = true;

                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                purchaseDateRangeCheck();
                if (vm.vehicle) {
                    if (vm.vehicle.model)
                        vm.filters.modelId = vm.vehicle.model.id;
                }
                if (vm.filters.vehicleOwner != null) {
                    vm.filters.vehicleOwnerId = vm.filters.vehicleOwner.id;
                }
                if (vm.filters.ownership != 2) {
                    vm.filters.vehicleOwnerId = null;
                    vm.filters.vehicleOwner = null;
                }

                if (vm.filters.notReadyReason != null) {
                    vm.filters.notReadyReasonId = vm.filters.notReadyReason.id;
                }
                if (vm.filters.statusId == 'ADFL') {
                    var tempStatusId = vm.filters.statusId;
                    vm.filters.allActive = true;
                    vm.filters.statusId = '';
                } else
                    vm.filters.allActive = false;

                if (vm.showMortgageInVehicle) {
                    if (vm.filters.mortgage === 1) {
                        vm.filters.isMortgage = true;
                    } else if (vm.filters.mortgage === 2) {
                        vm.filters.isMortgage = false;
                    } else {
                        vm.filters.isMortgage = null; // important!
                    }
                }
                vm.filters.serverArr = [];
                if (vm.filters.statusId == 'BKD') {
                    vm.filters.dontPaginate = false;
                    vehicleService.getBookedVehicles(vm.filters).success(function (data) {

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                        if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate == null && !vm.dateRangeModel.startDate == null))
                            initDate();
                        initPurchaseDate();

                    }).finally(function () {
                        vm.loading = false;
                    });
                } else {
                    vehicleService.getVehicles(vm.filters).success(function (data) {

                        if (vm.filters.allActive) {

                            vm.filters.statusId = tempStatusId;
                        }
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                        if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate == null && !vm.dateRangeModel.startDate == null) || !vm.dateRangeModel || !vm.purchaseDateRangeModel || (!vm.purchaseDateRangeModel.endDate == null && !vm.purchaseDateRangeModel.startDate == null)) {
                            initDate();
                            initPurchaseDate();
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });

                }
            };
            vm.clearModel = function () {
                vm.vehicle.model = null;
                vm.filters.modelId = null;
            };

            vm.viewVehicle = function (vehicle) {
                openViewVehicleModal(vehicle.id);
            };

            function openViewVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/viewModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            }
            vm.viewBooking = function (vehicle) {
                openViewBookingModal(vehicle.plateNo);
            };

            function openViewBookingModal(vehiclePlateNo) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/viewBookingModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.viewBookingModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehiclePlateNo: function () {
                            return vehiclePlateNo;
                        }
                    }
                });
            }
            vm.defleetVehicle = function (vehicle) {

                opendefleetVehicleModal(vehicle.id);
            };

            function opendefleetVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/defleetModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.defleetModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };

            vm.changeVehicleStatus = function (vehicle) {

                openchangeVehicleStatusModal(vehicle.id);
            };

            function openchangeVehicleStatusModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/changeStatus.cshtml',
                    controller: 'tenant.views.crs.vehicles.changeStatus as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };
            vm.onfleetVehicle = function (vehicle) {

                openOnfleetVehicleModal(vehicle.id);
            };

            function openOnfleetVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/onfleetModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.onfleetModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            };
            // Export To Excel Functionality
            vm.exportToExcel = function () {
                vm.loading = true;

                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                purchaseDateRangeCheck();
                if (vm.filters.statusId == 'ADFL') {
                    var tempStatusId = vm.filters.statusId;
                    vm.filters.allActive = true;
                    vm.filters.statusId = '';
                } else
                    vm.filters.allActive = false;

                if (vm.showMortgageInVehicle) {
                    if (vm.filters.mortgage === 1) {
                        vm.filters.isMortgage = true;
                    } else if (vm.filters.mortgage === 2) {
                        vm.filters.isMortgage = false;
                    } else {
                        vm.filters.isMortgage = null; // important!
                    }
                }
                vehicleService.exportToExcel(vm.filters).success(function (result) {
                    if (vm.filters.allActive) {

                        vm.filters.statusId = tempStatusId;
                    }
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            // Export To Excel Functionality
            vm.vehicleDetailExportToExcel = function () {
                vm.loading = true;
                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                purchaseDateRangeCheck();
                if (vm.filters.statusId == 'ADFL') {
                    var tempStatusId = vm.filters.statusId;
                    vm.filters.allActive = true;
                    vm.filters.statusId = '';
                } else
                    vm.filters.allActive = false;
                if (vm.showMortgageInVehicle) {
                    if (vm.filters.mortgage === 1) {
                        vm.filters.isMortgage = true;
                    } else if (vm.filters.mortgage === 2) {
                        vm.filters.isMortgage = false;
                    } else {
                        vm.filters.isMortgage = null; // important!
                    }
                }
                vehicleService.getVehiclesDetailExportToExcel(vm.filters).success(function (result) {
                    if (vm.filters.allActive) {

                        vm.filters.statusId = tempStatusId;
                    }
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            //function getVehicleStatuses() {
            //    vm.loading = true;
            //    vehicleStatusService.getVehicleStatuses({}).success(function (data) {
            //        vm.statuses = data.items;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            function getFiltersData1() {

            }
            function openCreateOrEditVehicleModal(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
            }

            function openDamageRevenueLedger(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/openDamageRevenueLedger.cshtml',
                    controller: 'tenant.views.crs.vehicles.openDamageRevenueLedger as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });                
            }


            vm.damageRevenueLedger = function (vehicle) {
                openDamageRevenueLedger(vehicle.id);
            };
            vm.createVehicle = function () {
                openCreateOrEditVehicleModal(null);
            };

            vm.editVehicle = function (vehicle) {
                openCreateOrEditVehicleModal(vehicle.id);
            };

            vm.deleteVehicle = function (vehicle) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', vehicle.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vehicleService.deleteVehicle({
                                id: vehicle.id
                            }).success(function () {
                                vm.getVehicles();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.markAsLegalVehicle = function (vehicle) {
                abp.message.confirm('You want to mark as legal?', function (isConfirmed) {
                    if (isConfirmed) {
                        vm.updateVehicleLegalStatus(vehicle.id, true);
                    }
                });
            };

            vm.unMarkAsLegalVehicle = function (vehicle) {
                abp.message.confirm('You want to unmark as legal?', function (isConfirmed) {
                    if (isConfirmed) {
                        vm.updateVehicleLegalStatus(vehicle.id, false);
                    }
                });
            };
            vm.updateVehicleLegalStatus = function (vehicleId, markAsLegal) {
                vm.loading = true;

                vehicleService.updateSaleVehicleLegalStatus(vehicleId, markAsLegal)
                    .success(function () {
                        if (markAsLegal) {
                            abp.notify.success('Marked as legal successfully.');
                        } else {
                            abp.notify.success('Unmarked as legal successfully.');
                        }
                        vm.getVehicles();
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };
            //vm.defleetVehicle = function (vehicle) {
            //    abp.message.confirm(
            //        app.localize('VehicleDefleetWarningMessage', vehicle.name),
            //        function(isConfirmed) {
            //            if (isConfirmed) {
            //                vehicleService.defleetVehicle({
            //                    id: vehicle.id
            //                }).success(function() {
            //                    vm.getVehicles();
            //                    abp.notify.success(app.localize('SuccessfullyDefleeted'));
            //                });
            //            }
            //        }
            //    );
            //};


            vm.getAccrissCode = function () {
                var selectedAcrissCategoryTypeCode = "";
                if (vm.filters.acrissCategoryId != null) {
                    selectedAcrissCategoryTypeCode = vm.AcrissCategoryTypes.filter(function (obj) {
                        return obj.id === vm.tariffGroup.acrissCategoryId;
                    })[0].code;
                }


                var selectedAcrissTypeCode = "";
                if (vm.filters.acrissTypeId != null) {
                    selectedAcrissTypeCode = vm.AcrissTypes.filter(function (obj) {
                        return obj.id === vm.filters.acrissTypeId;
                    })[0].code;
                }
                vm.filters.accrissCode = selectedAcrissCategoryTypeCode + selectedAcrissTypeCode;
            }

            function getAcrissTypes() {
                vm.loading = true;
                vehicleService.getVehicleTariffGroupAcrissTypes({}).success(function (data) {
                    angular.forEach(data,
                        function (item) {
                            if (item != null && item != 'null') {
                                var acrissType = new Object();
                                acrissType.id = item.id;
                                acrissType.name = item.name;//+ " (" + item.code + ")";
                                acrissType.code = item.code;
                                vm.AcrissTypes.push(acrissType);
                            }
                        });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.defineTariff = function (tariffGroup) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffs/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.tariffs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tariffGroup: function () {
                            return tariffGroup.tariffGroup.title;
                        },
                        tariffGroupId: function () {
                            return tariffGroup.tariffGroup.id;
                        },
                        toViewInVehicles: function () {
                            return true;
                        },
                    }
                });
            };

            function init() {
                getTariffGroups();
                getAcrissTypes();
                getLocationsActiveAndInActive();
                vm.getVehicles();
                PopulateVehicleTypes(); // make vehilce type array on module enabled basis.
                getFiltersData();
                if (vm.vehicle_EnableMortgage) {
                    vm.vehicleOwnerships.push({ key: 'Mortgage', value: 8 })
                }
                if (vm.vehicle_EnableLeaseToOwn) {
                    vm.vehicleOwnerships.push({ key: 'LeaseToOwn', value: 9 })
                }
            }

            init();
        }
    ]);
