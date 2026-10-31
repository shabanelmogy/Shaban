// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:465557-465608
appModule.controller('tenant.views.stock.itemReturns.report', ['$scope', 'abp.services.app.itemReturn', '$stateParams',
        function ($scope, itemReturnsService, $stateParams) {

            var vm = this;


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;
            if (vm.filters.voucherNo) {
                vm.filters.jobId = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

        
            function init() {

            vm.loading = true;

            if (vm.filters.locationId)
                getLocations();

                itemReturnsService.getReport(vm.filters).success(function (data) {
                   // alert(JSON.stringify(data));
                vm.reportData = data;

            }).finally(function () {
                vm.loading = false;
            });
        };
            init();
        }]);
