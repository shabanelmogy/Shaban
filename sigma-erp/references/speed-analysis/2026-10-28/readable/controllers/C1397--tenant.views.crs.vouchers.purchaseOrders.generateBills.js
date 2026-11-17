// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:380802-380992
appModule.controller('tenant.views.crs.vouchers.purchaseOrders.generateBills', [
         '$uibModal', '$uibModalInstance', 'filters',  'utilities', 'abp.services.app.account', 'abp.services.app.purchaseOrder', 'abp.services.app.directory', 'abp.services.app.bill', 'utilities',
        function ( $uibModal, $uibModalInstance, filters, utilities, accountService, purchaseOrdersService, directoryService,  billService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.isGenerated = true;
            vm.hideGenerate = false;
            var billsToGenerate = [];
            var tikCount = 0;
            vm.generatedbillCount = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
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
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.roundAmount = function (amount) {
                return utilities.round(amount, 2);
            }
            vm.getPurchaseOrders = function () {

                vm.loading = true;

                if (!filters.enableDateRange) {
                    filters.fromDate = null;
                    filters.toDate = null;
                }
                if (filters.vehicle != null) {
                    filters.vehicleId = filters.vehicle.id;
                }
                var previousbillStatus = filters.billStatus;
                filters.billStatus = 3;
                filters.paginate = false;
                purchaseOrdersService.getPurchaseOrders(filters).success(function (data) {
                    
                    vm.totalItems = data.totalCount;
                    vm.dueBills = data.items;
                    filters.billStatus = previousbillStatus;
                    filters.paginate = true;
                }).finally(function () {
                    vm.loading = false;
                });
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
                if (vm.dueBills == null) return;

                angular.forEach(vm.dueBills, function (billDue) {
                    

                    billDue.generate = vm.all;
                    if (billDue.generate) {
                        tikCount++;
                    } else
                    {
                        tikCount--;
                    }
                        
                });
                if (tikCount > 0) {
                    vm.isGenerated = false;
                } else {
                    vm.isGenerated = true;
                }
                    
                    
            };
            vm.boxTicked = function (row)
            {
                if (row.generate) {
                    tikCount++;
                    if (tikCount > 0)
                        vm.isGenerated = false;
                    
                } else
                {
                    tikCount--;
                    if (tikCount < 1)
                        vm.isGenerated = true;
                    
                }
                
            }
            vm.cancel = function () {
                $uibModalInstance.close();
            };
            
            vm.save = function (bill) {
                var voucherLines = [];
                bill.contactId = bill.contact.id;
                

                vm.saving = true;

                bill.voucherLines.forEach(function (value) {
                    if (!value.hidden) {

                        if (value.fromDate != null) value.fromDate = moment(value.fromDate).startOf('day');
                        if (value.toDate != null) value.toDate = moment(value.toDate).startOf('day');
                        value.accountId = vm.account.id;
                        value.id = null;
                        value.fromDate = bill.fromDate;
                        value.toDate = bill.fromDate;
                        value.voucherId = null;
                        voucherLines.push(value);
                    }
                });
                bill.voucherLines = voucherLines;
                if (bill.id)
                    bill.parentVoucherId = bill.id;
                
                vm.paymentPlan = null;
                bill.fromDate = vm.billDate;
                bill.date = vm.billDate;
                bill.id = null;
                bill.voucherSubTypeId = 41;
                
                billService.createBillForPo({ bill: bill, paymentPlan: vm.paymentPlan }).success(function (result) {
                    bill.createdStatus = result;
                    if (result == 'Done')
                        vm.generatedbillCount++;
                    
                   
                }).finally(function () {
                    if (billsToGenerate.length > 0) {
                        var poped = billsToGenerate.pop();
                        vm.save(poped);
                    }
                    vm.saving = false;
                    vm.isGenerated = true;
                    
                });
            };

            vm.generate = function () {

                vm.hideGenerate = true;
                var i = 1;

                angular.forEach(vm.dueBills, function (billDue) {
                    if (billDue.generate == true && billDue.createdStatus != 'Done') {
                        
                        billsToGenerate.push(billDue);
                    }
                });
                var poped = billsToGenerate.pop();
                vm.save(poped);

                if (billsToGenerate.length == 0) {
                    vm.saving = false;
                    return;
                }
                
            };
            
            vm.getPurchaseOrders();
        }
    ]);
