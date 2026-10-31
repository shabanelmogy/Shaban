// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:378320-379021
appModule.controller('tenant.views.crs.vouchers.provisions.createOrEditModal', ['$uibModal', 'provisionId',
        '$uibModalInstance', 'abp.services.app.provision', 'utilities', 'abp.services.app.account', 'abp.services.app.commonLookup', 'abp.services.app.vehicle',
        'abp.services.app.directory', 'appSession', '$filter', 'abp.services.app.item', 'abp.services.app.job', 'abp.services.app.jV',
        'abp.services.app.costCenter', 
        function ($uibModal, provisionId, $uibModalInstance, provisionService, utilities, accountService, commonLookupService, vehicleService, directoryService,
            appSession, $filter, itemAppService, jobAppService, JVService, costCenterService) {
            var vm = this;
            vm.showTax = false;
            vm.provision = [];
            vm.vehicles = [];
            vm.items = [];
            vm.suppliers = [];
            vm.provisioningMethods = [];
            vm.locations = [];
            vm.expenseTypes = [];
            vm.selectme = "Select Vehicle";
            vm.saveAndPrint = false;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs');
            vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            var isBillEnabled = abp.features.isEnabled("CRS.Vouchers.Bills");
            var isJvEnabled = abp.features.isEnabled("CRS.Vouchers.JVs");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            //vm.isCostCenterRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCostCenterForBillRequired"));
            //new settings
            vm.costCenterGroup1Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup1Required"));
            vm.costCenterGroup2Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup2Required"));

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.showDebitField = true;
            var employeeSelection = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EmployeeselectionisoptionalforControlAccounts"));
            vm.showCreditField = true;
            vm.description = '';


            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            function JVLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;

                line.fromDate = null;
                line.toDate = null;

                return line;
            }
            function billLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;

                //line.item = {};
                //line.itemQuantity = 0;
                line.amount = 0;
                line.tax = 0;

                return line;
            }
            vm.voucherSubTypes = [
                isBillEnabled ? { id: 51, name: app.localize("Bill") } : null,
                isJvEnabled ? { id: 50, name: app.localize("JV") } : null
            ];

            // Searching Accounts
            vm.searchAccounts = function ($select) {

                if ($select.search == "") { vm.accounts = null; return null; }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            // Searching Contacts
            vm.searchContact = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            function getCostCenters() {
                costCenterService.searchCostCenters({ includeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group == 1);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }

            // On Change of Account in JV lines
            vm.accountChangedJV = function (line) {

                line.contact = null;
                if ((line.account.accountCategory === 4 || line.account.accountCategory === 5 || line.showDate) && vm.taxPercent > 0 && !vm.isTaxInclusive) {
                    line.showTax = true;

                    if (line.debit > 0)
                        line.showDebitField = true;
                    else if (line.credit > 0)
                        line.showCreditField = true;
                } else {
                    line.showTax = false;
                }

                if (line.itemShow) {
                    line.vehicleShow = false;
                    line.contactShow = false;
                    line.accountId = line.account.id;
                    line.showItemMessage = "Please Select Item";
                } else {
                    if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                        line.vehicleShow = true;
                        line.contactShow = false;
                        line.itemShow = false;
                        line.product = null;
                        line.productId = null;
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
                        line.itemShow = false;
                        line.product = null;
                        line.productId = null;
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
                        // line.vehicleShow = false;
                        line.contactShow = false;
                        // line.vehicleId = null;
                        // line.vehicle = null;
                        line.contactId = null;
                        line.contact = null;
                        line.accountId = line.account.id;
                    }
                }

                if (line.showDate == null) {
                    line.showDate = false;
                }

                line.taxCredit = 0;
                line.taxDebit = 0;

                vm.sumAmount();
            };

            // On The Change Of Account in Bill lines

            vm.accountChangedBill = function (line) {
                line.contact = null;
                if (line.account.accountCategory == 4 || line.account.accountCategory == 5) {
                    line.vehicleShow = true;
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                    line.showVehicleMessage = "Please Select Vehicle";
                }
                else if (line.account.contactGroup != null) {
                    line.vehicleShow = false;
                    line.contactShow = true;
                    line.vehicleId = null,
                        line.vehicle = null;
                    line.account.contactGroupId = null;
                    line.accountId = line.account.id;
                    if (!line.account.contactGroup.isDefault)
                        line.account.contactGroupId = line.account.contactGroup.id;
                    if (line.account.contactGroup.contactType == 1) {
                        line.showContactMessage = "Please Select Staff";
                    }
                    if (line.account.contactGroup.contactType == 2) {
                        line.showContactMessage = "Please Select Customer";
                    }
                    if (line.account.contactGroup.contactType == 3) {
                        line.showContactMessage = "Please Select Supplier";
                    }

                }
                else {
                    line.vehicleShow = false;
                    line.contactShow = false;
                    line.vehicleId = null,
                        line.vehicle = null;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                }


                if (line.contactShow == null) {
                    line.contactShow = false;
                }
                if (line.vehicleShow == null) {
                    line.vehicleShow = false;
                }
                if (line.showDate == null) {
                    line.showDate = false;
                }
                if (line.contactShow == false && line.vehicleShow == false && line.showDate == false) {
                    vm.IsEnableOPtionalLookUp = true;
                }
            };

            vm.searchPrepaidExpense = function (voucherLine, accountId) {
                return JVService.getexpenseaccounts({ id: accountId }).then(function (result) {
                    voucherLine.showDate = result.data;
                });
            };

            vm.isStockAccount = function (voucherLine, accountId) {
                if (vm.isStockFeatureEnabled) {
                    provisionService.isStockAccount({ id: accountId }).then(function (result) {
                        voucherLine.itemShow = result.data;
                        if (vm.provision.provisionVoucher.voucherSubTypeId == 50)
                            vm.accountChangedJV(voucherLine);
                        else if (vm.provision.provisionVoucher.voucherSubTypeId == 51)
                            vm.accountChangedBill(voucherLine);
                    });
                }
            };

            vm.productSelected = function (line) {
                line.productId = line.product.id;
                line.unitOfMeasureId = line.product.unitOfMeasureId;
            };

            // Searching Vehicles
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchItems = function ($select) {
                if ($select.search == "") { vm.items = null; return null; }
                return itemAppService.searchItems({ name: $select.search }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.jobs = null; return null; }
                jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };


            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers

                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            // extended search using search contact popup
            vm.searchSupplierPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.bill.contact = supplier;
                    }
                });
            };

            // ... Converting Amount To Amount In Words ... ///

            vm.amountMinValue = 100;
            // American Numbering System
            var th = ['', 'thousand', 'million', 'billion', 'trillion'];
            // uncomment this line for English Number System
            // var th = ['','thousand','million','milliard','billion'];
            var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
            var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
            var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

            function getLocations() {

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
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

            vm.sumAmount = function () {
                if (vm.provision.provisionVoucher == null)
                    return 0;

                if (vm.voucherLines == null)
                    return 0;

                var sum = 0;
                var debitSum = 0;
                var creditSum = 0;
                for (var i = 0; i < vm.voucherLines.length; i++) {

                    if (vm.voucherLines[i].debit != null && !vm.voucherLines[i].hidden)
                        sum = sum + utilities.round(vm.voucherLines[i].debit, 2);
                    if (vm.voucherLines[i].taxDebit && !vm.voucherLines[i].hidden) {
                        sum = sum + utilities.round(vm.voucherLines[i].taxDebit, 2);
                    }
                    sum = utilities.round(sum, 2);

                    if (vm.voucherLines[i].debit != null && !vm.voucherLines[i].hidden)
                        debitSum = debitSum + utilities.round(vm.voucherLines[i].debit, 2);
                    if (vm.voucherLines[i].taxDebit && !vm.voucherLines[i].hidden) {
                        debitSum = debitSum + utilities.round(vm.voucherLines[i].taxDebit, 2);
                        vm.voucherLines[i].tax = vm.voucherLines[i].taxDebit;
                    }
                    debitSum = utilities.round(debitSum, 2);

                    if (vm.voucherLines[i].credit != null && !vm.voucherLines[i].hidden)
                        creditSum = creditSum + utilities.round(vm.voucherLines[i].credit, 2);
                    if (vm.voucherLines[i].taxCredit && !vm.voucherLines[i].hidden) {
                        creditSum = creditSum + utilities.round(vm.voucherLines[i].taxCredit, 2);
                        vm.voucherLines[i].tax = vm.voucherLines[i].taxCredit;
                    }
                    creditSum = utilities.round(creditSum, 2);



                }

                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.provision.provisionVoucher.amountInWords = toWords(sum);
                }
                else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.provision.provisionVoucher.amountInWords = '';
                }

                vm.provision.provisionVoucher.amount = sum;
                vm.provision.provisionVoucher.debit = debitSum;
                vm.provision.provisionVoucher.credit = creditSum;
                // return sum;
            };

            vm.calculateTaxPerRow = function (row) {
                if (vm.provision.provisionVoucher == null)
                    return 0;

                if (row == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                if (row.debit != null) {
                    if (vm.provision.provisionVoucher.taxPercent > 0) {
                        var tax = 0;

                        //if (!vm.provision.provisionVoucher.contact.isTaxExempted) {

                        //    if (row.taxable || !row.taxable) {
                        //        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                        //            //equation solved from following formula... 
                        //            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                        //            var chargesWithoutTax = (row.debit * 100) / (100 + vm.bill.taxPercent);
                        //            tax = utilities.round(row.debit - chargesWithoutTax, 2);
                        //        } else {
                        //            //prices are without tax. calculate tax and include in total
                        //            tax = utilities.round(row.debit * vm.bill.taxPercent / 100, 2);
                        //            // vm.tripCharges[i].charges += utilities.round(tax,2);

                        //        }
                        //        row.tax = tax;
                        //        row.taxable = true;
                        //    }
                        //    else {
                        //        row.tax = 0;
                        //        row.taxable = (row.taxable);
                        //    }


                        //}

                        //else {
                            row.tax = 0;
                            row.taxable = (row.taxable);
                            vm.provision.provisionVoucher.taxPercent = 0;
                        //}

                    }
                    else {
                        row.tax = 0;
                        row.taxable = (row.taxable);
                    }
                }

                vm.sumAmountTax();
                //vm.sumAmount();

            };

            vm.sumAmountTax = function () {
                var totalAmount = 0.0;
                var totalTax = 0.0;
                vm.voucherLines.forEach(function (value) {
                    if (value.debit > 0)
                        totalAmount = totalAmount + parseFloat(value.debit);
                    if (value.tax > 0) {
                        value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    else
                        value.taxable = false;

                });
                vm.provision.provisionVoucher.tax = totalTax;
                vm.withoutDiscountAmount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.withoutDiscountAmount = utilities.round(vm.withoutDiscountAmount, 2);
                if (vm.provision.provisionVoucher.discount != null) {
                    vm.provision.provisionVoucher.amount = vm.withoutDiscountAmount - vm.provision.provisionVoucher.discount;
                }
                else {
                    vm.provision.provisionVoucher.amount = vm.withoutDiscountAmount;
                }
                if (vm.provision.provisionVoucher.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.provision.provisionVoucher.amountInWords = utilities.toWords(vm.provision.provisionVoucher.amount);
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

            //Add jv row
            vm.addJVRow = function () {

                vm.voucherLines.push(JVLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.voucherLines.indexOf(obj);
                vm.voucherLines.splice(index, 1);
                vm.sumAmount();
                vm.sumAmountTax();
            };

            //Add bill row
            vm.addBillRow = function () {
                vm.provision.provisionVoucher.taxPercent = vm.taxPercent;

                vm.voucherLines.push(billLineObject());
            };

            vm.clearVoucher = function () {
                vm.provision.provisionVoucher.discount = 0;
                vm.provision.provisionVoucher.amountInWords = "";
                vm.provision.provisionVoucher.amount = 0;
                vm.provision.provisionVoucher.taxPercent = vm.taxPercent;
                vm.withoutDiscountAmount = 0;
                vm.provision.provisionVoucher.tax = 0;
                vm.voucherLines = [];

                if (vm.provision.provisionVoucher.voucherSubTypeId == 50)
                    vm.addJVRow();
                else if (vm.provision.provisionVoucher.voucherSubTypeId == 51)
                    vm.addBillRow();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.save = function () {
                vm.saving = true;
                if (vm.provision.provisionVoucher.voucherSubTypeId == 50)
                    vm.sumAmount();

                // vm.provision.startDate = moment(vm.provision.startDate).startOf('day');
                // vm.provision.endDate = moment(vm.provision.endDate).endOf('day');
                //normalize time part for prepaid/prepaid reversal periods
                vm.voucherLines.forEach(function (value) {
                    if (!value.hidden) {
                        if (value.fromDate != null) value.fromDate = moment(value.fromDate).startOf('day');
                        if (value.toDate != null) value.toDate = moment(value.toDate).startOf('day');
                    }
                });
                vm.provision.provisionVoucher.voucherLines = vm.voucherLines;

                provisionService.createOrUpdateProvision
                    ({ provision: vm.provision, type: vm.provisionVoucherType }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));

                        vm.provision.id = result;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.provision.id);
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
            };
            var saveAndPrint = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        JVId: function () {
                            return id;
                        }
                    }
                });
            };

            vm.setStartDate = function () {
                if (vm.provision.dayOfMonth) {
                    vm.provision.startDate = vm.provision.entryDate.date(vm.provision.dayOfMonth).utc();
                }
            };
            vm.setEndDate = function () {
                //  vm.provision.endDate = vm.provision.startDate;
                if (vm.provision.noOfMonths && vm.provision.startDate) {
                    //vm.provision.endDate = moment();
                    vm.provision.endDate = moment(Object.assign({}, vm.provision.startDate));
                    vm.provision.endDate = vm.provision.endDate.add(vm.provision.noOfMonths, 'months').utc();
                    //vm.provision.endDate = vm.provision.endDate.subtract(1, 'seconds');
                }
            };

            vm.getDaysOfMonth = function () {
                vm.daysOfMonth = [];

                for (var i = 1; i < 28; i++) {
                    vm.daysOfMonth.push({ name: i, id: i });
                }
                if (vm.provision.entryDate) {
                    //vm.provision.entryDate = moment(vm.provision.entryDate);
                    vm.daysOfMonth.push({ name: "End Of Month", id: moment(vm.provision.entryDate).endOf('month').date() });
                }
            };

            vm.entryDateChanged = function () {
                vm.provision.dayOfMonth = null;
                vm.provision.startDate = null;
                vm.provision.noOfMonths = 0;
                vm.provision.endDate = null;
                vm.getDaysOfMonth();
                //vm.setStartDate();
            };
            function init() {
                getCostCenters();
                getLocations();
                provisionService.getProvisionForEdit({ id: provisionId }).success(
                    function (result) {
                        vm.provision = result;
                        vm.voucherLines = vm.provision.provisionVoucher.voucherLines;

                        if (vm.provision.id < 1) {
                            vm.isEditMode = false;
                            vm.provision.startDate = null;
                            vm.provision.endDate = null;
                            vm.provision.provisionVoucher.voucherSubTypeId = 50;
                            //vm.provision.debit = 0;
                            //vm.provision.credit = 0;
                            //vm.provision.locationId = appSession.user.locationId;
                        }
                        else {
                            vm.isEditMode = true;

                            angular.forEach(vm.voucherLines, function (value, key) {
                                if (value.fromDate != null && value.toDate != null)
                                    value.showDate = true;
                                if (value.vehicleId != null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId != null && value.contactId > 0)
                                    value.contactShow = true;

                                //else {
                                //    value.showDebitField = true;
                                //    value.showCreditField = true;
                                //}
                                if (!value.contactId) {
                                    //vm.accountChanged(value);

                                    if (vm.provision.provisionVoucher.voucherSubTypeId == 50)
                                        vm.accountChangedJV(value);
                                }
                                if (!value.hidden) {
                                    if (value.debit > 0)
                                        value.taxDebit = value.tax;
                                    if (value.credit > 0)
                                        value.taxCredit = value.tax;
                                }
                                if (vm.provision.provisionVoucher.voucherSubTypeId == 50)
                                    vm.sumAmount();
                                else if (vm.provision.provisionVoucher.voucherSubTypeId == 51)
                                    vm.sumAmountTax();
                            });
                        }
                        if (vm.voucherLines.length == 0)
                            vm.addJVRow();
                        vm.getDaysOfMonth();
                    });
            }
            init();

        }]);
