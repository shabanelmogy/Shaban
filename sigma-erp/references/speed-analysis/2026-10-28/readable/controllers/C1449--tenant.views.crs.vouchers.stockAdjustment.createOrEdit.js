// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:396809-397520
appModule.controller('tenant.views.crs.vouchers.stockAdjustment.createOrEdit', ['$uibModal', 'JVId',
        '$uibModalInstance', 'abp.services.app.stockAdjustment', 'utilities', 'abp.services.app.account', 'abp.services.app.commonLookup', 'abp.services.app.vehicle',
        'abp.services.app.directory', 'appSession', '$filter', 'abp.services.app.item', 'abp.services.app.job', 'abp.services.app.costCenter', 'abp.services.app.division',
        'FileUploader', 'abp.services.app.tenantSettings',
        function ($uibModal, JVId, $uibModalInstance, StockAdjustmentService, utilities, accountService, commonLookupService, vehicleService, directoryService,
            appSession, $filter, itemAppService, jobAppService, costCenterService, divisionService, fileUploader, tenantSettingsService) {
            var vm = this;
            vm.showTax = false;
            vm.vehicles = [];
            vm.items = [];
            vm.suppliers = [];
            vm.JVingMethods = [];
            vm.locations = [];
            vm.expenseTypes = [];
            vm.selectme = "Select Vehicle";
            vm.saveAndPrint = false;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs');
            vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isDivisionEnabled = abp.features.isEnabled("Core.Divisions");
            vm.isImportVoucherLinesEnabled = abp.features.isEnabled("CRS.CustomFeatures.ImportVoucherLines");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.showDebitField = true;
            var employeeSelection = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EmployeeselectionisoptionalforControlAccounts"));
            vm.showCreditField = true;
            vm.description = '';
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            //vm.isCostCenterRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCostCenterForJvRequired")); // based on old setting
            //new settings
            vm.costCenterGroup1Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup1Required"));
            vm.costCenterGroup2Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup2Required"));

            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));

            var selectedExpenseAccountIdsFromSettings = [];

            function getExpenseAccountsAdvanceSetting() {
                tenantSettingsService.getExpenseAccountsAdvanceSetting()
                    .success(function (result) {
                        selectedExpenseAccountIdsFromSettings = result;
                        if (vm.vehicleExpensesAccounts)
                            vm.vehicleExpensesAccounts.filter(e => selectedExpenseAccountIdsFromSettings.includes(e.id)).forEach(e => e.isChecked = true);
                    });
            }

            function JVLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = vm.description;
                line.debit = null;
                line.quantityInOut = 2;
                line.credit = null;
                line.vehicleId = null;
                line.fromDate = null;
                line.toDate = null;
                line.locationId = vm.JV.locationId;
                
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

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            // Searching Contacts
            vm.searchContact = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };
            vm.changeInOut = function (voucherLine)
            {
                if (voucherLine.quantityInOut == 1)
                {
                   
                    if (voucherLine.credit > 0)
                    {
                        voucherLine.debit = voucherLine.credit;
                       
                    }
                    voucherLine.credit = 0;

                }
                else
                {
                    
                    if (voucherLine.debit > 0)
                    {
                        voucherLine.credit = voucherLine.debit;

                    }
                    voucherLine.debit = 0;

                }
            }
            function loadCostCenterInLine(line) {
                line.showCostCenter = false;
                line.costCenters = [];
                if (line.account.accountCategory === 4 || line.account.accountCategory === 5 || line.showDate) {
                    line.showCostCenter = true;
                }
                //if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 3) {
                //    for (var i = 0; i < vm.costCenters.length; i++) {
                //        if (vm.costCenters[i].type === 1) {
                //            line.costCenters.push(vm.costCenters[i]);
                //        }
                //    }
                //}
                //else if (line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                //    for (var i = 0; i < vm.costCenters.length; i++) {
                //        if (vm.costCenters[i].type === 2) {
                //            line.costCenters.push(vm.costCenters[i]);
                //        }
                //    }
                //}
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



           

            

            //vm.productSelected = function (line) {
            //    line.productId = line.product.id;
            //    line.unitOfMeasureId = line.product.unitOfMeasureId;
            //};

            // Searching Vehicles
            
            vm.searchItems = function ($select) {
                if ($select.search == "") { vm.items = null; return null; }
                return itemAppService.searchItems({ name: $select.search }).then(function (response) {
                    vm.items = response.data.items;
                });
            };
            vm.productSelected = function (line, voucherLine) {

                voucherLine.price = line.product.price;
                voucherLine.valueField1 = line.product.cost;
                voucherLine.unitOfMeasureId = line.product.unitOfMeasureId;

            }
            
            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.jobs = null; return null; }
                jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
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
            function getAllLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locationsAll = data.items;
                });
            }
            function getStatuses() {
                vm.types =[
                    { id: 1, name: 'Add' },
                    { id: 2, name: 'Minus' }]

               
            };
            vm.totalAmount = function (line) {
                if (line.valueField1 != null && line.quantity != null )
                {
                    if (line.quantityInOut == 1)

                        line.debit = line.valueField1 * line.quantity;
                       
                    if (line.quantityInOut == 2)

                        line.credit = line.valueField1 * line.quantity;
                }
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

            vm.sumAmount = function () {
                if (vm.JV == null)
                    return 0;

                if (vm.JV.voucherLines == null)
                    return 0;

                var sum = 0;
                var debitSum = 0;
                var creditSum = 0;
                for (var i = 0; i < vm.JV.voucherLines.length; i++) {

                    if (vm.JV.voucherLines[i].debit != null)
                        sum = sum + utilities.round(vm.JV.voucherLines[i].debit, 2);
                    if (vm.JV.voucherLines[i].taxDebit && !vm.JV.voucherLines[i].hidden) {
                        sum = sum + utilities.round(vm.JV.voucherLines[i].taxDebit, 2);
                    }
                    sum = utilities.round(sum, 2);

                    if (vm.JV.voucherLines[i].debit != null )
                        debitSum = debitSum + utilities.round(vm.JV.voucherLines[i].debit, 2);
                    if (vm.JV.voucherLines[i].taxDebit && !vm.JV.voucherLines[i].hidden) {
                        debitSum = debitSum + utilities.round(vm.JV.voucherLines[i].taxDebit, 2);
                        vm.JV.voucherLines[i].tax = vm.JV.voucherLines[i].taxDebit;
                    }
                    debitSum = utilities.round(debitSum, 2);

                    if (vm.JV.voucherLines[i].credit != null )
                        creditSum = creditSum + utilities.round(vm.JV.voucherLines[i].credit, 2);
                    if (vm.JV.voucherLines[i].taxCredit && !vm.JV.voucherLines[i].hidden) {
                        creditSum = creditSum + utilities.round(vm.JV.voucherLines[i].taxCredit, 2);
                        vm.JV.voucherLines[i].tax = vm.JV.voucherLines[i].taxCredit;
                    }
                    creditSum = utilities.round(creditSum, 2);



                }

                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.JV.amountInWords = toWords(sum);
                }
                else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.JV.amountInWords = '';
                }

                vm.JV.amount = sum;
                vm.JV.debit = debitSum;
                vm.JV.credit = creditSum;
                //return sum;
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

            //Add row
            vm.addRow = function () {

                vm.JV.voucherLines.push(JVLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.JV.voucherLines.indexOf(obj);
                vm.JV.voucherLines.splice(index, 1);
                vm.sumAmount();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            // Import JV Code
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
                vm.JV.voucherLines = [];
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    JVService.importFromExcel(fileName)
                        .success(function (result) {
                            vm.JV.voucherLines = result;

                            angular.forEach(vm.JV.voucherLines, function (value, key) {
                                if (value.fromDate != null && value.toDate != null)
                                    value.showDate = true;
                                if (value.vehicleId != null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId != null && value.contactId > 0)
                                    value.contactShow = true;
                                if (value.account.accountCategory != null && value.contactId > 0)
                                    value.contactShow = true;
                                if (!value.contactId)
                                    vm.accountChanged(value);
                                if (!value.hidden) {
                                    if (value.debit > 0)
                                        value.taxDebit = value.tax;
                                    if (value.credit > 0)
                                        value.taxCredit = value.tax;
                                }
                                if (!value.locationId)
                                    value.locationId = vm.JV.locationId;
                                if (value.contactTypeForImportJv) {
                                    if (!value.contactTypeForImportJv.isDefault)
                                        value.account.contactGroupId = value.contactTypeForImportJv.id;
                                    if (value.contactTypeForImportJv.contactType === 1 && employeeSelection) {
                                        value.contactShow = true;
                                        value.vehicleShow = false;
                                        value.showContactMessage = "Please Select Staff (Optional)";
                                    }
                                    if (value.contactTypeForImportJv.contactType === 1 && !employeeSelection) {
                                        value.contactShow = true;
                                        value.vehicleShow = false;
                                        value.showContactMessage = "Please Select Staff ";
                                    }
                                    if (value.contactTypeForImportJv.contactType === 2) {
                                        value.contactShow = true;
                                        value.vehicleShow = false;
                                        value.showContactMessage = "Please Select Customer";
                                    }
                                    if (value.contactTypeForImportJv.contactType === 3) {
                                        value.contactShow = true;
                                        value.vehicleShow = false;
                                        value.showContactMessage = "Please Select Supplier";
                                    }

                                }
                                vm.sumAmount();
                            });
                            if (vm.JV.voucherLines.length == 0)
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
                var jvLinesgroups = voucherLines.reduce(function (r, a) {
                    r[a.locationId] = r[a.locationId] || [];
                    r[a.locationId].push(a);
                    return r;
                }, Object.create(null));

                for (const key in jvLinesgroups) {
                    var debitSum = 0.00;
                    var creditSum = 0.00;
                    var group = jvLinesgroups[key].filter(e => e.locationId);
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
                   
                }
            }
            function validateSumByDivision(voucherLines) {
                var jvLinesgroups = voucherLines.reduce(function (r, a) {
                    r[a.divisionId] = r[a.divisionId] || [];
                    r[a.divisionId].push(a);
                    return r;
                }, Object.create(null));

                for (const key in jvLinesgroups) {
                    var debitSum = 0.00;
                    var creditSum = 0.00;
                    var group = jvLinesgroups[key].filter(e => e.divisionId);
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
                    
                }
            }
            vm.isbranchNull = function () {
                if (vm.JV.locationId == null)
                    return true;
                else
                    return false;

            }
            vm.isdateNull = function () {
                if (!vm.JV.date)
                    return true;
                else
                    return false;

            }
            vm.save = function () {
                vm.saving = true;
                vm.sumAmount();
                if (validateSumByLocation(vm.JV.voucherLines) == false) return;
                if (vm.isDivisionEnabled) {
                    if (validateSumByDivision(vm.JV.voucherLines) == false) return;
                }
                //normalize time part for prepaid/prepaid reversal periods
                vm.JV.voucherLines.forEach(function (value) {
                    if (!value.hidden) {
                        if (value.fromDate != null) value.fromDate = moment(value.fromDate).startOf('day');
                        if (value.toDate != null) value.toDate = moment(value.toDate).startOf('day');
                    }
                });

                StockAdjustmentService.createOrUpdateStockAdjustment
                    ({ StockAdjustment: vm.JV }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));

                        vm.JV.id = result;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.JV.id);
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

            function init() {
                getLocations();
                getAllLocations();
                getCostCenters();
                getDivisions();
                getStatuses();
                
                //getExpenseAccountsAdvanceSetting();

                StockAdjustmentService.getStockAdjustmentForEdit({ id: JVId }).success(
                    function (result) {
                        vm.JV = result;

                        //if (vm.JV.id < 1) {
                        //    vm.isEditMode = false;
                        //    vm.JV.voucherNo = null;
                        //    vm.JV.locationId = null;
                        //    vm.JV.debit = 0;
                        //    vm.JV.credit = 0;
                        //    vm.JV.locationId = appSession.user.locationId;
                        //}
                        //else {
                        //    vm.isEditMode = true;

                        //    angular.forEach(vm.JV.voucherLines, function (value, key) {
                        //        if (value.fromDate != null && value.toDate != null)
                        //            value.showDate = true;
                                
                        //        if (value.contactId != null && value.contactId > 0)
                        //            value.contactShow = true;
                        //        if (value.productId != null) {
                        //            value.itemShow = true;
                        //            vm.accountChanged(value);

                        //            value.product.unitOfMeasure = value.unitOfMeasure;
                        //            value.product.unitOfMeasureId = value.unitOfMeasureId;
                        //            value.valueField1 = value.product.cost;
                        //        }

                        //        //else {
                        //        //    value.showDebitField = true;
                        //        //    value.showCreditField = true;
                        //        //}
                        //        if (!value.contactId)
                        //            vm.accountChanged(value);
                        //        if (!value.hidden) {
                        //            if (value.debit > 0)
                        //                value.taxDebit = value.tax;
                        //            if (value.credit > 0)
                        //                value.taxCredit = value.tax;
                        //        }
                        //        vm.sumAmount();
                        //    })
                        //}
                        //if (vm.JV.voucherLines.length == 0)
                        //    vm.addRow();
                    });
            }
            init();
            
        }]);
