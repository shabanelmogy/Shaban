// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:368237-368405
appModule.controller('tenant.views.crs.vouchers.jvs.printModal', ['$scope', '$stateParams', '$sce', 'appSession', 'abp.services.app.jV', 'abp.services.app.user', 'abp.services.app.commonLookup','utilities',
        function ($scope, $stateParams, sce, appSession, JVService, userService, commonLookupService, utilities) {
            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            var JVId = 0;
            // vm.userName = appSession.user.name;
            vm.amount = 0;
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.locationId = appSession.user.locationId;
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

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            function customizePagesDataForVoucherLines() {
                var recordsPerPage = 12;
                if (appSession.tenant.tenancyName == "Galadaritrucks") {
                    recordsPerPage = 6;
                }
                if (appSession.tenant.tenancyName == "rentsolutions") {
                    recordsPerPage = 2;
                }
                
                var customArray = vm.JV;

                customArray.forEach((element, index) => element.srNo = index + 1);

                var arrayLength = customArray.length;
                var noOfPages = arrayLength / recordsPerPage;

                vm.pagesData = [];
                for (var i = 0; i < noOfPages; i++) {
                    var subArray = [];
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;
                    subArray = customArray.slice(start, end);
                    vm.pagesData.push({
                        pageNo: i + 1,
                        voucherLinesdataToIterate: subArray
                    })
                }
            }


            function init() {
                getLocations();
                JVService.getJVForPrint({ id: JVId }).success(
                    function (result) {

                        vm.JV = result.voucherLines;
                        vm.voucherNo = result.voucherNo;
                        vm.date = result.date;
                        vm.locationId = result.locationId;
                        vm.invoice = result;
                        debugger
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
                        customizePagesDataForVoucherLines();
                    });
            }
            init();
        }
    ]);
