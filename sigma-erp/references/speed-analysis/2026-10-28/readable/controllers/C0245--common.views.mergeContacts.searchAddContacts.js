// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:76001-76050
appModule.controller('common.views.mergeContacts.searchAddContacts',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.tariffGroup', 'uiGridConstants', '$filter', 'contactCategory', 'selectedId', 'abp.services.app.person',
            function ($scope, $uibModal, $uibModalInstance, directoryService, tariffGroupService, uiGridConstants, $filter, contactCategory, selectedId, personService) {

                var vm = this;
                vm.data = [];
                vm.contactCategory = contactCategory;
                vm.selectedId = selectedId;
                vm.filters = {
                    keyword: '',
                    skipCount: 0,
                    maxResultCount: app.consts.grid.defaultPageSize,
                    contactCategory: contactCategory 
                };

                vm.contactCategories = [
                    { id: 2, name: 'Company' },
                    { id: 1, name: 'Person' },

                ];
                vm.searchContacts = function () {
                    if (!vm.filters.keyword) return;
                    vm.loading = true;
                    return directoryService.searchContactsForMerging(vm.filters)
                        .then(function (response) {
                            if (selectedId != "") {
                                vm.data = response.data.items.filter(function (item) {
                                    return item.id !== selectedId;
                                });
                            } else {
                                vm.data = response.data.items;
                            }
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                vm.save = function () {
                    if (vm.data.length == 0) return;
                    var foundLines = $filter('filter')(vm.data, {
                        selected: true,
                    }, true);
                    $uibModalInstance.close(foundLines);
                };

            }]);
