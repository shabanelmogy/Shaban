// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:101977-102045
appModule.controller('tenant.views.mergeContacts.searchAddContacts',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.tariffGroup', 'uiGridConstants', '$filter', 'contactCategory',
        function ($scope, $uibModal, $uibModalInstance, directoryService, tariffGroupService, uiGridConstants, $filter, contactCategory) {

            var vm = this;
            vm.data = [];
            vm.contactCategory = contactCategory;
           
            vm.filters = {
                keyword: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                contactCategory: contactCategory == null ? 1 : contactCategory,
                contactType: this.contactTypes == null ? 1 : this.contactTypes
            };
            vm.contactTypeLock = false;
            vm.contactCategories = [
                { id: 1, name: 'Person' },
                { id: 2, name: 'Company' },
            ];
            vm.contactTypes = [
                { id: 2, name: 'Customer' },
                { id: 1, name: 'Staff' },

            ];
            vm.searchContacts = function () {
                if (!vm.filters.keyword) return;
                vm.loading = true;
                if (vm.filters.contactCategory == 2) {
                    vm.filters.contactType =2
                        
                }
                return directoryService.searchContactsForMerging(vm.filters)
                    .then(function (response) {
                        vm.data = response.data.items;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.changeContactCategory = function () {
                if (vm.filters.contactCategory == 2) {
                    vm.filters.contactType = 2;
                    vm.contactTypeLock = true;
                }
                else {
                    vm.filters.contactType == vm.filters.contactType;
                    vm.contactTypeLock = false;
                }
            };
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Contacts.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Contacts.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Contacts.Delete')
            };

            vm.save = function () {
                if (vm.data.length == 0) return;
                var foundLines = $filter('filter')(vm.data, {
                    selected: true,
                }, true);
                $uibModalInstance.close(foundLines);
            };

        }]);
