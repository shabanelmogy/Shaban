// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:394204-394441
appModule.controller('tenant.views.crs.vouchers.refunds.createOrEditModal', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.agreement', 'abp.services.app.rentalAgreementSearch', 'abp.services.app.commonAgreement', 'refundId', 'agreement', 'abp.services.app.directory', 'abp.services.app.billingMethod', 'abp.services.app.refund',
        function ($uibModal, $uibModalInstance, agreementService, rentalAgreementSearchService, commonAgreementService, refundId, agreement, directoryService, billingMethodService,refundService) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
        vm.closedAgreements = false;
        vm.customers = [];
        vm.agreements = [];
        vm.refund = null;
        vm.billingMethods = [];
        vm.billingDetails = [];
        vm.amountMinValue = 100;
        vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
        // American Numbering System
        var th = ['', 'thousand', 'million', 'billion', 'trillion'];
        // uncomment this line for English Number System
        // var th = ['','thousand','million','milliard','billion'];
        var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']; var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']; var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        function toWords(s) {
            s = s + '';
            s = s.replace(/[\, ]/g, '');
            if (s != parseFloat(s)) return 'not a number'; var x = s.indexOf('.');
            if (x == -1) x = s.length;
            if (x > 15) return 'too big';
            var n = s.split('');
            var str = '';
            var sk = 0;
            for (var i = 0; i < x; i++) {
                if ((x - i) % 3 == 2) {
                    if (n[i] == '1') { str += tn[Number(n[i + 1])] + ' '; i++; sk = 1; }
                    else if (n[i] != 0) {
                        str += tw[n[i] - 2] + ' ';
                        sk = 1;
                    }
                }
                else if (n[i] != 0) {
                    str += dg[n[i]] + ' ';
                    if ((x - i) % 3 == 0)
                        str += 'hundred ';
                    sk = 1;
                }
                if ((x - i) % 3 == 1) {
                    if (sk) str += th[(x - i - 1) / 3] + ' ';
                    sk = 0;
                }
            }
            if (x != s.length) {
                var y = s.length; str += 'point ';
                for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
            }
            return str.replace(/\s+/g, ' ') + 'only';
        }

        vm.amountChanged = function () {
            if (vm.refund.amount == 0 || angular.isUndefined(vm.refund.amount)) {
                if (vm.autoCalculateAmountInWords == "true")
                    vm.refund.amountInWords = '';
                return;
            }
            if (vm.autoCalculateAmountInWords == "true")
                vm.refund.amountInWords = toWords(vm.refund.amount);

        };

        vm.save = function () {

            var dateRefund = new Date(vm.refund.date);
            dateRefund.setHours(0);
            dateRefund.setMinutes(0);
            dateRefund.setSeconds(0);
            vm.refund.date = dateRefund;
            vm.saving = true;
            refundService.createOrUpdateRefund({
                refund: vm.refund,
            }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
            }
            else {
                return "";
            }
        };

        vm.getlocalDate = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD');
            }
            else {
                return "";
            }
        };


        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        vm.searchCustomers = function ($select) {
            //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
            return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                vm.customers = response.data.items;
            });
        };

        function getAgreements(customerId) {
            vm.loading = true;
            var agreement = null;

            if (vm.closedAgreements == false) {
                agreement = commonAgreementService.getOpenAgreementsOnCustomer({ id: customerId })
            }
            else {
                agreement = commonAgreementService.getClosedAgreementsOnCustomer({ id: customerId })
            }
            agreement.success(function (data) {

                vm.agreementsList = data.items;
                if (vm.agreementsList.length == 0) {
                    vm.refund.agreement = vm.agreementsList[0];
                }

            }).finally(function () {
                vm.loading = false;
            });
        };

        function getBillingMethods() {
            vm.loading = true;
            billingMethodService.getBillingMethods({}).success(function (data) {
                vm.billingMethods = data.items;
            }).finally(function () {
                vm.loading = false;
            });
        };

        vm.searchAgreements = function ($select) {
            vm.loading = true;
            rentalAgreementSearchService.searchAgreement({ agreementNo: $select.search }).success(function (data) {
                vm.agreementsList = data.items;
            }).finally(function () {
                vm.loading = false;
            });
        };

        vm.onAgreementSelect = function ($select) {
            if ($select.selected != null) {
                vm.refund.agreementId = $select.selected.id;
            }
        };

        vm.onCustomerSelect = function (customer) {
            vm.refund.contactId = customer.id;
            vm.refund.contact = customer;
            getAgreements(customer.id);
        }
        vm.onClosedAgreements = function () {
            if (vm.refund.agreement!=null)
                 vm.refund.agreement = null;
            if (vm.refund.contact != null) {
                getAgreements(vm.refund.contactId);
            }
        };
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

                    vm.onCustomerSelect(result);
                }
            });
        };

        function init() {
            refundService.getRefundForEdit({
                id: refundId
            }).success(function (result) {
                vm.refund = result;
                
                if (vm.refund.billingDetail.billingMethodId == 0)
                    vm.refund.billingDetail.billingMethodId = null;

                if (vm.refund.id > 0) {
                    vm.refund.billingDetail.billingMethod.name = app.localize(vm.refund.billingDetail.billingMethod.name);
             //   }
             //if (vm.refund.id > 0) {
                    vm.isEditMod = true;
                    vm.onCustomerSelect(vm.refund.contact);
                    if (vm.refund.agreement.status == 2)
                        vm.closedAgreements = true;
                } else {
                    vm.isEditMod = false;
                    if (agreement) {
                        vm.refund.agreementId = agreement.id;
                        vm.refund.agreement = {
                            id: agreement.id,
                            agreementNo: agreement.agreementNo,
                            locationId: agreement.locationId,
                        };
                        vm.refund.contact = agreement.customer;
                        vm.refund.contactId = agreement.customerId;
                        vm.refund.amount = (-1) * agreement.due;
                        vm.amountChanged();
                    }
                }
            });
        }

        function initializeFilters() {
            getBillingMethods();
        }

        init();
        initializeFilters();
    }
    ]);
