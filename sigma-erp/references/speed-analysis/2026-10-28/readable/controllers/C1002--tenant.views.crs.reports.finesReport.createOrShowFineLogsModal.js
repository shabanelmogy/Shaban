// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:270347-270398
appModule.controller('tenant.views.crs.reports.finesReport.createOrShowFineLogsModal', [
        '$uibModalInstance', 'abp.services.app.uaeFine', 'fine',
        function ($uibModalInstance, finesService, fine) {
            var vm = this;

            vm.newFineLog = { fineId: fine.id };
            vm.fine = fine;
            vm.fineLogs = [];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.cancel = function () {
                $uibModalInstance.close();
            };

            init();

            function init() {
                getFineLogs();
            }

            function getFineLogs() {
                vm.loading = true;
                finesService.fineLogs({ id: fine.id }).success(function (data) {
                    vm.fineLogs = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.saveLog = function () {
                vm.loading = true;
                finesService.createFineLog(vm.newFineLog).success(function (data) {
                    vm.newFineLog.detail = "";
                    getFineLogs();
                }).finally(function () {
                    vm.loading = false;
                });
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
        }
    ]);
