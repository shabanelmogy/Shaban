// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:356244-357271
appModule.controller('tenant.views.crs.vouchers.invoices.generateStockSaleInvoice', [
        '$uibModal', '$uibModalInstance', 'FileUploader', 'invoiceId', 'abp.services.app.account', 'abp.services.app.commonAgreement', 'abp.services.app.directory', 'abp.services.app.invoice', 'abp.services.app.commonLookup', 'abp.services.app.vehicle', 'utilities', 'abp.services.app.chargesSetting', '$filter',
        'abp.services.app.limoTrip', 'appSession', '$rootScope', 'abp.services.app.item', 'abp.services.app.costCenter',
        function ($uibModal, $uibModalInstance, fileUploader, invoiceId, accountService, commonAgreementService, directoryService, invoiceService, commonLookupService, vehicleService, utilities, chargesSettingService, $filter, limoTripService, appSession, $rootScope, itemAppService, costCenterService) {

            var vm = this;
            vm.branchTaxPercentage = null;
            vm.loading = false;
            vm.chargesTypes = [];
            vm.documents = [];
            var isValid = true;
            vm.closedAgreements = false;
            vm.isEditMode = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.rentalDivisonDefalutSetting = parseFloat(abp.setting.get("App.Speed.Common.CostCenterGroup2ForEquipmentRentalModule"));
            vm.manualInvoiceNo = utilities.parseBoolean(abp.setting.get("App.General.ManualInvoiceNo"));
            vm.isInvoiceTnCNotesEnabled = utilities.parseBoolean(abp.setting.get("App.General.InvoiceTermsAndConditionsNotes"));
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForInvoices");
            vm.isInvoiceDateAsGenerationDateForAllInvoices = utilities.parseBoolean(abp.setting.get("App.General.InvoiceDateAsGenerationDateForAllInvoices"));

            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isEquipmentRentalEnabled = abp.features.isEnabled("ERS");

            vm.selectChargesTypeInMiscInvoice = utilities.parseBoolean(abp.setting.get("App.Speed.Common.SelectChargesTypeInMiscInvoice"));

            vm.isMergedRentalInvoice = false;
            vm.filters = {};
            function returnItemObject() {
                var line = new Object();
                line.productId = null;
                line.quantity = null;
                line.debit = null;
                line.credit = null;
                line.price = null;
                line.totalAmount = null;

                return line;
            }
            vm.jobSelected = function () {

                // pass vm.itemReturn.jobDetailIdquantity           
                jobAppService.getItemReturnRows({ id: vm.itemReturn.jobDetailId }).then(function (result) {

                    if (result.data && result.data.length > 0) {
                        vm.itemReturn.voucherLines = result.data;
                        if (!vm.items)
                            vm.items = [];
                        vm.itemReturn.voucherLines.forEach(line => {
                            vm.items.push(line.product);
                            vm.productSelected(line);
                        });
                    }

                });
            };
            //vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'limo'; 
            // new inclusive branch test
            vm.taxAccepted = false;
            vm.saveAndPrint = false;
            vm.invoice = {
                voucherLines: []
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.oneTimeCheckBoxChanged1 = function () {
                if (!vm.oneTime) {
                    vm.invoice.customField2 = null;
                    vm.invoice.customField3 = null;
                    vm.invoice.fromDate = moment();
                    vm.invoice.toDate = moment();
                }
                else {
                    vm.invoice.fromDate = null;
                    vm.invoice.toDate = null;
                    vm.invoice.customField3 = moment();
                }
            };

            vm.chargesTypeVoucherLine = function (item) {
                if (vm.invoice.voucherLines.length > 1) {
                    if (item.refNo == vm.invoice.voucherLines[0].refNo)
                        return true;
                }
                return false;
            };

            vm.productSelected = function (line, voucherLine) {

                voucherLine.price = line.product.price;
                voucherLine.valueField1 = line.product.cost;
                voucherLine.unitOfMeasureId = line.product.unitOfMeasureId;

            }

            vm.getColspan = function () {
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: vm.invoice.voucherLines[0].refNo
                }, true).length + 2;
                return foundLines;
            };
            vm.chargesTypeVoucherLineRepeat = function (value) {
                if (vm.invoice.voucherLines.length > 1 && value.chargesTypeId == 24) {


                    return true;
                };
                return false;
            };
            vm.sumPerTrip = function (refNo) {
                var sum = 0.0;
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo
                }, true);
                foundLines.forEach(function (value) {
                    //+parseFloat(value.tax)
                    sum = sum + (parseFloat(value.credit));
                });
                return utilities.round(sum, 2);
            };

            vm.sumTaxPerTrip = function (refNo) {
                var tax = 0.0;
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo
                }, true);
                foundLines.forEach(function (value) {
                    //+parseFloat(value.tax)
                    tax = tax + (parseFloat(value.tax));
                });
                return utilities.round(tax, 2);
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            vm.branchTaxCode = function () {
                var userLocationId = appSession.user.locationId;
                if (userLocationId) {
                    commonLookupService.getLocationById({ id: userLocationId })
                        .success(function (data) {
                            var userLocation = data;
                            if (userLocation.taxCode) {
                                vm.branchTaxPercentage = userLocation.taxCode.taxPercent;
                            }
                        })
                }
            }
            vm.setTaxPercentOnTaxCode = function () {

                if (vm.invoice.contact.taxCodeId > 0 ) {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.invoice.contact.taxCode.taxPercent;
                }
                else {
                    if (vm.branchTaxPercentage)
                        vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                }
            }

            vm.editTripChargesModal = function (refNo) {

                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo
                }, true);

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/changeChargesModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.changeChargesModal as vm',
                    backdrop: 'static',
                    size: 'md',

                    resolve: {
                        options: function () {
                            return {
                                tripCharges: foundLines,
                                taxPercent: vm.invoice.taxPercent
                            };
                        }
                    }
                }).result.then(function (result) {
                    vm.sumAmountTax();
                });
                return utilities.round(tax, 2);

            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.uploadDocumentsModal as vm',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (result) {
                    if (!vm.documents) {
                        vm.documents = [];
                    }
                    vm.documents.push(result);
                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };


            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.searchRentalOrLeaseAgreement = function ($select, contactId) {
                if ($select.search == '') return;
                commonLookupService.searchRentalOrLeaseAgreement({ agreementNo: $select.search, contactId: contactId, agreementCategory: vm.enabledModule === 5 ? 4 : vm.enabledModule }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            };
            vm.modules = [];

            if (abp.features.isEnabled("WORKSHOP"))
                vm.modules.push({ name: 'Workshop', id: 6 });


            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;
            vm.moduleChanged = function () {
                getChargesTypes();
                vm.invoice.voucherLines = [];
                vm.invoice.amount = 0;
                vm.invoice.tax = 0;
                vm.invoice.amountInWords = null;

            };
            var moduleFilter = {
                module: 0 //all enabled modules
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.agreementChanged = function () {
                //agreementCategory: 1 = Rental, 2 = Lease
                //module: 1 = Rental, 2 = Lease, 3 = Limousing, 4 = Transportation
                moduleFilter.module = vm.invoice.agreement.agreementCategory;
                //alert(vm.invoice.agreement.agreementCategory);
                //vm.enabledModule = vm.invoice.agreement.agreementType == 'Daily' || vm.debitNote.agreement.agreementType == 'Weekly' || vm.debitNote.agreement.agreementType == 'Monthly' ? 1 : 2;
                if (vm.invoice.agreement.agreementCategory == 1) {
                    vm.enabledModule = 1;
                }
                else if (vm.invoice.agreement.agreementCategory == 2) {
                    vm.enabledModule = 2;
                }
                else if (vm.invoice.agreement.agreementCategory == 4) {
                    vm.enabledModule = 5;
                }
                getChargesTypes();
            };


            function invoiceLineObject() {
                var line = new Object();
                line.chargesTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.price = null;
                line.taxable = false;
                line.module = vm.enabledModule;
                return line;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.amountMinValue = 100;

            vm.sumAmount = function () {
                if (vm.invoice == null)
                    return 0;
             

                if (vm.invoice.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.invoice.voucherLines.length; i++) {
                    if (vm.invoice.voucherLines[i].credit != null && vm.invoice.voucherLines[i].module == vm.enabledModule) {
                        sum = sum + parseFloat(vm.invoice.voucherLines[i].credit);

                        if (vm.invoice.taxPercent > 0) {
                            var tax = 0;
                            if (vm.invoice.voucherLines[i].chargesType.taxable || vm.invoice.voucherLines[i].taxable) {
                                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                    var chargesWithoutTax = (vm.invoice.voucherLines[i].credit * 100) / (100 + vm.invoice.taxPercent);
                                    tax = utilities.round(vm.invoice.voucherLines[i].credit - chargesWithoutTax, 2);
                                    totalTax += utilities.round(tax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(vm.invoice.voucherLines[i].credit * vm.invoice.taxPercent / 100, 2);
                                    totalTax += utilities.round(tax, 2);
                                    // vm.tripCharges[i].charges += utilities.round(tax,2);

                                }
                                vm.invoice.voucherLines[i].tax = tax;
                                vm.invoice.voucherLines[i].taxable = true;
                            }
                            else {
                                vm.invoice.voucherLines[i].tax = 0;
                                vm.invoice.voucherLines[i].taxable = (vm.invoice.voucherLines[i].chargesType.taxable || vm.invoice.voucherLines[i].taxable);
                            }

                        }
                        else {
                            vm.invoice.voucherLines[i].tax = 0;
                            vm.invoice.voucherLines[i].taxable = (vm.invoice.voucherLines[i].chargesType.taxable || vm.invoice.voucherLines[i].taxable);
                        }
                    }

                }

                vm.invoice.amountInWords = '';

                vm.invoice.tax = totalTax;
                vm.invoice.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1
                vm.invoice.amount = utilities.round(vm.invoice.amount, 2);
                if (vm.invoice.amount > 0) {
                    var currencyName = null;
                    var decimalName = null;
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.invoice.contact) {
                            currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                            decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                        }
                    }
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.totalAmount = function (line) {
                if (vm.invoice == null)
                    return 0;

                if (line.price != null && line.quantity != null)
                    line.credit = line.price * line.quantity;
                vm.calculateTaxPerRow(line);
            }

            vm.calculateTaxPerRow = function (row) {
                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode();
                }

                if (vm.invoice == null)
                    return 0;

                if (row == null)
                    return 0;

                if (row.credit)
                    row.credit = vm.rounding(row.credit);


                if (row.credit != null && row.module == vm.enabledModule) {
                    if (vm.invoice.taxPercent > 0) {
                        var tax = 0;

                        if (vm.isTaxInclusive) {
                            var chargesWithoutTax = (row.credit * 100) / (100 + vm.invoice.taxPercent);
                            tax = utilities.round(row.credit - chargesWithoutTax, 2);
                        } else {
                            tax = utilities.round(row.credit * vm.invoice.taxPercent / 100, 2);
                        }
                        row.tax = tax;
                        row.taxable = true;

                    }
                    else {
                        row.tax = 0;
                        row.taxable = false;
                    }
                }


                vm.sumAmountTax();

            };

            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;
                vm.invoice.voucherLines.forEach(function (value) {
                    if (value.tax)
                        value.tax = vm.rounding(value.tax);

                    if (value.credit > 0 || value.credit < 0)
                        totalAmount = totalAmount + parseFloat(value.credit);
                    if (value.tax > 0 || value.tax < 0) {
                        //value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    //else
                    //value.taxable = false;

                });
                vm.invoice.tax = totalTax;
                vm.invoice.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.invoice.amount = utilities.round(vm.invoice.amount, 2);
                if (vm.invoice.amount > 0) {
                    var currencyName = null;
                    var decimalName = null;
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.invoice.contact) {
                            currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                            decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                        }
                    }
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);
                }
                return utilities.round(tax, 2);
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.invoice.taxPercent = vm.taxPercent;
                else
                    vm.invoice.taxPercent = 0;
            };

            //Add row
            vm.addRow = function (line) {
                if (line == undefined)
                    line = invoiceLineObject();

                if (vm.newRowAgreement) {
                    line.agreement = vm.newRowAgreement;
                    line.agreementId = vm.newRowAgreement.id;
                }

                vm.invoice.voucherLines.push(line);
            };


            // Adding Row Limo
            vm.addRowlimo = function (refNo) {

                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo,
                }, true);
                var srNo = Math.max.apply(Math, foundLines.map(function (line) { return line.srNo; }))
                //function invoiceLineObject() {
                //    var line = new Object();
                //    line.chargesTypeId = null;
                //    line.description = '';
                //    line.debit = null;
                //    line.credit = null;
                //    line.taxable = false;

                //    return line;
                //}
                vm.invoice.voucherLines.push(
                    {
                        chargesTypeId: null,
                        description: '',
                        debit: null,
                        credit: null,
                        refNo: refNo,
                        srNo: srNo + 1
                    });

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
            vm.addLimoRow = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/searchTripModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.searchTripModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        contactId: function () {
                            return vm.invoice.contactId;
                        },

                    }
                }).result.then(function (result) {
                    if (result != null) {
                        var serialNo = vm.invoice.voucherLines[vm.invoice.voucherLines.length - 1].srNo;
                        result.tripCharges.forEach(function (value) {
                            vm.invoice.voucherLines.push(
                                {
                                    module: vm.enabledModule,
                                    chargesTypeId: value.chargesTypeId,
                                    chargesType: value.chargesType,
                                    taxable: value.taxable,
                                    tax: value.tax,
                                    description: value.chargesTypeId == 24 ? 'Trip No: ' + result.tripNo + ', Date: ' + vm.getlocalDateTime(result.pickupDateTime) : '',
                                    tripDescription: value.chargesTypeId == 24 ? result.notes : '',
                                    debit: 0,
                                    credit: value.charges,
                                    refNo: result.tripNo,
                                    srNo: ++serialNo,
                                    vehicle: result.vehicle,
                                    vehicleId: result.vehicleId,

                                });
                        });
                        vm.sumAmount();
                    }
                });
            };



            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.invoice.voucherLines.indexOf(obj);
                vm.invoice.voucherLines.splice(index, 1);
                //vm.sumAmount();
                vm.sumAmountTax();

            };

            //Remove Limo Row
            vm.removeLimoRow = function (obj) {

                //var index = vm.invoice.voucherLines.indexOf(obj);
                //vm.invoice.voucherLines.splice(index, 1);
                //vm.sumAmount();
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: obj.refNo,
                }, true);

                foundLines.forEach(function (value) {
                    var index = vm.invoice.voucherLines.indexOf(value);
                    vm.invoice.voucherLines.splice(index, 1);
                });

                vm.sumAmountTax();
            };


            vm.onCustomerSelect = function () {
                vm.invoice.agreement = null;
                vm.invoice.agreementId = null;
                if (vm.isEditMode && vm.invoiceTaxPercent > 0) {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.invoiceTaxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.invoice.contact.isTaxExempted) {
                        vm.setTaxPercentOnTaxCode();
                        if (vm.invoice.voucherLines)
                            vm.invoice.voucherLines.forEach(row => {
                                vm.calculateTaxPerRow(row);
                            });
                    }
                    
                }
                else {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.taxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.invoice.contact.isTaxExempted) {
                        vm.setTaxPercentOnTaxCode();
                        if (vm.invoice.voucherLines)
                            vm.invoice.voucherLines.forEach(row => {
                                vm.calculateTaxPerRow(row);
                            });
                    }
                  
                }
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.invoice.contact.currencyDto) {
                        vm.currencyCode = vm.invoice.contact.currencyDto.code;
                        vm.invoice.currencyId = vm.invoice.contact.currencyDto.id;
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;

                    }
                }
                vm.sumAmount();
                vm.agreements = null;
                //if (vm.enabledModule == 1 || vm.enabledModule == 2)
                //    getAgreements(vm.invoice.contactId);
            };

            vm.onClosedAgreementChange = function () {
                getAgreements(vm.invoice.contactId);
            };
            //validate date 
            function validate() {
                errorMessage = '';
                errorMessage = 'Invoice Can Not Be Genrated Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }
                if (vm.invoice.toDate != null) {
                    if (moment(vm.invoice.fromDate) > moment(vm.invoice.toDate)) {
                        isValid = false;
                        errorMessage = errorMessage + '\n To Date can not  less than from Date ';
                    }
                }

            }
            function getAgreements(customerId) {


                vm.loading = true;
                var agreement = null;
                vm.invoice.agreement = null;
                vm.invoice.agreementId = null;
                if (vm.closedAgreements == false) {
                    agreement = commonAgreementService.getOpenAgreementsOnCustomer({ id: customerId });
                }
                else {
                    agreement = commonAgreementService.getClosedAgreementsOnCustomer({ id: customerId });
                }
                agreement.success(function (data) {
                    if (data) {
                        vm.agreements = data.items;
                        if (vm.agreements.length == 0) {
                            vm.invoice.agreement = vm.agreements[0];
                        }
                    } else { vm.agreements = null; }

                }).finally(function () {
                    vm.loading = false;
                });
            };
            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchItems = function ($select) {
                if ($select.search == "") { vm.items = null; return null; }
                return itemAppService.searchItems({ name: $select.search }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            // Searching Accounts
            vm.searchAccounts = function ($select) {

                if ($select.search == "") { vm.accounts = null; return null; }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };
            // misc uploader
            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                vm.invoice.voucherLines = [];
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    invoiceService.importFromExcel(fileName)
                        .success(function (result) {
                            vm.invoice.voucherLines = result;
                            vm.invoice.voucherLines.forEach(e => e.module = vm.enabledModule);
                            angular.forEach(vm.invoice.voucherLines, function (value, key) {

                                if (value.fromDate && value.toDate)
                                    value.showDate = true;
                                if (vm.invoice.fromDate === "0001-01-01T00:00:00")
                                    vm.invoice.fromDate = null;
                                if (value.vehicleId !== null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId !== null && value.contactId > 0)
                                    value.contactShow = true;

                                vm.calculateTaxPerRow(value);
                            });

                            if (vm.invoice.voucherLines.length == 0)
                                vm.addRow();

                            vm.sumAmountTax();
                            vm.sumAmount();

                        })
                        .finally(function () { vm.loading = false; });
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
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
            var saveAndPrint = function (id, headerCheck) {
                //  var parent = $scope.$parent.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return {
                                id: id,
                                printHeader: headerCheck
                            };
                        },
                        previewVoucher: null,
                        exportWord: false,
                        exportPrintToWord: false,
                        isArabic: function () {
                            return false; // or true, or logic to detect locale
                        }
                    }
                });
            };

            // Saving Invoice
            vm.save = function () {

                var aaa = 99;

                if (!vm.isEditMode) {
                    var date = new Date(vm.invoice.date);
                    var fromDate = vm.invoice.fromDate ? new Date(vm.invoice.fromDate) : null;
                    var toDate = vm.invoice.toDate ? new Date(vm.invoice.toDate) : null;

                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    //date.setMilliseconds(0);

                    if (fromDate) {
                        fromDate.setHours(0);
                        fromDate.setMinutes(0);
                        fromDate.setSeconds(0);
                        //fromDate.setMilliseconds(0);

                    }
                    if (toDate) {
                        toDate.setHours(23);
                        toDate.setMinutes(59);
                        toDate.setSeconds(59);
                        //toDate.setMilliseconds(999);
                    }

                    vm.invoice.fromDate = fromDate;
                    vm.invoice.toDate = toDate;
                    vm.invoice.date = date;
                }


                vm.invoice.voucherSubTypeId = 67


                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    module: vm.enabledModule,
                }, true);

                vm.invoice.voucherLines = foundLines;
                vm.saving = true;
                validate();
                if (isValid) {
                    //vm.invoice.module = vm.enabledModule;
                    vm.invoice.voucherDocuments = vm.documents;
                    invoiceService.createOrUpdateStockSaleInvoice({ invoice: vm.invoice, module: vm.enabledModule, costCenter2Id: vm.costCenter2Id }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.invoice.id = result;
                        if (vm.saveAndPrint) {
                            var printHeaderCheck = $rootScope.headerPrintCheck;
                            saveAndPrint(vm.invoice.id, printHeaderCheck);
                        }
                        //printHeaderCheck passed from index.js 
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }


            };

            function getChargesTypes() {
                vm.loading = true;
                chargesSettingService.getConfiguredChargesTypes({ module: vm.enabledModule }).success(function (data) {
                    vm.chargesTypes = data.items;
                    angular.forEach(vm.chargesTypes, function (row) {
                        row.name = app.localize(row.name);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getTrips(invoiceId) {
                vm.loading = true;
                limoTripService.getInvoiceTrips({
                    id: invoiceId,
                }).success(function (result) {
                    vm.trips = result.items;
                    vm.invoice.voucherLines.forEach(function (value) {
                        if (value.chargesTypeId == 24) {
                            var refNoInt = parseInt(value.refNo);
                            var foundLines = $filter('filter')(vm.trips, {
                                tripNo: refNoInt,
                            }, true);
                            if (foundLines.length == 1) {
                                value.tripDescription = foundLines[0].notes;
                            }
                        }
                    });
                    vm.invoice.customField2 = vm.trips[0].customField2;
                    vm.invoice.customField3 = vm.trips[0].customField3;
                    //if (vm.trips) {
                    //    var refNoInt = parseInt(value.refNo);
                    //    var foundLines = $filter('filter')(vm.trips, {
                    //        tripNo: refNoInt,
                    //    }, true);
                    //    if (foundLines.length == 1) {
                    //        value.description = foundLines[0].notes;
                    //    }
                    //}
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }

            function init() {
                vm.loading = true;
                vm.branchTaxCode();
                invoiceService.getInvoiceForEdit({ id: invoiceId }).success(
                    function (result) {
                        vm.invoice = result;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.invoice.contact) {
                                if (vm.invoice.contact.currencyDto)
                                    vm.currencyCode = vm.invoice.contact.currencyDto.code;
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                        }
                        vm.documents = vm.invoice.voucherDocuments;
                        vm.loading = false;
                        getLocations();
                        if (vm.isCostCenterEnabled)
                            getCostCenters();
                        if (invoiceId > 0) {

                            vm.isEditMode = true;
                            if (vm.isEquipmentRentalEnabled) {
                                if (!(vm.invoice.fromDate && vm.invoice.toDate))
                                    vm.oneTime = true;
                            }
                            var costCenterInVoucherLines = vm.invoice.voucherLines.find(e => e.costCenter2Id != null);
                            if (costCenterInVoucherLines)
                                vm.costCenter2Id = costCenterInVoucherLines.costCenter2Id;
                            vm.isMergedRentalInvoice = vm.invoice.voucherSubTypeId == 1 && !vm.invoice.agreementId;
                            vm.isMergedTollInvoice = vm.invoice.voucherSubTypeId == 8 && !vm.invoice.agreementId;
                            vm.canAddRowMerge = vm.isMergedRentalInvoice && Array.from(new Set(vm.invoice.voucherLines.filter(e => e.agreementId != null).map(row => row.agreementId))).length == 1;
                            vm.newRowAgreement = vm.canAddRowMerge ? vm.invoice.voucherLines.filter(row => row.agreementId != null)[0].agreement : null;
                            vm.invoiceTaxPercent = vm.invoice.taxPercent;
                            vm.enabledModule = vm.invoice.voucherLines[0].module;
                            if (vm.invoice.voucherSubTypeId == 1) //rental invoice
                                moduleFilter.module = 1;
                            else if (vm.invoice.voucherSubTypeId == 14) //Lease invoice
                                moduleFilter.module = 2;
                            else if (vm.invoice.voucherSubTypeId == 2) //limo invoice
                                moduleFilter.module = 3;
                            else if (vm.invoice.voucherSubTypeId == 16) //transportation
                                moduleFilter.module = 4;
                            else
                                moduleFilter.module = 0;
                            if (vm.invoice.voucherSubTypeId == 2)
                                getTrips(invoiceId)
                            getChargesTypes();
                            angular.forEach(vm.invoice.voucherLines, function (value) {
                                if (value.chargesTypeId)
                                    value.chargesType.name = app.localize(value.chargesType.name);
                            });
                        } else {
                            vm.isEditMode = false;
                            moduleFilter.module = 0;
                            vm.invoice.taxPercent = vm.taxPercent;
                            vm.invoice.voucherSubTypeId = 9;
                            if (vm.rentalDivisonDefalutSetting > 0)
                                vm.costCenter2Id = vm.rentalDivisonDefalutSetting;
                            else
                                vm.costCenter2Id = null;
                            vm.invoice.locationId = appSession.user.locationId; //by default assign user branch. later rules are implemented on server side

                            getChargesTypes();
                        }

                        if (!vm.isEditMode && vm.invoice.contactId)
                            getAgreements(vm.invoice.contactId);

                        //if (vm.invoice.voucherNo <= 0)
                        //    vm.invoice.voucherNo = null;



                        if (vm.invoice.voucherLines.length == 0)
                            vm.addRow();
                    });
            }

            init();
        }
    ]);
