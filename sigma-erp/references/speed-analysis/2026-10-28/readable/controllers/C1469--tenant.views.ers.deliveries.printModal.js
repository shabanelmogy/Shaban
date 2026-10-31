// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:401831-401989
appModule.controller('tenant.views.ers.deliveries.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.equipmentDeliverySearch', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, appSession, $stateParams, equipmentDeliverySearchService, commonLookupService, utilities) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.userName = '';
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.locationId = appSession.user.locationId;
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.deliveryId))
                    deliveryId = $scope.$parent.vmMain.deliveryId;
            }

            //if through url print
            if (deliveryId == 0 && !isNaN($stateParams.query)) {
                deliveryId = $stateParams.query;
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

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.getAgreementTypeName = function (id) {
                if (id == 0) {
                    return 'NA';
                }
                else if (id == 1) {
                    return 'Daily';
                }
                else if (id == 2) {
                    return 'Weekly';
                }
                else if (id == 3) {
                    return 'Monthly';
                }
                else if (id == 4) {
                    return 'Lease';
                }
                else if (id == 5) {
                    return 'LeaseToOwn';
                }
            };

            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };




            vm.getAgreementType = function (id) {
                if (id == 1)
                    return vm.localize("Daily")
                if (id == 2)
                    return vm.localize("Weekly")
                if (id == 3)
                    return vm.localize("Monthly")
                if (id == 4)
                    return vm.localize("Lease")
                if (id == 5)
                    return vm.localize("LeaseToOwn")
            }


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

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name;
                });
            };

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


            function init() {
                vm.loading = true;
                equipmentDeliverySearchService.getEquipmentRentalAgreementForPrint({
                    id: deliveryId
                }).success(function (result) {
                    debugger;
                    vm.Agreement = result;
                  //  vm.outCheckList = vm.Agreement.movements[0].outCheckList.map(e => e.name);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            init();
        }
    ]);
