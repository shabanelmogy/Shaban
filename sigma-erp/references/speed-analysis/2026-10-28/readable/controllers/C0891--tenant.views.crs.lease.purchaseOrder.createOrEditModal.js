// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:242436-242663
appModule.controller('tenant.views.crs.lease.purchaseOrder.createOrEditModal', ['$uibModal', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.directory',
'abp.services.app.billingMethod', 'abp.services.app.commonLookup', 'abp.services.app.expensePayment', 'abp.services.app.expenseType',

    function ($uibModal, $uibModalInstance, vehicleService, directoryService, billingMethodService, commonLookupService,
        expensePaymentService, expenseTypeService) {
        var vm = this;
        vm.vehicles = [];
        vm.customers = [];
        vm.billingMethods = [];
        vm.locations = [];
        vm.expenseTypes = [];
        vm.sumAmount = [];
        vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
        
        function expensePaymentLineObject() {

            var line = new Object();
            line.expenseTypeId = null;
            line.description = '';
            line.debit = null;
            line.credit = null;
            line.vehicleId = null;
            return line;
        }

        // ... Converting Amount To Amount In Words ... ///

        vm.amountMinValue = 100;
        // American Numbering System
        var th = ['', 'thousand', 'million', 'billion', 'trillion'];
        // uncomment this line for English Number System
        // var th = ['','thousand','million','milliard','billion'];
        var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

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

        //vm.sumAmount = function () {
            
        //    if (vm.expensePayment == null)
        //        return 0;

        //    if (vm.expensePayment.voucherLines == null)
        //        return 0;

        //    var sum = 0;
        //    for (var i = 0; i < vm.expensePayment.voucherLines.length; i++) {
        //        if (vm.expensePayment.voucherLines[i].debit != null)
        //            sum = sum + parseFloat(vm.expensePayment.voucherLines[i].debit);
        //    }

        //    if (sum > 0) {
        //        if (vm.autoCalculateAmountInWords=="true")
        //            vm.expensePayment.amountInWords = toWords(sum);
        //    }
        //    else {
        //        if (vm.autoCalculateAmountInWords=="true")
        //            vm.expensePayment.amountInWords = '';
        //    }

        //    vm.expensePayment.amount = sum;
        //    return sum;
        //};

        vm.searchVehicles = function ($select) {
            if ($select.search == "") { vm.vehicles = null; return null; }
            return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                vm.vehicles = response.data.items;
            });
        };

        vm.searchContact = function ($select) {
            //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
            return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                vm.customers = response.data.items;
            });
        };

        // extended search using search contact popup
        vm.searchContactPopoup = function () {
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
                    vm.expensePayment.contact = customer;
                }
            });
        };

        vm.searchVehiclePopup = function openSearchVehicleModal() {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                backdrop: 'static',
                resolve: {
                    tariffGroup: function () {
                        return null;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if (result != null) {
                    vm.expensePayment.vehicle = result;
                }
            });
        }

        function getBillingMethods() {
            vm.loading = true;
            billingMethodService.getBillingMethods({}).success(function (data) {
                vm.billingMethods = data.items;
            }).finally(function () {
                vm.loading = false;
            });
        }

        function getLocations() {

         commonLookupService.getLocations({}).success(function (data) {
                vm.locations = data.items;
            });
        }

        function getExpenses() {
            expenseTypeService.getExpenseTypes().success(function (data) {
                vm.expenseTypes = data.items;
            });

        }
        //Add row
        vm.addRow = function () {
            vm.expensePayment.voucherLines.push(expensePaymentLineObject());
        };
        //Remove row
        vm.removeRow = function (obj) {
            var index = vm.expensePayment.voucherLines.indexOf(obj);
            vm.expensePayment.voucherLines.splice(index, 1);

        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        vm.save = function () {
            
            vm.expensePayment.contactId = vm.expensePayment.contact.id;

            vm.saving = true;
            expensePaymentService.createOrUpdateExpensePayment
                ({ expensePayment: vm.expensePayment }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                })


        };
        function init() {
            getBillingMethods();
            getLocations();
            getExpenses();
            expensePaymentService.getExpensePaymentForEdit({ id: null }).success(
                   function (result) {

                       vm.expensePayment = result;
                       if (vm.expensePayment.id < 1)
                           vm.expensePayment.locationId = null;
                       if (vm.expensePayment.id > 0)
                           vm.expensePayment.billingDetail.billingMethod.name = app.localize(vm.expensePayment.billingDetail.billingMethod.name);
                       if (vm.expensePayment.voucherLines.length == 0)
                           vm.addRow();
                   });
        }


        init();


    }]);
