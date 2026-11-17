// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:159466-159526
appModule.controller('tenant.views.crs.assets.assets.depreciationDetailModal', [
        '$scope', 'abp.services.app.depreciationDetail', 'utilities', '$uibModalInstance', 'options',
        function ($scope, depreciationDetailService, utilities, $uibModalInstance, options) {
            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            vm.grandTotal = 0;

            vm.openingDep = options.openingDepreciation;

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.ConvertToNumFormate = function (number) {
                var val = vm.CurrencyFormate(parseFloat(number));
                return val;
            };
           
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
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

            vm.getlocalDateTimeShort = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM');
                }
                else {
                    return "";
                }
            };

            function init() {
                vm.loading = true;
                depreciationDetailService.getDepreciationDetailByAssetId({ id: options.assetId}).success(function (result) {
                    vm.report = result;
                    vm.grandTotal = vm.report.depreciation + vm.openingDep;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
