// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:271992-272107
appModule.controller('tenant.views.crs.reports.fineReport.printModal',
        ['$stateParams', 'abp.services.app.uaeFine', '$scope', 'appSession', 'utilities',
            function ($stateParams, uaeFineService, $scope, appSession, utilities) {

                var vm = this;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;
                var fineId = 0;
                vm.currency = abp.setting.get("App.General.CurrencyCode");
                vm.currencyName = abp.setting.get("App.General.CurrencyName");

                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                //vm.userName = appSession.user.name;
                vm.userName = '';
                vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
                vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                vm.plateSource = '';
                //if pop-up print
                if ($scope.$parent != null) {
                    if (!isNaN($scope.$parent.vmMain.fineId))
                        fineId = $scope.$parent.vmMain.fineId;
                }

                //if through url print
                if (fineId == 0 && !isNaN($stateParams.query)) {
                    fineId = $stateParams.query;
                }

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });
                vm.rounding = function (value) {
                    return utilities.round(value, 2);
                };
                vm.getlocalDateTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(vm.dateTimeFormat);
                    }
                    else {
                        return "";
                    }
                };

                vm.getTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('HH:mm');
                    }
                    else {
                        return "";
                    }
                };


                vm.getDate = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(vm.dateFormat);
                    }
                    else {
                        return "";
                    }
                };


                vm.getlocalDateYear = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format("YYYY");
                    }
                    else {
                        return "";
                    }
                };

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

                function init() {
                    {
                        vm.loading = true;
                        uaeFineService.getFineForPrint({
                            id: fineId
                        }).success(function (result) {
                            vm.fines = result;
                            if (vm.fines.plateSource)
                                vm.plateSource = vm.fines.plateSource.toUpperCase();

                            if (vm.fines.plateInfo) {
                                var CodeArr = vm.fines.plateInfo.split("-");
                                if (CodeArr.length >= 1) {
                                    vm.fines.plateCode = CodeArr[1];
                                }
                            }

                        }).finally(function () {
                                vm.loading = false;
                            });
                    }
                }

                init();
            }
        ]);
