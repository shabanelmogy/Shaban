// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:342572-342626
appModule.controller('tenant.views.crs.vouchers.invoices.allocationsViewModel', ['$uibModalInstance', 'invoiceId', 'abp.services.app.allocation',
        'utilities',
        function ($uibModalInstance, invoiceId, allocationService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            init();

            function init() {
                vm.loading = true;
                allocationService.getAllocations({ VoucherId: invoiceId }).success(
                    function (data) {
                        vm.allocationData = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.sumAmount = function () {
                if (!vm.allocationData)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData, function (value, key) {

                    if (value.allocatedAmount > 0)
                        amount = amount + value.allocatedAmount;
                });

                return utilities.round(amount, 2);
            };

            vm.localize = function (key) {
                if (key === null)
                    return '';
                return app.localize(key);
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

        }]);
