// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:166387-166584
appModule.controller('tenant.views.crs.banking.chequesPayables.printModal', [
        '$stateParams', '$scope', 'appSession', 'abp.services.app.commonLookup', 'utilities', '$uibModal', 'abp.services.app.bankAccount', 'abp.services.app.billingMethod', 'abp.services.app.chequesPayables',
        function ($stateParams, $scope, appSession, commonLookupService, utilities, $uibModal, bankAccountService, billingMethodService, chequesPayablesService) {
            var vm = this;
            vm.bankAccounts = null;
            vm.pdcPayable = {};
            var chequeId = 0;
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
            vm.execute = true;

            //if pop-up print
            if ($scope.$parent !== null) {
                if ($scope.$parent.chequeId.id) {
                    chequeId = $scope.$parent.chequeId.id;
                }
            }

            //if through url print
            if (chequeId <= 0) {
                if (!isNaN($stateParams.query)) {
                    chequeId = $stateParams.query;
                }
            }

            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };


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


            vm.cssValues = function () {
                if (vm.pdcPayable.billingDetail.cheque.bankAccount.chequePrintTemplate) {
                    var JsonValues = JSON.parse(vm.pdcPayable.billingDetail.cheque.bankAccount.chequePrintTemplate);
                    var widthInMM = JsonValues.ChequeWidth;
                    var heightInMM = JsonValues.ChequeHeight;
                    var dateMarginLeft = JsonValues.DateX;
                    var dateMarginTop = JsonValues.DateY;
                    var amountMarginLeft = JsonValues.AmountX;
                    var amountMarginTop = JsonValues.AmountY;
                    var amountInWordsMarginLeft = JsonValues.AmountInWordsX;
                    var amountInWordsMarginTop = JsonValues.AmountInWordsY;
                    var payToMarginLeft = JsonValues.PayToX;
                    var payToMarginTop = JsonValues.PayToY;
                    var fontSize = JsonValues.FontSize;
                    var fontColor = JsonValues.FontColor;
                    vm.contactName = vm.pdcPayable.contact != null ? vm.pdcPayable.contact.name : null;
                    vm.colorFontObj = {};
                    vm.colorFontObj.position = 'relative';
                    if (fontSize) {
                        vm.colorFontObj['font-size'] = fontSize + 'px';
                    }
                    if (fontColor) {
                        vm.colorFontObj.color = fontColor;
                    }
                    $(".modal-content").attr("style", "width:" + widthInMM + "mm !important;height:" + heightInMM + "mm !important;")
                    $("#dateField").attr("style", "margin-left:" + dateMarginLeft + "mm !important;margin-top:" + dateMarginTop + "mm !important;position:absolute;")
                    $("#amountInWordsField").attr("style", "margin-left:" + amountInWordsMarginLeft + "mm !important;margin-top:" + amountInWordsMarginTop + "mm !important;position:absolute;width:50%;")
                    $("#amountField").attr("style", "margin-left:" + amountMarginLeft + "mm !important;margin-top:" + amountMarginTop + "mm !important;position:absolute;")
                    $("#payToField").attr("style", "margin-left:" + payToMarginLeft + "mm !important;margin-top:" + payToMarginTop + "mm !important;position:absolute;")
                }
                else {
                    //  abp.notify.warn('Please Provide Cheque Print Settings First');
                    return;
                }
            };

            vm.changeNamePopUp = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesPayables/changeNameprintModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesPayables.changeNameprintModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        contactName: function () {
                            return {
                                contactName: vm.contactName,
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.contactName = result;
                    vm.execute = false;
                });
            };

            vm.getAmountInWords = function (amount) {
                if (amount != null && amount > 0) {
                    return utilities.toWords(vm.rounding(amount));
                }
            };


            vm.customAmountText = function (text) {
                var arr = text.replace('Dirhams', '').replace('Fils', '').split(' ');
                if (arr.indexOf('And') >=0) {
                    arr.splice(arr.indexOf('And') + 1, 0, 'FILS');
                }
                return arr.join(' ');
            };

            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
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

            function getBankAccounts() {
                vm.loading = true;
                bankAccountService.getBankAccountsForSelection({}).success(function (data) {
                    vm.bankAccounts = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 2, type: 4 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            getPdcPayableForPrint = function () {
                vm.loading = true;
                chequesPayablesService.getCPForPrint({
                    id: chequeId
                }).success(function (data) {
                    vm.pdcPayable = data;
                    vm.totalAmount = 0;
                    vm.getUserName(vm.pdcPayable.creatorUserId);
                    vm.totalAmount = vm.pdcPayable.amount;
                }).finally(function () {
                    vm.loading = false;
                });

            }

            function init() {
                vm.loading = true;
                getBankAccounts();
                getBillingMethods();
                getPdcPayableForPrint();
                vm.loading = false;
            }
            init();
        }
    ]);
