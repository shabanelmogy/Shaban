// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:159808-160692
appModule.controller('tenant.views.crs.assets.assets.disposeAsset', [
        '$uibModalInstance', '$uibModal', 'abp.services.app.asset', 'utilities', 'assetId', 'abp.services.app.depreciation',
        'abp.services.app.account', 'abp.services.app.linkedAccount', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.contactGroup',
        function (
            $uibModalInstance, $uibModal, assetService, utilities, assetId, depricationService,
            accountService, linkedAccountService, vehicleService, directoryService, contactGroupService) {

            var vm = this;
            vm.saving = false;
            vm.documentsForAssetsDisposalEnabled = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForAssetsDisposal");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.taxInclusiveCalculationOnAssetDisposal = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusiveCalculationOnAssetDisposal"));
            vm.editablePendingDepreciation = utilities.parseBoolean(abp.setting.get("App.General.PendingDepreciationEditableOnAssetDisposal"));
            vm.discountOnAssetForDisposal = abp.features.isEnabled("CRS.CustomFeatures.DiscountOnAssetForDisposal");
            vm.isCustomDisposalInAsset = abp.features.isEnabled("CRS.CustomFeatures.CustomDisposalInAsset");
            vm.isEnableTotalLossInAssets = abp.setting.get("App.General.EnableTotalLossInAssets");

            vm.isClaimChargesInTotalLoss = abp.setting.get("App.General.ClaimChargesInTotalLoss");

            vm.zerofyMinValue = function () {
                if (vm.asset.discount == null)
                    vm.asset.discount = 0;
            };
            var isAssetInitialized = false;
            vm.disposalType = [
                {
                    id: 1,
                    name: 'Selling'
                },
                {
                    id: 2,
                    name: 'Total Loss'
                },
            ];



            vm.vehicles = [];
            vm.accounts = [];
            vm.documents = [];
            vm.assetDisposal = {
                asset: null,
                accumulatedDepreciation: 0.0,
                bookValue: 0.0,
                pendingDepreciation: 0.0,
                pendingDepreciationFromDate: null,
                netBookValue: 0.0,
                profitOrLoss: 0.0,
                expenseAccountId: null,
                expenseAccount: null,
                revenueAccountId: null,
                revenueAccount: null,
                forSaleDate: null,
                documents: null
            };

            vm.addCustomDisposalType = function () {
                vm.disposalType.push({
                    id: 3,
                    name: 'Custom Disposal'
                });
            };

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {

                    vm.documents.push(result);
                });
            }
            vm.disposalDateChanged = function () {
                if (vm.assetDisposal.asset == null) return;
                if (vm.assetDisposal.asset.disposalDate == null) return;

                vm.assetDisposal.asset.deprEndDate = moment(vm.assetDisposal.asset.disposalDate).utc();
            };

            var accumulatedDepreciationAccount = null;
            let assetAccount = null;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs');
            vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isDivisionEnabled = abp.features.isEnabled("Core.Divisions");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.showDebitField = true;
            var employeeSelection = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EmployeeselectionisoptionalforControlAccounts"));
            vm.showCreditField = true;

            vm.disposalTypeChange = function ($disposalTypeId) {
                if ($disposalTypeId === 2 || $disposalTypeId === 3) {

                    let accumulatedDepreciationAccountId = vm.assetDisposal.asset.assetType.accumulatedDepreciationAccountId;
                    let assetAccountId = vm.assetDisposal.asset.assetType.assetAccountId;
                    if (!accumulatedDepreciationAccount || !assetAccount)
                        accountService.getAccountForEdit({ id: accumulatedDepreciationAccountId })
                            .then(function (response) {
                                console.log(response);
                                accumulatedDepreciationAccount = response.data;
                                accountService.getAccountForEdit({ id: assetAccountId })
                                    .then(function (response) {
                                        console.log(response);
                                        assetAccount = response.data;
                                        setAccounts();
                                    });

                            });
                    else {
                        setAccounts();
                    }

                }
                else {
                    vm.totalLossHide = true;
                    vm.sellingHide = false;

                }
            };

            //vm.searchCustomerPopoup = function () {
            //    var modalInstance = openSearchContactModel(null, 3, false);

            //    modalInstance.result.then(function (result) {
            //        if (result != null) {
            //            vm.customer = result;
            //            vm.assetDisposal.asset.SoldToContact = result;
            //            vm.soldToContactChanged();
            //        }
            //    });
            //};
            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 3, false);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.customer = result;
                    vm.assetDisposal.asset.SoldToContact = result;
                    vm.soldToContactChanged();
                });
            };
            function openSearchContactModel(category, type, isOnlyCorporate) {
                var companyIdToForward = vm.assetDisposal.asset.SoldToContact ? vm.assetDisposal.asset.SoldToContact.id : null;

                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactOptionModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactOptionModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                category: category,
                                type: type,
                                isOnlyCorporate: isOnlyCorporate,
                                companyId: companyIdToForward,
                                activeOnly: true
                            }
                        }
                    }
                });
            }

            //function openSearchContactModel(category, type, isOnlyCorporate = false) {
            //    var companyIdToForward = vm.assetDisposal.asset.SoldToContact ? vm.assetDisposal.asset.SoldToContact.id : null;

            //    return $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/contacts/searchContactOptionModal.cshtml',
            //        controller: 'tenant.views.crs.contacts.searchContactOptionModal as vm',
            //        backdrop: 'static',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    category: category,
            //                    type: type,
            //                    isOnlyCorporate: isOnlyCorporate,
            //                    companyId: companyIdToForward
            //                }
            //            }
            //        }
            //    });
            //}

            function JVLineObject() {
                var line = new Object();
                line.expenseTypeId = null;
                line.description = null;
                line.debit = 0;
                line.credit = 0;
                line.vehicleId = null;
                line.fromDate = null;
                line.toDate = null;
                line.taxDebit = 0;
                line.taxCredit = 0;
                return line;
            }

            vm.setVoucherLineForTotalLossDisposal = function (voucherLine) {
                vm.jv = [];
                voucherLine.forEach(function (line) {
                    let vL = JVLineObject();
                    vL.account = line.account;
                    vL.accountId = line.account.id;
                    vL.description = line.description;
                    vL.debit = line.debit;
                    vL.credit = line.credit;
                    vL.vehicleId = line.vehicle != null ? line.vehicle.id : null;
                    vL.taxDebit = 0;
                    vL.taxCredit = 0;
                    vl.contactId = line.contactId;
                    vL.subLookUp = line.contactId != null ? true : false;
                    vm.jv.push(vL);
                });
            }

            function setAccounts() {

                if (vm.assetDisposal.asset.disposalType === 2) {

                    vm.jv = [];

                    let r1 = JVLineObject();
                    r1.expenseTypeId = 5;
                    r1.account = accumulatedDepreciationAccount;
                    r1.accountId = vm.assetDisposal.asset.assetType.accumulatedDepreciationAccountId;
                    r1.description = app.localize("AccumulatedDepreciation") + ". " + app.localize("AssetNo") + ": " + vm.assetDisposal.asset.assetNo;
                    r1.debit = (vm.assetDisposal.accumulatedDepreciation + vm.assetDisposal.pendingDepreciation);
                    r1.disabled = true;
                    r1.taxDebit = 0;
                    r1.taxCredit = 0;

                    let r2 = JVLineObject();
                    r2.account = assetAccount;
                    r2.accountId = vm.assetDisposal.asset.assetType.assetAccountId;
                    r2.description = app.localize('OriginalCost') + '. ' + app.localize('AssetNo') + ':' + vm.assetDisposal.asset.assetNo;
                    r2.credit = vm.assetDisposal.asset.purchseCost;
                    r2.disabled = true;
                    r2.taxDebit = 0;
                    r2.taxCredit = 0;
                    vm.accountChangedForTax(r2);
                    //vm.jv.push(r2);
                    vm.accountChangedForTax(r1);
                    //vm.jv.push(r1);

                    vm.totalLossHide = false;
                    vm.sellingHide = true;

                    if (vm.assetDisposal.asset.claimCharges != null) {
                        let r3 = JVLineObject();
                        r3.account = vm.linkedAccount?.account;
                        r3.debit = vm.assetDisposal.asset.claimCharges;
                        r3.credit = 0;
                        r3.disabled = false;
                        r3.taxDebit = 0;
                        r3.taxCredit = 0;
                        r3.contactId = vm.assetDisposal.asset.insuranceCompanyId;
                        r3.subLookUp = true;
                        vm.accountChangedForTax(r3);
                        //vm.jv.push(r3);
                    }

                    vm.accountCheck = vm.assetDisposal.asset.claimCharges + vm.assetDisposal.accumulatedDepreciation + vm.assetDisposal.pendingDepreciation;

                    if (vm.accountCheck > vm.assetDisposal.asset.purchseCost) {
                        let r5 = JVLineObject();
                        r5.account = vm.assetDisposal.revenueAccount;
                        r5.accountId = vm.assetDisposal.revenueAccountId;
                        r5.description = "";
                        r5.credit = (vm.assetDisposal.accumulatedDepreciation + vm.assetDisposal.pendingDepreciation + vm.assetDisposal.asset.claimCharges - vm.assetDisposal.asset.purchseCost);
                        r5.debit = 0;
                        r5.disabled = false;
                        r5.taxDebit = 0;
                        r5.taxCredit = 0;
                        vm.accountChangedForTax(r5);
                        //vm.jv.push(r5);

                    } else if (vm.accountCheck < vm.assetDisposal.asset.purchseCost) {

                        let r4 = JVLineObject();
                        r4.account = vm.assetDisposal.expenseAccount;
                        r4.accountId = vm.assetDisposal.expenseAccountId;
                        r4.description = "";
                        r4.credit = 0;
                        r4.debit = vm.assetDisposal.asset.purchseCost - (vm.assetDisposal.accumulatedDepreciation + vm.assetDisposal.pendingDepreciation + vm.assetDisposal.asset.claimCharges);
                        r4.disabled = false;
                        r4.taxDebit = 0;
                        r4.taxCredit = 0;
                        vm.accountChangedForTax(r4);
                        /*vm.jv.push(r4);*/
                    }

                    vm.calculateDebitCreditSum();
                }
                else if (vm.assetDisposal.asset.disposalType === 3) {

                    vm.jv = [];

                    let r2 = JVLineObject();
                    r2.account = assetAccount;
                    r2.accountId = vm.assetDisposal.asset.assetType.assetAccountId;
                    r2.description = app.localize('OriginalCost') + '. ' + app.localize('AssetNo') + ':' + vm.assetDisposal.asset.assetNo;
                    r2.credit = vm.assetDisposal.bookValue;
                    r2.disabled = true;
                    r2.taxDebit = 0;
                    r2.taxCredit = 0;
                    vm.accountChangedForTax(r2);
                    //vm.jv.push(r2);
                    //vm.accountChangedForTax(r1);
                    //vm.jv.push(r1);

                    vm.totalLossHide = false;
                    vm.sellingHide = true;

                    vm.calculateDebitCreditSum();
                }
            }

            vm.searchContact = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;

                return directoryService.search({ keyword: $select.search, doNotIncludeStaff: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.customerSelected = function () {
                vm.assetDisposal.asset.insuranceCompanyId = vm.customer.id;
                if (vm.customer.contactGroupId == null) {
                    //getDefaultContactGroup();
                    return contactGroupService.getContactGroupsOnContactTypeAndIsDefault({}).success(function (result) {
                        vm.contactGroup = result;
                        if (vm.contactGroup != null) {
                            vm.customer.contactGroupId = vm.contactGroup.id;
                            getLinkedAccountByContactGroup(vm.customer.contactGroupId);
                        }
                    });
                }
                else {
                    getLinkedAccountByContactGroup(vm.customer.contactGroupId);

                }
            };
            getLinkedAccountByContactGroup = function (contactGroupId) {
                return linkedAccountService.getLinkedAccountByContactGroupId({ id: contactGroupId }).success(function (result) {
                    vm.linkedAccount = result;
                    if (vm.linkedAccount != null) {
                        setAccounts();
                    }
                });
            }

            function getAccumulatedDepreciation() {
                vm.loading = true;

                assetService.getAccumulatedDepreciationForAsset({ id: assetId }).success(function (result) {
                    vm.assetDisposal.accumulatedDepreciation = utilities.round(result, 2);
                    vm.assetDisposal.bookValue = utilities.round(vm.assetDisposal.asset.purchseCost - vm.assetDisposal.accumulatedDepreciation, 2);
                    isAssetInitialized = true;
                    var profitMargin = parseFloat(abp.setting.get("App.General.ProfitMarginOnBookValue"));
                    if (vm.assetDisposal.asset.salePrice == 0 && profitMargin > 0) {
                        vm.assetDisposal.asset.salePrice = vm.assetDisposal.bookValue + ((profitMargin / 100) * vm.assetDisposal.bookValue);
                        vm.assetDisposal.asset.salePrice = utilities.round(vm.assetDisposal.asset.salePrice, 0);
                        vm.assetDisposal.asset.isEstimatedSalePrice = true;

                        vm.salePriceChanged();
                    }
                    else if (vm.assetDisposal.asset.salePrice > 0) {
                        vm.assetDisposal.asset.isEstimatedSalePrice = false;
                    }

                    vm.getPendingDepreciation();

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getCustomDisposal = function () {
                vm.assetDisposal.netBookValue = utilities.round(vm.assetDisposal.bookValue, 2);
                setAccounts();
            };

            vm.getPendingDepreciation = function () {

                if (!isAssetInitialized || !vm.assetDisposal.asset.deprEndDate) return;

                var deprEndDate = vm.assetDisposal.asset.deprEndDate.startOf('day');

                depricationService.getPendingDepreciation({ assetId: assetId, endDate: deprEndDate }).success(function (result) {
                    vm.assetDisposal.pendingDepreciation = utilities.round(result.depreciation, 2);
                    vm.assetDisposal.pendingDepreciationFromDate = result.deprStartDate;
                    vm.assetDisposal.netBookValue = utilities.round(vm.assetDisposal.bookValue - vm.assetDisposal.pendingDepreciation, 2);
                    setAccounts();
                });
            };

            vm.pendingDepreciationChanged = function () {
                vm.assetDisposal.netBookValue = vm.assetDisposal.bookValue - vm.assetDisposal.pendingDepreciation;

                if (vm.assetDisposal.asset.disposalType === 2) {
                    vm.jv[1].debit = vm.assetDisposal.accumulatedDepreciation + vm.assetDisposal.pendingDepreciation;
                    vm.calculateDebitCreditSum();
                    setAccounts();
                }

            };

            vm.addRow = function () {
                vm.jv.push(JVLineObject());
            };

            vm.removeRow = function (r) {
                vm.jv.splice(vm.jv.indexOf(r), 1);
            };

            vm.calculateDebitCreditSum = function () {
                vm.balance = {
                    sumCredit: 0,
                    sumDebit: 0
                };
                for (var i in vm.jv) {
                    vm.balance.sumCredit += parseFloat(vm.jv[i].credit) + parseFloat(vm.jv[i].taxCredit);
                    vm.balance.sumDebit += parseFloat(vm.jv[i].debit) + parseFloat(vm.jv[i].taxDebit);

                    vm.balance.sumCredit = utilities.round(vm.balance.sumCredit, 2);
                    vm.balance.sumDebit = utilities.round(vm.balance.sumDebit, 2);
                }

            };

            vm.soldToContactChanged = function () {
                vm.assetDisposal.asset.soldToContactId = vm.assetDisposal.asset.SoldToContact.id;
                if (vm.assetDisposal.asset.SoldToContact.isTaxExempted) {
                    vm.assetDisposal.tax = 0;
                    vm.assetDisposal.salePriceWithTax = vm.assetDisposal.asset.salePrice;
                }
                else {
                    vm.salePriceChanged();
                }

            };
            vm.onDiscountChange = function () {
                vm.assetDisposal.netAmount = vm.assetDisposal.salePriceWithTax - vm.assetDisposal.asset.discount;
            }

            vm.salePriceChanged = function () {
                if (vm.discountOnAssetForDisposal) {
                    if (!vm.isTaxInclusive && vm.isTaxEnabled) {
                        if (!vm.assetDisposal.asset.SoldToContact?.isTaxExempted) {
                            vm.assetDisposal.tax = vm.rounding(vm.assetDisposal.asset.salePriceWODiscount * vm.taxPercent / 100);
                            vm.assetDisposal.salePriceWithTax = vm.rounding(vm.assetDisposal.asset.salePriceWODiscount + vm.assetDisposal.tax);
                        }
                        else {
                            vm.assetDisposal.salePriceWithTax = vm.rounding(vm.assetDisposal.asset.salePriceWODiscount);
                        }
                        vm.getProfitOrLossAmount();
                    }
                    else {
                        vm.assetDisposal.salePriceWithTax = vm.rounding(vm.assetDisposal.asset.salePriceWODiscount);
                    }
                }
                else {
                    if (!vm.isTaxInclusive && vm.isTaxEnabled) {
                        if (!vm.assetDisposal.asset.SoldToContact?.isTaxExempted) {
                            vm.assetDisposal.tax = vm.rounding(vm.assetDisposal.asset.salePrice * vm.taxPercent / 100);
                            vm.assetDisposal.salePriceWithTax = vm.rounding(vm.assetDisposal.asset.salePrice + vm.assetDisposal.tax);
                        }
                        else {
                            vm.assetDisposal.salePriceWithTax = vm.rounding(vm.assetDisposal.asset.salePrice);
                        }
                        vm.getProfitOrLossAmount();
                    }
                    else {
                        vm.assetDisposal.salePriceWithTax = vm.rounding(vm.assetDisposal.asset.salePrice);
                        if (vm.isTaxInclusive && vm.taxInclusiveCalculationOnAssetDisposal) {
                            if (!vm.assetDisposal.asset.SoldToContact?.isTaxExempted) {
                                vm.assetDisposal.asset.salePriceWithoutTax = vm.rounding(vm.assetDisposal.asset.salePrice / ((vm.taxPercent / 100) + 1), 2);
                                vm.assetDisposal.tax = vm.rounding(vm.assetDisposal.asset.salePrice - vm.assetDisposal.asset.salePriceWithoutTax);

                                vm.getProfitOrLossAmount();
                            }
                            else {
                                vm.assetDisposal.asset.salePrice = vm.rounding(vm.assetDisposal.salePriceWithTax);
                            }
                        }
                    }

                }

            };


            vm.salePriceWithTaxChanged = function () {
                if (!vm.assetDisposal.asset.SoldToContact?.isTaxExempted) {
                    vm.assetDisposal.asset.salePrice = vm.rounding(vm.assetDisposal.salePriceWithTax / ((vm.taxPercent / 100) + 1), 2);
                    vm.assetDisposal.tax = vm.rounding(vm.assetDisposal.salePriceWithTax - vm.assetDisposal.asset.salePrice);

                    vm.getProfitOrLossAmount();
                }
                else {
                    vm.assetDisposal.asset.salePrice = vm.rounding(vm.assetDisposal.salePriceWithTax);
                }
            };

            vm.salePriceWithoutTaxChanged = function () {
                if (!vm.assetDisposal.asset.SoldToContact?.isTaxExempted) {
                    vm.assetDisposal.asset.salePriceWithoutTaxChanged = vm.rounding(vm.assetDisposal.salePriceWithTax / ((vm.taxPercent / 100) + 1), 2);
                    vm.assetDisposal.tax = vm.rounding(vm.assetDisposal.asset.salePrice - vm.assetDisposal.salePriceWithoutTax);

                    vm.getProfitOrLossAmount();
                }
                else {
                    vm.assetDisposal.asset.salePrice = vm.rounding(vm.assetDisposal.salePriceWithTax);
                }
            };

            vm.taxChanged = function () {
                vm.assetDisposal.salePriceWithTax = vm.rounding(vm.assetDisposal.asset.salePrice + vm.assetDisposal.tax);
            };
            vm.changeTaxOrNetPrice = function () {
                vm.assetDisposal.asset.salePriceWODiscount = vm.rounding(vm.assetDisposal.asset.salePrice + vm.assetDisposal.asset.discount);
            };

            vm.salePriceWODiscountChanged = function () {


                vm.getProfitOrLossAmount();
                vm.salePriceChanged();
                vm.assetDisposal.asset.salePrice = vm.rounding(vm.assetDisposal.asset.salePrice);


            };

            // NEW helper
            vm.getEffectiveSalePrice = function () {
                var isTaxExempted = vm.assetDisposal.asset.SoldToContact && vm.assetDisposal.asset.SoldToContact.isTaxExempted;
                if (vm.isTaxInclusive && vm.taxInclusiveCalculationOnAssetDisposal && !isTaxExempted &&
                    vm.assetDisposal.asset.salePriceWithoutTax != null) {
                    return vm.assetDisposal.asset.salePriceWithoutTax;
                }
                return vm.assetDisposal.asset.salePrice;
            };

            vm.getProfitOrLossAmount = function () {
                if (vm.assetDisposal.asset == null) return 0;
                if (vm.discountOnAssetForDisposal)
                    vm.assetDisposal.asset.salePrice = vm.assetDisposal.asset.salePriceWODiscount - vm.assetDisposal.asset.discount;

                var effectiveSalePrice = vm.getEffectiveSalePrice();

                if (effectiveSalePrice > vm.assetDisposal.netBookValue)
                    return utilities.round(effectiveSalePrice - vm.assetDisposal.netBookValue, 2);
                else
                    return utilities.round(vm.assetDisposal.netBookValue - effectiveSalePrice, 2);
            };

            // Searching Accounts
            vm.searchAccounts = function ($select) {

                if ($select.search == "") {
                    vm.accounts = null;
                    return null;
                }

                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true }).then(function (response) {

                    vm.accounts = response.data.items;
                });
            };

            vm.onClaimChargesChange = function () {

                setAccounts();
            };

            vm.isDeprEndDateForSaleDate = function () {
                //if (vm.assetDisposal.asset.deprEndDate && vm.assetDisposal.forSaleDate) {
                //    if (moment(vm.assetDisposal.asset.deprEndDate).startOf('day').utc() == moment(vm.assetDisposal.forSaleDate))
                //        return true;
                //}

                return false;
            };

            vm.save = function () {
                vm.saving = true;

                // Tax-inclusive mode: treat the taxable amount (excl. VAT) as the real
                // selling price for Profit/Loss AND for whatever gets persisted as Asset.SalePrice,
                // so the asset profile, approval screen and invoice all agree.
                if (vm.isTaxInclusive && vm.taxInclusiveCalculationOnAssetDisposal &&
                    !(vm.assetDisposal.asset.SoldToContact && vm.assetDisposal.asset.SoldToContact.isTaxExempted) &&
                    vm.assetDisposal.asset.salePriceWithoutTax != null) {
                    vm.assetDisposal.asset.salePrice = vm.assetDisposal.asset.salePriceWithoutTax;
                }

                vm.assetDisposal.profitOrLoss = utilities.round(vm.assetDisposal.asset.salePrice - vm.assetDisposal.netBookValue, 2);
                vm.assetDisposal.asset.disposalDate = vm.assetDisposal.asset.disposalDate.startOf('day').utc();

                if (vm.assetDisposal.asset.disposalType !== 3)
                    vm.assetDisposal.asset.deprEndDate = vm.assetDisposal.asset.deprEndDate.startOf('day').utc();

                if (vm.assetDisposal.expenseAccount)
                    vm.assetDisposal.expenseAccountId = vm.assetDisposal.expenseAccount.id;

                if (vm.assetDisposal.revenueAccount)
                    vm.assetDisposal.revenueAccountId = vm.assetDisposal.revenueAccount.id;
                if (vm.discountOnAssetForDisposal) {
                    assetService.disposeAssetWithDiscount({
                        asset: vm.assetDisposal.asset,
                        pendingDepreciation: vm.assetDisposal.pendingDepreciation,
                        netBookValue: vm.assetDisposal.netBookValue,
                        profitOrLoss: vm.assetDisposal.profitOrLoss,
                        tax: vm.assetDisposal.tax,
                        salePriceWithTax: vm.assetDisposal.salePriceWithTax,
                        expenseAccountId: vm.assetDisposal.expenseAccountId,
                        revenueAccountId: vm.assetDisposal.revenueAccountId,
                        accumulatedDepreciation: vm.assetDisposal.accumulatedDepreciation,
                        disposeAssetJvLines: vm.jv,
                        documents: vm.documents
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    assetService.disposeAsset({
                        asset: vm.assetDisposal.asset,
                        pendingDepreciation: vm.assetDisposal.pendingDepreciation,
                        netBookValue: vm.assetDisposal.netBookValue,
                        profitOrLoss: vm.assetDisposal.profitOrLoss,
                        tax: vm.assetDisposal.tax,
                        salePriceWithTax: vm.assetDisposal.salePriceWithTax,
                        expenseAccountId: vm.assetDisposal.expenseAccountId,
                        revenueAccountId: vm.assetDisposal.revenueAccountId,
                        accumulatedDepreciation: vm.assetDisposal.accumulatedDepreciation,
                        disposeAssetJvLines: vm.jv,
                        documents: vm.documents
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });

                }
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            // On Change of Account
            vm.accountChangedForTax = function (line) {

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
                        //line.contactId = null;
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
                        //line.contactShow = false;
                        // line.vehicleId = null;
                        // line.vehicle = null;
                        //line.contactId = null;
                        line.contact = null;
                        line.accountId = line.account.id;
                    }
                }

                if (line.showDate == null) {
                    line.showDate = false;
                }

                line.taxCredit = 0;
                line.taxDebit = 0;
                vm.jv.push(line);
                vm.calculateDebitCreditSum();
                //vm.sumAmount();
            };
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

            function init() {
                vm.loading = true;
                vm.disposalTypeChange(1);

                assetService.getAssetForDisposal({
                    id: assetId
                }).success(function (result) {
                    vm.assetDisposal.asset = result.asset;
                    //vm.assetDisposal.asset.disposalDate = moment().startOf('day').utc();
                    vm.assetDisposal.asset.deprEndDate = result.forSaleDate; //moment().startOf('day').utc();
                    vm.assetDisposal.forSaleDate = result.forSaleDate; //moment().startOf('day').utc();
                    vm.assetDisposal.asset.disposalType = 1;
                    vm.assetDisposal.assetDisposalPostingOptions = abp.setting.get("App.General.AssetDisposalPostingOptions");
                    getAccumulatedDepreciation(assetId);

                    if (vm.isCustomDisposalInAsset && vm.assetDisposal && vm.assetDisposal.asset && vm.assetDisposal.asset.depreciationMethodId === 100) {
                        vm.addCustomDisposalType();
                    }

                    linkedAccountService.getLinkedAccountId_for_GeneralType().success(function (result) {

                        result.forEach(function (value) {
                            if (value.generalTypeId == 17) {
                                vm.assetDisposal.expenseAccount = value.account;
                            }
                            if (value.generalTypeId == 18)
                                vm.assetDisposal.revenueAccount = value.account;
                        });
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
