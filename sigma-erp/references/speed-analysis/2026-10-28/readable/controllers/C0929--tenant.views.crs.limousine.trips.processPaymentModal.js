// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:253385-253629
appModule.controller('tenant.views.crs.limousine.trips.processPaymentModal', [
        '$scope', '$sce', 'appSession', '$uibModalInstance', 'options', 'abp.services.app.commonLookup', 'abp.services.app.limoTrip', 'abp.services.app.receiptSearch', 'abp.services.app.receipt', 'abp.services.app.directory', 'abp.services.app.person', 'abp.services.app.country', 'abp.services.app.statementOfAccounts',
        function ($scope, $sce, appSession, $uibModalInstance, options, commonLookupService, limoTripService, receiptSearchService, receiptService, directoryService, personService, countryService, statementOfAccountsService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.savedOnce = false;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                customerWebApp: abp.auth.hasPermission('Pages.Tenant.Limousine.CustomerWebApp')
                //canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                //viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ViewOtherBranchTrips'),
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            //function getLocations() {
            //    commonLookupService.getLocations({}).success(function (data) {
            //        vm.locations = data.items;
            //    });
            //};

            vm.payment = {
                prepaymentMethod: 1
            };

            vm.billingAddress = {
                firstName: null,
                lastName: null,
                address: null,
                city: null,
                countryName: null,
                countryCode: null,
                email: null,
            };

            vm.getCurrentBalance = function () {
                statementOfAccountsService.getCurrentBalanceByContactId({ id: options.contactId }).then(function (result) {
                    vm.payment.creditBalance = result.data;
                    if (vm.payment.creditBalance > 0) {
                        vm.payment.creditBalance = 0;
                    }
                    else {
                        vm.payment.creditBalance = (-1) * vm.payment.creditBalance;
                    }
                });
            }

            function getcontactinfo(contactId) {
                directoryService.getContactInfo(contactId).success(function (result) {
                    vm.contact = result;
                }).finally(function () {
                    vm.billingAddress.firstName = vm.contact.firstName;
                    vm.billingAddress.lastName = vm.contact.lastName;
                    vm.billingAddress.email = vm.contact.email;
                    vm.billingAddress.address = vm.contact.address.addressLine1;
                    vm.billingAddress.city = vm.contact.address.city;
                    vm.billingAddress.countryName = vm.contact.address.country;
                    vm.billingAddress.countryCode = vm.contact.address.code;
                    getcountrybyname(vm.billingAddress.countryName);
                });
            }

            function getcountrybyname(countryname) {
                countryService.searchCountries({ name: countryname }).then(function (result) {
                    vm.countrylist = result;
                    vm.country = null;
                    vm.country = vm.countrylist.data.items[0];
                });
            }

            vm.searchCountries = function (name) {

                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return countryService.searchCountries({ name: name }).then(function (response) {
                    vm.countries = response.data.items;
                });

            };

            vm.allTripsReportsChecked = function () {
                angular.forEach(vm.trips, function (value, key) {
                    if (vm.alltripsReports) {
                        if (value.charges == 0)
                            value.selected = false;
                        else
                            value.selected = true;
                    } else {
                        value.selected = false;
                    }
                });
                vm.tripsReportChecked();
            };

            vm.tripsReportChecked = function () {
                vm.selectedTripsCount = 0;
                vm.totalAmount = 0.0;
                vm.tripIds = [];
                angular.forEach(vm.trips, function (value, key) {
                    if (value.selected) {
                        vm.totalAmount += value.charges;
                        vm.selectedTripsCount++;
                        vm.tripIds.push(value.tripId);
                    }
                });

                vm.remainingBalance = vm.payment.creditBalance && vm.totalAmount? (vm.payment.creditBalance - vm.totalAmount): 0;
                vm.remainingBalance = vm.remainingBalance < 0 ? 0 : vm.remainingBalance;
            }
            vm.cancel = function () {
                //vm.savedOnce
                if (vm.savedOnce)
                    $uibModalInstance.close();
                else
                    $uibModalInstance.dismiss();

            };


            function updateContactInfo() {

                vm.contact.firstName = vm.billingAddress.firstName;
                vm.contact.lastName = vm.billingAddress.lastName;
                vm.contact.email = vm.billingAddress.email;
                vm.contact.address.addressLine1 = vm.billingAddress.address;
                vm.contact.address.city = vm.billingAddress.city;
                vm.contact.address.country = vm.country.name;
                directoryService.updateContactInfo(vm.contact).success(function (result) {
                });

            }

            vm.processPaymentAndCreateReceipt = function () {
                updateContactInfo();
                vm.billingAddress.countryName = vm.country.name;
                vm.billingAddress.countryCode = vm.country.code;
                if (vm.receipt.locationId == null || vm.receipt.locationId == 0) {
                    if (appSession.user.locationId != null)
                        vm.receipt.locationId = appSession.user.locationId;
                    else if (vm.locations.length > 0)
                        vm.receipt.locationId = vm.locations[0].id;
                }
                // vm.receipt.contactId = options.contactId;
                //vm.receipt.creditcard = vm.creditcard;
                if (vm.permissions.customerWebApp) {
                    vm.saving = true;
                    receiptService.processPaymentAndCreateReceipt({
                        receipt: vm.receipt,
                        TripIds: vm.tripIds,
                        creditcard: vm.creditcard,
                        billingAddress: vm.billingAddress
                    }).success(function (result) {
                        abp.notify.success(app.localize('ReceiptCreatedandPaymentReceived'));
                        vm.cancel();
                        vm.receiptid = result;
                    }).finally(function () {
                        vm.loading = false;
                        vm.saving = false;
                    });
                }
            }

            vm.proceedPayment = function () {
                if (vm.permissions.customerWebApp) {
                    vm.saving = true;
                    vm.payment.TripIds = vm.tripIds;
                    vm.payment.customerId = options.contactId;
                    vm.payment.amount = vm.totalAmount;
                    receiptService.createLimoCCReceipt(vm.payment).success(function (result) {
                        abp.notify.success(app.localize('ReceiptCreatedandPaymentReceived'));
                        vm.cancel();
                        vm.receiptid = result;
                    }).finally(function () {
                        vm.loading = false;
                        vm.saving = false;
                        vm.savedOnce = true;
                    });
                }
            }
            vm.paymentUrl = '';
            vm.submitBillingDetail = function () {
                vm.saving = true;
                updateContactInfo();
                vm.billingAddress.countryName = vm.country.name;
                vm.billingAddress.countryCode = vm.country.code;
                vm.billingAddress.totalAmount = vm.totalAmount;
                if (vm.permissions.customerWebApp) {
                    vm.saving = true;
                    receiptService.getPaymentUrl({
                        billingAddress: vm.billingAddress
                    }).success(function (result) {
                        vm.paymentUrl = $sce.trustAsResourceUrl(result);
                    }).finally(function () {
                        vm.loading = false;
                        vm.saving = false;
                    });
                }
            }

            vm.proceedPaymentThroughCreditBalance = function () {
                vm.saving = true;
                vm.payment.TripIds = vm.tripIds;
                vm.payment.customerId = options.contactId;
                vm.payment.amount = vm.totalAmount;
                receiptService.proceedPaymentThroughCreditBalance(vm.payment).success(function (result) {
                    abp.notify.success(app.localize('Payment Received and Invoice Created'));
                    vm.cancel();
                }).finally(function () {
                    vm.loading = false;
                    vm.saving = false;
                });
            }

            function init() {
                vm.loading = true;

                if (options.contactId && vm.permissions.customerWebApp) {
                    limoTripService.getTripsForPaymentProcessing({
                        id: options.contactId
                    }).success(function (result) {
                        vm.trips = result;
                    }).finally(function () {
                        vm.alltripsReports = false;
                        vm.tripsReportChecked();
                        vm.loading = false;
                    });
                }
                

                getcontactinfo({ id: options.contactId });
            }

            init();
            vm.getCurrentBalance();
        }
    ]);
