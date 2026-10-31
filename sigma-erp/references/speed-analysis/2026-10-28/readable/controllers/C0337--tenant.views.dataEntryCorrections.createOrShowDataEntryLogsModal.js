// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:88502-88582
appModule.controller('tenant.views.dataEntryCorrections.createOrShowDataEntryLogsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.dataEntryCorrection', 'dataEntry', '$uibModal', 'abp.services.app.customerCareTenant',
        function ($scope, $uibModalInstance, dataEntryCorrectionService, dataEntry, $uibModal, customerCareTenantService) {
            var vm = this;
            vm.saving = false;
            vm.dataEntry = dataEntry;
            vm.documents = [];
            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };

            vm.cancel = function () {
                $uibModalInstance.close();;
            }



            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/supportRequests/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.common.supportRequests.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);

                });
            };



            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };

            vm.save = function () {
                vm.loading = true;
                customerCareTenantService.saveDataEntryCorrectionLog({
                    entryId: dataEntry.id,
                    detail: vm.dataEntry.reply,
                    documents: vm.documents
                }).success(function (data) {
                    vm.getDataEntryLogs();
                    vm.dataEntry.reply = "";
                    vm.documents = [];
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.getDataEntryLogs = function () {
                vm.loading = true;
                customerCareTenantService.getDataEntryCorrectionLogs({
                    id: dataEntry.id
                }).success(function (data) {
                    vm.dataEntry.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getDataEntryLogs();
        }
    ]);
