// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:466116-466149
appModule.controller('tenant.views.stock.items.viewModal', [
        '$uibModalInstance', 'itemId', 'abp.services.app.item', 'utilities',
        function ($uibModalInstance, itemId, itemAppService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.isMinimumStockValue = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MinimumStockAlerts"));

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.item = {};

            init();

            function init() {

                if (itemId > 0) {
                    vm.loading = true;
                    itemAppService.getItem({ id: itemId })
                        .success(function (result) {
                            vm.item = result;
                            if (vm.item.model) {
                                vm.item.make = vm.item.model.make;
                            }
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            }

        }
    ]);
