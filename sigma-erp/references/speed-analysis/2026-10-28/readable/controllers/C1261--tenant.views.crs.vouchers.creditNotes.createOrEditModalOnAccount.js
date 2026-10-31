// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:330963-331875
appModule.controller('tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount', [
        '$scope', '$uibModal', '$uibModalInstance', 'creditNoteId', 'abp.services.app.directory', 'abp.services.app.creditNote', 'utilities', 'abp.services.app.allocation',
        'abp.services.app.commonLookup', 'abp.services.app.account', 'abp.services.app.vehicle', 'appSession', 'abp.services.app.costCenter', 'abp.services.app.job', "FileUploader", 'abp.services.app.agreement', 'abp.services.app.commonAgreement',
        function ($scope, $uibModal, $uibModalInstance, creditNoteId, directoryService, creditNoteService, utilities, allocationService,
            commonLookupService, accountService, vehicleService, appSession, costCenterService, jobAppService, fileUploader, agreementAppService, commonAgreementService) {

            var vm = this;
            vm.branchTaxPercentage = null;
            vm.loading = false;
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.CreditNotes");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.manualCreditNoteNo = utilities.parseBoolean(abp.setting.get("App.General.ManualCreditNoteNo"));
            vm.isShowAgreementInPayments = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAgreementInPayment"));
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.AllActionsOnOtherBranchCreditNotes');
            var employeeSelection = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EmployeeselectionisoptionalforControlAccounts"));
            vm.saveAndPrint = false;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.agreementNoInCreditNote = utilities.parseBoolean(abp.setting.get("App.General.AgreementNoInCreditAndDebitNote")); //CommentedByOmarKhan
            vm.taxAccepted = false;
            vm.isReasonEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Reason"));
            vm.isReasonNoteEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ReasonNote"));
            vm.vehicles = [];
            vm.selectme = "Select Vehicle";
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.costCenterGroup1Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup1Required"));
            vm.costCenterGroup2Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup2Required"));
            vm.assignVehicleBranchInVoucherLine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AssignVehicleBranchInVoucherLine"));
            vm.documents = [];
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForCreditNote");
            if (vm.isPostTaxInclusive)
                vm.isTaxInclusive = false;
            var module = null;
            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            if (abp.features.isEnabled("CRS.Transportation"))
                vm.modules.push({ name: 'Transportation', id: 4 });
            if (abp.features.isEnabled("CRS.Chauffeur"))
                vm.modules.push({ name: 'Chauffeur', id: 5 });
            if (abp.features.isEnabled("WORKSHOP"))
                vm.modules.push({ name: 'Workshop', id: 6 });
            if (abp.features.isEnabled("ERS"))
                vm.modules.push({ name: 'Equipment', id: 7 });
            if (abp.features.isEnabled("CRS.AccessoriesRental"))
                vm.modules.push({ name: 'Accessories Rental', id: 8 });
            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: 'Sales', id: 9 });
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            // ... Converting Amount To Amount In Words ... ///

            vm.searchAgreements = function ($select) {
                if ($select.search == "") { vm.agreements = null; return null; }
                agreementAppService.searchAgreementForVoucherLines({ agreementNo: $select.search, manualAgreementNo: $select.search }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            } //CommentedByOmarKhan

            vm.onAgreementSelection = function (line) {
                if (line) {
                    line.agreementId = line.agreement.id;
                    if (line.account) {
                        if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                            {
                                line.agreementId = line.agreement.id;
                                if (line.agreement.permanentVehicleId) {
                                    line.vehicleId = line.agreement.permanentVehicle.id;
                                    line.vehicle = line.agreement.permanentVehicle;
                                }
                                else {
                                    line.vehicleId = line.agreement.vehicle.id;
                                    line.vehicle = line.agreement.vehicle;
                                }
                            }
                        }
                    }
                }
            } //CommentedByOmarKhan
            vm.amountMinValue = 100;
            // American Numbering System
            var th = ['', 'thousand', 'million', 'billion', 'trillion'];
            // uncomment this line for English Number System
            // var th = ['','thousand','million','milliard','billion'];
            var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
            var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
            var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
            function billLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;

                return line;
            };
            function toWords(s) {
                s = s + '';
                s = s.replace(/[\, ]/g, '');
                if (s != parseFloat(s)) return 'not a number';
                var x = s.indexOf('.');
                if (x == -1) x = s.length;
                if (x > 15) return 'too big';
                var n = s.split('');
                var str = '';
                var sk = 0;
                for (var i = 0; i < x; i++) {
                    if ((x - i) % 3 == 2) {
                        if (n[i] == '1') {
                            str += tn[Number(n[i + 1])] + ' ';
                            i++;
                            sk = 1;
                        } else if (n[i] != 0) {
                            str += tw[n[i] - 2] + ' ';
                            sk = 1;
                        }
                    } else if (n[i] != 0) {
                        str += dg[n[i]] + ' ';
                        if ((x - i) % 3 == 0) str += 'hundred ';
                        sk = 1;
                    }
                    if ((x - i) % 3 == 1) {
                        if (sk) str += th[(x - i - 1) / 3] + ' ';
                        sk = 0;
                    }
                }
                if (x != s.length) {
                    var y = s.length;
                    str += 'point ';
                    for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
                }
                return str.replace(/\s+/g, ' ') + 'only';
            }
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
            vm.sumAmountAllocation = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNow > 0)
                        amount = amount + value.allocatedNow;
                });
                if (amount <= 0)
                    vm.creditNote.amountInWords = '';
                if (amount > 0)
                    vm.creditNote.amountInWords = toWords(amount);
                return amount;
            };
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.onCustomerSelect = function () {
                vm.creditNote.agreementId = null;
                vm.creditNote.agreement = null;
                vm.creditNote.contactId = vm.creditNote.contact.id;
                if (vm.isShowAgreementInPayments) {
                    getAgreements(vm.creditNote.contact.id);
                }

                if (vm.isMultiCurrencyEnabled) {
                    if (vm.creditNote.contact.currencyDto) {
                        vm.currencyCode = vm.creditNote.contact.currencyDto.code;
                        vm.creditNote.currencyId = vm.creditNote.contact.currencyDto.id;
                        vm.creditNote.currencyRate = vm.creditNote.contact.currencyDto.currencyToBaseRate;
                        currencyName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.name : null;
                        decimalName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.decimalName : null;
                        vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount, currencyName, decimalName);
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;
                    }
                }
                if (vm.creditNote.amount > 0) {
                    if (vm.creditNote.contact.currency) {
                        currencyName = vm.creditNote.contact.currency ? vm.creditNote.contact.currency.name : null;
                        decimalName = vm.creditNote.contact.currency ? vm.creditNote.contact.currency.decimalName : null;
                        vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount, currencyName, decimalName);

                    }
                }

                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode();
                    if (vm.creditNote.voucherLines)
                        vm.creditNote.voucherLines.forEach(row => {
                            vm.calculateTaxPerRow(row);
                        });
                }
                getAllocations();
            };




            vm.onCustomerSelectForAgreement = function (customer) {

                vm.creditNote.contactId = customer.id;

                getAgreements(customer.id);

                if (vm.isMultiCurrencyEnabled) {
                    if (vm.creditNote.contact.currencyDto) {
                        vm.currencyCode = vm.creditNote.contact.currencyDto.code;
                        vm.creditNote.currencyId = vm.creditNote.contact.currencyDto.id;
                        vm.creditNote.currencyRate = vm.creditNote.contact.currencyDto.currencyToBaseRate;
                        vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount, currencyName, decimalName);
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;
                        currencyName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.name : null;
                        decimalName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.decimalName : null;
                        vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount, currencyName, decimalName);

                    }
                }
            };



            function getAgreements(customerId) {
                var agreement = null;
                if (vm.isShowAgreementInPayments) {
                    vm.loading = true;
                    agreement = commonAgreementService.getAllAgreementsOnCustomer({ id: customerId })
                    agreement.success(function (data) {

                        vm.agreementsList = data.items;


                    }).finally(function () {
                        vm.loading = false;
                    });
                }

            };

            vm.onAgreementSelect = function ($select) {
                if ($select.selected != null) {
                    vm.creditNote.agreementId = $select.selected.id;
                    agreementId = vm.creditNote.agreementId;
                }
            };



            vm.moduleChanged = function () {
                if (vm.moduleWiseReceivables) {
                    module = vm.enabledModule || null;
                }
                getAllocations();
            };

            function getAllocations() {
                vm.saving = true;
                var voucherTypesFilter = [
                    1, // Invoice,
                    7 // opening Balance
                ]
                
                allocationService.getAllocationsForEdit({
                    contactId: vm.creditNote.contact.id,
                    voucherCategory: 2,
                    VoucherId: creditNoteId,
                    voucherTypesFilter: voucherTypesFilter,
                    module: module
                }).success(function (data) {
                    vm.allocationData = data;
                }).finally(function () {
                    vm.saving = false;
                });
            }
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
            vm.allocatedNowForOpeningBalance = function (allocation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/allocatedNowForOpeningBalanceModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        allocation: function () {
                            return allocation;
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                });
            };
            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                /// return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            function getVoucherReasons() {
                commonLookupService.getVoucherReasons().success(function (result) {
                    vm.voucherReasons = result.items;
                })
            };

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.jobs = null; return null; }
                jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };

            //vm.searchPrepaidExpense = function (voucherLine, accountId) {
            //    return creditNoteService.getexpenseaccounts({ id: accountId }).then(function (result) {
            //        voucherLine.showDate = result.data;
            //    });
            //};

            // Searching Contacts
            vm.searchContact = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };


            //vm.searchVehicles = function ($select) {
            //    if ($select.search == "") {
            //        vm.vehicles = null;
            //        return null;
            //    }
            //    return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
            //        vm.vehicles = response.data.items;
            //    });
            //};


            // Searching Vehicles
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
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
                        vm.creditNote.contact = result;
                        vm.onCustomerSelect(result)
                    }
                });
            };
            var saveAndPrint = function (id) {
                window.open('/Report#/tenant/printModalCreditNote/' + id);
            };


            // Searching Accounts
            vm.searchAccounts = function ($select) {
                if ($select.search == "") {
                    vm.accounts = null;
                    return null;
                }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true, accountCategory: vm.accountCategory }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };


            // Saving CreditNode
            vm.save = function () {
                //vm.saving = true;
                //var allocations = [];
                //vm.creditNote.amount = vm.sumAmountAllocation();
                //if (vm.locations.length == 1) vm.creditNote.locationId = vm.locations[0].id;
                //angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                //    allocations.push({
                //        id: allocation.allocationId,
                //        allocatedToVoucherLineId: allocation.voucherLineId,
                //        amount: allocation.allocatedNow,
                //        allocatedList: allocation.allocatedList ? allocation.allocatedList : null,
                //        allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                //        voucherType: allocation.voucherType,
                //        description: allocation.description
                //    });
                //});

                ////vm.payment.allocations = allocations;
                //var creditNoteAllocations = {
                //    allocations: allocations
                //}
                //vm.creditNote.creditNoteAllocations = creditNoteAllocations;
                //creditNoteService.createOrUpdateCreditNote({ creditNote: vm.creditNote }
                //).success(function (result) {
                //    abp.notify.info(app.localize('SavedSuccessfully'));
                //    vm.creditNote.id = result;
                //    if (vm.saveAndPrint)
                //        saveAndPrint(vm.creditNote.id);
                //    $uibModalInstance.close();
                //}).finally(function () {
                //    vm.saving = false;
                //});



                var voucherLines = [];
                vm.creditNote.contactId = vm.creditNote.contact.id;
                if (vm.locations.length == 1) vm.creditNote.locationId = vm.locations[0].id;

                vm.saving = true;
                vm.creditNote.voucherLines.forEach(function (value) {
                    if (!value.hidden) {

                        if (value.fromDate != null) value.fromDate = value.fromDate.startOf('day');
                        if (value.toDate != null) value.toDate = value.toDate.startOf('day');
                        voucherLines.push(value);
                    }
                });
                vm.creditNote.voucherLines = voucherLines;
                vm.creditNote.voucherSubTypeId = 23;

                if (vm.creditNote.contact)
                    vm.creditNote.contactId = vm.creditNote.contact.id;
                if (vm.creditNote.vehicle)
                    vm.creditNote.vehicleId = vm.creditNote.vehicle.id;


                angular.forEach(vm.creditNote.voucherLines, function (value, key) {
                    if (value.contact)
                        value.contactId = value.contact.id;
                    if (value.vehicle)
                        value.vehicleId = value.vehicle.id;
                    if (value.job)
                        value.jobId = value.job.id;


                });
                vm.creditNote.module = module;
                if (vm.assignVehicleBranchInVoucherLine) {
                    vm.creditNote.voucherLines.forEach(function (line) {
                        if (line.vehicle && !line.locationId) {
                            line.locationId = line.vehicle.locationId;
                        }
                    });

                }
                vm.creditNote.voucherDocuments = vm.documents;
                creditNoteService.createOrUpdateOnAccountCreditNote({ creditNote: vm.creditNote }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.creditNote.id = result;
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.creditNote.id);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
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
                if (vm.creditNote.contact.taxCodeId > 0) {
                    vm.creditNote.taxPercent = vm.creditNote.contact.isTaxExempted ? 0 : vm.creditNote.contact.taxCode.taxPercent;
                }
                else {
                    if (vm.branchTaxPercentage)
                        vm.creditNote.taxPercent = vm.creditNote.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                }

            }

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
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
                vm.creditNote.voucherLines = [];
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    creditNoteService.importFromExcel(fileName)
                        .success(function (result) {
                            vm.creditNote.voucherLines = result;

                            angular.forEach(vm.creditNote.voucherLines, function (value, key) {

                                if (value.fromDate && value.toDate)
                                    value.showDate = true;
                                if (vm.creditNote.fromDate === "0001-01-01T00:00:00")
                                    vm.creditNote.fromDate = null;
                                if (value.vehicleId !== null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId !== null && value.contactId > 0)
                                    value.contactShow = true;

                                vm.calculateTaxPerRow(value);
                            });

                            if (vm.creditNote.voucherLines.length == 0)
                                vm.addRow();

                            vm.sumAmountTax();

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



            //Add row
            vm.addRow = function () {

                vm.creditNote.voucherLines.push(billLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.creditNote.voucherLines.indexOf(obj);
                vm.creditNote.voucherLines.splice(index, 1);
                vm.sumAmountTax();
            };

            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;
                vm.creditNote.voucherLines.forEach(function (value) {
                    if (value.debit > 0) {
                        totalAmount = totalAmount + parseFloat(value.debit);
                    }
                    if (value.tax > 0) {
                        value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    else
                        value.taxable = false;
                    value.amount = value.debit + value.tax;
                });
                vm.creditNote.tax = totalTax;
                vm.creditNote.amount = !vm.isTaxInclusive ? (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1 : utilities.round(totalAmount, 2);
                vm.creditNote.amount = utilities.round(vm.creditNote.amount, 2);
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.creditNote.contact.currencyDto) {
                        currencyName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.name : null;
                        decimalName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.decimalName : null;
                        vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount, currencyName, decimalName);

                    }

                }

            };


            // On Change of Account
            vm.accountChanged = function (line) {

                line.contact = null;
                if ((line.account.accountCategory === 4 || line.account.accountCategory === 5) && vm.taxPercent > 0 && !vm.isTaxInclusive) {
                    line.showTax = true;

                    if (line.debit > 0)
                        line.showDebitField = true;
                    else if (line.credit > 0)
                        line.showCreditField = true;
                } else {
                    line.showTax = false;
                }

                if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                    line.vehicleShow = true;
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                    line.showVehicleMessage = "Please Select Vehicle";
                }

                if (line.account.contactGroup) {
                    line.vehicleShow = false;
                    line.contactShow = true;
                    line.vehicleId = null;
                    line.vehicle = null;
                    line.account.contactGroupId = null;
                    line.accountId = line.account.id;

                    if (!line.account.contactGroup.isDefault)
                        line.account.contactGroupId = line.account.contactGroup.id;
                    if (line.account.contactGroup.contactType === 1 && employeeSelection) {
                        line.showContactMessage = "Please Select Staff (Optional)";
                    }
                    if (line.account.contactGroup.contactType === 1 && !employeeSelection) {
                        line.showContactMessage = "Please Select Staff ";
                    }
                    if (line.account.contactGroup.contactType === 2) {
                        line.showContactMessage = "Please Select Customer";
                    }
                    if (line.account.contactGroup.contactType === 3) {
                        line.showContactMessage = "Please Select Supplier";
                    }
                } else {
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                }

                if (line.showDate == null) {
                    line.showDate = false;
                }

                line.taxCredit = 0;
                line.taxDebit = 0;

                //  vm.sumAmount();
                vm.sumAmountTax();
            };
            vm.calculateTaxPerRow = function (row) {

                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode();
                }
                if (vm.creditNote == null)
                    return 0;

                if (row == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                if (row.debit != null) {
                    if (vm.creditNote.taxPercent > 0) {
                        var tax = 0;
                        if (row.taxable || !row.taxable) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (row.debit * 100) / (100 + vm.creditNote.taxPercent);
                                tax = utilities.round(row.debit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.debit * vm.creditNote.taxPercent / 100, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            row.tax = tax;
                            row.taxable = true;
                        }
                        else {
                            row.tax = 0;
                            row.taxable = (row.taxable);
                        }

                    }
                    else {
                        row.tax = 0;
                        row.taxable = (row.taxable);
                    }
                }

                vm.sumAmountTax();
                //vm.sumAmount();
                row.amount = row.debit + row.tax;
            };

            vm.calculateDebitAndTax = (voucherLine) => {
                if (vm.creditNote.taxPercent > 0) {
                    voucherLine.debit = parseFloat(voucherLine.amount) * (100 / (100 + vm.creditNote.taxPercent));
                    voucherLine.tax = parseFloat(voucherLine.amount) - voucherLine.debit;
                }
                else {
                    voucherLine.debit = parseFloat(voucherLine.amount);
                    voucherLine.tax = 0;
                }

                vm.sumAmountTax();
            }

            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            };
            function init() {
                getLocations();
                getAllLocations();
                getCostCenters();
                getVoucherReasons();
                vm.branchTaxCode();
                vm.loading = true;
                creditNoteService.getCreditNoteForEdit({ id: creditNoteId }).success(
                    function (result) {
                        vm.creditNote = result;
                        vm.documents = vm.creditNote.voucherDocuments;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.creditNote.contact) {
                                if (vm.creditNote.contact.currency)
                                    vm.currencyCode = vm.creditNote.contact.currency.code;

                                else {
                                    vm.currencyCode = vm.defaultCurrencyCode;
                                }
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                            if (vm.creditNote.amount > 0) {
                                currencyName = vm.creditNote.contact.currency ? vm.creditNote.contact.currency.name : null;
                                decimalName = vm.creditNote.contact.currency ? vm.creditNote.contact.currency.decimalName : null;
                                vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount, currencyName, decimalName);
                            }
                        }

                        if (vm.creditNote.id > 0) {
                            vm.isEditedMode = true;
                            angular.forEach(vm.creditNote.voucherLines, function (value, key) {

                                if (value.fromDate != null && value.toDate != null)
                                    value.showDate = true;
                                if (value.vehicleId != null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId != null && value.contactId > 0) {
                                    value.contactShow = true;

                                }

                                if (!value.contactId)
                                    vm.accountChanged(value);
                                if (!value.hidden) {
                                    if (value.debit > 0)
                                        value.taxDebit = value.tax;
                                    if (value.credit > 0)
                                        value.taxCredit = value.tax;
                                }
                                //    vm.sumAmount();
                                vm.sumAmountTax();
                            });
                            getAllocations();

                            if (vm.isShowAgreementInPayments && vm.creditNote.agreement) {
                                vm.loading = true;
                                commonAgreementService.getAgreement({
                                    id: vm.creditNote.agreement.id,
                                    includeCustomer: true
                                }).success(function (data) {
                                    vm.creditNote.agreement = data;
                                    vm.creditNote.agreement.locationId = data.locationId;
                                    vm.creditNote.contact = data.customer;
                                    vm.creditNote.contact.currencyDto = data.customer.currency;
                                    vm.creditNote.agreementId = data.id;
                                    vm.creditNote.contactId = vm.creditNote.contact.id;
                                    vm.onCustomerSelectForAgreement(vm.creditNote.contact)
                                }).finally(function () {
                                    vm.loading = false;
                                })
                            }


                        }
                        if (vm.creditNote.id <= 0) {
                            vm.isEditedMode = false;
                            vm.creditNote.voucherNo = null;
                            vm.creditNote.locationId = appSession.user.locationId;
                            vm.creditNote.taxPercent = vm.taxPercent;
                        }
                        if (vm.creditNote.voucherLines.length == 0)
                            vm.addRow();
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            init();
        }
    ]);
