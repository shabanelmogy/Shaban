// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:445092-445195
appModule.controller('tenant.views.hrm.staffTimeSheet.viewModal',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.staffTimeSheet', 'abp.services.app.attendanceRegularization', 'attendanceId',
            function ($scope, $uibModal, $uibModalInstance, staffTimeSheetService, regularizationService, attendanceId) {

                var vm = this;
                vm.loading = false;
                vm.requesting = false;
                vm.remainingRegularizations = 0;
                vm.isBiometricEnabled = abp.features.isEnabled('HRM.BiometricAttendance');
                vm.canRequestRegularization = abp.auth.hasPermission('Pages.HRM.AttendanceRegularization.Create');

                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.timeFormat = "HH:mm";

                vm.roundingforView = function (value) {
                    var roundedValue = utilities.roundforView(value, 2);
                    return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };

                vm.getlocalTime = function (date) {
                    if (!date) return "";
                    return moment(date).local().format(vm.timeFormat);
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                //vm.getAttendaceForView = function () {
                //    vm.loading = true;
                //    staffTimeSheetService.getAttendanceWithLogsForView(attendanceId).success(function (data) {
                //        vm.attendance = data;
                //        if (vm.isBiometricEnabled && vm.canRequestRegularization && data.staffId && data.date) {
                //            var m = moment(data.date);
                //            regularizationService.getRemainingRegularizations({
                //                staffId: data.staffId,
                //                month: m.month() + 1,
                //                year: m.year()
                //            }).success(function (remaining) {
                //                vm.remainingRegularizations = remaining;
                //            });
                //        }
                //    }).finally(function () {
                //        vm.loading = false;
                //    });
                //};


                vm.getAttendaceForView = function () {
                    vm.loading = true;

                    staffTimeSheetService.getAttendanceWithLogsForView(attendanceId)
                        .success(function (data) {
                            vm.attendance = data;

                            if (vm.isBiometricEnabled &&
                                vm.canRequestRegularization &&
                                data &&
                                data.staffId != null &&
                                data.date) {

                                var m = moment(data.date);

                                //var request = {
                                //    staffId: Number(data.staffId),
                                //    month: m.month() + 1,
                                //    year: m.year()
                                //};

                                regularizationService
                                    .getRemainingRegularizations(Number(data.staffId),
                                        m.month() + 1,
                                        m.year())
                                    .success(function (remaining) {
                                        vm.remainingRegularizations = remaining;
                                    });
                            }
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };
                vm.requestRegularization = function () {
                    $uibModal.open({
                        templateUrl: '~/App/tenant/views/hrm/attendanceRegularization/requestModal.cshtml',
                        controller: 'tenant.views.hrm.attendanceRegularization.requestModal as vm',
                        backdrop: 'static',
                        size: 'sm',
                        resolve: {
                            attendance: function () { return vm.attendance; }
                        }
                    }).result.then(function () {
                        vm.remainingRegularizations--;
                        abp.notify.success(app.localize('RegularizationRequestSubmitted'));
                    });
                };

                function init() {
                    vm.loading = true;
                    vm.getAttendaceForView();
                }
                init();
            }]);
