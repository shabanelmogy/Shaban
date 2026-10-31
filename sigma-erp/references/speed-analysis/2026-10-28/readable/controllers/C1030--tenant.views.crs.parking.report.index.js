// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:275642-276173
appModule.controller('tenant.views.crs.parking.report.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.toll', 'abp.services.app.parkingTicket', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.salikAccount', 'utilities',
        function ($scope, $uibModal, uiGridConstants, tollsService, parkingTicketService, vehicleService, directoryService, salikAccountService, utilities) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });



            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' HH:mm';
            vm.selectedVehicle = null;
            vm.vehicleNoEN = [];
            vm.plateTagNoEN = [];
            var now = new Date();
            var dateTimeOffset = (now.getTimezoneOffset() * 60000);
            vm.enablePrintParkingTollInvoice = abp.features.isEnabled('TMS.Tolls.AllowParkingTicketsPrinting');
            vm.customers = [];

            vm.filters = {
                enableDateRange: true,
                name: "",
                transactionNumber: null,
                plateTagNo: null,
                customerId: null,
                fromDate: null,
                fromTime: null,
                toDate: null,
                toTime: null,
                amount: null,

                enableCharged: false,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                tollsShareStatus: null,
                plateTagNoEN: [],
                vehicleNoEN: [],
                location: null,
                salikAccount: null,
                durationType: 1,
                dateTimeOffset: dateTimeOffset,
                vehicleNoArray: [],
                plateTagNoArray: []
            };



            function getFiltersDateForSAF() {
                vm.filters.fromDate = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(moment().format('YYYY-MM-DD HH:mm')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.filters.fromTime = moment(new Date()).startOf('day').utc();
                vm.filters.toTime = moment(new Date()).endOf('day').utc();
            };


            vm.searchPlateNo = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;
                return parkingTicketService.getSearchPlateNo({ name: vm.filters.name }).then(function (response) {
                    vm.vehicleNoEN = response.data.items; //string list of plate numbers
                });
            };
            vm.searchTagNo = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;
                return parkingTicketService.getSearchTagNo(vm.filters).then(function (response) {
                    vm.plateTagNoEN = response.data.items; //string list of tag numbers
                });
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(-1, 'milliseconds').utc()
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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



            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize('WithAgreement') }, { id: 2, name: app.localize('WithoutAgreement') }];
            };

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
                salikAccountService.getSalikAccountsForExtension({ id: 1 }).success(function (data) {
                    vm.salikAccountId = data.items;
                });
            }

            vm.exportToCsv = function () {
                vm.loading = true;
                tollsService.exportToCsvCustom(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/parkingReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };


            vm.openprintReport = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/tms/tollReport/printTemplates/nationalReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.getTollsReport = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                    vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                }
                if (vm.filters.fromDate > vm.filters.toDate) return;

                if (vm.filters.durationType === null) vm.filters.durationType = 1;

                parkingTicketService.getCRSParkingTickets(vm.filters).success(function (data) {
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


            vm.openParkingInvoicePrintModal = function (row) {
                vm.filters.rowId = row.id;
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/tms/e-parking/report/parkingInvoicePrint.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
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
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: '9%',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.enablePrintParkingTollInvoice" ng-click="grid.appScope.openParkingInvoicePrintModal(row.entity)">' + app.localize('PrintParkingInvoice') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
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
                        name: 'Tag No',
                        minWidth: 100,
                        field: 'plateTagNo'
                    },
                    {
                        name: app.localize('EntryDate'),
                        field: 'date',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDateFormat(row.entity.entryDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ExitDate'),
                        field: 'date',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDateFormat(row.entity.exitDateTime)}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Duration'),
                        minWidth: 100,
                        field: 'parkingHours'
                    },
                    {
                        name: app.localize('DownloadDate'),
                        field: 'date',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.downloadDateTimeUtc)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Account'),
                        minWidth: 100,
                        field: 'salikAccount'
                    },
                    {
                        name: 'Location',
                        minWidth: 150,
                        field: 'location'
                    },
                    {
                        name: app.localize('EntryZone'),
                        minWidth: 150,
                        field: 'entryZone'
                    },
                    {
                        name: app.localize('ExitZone'),
                        minWidth: 150,
                        field: 'exitZone'
                    },
                    {
                        name: app.localize('Customer'),
                        minWidth: 200,
                        field: 'customer'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        minWidth: 125,
                        field: 'agreementNo'
                    },
                    {
                        name: app.localize('InvoiceNo'),
                        minWidth: 125,
                        field: 'invoiceNo'
                    },
                    {
                        name: app.localize('TaxableAmount'),
                        minWidth: 150,
                        field: 'taxableAmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.taxableAmount)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('VatAmount'),
                        minWidth: 150,
                        field: 'vatAmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.vatAmount)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        minWidth: 150,
                        field: 'totalAmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.totalAmount)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Surcharge'),
                        minWidth: 100,
                        field: 'surcharge'
                    },
                    {
                        name: app.localize('TotalAmount'),
                        minWidth: 80,
                        field: 'amountWithSurcharge',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amountWithSurcharge)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PendingAmount'),
                        minWidth: 150,
                        field: 'outstandingAmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.outstandingAmount)}}</div>' +
                            '</div>'
                    },


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
                parkingTicketService.exportToExcelCRS(vm.filters)
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
                    .getSalikAccountsForExtension({ id: 1 })
                    .success(function (data) {
                        vm.accountsByAuthority = data.items;
                    });
            }


            init();
        }
    ]);
