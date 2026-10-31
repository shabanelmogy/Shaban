// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94348-94499
appModule.controller('tenant.views.common.designations.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.designation',
        function ($scope, $uibModal, uiGridConstants, designationService) {

            var vm = this;
            vm.isHrmEnabled = abp.features.isEnabled("HRM");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: true
                //create: abp.auth.hasPermission('Pages.Tenant.Locations.Addnew'),
                //edit: abp.auth.hasPermission('Pages.Tenant.Locations.Edit'),
                //'delete': abp.auth.hasPermission('Pages.Tenant.Locations.Delete')
            };

            vm.getStaffCategories = function (category) {
                if (category == '')
                    return '';
                if (category == 1)
                    return app.localize("TopManagement");
                if (category == 2)
                    return app.localize("Manager");
                if (category == 3)
                    return app.localize("General");
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
                            '      <li><a ng-click="grid.appScope.viewDesignation(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.editDesignation(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteDesignation(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DesignationName'),
                        field: 'name'
                    },
                    {
                        name: app.localize('StaffCategory'),
                        field: 'staffCategory',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getStaffCategories(row.entity.staffCategory)}}</div>' +
                            '</div>',
                        visible: vm.isHrmEnabled
                    },
                    //{
                    //    name: app.localize('DesignationHourlyCost'),
                    //    field: 'hourlyCost'
                    //}
                ],
                data: []
            };

            vm.getDesignations = function () {
                vm.loading = true;

                designationService.getDesignations()
                    .success(function (data) {
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function openCreateOrEditDesignationModal(Id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/designations/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.designations.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        designationId: function () {
                            return Id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDesignations();
                });
            }

            vm.createDesignation = function () {
                openCreateOrEditDesignationModal(null);
            };

            vm.editDesignation = function (Designation) {
                openCreateOrEditDesignationModal(Designation.id);
            };

            vm.viewDesignation = function (Designation) {
                openViewModal(Designation.id);
            };

            function openViewModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/designations/viewModal.cshtml',
                    controller: 'tenant.views.common.designations.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        designationId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDesignations();
                });
            }

            vm.deleteDesignation = function (Designation) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', Designation.Id),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            designationService.deleteDesignation({
                                Id: Designation.id
                            }).success(function () {
                                vm.getDesignations();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.getDesignations();
        }
    ]);
