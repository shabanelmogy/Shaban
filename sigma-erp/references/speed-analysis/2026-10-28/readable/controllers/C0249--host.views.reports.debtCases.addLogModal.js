// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:76537-76590
appModule.controller('host.views.reports.debtCases.addLogModal', [
    '$scope', '$uibModalInstance', '$uibModal','caseObj', 'abp.services.app.case', 'abp.services.app.user',
    function ($scope, $uibModalInstance, $uibModal, caseObj, caseService, userService) {
        var vm = this;
        vm.case = angular.copy(caseObj);
        vm.filters = {};
        vm.documents = [];

        vm.searchAssignedUsers = function ($select) {
            if (!$select.search)
                return null;
            userService.searchAssignedToUsers({ keyword: $select.search }).then(function (response) {
                vm.assignedToUserNames = response.data.items;
            });
        };
        vm.getOriginalName = function (doc) {
            var originalName = doc.name.replace("_" + doc.guid, "");
            return originalName;
        };
        vm.uploadDocument = function () {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/host/views/reports/debtCases/uploadDocumentsModal.cshtml',
                controller: 'host.views.reports.debtCases.uploadDocumentsModal as vm',
                backdrop: 'static',
                resolve: {
                    tenantId: function () {
                        return 0;
                    }
                }

            });
            modalInstance.result.then(function (result) {
                vm.documents.push(result);

            });
        };

        vm.save = function () {
            caseService.saveCaseLog({
                caseId: caseObj.id,
                detail: vm.case.detail,
                assignedToUserId: vm.case.assignedToUserId,
                dueDate: vm.case.dueDate,
                documents: vm.documents
            }).success(function () {
                $uibModalInstance.close();
            });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
]);
