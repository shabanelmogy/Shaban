// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:99711-99863
appModule.controller('tenant.views.common.hrm.payrolls.printModal',
        ['$scope', '$stateParams', 'abp.services.app.payroll', 'appSession', 'abp.services.app.commonLookup', 'utilities',
            function ($scope, $stateParams, payrollService, appSession, commonLookupService, utilities) {

                let vm = this;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;

                let payrollId = 0;

                vm.currency = abp.setting.get("App.General.CurrencyCode");
                vm.currencyName = abp.setting.get("App.General.CurrencyName");

                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.userName = '';
                vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';

                //if pop-up print
                if ($scope.$parent != null) {
                    if (!isNaN($scope.$parent.vmMain.payrollId))
                        payrollId = $scope.$parent.vmMain.payrollId;
                }

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });

                vm.getlocalDateTime = function (date, format) {
                    if (date != null) {
                        if (format == null) format = vm.dateFormat;

                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(format);
                    }
                    else {
                        return "";
                    }
                };

                //vm.getUserName = function (userId) {
                //    commonLookupService.getUser({
                //        id: userId
                //    }).success(function (result) {
                //        vm.userName = result.name + ' ' + result.surname;
                //    });
                //};

                vm.getlocalDateTimeForEngAr = function (date, format) {
                    if (date != null) {
                        if (format == null) format = vm.dateFormat;

                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(format);
                    }
                    else {
                        return "";
                    }
                };

                vm.getMonth = (date) => {
                    return moment(date).format('MM-YYYY');
                }

                vm.daysInMonth = (date) => {
                    return moment(date).daysInMonth();
                }

                vm.day = (date) => {
                    return moment(date).format('D');
                }

                vm.rounding = (value) => {
                    if (value === null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }


                function init() {
                    vm.loading = true;

                    payrollService.getPayroll({
                        id: payrollId
                    }).success(result => {
                        vm.payroll = result;

                        // Iterate over each payrollDetail
                        vm.payroll.payrollDetails.forEach(pd => {
                            // Initialize overTimeHours if not already set or it's empty
                            if (!pd.overTimeHours || pd.overTimeHours.length < 1) {
                                pd.overTimeHours = [];
                                let days = vm.daysInMonth(vm.payroll.month);

                                // Populate overTimeHours with default values
                                for (let d = 1; d <= days; d++) {
                                    pd.overTimeHours.push({
                                        agreementOTHourId: 0,
                                        isHoliday: false,
                                        hours: 0.0,
                                        date: null,
                                        day: d
                                    });
                                }
                            }
                            pd.overTimeHoursChunks = chunkArray(pd.overTimeHours, 16);
                        });
                    }).finally(() => {
                        vm.loading = false;
                    });
                }

                // Helper function to chunk an array into chunks of a given size
                function chunkArray(array, chunkSize) {
                    const result = [];
                    for (let i = 0; i < array.length; i += chunkSize) {
                        result.push(array.slice(i, i + chunkSize));
                    }
                    return result;
                }


                //function init() {
                //    vm.loading = true;
                //    payrollService.getPayroll({
                //        id: payrollId
                //    }).success(result => {
                //        vm.payroll = result;
                //        vm.payroll.payrollDetails.forEach(pd => {
                //            if (!pd.overTimeHours || pd.overTimeHours.length < 1) {
                //                pd.overTimeHours = [];
                //                let days = vm.daysInMonth(vm.payroll.month);
                //                for (let d = 1; d <= days; d++) {
                //                    pd.overTimeHours.push({
                //                        agreementOTHourId: 0,
                //                        isHoliday: false,
                //                        hours: 0.0,
                //                        date: null,
                //                        day: d
                //                    });
                //                }
                //            }
                //        });

                //        //vm.getUserName(vm.payroll.creatorUserId);
                //    }).finally(() => {
                //        vm.loading = false;
                //    });
                //}

                init();
            }
        ]);
