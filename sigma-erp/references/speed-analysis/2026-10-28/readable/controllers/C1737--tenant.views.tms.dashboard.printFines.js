// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:477029-477083
appModule.controller('tenant.views.tms.dashboard.printFines', [
        '$scope', '$stateParams', 'abp.services.app.uaeFine',
        function ($scope, $stateParams, finesService) {

            var vm = this;
            vm.filters == null
            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.isEmailSent = function (value) {
                if (value) {
                    return "Yes";
                } else {
                    return "No";
                }

            };
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getFines = function () {
                //vm.loading = true;
                //if (!(vm.filters.agreementNo === null || vm.filters.agreementNo === undefined || vm.filters.agreementNo === ''))
                //    vm.filters.isPrintFinesRequest = true;
                //finesService.getFinesForTMS(vm.filters).success(function (data) {
                //    vm.fines = data;
                //}).finally(function () {
                //    vm.loading = false;

                //});

            }
            function init() {
                //vm.getFines();
                vm.fines = vm.filters;
            }
            init();
        }]);
