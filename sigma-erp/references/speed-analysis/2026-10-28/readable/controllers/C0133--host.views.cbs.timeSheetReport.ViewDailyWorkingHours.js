// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:55229-55309
appModule.controller('host.views.cbs.timeSheetReport.ViewDailyWorkingHours', [
        '$scope', '$uibModalInstance', '$uibModal', 'startdate', 'enddate', 'userId','utilities', 'abp.services.app.timeSheetReport',
        function ($scope, $uibModalInstance, $uibModal, startdate, enddate, userId, utilities, timeSheetReportService) {

            var vm = this;
            vm.loading = false;
            vm.dueTasks = [];



      

            //// GetWorkingHoursDetail in the Modal Table.
            vm.gettaskbyuserId = function () {
                vm.loading = true;
                timeSheetReportService.getHoursDetailByUserId(userId, startdate, enddate).success(function (data) {
                    data.forEach(function (item, index) {
                        item.dateTime = moment(item.dateTime).format('MMMM Do YYYY, h:mm:ss a');
                    });
                    vm.Detail = data;
                    vm.DetailCount = data.length;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.EditTimeLog = function (taskLogId, dateTime,hours) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/timeSheetReport/EditDailyWorkingHours.cshtml',
                    controller: 'host.views.cbs.timeSheetReport.EditDailyWorkingHours as vm',
                    backdrop: 'static',
                    size: 'xs',
                    resolve:
                    {
                        taskLogId: function () {
                            return taskLogId;
                        },
                        dateTime: function () {
                            return dateTime;
                        },
                        hours: function () {
                            return hours;
                        },
                    }
                });
                modalInstance.result.then(function () {
                    vm.gettaskbyuserId();
                });
            };
   




            //Close the Modal.
            vm.cancel = function () {
                vm.Detail = [];
                vm.DetailCount =0;
                $uibModalInstance.close();
            };


            // Make the Task Column in Correct Format.
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);



    

 



            // Default Function
            function init() {
                vm.gettaskbyuserId();
            }
            init();
        }
    ]);
