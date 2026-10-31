// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:443077-443141
appModule.controller('tenant.views.hrm.shift.viewModal', [
        '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.shift', 'options',
        function ($uibModalInstance, directoryService, shiftService, options) {

            var vm = this;
            vm.loading = false;

            var shiftId = options.id;

            //functions
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function mapNumberToDay(number) {
                switch (number) {
                    case 1:
                        return 'Monday';
                    case 2:
                        return 'Tuesday';
                    case 3:
                        return 'Wednesday';
                    case 4:
                        return 'Thursday';
                    case 5:
                        return 'Friday';
                    case 6:
                        return 'Saturday';
                    case 7:
                        return 'Sunday';
                    default:
                        return 'Unknown Day';
                }
            }
            //vm.getTypeOfShift = function (type) {
            //    if (type == 1) {
            //        return app.localize("Loan Shift");
            //    } else {
            //        return "";
            //    }
            //};

            //init 
            function init() {
                vm.loading = true;
                shiftService.getShiftForView({ id: shiftId }).success(
                    function (result) {
                        vm.shift = result;
                        var mappedWeekendDays = vm.shift.weekendDays.map(function (weekendDay) {
                            return {
                                dayOfWeek: weekendDay.dayOfWeek,
                                dayValue: mapNumberToDay(weekendDay.dayOfWeek),
                            };
                        });
                        console.log(mappedWeekendDays);
                        vm.shift.weekendDays = mappedWeekendDays;
                        /*vm.shift.type = vm.getTypeOfShift(vm.shift.type);*/

                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }
    ]);
