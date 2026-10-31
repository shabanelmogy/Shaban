// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:412517-412572
appModule.controller('tenant.views.ers.timeSheet.report', ['$scope', 'abp.services.app.equipmentTimeSheet', '$stateParams',
        function ($scope, timeSheetService, $stateParams) {

            var vm = this;
            //vm.reportData = [];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
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
            //vm.getAgreementType = function (id) {
            //    if (id == 1)
            //        return "Daily"
            //    if (id == 2)
            //        return "Weekly"
            //    if (id == 3)
            //        return "Monthly"
            //    if (id == 4)
            //        return "Lease"
            //    if (id == 5)
            //        return "LeaseToOwn"
            //}


            function init() {

            vm.loading = true;

            if (vm.filters.locationId)
                getLocations();

                timeSheetService.getReport(vm.filters).success(function (data) {
                vm.reportData = data;
                 //   alert(JSON.stringify(vm.reportData));

            }).finally(function () {
                vm.loading = false;
            });
        };
            init();
        }]);
