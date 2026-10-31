// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:488255-488312
appModule.controller('tenant.views.workshop.jobEstimations.createLogModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.jobEstimation', 'jobId',
        function ($scope, $uibModal, $uibModalInstance, jobEstimationAppService, jobId) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.documents = [];
            vm.jobLog = {
                documents: null,
                jobId: jobId,
                detail: ''
            }
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

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

            vm.save = function () {
                vm.saving = true;
                vm.jobLog.documents = vm.documents;
                jobEstimationAppService.addJobLog({ jobLog: vm.jobLog }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }
        }
    ]);
