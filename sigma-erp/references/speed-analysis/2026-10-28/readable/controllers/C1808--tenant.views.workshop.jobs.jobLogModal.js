// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:494488-494581
appModule.controller('tenant.views.workshop.jobs.jobLogModal', [
        '$uibModalInstance', 'abp.services.app.job', 'jobCharge',
        function ($uibModalInstance, jobAppService, jobCharge) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.jobCharge = jobCharge;

            vm.jobTimeLog = {
                id : null,
                jobChargeId: vm.jobCharge.jobChargeId,
                startTime: null,
                endTime: null,
                minutes: null
            }
     
            vm.cancel = function () {
                $uibModalInstance.close();
            };

            vm.removeRow = function (obj) {
                var index = vm.jobTimeLogs.indexOf(obj);
                vm.jobTimeLogs.splice(index, 1);
                if (obj.id != 0 || obj.id != null)
                  vm.deleteRow(obj);
            };

            vm.deleteRow = function (obj) {
                vm.loading = true;
                jobAppService.deleteJobTimeLogs({ id: obj.id }).success(function (result) {
                    vm.calculateTotalMinutes();
                }).finally(function () {
                    vm.getJobChargeTimeLogs();
                });
            }

            vm.insuranceTypes = [
                { id: 1, name: app.localize("ExcessRepair") },
                { id: 2, name: app.localize("FullInsurance") }
            ];

            vm.getJobType = function (type) {
                var jobType = vm.jobTypes.filter(e => e.id == type)[0].name;
                return jobType;
            };

            vm.getInsuranceType = function (type) {
                var insuranceType = vm.insuranceTypes.filter(e => e.id == type)[0].name;
                return insuranceType;
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

            vm.getJobChargeTimeLogs = function () {
                vm.loading = true;
                jobAppService.getJobChargeTimeLogs({ id: vm.jobCharge.jobChargeId }).success(function (result) {
                    vm.jobTimeLogs = result;
                    vm.calculateTotalMinutes();
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.calculateTotalMinutes = function () {
                vm.totalMinutes = vm.jobTimeLogs.reduce((log, row) => log += row.minutes, 0);
            };

            vm.save = function () {
                vm.loading = true;
                jobAppService.createJobTimeLogs({ JobLog: vm.jobTimeLog }).success(function (result) {
                    vm.jobTimeLog.minutes = null;
                    vm.getJobChargeTimeLogs();
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                vm.getJobChargeTimeLogs();
            }
            init();

        }]);
