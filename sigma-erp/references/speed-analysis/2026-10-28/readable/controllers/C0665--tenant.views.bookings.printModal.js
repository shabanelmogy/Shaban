// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:173977-174104
appModule.controller('tenant.views.bookings.printModal', ['$scope', '$sce', 'appSession', '$stateParams', 'abp.services.app.bookingPrint',
        'utilities', '$filter',
        function ($scope, sce, appSession, $stateParams, bookingPrintService, utilities, $filter) {
            var vm = this;
            vm.loading = false;
            vm.localize = (key) => app.localize(key);
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.termsAndConditions = sce.trustAsHtml(app.localize('RentalTermsAndConditions'));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'logo.png';
            vm.fileHeader = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            var bookingId = 0;
            vm.nowDate = new Date();
            vm.netCharges = null;
            vm.taxRate = null;
            vm.expectedRentalPriceNet = null;
            vm.mileage = null;
            vm.excessDays = null;
            vm.mileageValue = null;
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.bookingId))
                    bookingId = $scope.$parent.vmMain.bookingId;
            }

            //if through url print
            if (bookingId == 0 && !isNaN($stateParams.query)) {
                bookingId = $stateParams.query;
            }

            vm.floor = function (value) {
                return Math.floor(value);
            };
            vm.onImageError = function () { vm.imgError = true; };

            vm.localize = function (input) {
                if (input == null)
                    return "";
                if (input == 'Mileage')
                    vm.mileage = 'Mileage';
                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);

            };
            vm.currencyFormat = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getlocalDate = function (date) {
                if (date == null)
                    return "";
                var format = vm.dateFormat;
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(format);
            };
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";
                var format = vm.dateTimeFormat;
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(format);
            };

            vm.daysDifference = function (startDate, endDate) {
                var a = moment(startDate);
                var b = moment(endDate);
                return b.diff(a, 'days') + 1;
            };

            vm.netCharges = function (units, singleAmount) {
                return units * singleAmount;
            };

            vm.taxRate = function (charges, tax) {
                return ((charges) / 100) * tax;
            };

            vm.totalAmount = function (charges, tax) {
                return (charges) + (((charges) / 100) * tax);
            };
            vm.isGreatOceanRoadRVHire = function () {
                //GreatOceanRoadRVHire
                if (appSession.tenant.tenancyName.toLowerCase() == 'greatoceanroadrvhire') {
                    return true;
                } else {
                    return false;
                }
            };
            vm.calculateDays = function (endDate, startDate) {
                var endDateForEndDate = moment(endDate);
                var startDateForEndDate = moment(startDate);
                return moment(endDateForEndDate.format("LLLL")).diff(moment(startDateForEndDate.format("LLLL")), 'days');
            }
            vm.calculateMileage = function (value) {
                vm.mileageValue = value;
            }
            vm.calculateExcessKm = function (value) {
                vm.excessDays = value;
            }
            vm.init = function (options) {
                vm.loading = true;
                bookingPrintService.getBookingForPrint({
                    id: bookingId
                }).success(function (result) {
                    vm.booking = result;
                    var rentalRow = $filter('filter')(vm.booking.charges, {
                        chargesTypeId: 1,

                    }, true)[0];
                    vm.rentalRow = rentalRow;
                    vm.rentalDiscountedRate = utilities.round(vm.rentalRow.rate - utilities.round((rentalRow.rate * rentalRow.discountPercent) / 100, 2), 2);
                    vm.rentalDiscountedTax = utilities.round(((vm.rentalDiscountedRate * vm.booking.taxPercent) / 100), 2);
                }).finally(function () {
                    vm.loading = false;
                });
            };

        }]);
