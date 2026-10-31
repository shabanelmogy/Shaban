// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:104938-105034
appModule.controller('tenant.views.replacementReasons.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.replacementReason',
        function ($scope, $uibModal, uiGridConstants, replacementReasonService) {

            var vm = this;

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.ReplacementReasons.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.ReplacementReasons.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.ReplacementReasons.Delete')
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editReplacementReason(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteReplacementReason(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Reason'),
                        field: 'reason'
                    },
                ],
                data: []
            };

            vm.getReplacementReasons = function () {
                vm.loading = true;
                replacementReasonService.getReplacementReasons({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditReplacementReasonModal(reasonId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/replacementReasons/createOrEditModal.cshtml',
                    controller: 'tenant.views.replacementReasons.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        reasonId: function () {
                            return reasonId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getReplacementReasons();
                });
            }

            vm.createReplacementReason = function () {
                openCreateOrEditReplacementReasonModal(null);
            };

            vm.editReplacementReason = function (reason) {
                openCreateOrEditReplacementReasonModal(reason.id);
            };

            vm.deleteReplacementReason = function (reason) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', reason.reason),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            replacementReasonService.deleteReplacementReason({
                                id: reason.id
                            }).success(function () {
                                vm.getReplacementReasons();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getReplacementReasons();
        }
    ]);
