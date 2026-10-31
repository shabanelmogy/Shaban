// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:368789-369703
appModule.controller('tenant.views.crs.vouchers.loanAmortization.createOrEditModal', ['$uibModal', 'LoanAmortizationId',
        '$uibModalInstance', 'abp.services.app.loanAmortization', 'utilities', 'abp.services.app.account', 'abp.services.app.commonLookup', 'abp.services.app.vehicle',
        'abp.services.app.directory', 'appSession', '$filter', 'abp.services.app.item', 'abp.services.app.job', 'abp.services.app.costCenter', 'abp.services.app.division',
        'FileUploader', 'abp.services.app.tenantSettings', 'abp.services.app.leaseMasterAgreement', '$scope',
        function ($uibModal, LoanAmortizationId, $uibModalInstance, loanAmortizationAppService, utilities, accountService, commonLookupService, vehicleService, directoryService,
            appSession, $filter, itemAppService, jobAppService, costCenterService, divisionService, fileUploader, tenantSettingsService, leaseMasterAgreementService, $scope) {
            var vm = this;
            vm.showTax = false;
            vm.vehicles = [];
            vm.items = [];
            vm.suppliers = [];
            vm.JVingMethods = [];
            vm.locations = [];
            vm.documents = [];
            vm.expenseTypes = [];
            vm.selectme = "Select Vehicle";
            vm.saveAndPrint = false;
            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.selectedFile = null;
            vm.recordCountInBatch = 1000;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.addMasterAgreementInVouchers = abp.features.isEnabled("CRS.CustomFeatures.MasterAgreementInVouchers");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs');
            vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isDivisionEnabled = abp.features.isEnabled("Core.Divisions");
            vm.isImportVoucherLinesEnabled = abp.features.isEnabled("CRS.CustomFeatures.ImportVoucherLines");
            vm.documentsForLoanAmortization = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForLoanAmortization");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.taxPercentageInBillAndJvImport = utilities.parseBoolean(abp.setting.get("App.Speed.Common.TaxPercentageInBillAndJvImport"));

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.showDebitField = true;
            var employeeSelection = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EmployeeselectionisoptionalforControlAccounts"));
            vm.showCreditField = true;
            vm.description = '';
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.importVoucherLinesWithTax = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ImportVoucherLinesWithTax"));
            vm.costCenterGroup1Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup1Required"));
            vm.costCenterGroup2Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup2Required"));
            vm.isAttachVehicleWithAccountToDebit = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AttachVehicleWithAccountToDebit"));
            vm.isAttachVehicleWithAccountToCredit = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AttachVehicleWithAccountToCredit"));
            vm.isCustomAmortizationIsNonFinancial = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CustomAmortizationIsNonFinancial"));
            vm.totalAmount = 0;

            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));

            var selectedExpenseAccountIdsFromSettings = [];

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            function getExpenseAccountsAdvanceSetting() {
                tenantSettingsService.getExpenseAccountsAdvanceSetting()
                    .success(function (result) {
                        selectedExpenseAccountIdsFromSettings = result;
                        if (vm.vehicleExpensesAccounts)
                            vm.vehicleExpensesAccounts.filter(e => selectedExpenseAccountIdsFromSettings.includes(e.id)).forEach(e => e.isChecked = true);
                    });
            }

            function LoanAmortizationLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = vm.description;
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                line.fromDate = null;
                line.toDate = null;
                line.locationId = vm.loanAmortization.locationId;
                return line;
            }
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
            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/loanAmortization/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.loanAmortization.uploadDocumentsModal as vm',
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
            function loadCostCenterInLine(line) {
                line.showCostCenter = false;
                line.costCenters = [];
                if (line.account.accountCategory === 4 || line.account.accountCategory === 5 || line.showDate) {
                    line.showCostCenter = true;
                }

                if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 3) {
                    line.disableCostCenter = true;
                    if (line.showDate)
                        line.disableCostCenter = false;
                }
                else if (line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                    line.disableCostCenter = false;
                }
            }
            // On Change of Account
            vm.accountChanged = function (line) {
                // Clear Debit Vehicle if category is NOT 4/5
                if (!vm.isVehicleCategory(vm.loanAmortizationDetail.accountToDebit)) {
                    vm.loanAmortizationDetail.vehicleToDebit = null;
                    vm.loanAmortizationDetail.vehicleToDebitId = null;
                }

                // Clear Credit Vehicle if category is NOT 4/5
                if (!vm.isVehicleCategory(vm.loanAmortizationDetail.accountToCredit)) {
                    vm.loanAmortizationDetail.vehicleToCredit = null;
                    vm.loanAmortizationDetail.vehicleToCreditId = null;
                }

                line.contact = null;
                if ((line.account.accountCategory === 1 || line.account.accountCategory === 4 || line.account.accountCategory === 5 || line.showDate) && vm.taxPercent > 0 && !vm.isTaxInclusive) {
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
                        line.costCenterId = null;
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

                loadCostCenterInLine(line);

                vm.vehicleRequired = false;
                if (selectedExpenseAccountIdsFromSettings.some(e => e == line.accountId))
                    vm.vehicleRequired = true;

                line.taxCredit = 0;
                line.taxDebit = 0;

                vm.sumAmount();
            };



            vm.searchPrepaidExpense = function (voucherLine, accountId) {
                return loanAmortizationAppService.getexpenseaccounts({ id: accountId }).then(function (result) {
                    voucherLine.showDate = result.data;
                });
            };

            vm.isStockAccount = function (voucherLine, accountId) {
                if (vm.isStockFeatureEnabled) {
                    loanAmortizationAppService.isStockAccount({ id: accountId }).then(function (result) {
                        voucherLine.itemShow = result.data;
                        vm.accountChanged(voucherLine);
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

            vm.searchMasterAgreement = function ($select) {
                if ($select.search == "") { vm.masterAgreement = null; return null; }
                leaseMasterAgreementService.searchMasterAgreementsForVouchers({ keyword: $select.search }).then(function (response) {
                    vm.masterAgreement = response.data.items;
                });
            };


            // ... Converting Amount To Amount In Words ... ///

            vm.amountMinValue = 100;
            // American Numbering System
            var th = ['', 'thousand', 'million', 'billion', 'trillion'];
            var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
            var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
            var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

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

            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }

            function getDivisions() {
                divisionService.searchDivisions().success(function (response) {
                    vm.divisions = response.items;
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

            vm.considerTaxAsTaxPercentage = function (row) {
                if (vm.taxPercentageInBillAndJvImport) {
                    if (row.debit > 0) {
                        row.taxDebit = (row.tax / 100) * row.debit;
                        row.tax = row.taxDebit;
                    }
                    if (row.credit > 0) {
                        row.taxCredit = (row.tax / 100) * row.credit;
                        row.tax = row.taxCredit;
                    }
                }
            }

            vm.sumAmount = function () {
                if (vm.loanAmortization == null)
                    return 0;

                if (vm.loanAmortization.voucherLines == null && !vm.isCustomAmortizationIsNonFinancial)
                    return 0;

                var sum = 0;
                var debitSum = 0;
                var creditSum = 0;
                for (var i = 0; i < vm.loanAmortization.voucherLines.length; i++) {

                    if (vm.loanAmortization.voucherLines[i].debit != null && !vm.loanAmortization.voucherLines[i].hidden)
                        sum = sum + utilities.round(vm.loanAmortization.voucherLines[i].debit, 2);
                    if (vm.loanAmortization.voucherLines[i].taxDebit && !vm.loanAmortization.voucherLines[i].hidden) {
                        sum = sum + utilities.round(vm.loanAmortization.voucherLines[i].taxDebit, 2);
                    }
                    sum = utilities.round(sum, 2);

                    if (vm.loanAmortization.voucherLines[i].debit != null && !vm.loanAmortization.voucherLines[i].hidden)
                        debitSum = debitSum + utilities.round(vm.loanAmortization.voucherLines[i].debit, 2);
                    if (vm.loanAmortization.voucherLines[i].taxDebit && !vm.loanAmortization.voucherLines[i].hidden) {
                        debitSum = debitSum + utilities.round(vm.loanAmortization.voucherLines[i].taxDebit, 2);
                        vm.loanAmortization.voucherLines[i].tax = vm.loanAmortization.voucherLines[i].taxDebit;
                    }
                    debitSum = utilities.round(debitSum, 2);

                    if (vm.loanAmortization.voucherLines[i].credit != null && !vm.loanAmortization.voucherLines[i].hidden)
                        creditSum = creditSum + utilities.round(vm.loanAmortization.voucherLines[i].credit, 2);
                    if (vm.loanAmortization.voucherLines[i].taxCredit && !vm.loanAmortization.voucherLines[i].hidden) {
                        creditSum = creditSum + utilities.round(vm.loanAmortization.voucherLines[i].taxCredit, 2);
                        vm.loanAmortization.voucherLines[i].tax = vm.loanAmortization.voucherLines[i].taxCredit;
                    }
                    creditSum = utilities.round(creditSum, 2);
                }

                if (vm.isCustomAmortizationIsNonFinancial) {
                    sum = vm.loanAmortization.amount || 0;
                }
                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.loanAmortization.amountInWords = toWords(sum);
                }
                else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.loanAmortization.amountInWords = '';
                }

                vm.loanAmortization.amount = sum;
                vm.loanAmortization.debit = debitSum;
                vm.loanAmortization.credit = creditSum;
                //return sum;
            };
            vm.sumAmountExcel = function () {
                if (vm.loanAmortization == null)
                    return 0;

                if (vm.loanAmortization.voucherLines == null)
                    return 0;

                var sum = 0;
                var debitSum = 0;
                var creditSum = 0;
                for (var i = 0; i < vm.loanAmortization.voucherLines.length; i++) {

                    if (!vm.importVoucherLinesWithTax) {
                        if (vm.loanAmortization.voucherLines[i].debit != null && !vm.loanAmortization.voucherLines[i].hidden)
                            sum = sum + utilities.round(vm.loanAmortization.voucherLines[i].debit, 2);
                        if (vm.loanAmortization.voucherLines[i].taxDebit && !vm.loanAmortization.voucherLines[i].hidden) {
                            sum = sum + utilities.round(vm.loanAmortization.voucherLines[i].taxDebit, 2);
                        }
                        sum = utilities.round(sum, 2);

                        if (vm.loanAmortization.voucherLines[i].debit != null && !vm.loanAmortization.voucherLines[i].hidden)
                            debitSum = debitSum + utilities.round(vm.loanAmortization.voucherLines[i].debit, 2);
                        if (vm.loanAmortization.voucherLines[i].taxDebit && !vm.loanAmortization.voucherLines[i].hidden) {
                            debitSum = debitSum + utilities.round(vm.loanAmortization.voucherLines[i].taxDebit, 2);
                            vm.loanAmortization.voucherLines[i].tax = vm.loanAmortization.voucherLines[i].taxDebit;
                        }
                        debitSum = utilities.round(debitSum, 2);

                        if (vm.loanAmortization.voucherLines[i].credit != null && !vm.JLoanAmortizationV.voucherLines[i].hidden)
                            creditSum = creditSum + utilities.round(vm.loanAmortization.voucherLines[i].credit, 2);
                        if (vm.loanAmortization.voucherLines[i].taxCredit && !vm.loanAmortization.voucherLines[i].hidden) {
                            creditSum = creditSum + utilities.round(vm.loanAmortization.voucherLines[i].taxCredit, 2);
                            vm.loanAmortization.voucherLines[i].tax = vm.loanAmortization.voucherLines[i].taxCredit;
                        }
                        creditSum = utilities.round(creditSum, 2);
                    }
                }

                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.loanAmortization.amountInWords = toWords(sum);
                }
                else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.loanAmortization.amountInWords = '';
                }

                vm.loanAmortization.amount = sum;
                vm.loanAmortization.debit = debitSum;
                vm.loanAmortization.credit = creditSum;
                // return sum;
            };
            vm.sumAmountBeforeSaving = function () {
                if (vm.loanAmortization == null)
                    return 0;
                if (vm.loanAmortization.voucherLines == null && !vm.isCustomAmortizationIsNonFinancial)
                    return 0;
                var sum = 0;
                var debitSum = 0;
                var creditSum = 0;
                for (var i = 0; i < vm.loanAmortization.voucherLines.length; i++) {

                    if (vm.loanAmortization.voucherLines[i].debit != null && !vm.loanAmortization.voucherLines[i].hidden)
                        sum = sum + utilities.round(vm.loanAmortization.voucherLines[i].debit, 2);
                    if (vm.loanAmortization.voucherLines[i].taxDebit && !vm.loanAmortization.voucherLines[i].hidden) {
                        sum = sum + utilities.round(vm.loanAmortization.voucherLines[i].taxDebit, 2);
                    }
                    sum = utilities.round(sum, 2);

                    if (vm.loanAmortization.voucherLines[i].debit != null && !vm.loanAmortization.voucherLines[i].hidden)
                        debitSum = debitSum + utilities.round(vm.loanAmortization.voucherLines[i].debit, 2);
                    if (vm.loanAmortization.voucherLines[i].debit && !vm.loanAmortization.voucherLines[i].hidden) {
                        debitSum = debitSum + utilities.round(vm.loanAmortization.voucherLines[i].taxDebit, 2);
                        vm.loanAmortization.voucherLines[i].tax = vm.loanAmortization.voucherLines[i].taxDebit;
                    }
                    debitSum = utilities.round(debitSum, 2);

                    if (vm.loanAmortization.voucherLines[i].credit != null && !vm.loanAmortization.voucherLines[i].hidden)
                        creditSum = creditSum + utilities.round(vm.loanAmortization.voucherLines[i].credit, 2);
                    if (vm.loanAmortization.voucherLines[i].credit && !vm.loanAmortization.voucherLines[i].hidden) {
                        creditSum = creditSum + utilities.round(vm.loanAmortization.voucherLines[i].taxCredit, 2);
                        vm.loanAmortization.voucherLines[i].tax = vm.loanAmortization.voucherLines[i].taxCredit;
                    }
                    creditSum = utilities.round(creditSum, 2);
                }

                if (vm.isCustomAmortizationIsNonFinancial) {
                    sum = vm.loanAmortization.amount || 0;
                }
                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.loanAmortization.amountInWords = toWords(sum);
                }
                else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.loanAmortization.amountInWords = '';
                }

                vm.loanAmortization.amount = sum;
                vm.loanAmortization.debit = debitSum;
                vm.loanAmortization.credit = creditSum;
            };
            vm.refresh = function () {
                angular.element('#dataFile').val(null);
                vm.selectedFile = null;
                vm.allowImport = false;
                vm.totalRecordsCount = 0;
                vm.successRecordsCount = 0;
                vm.failRecordsCount = 0;
                vm.errorRecords = null;
                vm.showCount = false;
            };
            $scope.loadFile = function (files) {
                vm.allowImport = false;
                if (files.length > 0) {
                    $scope.$apply(function () {
                        vm.selectedFile = files[0];
                        readFileData();
                    });
                } else {
                    vm.refresh();
                    $scope.$apply();
                }
            };

            function correctData(date) {
                if (date) {
                    return moment(date);
                }
                else {
                    return "";
                }
            }

            function readFileData() {
                vm.fileDataList = [];
                var file = vm.selectedFile;
                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {
                    var reader = new FileReader();
                    vm.loading = true;
                    reader.onload = function (e) {

                        var data = e.target.result;
                        var workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
                        var first_sheet_name = workbook.SheetNames[0];

                        var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true, dateNF: 'MM-DD-YYYY HH:mm:ss' });

                        if (dataObjects.length > 0) {

                            for (var i = 0; i < dataObjects.length; i++) {

                                var value = dataObjects[i];
                                var record = {
                                    error: '',
                                    importStatus: 'new',

                                    date: value['Date'] ? correctData(value['Date']) : '',
                                    amount: value['Amount'] ? value['Amount'].toString().trim() : '',

                                };
                                vm.fileDataList.push(record);
                            }
                            if (vm.fileDataList.length > 0)
                                vm.allowImport = true;

                        } else {
                            abp.message.error("Something Wrong Or File is empty !", "Error");
                        }

                        vm.loading = false;
                        $scope.$apply();
                    };

                    reader.onerror = function (ex) {
                        vm.loading = false;
                        abp.message.warn(
                            app.localize(ex),
                            'Unknown File'
                        );
                    };

                    reader.readAsBinaryString(file);

                } else {
                    abp.message.error("Please select Valid file to upload !", "Unknown File");
                    vm.loading = false;
                }

            }

            vm.importData = function () {
                vm.allowImport = false;
                vm.loading = true;
                if (vm.fileDataList) {
                    sendDataInBatches();
                }
                else
                    abp.message.error("Something Wrong Or File is empty !", "Error");
            };

            function sendDataInBatches() {
                vm.loading = true;
                //get records that dont saved yet
                var recordsToSend = [];
                angular.forEach(vm.fileDataList, function (dataItem) {
                    if (dataItem.importStatus === 'new' && recordsToSend.length < vm.recordCountInBatch) {
                        recordsToSend.push(dataItem);
                    }
                });

                //return condition
                if (recordsToSend.length < 1) {
                    vm.loading = false;
                    vm.showCount = true;
                    vm.totalRecordsCount = vm.fileDataList.length;
                    vm.successRecordsCount = vm.fileDataList.filter(e => e.status == "success").length;
                    vm.failRecordsCount = vm.fileDataList.filter(e => e.status == "fail").length;
                    vm.failRecords = vm.fileDataList.filter(e => e.status == "fail");

                    var fieldsRecordsIndex = [];
                    vm.failRecords.forEach(e => {
                        fieldsRecordsIndex.push(vm.failRecords.indexOf(e) + 1);
                    });
                    vm.errorRecords = fieldsRecordsIndex.join();
                    return;
                }

            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }

            };
            //Add row
            vm.addRow = function () {
                vm.loanAmortization.voucherLines.push(LoanAmortizationLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.loanAmortization.voucherLines.indexOf(obj);
                vm.loanAmortization.voucherLines.splice(index, 1);
                vm.sumAmount();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.calculateTotal = function () {
                vm.totalAmount = vm.loanAmortization.loanAmortizationDetail.loanAmortizationPlans.reduce(function (sum, row) {
                    return sum + (parseFloat(row.amount) || 0); // Parse amount or default to 0
                }, 0);
            };

            // Import Loan Amortization Code
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
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    loanAmortizationAppService.importFromExcel(fileName)
                        .success(function (result) {
                            vm.loanAmortization.loanAmortizationDetail.loanAmortizationPlans = result;
                            vm.calculateTotal();
                            if (vm.loanAmortization.voucherLines.length == 0)
                                vm.addRow();
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


            function validateSumByLocation(voucherLines) {
                var loanAmortizationLinesgroups = voucherLines.reduce(function (r, a) {
                    r[a.locationId] = r[a.locationId] || [];
                    r[a.locationId].push(a);
                    return r;
                }, Object.create(null));

                for (const key in loanAmortizationLinesgroups) {
                    var debitSum = 0.00;
                    var creditSum = 0.00;
                    var group = loanAmortizationLinesgroups[key].filter(e => e.locationId);
                    group.forEach(function (item) {
                        if (item.debit) {
                            debitSum += parseFloat(item.debit);
                            if (item.taxDebit)
                                debitSum += parseFloat(item.taxDebit);
                        }
                        if (item.credit) {
                            creditSum += parseFloat(item.credit);
                            if (item.taxCredit)
                                creditSum += parseFloat(item.taxCredit);
                        }
                    });
                    debitSum = utilities.round(debitSum, 2);
                    creditSum = utilities.round(creditSum, 2);
                    if (debitSum != creditSum) {
                        var branch = null;
                        if (vm.locations.length > 0) {
                            branch = vm.locations.filter(e => e.id == group[0].locationId)[0];
                        }
                        abp.message.info('Branch "' + branch.name + '" does not have equal sum of debit and credit');
                        vm.saving = false;
                        return false;
                    }
                }
            }
            function validateSumByDivision(voucherLines) {
                var loanAmortizationLinesgroups = voucherLines.reduce(function (r, a) {
                    r[a.divisionId] = r[a.divisionId] || [];
                    r[a.divisionId].push(a);
                    return r;
                }, Object.create(null));

                for (const key in loanAmortizationLinesgroups) {
                    var debitSum = 0.00;
                    var creditSum = 0.00;
                    var group = loanAmortizationLinesgroups[key].filter(e => e.divisionId);
                    group.forEach(function (item) {
                        if (item.debit) {
                            debitSum += parseFloat(item.debit);
                            if (item.taxDebit)
                                debitSum += parseFloat(item.taxDebit);
                        }
                        if (item.credit) {
                            creditSum += parseFloat(item.credit);
                            if (item.taxCredit)
                                creditSum += parseFloat(item.taxCredit);
                        }
                    });
                    debitSum = utilities.round(debitSum, 2);
                    creditSum = utilities.round(creditSum, 2);
                    if (debitSum != creditSum) {
                        var div = null;
                        if (vm.divisions.length > 0) {
                            div = vm.divisions.filter(e => e.id == group[0].divisionId)[0];
                        }
                        abp.message.info('Division "' + div.name + '" does not have equal sum of debit and credit');
                        vm.saving = false;
                        return false;
                    }
                }
            }
            //vm.isbranchNull = function () {
            //    if (vm.loanAmortization.locationId == null)
            //        return true;
            //    else
            //        return false;

            //}
            vm.isVehicleCategory = function (account) {
                return account && (account.accountCategory === 4 || account.accountCategory === 5);
            };
            vm.isdateNull = function () {
                if (!vm.loanAmortization.date)
                    return true;
                else
                    return false;
            }
            vm.save = function () {
                vm.saving = true;
                vm.sumAmount();
                vm.sumAmountBeforeSaving();
                if (validateSumByLocation(vm.loanAmortization.voucherLines) == false) return;
                if (vm.isDivisionEnabled) {
                    if (validateSumByDivision(vm.loanAmortization.voucherLines) == false) return;
                }

                if (vm.loanAmortization.loanAmortizationDetail.loanAmortizationPlans?.length > 0 && vm.loanAmortization.voucherLines?.length > 0) {
                    // Get the first and last entries from loanAmortizationPlan
                    const loanAmortizationPlans = vm.loanAmortization.loanAmortizationDetail.loanAmortizationPlans;
                    const startingDate = loanAmortizationPlans[0].date;
                    const endingDate = loanAmortizationPlans[loanAmortizationPlans.length - 1].date;

                    // Update all voucherLines
                    vm.loanAmortization.voucherLines.forEach((voucherLine) => {
                        voucherLine.fromDate = startingDate;
                        voucherLine.toDate = endingDate;
                    });
                }

                vm.loanAmortization.voucherDocuments = vm.documents;
                //vm.loanAmortization.loanAmortizationDetail.loanAmortizationPlans = vm.fileDataList;
                vm.loanAmortization.loanAmortizationDetail = vm.loanAmortizationDetail;
                vm.loanAmortization.loanAmortizationDetail.accountToCreditId = vm.loanAmortizationDetail.accountToCredit.id;
                vm.loanAmortization.loanAmortizationDetail.accountToDebitId = vm.loanAmortizationDetail.accountToDebit.id;
                loanAmortizationAppService.createOrUpdateLoanAmortization
                    ({ LoanAmortization: vm.loanAmortization }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));

                        vm.loanAmortization.id = result;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.loanAmortization.id);
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
            };
            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };
            var saveAndPrint = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/loanAmortization/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.loanAmortization.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        LoanAmortizationId: function () {
                            return id;
                        }
                    }
                });
            };
            
            function init() {
                getLocations();
                getAllLocations();
                getCostCenters();
                getDivisions();

                loanAmortizationAppService.getLoanAmortizationForEdit({ id: LoanAmortizationId }).success(
                    function (result) {
                        vm.loanAmortization = result;
                        vm.documents = vm.loanAmortization.voucherDocuments;
                        vm.loanAmortizationDetail = vm.loanAmortization.loanAmortizationDetail;
                        vm.calculateTotal();
                        if (vm.loanAmortization.id < 1) {
                            vm.isEditMode = false;
                            vm.loanAmortization.voucherNo = null;
                            vm.loanAmortization.locationId = null;
                            vm.loanAmortization.debit = 0;
                            vm.loanAmortization.credit = 0;
                            vm.loanAmortization.locationId = appSession.user.locationId;
                            if (vm.loanAmortization.voucherLines.length == 0)
                                for (let i = 0; i < 2; i++) { // Loop to add the desired number of rows
                                    vm.addRow();
                                }

                        }
                    });
            }
            init();

        }]);
