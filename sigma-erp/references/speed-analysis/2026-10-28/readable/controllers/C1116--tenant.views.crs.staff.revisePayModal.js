// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:293942-294038
appModule.controller('tenant.views.crs.staff.revisePayModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.staff', 'staffId', 'abp.services.app.salaryItemsSetting',
        function ($scope, $uibModalInstance, staffService, staffId, salaryItemsSettingService) {

            var vm = this;
            vm.saving = false;
            
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat;
            vm.staffs = [];
            
            vm.salaryType = function (value) {
                var matchingObjects = vm.salaryTypes.filter(function (obj) {
                    return obj.id === value;
                });
                if (matchingObjects)
                    return abp.localization.localize(matchingObjects[0].type);

            };
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            
            
            vm.save = function () {
                vm.saving = true;
                vm.staff.contactId = staffId;
                staffService.revisePayStaff(vm.staff).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
                
            };
            vm.payCalculate = function (spp) {
                debugger
                if ( spp.amount != undefined && !spp.hasFormula) {

                    vm.loading = true;

                    staffService.getPayCalculate({
                        staff: vm.staff
                    }).success(function (result) {
                        vm.staff.staffPayPackages = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };
            
            vm.salaryCalculation = () => {
                vm.staff.grossPay = 0;
                vm.staff.netPay = 0;

                vm.staff.staffPayPackages.forEach(spp => {
                    if (spp.type === 1) {
                        vm.staff.grossPay += +spp.amount || 0;
                        vm.staff.netPay += +spp.amount || 0;
                    }
                    else {
                        vm.staff.netPay -= +spp.amount || 0;
                    }
                });
            }
            
            function init() {
                vm.loading = true;
                
               
                staffService.getStaffForEdit({
                    id: staffId
                }).success(function (result) {
                    vm.staff = result;
                    
                    if (vm.staff.id > 0) {
                        vm.salaryCalculation();
                    } else {
                        vm.staff.grossPay = 0;
                        vm.staff.netPay = 0;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
            salaryItemsSettingService.getSalaryItemTypes().success(function (data) {
                vm.salaryTypes = data;
                init();

            });
        }
    ]);
