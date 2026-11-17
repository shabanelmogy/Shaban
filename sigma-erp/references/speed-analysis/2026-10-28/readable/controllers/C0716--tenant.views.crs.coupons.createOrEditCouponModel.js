// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:186116-186247
appModule.controller('tenant.views.crs.coupons.createOrEditCouponModel', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.agreement', 'abp.services.app.luckyDraw', 'abp.services.app.coupon', 'agreementId',
        function ($scope, $uibModal, $uibModalInstance, directoryService, agreementService, luckyDrawAppService, couponAppService, agreementId) {

            var vm = this;
            vm.saving = false;
            vm.filters = {
                coupon: { type: agreementId ? 2 : 1, agreementId: agreementId }
            };
            if (agreementId) {
                vm.isAddNewCoupon = false;
            } else
            {
                vm.isAddNewCoupon = true;

            }
            


            //vm.shoppingCouponId = shoppingCouponId;
            vm.save = function () {
                vm.saving = true;

                debugger;
                if (agreementId) {
                    couponAppService.createOrUpdateCoupon(vm.filters).success(function () {
                        abp.notify.info(app.localize('CouponSavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    vm.filters.noOfCoupons = 1;
                    couponAppService.createOrUpdateCoupon(vm.filters).success(function () {
                        abp.notify.info(app.localize('CouponSavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });


                }
            };

            vm.isCouponDateEmpty = function () {
                if (vm.filters.coupon.couponDate) {
                    return true;
                } else {
                    return false;
                }
            };

            vm.searchContacts = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers

                //return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                //    vm.contacts = response.data.items;
                //});
                return directoryService.search({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };
            vm.searchContactsPopoup = function () {
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
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.coupon.customer = supplier;
                        vm.filters.coupon.customerId = supplier.id;
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.close();
            };

            vm.searchLuckyDraws = function ($select) {
                return luckyDrawAppService.search({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.luckyDraws = response.data;
                });
            };

            vm.clearLuckyDraw = function () {
                vm.filters.coupon.luckyDrawId = null;
                vm.filters.coupon.luckyDraw = null;
            };

            vm.getCouponForEdit = function (couponId) {
                vm.loading = true;
                

                couponAppService.getCouponForEdit({ id: couponId }).success(function (data) {

                    vm.coupon = data.totalCount;
                    vm.filters.coupon = data;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                vm.loading = true;
                vm.searchLuckyDraws('');
                if (!agreementId)
                {
                    vm.getCouponForEdit(agreementId);
                }
               
                agreementService.getAgreementWithAdvanceAndDepositForEdit({
                    id: agreementId
                }).success(function (result) {
                    vm.filters.coupon.agreement = result.agreement;
                    if (vm.filters.coupon.agreement) {
                        vm.filters.coupon.charges = result.agreement.totalCharges - result.agreement.tax;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
