// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:495638-495713
appModule.controller('tenant.views.workshop.jobs.vehicleQualityCheckModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.job', 'jobId',
        function ($scope, $uibModal, $uibModalInstance, jobAppService, jobId) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.loading = false;
            vm.isEditMod = false;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.documents = [];
            vm.qualityCheckReport = {
                id:null,
                qualityCheckDocument: null,
                jobId: jobId,
                qualityCheckedBy: ''
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
                    if (vm.documents.length == 0) { vm.documents.push(result); }
                    else
                        vm.documents[0] = result;
                });
            };

            vm.save = function () {
                vm.saving = true;
                vm.qualityCheckReport.qualityCheckDocument = vm.documents[0];
                jobAppService.addVehicleQualityCheckReport(vm.qualityCheckReport).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            function init() {
                vm.loading = true;
                jobAppService.getVehicleQualityCheckReportForEdit(jobId).success(function (result) {
                    vm.qualityCheckReport.id = result.id;
                    vm.qualityCheckReport.qualityCheckDocument = result.qualityCheckDocument;
                    vm.qualityCheckReport.qualityCheckedBy = result.qualityCheckedBy;
                    vm.documents.push(result.qualityCheckDocument)
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
