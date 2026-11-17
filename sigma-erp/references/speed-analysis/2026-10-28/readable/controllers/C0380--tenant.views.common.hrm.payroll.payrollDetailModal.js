// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:98738-98789
appModule.controller('tenant.views.common.hrm.payroll.payrollDetailModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.payroll', 'payrollDetail', 'abp.services.app.salaryItemsSetting', 'category',
        function ($scope, $uibModalInstance, payrollService, payrollDetail, salaryItemsSettingService, category) {

            var vm = this;
            //vm.payrollDetail = JSON.parse(JSON.stringify(payrollDetail));
            vm.category = category;
            vm.rounding = (value) => {
                if (value === null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }
            vm.cancel = () => {
                $uibModalInstance.dismiss();
            };
            salaryItemsSettingService.getSalaryItemTypes().success(function (data) {
                vm.salaryTypes = data;
                vm.payrollDetail = payrollDetail;

            });

            //vm.getlocalDate = function (date) {
            //    if (date != null) {
            //        var localTime = moment.utc(new Date(date)).toDate();
            //        return moment(localTime).format('YYYY-MM-DD');
            //    }
            //    else {
            //        return "";
            //    }
            //};
            vm.getlocalDate = function (date) {
                if (date != null) {
                    return moment.utc(date).local().format('YYYY-MM-DD');
                } else {
                    return "";
                }
            };
            vm.salaryType = function (value) {

                if (value === 65) {
                    return "Extra Deduction";
                }

                var matchingObjects = vm.salaryTypes.filter(function (obj) {
                    return obj.id === value;
                });
                if (matchingObjects)
                    return abp.localization.localize(matchingObjects[0].type);

            };
        }
    ]);
