// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:415768-415933
appModule.controller('tenant.views.externalLogin.limoBookings.printModal', ['$scope', '$stateParams', 'appSession', 'utilities', 'abp.services.app.externalLimoTripPrint',
        function ($scope, $stateParams, appSession, utilities,externalLimoTripPrintService) {
            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.userName = appSession.user.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.trip_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.trip_EnableCustomField2 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.trip_EnableCustomField3 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
            vm.trip_CustomField1Type = parseInt(abp.setting.get("App.General.Trip_CustomField1Type"));
            vm.trip_CustomField2Type = abp.setting.get("App.General.Trip_CustomField2Type");
            vm.trip_CustomField3Type = abp.setting.get("App.General.Trip_CustomField3Type");
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
            vm.noOfPersonsEnabled = utilities.parseBoolean(abp.setting.get("App.General.NoOfPersonsEnabled"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.trn = '';
            vm.rounding = function (value) {
                if (value == null) return null;
                value = utilities.round(value, 2);
                value = Number(value).toFixed(2);
                return value.toLocaleString('en');
            };
            var tripId = 0;
            //if pop-up print
            //if ($scope.$parent) {
            //    if ($scope.$parent.vmMain && $scope.$parent.vmMain.tripId)
            //        tripId = $scope.$parent.vmMain.tripId;
            //}

            ////if through url print
            //if (tripId == 0 && !isNaN($stateParams.query)) {
            //    tripId = $stateParams.query;
            //}

            if ($scope.$parent !== null) {
                if ($scope.$parent.tripId) {
                    tripId = $scope.$parent.tripId.id;
                  //  vm.printHeader = !($scope.$parent.invoiceId.printHeader);
                }
            }
            if (tripId <= 0) {
                if (!isNaN($stateParams.query)) {
                    tripId = $stateParams.query;
                }
            }

            vm.getUserName = function (userId) {
                userService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name;
                });
            };
            vm.onImageError = function () { vm.imgError = true; };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.getOnlyTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                } else {
                    return "";
                }
            };

            //vm.CurrencyFormate = function (amount) {
            //    if (amount == null) return null;
            //    return amount.toLocaleString('en');
            //};

            vm.getTimeDiffFromDate = function (startDate, endDate) {
                var pickUptime = moment(startDate);
                var dropOfftime = moment(endDate);
               var result= utilities.round((dropOfftime.diff(pickUptime, 'hours', true)), 2);
                if (result < 0)
                {
                    result = 0;
                }
                return result;
            };


            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    format = vm.dateTimeFormat;
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };

            vm.getTripStatus = function (status) {
                if (status == 1)
                    return app.localize("New");
                if (status == 2)
                    return app.localize("Dispatched");
                if (status == 3)
                    return app.localize("Started");
                if (status == 4)
                    return app.localize("Finished");
                if (status == 5)
                    return app.localize("Canceled");
                if (status == 6)
                    return app.localize("NoShow");
                return '';
            };

            vm.sumChargesTax = function () {
                if (vm.trip.tripCharges == null) return;
                vm.totalCharges = 0;
                vm.totalTax = 0;
                vm.totalWithTax = 0;
                vm.trip.tripCharges.forEach(function (value) {
                    if (value.charges > 0 || value.charges < 0)
                        vm.totalCharges = vm.totalCharges + parseFloat(value.charges);
                    if (value.tax > 0 || value.tax < 0) {
                        vm.totalTax += utilities.round(value.tax, 2);
                    }

                });

                vm.totalCharges = utilities.round(vm.totalCharges, 2);
                vm.totalTax = utilities.round(vm.totalTax, 2);
                vm.totalWithTax = utilities.round((vm.totalCharges + vm.totalTax) / 1, 2);

            };

            vm.init = function () {
                vm.loading = true;
                externalLimoTripPrintService.getTripForPrint({ id: tripId }).success(function (data) {

                    vm.trip = data;
                    vm.trn = vm.trip.location.taxId;
                    vm.trip.amountInWords = utilities.toWords((vm.trip.charges));
                    if (vm.trip.signature) {
                        vm.urlWithToken = vm.trip.signature.url;
                    }
                    vm.sumChargesTax();
                    if (appSession.tenant.tenancyName.toLowerCase() == 'sixtpakistan')
                    {
                        vm.limoFare = vm.trip.tripCharges.filter(e => e.chargesTypeId == 24)[0];
                        vm.limoFare.summedCharges = 0.0;
                        angular.forEach(vm.limoFare.calcDetail, function (item) {
                            vm.limoFare.summedCharges += item.charges;
                        });
                        if (vm.limoFare.summedCharges > 0) {
                            vm.trip.tripCharges = vm.trip.tripCharges.filter(e => e.chargesTypeId != 24);
                        };
                    }
                }).finally(function () {
                    vm.loading = false;

                });
            };

        }
    ]);
