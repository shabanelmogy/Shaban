// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:397890-398018
appModule.controller('tenant.views.crs.vouchers.stockAdjustment.printModal',
        ['$stateParams', '$scope', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.stockAdjustment', 'utilities',
            function ($stateParams, $scope, appSession, commonLookupService, StockAdjustmentService, utilities) {

                var vm = this;
                var JVId = 0;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;
                vm.currency = abp.setting.get("App.General.CurrencyCode");
                vm.currencyName = abp.setting.get("App.General.CurrencyName");
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                //vm.userName = appSession.user.name;
                vm.userName = '';
                vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
                vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));


                var recordsPerPage = 10;
                if ($scope.$parent != null) {
                    if (!isNaN($scope.$parent.vmMain.JVId))
                        JVId = $scope.$parent.vmMain.JVId;
                }


                vm.currencyAndRounding = function (value) {
                    if (value == null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                };


                //if through url print
                if (JVId == 0 && !isNaN($stateParams.query)) {
                    JVId = $stateParams.query;
                }

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });
                vm.rounding = function (value) {
                    return utilities.round(value, 2);
                };
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
                    commonLookupService.getUser({
                        id: userId
                    }).success(function (result) {
                        vm.userName = result.name + ' ' + result.surname;
                    });
                };
                vm.currencyAndRoundingWithThree = function (value) {
                    if (value == null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
                };
                function customizePagesData() {
                    var customArray = [];
                    var customArray = vm.voucherLines;
                    customArray = vm.stockAdjustment.voucherLines.filter(v => !v.hidden);
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
                    vm.loading = true;
                    StockAdjustmentService.getStockAdjustmentForEdit({
                        id: JVId
                    }).success(function (result) {
                        vm.stockAdjustment = result;
                        vm.voucherLine = result.voucherLines;
                        vm.voucherLines = result;
                        vm.debitAmount = 0.0;
                        vm.creditAmount = 0.0;
                        if (vm.tenancyName && vm.tenancyName.toLowerCase() === 'fixera') {
                            vm.stockAdjustment.voucherLines = vm.stockAdjustment.voucherLines.filter(v => !v.hidden);
                        }

                        vm.stockAdjustment.voucherLines.forEach(function (value) {
                            if (value.debit > 0) {
                                if (vm.tenancyName && vm.tenancyName.toLowerCase() === 'fixera') {
                                    if (!value.hidden) {
                                        vm.debitAmount += parseFloat(value.debit);
                                    }
                                }
                                else {

                                    vm.debitAmount += parseFloat(value.debit);
                                }
                            }
                            if (value.credit > 0) {
                                vm.creditAmount += parseFloat(value.credit);
                            } else {
                                value.taxable = false;
                            }
                        });

                        customizePagesData();
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                init();
            }
        ]);
