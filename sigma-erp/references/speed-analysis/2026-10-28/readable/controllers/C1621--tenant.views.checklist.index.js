// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:445236-445339
appModule.controller('tenant.views.checklist.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.checkList',
        function ($scope, $uibModal, uiGridConstants, checkListService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Checklist.Addnew') || abp.auth.hasPermission('Pages.Tenant.VMIWorkshop.Checklist.Addnew') || abp.auth.hasPermission('Pages.Tenant.VMIGeneric.Checklist.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Checklist.Edit') || abp.auth.hasPermission('Pages.Tenant.VMIWorkshop.Checklist.Edit') || abp.auth.hasPermission('Pages.Tenant.VMIGeneric.Checklist.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Checklist.Delete') || abp.auth.hasPermission('Pages.Tenant.VMIWorkshop.Checklist.Delete') || abp.auth.hasPermission('Pages.Tenant.VMIGeneric.Checklist.Delete')
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editChecklistItem(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteChecklistItem(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ChecklistItemName'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Order'),
                        field: 'srNo'
                    }
                ],
                data: []
            };

            vm.getChecklist = function () {
                vm.loading = true;
                checkListService.getCheckList({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditChecklistItemModal(checklistId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/checklist/createOrEditModal.cshtml',
                    controller: 'tenant.views.checklist.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        checklistId: function () {
                            return checklistId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChecklist();
                });
            }

            vm.createChecklistItem = function() {
                openCreateOrEditChecklistItemModal(null);
            };

            vm.editChecklistItem = function(checklistItem) {
                openCreateOrEditChecklistItemModal(checklistItem.id);
            };

            vm.deleteChecklistItem = function (checklistItem) {
                abp.message.confirm(
                    app.localize('ChecklistItemDeleteWarningMessage', checklistItem.name),
                    function(isConfirmed) {
                        if (isConfirmed) {
                            checkListService.deleteCheckList({
                                id: checklistItem.id
                            }).success(function() {
                                vm.getChecklist();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getChecklist();
        }
    ]);
