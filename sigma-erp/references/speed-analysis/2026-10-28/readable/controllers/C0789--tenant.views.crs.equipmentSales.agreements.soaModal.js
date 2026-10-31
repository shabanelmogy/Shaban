// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:207806-207935
appModule.controller('tenant.views.crs.equipmentSales.agreements.soaModal', ['$scope', '$timeout', '$filter', 'utilities', 'appSession', '$uibModal', 'utilities', 'abp.services.app.salesAgreement', 'abp.services.app.commonLookup', 'agreementId', '$uibModalInstance',
        function ($scope, $timeout, $filter, utilities, appSession, $uibModal, utilities, salesAgreementService, commonLookupService, agreementId, $uibModalInstance) {

            var vm = this;

            // === Basic info ===
            vm.loading = false;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.locationId = appSession.user.locationId;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.timeFormat = 'HH:mm';
            vm.showSignatureButton = true;
            vm.floor = Math.floor;
            vm.rounding = utilities.round;
            vm.roundingWithSeparator = function (value) {
                return utilities.round(value).toLocaleString();
            };

            vm.localize = function (input) {
                return input ? app.localize(input) : "";
            };
            vm.onImageError = function () { vm.imgError = true; };
            vm.getlocalDateTime = function (date, format) {
                if (!date) return "";
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(format);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getOtherChargesEMI = function () {
                if (!vm.agreement || !vm.agreement.charges) {
                    vm.agreement.otherChargesEMI = 0;
                    return 0;
                }

                var total = vm.agreement.charges
                    .filter(c =>
                        !c.applyOnClosing && c.chargesTypeId != 78 && c.chargesTypeId != 79 &&
                        c.isAddInEMI === true
                    )
                    .reduce((sum, c) => sum + (parseFloat(c.emi)+(c.emiTax) || 0), 0);

                vm.agreement.otherChargesEMI = vm.rounding(total);

                //vm.agreement.perInstallmentAmount =
                //    vm.rounding((vm.agreement.emiCore || 0) + vm.agreement.otherChargesEMI);

                return vm.agreement.otherChargesEMI;
            };

            // === Arabic translations for charges ===
            // === Fetch agreement data and map totals ===
            function init() {
                vm.loading = true;

                // If agreementId is 0, check $stateParams
                //if (agreementId === 0 && !isNaN($stateParams.query)) {
                //    agreementId = $stateParams.query;
                //    vm.agreementId = agreementId;
                //}

                salesAgreementService.getSalesAgreementForEdit({ id: agreementId })
                    .success(function (result) {

                        vm.agreement = result.agreement;
                        vm.advance = result.advance ? result.advance.amount || 0 : 0;
                        vm.deposit = result.deposit ? result.deposit.amount || 0 : 0;
                        vm.additionalCharges = result.additionalCharges || [];

                        // --- Vehicle info ---
                        if (vm.agreement.agreementVehicles) {
                            vm.agreement.agreementVehicles.forEach(function (v) {
                                v.modalAndMake = v.vehicle.model.name + " " + v.vehicle.model.make.name;
                                v.modelYear = v.vehicle.modelYear;
                                v.chassisNo = v.vehicle.chassisNo;
                            });
                        }

                        // --- Payment Installments ---
                        var installments = vm.agreement.agreementPaymentInstallments || [];

                        // Total Installments
                        vm.totalInstallments = installments.reduce(function (sum, inst) {
                            return sum + (inst.amount || 0);
                        }, 0);
                        //vm.totalInstallments += vm.agreement.chargesUpfront;



                        var firstInstallmentPaid = false;

                        if (vm.agreement.advance > 0 && installments.length > 0) {
                            var firstInstallment = installments[0];
                            firstInstallmentPaid = firstInstallment && firstInstallment.status === 1;
                        }

                        if (firstInstallmentPaid) {
                            vm.totalInstallments += (vm.agreement.chargesUpfront || 0);
                        }
                        // Total Paid
                        vm.totalPaid = installments.reduce(function (sum, inst) {
                            return sum + (inst.status === 1 ? (inst.amount || 0) : 0);
                        }, 0);
                        // Add upfront ONLY if first installment paid
                        if (firstInstallmentPaid) {
                            vm.totalPaid += (vm.agreement.chargesUpfront || 0);
                        }
                        vm.financeCharges = vm.getOtherChargesEMI();
                        // Remaining
                        vm.remaining = vm.totalInstallments - vm.totalPaid;

                        // Sales Price (total charges)
                        vm.salesPrice = vm.agreement.totalCharges || 0;

                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            init();

        }]);
