// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:253943-254047
appModule.controller('tenant.views.crs.limousine.trips.updateChargesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'options', 'abp.services.app.limoTrip','utilities',
    function ($scope, $uibModal, $uibModalInstance, options, tripService, utilities) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };
        //vm.sumCharges = function () {
        //    if (!vm.trip)
        //        return '';
        //    var totalCharges = 0.0;
        //    for (var i = 0; i < vm.trip.tripCharges.length; i++) {
        //        if (vm.trip.tripCharges[i].charges > 0) {
        //            totalCharges += parseFloat(vm.trip.tripCharges[i].charges);
        //        }
        //    }
        //    vm.trip.charges = totalCharges;
        //    return totalCharges;

        //};

        vm.sumCharges = function () {
            if (vm.trip == null) return { totalCharges: 0, totalTax: 0, totalWithTax: 0};
            
            var totalCharges = 0.0;
            var totalTax = 0.0;

            for (var i = 0; i < vm.trip.tripCharges.length; i++) {
                if (vm.trip.tripCharges[i].charges > 0) {
                    var tax = 0;
                    if (vm.trip.tripCharges[i].taxable && vm.trip.taxPercent > 0) {
                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                            //equation solved from following formula... 
                            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                            var chargesWithoutTax = (vm.trip.tripCharges[i].charges * 100) / (100 + vm.trip.taxPercent);
                            tax = utilities.round(vm.trip.tripCharges[i].charges - chargesWithoutTax, 2);
                            vm.trip.tripCharges[i].tax = tax;
                            totalTax += utilities.round(tax, 2);
                        } else {
                            tax = utilities.round(vm.trip.tripCharges[i].charges * vm.trip.taxPercent / 100, 2);
                            vm.trip.tripCharges[i].tax = tax;
                            totalTax += utilities.round(tax, 2);

                        }
                    }

                    totalCharges += parseFloat(vm.trip.tripCharges[i].charges);
                    //  totalCharges += parseFloat(totalTax);
                }
                else {
                    vm.trip.tripCharges[i].tax = 0;
                }
            }

            //vm.trip.charges = utilities.round(totalCharges, 2);
            vm.trip.charges = vm.isTaxInclusive ? utilities.round(totalCharges, 2) : (utilities.round(totalCharges, 2) + utilities.round(totalTax, 2)) / 1
            vm.trip.charges = utilities.round(vm.trip.charges, 2);
            vm.trip.tax = utilities.round(totalTax, 2);

            //return totalCharges;
            return { totalCharges: utilities.round(totalCharges, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(totalCharges, 2) + utilities.round(totalTax, 2)) / 1 };

        };
        vm.localize = function (input) {
            return app.localize(input);
        };

        function init() {
            vm.loading = true;
            tripService.getTripForEdit({ id: options.tripId }).success(function (data) {
                vm.trip = data;
            }).finally(function () {
                vm.loading = false;
            });

        }
        init();
        vm.save = function () {
            vm.saving = true;
            tripService.updateCharges({
                trip: vm.trip,
            }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        }
    }
    ]);
