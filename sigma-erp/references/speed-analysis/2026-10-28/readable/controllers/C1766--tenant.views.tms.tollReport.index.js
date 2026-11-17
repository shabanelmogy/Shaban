// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:482426-482986
appModule.controller('tenant.views.tms.tollReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.toll', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.salikAccount',
        function ($scope, $uibModal, uiGridConstants, tollsService, vehicleService, directoryService, salikAccountService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isSharingEnable = abp.features.isEnabled("TMS.ShareTolls");

            vm.isSalikPrintEnable = abp.features.isEnabled("TMS.Print.By.Authority.For.Salik");
            vm.isTollReport2Enable = abp.features.isEnabled("TMS.TollReport2");
            vm.isTollReportVehicleWiseEnable = abp.features.isEnabled("TMS.TollReport.VehicleWise");
            vm.isExportToCsvCustom = abp.features.isEnabled("TMS.TollReport.ExportToCsvCustom");

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
            vm.enablePrintParkingTollInvoice = false;
            vm.enableCompanyCodeSalik = abp.setting.getBoolean('App.General.Salik.EnableCompanyCode');

            vm.filters = {
                enableDateRange: true,
                name: "",
                agreementNo: null,
                plateTagNo: null,
                customerId: null,
                fromDate: null,
                fromTime: null,
                toDate: null,
                toTime: null,
                amount: null,
                server: 1,
                enableCharged: false,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                tollsShareStatus: null,
                plateTagNoEN: [],
                vehicleNoEN: [],
                location: null,
                direction: null,
                salikAccount: null,
                durationType: 1,
                dateTimeOffset: dateTimeOffset,
                vehicleNoArray: [],
                plateTagNoArray: []
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
                endDate: moment(moment().format('YYYY-MM-DD')).add(-1, 'milliseconds').utc()
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


            vm.summaryReport = function () {
                debugger;
                let salikAcc = vm.filters.salikAccountId ? vm.accountsByAuthority.find(a => a.id == vm.filters.salikAccountId).username : 'All';


                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tms/tollReport/summaryReport.cshtml',
                    controller: 'tenant.views.tms.tollReport.summaryReport as vm',
                    size: 'md',
                    backdrop: 'static',

                    resolve: {
                        filters: function () {
                            return vm.filters;
                        },
                        salikAccount: function () {
                            return salikAcc
                        },
                       
                    }
                });

                modalInstance.result.then(function (result) {
                    //Do nothing on pop up
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
                            return '~/App/tenant/views/tms/tollReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.tollReport2 = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/tms/tollReport/tollReport2.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.tollReportVehicleWise = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/tms/tollReport/tollReportVehicleWise.cshtml';
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
                //vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(vm.filters.fromDate) : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(vm.filters.toDate) : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;

                if (vm.filters.durationType === null) vm.filters.durationType = 1;

                tollsService.getTmsTollsReport(vm.filters).success(function (data) {
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

            vm.openParkingInvoicePrintModal = function (row) {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/tms/tollReport/parkingInvoiceReport.cshtml';
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
                        name: app.localize('TollsDate'),
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
                        name: app.localize('Account'),
                        minWidth: 100,
                        field: 'salikAccount'
                    },
                    {
                        name: app.localize('CompanyCode'),
                        minWidth: 100,
                        field: 'companyCode',
                        visible: vm.enableCompanyCodeSalik
                    },
                    {
                        name: app.localize('State'),
                        minWidth: 100,
                        field: 'plateState'
                    },
                    {
                        name: 'Location',
                        minWidth: 150,
                        field: 'tollGateLocationEN'
                    },
                    {
                        name: app.localize('Direction'),
                        minWidth: 100,
                        field: 'tollGateDirectionEN'
                    },
                    {
                        name: app.localize('Amount'),
                        minWidth: 100,
                        field: 'amount'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        minWidth: 150,
                        field: 'agreementNo'
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
                tollsService.exportToExcelTmsSalikTollsReport(vm.filters)
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


                if (vm.isEnableCRS) {
                    getInvoiceStatuses();
                }

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
