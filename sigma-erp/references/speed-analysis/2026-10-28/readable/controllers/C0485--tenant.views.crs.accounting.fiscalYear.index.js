// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:123148-123374
appModule.controller('tenant.views.crs.accounting.fiscalYear.index', ['$uibModal', '$scope', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.fiscalYear',
    function ($uibModal, $scope, uiGridConstants, vehicleService, fiscalYearService) {
        var vm = this;
        vm.filters = {
            fineNo: null,
            vehicleId: null,
            fromDate: null,
            toDate: null,
            amount: null,
            skipCount: 0,
            maxResultCount: app.consts.grid.defaultPageSize,
        };
        vm.permissions = {
            create: abp.auth.hasPermission('Pages.Tenant.Accounts.FiscalYear.Addnew'),
            'view': abp.auth.hasPermission('Pages.Tenant.Accounts.FiscalYear.View'),
            edit: abp.auth.hasPermission('Pages.Tenant.Accounts.FiscalYear.Edit'),
            'delete': abp.auth.hasPermission('Pages.Tenant.Accounts.FiscalYear.Delete'),

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
        vm.getFiscalYears = function () {
            vm.loading = true;
            fiscalYearService.getFiscalYears().success(function (data) {
                vm.gridOptions.totalItems = data.totalCount;
                vm.gridOptions.data = data.items;
            }).finally(function () {
                vm.loading = false;
            });

        };

        vm.monthStatus = function (status) {
            if (status)
                return "Closed";
            else
                return "Open";
        };


        vm.closeFiscalYear = function (fiscalYearid) {
            openCloseFiscalYearModal(fiscalYearid);
            //abp.message.confirm(
            //    //app.localize('DeleteWarningMessage', fiscalYear.fineNo),
            //    "Please make sure you have completed all financial transactions for this year. After closing it, system will not allow any financial transaction for this year. Please confirm If you want to proceed.",
            //    function (isConfirmed) {
            //        if (isConfirmed) {
            //            fiscalYearService.closeFiscalYear({ id: fiscalYearid })
            //                .success(function () {
            //                    vm.getMonths();
            //                    abp.notify.success(app.localize('ClosedSuccessfully'));
            //                });
            //        }
            //    });
        };
        function openCloseFiscalYearModal(fiscalYearId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/accounting/fiscalYear/closeFiscalYearModal.cshtml',
                controller: 'tenant.views.crs.accounting.fiscalYear.closeFiscalYearModal as vm',
                //backdrop: 'static',
                size: 'lg',
                resolve: {
                    fiscalYearId: function () {
                        return fiscalYearId;
                    }

                }
            });
            modalInstance.result.then(function () {
                vm.getFiscalYears();
            });
        }
        vm.gridOptions = {
            enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            paginationPageSizes: app.consts.grid.defaultPageSizes,
            paginationPageSize: app.consts.grid.defaultPageSize,
            //useExternalPagination: false,
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
                        '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewFiscalYear(row.entity)">' + app.localize('View') + '</a></li>' +
                        //'      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editFiscalYear(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteFiscalYear(row.entity)">' + app.localize('Delete') + '</a></li>' +
                        '      <li><a ng-if="row.entity.isClosed == false" ng-click="grid.appScope.closeFiscalYear(row.entity.id)">' + app.localize('CloseFiscalYear') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                },

                //{
                //    name: app.localize('FiscalYearNo'),
                //    type: 'number',
                //    field: 'fineNo',
                //    cellTemplate:
                //    '<div class=\"ui-grid-cell-contents\">' +
                //    ' <span >' + '{{row.entity.id}}' + '</span>' +
                //   '</div>'
                //},

                {
                    name: app.localize('StartDate'),
                    field: 'startDate',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.startDate)}}</div>' +
                        '</div>'
                },
                {
                    name: app.localize('EndDate'),
                    field: 'endDate',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.endDate)}}</div>' +
                        '</div>'
                },
                {
                    name: app.localize('Status'),
                    field: 'isClosed',
                    width: '40%',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.monthStatus(row.entity.isClosed)}}</div>' +
                        '</div>'
                }
            ],

            //onRegisterApi: function (gridApi) {
            //    $scope.gridApi = gridApi;
            //    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            //        if (!sortColumns.length || !sortColumns[0].field) {
            //            vm.filters.sorting = null;
            //        } else {
            //            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
            //        }

            //        vm.getFiscalYears();
            //    });

            //    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
            //        vm.filters.skipCount = (pageNumber - 1) * pageSize;
            //        vm.filters.maxResultCount = pageSize;
            //        vm.getFiscalYears();

            //    });
            //},
            data: []
        };
        function openViewFiscalYearModal(fiscalYearId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/accounting/fiscalYear/viewModal.cshtml',
                controller: 'tenant.views.crs.accounting.fiscalYear.createOrEditModal as vm',
                //backdrop: 'static',
                size: 'sm',
                resolve: {
                    fiscalYearId: function () {
                        return fiscalYearId;
                    }

                }
            });

        }
        function openCreateOrEditFiscalYearModal(fiscalYearId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/accounting/fiscalYear/createOrEditModal.cshtml',
                controller: 'tenant.views.crs.accounting.fiscalYear.createOrEditModal as vm',
                //backdrop: 'static',
                size: 'sm',
                resolve: {
                    fiscalYearId: function () {
                        return fiscalYearId;
                    }

                }
            });
            modalInstance.result.then(function (result) {
                vm.getFiscalYears();
            })
        }
        vm.viewFiscalYear = function (fiscalYear) {
            openViewFiscalYearModal(fiscalYear.id);
        };
        vm.createFiscalYear = function () {
            openCreateOrEditFiscalYearModal(null);
        };

        vm.editFiscalYear = function (fiscalYear) {
            openCreateOrEditFiscalYearModal(fiscalYear.id);
        };
        vm.deleteFiscalYear = function (fiscalYear) {
            abp.message.confirm(
                   app.localize('DeleteWarningMessage', fiscalYear.fineNo),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           fiscalYearService.deleteFiscalYear({
                               id: fiscalYear.id
                           }).success(function () {
                               vm.getFiscalYears();
                               abp.notify.success(app.localize('SuccessfullyDeleted'));
                           });
                       }
                   }
               );
        };

        function init() {
            vm.getFiscalYears();
        }
        init();
    }]);
