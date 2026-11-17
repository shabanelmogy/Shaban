// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:186045-186113
appModule.controller('tenant.views.crs.coupons.couponViewModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.coupon', 'couponId',
        function ($scope, $uibModal, $uibModalInstance, couponService, couponId) {

            var vm = this;
            vm.saving = false;
            vm.policeReportDocs = [];
            vm.canChangeCharges = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getDateLuckyDraw = function (row) {
                if (!row.startDate)
                    return "";
                else
                    return '(' + vm.getlocalDate(row.startDate) + " - " + vm.getlocalDate(row.endDate) + ')';
            };
            vm.couponTypes = [{ id: 1, name: 'Prepaid' }, { id: 2, name: 'Shopping' }];
            vm.getCouponType = function (id) {
                if (id == 1) {
                    return 'Prepaid'
                } else if (id == 2) {
                    return 'Shopping'
                }
                else {
                    return null;
                }
            };
            function init() {
                vm.loading = true;
                couponService.getCouponForEdit({
                    id: couponId

                }).success(function (result) {
                    vm.loading = false;
                    vm.coupons = result;
                    vm.isShopping = vm.coupons.type;
                    vm.coupons.type = vm.getCouponType(vm.coupons.type);
                    vm.coupons.couponDate = vm.getlocalDate(vm.coupons.couponDate);
                    vm.coupons.winningDate = vm.getlocalDate(vm.coupons.winningDate);
                    vm.coupons.luckyDraw.name = vm.coupons.luckyDraw.name + ' ' + vm.getDateLuckyDraw(vm.coupons.luckyDraw);
                });
            }

            init();
        }
    ]);
