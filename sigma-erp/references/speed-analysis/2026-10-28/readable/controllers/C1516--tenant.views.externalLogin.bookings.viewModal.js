// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:413658-413774
appModule.controller('tenant.views.externalLogin.bookings.viewModal', [
        '$scope', '$uibModal', 'utilities', '$uibModalInstance', 'bookingId', 'abp.services.app.booking', 'abp.services.app.bookingSearch', 'tariffHelper', '$filter',
        function ($scope, $uibModal, utilities, $uibModalInstance, bookingId, bookingAppService, bookingSearchService, tariffHelper, $filter) {

            var vm = this;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.enableManualBookingNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualBookingNo"));
            vm.taxAccepted = false;
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.loading = false;
            vm.isTariffCardExplicitSelection = utilities.parseBoolean(abp.setting.get("App.General.TariffCardExplicitSelection"));
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            var isValid = true;
            var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];
            vm.rounding = function (value) {
                if (!value) return;
                return utilities.round(value, 2);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.disableRate = function (chargesRow) {
                if (chargesRow.tariff.length > 1) {
                    var foundLines = $filter('filter')(chargesRow.tariff, {
                        included: chargesRow.included,
                        rate: chargesRow.rate,
                        excessRate: chargesRow.excessRate,
                        limit: chargesRow.limit
                    }, true);
                    if (foundLines.length > 0) {
                        return foundLines[0].rate > 0;
                    }
                    else {
                        return false;
                    }
                }
                return chargesRow.tariff[0].rate > 0;
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.totalDaysAndTime = function () {
                var startDate = moment(vm.agreement.startDate, "DD/MM/YYYY hh:mm");
                var endDate = moment(vm.agreement.endDate, "DD/MM/YYYY hh:mm");

                if (startDate.isValid() && endDate.isValid()) {

                    var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                    vm.remainingHrs = utilities.round(duration.hours() + (duration.minutes() / 60), 2);
                }
                else {
                    var startDate = moment(vm.agreement.startDate);
                    var endDate = moment(vm.agreement.endDate);

                    if (startDate.isValid() && endDate.isValid()) {
                        vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                        var totalHrs = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'hours');
                        vm.remainingHrs = totalHrs - (vm.totalDays * 24);
                    }

                }
            };

            function init() {
                vm.loading = true;
                bookingSearchService.getBookingForView({
                    id: bookingId
                }).success(function (result) {
                    vm.agreement = result;
                    if (vm.agreement.vehicle)
                        vm.vehicleMakeAndModel = vm.agreement.vehicle.make + " " + vm.agreement.vehicle.model.name;
                    if (vm.agreement && vm.agreement.charges) {
                        var foundLines = $filter('filter')(vm.agreement.charges, {
                            chargesTypeId: 1
                        }, true);
                        if (foundLines.length == 1) {
                            if (foundLines[0].discountPercent > 0) {
                                foundLines[0].discountedRate = foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100));
                            }
                        }
                    }
                    //in edit mod load tariff for vehicle. which will be used if some parameter is changed like dates etc.
                    var groupId = vm.agreement.tariffGroup.id;
                    if (groupId == null) groupId = -1;

                    if (isTariffEnabled) {
                        //load tariff
                        tariffHelper.loadTariff(groupId, function () {
                            //don't apply
                        });
                    }
                    vm.totalDaysAndTime();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                }).finally(function () {
                    vm.loading = false;
                });


            }
            
            init();
        }
    ]);
