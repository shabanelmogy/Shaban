// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:70597-70684
appModule.controller('host.views.dataEntry.dataEntryCorrections.createOrShowEntryLogsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.dataEntryCorrectionHost', 'dataEntry', '$uibModal',
        function ($scope, $uibModalInstance, dataEntryCorrectionService, dataEntry, $uibModal) {
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

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };


            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/dataEntry/dataEntryCorrections/uploadDocumentsModal.cshtml',
                    controller: 'host.views.dataEntry.dataEntryCorrections.uploadDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenantId: function () {
                            return vm.dataEntry.tenantId
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);

                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.save = function () {
                vm.loading = true;
                dataEntryCorrectionService.saveDataEntryCorrectionLog({
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


           



            vm.getDataEntryLogs = function () {
                vm.loading = true;
                dataEntryCorrectionService.getDataEntryCorrectionLogs({
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
