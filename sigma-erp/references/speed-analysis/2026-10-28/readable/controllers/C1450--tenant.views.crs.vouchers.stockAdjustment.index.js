// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:397523-397887
appModule.controller('tenant.views.crs.vouchers.stockAdjustment.index', ['$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.stockAdjustment', 'appSession', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $uibModal, directoryService, uiGridConstants, StockAdjustmentService, appSession, commonLookupService, utilities) {
            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.vehicles = [];
            vm.suppliers = [];
            vm.isSalikMonthEndPostingEnabled = abp.features.isEnabled("CRS.Tolls.SalikMonthEndPosting");
            vm.isFineMonthEndPostingEnabled = abp.features.isEnabled("CRS.Fines.FineMonthEndPosting");
            vm.isDarbMonthEndPostingEnabled = abp.features.isEnabled("CRS.Tolls.DarbMonthEndPosting");
            vm.isSageX3Enabled = abp.features.isEnabled('Core.SagX3Integration');
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.JVs");
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');

            vm.postingGroups = [];
            if (vm.isFineMonthEndPostingEnabled)
                vm.postingGroups.push({ id: 28, name: 'Fine Month End Posting' });

            if (vm.isSalikMonthEndPostingEnabled)
                vm.postingGroups.push({ id: 27, name: 'Salik Month End Posting' });
            if (vm.isDarbMonthEndPostingEnabled)
                vm.postingGroups.push({ id: 64, name: 'Darb Month End Posting' });

            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                vehicleId: null,
                fromDate: null,
                toDate: null,
                skipCount: 0,
                salikMonthEndPosting: false,
                maxResultCount: app.consts.grid.defaultPageSize,
            }

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };


            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.StockAdjustment.Create'),
                /*edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Edit'),*/
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.StockAdjustment.View'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.StockAdjustment.Delete'),
                
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs'),
                

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

            // extended search using search contact popup
           
            vm.getStockAdjustment = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                StockAdjustmentService.getStockAdjustment(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
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

            function getLocationsActiveAndInActive() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                StockAdjustmentService.exportToExcelStockAdjustment(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
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
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewStockAdjustment(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.deleteStockAdjustment(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            //'      <li><a  ng-if="grid.appScope.permissions.edit &&row.entity.voucherSubTypeId!=68&& grid.appScope.locationPermission(row.entity) && row.entity.status != 5" ng-click="grid.appScope.editStockAdjustment(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('No'),
                        type: 'number',
                        width:80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.voucherSubTypeId==27" class="label label-warning">' + app.localize('SalikMonthEndPosting') + '</span>' +
                            ' <span  ng-show="row.entity.voucherSubTypeId==28" class="label label-success">' + app.localize('FineMonthEndPosting') + '</span>' +
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
                        name: app.localize('Amount'),
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
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

                        vm.getStockAdjustment();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getStockAdjustment();
                    });
                },
                data: []
            };

            openCreateOrEditStockAdjustment = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/stockAdjustment/createOrEdit.cshtml',
                    controller: 'tenant.views.crs.vouchers.stockAdjustment.createOrEdit as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStockAdjustment();
                });
            }

            vm.openprintModal = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/stockAdjustment/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.stockAdjustment.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        },
                    }
                });
            };

            openViewStockAdjustmentModal = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/stockAdjustment/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.stockAdjustment.createOrEdit as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        }
                    }
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
                            return '~/App/tenant/views/crs/vouchers/stockAdjustment/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.createStockAdjustment = function () {
                openCreateOrEditStockAdjustment(null);
            };


            vm.editStockAdjustment = function (JV) {
                openCreateOrEditStockAdjustment(JV.id);
            };

            vm.viewStockAdjustment = function (JV) {
                openViewStockAdjustmentModal(JV.id);

            }


            vm.deleteStockAdjustment = function (JV) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', JV.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            StockAdjustmentService.deleteStockAdjustment({
                                id: JV.id
                            }).success(function () {
                                vm.getStockAdjustment();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.openJournalViewModal = function (JV) {
                openJournalViewModal(JV);
            }

            openJournalViewModal = function (JV) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return JV.id;
                        },
                        voucherNo: function () {
                            return JV.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStockAdjustment();
                });
            }

            function init() {
                getLocationsActiveAndInActive();
                initDate();
                vm.dateRangeModelChanged();
                vm.getStockAdjustment();
            }
            init();
        }]);
