// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:196247-196478
appModule.controller('tenant.views.crs.customerProjects.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.customerProject',
        function ($scope, $uibModal, uiGridConstants, directoryService, customerProjectService) {


            var vm = this;
            vm.loading = false;
            vm.customers = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                status: true,
                contact: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.statuses = [
                { name: "Active", id: true },
                { name: "In Active", id: false }
            ];


            //vm.permissions = { 
            //    create: abp.auth.hasPermission('Pages.Tenant.Lease.Projects.Create'),
            //    edit: abp.auth.hasPermission('Pages.Tenant.Lease.Projects.Edit'),
            //    delete: abp.auth.hasPermission('Pages.Tenant.Lease.Projects.Delete')
            //};

            vm.permissions = {
                create: true,
                edit: true,
                delete: true
            };

            vm.searchContact = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, includeUnApproved: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.searchContactPopoup = function () {
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
                    if (customer != null) {
                        vm.filters.contact = customer;
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
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                           // '      <li><a ng-click="grid.appScope.ViewLeaseProject(row.entity.id)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit"  ng-click="grid.appScope.EditCustomerProject(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteCustomerProject(row.entity.id)">' + app.localize('Delete') + '</a></li>' +
                            //'      <li><a ng-if="!row.entity.isQuotationCreated" ng-click="grid.appScope.openleaseQuotation(row.entity)">' + app.localize('Quote') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Project'),
                        field: 'projectName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.name}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Customer'),
                        field: 'customer',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.contact.name}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Active'),
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class="label label-danger"  ng-If="!row.entity.status">No</div>' +
                            '<div class="label label-success" ng-If="row.entity.status">Yes</div>' +
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

                        vm.getAllProjects();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getAllProjects();
                    });
                },
                data: []
            };
            vm.clearCustomer = function () {
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };
            vm.EditCustomerProject = function (project) {
                openCreateOrEditCustomerProject(project);

            }
            vm.createCustomerProject = function () {
                openCreateOrEditCustomerProject(null);
            };
        
            openCreateOrEditCustomerProject = function (projectId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/customerProjects/createOrEditProjectModel.cshtml',
                    controller: 'tenant.views.crs.customerProjects.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAllProjects();
                });
            };

            vm.ViewLeaseProject = function (project) {
                openViewProject(project);

            }
            openViewProject = function (projectId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/customerProjects/viewProjectModel.cshtml',
                    controller: 'tenant.views.crs.customerProjects.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAllProjects();
                });
            };

            vm.deleteCustomerProject = function (ProjectId) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', location.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customerProjectService.deleteCustomerProject({
                                id: ProjectId
                            }).
                                success(function () {
                                    vm.getAllProjects();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                        }
                    }
                );
            }
            vm.openViewInquiry = function (inquiryId) {
                openCreateOrEditViewInquiry(inquiryId);

            }
            vm.getAllProjects = function () {
                
                vm.loading = true;
                if (vm.filters.contact) {

                    vm.filters.contactId = vm.filters.contact.id;
                }
                customerProjectService.getCustomerProject(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            function init() {
                vm.getAllProjects();

            }
            init();
        }]);
