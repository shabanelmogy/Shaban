// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:129731-129916
appModule.controller('tenant.views.crs.accounting.openingBalances.importDepositOpeningBalanceModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'fileName', 'abp.services.app.commonLookup', '$filter', 'abp.services.app.openingBalance', 'abp.services.app.billingMethod', 'appSession',
        function ($scope, $uibModal, $uibModalInstance, fileName, commonLookupService, $filter, openingBalanceService, billingMethodService, appSession) {

            var vm = this;
            vm.saving = false;

            vm.cancel = function () {
                if (vm.importedOpeningBalances)
                    $uibModalInstance.close();
                else
                    $uibModalInstance.dismiss();
            };

            vm.searchRentalOrLeaseAgreement = function ($select, contactId) {

                if ($select.search == '') return;
                commonLookupService.searchRentalOrLeaseAgreement({ agreementNo: $select.search, contactId: contactId }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            };

            vm.searchContacts = function ($select, contactType) {
                if ($select.search == '') return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return commonLookupService.searchContact({ keyword: $select.search, contactType: contactType }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };
            // extended search using search customer popup
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MM-YYYY');
                }
                else {
                    return "";
                }
            };
            vm.getLocalCreditCardExpiry = function (date) {
                if (!date) return "";

                var parsed = moment.utc(date);

                if (!parsed.isValid()) return "";

                if (parsed.date() === parsed.daysInMonth()) {
                    parsed.add(1, 'day');
                }

                return parsed.format("MMMM YYYY"); // e.g., April 2027
            };

            vm.depositBillingMethods = [];
            const depositBillingMethodByTypeId = (voucherSubTypeId) => {
                if (!voucherSubTypeId)
                    abp.message.error('type id is required');
                else {
                    vm.depositBillingMethods.find(x => x.voucherSubTypeId == voucherSubTypeId)
                }
            };

            function getBillingMethodAndApplyInList(callback) {
                billingMethodService.getBillingMethods({ category: 1 }).success((data) => {
                    vm.depositBillingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));

                    vm.depositBillingMethods.forEach(function (value) {
                        value.voucherSubTypeId = 12;
                    });

                    vm.depositBillingMethods.push({
                        name: app.localize('PreAuthorizationDeposit'), voucherSubTypeId: 11
                    });
                    vm.depositBillingMethods.push({
                        name: app.localize('ChequeDeposit'), voucherSubTypeId: 13
                    });

                    callback && callback();
                });
            }

            function init() {
                vm.loading = true;

                getBillingMethodAndApplyInList(() => {
                    openingBalanceService.importFromExcelDepositBalance(fileName)
                        .success(function (result) {
                            debugger;

                            result.forEach(x => {
                                x.depositDateLocal = vm.getlocalDate(x.depositDate);
                                x.depositExpiryDateLocal = vm.getlocalDate(x.depositExpiryDate);
                                x.cardExpiryLocal = vm.getLocalCreditCardExpiry(x.cardExpiryDate);
                            });

                            vm.data = result;
                        })
                        .error(function (response) {
                            abp.message.error(response.error);
                        })
                        .finally(function () {
                            vm.importing = false;
                            vm.loading = false;
                        });
                });
            }

            var pageNo = 1;
            var pageSize = 10;

            vm.importedOpeningBalances = false;
            vm.totalOpeningBalance = 0;
            vm.duplicateOpeningBalance = 0;
            vm.errorOpeningBalance = 0;
            vm.totalGeneratedOpeningBalance = 0;

            init();

            vm.generateImportedOpeningBalances = function () {
                var balancesToImport = [];
                var startIndex = 1 + ((pageNo - 1) * pageSize);
                var endIndex = pageNo * pageSize;

                if (endIndex > vm.data.length) {
                    endIndex = vm.data.length;
                }

                var i = 1;
                for (i = startIndex; i <= endIndex; i++) {
                    balancesToImport.push(vm.data[i - 1]);
                }


                if (balancesToImport.length == 0) {
                    vm.saving = false;
                    vm.importedOpeningBalances = true;
                    return;
                }

                vm.saving = true;
                openingBalanceService.generateImportedDepositOpeningBalances(balancesToImport)
                    .success(function (data) {
                        vm.generatedOpeningBalance = data;
                        vm.totalOpeningBalance += data.length;
                        vm.errorOpeningBalance += (data.length - $filter('filter')(data, {
                            error: null
                        }, true).length);

                        vm.totalGeneratedOpeningBalance += ($filter('filter')(data, {
                            error: null,
                            notesDuplicate: null,
                        }, true).length);

                        //vm.duplicateOpeningBalance = vm.totalOpeningBalance - vm.errorOpeningBalance - vm.totalGeneratedOpeningBalance;
                        angular.forEach(vm.generatedOpeningBalance, function (generatedTrip) {

                            var foundLines = $filter('filter')(vm.data, {
                                serailNo: generatedTrip.srNo,
                            }, true);
                            if (foundLines.length) {
                                foundLines[0].error = generatedTrip.error;
                                foundLines[0].notesDuplicate = generatedTrip.notesDuplicate;
                                foundLines[0].isGenerated = generatedTrip.isGenerated;

                            }
                        });

                        pageNo += 1;

                        if (vm.generatedOpeningBalance.length > 0)
                            vm.generateImportedOpeningBalances();
                        else {
                            vm.saving = false;
                            vm.importedOpeningBalances = true;
                        }

                    }).error(function (response) {
                        abp.message.error(response.error);
                        vm.saving = false;

                    }).finally(function () {
                        //vm.saving = false;
                    });
            };
        }
    ]);
