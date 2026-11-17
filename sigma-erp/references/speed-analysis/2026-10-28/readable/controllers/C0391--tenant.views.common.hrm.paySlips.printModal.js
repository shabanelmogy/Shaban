// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:100534-100692
appModule.controller('tenant.views.common.hrm.paySlips.printModal',
        ['$scope', '$timeout', '$stateParams', 'abp.services.app.payroll', 'appSession', 'abp.services.app.commonLookup', 'utilities',
            function ($scope, $timeout, $stateParams, payrollService, appSession, commonLookupService, utilities) {

                let vm = this;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;

                let payrollId = 0;
                let staffId = 0;
                vm.paySlipNo = "";

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
                    if (!isNaN($scope.$parent.vmMain.staffId))
                        staffId = $scope.$parent.vmMain.staffId;
                    if ($scope.$parent.vmMain.paySlipNo)
                        vm.paySlipNo = $scope.$parent.vmMain.paySlipNo;
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

                // Function to initialize payroll data
                function chunkArray(array, chunkSize) {
                    const result = [];
                    for (let i = 0; i < array.length; i += chunkSize) {
                        result.push(array.slice(i, i + chunkSize));
                    }
                    return result;
                }

                function init() {
                    if (!payrollId || !staffId) return;
                    vm.loading = true;

                    payrollService.getPaySlipForPrint(payrollId, staffId)
                        .success(result => {
                            vm.payroll = result;
                            // Ensure that the overTimeHours array is populated correctly
                            $scope.$applyAsync(() => {
                                if (vm.payroll.payrollDetails && vm.payroll.payrollDetails.length > 0) {
                                    let payrollDetail = vm.payroll.payrollDetails[0];

                                    // Only initialize overTimeHours if it's empty or not defined
                                    if (!payrollDetail.overTimeHours || payrollDetail.overTimeHours.length < 1) {
                                        payrollDetail.overTimeHours = [];
                                        let days = vm.daysInMonth(vm.payroll.month);

                                        // Populate overTimeHours only once
                                        for (let d = 1; d <= days; d++) {
                                            payrollDetail.overTimeHours.push({
                                                agreementOTHourId: 0,
                                                isHoliday: false,
                                                hours: 0.0,
                                                date: null,
                                                day: d
                                            });
                                        }
                                    }
                                    payrollDetail.overTimeHoursChunks = chunkArray(payrollDetail.overTimeHours, 16);
                                }
                            });
                        })
                        .finally(() => {
                            vm.loading = false;
                        });
                }

                //function init() {
                //    if (!payrollId || !staffId) return;
                //    vm.loading = true;
                //    payrollService.getPaySlipForPrint(payrollId, staffId).success(result => {
                //        vm.payroll = result;
                //        if (!vm.payroll.payrollDetails[0].overTimeHours || vm.payroll.payrollDetails[0].overTimeHours.length < 1) {
                //            vm.payroll.payrollDetails[0].overTimeHours = [];
                //            let days = vm.daysInMonth(vm.payroll.month);
                //            for (let d = 1; d <= days; d++) {
                //                vm.payroll.payrollDetails[0].overTimeHours.push({
                //                    agreementOTHourId: 0,
                //                    isHoliday: false,
                //                    hours: 0.0,
                //                    date: null,
                //                    day: d
                //                });
                //            }
                //        }


                //        //vm.getUserName(vm.payroll.creatorUserId);
                //    }).finally(() => {
                //        vm.loading = false;
                //    });
                //}

                init();
            }
        ]);
