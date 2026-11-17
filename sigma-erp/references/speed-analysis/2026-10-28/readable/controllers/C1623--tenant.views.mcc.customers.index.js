// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:445413-445574
appModule.controller('tenant.views.mcc.customers.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.person',
        function ($scope, $uibModal, uiGridConstants, personService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Contacts.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Contacts.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Contacts.Delete')
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
                            '<li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.viewPerson(row.entity)">' + app.localize('View') + '</a></li>'+
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editStaff(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteStaff(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('Code'),
                    //    field: 'code'
                    //},
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Email'),
                        field: 'email'
                    },
                    {
                        name: app.localize('MobileNo'),
                        field: 'mobileNo'
                    },
                    {
                        name: app.localize('ContactNo'),
                        field: 'phoneWork'
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

                        vm.getStaff();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getStaff();
                    });
                },
                data: []
            };

            vm.getStaff = function () {
                vm.loading = true;
                personService.getCustomersForVMIRental({ name: vm.filterText}).success(function (data) {
                    vm.gridOptions.totalItems = data.length;
                    vm.gridOptions.data = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditCustomerModal(customerId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/customers/createOrEditModal.cshtml',
                    controller: 'tenant.views.mcc.customers.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        customerId: function () {
                            return customerId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getStaff();
                });
            }

            vm.createCustomer = function () {
                debugger;
                openCreateOrEditCustomerModal(null);
            };

            vm.editStaff = function (person) {
                openCreateOrEditCustomerModal(person.id);
            };
            vm.viewPerson = function (customer) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/customers/viewModal.cshtml',
                    controller: 'tenant.views.mcc.customers.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        customerId: function () {
                            return customer.id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                   
                });
            };
            vm.deleteStaff = function (staff) {
                abp.message.confirm(
                    app.localize('StaffDeleteWarningMessage', staff.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            personService.deleteCustomerForVMIRental(staff.id).success(function () {
                                vm.getStaff();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            //function initializeFilters() {
            //    getStaffStatuses();
            //}

            //initializeFilters();
            vm.getStaff();
        }
    ]);
