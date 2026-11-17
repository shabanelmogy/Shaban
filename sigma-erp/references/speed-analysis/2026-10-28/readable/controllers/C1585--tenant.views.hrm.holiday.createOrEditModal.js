// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:436896-436937
appModule.controller('tenant.views.hrm.holiday.createOrEditModal', [
        '$uibModalInstance', '$uibModal', 'abp.services.app.directory', 'abp.services.app.designation', 'abp.services.app.holiday', 'abp.services.app.commonLookup', 'abp.services.app.department', 'options',
        function ($uibModalInstance, $uibModal, directoryService, designationService, holidayService, commonLookupService, staffDepartmentService, options) {
           

            var vm = this;
            vm.loading = false;
            var holidayId = options.id;
          
            //functions
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                holidayService.createOrUpdateHoliday({ holiday: vm.holiday }
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            //init 
            function init() {
                if (holidayId != null && holidayId != '' && holidayId != undefined) {
                    vm.loading = true;
                    holidayService.getHolidayForEdit({ id: holidayId }).success(
                        function (result) {
                            vm.holiday = result;
                          
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                
            }

            init();
        }
    ]);
