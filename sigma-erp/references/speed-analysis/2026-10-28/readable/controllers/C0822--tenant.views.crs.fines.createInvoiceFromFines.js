// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:221940-222221
appModule.controller('tenant.views.crs.fines.createInvoiceFromFines', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.receiptSearch', 'abp.services.app.commonAgreement',
        'abp.services.app.billingMethod', 'abp.services.app.trafficFine', 'fine', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, receiptSearchService, commonAgreementService, billingMethodService, trafficFineService, fine, commonLookupService, utilities) {
            var vm = this;
            vm.isShowCustomerInMissingFines = abp.features.isEnabled('CRS.CustomFeatures.ShowCustomerInMissingFines');
            vm.saving = false;
            vm.isEditMod = false;
            vm.closedAgreements = false;
            vm.chargesType = "Fine Charges";
            vm.vehicleValue = null;
            vm.isMergedRentalInvoice = false;
            //vm.vehicles = [];
            vm.canChangeDate = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.CanChangeDate');
            vm.customers = [];
            vm.agreements = [];
            vm.billingMethods = [];
            vm.billingDetails = [];
            vm.amountMinValue = 100;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
          
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.isFineInvoiceForNrmEnabled = abp.features.isEnabled("CRS.CustomFeatures.FineInvoiceForNrm");
            if (vm.isPostTaxInclusive)
                vm.isTaxInclusive = false;

            // American Numbering System
            var th = ['', 'thousand', 'million', 'billion', 'trillion'];
            // uncomment this line for English Number System
            // var th = ['','thousand','million','milliard','billion'];
            var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']; var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']; var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
            function toWords(s) {
                s = s + '';
                s = s.replace(/[\, ]/g, ''); if (s != parseFloat(s)) return 'not a number'; var x = s.indexOf('.'); if (x == -1) x = s.length; if (x > 15) return 'too big'; var n = s.split(''); var str = ''; var sk = 0; for (var i = 0; i < x; i++) { if ((x - i) % 3 == 2) { if (n[i] == '1') { str += tn[Number(n[i + 1])] + ' '; i++; sk = 1; } else if (n[i] != 0) { str += tw[n[i] - 2] + ' '; sk = 1; } } else if (n[i] != 0) { str += dg[n[i]] + ' '; if ((x - i) % 3 == 0) str += 'hundred '; sk = 1; } if ((x - i) % 3 == 1) { if (sk) str += th[(x - i - 1) / 3] + ' '; sk = 0; } } if (x != s.length) { var y = s.length; str += 'point '; for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' '; }
                return str.replace(/\s+/g, ' ') + 'only';
            }

            vm.amountChanged = function () {
                if (vm.receipt.amount == 0 || angular.isUndefined(vm.receipt.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.receipt.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true")
                    vm.receipt.amountInWords = toWords(vm.receipt.amount);

                fine.amount = vm.receipt.amount;
            };

            vm.fineDetails = fine.fineNo + (fine.fineDescription ? ", " + fine.fineDescription : "");

            vm.save = function () {

                var dateReceipt = new Date(vm.receipt.date);
                dateReceipt.setHours(0);
                dateReceipt.setMinutes(0);
                dateReceipt.setSeconds(0);
                vm.receipt.date = dateReceipt;
                vm.receipt.amount = vm.invoiceAmount;
                vm.receipt.amountInWords = utilities.toWords(vm.invoiceAmount);
                vm.saving = true;

                trafficFineService.createInvoiceFromTrafficFine({
                    fineId: fine.id,
                    receiptEditDto: vm.receipt
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.agreementCategory = function (id) {
                if (id == 1)
                    return 'Rental';
                if (id == 2)
                    return 'Lease';
                else
                    return null;
            }
            vm.calculateTaxPerRow = function (row) {
                //if (vm.invoice == null)
                //    return 0;

                if (row == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                if (row.amount != null) {
                    if (vm.receipt.agreement && vm.receipt.agreement.taxPercent > 0) {
                        var tax = 0;
                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 

                            //equation solved from following formula... 
                            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                            var chargesWithoutTax = (row.amount * 100) / (100 + vm.receipt.agreement.taxPercent);
                            tax = utilities.round(row.amount - chargesWithoutTax, 2);
                        } else {
                            //prices are without tax. calculate tax and include in total
                            tax = utilities.round(row.amount * vm.receipt.agreement.taxPercent / 100, 2);
                            // vm.tripCharges[i].charges += utilities.round(tax,2);

                        }
                        row.tax = tax;
                        row.taxable = true;
                    }
                    else if (vm.receipt.movement && vm.agreementId == null && vm.taxPercent > 0) {
                        var tax = 0;
                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 

                            //equation solved from following formula... 
                            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                            var chargesWithoutTax = (row.amount * 100) / (100 + vm.taxPercent);
                            tax = utilities.round(row.amount - chargesWithoutTax, 2);
                        } else {
                            //prices are without tax. calculate tax and include in total
                            tax = utilities.round(row.amount * vm.taxPercent / 100, 2);
                            // vm.tripCharges[i].charges += utilities.round(tax,2);

                        }
                        row.tax = tax;
                        row.taxable = true;
                    }
                    else {
                        row.tax = 0;
                        //row.taxable = (row.chargesType.taxable || row.taxable);
                        row.taxable = false;
                    }
                }

                vm.sumAmountTax();

            };

            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;
                //vm.invoice.voucherLines.forEach(function (value) {
                if (vm.receipt.amount > 0 || vm.receipt.amount < 0)
                    totalAmount = totalAmount + parseFloat(vm.receipt.amount);
                if (vm.receipt.tax > 0 || vm.receipt.tax < 0) {
                    //value.taxable = true;
                    totalTax += utilities.round(vm.receipt.tax, 2);
                }
                if (vm.isFineInvoiceForNrmEnabled && vm.receipt.movement && vm.receipt.agreementId == null && vm.taxPercent > 0) {
                    //value.taxable = true;
                    if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 

                        var chargesWithoutTax = (vm.receipt.amount * 100) / (100 + vm.taxPercent);
                        totalTax = utilities.round(vm.receipt.amount - chargesWithoutTax, 2);
                    } else {
                        totalTax = utilities.round(vm.receipt.amount * vm.taxPercent / 100, 2);
                    }

                    vm.receipt.tax = vm.agreementId == null ? totalTax : 0;
                }
                //else
                //value.taxable = false;

                //});
                vm.invoiceTax = totalTax;
                vm.invoiceAmount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.invoiceAmount = utilities.round(vm.invoiceAmount, 2);
                if (vm.invoiceAmount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoiceAmountInWords = utilities.toWords(vm.invoiceAmount);
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                });
            }
            function init() {
                getBankAccounts();
                receiptSearchService.getReceiptForEdit({
                    id: null
                }).success(function (result) {
                    vm.receipt = result;
                    vm.receipt.date = moment().utc();
                    vm.receipt.notes = 'Fine No: ' + fine.fineNo;
                    vm.receipt.amount = fine.amount;
                    vm.receipt.tax = 0;
                    vm.receipt.agreement = fine.agreement;
                    vm.receipt.agreementId = fine.agreementId;
                    if (vm.receipt.agreementId == null && vm.isFineInvoiceForNrmEnabled) {
                        vm.receipt.movement = fine.movement;
                    }
                    if (vm.isShowCustomerInMissingFines) {
                        if (fine.contact) {
                            vm.receipt.contact = fine.contact;
                            vm.receipt.contactId = fine.contactId;
                        }
                        else {
                            if (fine.agreement)
                            {
                                vm.receipt.contact = fine.agreement.customer;
                                vm.receipt.contactId = fine.agreement.customerId;
                            }
                            
                            if (vm.isFineInvoiceForNrmEnabled && fine.agreementId == null)
                            {
                                vm.receipt.contact = fine.movement.contact;
                                vm.receipt.contactId = fine.movement.contactId;
                            }
                        }
                    }
                    else {
                        if (fine.agreement) {
                            vm.receipt.contact = fine.agreement.customer;
                            vm.receipt.contactId = fine.agreement.customerId;
                        }
                        if (vm.isFineInvoiceForNrmEnabled && fine.agreementId == null) {
                            vm.receipt.contact = fine.movement.contact;
                            vm.receipt.contactId = fine.movement.contactId;
                        }
                    }
                    if (vm.receipt.agreement) {
                        vm.receipt.agreement.taxPercent = vm.taxPercent;
                    }

                    vm.plateNo = fine.vehicle.plateNo;
                    vm.amountChanged();
                    vm.sumAmountTax();
                });
            }

            init();
            getBillingMethods();
        }
    ]);
