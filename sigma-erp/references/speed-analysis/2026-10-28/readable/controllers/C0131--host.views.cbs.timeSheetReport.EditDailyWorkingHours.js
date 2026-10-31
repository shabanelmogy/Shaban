// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:55026-55080
appModule.controller('host.views.cbs.timeSheetReport.EditDailyWorkingHours', [
        '$scope', '$uibModalInstance', '$uibModal', 'taskLogId', 'dateTime', 'hours', 'abp.services.app.timeSheetReport',
        function ($scope, $uibModalInstance, $uibModal, taskLogId, dateTime, hours, timeSheetReportService) {

            var vm = this;
            vm.loading = false;



            vm.save = function () {
                vm.loading = true;
                timeSheetReportService.updateDailyWorkingHours(vm.taskLogId, vm.dateTime, vm.hours).success(function (result) {
                    $uibModalInstance.close();
                    abp.notify.info(app.localize('Updated Successfully!'));
                    vm.loading = false;
                });
            };



            // GetWorkingHoursDetail in the Modal Table.
            vm.OpenEditTimeLogModal = function () {
                vm.loading = true;
                vm.dateTime = moment.utc(moment(dateTime, 'MMMM Do YYYY, h:mm:ss a').toDate());
                vm.taskLogId = taskLogId;   
                vm.hours = hours;
                vm.loading = false;
            };



            //Check negative value.
            vm.checkValue = function (value) {
                vm.message = null;
                if (value < 0)
                {
                    vm.message = "Kindly Enter Positive Value";
                }
            };

            //Close the Modal.
            vm.cancel = function () {
                vm.dateTime =null;
                vm.taskLogId = 0;
                vm.hours = 0;
                $uibModalInstance.close();
            };

            // Default Function
            function init() {
                vm.OpenEditTimeLogModal();
            }
            init();
        }
    ]);
