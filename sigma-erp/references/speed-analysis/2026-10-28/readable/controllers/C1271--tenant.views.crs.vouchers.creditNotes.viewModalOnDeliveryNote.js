// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:334272-334388
appModule.controller('tenant.views.crs.vouchers.creditNotes.viewModalOnDeliveryNote', [
        '$uibModalInstance', 'creditNoteId', 'abp.services.app.creditNote', 'utilities', 'abp.services.app.commonLookup',
        function ($uibModalInstance, creditNoteId, creditNoteService, utilities, commonLookupService) {

            var vm = this;
            vm.loading = false;
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.CreditNotes");
            vm.saveAndPrint = false;
            vm.taxAccepted = false;
            vm.vehicles = [];
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.selectme = "Select Vehicle";
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.documents = [];
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForCreditNote");
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            function getAllLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locationsAll = data.items;
                });
            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
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




            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            function init() {
                getLocations();
                getAllLocations();
                vm.loading = true;
                creditNoteService.getCreditNoteOnDeliveryForView({ id: creditNoteId }).success(
                    function (result) {
                        vm.creditNote = result;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.creditNote.currency) {
                                vm.currencyCode = vm.creditNote.currency.code;
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }

                            if (vm.creditNote.amount > 0) {
                                currencyName = vm.creditNote.currency ? vm.creditNote.currency.name : null;
                                decimalName = vm.creditNote.currency ? vm.creditNote.currency.decimalName : null;
                                vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount, currencyName, decimalName);
                            }
                        }
                        vm.documents = vm.creditNote.voucherDocuments;
                        vm.creditNote.amount = vm.rounding(vm.creditNote.amount);
                        vm.creditNote.tax = vm.rounding(vm.creditNote.tax);

                        if (vm.creditNote.voucherLines) {
                            vm.creditNote.voucherLines.filter(e => !e.hidden).forEach(voucherLine => {
                                voucherLine.amount = vm.rounding(voucherLine.amount);
                                voucherLine.tax = vm.rounding(voucherLine.tax);
                            });
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            init();
        }
    ]);
