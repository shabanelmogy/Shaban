// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:114663-114809
appModule.controller('tenant.views.common.taxCodes.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.taxCode',
        function ($scope, $uibModal, uiGridConstants, taxCodeService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.filters = { contactType: 2 };

            vm.loading = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.TaxCodes'),
                create: abp.auth.hasPermission('Pages.Tenant.TaxCodes.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.TaxCodes.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.TaxCodes.Delete'),
            }
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewTaxCode(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editTaxCode(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.isDefault" ng-click="grid.appScope.deleteTaxCode(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Title'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span style="margin:4px">' + '{{row.entity.title}}' + '</span>' +
                            ' <span class="label label-success" style="margin:4px;background-color:#44B6AE" ng-show="row.entity.isDefault">' + 'Default' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Code'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span style="margin:4px">' + '{{row.entity.code}}' + '<\span>'
                            + '</div>'
                    },
                    {
                        name: app.localize('TaxPercent'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span style="margin:4px">' + '{{row.entity.taxPercent}}' + '<\span>'
                            + '</div>'
                    },
                ],
                data: []
            };

            vm.getTaxCodes = function () {
                vm.loading = true;
                taxCodeService.getTaxCodes(vm.filters).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditTaxCodeModal(taxCodeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/taxCodes/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.taxCodes.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        taxCodeId: function () {
                            return taxCodeId;
                        },
                        taxCode: function () {
                            return vm.filters.taxCode;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTaxCodes();
                });
            }

            function openViewTaxCodeModal(taxCodeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/taxCodes/viewModal.cshtml',
                    controller: 'tenant.views.common.taxCodes.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        taxCodeId: function () {
                            return taxCodeId;
                        }
                    }
                });


            }

            vm.createTaxCode = function () {
                openCreateOrEditTaxCodeModal(null);
            };

            vm.editTaxCode = function (taxCode) {
                openCreateOrEditTaxCodeModal(taxCode.id);
            };

            vm.viewTaxCode = function (taxCode) {
                openViewTaxCodeModal(taxCode.id);
            };

            vm.deleteTaxCode = function (taxCode) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', taxCode.title),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            taxCodeService.deleteTaxCode({
                                id: taxCode.id
                            }).success(function () {
                                vm.getTaxCodes();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function init() {
                vm.getTaxCodes();
            }
            init();
        }
    ]);
