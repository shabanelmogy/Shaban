// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:477086-477148
appModule.controller('tenant.views.tms.dashboard.printTolls', [
        '$scope', '$stateParams', 'abp.services.app.toll',
        function ($scope, $stateParams, tollAppService) {

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

            vm.getServerName = function (server) {
                if (server == 1) {
                    return app.localize('Dubai');
                }
                else if (server == 2) {
                    return app.localize('AbuDhabi');
                }
            }

            //vm.getTolls = function (callback) {
            //    vm.loading = true;
            //    if (!(vm.filters.agreementNo === null || vm.filters.agreementNo === undefined || vm.filters.agreementNo === ''))
            //        vm.filters.isPrintTolldRequest = true;
            //    tollAppService.getTollsForTFMS(vm.filters).success(function (data) {
            //        vm.tolls = data;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}
            function getTolls() {
                //vm.getTolls();
                vm.tolls = vm.filters;
            }
            getTolls();
        }]);
