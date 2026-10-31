// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:359739-360092
appModule.controller('tenant.views.crs.vouchers.invoices.posInvoicecreateOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'invoiceId', 'abp.services.app.agreement',
        'abp.services.app.directory', 'abp.services.app.invoice', 'abp.services.app.commonLookup',
        'abp.services.app.vehicle', 'utilities', 'abp.services.app.chargesSetting', '$filter',
        'abp.services.app.limoTrip', 'appSession', 'abp.services.app.posInvoice', 'abp.services.app.product',
        'abp.services.app.tariffCard', 'abp.services.app.unitOfMeasure', 'abp.services.app.staff',
        function ($scope, $uibModal, $uibModalInstance, invoiceId, agreementService, directoryService,
            invoiceService, commonLookupService, vehicleService, utilities, chargesSettingService,
            $filter, limoTripService, appSession, posInvoiceService, productService, tariffCardService,
            unitOfMeasureService, staffService) {

            var vm = this;
            vm.loading = false;
            vm.chargesTypes = [];
            var productPrices = [];
            var isValid = true;
            vm.closedAgreements = false;
            vm.isEditMode = false;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualInvoiceNo = utilities.parseBoolean(abp.setting.get("App.General.ManualInvoiceNo"));
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.isMergedRentalInvoice = false;
            //vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'limo'; 
            vm.taxAccepted = false;
            vm.saveAndPrint = false;
            vm.invoice = {
                voucherLines: []
            };
            vm.invoice.amount = 0;

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };          

            function invoiceLineObject() {
                var line = new Object();
                line.productId = null;
                line.quantity = 1;
                line.unitPrice = null;
                line.unitOfMeasureId = null;
                line.contactId = null;
                line.isDefault = false;
                line.rateCardId = 9;
                line.productPrices = angular.copy(productPrices);
                return line;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            //Add row
            vm.addRow = function () {
                var li = invoiceLineObject();
                vm.invoice.voucherLines.push(li);
            };
          
            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = 'YYYY-MM-DD HH:mm';

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };
            

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.invoice.voucherLines.indexOf(obj);
                if (vm.invoice.voucherLines.length > 1) {
                    vm.invoice.voucherLines.splice(index, 1);
                    vm.getTotal(vm.invoice);
                }
                //vm.sumAmount();
            };
           
            //Remove Limo Row
            
            vm.sumAmount = function () {
                if (vm.invoice === null)
                    return 0;

                if (vm.invoice.voucherLines === null)
                    return 0;

                var sum = 0;
                for (var i = 0; i < vm.invoice.voucherLines.length; i++) {
                    if (vm.invoice.voucherLines[i].credit !== null) {
                        sum = sum + parseFloat(vm.invoice.voucherLines[i].credit);
                        //console.log(sum);
                    }

                }
            };
            vm.onCustomerSelect = function () {
                vm.invoice.agreement = null;
                vm.invoice.agreementId = null;
                if (vm.isEditMode && vm.invoiceTaxPercent > 0) {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.invoiceTaxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                }
                else {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.taxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                }
                vm.sumAmount();
                vm.agreements = null;
                //if (vm.enabledModule == 1 || vm.enabledModule == 2)
                //    getAgreements(vm.invoice.contactId);
            };

            
            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.clearCustomer = function () {
                vm.order.customer = null;
                vm.order.customerId = null;
                vm.order.contactId = null;
            };
            //POS
            vm.getProducts = function (callback) {
                vm.loading = true;
                productService.getProducts().success(function (data) {
                    vm.productListServerSide = data.items;
                }).finally(function () {
                    if (!(callback === null || !angular.isFunction(callback)))
                        callback();
                    else
                        vm.loading = false;
                });

            };

            vm.getProductPrices = function (callback) {
                vm.loading = true;
                productService.getProductPrices().success(function (data) {
                    vm.productPriceServerSide = data.items;
                }).finally(function () {
                    if (!(callback === null || !angular.isFunction(callback)))
                        callback();
                    else
                        vm.loading = false;
                });
            };

            //product Search
            vm.searchProducts = function ($select) {
                if ($select.search) {
                    var productsList = vm.productListServerSide.filter(e => e.name.toLowerCase().includes($select.search.toLowerCase()));
                    vm.products = productsList.slice(0, 5);
                }
            };
            vm.productSelected = function (row) {
                if (!(row.product === null || row.product === undefined)) {
                    row.productId = row.product.id;
                    row.unitOfMeasureIdItems = row.product.productUnitOfMeasures;
                    angular.forEach(row.unitOfMeasureIdItems, function (value) {
                        value.unitOfMeasure.title = value.unitOfMeasure.name + " (" + value.unitOfMeasure.nameLang + ")";
                        
                        if (row.unitOfMeasureId !== null) {
                            if (value.unitOfMeasure.id === row.unitOfMeasureId) {
                                row.unitOfMeasure = value;
                                vm.unitOfMeasureChange(row);
                            }
                        }
                        else if (value.isDefault) {
                                row.unitOfMeasure = value;
                                vm.unitOfMeasureChange(row);
                            }
                        
                    });
                }
            };
            
            unitOfMeasureIdItems = function () {
                unitOfMeasureService.getUnitOfMeasures().success(function (result) {
                    vm.unitOfMeasureIdItems = result.items;
                    angular.forEach(vm.unitOfMeasureIdItems, function (value) {
                        value.title = value.name + " (" + value.nameLang + ")";
                    });
                });

            };

            vm.unitOfMeasureChange = function (row) {
                
                debugger;
                if (row.unitOfMeasure === null || row.unitOfMeasure === undefined) {
                    
                    angular.forEach(row.unitOfMeasureIdItems, function (value) {
                        value.unitOfMeasure.title = value.unitOfMeasure.name + " (" + value.unitOfMeasure.nameLang + ")";
                        if (value.isDefault) {
                            row.unitOfMeasure = value;
                            //vm.unitOfMeasureChange(row);
                        }
                    });
                }
                else {
                    //row.productId = row.product.id;
                   // row.unitOfMeasureId = row.unitOfMeasure.id;
                    row.unitOfMeasureId = row.unitOfMeasure.unitOfMeasure.id;
                    var productprice = vm.productPriceServerSide.filter(e => e.rateCardId === row.rateCardId
                        && e.unitOfMeasureId === (row.unitOfMeasure.unitOfMeasureId)
                        && row.product.id === e.productId);
                    row.unitPrice = productprice[0].price;
                }
                row.credit = row.unitPrice * row.quantity;

            };
            vm.changeratecardsRow = function (row) {
                if (row.unitOfMeasure === null || row.unitOfMeasure === undefined) return;

                var productprice = vm.productPriceServerSide.filter(
                    e => e.rateCardId === row.rateCardId
                        && e.unitOfMeasureId === row.unitOfMeasure.unitOfMeasureId
                        && row.product.id === e.productId);

                row.unitPrice = productprice[0].price;
                row.credit = row.unitPrice * row.quantity;
            };

            vm.defaultRatecardsItemSelected = function (callback) {
                tariffCardService.getTariffCards().success(function (result) {
                    vm.ratecardsItems = result.items;
                    vm.rateCardId = vm.ratecardsItems[0].id;

                    if (!(callback === null || !angular.isFunction(callback)))
                        callback();
                });
            };
            vm.getTotal = function () {
                vm.invoice.amount = 0;
                angular.forEach(vm.invoice.voucherLines, function (value) {
                    vm.invoice.amount += value.unitPrice * value.quantity;
                    //console.log(vm.invoice.amount);
                });
            };
            vm.formatNumber = function (netAmount) {
                if (netAmount === null) return null;
                return netAmount.toLocaleString('en');
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            
            // extended search using search customer popup
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
                }).result.then(function (result) {
                    if (result != null) {
                        vm.invoice.contact = result;
                        vm.invoice.contactId = vm.invoice.contact.id;
                        vm.onCustomerSelect();
                    }
                });
            };
            // Saving Invoice
            var saveAndPrint = function (invoiceId) {
                window.open('/Report#/tenant/printModalInvoice/' + invoiceId);
            };

            // Saving Invoice
            vm.save = function () {

                isValid = true;
                var date = new Date(vm.invoice.date);
                var fromDate = new Date(vm.invoice.fromDate);
                var toDate = new Date(vm.invoice.toDate);

                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                //date.setMilliseconds(0);

                fromDate.setHours(0);
                fromDate.setMinutes(0);
                fromDate.setSeconds(0);
                //fromDate.setMilliseconds(0);

                toDate.setHours(23);
                toDate.setMinutes(59);
                toDate.setSeconds(59);
                //toDate.setMilliseconds(999);

                vm.invoice.fromDate = fromDate;
                vm.invoice.toDate = toDate;
                vm.invoice.date = date;

                vm.saving = true;
                debugger
                posInvoiceService.createOrUpdatePosInvoice({ posInvoice: vm.invoice } 
                ).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    posInvoice = result;
                    console.log(posInvoice);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                    });
            };


            function init() {
                vm.loading = true;
                //unitOfMeasureIdItems();
                //getProductPrices();
                vm.defaultRatecardsItemSelected(
                    function () {
                        vm.getProducts(
                            function () {
                                vm.getProductPrices(
                                    function () {
                                        posInvoiceService.getPosInvoiceForEdit({ id: invoiceId }).success(
                                            function (result) {
                                                
                                                // calculate amount ( quantity * unit of measyre)

                                                vm.invoice = result;
                                                vm.loading = false;
                                                console.log(vm.invoice);
                                            });
                                    }
                                );
                            }
                        );
                    });

            }

            init();
        }
    ]);
