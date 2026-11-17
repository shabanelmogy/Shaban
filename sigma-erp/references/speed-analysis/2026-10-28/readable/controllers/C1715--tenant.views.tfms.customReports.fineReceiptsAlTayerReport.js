// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:471389-471460
appModule.controller('tenant.views.tfms.customReports.fineReceiptsAlTayerReport', [
        '$scope',  'abp.services.app.fineReceipts', 
        function ($scope, fineReceiptsService) {

            var vm = this;
            vm.fineReceipt = null;
            vm.totalAmount = 0;
            vm.totalCount = 0;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.fineReceipt = $scope.$parent.vmMain.filters;
            }

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    return moment(date).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.cancel = function () {
                $uibModalIn
                stance.dismiss();
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    return moment(date).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalTime = function (date) {
                if (date !== null) {
                    return moment(date).format("HH:mm");
                }
                else {
                    return "";
                }
            };

          

            function init() {
                vm.loading = true;
                fineReceiptsService.getFineReceiptReportForAltayer({ id: vm.fineReceipt.id }).success(function (data) {
                    debugger;
                    vm.fReceipts = data;
                    angular.forEach(vm.fReceipts, function (value) {
                        debugger;
                        vm.totalAmount += value.amount;
                    })
                }).finally(function () {
                    vm.loading = false;
                });
            };

            init();
        }]);
