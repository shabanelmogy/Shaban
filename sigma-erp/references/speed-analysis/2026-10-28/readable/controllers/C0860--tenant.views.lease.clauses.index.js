// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:235921-236048
appModule.controller('tenant.views.lease.clauses.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.leaseClause',
        function ($scope, $uibModal, uiGridConstants, leaseClauseService) {
            
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Locations.Addnew') ,
                edit: abp.auth.hasPermission('Pages.Tenant.Locations.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Locations.Delete')
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.editLeaseClauseType(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.addClauses(row.entity)">' + app.localize('Clauses') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteLocation(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                 
                ],
                data: []
            };
            
            vm.getLeaseClauseTypes = function () {
                vm.loading = true;
                leaseClauseService.getLeaseClauseTypes({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            
            function openCreateOrEditClausesTypeModal(clauseTypeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/clauses/createOrEditClausesTypeModal.cshtml',
                    controller: 'tenant.views.lease.clauses.createOrEditClausesTypeModal as vm',
                    backdrop: 'static',
                    size:'sm',
                    resolve: {
                        clauseTypeId: function () {
                            return clauseTypeId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getLeaseClauseTypes();
                });
            }

            function openCreateOrEditClausesModal(clauseTypeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/clauses/createOrEditClausesModal.cshtml',
                    controller: 'tenant.views.lease.clauses.createOrEditClausesModal as vm',
                    backdrop: 'static',
                    resolve: {
                        clauseTypeId: function () {
                            return clauseTypeId;
                        }
                    },
                    size:'md',
                    //for modal width below line
                    swindowClass: 'app-modal-window'
                });

                modalInstance.result.then(function (result) {
                    vm.getLeaseClauseTypes();
                });
            }

            vm.createLeaseClauseType = function() {
                openCreateOrEditClausesTypeModal(null);
            };
           
            vm.editLeaseClauseType = function(clauseType) {
                openCreateOrEditClausesTypeModal(clauseType.id);
            };

            vm.addClauses = function (clauseType) {
                openCreateOrEditClausesModal(clauseType.id);
            };

            vm.deleteLocation = function(clauseType) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', clauseType.name),
                    function(isConfirmed) {
                        if (isConfirmed) {
                            leaseClauseService.deleteLocation({
                                id: clauseType.id
                            }).success(function() {
                                vm.getLeaseClauseTypes();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getLeaseClauseTypes();
        }
    ]);
