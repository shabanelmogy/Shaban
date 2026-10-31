// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:462598-462743
appModule.controller('tenant.views.safetyCheckTemplates.index', [
        '$scope', '$sce', '$filter', '$uibModal', 'uiGridConstants', 'abp.services.app.safetyCheckTemplate', 'defaultSafetyTemplate',
        function ($scope, $sce, $filter, $uibModal, uiGridConstants, safetyCheckTemplateService, defaultSafetyTemplate) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.SafetyCheckTemplates'),
                create: abp.auth.hasPermission('Pages.Tenant.SafetyCheckTemplates.Add'),
                edit: abp.auth.hasPermission('Pages.Tenant.SafetyCheckTemplates.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.SafetyCheckTemplates.Delete')
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
                            '      <li ng-if="grid.appScope.permissions.view"><a ng-click="grid.appScope.viewTemplate(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.edit"><a ng-click="grid.appScope.editTemplate(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.delete"><a ng-click="grid.appScope.deleteTemplate(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Template Name'),
                        field: 'name'
                    }
                ],
                data: []
            };

            vm.getTemplates = function () {
                vm.loading = true;
                safetyCheckTemplateService.getTemplates().success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditTemplateModal(templateId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/createOrEditTemplateModal.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.createOrEditTemplateModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        templateId: function () {
                            return templateId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTemplates();
                });
            }

            function openViewTemplateModal(templateId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/viewTemplateModal.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.createOrEditTemplateModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        templateId: function () {
                            return templateId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTemplates();
                });
            }

            vm.createTemplate = function () {
                openCreateOrEditTemplateModal(null);
            };

            vm.editTemplate = function (template) {
                openCreateOrEditTemplateModal(template.id);
            };

            vm.viewTemplate = function (template) {
                openViewTemplateModal(template.id);
            };

            vm.deleteTemplate = function (template) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', template.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            safetyCheckTemplateService.deleteSafetyCheckTemplate({
                                id: template.id
                            }).success(function () {
                                vm.loading = false;
                                vm.getTemplates();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.safetyCheck = {};
            vm.importDefaultTemplates = function () {
                var templates = defaultSafetyTemplate.getDefaultTemplates();
                for (var i = 0; i < templates.length; i++) {
                    vm.loading = true;
                    vm.safetyCheck = templates[i];
                    vm.safetyCheck.template = JSON.stringify(vm.safetyCheck.templateJson);
                    safetyCheckTemplateService.createOrUpdateTemplate({ safetyCheck: vm.safetyCheck })
                        .success(function (result) {
                            vm.getTemplates();
                        }).finally(function () {
                            vm.loading = false;
                            vm.saving = false;
                        });
                }
            };

            vm.getTemplates();
        }
    ]);
