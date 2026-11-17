// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:342675-342770
appModule.controller('tenant.views.crs.vouchers.invoices.changeChargesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.limoTrip', 'options', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, limoTripsService, options, utilities) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.limoFareReadOnly = false;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = options.taxPercent;
            vm.viewMode = options.viewMode;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            };

            vm.sumChargesTax = function () {
                if (vm.tripCharges == null) return;
                vm.totalCharges = 0;
                vm.totalTax = 0;
                vm.totalWithTax = 0;
                vm.tripCharges.forEach(function (value) {
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

            vm.calculateTaxPerRow = function (row) {

                if (vm.tripCharges == null) return;

                var totalCharges = 0.0;
                var totalTax = 0.0;
                if (row.charges > 0) {
                    var tax = 0;
                    if (row.taxable && vm.taxPercent > 0) {
                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                            //equation solved from following formula... 
                            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                            var chargesWithoutTax = (row.charges * 100) / (100 + vm.taxPercent);
                            tax = utilities.round(row.charges - chargesWithoutTax, 2);
                            row.tax = tax;
                        } else {

                            tax = utilities.round(row.charges * vm.taxPercent / 100, 2);
                            row.tax = tax;
                        }
                    }
                    else {
                        row.tax = 0;
                    }

                }
                else {
                    row.tax = 0;
                }
                vm.sumChargesTax();

            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.save = function () {
                vm.saving = true;
                $uibModalInstance.close();
                vm.saving = false;
            }

            function init() {
                vm.loading = true;
                vm.tripCharges = options.tripCharges;
                vm.sumChargesTax();
                vm.loading = false;
            }
            init();
        }
    ]);
