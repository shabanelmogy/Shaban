// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:493446-493508
appModule.controller('tenant.views.workshop.jobs.gatePassModal', [
        '$uibModalInstance', 'abp.services.app.job', 'jobId', 'utilities', 'appSession',
        function ($uibModalInstance, jobAppService, jobId, utilities, appSession) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.loading = false;



            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getFaultValue = function (id) {
                if (id == 1) {
                    return "Client At Fault";
                }
                else if (id == 2) {
                    return "Third Party Fault";
                }
                else {
                    return "";
                }
            };

            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateTimeFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };

            vm.getDate = function (date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };



            function init() {
                vm.loading = true;
                jobAppService.getPrintForGatePass({ id: jobId })
                    .success(function (result) {
                        vm.job = result;

                    }).finally(function () {
                        vm.loading = false;

                    });
            }

            init();


        }]);
