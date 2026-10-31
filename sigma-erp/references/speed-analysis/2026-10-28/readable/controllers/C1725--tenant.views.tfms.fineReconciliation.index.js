// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:473581-473620
appModule.controller('tenant.views.tfms.fineReconciliation.index', [
        '$scope', '$uibModal', 'abp.services.app.uaeFine', 'abp.services.app.trafficFile',
        function ($scope, $uibModal, finesService, trafficFileService) {
            var vm = this;
            vm.trafficFiles = [];

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            
            vm.search = function () {
                vm.loading = true;
                vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month');
                vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day');
                finesService.getFineReconciliation(vm.filters).success(function (data) {
                    vm.fineRecns = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            init = function() {
                vm.loading = true;
                trafficFileService.getTrafficFiles().success(function (data) {
                    vm.trafficFiles = data.items;
                }).finally(function () {
                    vm.loading = false;
                });  
            }

            init();

        }
    ]);
