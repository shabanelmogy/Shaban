// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86505-86661
appModule.controller('tenant.views.common.contactGroups.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.contactGroup',
        function ($scope, $uibModal, uiGridConstants, contactGroupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.filters = { contactType: 2 };

            vm.loading = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.ContactGroups'),
                create: abp.auth.hasPermission('Pages.Tenant.ContactGroups.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.ContactGroups.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.ContactGroups.Delete'),
            }

            vm.getContactType = function (type) {

                if (type == 2)
                    return app.localize('Customer');
                else if (type == 3)
                    return app.localize('Supplier');
                else if (type == 6)
                    return app.localize('CorporateDriver');
                else if (type == 7)
                    return 'CompanyContact';
                return '';
            };
            vm.contactTypes = [
                { id: 2, name: app.localize('Customer') },
                { id: 3, name: app.localize('Supplier') },
                { id: 6, name: app.localize('CorporateDriver') },
                { id: 7, name: app.localize('CompanyContact') }
            ];

            vm.contactTypeChanged = function () { vm.getContactGroups(); }

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
                              '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewContactGroup(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editContactGroup(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.isDefault" ng-click="grid.appScope.deleteContactGroup(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Name'),
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<span style="margin:4px">' + '{{row.entity.name}}' + '</span>' +
                        ' <span class="label label-success" style="margin:4px;background-color:#44B6AE" ng-show="row.entity.isDefault">' + 'Default' + '</span>' +
                    '</div>'
                    },
                   
                ],
                data: []
            };

            vm.getContactGroups = function () {
                vm.loading = true;
                contactGroupService.getContactGroupsOnContactType(vm.filters).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditContactGroupModal(contactGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/contactGroups/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.contactGroups.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        contactGroupId: function () {
                            return contactGroupId;
                        },
                        contactType: function () {
                            return vm.filters.contactType;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getContactGroups();
                });
            }

            function openViewContactGroupModal(contactGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/contactGroups/viewModal.cshtml',
                    controller: 'tenant.views.common.contactGroups.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        contactGroupId: function () {
                            return contactGroupId;
                        }
                    }
                });


            }

            vm.createContactGroup = function () {
                openCreateOrEditContactGroupModal(null);
            };

            vm.editContactGroup = function (contactGroup) {
                openCreateOrEditContactGroupModal(contactGroup.id);
            };

            vm.viewContactGroup = function (contactGroup) {
                openViewContactGroupModal(contactGroup.id);
            };

            vm.deleteContactGroup = function (location) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', location.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            contactGroupService.deleteContactGroup({
                                id: location.id
                            }).success(function () {
                                vm.getContactGroups();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function init()
            {
                vm.getContactGroups();
            }
            init();
        }
    ]);
