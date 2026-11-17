// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:396135-396241
appModule.controller('tenant.views.crs.vouchers.saleOrders.printModal',
        ['$stateParams', 'abp.services.app.saleOrder', '$scope', 'appSession', 'abp.services.app.commonLookup', 'utilities',
            function ($stateParams, saleOrdersService, $scope, appSession, commonLookupService, utilities) {

                var vm = this;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;
                var purchaseOrderId = 0;
                vm.currency = abp.setting.get("App.General.CurrencyCode");
                vm.currencyName = abp.setting.get("App.General.CurrencyName");
                vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
                vm.locationId = appSession.user.locationId;
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                //vm.userName = appSession.user.name;
                vm.userName = '';
                vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
                vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));

                if (!isNaN($stateParams.query)) {
                    purchaseOrderId = $stateParams.query;
                }

                //if pop-up print
                if ($scope.$parent != null) {
                    if (!isNaN($scope.$parent.vmMain.purchaseOrderId))
                        purchaseOrderId = $scope.$parent.vmMain.purchaseOrderId;
                }

                //if through url print
                if (purchaseOrderId == 0 && !isNaN($stateParams.query)) {
                    purchaseOrderId = $stateParams.query;
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
                vm.currencyAndRounding = function (value) {
                    if (value == null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                };

                vm.currencyAndRoundingWithThree = function (value) {
                    if (value == null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
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
                        saleOrdersService.getSaleOrderForPrint({
                            id: purchaseOrderId
                        }).success(function (result) {
                            vm.saleOrder = result.saleOrder;
                            if (vm.isMultiCurrencyEnabled) {
                                if (vm.saleOrder.contact.currency) {
                                    vm.currency = vm.saleOrder.contact.currency.code;
                                }
                            }
                            vm.getUserName(vm.saleOrder.creatorUserId);


                        }).finally(function () {
                            vm.loading = false;
                        });
                    }
                }

                init();
            }
        ]);
