// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:285825-286333
appModule.controller('tenant.views.crs.reports.tollReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.toll', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.salikAccount', 'utilities',
        function ($scope, $uibModal, uiGridConstants, tollsService, vehicleService, directoryService, salikAccountService, utilities) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.isExternalVehicleEnable = abp.features.isEnabled("CRS_External.Vehicles.Salik.Report");
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
                isAgreementClosing: false,
                enableDateRange: true,
                name: "",
                vehicleId: null,
                agreementNo: null,
                plateTagNo: null,
                customerId: null,
                fromDate: null,
                fromTime: null,
                toDate: null,
                toTime: null,
                amount: null,
                vehicleNo: null,
                server: null,
                enableWithAgreement: false,
                enableWithOutAgreement: false,
                enableInvoiced: false,
                enableUnInvoiced: false,
                enableCharged: false,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                ContactId: null,
                tollsShareStatus: null,
                transactionNumber: null,
                plateTagNoEN: [],
                vehicleNoEN: [],
                location: null,
                direction: null,
                salikAccount: null,
                durationType: 1,
                vehicleNoArray: [],
                plateTagNoArray: [],
                debitJvStatus: null,
                externalTollsOnly: null,
                invoiceNo: null,
            };

            vm.tollServer = [
                {
                    id: 1,
                    name: 'Dubai'
                },
                {
                    id: 2,
                    name: 'Abu Dhabi'
                }];

            function getFiltersDateForSAF() {
                vm.filters.fromDate = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(moment().format('YYYY-MM-DD HH:mm')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.filters.fromTime = moment(new Date()).startOf('day').utc();
                vm.filters.toTime = moment(new Date()).endOf('day').utc();
            };

            //function getFiltersData() {
            //    tollsService.getFiltersData().success(function (data) {
            //        //angular.forEach(data.items, function (value, key) {
            //        //    vm.vehicleNoEN.push({ name: value.plateNo, id: value.plateNo });
            //        //});
            //        angular.forEach(data.items, function (value, key) {
            //            vm.plateTagNoEN.push({ name: value.plateTagNo, id: value.plateTagNo });
            //        });
            //    });
            //};
            vm.searchPlateNo = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;
                return tollsService.getSearchPlateNo({ name: vm.filters.name, server: 1 }).then(function (response) {
                    vm.vehicleNoEN = response.data.items; //string list of plate numbers
                });
            };
            vm.searchTagNo = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;
                return tollsService.getSearchTagNo(vm.filters).then(function (response) {
                    vm.plateTagNoEN = response.data.items; //string list of tag numbers
                });
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
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
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contactId = null;
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer !== null) {
                        vm.filters.customer = customer;
                        vm.filters.contactId = customer.id;
                    }
                });
            };

            vm.CurrencyFormate = function (amount) {
                if (amount === null) return null;
                return amount.toLocaleString('en');
            };


            vm.movementType = [
                { type: "Agreement (Customer)", id: 1 },
                { type: "NRM (Staff)", id: 2 },
                { type: "Un-Identified", id: 3 },
                { type: "Collection Movement", id: 4 }

            ];

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize('WithAgreement') }, { id: 2, name: app.localize('WithoutAgreement') }];
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

            function getInvoiceStatuses() {
                vm.invoiceStatuses = [{ id: 1, name: 'Invoiced' }, { id: 2, name: 'Un-Invoiced' }];
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

            function getSalikAccount() {
                salikAccountService.getSalikAccounts({ id: 1 }).success(function (data) {
                    vm.accountsByAuthority = data.items;
                });
            }

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/tollReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.getTollsReport = function () {

                vm.loading = true;
                //vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(vm.filters.fromDate) : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(vm.filters.toDate) : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;

                if (vm.filters.durationType === null) vm.filters.durationType = 1;

                tollsService.getTollsReportCRS(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.getDateFormat = function (date) {
                if (date !== null) {
                    return moment.utc(date).format(vm.dateTimeFormat);
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

            vm.getServerName = function (server) {
                if (server === 1) {
                    return app.localize('Dubai');
                }
                else if (server === 2) {
                    return app.localize('AbuDhabi');
                }
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
                        name: app.localize('TransactionNo'),
                        minWidth: 150,
                        field: 'transactionId'
                    },
                    {
                        name: app.localize('PlateNo'),
                        minWidth: 100,
                        field: 'plateNo'
                    },
                    {
                        name: app.localize('ChasisNo'),
                        minWidth: 100,
                        field: 'chassisNo'
                    },
                    {
                        name: app.localize('TagNo'),
                        minWidth: 100,
                        field: 'plateTagNo'
                    },
                    {
                        name: app.localize('TollDate'),
                        field: 'date',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDateFormat(row.entity.tripDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PostDate'),
                        field: 'date',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDateFormat(row.entity.transactionPostDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SalikAccount'),
                        minWidth: 150,
                        field: 'salikAccount'
                    },
                    {
                        name: app.localize('Location'),
                        minWidth: 150,
                        field: 'tollGateLocationEN'
                    },
                    {
                        name: app.localize('Direction'),
                        minWidth: 100,
                        field: 'tollGateDirectionEN'
                    },
                    {
                        name: app.localize('DebitJvNo'),
                        width: 140,
                        //field: 'debitJvVoucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.debitJVNo}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('Customer'),
                        minWidth: 200,
                        //field: 'customer',
                        cellTemplate: '<div class=\"ui-grid-cell\"' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreementNo ? row.entity.customer : row.entity.movementStaffName}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
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
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.movementType}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('MovementNo'),
                        field: 'movementNo',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
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
                        field: 'surcharge'
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

            vm.exportToExcel = function () {
                vm.loading = true;
                //vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(vm.filters.fromDate) : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(vm.filters.toDate) : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;

                if (vm.filters.durationType === null) vm.filters.durationType = 1;
                tollsService.salikTollReportViewExportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.searchOrganizationContactPopup = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    vm.filters.contactId = result.id;
                    vm.filters.customer = result.name;
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.contactId = null;
            };

            function init() {
                getSalikAccounts();
                getFiltersDateForSAF();
                //getFiltersData();
                getSalikAccount();
                vm.getTollsReport();
                getStatuses();


                getInvoiceStatuses();

            }

            function getSalikAccounts() {
                salikAccountService
                    .getSalikAccounts({ id: 2 })
                    .success(function (data) {
                        tollAccounts = data.items;
                        vm.filters.salikAccountId = null;
                    });
            }


            init();
        }
    ]);
