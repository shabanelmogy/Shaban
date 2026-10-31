// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:408285-408513
appModule.controller('tenant.views.ers.quotation.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.quotation', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.user',
        function ($scope, appSession, $stateParams, quotationService, commonLookupService, utilities, userService) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.isPhantomRentACar = appSession.tenant.tenancyName.toLowerCase() == 'phantomrentacar';
            vm.userName = '';
            vm.showWithOperatorColumn = false;
            vm.locationId = appSession.user.locationId;
            vm.showWithOutOperatorColumn = false;
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.currencyName = abp.setting.get("App.General.CurrencyName");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.quotationId))
                    quotationId = $scope.$parent.vmMain.quotationId;
            }

            //if through url print
            if (quotationId == 0 && !isNaN($stateParams.query)) {
                quotationId = $stateParams.query;
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

            vm.getQuotationType = function (id) {
                if (id == 1) {
                    return vm.localize("Daily");
                }
                else if (id == 2) {
                    return vm.localize("Weekly");
                }
                else if (id == 3) {
                    return vm.localize("Monthly");
                }
                else if (id == 4) {
                    return vm.localize("Monthly");
                }
                else if (id == 5) {
                    return vm.localize("Monthly");
                }
            };

            vm.getQuotationPeriodType = function (id) {
                if (id == 1) {
                    return "Days";
                }
                else if (id == 2) {
                    return "Weeks";
                }
                else if (id == 3) {
                    return "Months";
                }
                else if (id == 4) {
                    return "Months";
                }
                else if (id == 5) {
                    return "Months";
                }
            };

            vm.getUserName = function (userId) {
                userService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name;
                    vm.userNameWithSurName = result.name + " " + result.surname;
                });
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };


            vm.getAgreementTypeName = function (id) {
                if (id == 0) {
                    return 'NA';
                }
                else if (id == 1) {
                    return vm.localize('Daily');
                }
                else if (id == 2) {
                    return vm.localize('Weekly');
                }
                else if (id == 3) {
                    return vm.localize('Monthly');
                }
                else if (id == 4) {
                    return vm.localize('Lease');
                }
                else if (id == 5) {
                    return vm.localize('LeaseToOwn');
                }
            };

            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.getAgreementType = function (id) {
                if (id == 1)
                    return vm.localize("Daily");
                if (id == 2)
                    return vm.localize("Weekly");
                if (id == 3)
                    return vm.localize("Monthly");
                if (id == 4)
                    return vm.localize("Lease");
                if (id == 5)
                    return vm.localize("LeaseToOwn");
            };

            vm.getlocalDateTimeYearMonth = function (date, format) {
                if (date != null) {
                    if (format == null) format = 'YYYY/MM';

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
            //        vm.userName = result.name;
            //    });
            //};

            vm.getRateType = function (id) {
                if (id == 1) {
                    return 'PerDay';
                }
                else if (id == 2) {
                    return 'PerWeek';
                }
                else if (id == 3) {
                    return 'PerMonth';
                }
                else if (id == 4) {
                    return 'PerLiter';
                }
                else if (id == 5) {
                    return 'PerKM';
                }
                else if (id == 6) {
                    return 'OneTime';
                }
                else if (id == 7) {
                    return 'PerHour';
                }
                else if (id == 8) {
                    return 'PerHalfDay';
                }
                else if (id == 14) {
                    return 'PerYear';
                }
                else if (id == 15) {
                    return 'PercentPerYear';
                }
            };

            vm.getExtraLineAttachments = function (parentRow) {
                vm.attachmentExist = false;
                vm.attachment = null;
                var result = parentRow.extrasLines.filter(r => r.chargesTypeId == 71)[0];
                if (result) {
                    vm.attachmentExist = true;
                    // vm.attachment = result;
                    var vehicleTitle = result.vehicleType != null ? result.vehicleType.title : null;
                    var vehicleModel = result.vehicleModel.make ? result.vehicleModel.make.name : null + ' ' + result.vehicleModel.name;
                    vm.attachment = [vehicleTitle, vehicleModel].filter(Boolean).join(", ");
                }
            };

            function init() {
                vm.loading = true;
                quotationService.getQuotationForPrint({
                    id: quotationId
                }).success(function (result) {
                    vm.quotationResult = result;
                    vm.getUserName(vm.quotationResult.creatorUserId);
                    vm.showWithOperatorColumn = vm.quotationResult.quotationLines.filter(e => e.cost).length > 0 ? true : false;
                    vm.showWithOutOperatorColumn = vm.quotationResult.quotationLines.filter(e => e.extras).length > 0 ? true : false;
                    vm.mobilizationCharges = vm.quotationResult.quotationLines[0].extrasLines.filter(e => e.chargesTypeId == 26)[0];
                 

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
