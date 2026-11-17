// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:267886-268293
appModule.controller('tenant.views.crs.reports.darbTollReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.salikAccount', 'abp.services.app.directory', 'abp.services.app.toll', 'utilities',
        function ($scope, $uibModal, uiGridConstants, salikAccountService, directoryService, tollsService, utilities) {
            var vm = this;
            vm.isEnableLease = abp.features.isEnabled("CRS.Lease");
            vm.isEnableRental = abp.features.isEnabled("CRS.Rental");

            vm.loading = false;
            vm.isExternalVehicleEnable = abp.features.isEnabled("CRS_External.Vehicles.Darb.Report");
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' HH:mm';
            vm.customers = [];
            vm.selectedVehicle = null;
            vm.vehicleNoEN = [];
            vm.plateTagNoEN = [];

            vm.filters = {
                enableWithAgreement: false,
                enableWithOutAgreement: false,
                durationType: 1,
                enableDateRange: true,
                fromDate: null,
                fromTime: null,
                toDate: null,
                toTime: null,
                enableInvoiced: false,
                enableUnInvoiced: false,
                server: 2,
                vehicleNoArray: [],
                salikAccount: null,
                location: null,
                direction: null,
                customerId: null,
                debitJvStatus: null,
                tollsShareStatus: null,
                tollsWithFailedVehicleMappings: false,
                externalTollsOnly: null,
                invoiceNo: null,
            }

            vm.statusChanged = function () {
                if (vm.filters.status === 1) {
                    vm.filters.enableWithAgreement = true;
                    vm.filters.enableWithOutAgreement = false;

                }
                else if (vm.filters.status === 2) {
                    vm.filters.enableWithOutAgreement = true;
                    vm.filters.enableWithAgreement = false;
                }
                else {
                    vm.filters.enableWithAgreement = false;
                    vm.filters.enableWithOutAgreement = false;
                }
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.invoiceStatusChanged = function () {
                if (vm.filters.vehicleStatus === 1) {
                    vm.filters.enableInvoiced = true;
                    vm.filters.enableUnInvoiced = false;

                }
                else if (vm.filters.vehicleStatus === 2) {
                    vm.filters.enableUnInvoiced = true;
                    vm.filters.enableInvoiced = false;
                }
                else {
                    vm.filters.enableUnInvoiced = false;
                    vm.filters.enableInvoiced = false;
                }
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };


            function getFiltersDateForSAF() {
                vm.filters.fromDate = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(moment().format('YYYY-MM-DD HH:mm')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.filters.fromTime = moment(new Date()).startOf('day').utc();
                vm.filters.toTime = moment(new Date()).endOf('day').utc();
            };

            function getSalikAccounts() {
                salikAccountService
                    .getSalikAccounts({ id: 2 })
                    .success(function (data) {
                        vm.salikAccounts = data.items;
                        vm.filters.salikAccountId = null;
                    });
            }

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchPlateNo = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;
                return tollsService.getSearchPlateNonew({ name: vm.filters.name, server: 2 }).then(function (response) {
                    vm.vehicleNoEN = response.data.items; //string list of plate numbers
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contactId = null;
            };

            function getInvoiceStatuses() {
                vm.invoiceStatuses = [{ id: 1, name: 'Invoiced' }, { id: 2, name: 'Un-Invoiced' }];
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize('WithAgreement') }, { id: 2, name: app.localize('WithoutAgreement') }];
            };


            vm.getTollsReport = function () {
                if (vm.filters.tollsWithFailedVehicleMappings)
                    vm.gridOptions.columnDefs[0].visible = true;
                else
                    vm.gridOptions.columnDefs[0].visible = false;

                vm.loading = true;
                //vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(vm.filters.fromDate) : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(vm.filters.toDate) : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;

                if (vm.filters.durationType === null) vm.filters.durationType = 1;

                tollsService.getDarbTollsReport(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.attachVehicle = function (toll) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/darbTollsReport/attachVehicleModal.cshtml',
                    controller: 'tenant.views.crs.reports.darbTollReport.attachVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tollData: function () {
                            return toll;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTollsReport();
                });
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
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="row.entity.vehicleId == null" ng-click="grid.appScope.attachVehicle(row.entity)">' + app.localize('AttachVehicle') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PlateNo'),
                        minWidth: 100,
                        field: 'plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                                '<div class=\"ui-grid-cell-contents\">{{row.entity.plateCode + " " + row.entity.plateNo}}</div>' +
                                '</div>'
                    },
                    {
                        name: app.localize('ChasisNo'),
                        minWidth: 100,
                        field: 'chassisNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.chassisNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TollDate'),
                        field: 'date',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.tripDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PostDate'),
                        field: 'date',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                                '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.transactionPostDate)}}</div>' +
                                '</div>'
                    },
                    {
                        name: app.localize('Account'),
                        minWidth: 100,
                        field: 'account'
                    },
                    {
                        name: 'Location',
                        minWidth: 150,
                        field: 'tollGateLocationEN'
                    },
                    {
                        name: app.localize('Direction'),
                        minWidth: 150,
                        field: 'tollGateDirectionEN'
                    },
                    {
                        name: app.localize('DebitJvNo'),
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.debitJVNo}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('Customer'),
                        minWidth: 200,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreementNo ? row.entity.customer : row.entity.movementStaffName}}</div>' +
                            '</div>',
                    },
                    {
                        name: app.localize('AgreementNo'),
                        minWidth: 125,
                        field: 'agreementNo'
                    },
                    {
                        name: app.localize('MovementType'),
                        field: 'movementType',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.movementType}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('Movement No'),
                        field: 'movementNo',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.movementId}}</div>' +
                            '</div>',
                    },
                    {
                        name: app.localize('InvoiceNo'),
                        minWidth: 125,
                        field: 'invoiceNo',
                    },
                    {
                        name: app.localize('Amount'),
                        minWidth: 80,
                        field: 'amount'
                    },
                    {
                        name: app.localize('Surcharge'),
                        minWidth: 100,
                        field: 'surcharge',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('Total'),
                        minWidth: 80,
                        field: 'amountWithSurcharge'
                    },
                    {
                        name: app.localize('DownloadDate'),
                        field: 'date',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                                '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.downloadDate)}}</div>' +
                                '</div>'
                    }
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "tripDateTime desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getTollsReport();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTollsReport();
                    });
                },
                data: []
            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/darbTollsReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                //vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(vm.filters.fromDate) : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(vm.filters.toDate) : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;

                if (vm.filters.durationType === null) vm.filters.durationType = 1;
                tollsService.darbTollReportViewExportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function init() {
                getFiltersDateForSAF();
                getSalikAccounts();
                getInvoiceStatuses();
                getStatuses();
                vm.getTollsReport();
            }

            init();
        }
    ]);
