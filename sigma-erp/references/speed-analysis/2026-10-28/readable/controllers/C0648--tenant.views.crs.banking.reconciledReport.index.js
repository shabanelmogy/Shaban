// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:169772-170019
appModule.controller('tenant.views.crs.banking.reconciledReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.bankReconciliation', 'utilities', 'abp.services.app.billingMethod', 'abp.services.app.commonLookup', '$filter',
        function ($scope, $uibModal, uiGridConstants, bankReconciliationAppService, utilities, billingMethodService, commonLookupService, $filter) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.start = true;
            vm.loading = false;
            vm.isDeleteReconciliationEnabled = abp.features.isEnabled('CRS.CustomFeatures.DeleteReconciliation');
            vm.isDeleteReconciliationEnabledPermission = abp.auth.hasPermission('Pages.Tenant.Banking.DeleteReconciliation'),
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.enable = false;
            vm.reconciliation = {
                reconciliationDetail: []
            };

            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts'),
            };

            vm.filters = {
                date: null,
                bankStatmentDate: null,
                linkedAccountId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                enableDateRange: true,
                fromDate: null,
                toDate: null
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
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


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };


            vm.getBankAccounts = function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                });
            };


            //Location related code Start ------------
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    vm.LocationsForAgreement = data.items;

                });
            };


            vm.deleteReconciliation = function (recoId) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            bankReconciliationAppService.deleteReconciliation({
                                id: recoId
                            }).success(function () {
                                vm.getBankReconciliation();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };


            vm.gridOptions = {
                enableHorizontalScrollbar: 1,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,

                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.bankReconciledReportPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isDeleteReconciliationEnabled && grid.appScope.isDeleteReconciliationEnabledPermission" ng-click="grid.appScope.deleteReconciliation(row.entity.id)">' + app.localize('Delete Reconciliation') + '</a></li>' +
                            //'      <li><a target="_blank" href="/Report#/tenant/bankReconciledReportPrint/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +


                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Bank'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.bankName}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ReconciledBalance'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.reconciledBalance}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Pending') + " " + app.localize("Entries") + " " + app.localize('Balance'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.pendingEntriesBalance}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Ledger') + ' ' + app.localize('Balance'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.ledgerBalance}}</div>' +
                            '</div>'
                    }
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getBankReconciliation();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getBankReconciliation();
                    });
                },
                data: []
            };

            vm.bankReconciledReportPrintModal = function (reportId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/reconciledReport/printPreview.cshtml',
                    controller: 'tenant.views.crs.banking.reconciledReport.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        reportId: function () {
                            return reportId;
                        }
                    }
                });
            };

            //Location related code END ---------------

            vm.exportToExcel = function () {
                vm.loading = true;
                //vm.dateRangeCheck();
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                bankReconciliationAppService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.getBankReconciliation = function () {
                vm.loading = true;
                vm.dateRangeCheck();
                bankReconciliationAppService.getReconciledReport(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getBankAccounts();
                //getLocations();
                vm.getBankReconciliation();
            }

            init();
        }
    ]);
