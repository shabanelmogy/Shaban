// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:105090-105129
appModule.controller('tenant.views.common.settings.createOrEditHolidayModal', ['$scope', '$uibModalInstance', 'holiday', 'abp.services.app.holiday',
        function ($scope, $uibModalInstance, holiday, holidayService) {

            var vm = this;
            //vm.saving = false;
            //vm.isEditMode = false;
            ////vm.ViewOnly = salikAccount.showMode;
            //vm.holiday = {};
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            }

            vm.save = function () {
                vm.saving = true;
                holidayService.createOrUpdateHoliday({
                    holiday: vm.holiday,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    
                    vm.saving = false;
                });
            };

            function init() {
                
                holidayService.getHolidayForEdit({
                    id: holiday
                }).success(function (result) {
                    vm.holiday = result;


                   
                });
            }

            init();

        }]);
