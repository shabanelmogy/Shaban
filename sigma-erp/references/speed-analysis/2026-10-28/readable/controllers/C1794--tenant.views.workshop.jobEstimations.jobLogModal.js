// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:489781-489839
appModule.controller('tenant.views.workshop.jobEstimations.jobLogModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.jobEstimation', 'options',
        function ($scope, $uibModal, $uibModalInstance, jobEstimationAppService, options) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
            vm.jobNo = options.jobNo;
            vm.documents = [];

        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.getlocalDateTime = function (date) {
            if (date !== null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };
        function init() {
            vm.loading = true;
            jobEstimationAppService.getJobLogs({ id: options.jobId }).success(function (result) {
                vm.jobLog = result.items;
                vm.documents = vm.jobLog.documents;
            }).finally(function () {
                vm.loading = false;
            });
        }
            init();
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
        function openCreateLogModal(jobId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/workshop/jobEstimations/createLogModal.cshtml',
                controller: 'tenant.views.workshop.jobEstimations.createLogModal as vm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    jobId: function () {
                        return jobId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                init();
            });
        }
        vm.createLog = function () {
            openCreateLogModal(options.jobId);
        };
    }
    ]);
