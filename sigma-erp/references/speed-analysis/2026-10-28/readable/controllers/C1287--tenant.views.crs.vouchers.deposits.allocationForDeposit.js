// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:338049-338302
appModule.controller('tenant.views.crs.vouchers.deposits.allocationForDeposit', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.receipt', 'abp.services.app.agreement', 'deposit', 'abp.services.app.directory', 'abp.services.app.billingMethod', 'utilities', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.allocation', 'abp.services.app.deposit',
    function ($scope, $uibModal, $uibModalInstance, countryService, receiptService, agreementService, deposit, directoryService, billingMethodService, utilities, commonLookupService, appSession, allocationService, depositService, bankAccountService) {

        var vm = this;
        var depositId = 0;
        vm.amountRefunded = deposit.amountRefunded ? deposit.amountRefunded : 0;
        vm.saving = false;
        vm.isEditMod = false;
        vm.closedAgreements = false;
        vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts');
        vm.customers = [];
        vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
        vm.currencyCode = '';
        vm.agreements = [];
        vm.billingMethods = [];
        vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
        vm.billingDetails = [];
        vm.amountMinValue = 100;
        vm.isChequeDeposit = false;
        vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
        vm.manualReceiptNo = utilities.parseBoolean(abp.setting.get("App.General.ManualReceiptNo"));
        vm.allocationForDepositPostAllocation = utilities.parseBoolean(abp.setting.get("App.General.ReceiptPostAllocation"));
        vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
        vm.locations = [];
        vm.allocationData = null;
        vm.amountChanged = function () {
            if (vm.allocationForDeposit.amount == 0 || angular.isUndefined(vm.allocationForDeposit.amount)) {
                if (vm.autoCalculateAmountInWords == "true")
                    vm.allocationForDeposit.amountInWords = '';
                return;
            }
            if (vm.autoCalculateAmountInWords == "true")
                vm.allocationForDeposit.amountInWords = utilities.toWords(vm.amount);

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

        vm.getlocalDate = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            }
            else {
                return "";
            }
        };


        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.rounding = function (value) {
            return utilities.round(value, 2);
        };
        vm.searchCustomers = function ($select) {
            //any contact (staff, customer, supplier)
            return directoryService.search({ keyword: $select.search }).then(function (response) {
                vm.customers = response.data.items;
            });
        };


        //required only in case of Pre-Auth
        function getBillingMethods() {
            vm.loading = true;
            billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                angular.forEach(data.items,function(value){
                    if(value.type == 2)
                        vm.billingMethods.push({category:value.category,
                            name:value.name,
                            id:value.id,
                            type:value.type,
                            code:value.code
                        }); 
                });
                
                // vm.billingMethods = data.items;
            }).finally(function () {
                vm.loading = false;
            });
        };
        function getLocations() {
            commonLookupService.getLocations({}).success(function (data) {
                vm.locations = data.items;
            });
        };

   


        vm.onCustomerSelect = function (customer) {

            vm.allocationForDeposit.contactId = customer.id;
            vm.allocationForDeposit.contact = customer;

            getAllocationData();
        };
        
        vm.sumAmount = function () {
            if (vm.allocationData == null)
                return 0;

            if (vm.allocationData.allocations.length == 0)
                return 0;

            vm.amount = 0;
            angular.forEach(vm.allocationData.allocations, function (value, key) {
                if (value.allocatedNow > 0)
                    vm.amount = vm.amount + value.allocatedNow;
            });

            return vm.rounding(vm.amount);
        };


        //all contacts customers, suppliers, staff
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
                        return null;
                    }
                }
            }).result.then(function (result) {
                if (result != null) {

                    vm.onCustomerSelect(result);
                }
            });
        };
        function getSettledAmount() {
            vm.loading = true;

            depositService.getAllocatedAmountOnDeposit(depositId)
                .success(function (result) {
                    vm.previousSettledAmount = result;
                    vm.totalAmount = vm.allocationForDeposit.amount;
                    vm.availableAmount = vm.rounding(vm.allocationForDeposit.amount - vm.previousSettledAmount - vm.amountRefunded);
                    vm.allocationForDeposit.amount = vm.availableAmount;
                }).finally(function () {
                    vm.loading = false;
                });
        }
        function init() {
            
            vm.allocationForDeposit = angular.copy(deposit);
            vm.isChequeDeposit = vm.allocationForDeposit.voucherSubTypeId == 12 && vm.allocationForDeposit.billingDetail.chequeId != null;
            vm.allocationForDeposit.notes = 'On Deposit No : ' + vm.allocationForDeposit.voucherNo;
            vm.allocationForDeposit.billingDetailId = null;

            if (vm.allocationForDeposit.voucherSubTypeId == 11) {
                vm.allocationForDeposit.billingDetail.id = null;
                vm.allocationForDeposit.billingDetail.creditCard.transactionNo = '';
            }
            else
                vm.allocationForDeposit.billingDetail = null;
            
            depositId = vm.allocationForDeposit.id;
            vm.allocationForDeposit.parentVoucherId = depositId;
            getSettledAmount();
            if (vm.isMultiCurrencyEnabled) {
                
                if (vm.allocationForDeposit.currency) {
                    vm.currencyCode = vm.allocationForDeposit.currency.code;
                }
                else {
                    vm.currencyCode = vm.defaultCurrencyCode;
                }
            }
            vm.allocationForDeposit.id = null;
            vm.allocationForDeposit.voucherType = null;
            vm.allocationForDeposit.toDate = null;   
            vm.allocationForDeposit.date = moment();
        }
        vm.save = function () {


            var dateUsedDeposit = new Date(vm.allocationForDeposit.date);
            dateUsedDeposit.setHours(0);
            dateUsedDeposit.setMinutes(0);
            dateUsedDeposit.setSeconds(0);
            vm.allocationForDeposit.date = dateUsedDeposit;
            vm.allocationForDeposit.voucherNo = null;
            vm.allocationForDeposit.amount = vm.amount;
            vm.saving = true;
            
       
            
            vm.amountChanged();
            var allocations = [];
            angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                allocations.push({
                    id: allocation.allocationId,
                    allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                    allocatedToVoucherLineId: allocation.voucherLineId,
                    amount: allocation.allocatedNow
                });
            });
            var depositAllocations = {
                allocations: allocations
            };
            vm.allocationForDeposit.depositUsedAllocations= depositAllocations;
            depositService.useDepositWithAllocations(vm.allocationForDeposit)
                .success(function(data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function() {
                    vm.saving = false;
                });


        };
        function getBankAccounts() {
            commonLookupService.getBankAccountsForSelection().success(function (data) {
                vm.bankAccounts = data.items;
            });
        };
        function getAllocatedToDeposit() {
            
            allocationService.getAllocationsForEdit({ /*agreementId: vm.allocationForDeposit.agreementId ,*/ contactId : vm.allocationForDeposit.contactId, voucherCategory:'Creditor'}).success(
                function (data) {
                    vm.allocationData = data;
                });
        }
        function initializeFilters() {
            getBillingMethods();
            getLocations();
            getBankAccounts();
            getAllocatedToDeposit();
        }

        init();
        initializeFilters();
    }
    ]);
