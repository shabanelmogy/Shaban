// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:101233-101334
appModule.controller('tenant.views.industries.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.industry',
        function ($scope, $uibModal, uiGridConstants, industryService) {
            debugger;
            var vm = this;
            vm.isCrsEnabled = abp.features.isEnabled("CRS");
            //vm.isTaxBranchEnabled = abp.features.isEnabled("CRS.CustomFeatures.TaxBranchwise");
          

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Industry.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Industry.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Industry.Delete')
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
                             '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editIndustry(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteIndustry(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('IndustryName'),
                        field: 'code'
                    },


                ],
                data: []
            };

            vm.getIndustries = function () {
                vm.loading = true;
                industryService.getIndustries({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditIndustryModal(industryId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/industries/createOrEditModal.cshtml',
                    controller: 'tenant.views.industries.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        industryId: function () {
                            return industryId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getIndustries();
                });
            }

            vm.createIndustry = function () {
                openCreateOrEditIndustryModal(null);
            };

            vm.editIndustry = function (industry) {
                openCreateOrEditIndustryModal(industry.id);
            };

            vm.deleteIndustry = function (industry) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', industry.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            industryService.deleteIndustry({
                                id: industry.id
                            }).success(function () {
                                vm.getIndustries();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getIndustries();
        }
    ]);
