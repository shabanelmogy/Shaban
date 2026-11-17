// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:98963-99369
appModule.controller('tenant.views.common.hrm.payrolls.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.person', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.payroll', 'abp.services.app.salaryVoucher', 'utilities', 'abp.services.app.businessUnit',
        function ($scope, $uibModal, uiGridConstants, personService, appSession, commonLookupService, payrollService, salaryVouchersService, utilities, businessUnitService) {

            var vm = this;
            vm.documentReaderEnabled = abp.features.isEnabled("Core.DocumentReader");
            vm.isBusinessUnitEnabled = abp.features.isEnabled("HRM.Business.Unit");
            vm.isBusinessUnitWisePayrollProcess = abp.setting.getBoolean("App.Speed.Hrm.IsBusinessUnitsWisePayrollProcess");

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isAllBranchUser = appSession.user.branchAccess == 3;



            vm.loading = false;
            vm.allVouchersCreated = false;

            vm.features = {
                payroll: abp.features.isEnabled('HRM.Payroll'),
            };

            vm.isGranted = (permission) => {
                return abp.auth.isGranted(permission);
            }

            vm.filters = {
                startDate: null,
                endDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                enableDateRange: true,
                showApprovalPendingPayrolls: false,
                type: null,
            }
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.HRM.Payrolls.View'),
                edit: abp.auth.hasPermission('Pages.HRM.Payrolls.Edit'),
                export: abp.auth.hasPermission('Pages.HRM.Payrolls.Export'),
                print: abp.auth.hasPermission('Pages.HRM.Payrolls.Print'),
            };

            //Date Rangeus
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.statusChanged = function () {

                if (vm.filters.status == 1)
                    vm.filters.enableDateRange = false;
                else
                    vm.filters.enableDateRange = true;

            };
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.getPayrolls = function () {
                vm.loading = true;

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                if (vm.isBusinessUnitWisePayrollProcess && vm.isBusinessUnitEnabled) {
                    vm.filters.businessUnitId = vm.businessUnitId;
                }

                // Fetch payrolls from the service
                payrollService.getPayrolls(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;

                    // Map payroll data and include sum of payroll details and type of first detail
                    vm.gridOptions.data = data.items.map(function (payroll) {
                        const totalAmount = payroll.payrollDetails.reduce(function (sum, detail) {
                            return sum + detail.totalPayable;
                        }, 0);

                        const roundedTotalAmount = utilities.roundforView(totalAmount, 2);

                        const firstDetailType = payroll.payrollDetails.length > 0 ? payroll.payrollDetails[0].type : '';

                        const processedFirstDetailType = utilities.getPayrollType(firstDetailType);

                        return {
                            ...payroll,
                            totalAmount: roundedTotalAmount,
                            firstDetailType: processedFirstDetailType
                        };
                    });

                    if (vm.dateRangeModel.endDate == null && vm.dateRangeModel.startDate == null) {
                        initDate();
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.openViewModal = (payrollId) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/payrolls/viewModal.cshtml',
                    controller: 'tenant.views.common.hrm.payrolls.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        payrollId: function () {
                            return payrollId;
                        },
                        departmentId: function () {
                            return null;
                        }
                    }
                });
            }

            vm.openEditModal = (payrollId) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/payrolls/editModal.cshtml',
                    controller: 'tenant.views.common.hrm.payrolls.editModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        payrollId: function () {
                            return payrollId;
                        }
                    }
                });
            }

            vm.openPrintModal = (payrollId) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/payrolls/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.common.hrm.payrolls.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        payrollId: function () {
                            return payrollId;
                        },
                    }
                });
            }

            function initializeFilters() {
                initDate();
            }
            initializeFilters();
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
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
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.openViewModal(row.entity.id)" ng-if="grid.appScope.permissions.view">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.openEditModal(row.entity.id)" ng-if="grid.appScope.permissions.edit && row.entity.isApproved == false">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.approvePayroll(row.entity.id)" ng-if="!row.entity.isApproved">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.openPrintModal(row.entity.id)" ng-if="grid.appScope.permissions.print && row.entity.isApproved">' + app.localize('Print') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.exportToExcel(row.entity.id)" ng-if="grid.appScope.permissions.export">' + app.localize('ExportToExcel') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.generateWpsReport(row.entity.id)" ng-if="row.entity.isApproved">' + app.localize('Generate WPS Report') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('FirstName'),
                    //    field: 'firstName'
                    //},
                    //{
                    //    name: app.localize('LastName'),
                    //    field: 'lastName'
                    //},
                    {
                        name: app.localize('Date'),
                        field: 'months',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.month)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('BusinessUnit'),
                        field: 'businessUnit',
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents">{{row.entity.businessUnit.name}}</div>' +
                            '</div>',
                        visible: vm.isBusinessUnitEnabled && vm.isBusinessUnitWisePayrollProcess
                    },
                    {
                        name: app.localize('Type'),
                        field: 'firstDetailType',
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents">{{row.entity.firstDetailType}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'totalAmount',
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents">{{row.entity.totalAmount}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'approve',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            ' <span  ng-show=" !row.entity.isApproved" class="label label-warning">' + app.localize('Not Approved') + '</span>' +

                            ' <span  ng-show="row.entity.isApproved" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }


                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getPayrolls();
                    });
                },
                data: []
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.exportToExcel = function () {
                vm.loading = true;
                personService.exportToExcelTenant(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {


                    g = false;
                });
            };




            vm.exportToExcel = (id) => {
                payrollService.payrollDetailsExportToExcel({ id: id })
                    .success((r) => {
                        app.downloadTempFile(r);
                    });
            }

            vm.payrollTypes = [
                { id: 1, name: app.localize("Payroll") },
                { id: 2, name: app.localize("Leave Salary") },
                { id: 3, name: app.localize("Final Settlement") },
            ];

            // Payroll approval modal
            vm.openSalaryVoucherModal = (payrollId) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/payrolls/payrollApprovalModal.cshtml',
                    controller: 'tenant.views.common.hrm.payrolls.payrollApprovalModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        payrollId: function () {
                            return payrollId;
                        }
                    }
                });
                return modalInstance.result.then(function (result) {
                    vm.allVouchersCreated = !!result;
                });
            }


            vm.approvePayroll = function (payrollId) {
                vm.openSalaryVoucherModal(payrollId).then(function () {
                    if (vm.allVouchersCreated) {
                        payrollService.approved(payrollId)
                            .success(() => {
                                abp.notify.success("Payroll approved successfully.");
                            })
                            .finally(() => {
                                vm.getPayrolls();
                            });
                    }
                });
            };

            vm.getAllBusinessUnits = () => {
                vm.loading = true;
                businessUnitService.getBusinessUnits({}).success(function (data) {
                    vm.businessUnits = data;
                }).finally(function () {

                });
            }

            vm.generateWpsReport = function (id) {

                abp.ui.setBusy();
                payrollService.generateWpsReport(id)
                    .success(function (result) {

                        var blob = new Blob(
                            [result],
                            {
                                type: 'text/plain;charset=utf-8'
                            });

                        var link = document.createElement('a');

                        link.href = window.URL.createObjectURL(blob);

                        link.download =
                            'WPS_' +
                            moment().format('MMYYYY') +
                            '.sif';

                        document.body.appendChild(link);

                        link.click();

                        document.body.removeChild(link);

                        abp.notify.success('SIF generated successfully');

                    })
                    .finally(function () {

                        abp.ui.clearBusy();

                    });
            };

            function init() {

                // Get business units if setting is enabled
                if (vm.isBusinessUnitWisePayrollProcess && vm.isBusinessUnitEnabled)
                    vm.getAllBusinessUnits();

                vm.getPayrolls();

            }
            init();
        }
    ]);
