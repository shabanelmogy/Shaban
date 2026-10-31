// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:115600-115696
appModule.controller('tenant.views.voucherReasons.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.voucherReason',
        function ($scope, $uibModal, uiGridConstants, voucherReasonService) {

            var vm = this;

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.VoucherReasons.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.VoucherReasons.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.VoucherReasons.Delete')
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editVoucherReason(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteVoucherReason(row.entity)">' + app.localize('Delete') + '</a></li>' +
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

            vm.getVoucherReasons = function () {
                vm.loading = true;
                voucherReasonService.getVoucherReasons({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditVoucherReasonModal(reasonId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/voucherReasons/createOrEditModal.cshtml',
                    controller: 'tenant.views.voucherReasons.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        reasonId: function () {
                            return reasonId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getVoucherReasons();
                });
            }

            vm.createVoucherReason = function () {
                openCreateOrEditVoucherReasonModal(null);
            };

            vm.editVoucherReason = function (reason) {
                openCreateOrEditVoucherReasonModal(reason.id);
            };

            vm.deleteVoucherReason = function (reason) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', reason.reason),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            voucherReasonService.deleteVoucherReason({
                                id: reason.id
                            }).success(function () {
                                vm.getVoucherReasons();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getVoucherReasons();
        }
    ]);
