// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:83716-83752
appModule.controller('host.views.tenants.subscriptionLog', [
        '$scope', '$uibModal', '$uibModalInstance', 'subscription', 'abp.services.app.subscription',
        function ($scope, $uibModal, $uibModalInstance, subscription, subscriptionService) {

            var vm = this;
            vm.subscription = subscription;

            function getSubscriptionLogs() {
                vm.loading = true;
                subscriptionService.getSubscriptionLogs({ id: vm.subscription.id }).success(function (result) {
                    vm.subscriptionLogs = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY HH:mm');
                }
                else {
                    return "";
                }
            };

            vm.cancel = function () {
               
                    $uibModalInstance.dismiss();
            };

            function init() {
                getSubscriptionLogs();
            }
            init();
        }
    ]);
