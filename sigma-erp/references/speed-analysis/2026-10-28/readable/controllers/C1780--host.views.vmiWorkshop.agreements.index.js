// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:485510-485697
appModule.controller('host.views.vmiWorkshop.agreements.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vmiAgreement',
        function ($scope, $uibModal, uiGridConstants, vmiAgreementService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                status: null,
                agreementNumber: '',
                enableDateRange: false
            };
            vm.dateRangeOptions = app.createDateRangePickerOptions();

            vm.statuses = [
                { id: 1, name: app.localize("Open") },
                { id: 2, name: app.localize("Closed") }
            ];
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.SupportRequests'),
                create: abp.auth.hasPermission('Pages.Tenant.SupportRequests.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.SupportRequests.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.SupportRequests.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers'),
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
                            '      <li><a  ng-click="grid.appScope.viewAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('Code'),
                    //    field: 'code'
                    //},
                    {
                        name: app.localize('RANo'),
                        field: 'raNo'
                    },
                    {
                        name: app.localize('CustomerName'),
                        field: 'customerName'
                    },
                    {
                        name: app.localize('HirerName'),
                        field: 'hirerName.name'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'location.name'
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'vehicle.plateNo'
                    }
                    ,
                    {
                        name: app.localize('Status'),
                        
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getStatus(row.entity.status)}}</div>',
                        field: 'status'
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

                        vm.getVmiAgreements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getVmiAgreements();
                    });
                },
                data: []
            };



            vm.createAgreement = function () {
                openCreateOrUpdateAgreement(null);
            };

            

            vm.viewAgreement = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/vmiWorkshop/agreements/viewAgreement.cshtml',
                    controller: 'tenant.views.vmiWorkshop.agreements.viewAgreement as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        agreement: function () {
                            return row;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    
                });
            };
           


            function openCreateOrUpdateAgreement(id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/vmiWorkshop/agreements/createOrUpdateAgreementModal.cshtml',
                    controller: 'tenant.views.vmiWorkshop.agreements.createOrUpdateVmiAgreementModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        agreementId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getVmiAgreements();
                });
            }

            vm.getStatus = function (id) {
                if (id == 1) {
                    return 'Open';
                }
                if (id == 2) {
                    return 'Closed';
                }
            }
    
            vm.getVmiAgreements = function () {
                vmiAgreementService.getVmiAgreements(vm.filters)
                    .success(function (data) {
                        vm.gridOptions.totalItems = data.length;
                        vm.gridOptions.data = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            function init() {
                vm.getVmiAgreements();
            }

            init();

        }
    ]);
