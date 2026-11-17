// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:50042-50315
appModule.controller('host.views.cbs.sLAs.index', [
        '$scope', '$stateParams', '$uibModal', 'abp.services.app.sLA', 'uiGridConstants', 'abp.services.app.tenant', 'abp.services.app.commonLookup', 'lookupModal',
        function ($scope, $stateParams, $uibModal, slaService, uiGridConstants, tenantService, commonLookupService, lookupModal) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.allowDateRange = false;
            // vm.filterText = $stateParams.filterText || null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.filters = {
                title: "",
                tenantId: null,
                startDate: null,
                expiryDate: null,
                isPaymentDelay: false
            };

            vm.slaTypes = [
                { id: 1, name: "Implementation"},
                { id: 2, name: "Post Go-Live"},
                { id: 3, name: "Live"}
            ];

            vm.paymentDelayTypes = [
                { id: 1, name: "Warning"},
                { id: 2, name: "Slow Down Service"},
                { id: 3, name: "Stop Service"}
            ];

            vm.paymentDelayOptions = [
                {value: true, name: "Yes"},
                {value: false, name: "No"}
            ];

            vm.getSlaTypeName = function (id) {
                if (id == 1)
                    return "Implementation";
                else if (id == 2)
                    return "Post Go-Live";
                else if (id == 3)
                    return "Live";
                else
                    return "";
            }

            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.CBS.SLAs'),
                create: abp.auth.hasPermission('Pages.CBS.SLAs.AddNew'),
                edit: abp.auth.hasPermission('Pages.CBS.SLAs.Edit'),
                'delete': abp.auth.hasPermission('Pages.CBS.SLAs.Delete'),

            };

            function openCreateOrEditSLAModal(slaId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/SLAs/createOrEditModal.cshtml',
                    controller: 'host.views.cbs.sLAs.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        slaId: function () {
                            return slaId;
                        }
                    },
                    size: 'md',
                });

                modalInstance.result.then(function (result) {
                    vm.getSLAs();
                });
            }

            vm.createSLA = function () {
                openCreateOrEditSLAModal(null);
            };

            vm.editSLA = function (sla) {
                openCreateOrEditSLAModal(sla.id);
            };

            vm.deleteSLA = function (sla) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            slaService.deleteSLA({
                                id: sla.id
                            }).success(function () {
                                vm.getSLAs();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
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
                        width: 60,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewSLA(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editSLA(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteSLA(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'Title',
                        field: 'title',
                    },
                    {
                        name: 'Tenant',
                        field: 'tenant.tenancyName',
                    },
                    {
                        name: 'StartDate',
                        field: 'startDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'ExpiryDate',
                        field: 'expiryDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.expiryDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Type',
                        field: 'type',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getSlaTypeName(row.entity.type)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Payment Delay',
                        field: 'isPaymentDelay',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-show="row.entity.isPaymentDelay" class="label label-danger">' + app.localize('Yes') + '</span>' +
                            '  <span ng-show="!row.entity.isPaymentDelay" class="label label-default">' + app.localize('No') + '</span>' +
                            '</div>'
                    },
                    {
                        name: 'Delay Action',
                        field: 'paymentDelayType',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-if="row.entity.paymentDelayType==1">Warning</span>' +
                            '  <span ng-if="row.entity.paymentDelayType==2">Slow Down</span>' +
                            '  <span ng-if="row.entity.paymentDelayType==3">Stop</span>' +
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

                        vm.getSLAs();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getSLAs();
                    });
                },


                data: []
            };

            vm.getSLAs = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.allowDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.expiryDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.allowDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.expiryDate = null;
                }

                slaService.getSLAs(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.viewSLA = function (sla) {
                openViewSLAModal(sla.id);
            };

            function openViewSLAModal(slaId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/SLAs/viewModal.cshtml',
                    controller: 'host.views.cbs.sLAs.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        slaId: function () {
                            return slaId;
                        }
                    },
                    size: 'lg'
                });
            }
            function init() {
                vm.getSLAs();
            }
            init();

        }]);
