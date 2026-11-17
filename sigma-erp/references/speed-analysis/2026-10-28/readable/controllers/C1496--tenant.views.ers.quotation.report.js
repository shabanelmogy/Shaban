// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:408516-408580
appModule.controller('tenant.views.ers.quotation.report', ['$scope', 'abp.services.app.quotation', '$stateParams', 'abp.services.app.commonLookup',
        function ($scope, quotationService, $stateParams, lookupService) {

            var vm = this;
            //vm.reportData = [];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            if (vm.filters.quotationNo) {
                vm.filters.status = null;
                vm.filters.customerId = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getStatus = function (code) {
                if (code === 1)
                    return "Open";
                else if (code === 2)
                    return "Approved";
                else if (code === 3)
                    return "Rejected";
                else
                    return "Open";
            };

            function init() {

                vm.loading = true;

                lookupService.getLocations()
                 .success(r => {
                      vm.locations = r.items;
                });

                quotationService.getReport(vm.filters).success(function (data) {
                vm.reportData = data;
                 //   alert(JSON.stringify(vm.reportData));

            }).finally(function () {
                vm.loading = false;
            });
        };
            init();
        }]);
