// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:190958-191061
appModule.controller('host.views.marketing.leads.createFarmModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.lead', 'abp.services.app.user', 'abp.services.app.commonLookup',
        'abp.services.app.directory', 'abp.services.app.hostProduct', 'abp.services.app.tenant',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, countryService, leadService, userService, commonLookupService, directoryService, productService, tenantService) {

            var vm = this;
            vm.loading = true;
            vm.resources = [];
            vm.hostProducts = [];
            vm.lockSalesPersonControl = false;

            const marketingManagerUserId = parseInt(abp.setting.get("App.UserManagement.MarketingManagerUserId"));
            const salesManagerUserId = parseInt(abp.setting.get("App.UserManagement.SalesManagerUserId"));

            vm.users = [];

            vm.title = "";

            vm.lead = {
                status: 1,
            };
            vm.saving = false;

            var requestParams = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };


            vm.getTenants = function () {
                vm.loading = true;

                tenantService.getProductionTenants().success(function (data) {
                    vm.productionTenants = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.selectUnSelectAll = function (checked) {
                vm.productionTenants.forEach(x => {
                    if (x.contactCountry)
                        x.isSelected = checked;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            const getUser = (userId) => userService.getUser({ id: userId }).success((user) => vm.lead.salesPersonUser = user);

            vm.getSelectedCount = () => { return !vm.productionTenants ? 0 : vm.productionTenants.filter(x => x.isSelected).length };

            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };

            vm.save = function () {
                const input = {
                    title: vm.title,
                    selectedTenantsCompanyIds: []
                };

                debugger;
                const selectedTenanats = vm.productionTenants.filter(x => x.isSelected);
                input.selectedTenantsCompanyIds = selectedTenanats.map(x => { return { name: x.id, value: x.contactId } });
                leadService.createFarm(input).success(r => {
                    abp.notify.info('Saved Successfully');
                    $uibModalInstance.close();
                });
            };


            vm.sortDirection = 'ascending';
            vm.orderBy = function (orderBy) {


                vm.productionTenants.sort((rowA, rowB) => {

               

                    const cellA = rowA[orderBy] ? rowA[orderBy].toString().trim() : "";
                    const cellB = rowB[orderBy]?  rowB[orderBy].toString().trim() : "";

                    return vm.sortDirection === 'ascending' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
                });
                vm.sortDirection = vm.sortDirection === 'ascending' ? 'descending' : 'ascending';
            }

            function init() {
                vm.loading = true;
                vm.getTenants();
               // vm.orderBy();
            }

            init();
        }
    ]);
