// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:391971-392354
appModule.controller('tenant.views.crs.vouchers.receipts.noonPaymentsModal', [
        '$scope', '$uibModal', '$uibModalInstance', '$filter', 'abp.services.app.directory', 'abp.services.app.noonPayment', 'options', 'utilities', 'appSession',
        function ($scope, $uibModal, $uibModalInstance, $filter, directoryService,noonPaymentService, options, utilities, appSession) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.statuses = null;
           
            vm.dueToGenerateCount = 0;
           
            vm.isSeperateInvoicesForEachChargesTypeEnabled = abp.features.isEnabled("CRS.CustomFeatures.SeperateInvoicesForEachChargesType");
            
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isDailyEnabled = utilities.parseBoolean(abp.setting.get("App.General.DailyInvoiceForDailyAgreement"));
            vm.isWeeklyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyInvoiceForWeeklyAgreement"));
            vm.showPoInInvoiceEngine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowPONoInInvoicingEngine"));
            vm.generateDaliyInvoiceForAnyPeriod = false;
            vm.generatedCount = 0;
            vm.selectedInvoices = 0;
            var generatedInvoices = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            if (vm.generateDaliyInvoiceForAnyPeriod)
                vm.agreementType = 3;
            vm.branchWiseInvoicingEnabled = utilities.parseBoolean(abp.setting.get("App.General.BranchWiseInvoice"));

            vm.currentDate = moment().endOf('day');

            vm.agreementDashboardFilters = null;
            if (options.agreement) {
                vm.agreementDashboardFilters = options.agreement;
            }
            function getDateString(date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);

            }
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
           
            vm.invoiceTypes = [
                { id: 1, name: "Rental" },
                { id: 2, name: "Non-Rental" }
            ];
            var paymentBatchSize = 10;
            vm.agreementTypes = [];
            if (vm.isDailyEnabled)
                vm.agreementTypes.push({ type: "Daily", id: 1 });
            if (vm.isWeeklyEnabled)
                vm.agreementTypes.push({ type: "Weekly", id: 2 });
            vm.agreementTypes.push({ type: "Monthly", id: 3 });

            vm.permissions = {
                canBulkGenerateForAnyAsOfDate: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForAnyAsOfDate')            
            };
                       
            vm.getInvoiceTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 1) return app.localize("RentalInvoice");
                else if (voucherSubTypeId == 8) return app.localize("SalikInvoice");
                else if (voucherSubTypeId == 7) return app.localize("FineInvoice");
                else if (voucherSubTypeId == 2) return app.localize("LimousineInvoice");
                else if (voucherSubTypeId == 14) return app.localize("LeaseInvoice");
                else if (voucherSubTypeId == 16) return app.localize('TransportationInvoice');
                else if (voucherSubTypeId == 17) return app.localize("AssetSaleInvoice");
                else if (voucherSubTypeId == 9) return app.localize("MiscellaneousInvoice");
                else if (voucherSubTypeId == 74) return app.localize("RecoveryInvoice");
                else if (voucherSubTypeId == 75) return app.localize("ChaufferInvoice");
                else if (voucherSubTypeId == 24) return app.localize("AdditionalChargesInvoice");
                else if (voucherSubTypeId == 29) return app.localize("FuelInvoice");
                else if (voucherSubTypeId == 30) return app.localize("DamageInvoice");
                else if (voucherSubTypeId == 33) return app.localize("FleetAssignmentInvoice");
                else if (voucherSubTypeId == 34) return app.localize("ChauffeurInvoice");
                else if (voucherSubTypeId == 37) return app.localize("WorkshopInvoice");
                else if (voucherSubTypeId == 46) return app.localize("EquipmentInvoice");
                else if (voucherSubTypeId == 55) return app.localize("AccessoriesInvoice");
                else if (voucherSubTypeId == 57) return app.localize("ExcessChargesInvoice");
                else if (voucherSubTypeId == 60) return app.localize("ExcessKMsInvoice");
                else if (voucherSubTypeId == 63) return app.localize('DarbTollInvoice');
                else if (voucherSubTypeId == 65) return app.localize('AdvanceTaxInvoice');
                else if (voucherSubTypeId == 67) return app.localize('StockSaleInvoice');
                else if (voucherSubTypeId == 76) return app.localize('CDWInvoice');
                else if (voucherSubTypeId == 77) return app.localize('PAIInvoice');
                else if (voucherSubTypeId == 78) return app.localize('MileageInvoice');
                else if (voucherSubTypeId == 79) return app.localize('AdditionalDriverInvoice');
                else if (voucherSubTypeId == 80) return app.localize('BabySeatInvoice');
                else if (voucherSubTypeId == 81) return app.localize('DamageChargesInvoice');
                else if (voucherSubTypeId == 82) return app.localize('DeliveryChargesInvoice');
                else if (voucherSubTypeId == 83) return app.localize('CollectionChargesInvoice');
                else if (voucherSubTypeId == 84) return app.localize('PreTerminationPenaltyInvoice');
                else if (voucherSubTypeId == 85) return app.localize('ExcessInsuranceChargesInvoice');
                else if (voucherSubTypeId == 86) return app.localize('TyreInsuranceChargesInvoice');
                else if (voucherSubTypeId == 87) return app.localize('WindScreenInsuranceInvoice');
                else if (voucherSubTypeId == 88) return app.localize('RoadSideAssistanceInvoice');
                else if (voucherSubTypeId == 89) return app.localize('ExtraHoursChargesInvoice');
                else if (voucherSubTypeId == 90) return app.localize('WaitingChargesInvoice');
                else if (voucherSubTypeId == 91) return app.localize('Extra2Charges');
                else if (voucherSubTypeId == 92) return app.localize('Extra3Charges');
                else if (voucherSubTypeId == 93) return app.localize('Extra1Charges');
                else if (voucherSubTypeId == 94) return app.localize('Extra4Charges');
                else if (voucherSubTypeId == 95) return app.localize('ParkingInvoice');
                else if (voucherSubTypeId == 96) return app.localize('DriverChargesInvoice');
                else if (voucherSubTypeId == 97) return app.localize('OthersInvoice');
                else if (voucherSubTypeId == 98) return app.localize('SalesAgreementInvoice');
                else if (voucherSubTypeId == 104) return app.localize('SaleMiscInvoice');
                // else if (voucherSubTypeId == 47) return app.localize("EquipmentLeaseInvoice");
                else return "";
            };


            vm.checkSelectedInvoices = function () {

                vm.selectedInvoices = vm.data.filter(function (invoice) {
                    return invoice.generate && !invoice.paymentProcessed;
                }).length;
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
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 1, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.customer = customer;
                        vm.customerId = customer.id;
                    }
                });
            };
            vm.clearCustomer = function () {
                vm.customer = null;
                vm.customerId = null;
                vm.merge = false;
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
            vm.allBoxTicked = function () {
                if (vm.data == null) return;

                angular.forEach(vm.data, function (invoiceDue) {
                    if (invoiceDue.invoiceNo == null)
                        if (!invoiceDue.paymentProcessed) {
                            invoiceDue.generate = vm.all;
                        }                });
            };

            vm.getInvoicingRule = function (id) {
                if (id == 1)
                    return app.localize('DateToDate');
                else if (id == 2)
                    return app.localize('CalendarMonth');
                else if (id == 3)
                    return app.localize('ThirtyDays');
                else
                    return '';
            };

            vm.getInvoicingType = function (id) {
                if (id == 1)
                    return app.localize('Advance');
                else if (id == 2)
                    return app.localize('Post');
                else
                    return '';
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            }; 
            vm.getBufferAmountFromSetting = function () {
                noonPaymentService.getNoonPaymentBufferAmount()
                    .then(function (response) {

                        vm.bufferAmount = response.data;
                    });

            }; 
            vm.statuses = [
                { id: 1, name: app.localize("Open") },
                { id: 2, name: app.localize("Closed") }
            ];

            
            vm.searchUsers = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.users = response.data.items;
                });
            };

            vm.resendEmail = function (row) {

                vm.loading = true;

                noonPaymentService.processPayments({
                    invoices: [{
                        rowId: row.rowId,
                        voucherId: row.voucherId
                    }],
                    isResendEmail: true
                }).then(function (result) {

                    if (result.data && result.data.length) {

                        row.success = result.data[0].success;
                        row.error = result.data[0].error;
                        row.message = result.data[0].message;
                    }

                }).finally(function () {

                    vm.loading = false;
                });
            };

            vm.getInvoicesForPayment = function () {
                vm.loading = true;

                var input = {
                    agreementCategory: vm.agreementCategory,
                    agreementNo: vm.agreementNo,
                    customerId: vm.customer ? vm.customer.id : null,
                    agreementStatus: vm.filters.agreementStatus,
                    invoiceType: vm.filters.invoiceType
                };

                noonPaymentService.getInvoicesForPayment(input)
                    .then(function (result) {
                        vm.generatedCount = 0;
                        vm.selectedInvoices = 0;
                        vm.all = false;
                        vm.data = result.data;

                        angular.forEach(vm.data, function (invoice) {
                            invoice.error = null;
                            invoice.success = false;
                            invoice.message = null;
                            invoice.processing = false;
                            invoice.paymentProcessed = false;
                            invoice.disabled = false;
                        });

                        vm.invoiceCount = vm.data.length;
                        vm.paymentCount = 0;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };
            vm.processPayments = function () {
                var invoicesToPay = [];
                var i = 1;

                angular.forEach(vm.data, function (invoice) {

                    if (invoice.generate &&
                        !invoice.paymentProcessed &&
                        !invoice.processing &&
                        i <= paymentBatchSize) {

                        invoice.processing = true;

                        invoicesToPay.push({
                            rowId: invoice.rowId,
                            voucherId: invoice.voucherId
                        });

                        i++;
                    }
                });

                if (invoicesToPay.length == 0) {
                    vm.saving = false;
                    return;
                }
                var InvoiceList = invoicesToPay.map(function (x) {
                    return {
                        rowId: x.rowId,
                        voucherId: x.voucherId
                    };
                });
                vm.saving = true;

                noonPaymentService.processPayments({
                    Invoices: InvoiceList
                })
                    .then(function (result) {

                        var processed = result.data;

                        angular.forEach(processed, function (payment) {

                            var found = $filter('filter')(vm.data, {
                                rowId: payment.rowId
                            }, true);

                            if (found.length) {

                                found[0].processing = false;
                                found[0].error = payment.error;
                                found[0].success = payment.success;
                                found[0].message = payment.message;
                                found[0].isEmailFlow = payment.isEmailFlow;

                                if (payment.success) {
                                    found[0].generate = false;
                                    found[0].disabled = true;
                                    found[0].paymentProcessed = true;
                                    found[0].paymentLinkSent = true;
                                    vm.generatedCount++;
                                }
                            }
                        });

                        var remaining = vm.data.some(function (x) {
                            return x.generate &&
                                !x.processing &&
                                !x.paymentProcessed;
                        });

                        if (remaining) {
                            return;
                            vm.processPayments();

                        }
                        else
                        {
                            vm.selectedInvoices = 0
                            vm.saving = false;
                        }                        

                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            };

            function init() {
                    vm.filters = {
                        agreementStatus: 1,   // Open
                        invoiceType: 1        // Rental
                };

                vm.getBufferAmountFromSetting();
            //    vm.getInvoicesForPayment();              
            }
            init();

        }
    ]);
