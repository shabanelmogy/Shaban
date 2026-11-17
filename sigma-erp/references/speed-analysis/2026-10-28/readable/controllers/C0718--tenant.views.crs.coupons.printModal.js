// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:186711-186779
appModule.controller('tenant.views.crs.coupons.printModal', ['$stateParams', '$scope', '$sce', '$uibModal', 'appSession', 'abp.services.app.coupon', 'abp.services.app.couponQRLabel',
        function ($stateParams, $scope, sce, $uibModal, appSession, couponAppService, couponQRLabelService) {

            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.coupon = null;
            vm.vehicleId = 0;
            vm.printHeader = true;
            vm.isLogin = true;
            vm.incrementValue = 1;
            vm.userName = appSession.user.name;

            vm.filters = {
                labelType: 1
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };

            var couponId = 0;

            if ($scope.$parent !== null) {
                if ($scope.$parent.couponId) {
                    couponId = $scope.$parent.couponId.id;
                    vm.printHeader = !($scope.$parent.couponId.printHeader);
                }
            }
            if (couponId <= 0) {
                if (!isNaN($stateParams.query)) {
                    couponId = $stateParams.query;
                }
            }
            vm.getLabels = function () {
                vm.loading = true;

                vm.filters.labelType = 1;//vm.labelType;
                if (vm.coupon) {
                    vm.filters.couponId = vm.coupon.id;
                }
                couponQRLabelService.generateCouponQRLabels(vm.filters).success(function (data) {
                    vm.labels = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.init = function () {
                vm.loading = true;
                couponAppService.getCouponForPrint({
                    id: couponId
                }).success(function (result) {
                    vm.coupon = result;
                }).finally(function () {
                    vm.loading = false;
                    //vm.getLabels();
                });
                
            };
        }
    ]);
