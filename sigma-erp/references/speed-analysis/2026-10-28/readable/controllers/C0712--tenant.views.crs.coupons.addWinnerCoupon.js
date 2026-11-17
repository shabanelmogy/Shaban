// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:185492-185536
appModule.controller('tenant.views.crs.coupons.addWinnerCoupon', [
        '$scope', '$uibModalInstance', 'abp.services.app.agreement', 'abp.services.app.luckyDraw', 'abp.services.app.coupon','couponId',
        function ($scope, $uibModalInstance, agreementService, luckyDrawAppService, couponAppService, couponId) {

            var vm = this;
            vm.saving = false;
            vm.filters = {
                coupon: vm.coupon
            };
            //vm.shoppingCouponId = shoppingCouponId;
            vm.save = function () {
                vm.saving = true;
                vm.filters.coupon = vm.coupon;
                couponAppService.addWinningCoupon(vm.filters).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.isCouponWinnerEmpty = function () {
                if (vm.coupon.winningDate) {
                    return true;
                } else {
                    return false;
                }
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

          
            function init() {
                couponAppService.getCouponForAddWinner({
                    id: couponId

                }).success(function (result) {
                    vm.loading = false;
                    vm.coupon = result;
                    
                });
            }
            init();
        }
    ]);
