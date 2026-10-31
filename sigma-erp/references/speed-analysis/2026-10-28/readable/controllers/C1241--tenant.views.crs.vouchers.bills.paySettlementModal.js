// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:327418-327468
appModule.controller('tenant.views.crs.vouchers.bills.paySettlementModal',
        ['$uibModalInstance', 'abp.services.app.paymentPlan','utilities','assetLine',
            function ($uibModalInstance, paymentPlanService, utilities, assetLine) {

                var vm = this;

                vm.loading = false;

                vm.assetLine = assetLine;
                vm.getlocalDateTime = function (date) {
                    if (date == null)
                        return "";

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                };

                vm.localize = function (string) {
                    return app.localize(string);
                };
                vm.CurrencyFormate = function (amount) {
                    if (amount == null) return null;
                    return amount.toLocaleString('en');
                };
                vm.round = function (amount) {
                    if (amount == null) return null;
                    return utilities.round(amount, 2);
                };
                

                vm.settlementAmountChanged = function () {
                    vm.assetLine.penalty = vm.round(vm.assetLine.settlementAmount - vm.assetLine.principalDue);
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.save = function () {
                    vm.loading = true;
                    paymentPlanService.settleAsset(vm.assetLine)
                        .success(function () {
                            abp.notify.success(app.localize('SuccessfullySettled'));
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.loading = false;
                        });
                };

            }
        ]);
