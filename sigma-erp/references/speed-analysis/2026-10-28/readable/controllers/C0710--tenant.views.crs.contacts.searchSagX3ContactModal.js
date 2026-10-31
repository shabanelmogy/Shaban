// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:185382-185453
appModule.controller('tenant.views.crs.contacts.searchSagX3ContactModal',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.company', 'uiGridConstants', 'utilities',
            function ($scope, $uibModal, $uibModalInstance, directoryService, companyService, uiGridConstants, utilities) {

                var vm = this;
                vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
                vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
                vm.filters = {
                    keyword: '',
                };

                vm.searchContacts = function () {
                    vm.loading = true;
                    return directoryService.searchSagX3Contacts(vm.filters)
                        .then(function (response) {
                            vm.gridOptions.data = response.data.items;
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
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
                            enableSorting: false,
                            width: 100,
                            cellTemplate:
                                '<div class=\"ui-grid-cell-contents\">' +
                                '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                                '    <button class="btn btn-xs btn-primary blue"  aria-haspopup="true" ng-click="grid.appScope.contactSelected(row.entity)" ><i class="fa fa-check"></i></button>' +
                                '  </div>' +
                                '</div>'
                        },

                        {
                            name: app.localize('ExternalCode'),
                            field: 'externalCode'
                        },
                        {
                            name: app.localize('Name'),
                            field: 'name'
                        }
                    ],
                    data: []
                };

                vm.contactSelected = function (contact) {
                    vm.loading = true;
                    companyService.createSagX3Contact(contact)
                        .then(function (response) {
                            $uibModalInstance.close(response.data);
                        })
                        .finally(function () {
                            vm.loading = false;
                        }); 
                };

                vm.searchContacts();

            }]);
