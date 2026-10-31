// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:75716-75796
appModule.controller('common.views.mergeContacts.importMergeContactsModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'fileName', '$filter', 'abp.services.app.mergeContact',
    function ($scope, $uibModal, $uibModalInstance, fileName, $filter, mergeContactService) {

        var vm = this;
        vm.saving = false;
        vm.totalCount = 0;
        var lastGroupId = 0;
        var currentGroupId = 0;
        vm.contactsMerged = 0;
        vm.hideMergeButton = false;
        vm.cancel = function () {
            if (vm.importedOpeningBalances)
                $uibModalInstance.close();
            else
                $uibModalInstance.dismiss();
        };

        vm.mergeImportedContacts = function () {
            
            vm.saving = true;
            var foundLines = $filter('filter')(vm.data, {
                groupId: currentGroupId,
            }, true);

            if (foundLines.length < 2) {
                currentGroupId++;

                if (currentGroupId <= lastGroupId)
                    vm.mergeImportedContacts();
                else {
                    vm.saving = false;
                    vm.hideMergeButton = true;
                }

            } else {
                var nameOfContacts = foundLines.map(function (line) {
                    return line.name;
                });
                mergeContactService.mergeContactsByName({ contacts: nameOfContacts })
                    .success(function (result) {
                        currentGroupId++;
                        vm.contactsMerged++;
                        if (currentGroupId <= lastGroupId)
                            vm.mergeImportedContacts();
                        else {
                            vm.saving = false;
                            vm.hideMergeButton = true;
                        }
                    }).error(function (response) {
                        vm.errorContactGroupId = currentGroupId;
                        vm.hideMergeButton = true;
                        vm.saving = false;
                        //abp.message.error(response.error);
                    });
            }

        };

        function init() {
            vm.loading = true;
            mergeContactService.importContactsFromExcel(fileName)
            .success(function (result) {
                vm.data = result;
                vm.totalCount = vm.data.length;
                currentGroupId = vm.data[0].groupId;
                lastGroupId = vm.data[vm.data.length - 1].groupId;
            })
            .error(function (response) {
                abp.message.error(response.error);
            })
            .finally(function () {
                vm.importing = false;
                vm.loading = false;
            });
        }
        init();


    }
    ]);
