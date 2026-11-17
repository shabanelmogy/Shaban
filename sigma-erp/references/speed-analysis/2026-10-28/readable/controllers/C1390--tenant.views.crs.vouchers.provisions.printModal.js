// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:379463-379588
appModule.controller('tenant.views.crs.vouchers.provisions.printModal', ['$scope', '$stateParams', '$sce', 'appSession', 'abp.services.app.jV', 'abp.services.app.user', 'abp.services.app.commonLookup',
        function ($scope, $stateParams, sce, appSession, JVService, userService, commonLookupService) {
            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            var JVId = 0;
            // vm.userName = appSession.user.name;
            vm.amount = 0;
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.currencyName = abp.setting.get("App.General.CurrencyName");
            vm.tollLenth = 0;
            vm.debitAmount = 0;
            vm.creditAmount = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            if (!isNaN($stateParams.query)) {
                JVId = $stateParams.query;
            }

            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.JVId))
                    JVId = $scope.$parent.vmMain.JVId;
            }

            //if through url print
            if (JVId == 0 && !isNaN($stateParams.query)) {
                JVId = $stateParams.query;
            }

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

            vm.getUserName = function (userId) {
                userService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
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

            vm.contactTypeById = function (id) {
                if (id == 1) {
                    return "Staff";
                }
                else if (id == 2) {
                    return "Customer";
                }
                else if (id == 3) {
                    return "Supplier";
                }
                else {
                    return "";
                }
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            function init() {
                getLocations();
                JVService.getJVForPrint({ id: JVId }).success(
                    function (result) {

                        vm.JV = result.voucherLines;
                        vm.voucherNo = result.voucherNo;
                        vm.date = result.date;
                        vm.invoice = result;
                        if (vm.JV.id < 1) {
                            vm.JV.debit = 0;
                            vm.JV.credit = 0;
                        }
                        else {
                            angular.forEach(vm.JV, function (value, key) {
                                if (value.debit != null && value.debit != 0)
                                    vm.debitAmount += value.debit;
                                if (value.credit != null && value.credit != 0)
                                    vm.creditAmount += value.credit;
                            });
                            angular.forEach(vm.JV, function (value, key) {
                                if (value.vehicleId != null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId != null && value.contactId > 0) {
                                    value.contactShow = true;
                                }
                            });
                        }
                        vm.getUserName(vm.invoice.creatorUserId);
                    });
            }
            init();
        }
    ]);
