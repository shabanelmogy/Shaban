// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85765-85954
appModule.controller('tenant.views.billingMethods.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.billingMethod',
        function ($scope, $uibModal, uiGridConstants, billingMethodService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.filters = {
                category: 1 //payment methods for receipts
            };

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.BillingMethods.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.BillingMethods.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.BillingMethods.Delete')
            };

            //vm.gridOptions = {
            //    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            //    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            //    paginationPageSizes: app.consts.grid.defaultPageSizes,
            //    paginationPageSize: app.consts.grid.defaultPageSize,
            //    appScopeProvider: vm,
            //    enableSorting: false,
            //    columnDefs: [
            //        {
            //            name: app.localize('Actions'),
            //            width: 120,
            //            cellTemplate:
            //                '<div class=\"ui-grid-cell-contents\">' +
            //                '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
            //                '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
            //                '    <ul uib-dropdown-menu>' +
            //                '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editBillingMethod(row.entity)">' + app.localize('Edit') + '</a></li>' +
            //                '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteBillingMethod(row.entity)">' + app.localize('Delete') + '</a></li>' +
            //                '    </ul>' +
            //                '  </div>' +
            //                '</div>'
            //        },
            //        {
            //            name: app.localize('Type'),
            //            cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getBillingMethodCategory(row.entity.type)}}</div>',
            //            field: 'type'
            //        },
            //        {
            //            name: app.localize('Name'),
            //            field: 'name'
            //        },
            //        {
            //            name: app.localize('Code'),
            //            field: 'code'
            //        },
            //        {
            //            name: app.localize('Location'),
            //            field: 'location.name'
            //        },
            //        {
            //            name: app.localize('Active'),
            //            cellTemplate: '<div style="text-align:left;margin-left:5px"">{{row.entity.isActive ? "Yes" : "No"}}</div>',
            //            field: 'isActive'
            //        },
                     
            //    ],
            //    data: []
            //};

            vm.paymentMethodChanged = function() {
                vm.getBillingMethodsWithCategory();
            };
            vm.sortColumn = function (col) {
                vm.column = col;
                if (vm.reverse) {
                    vm.reverse = false;
                    vm.reverseclass = 'arrow-up';
                } else {
                    vm.reverse = true;
                    vm.reverseclass = 'arrow-down';
                }
            }
            vm.sortClass = function (col) {
                if (vm.column == col) {
                    if (vm.reverse) {
                        return 'arrow-down';
                    } else {
                        return 'arrow-up';
                    }
                } else {
                    return '';
                }
            }

            vm.getBillingMethodCategory = function (type) {
                if (type == 1)
                    return app.localize('Cash');
                else if (type == 2)
                    return app.localize('CreditCard');
                else if (type == 3)
                    return app.localize('DebitCard');
                else if (type == 4)
                    return app.localize('Cheque');
                else if (type == 5)
                    return app.localize('BankTransfer');
                else if (type == 7)
                    return app.localize('CardRefund');
                else if (type == 6)
                    return app.localize('Other');
                return '';
            };
            vm.getBillingMethodCategoryForFilter = function (type) {
                if (type == 0)
                    return app.localize('BothReceiptsAndPayments');
                else if (type == 1)
                    return app.localize('Receipts');
                else if (type == 2)
                    return app.localize('Payments');
                return '';
            };

            vm.getBillingMethodsWithCategory = function () {
                vm.loading = true;
                
                billingMethodService.getAllTypeBillingMethods().success(function (data) {
                    vm.filters = data.items;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.paymentMethodFor = [
               { id: 1, name: app.localize('Receipts') },
               { id: 2, name: app.localize('Payments') }
            ];


            function openCreateOrEditBillingMethodModal(billingMethodId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/billingMethods/createOrEditModal.cshtml',
                    controller: 'tenant.views.billingMethods.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        billingMethodId: function () {
                            return billingMethodId;

                        },

                        category: function () {

                            return vm.filters.category;
                        }
                    }

                });

                modalInstance.result.then(function (result) {
                    vm.getBillingMethodsWithCategory();
                });
            }

            vm.createBillingMethod = function () {
                openCreateOrEditBillingMethodModal(null);
            };

            vm.editBillingMethod = function (billingMethod) {
                openCreateOrEditBillingMethodModal(billingMethod);
            };

            vm.deleteBillingMethod = function (billingMethod) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', billingMethod.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            billingMethodService.deleteBillingMethod({
                                id: billingMethod.id
                            }).success(function () {
                                vm.getBillingMethodsWithCategory();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getBillingMethodsWithCategory();
        }
    ]);
