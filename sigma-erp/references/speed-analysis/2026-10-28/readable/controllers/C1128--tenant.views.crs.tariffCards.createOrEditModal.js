// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:297525-297588
appModule.controller('tenant.views.crs.tariffCards.createOrEditModal', [
        '$scope', '$uibModalInstance', 'tariffCard', 'abp.services.app.tariffCard',
        function ($scope, $uibModalInstance, tariffCard, tariffCardService) {
            var vm = this;
            init();
            vm.saving = false;

            function init() {
                if (!tariffCard)
                    return;
                tariffCardService.getTariffCard({ id: tariffCard.id }).success(function (data) {
                    if (data) {
                        vm.tariffCard = data;
                    }
                }).finally(function () {
                    vm.saving = false;
                    vm.applicableForPeriodOnly = vm.tariffCard && vm.tariffCard.fromDate && vm.tariffCard.toDate ? true : false;
                    vm.ispaymentDiscount = vm.tariffCard && vm.tariffCard.discountPercentage ? true : false;

                });
            }

            //vm.tariffCard = tariffCard;

            vm.applicableForPeriodOnlyChanged = function () {
                if (!vm.applicableForPeriodOnly) {
                    vm.tariffCard.fromDate = null;
                    vm.tariffCard.toDate = null;
                }
            };

            vm.paymentDiscountOnDefaultPeriodChanged = function () {
                if (!vm.ispaymentDiscount) {
                    vm.tariffCard.discountPercentage = null;
                }
            };

            vm.save = function () {
                vm.saving = true;
                if (vm.applicableForPeriodOnly && (vm.tariffCard.fromDate > vm.tariffCard.toDate)) {
                    vm.saving = false;
                    abp.message.info("To Date Can Not be Less Than From Date");
                    return;
                }
                if (vm.applicableForPeriodOnly) {
                    //vm.tariffCard.fromDate = vm.tariffCard.fromDate.startOf('day');
                    //vm.tariffCard.toDate = vm.tariffCard.toDate.endOf('day');
                    vm.tariffCard.fromDate = moment(vm.tariffCard.fromDate).set('second', 00).set('millisecond', 00);
                    vm.tariffCard.toDate = moment(vm.tariffCard.toDate).set('second', 59).set('millisecond', 997);
                }

                tariffCardService.createOrUpdateTariffCard(vm.tariffCard).success(function (data) {
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }
    ]);
