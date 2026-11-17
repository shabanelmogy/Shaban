// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:437215-437242
appModule.controller('tenant.views.hrm.holiday.viewModal', [
        '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.holiday', 'options',
        function ($uibModalInstance, holidayService, options) {

            var vm = this;
            vm.loading = false;

            var holidayId = options.id;

            //functions
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.loading = true;
                holidayService.getHolidayForEdit({ id: holidayId }).success(
                    function (result) {
                        vm.holiday = result;
                       

                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }
    ]);
