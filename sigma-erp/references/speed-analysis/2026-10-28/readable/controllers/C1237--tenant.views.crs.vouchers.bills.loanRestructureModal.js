// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:326953-327021
appModule.controller('tenant.views.crs.vouchers.bills.loanRestructureModal', ['$uibModalInstance', '$uibModal', 'options', 'abp.services.app.paymentPlan', 'utilities',
        function ($uibModalInstance, $uibModal, options, paymentPlanService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);
            vm.allowAssetLoanBillEdit = utilities.parseBoolean(abp.setting.get("App.General.AllowAssetLoanBillEdit"));
            vm.paymentPlanId = options.paymentPlanId;
            vm.installment = options.installment;
            vm.rate = options.rate;
            vm.bill = options.bill;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.localize = function (key) {
                return app.localize(key);
            };

            vm.round = function (value) {
                return utilities.round(value, 2);
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.settleAsset = function (assetLine) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/paySettlementModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.paySettlementModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        assetLine: function () {
                            return assetLine;
                        }
                    }
                }).result.then(function () {
                    $uibModalInstance.close(vm.paymentPlan);
                    //init();
                });
            };

            function init() {
                vm.loading = true;

                paymentPlanService.getLoanAssetsSummary({ id: options.paymentPlanId })
                    .success(function (result) {
                        vm.assetsSummary = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }]);
