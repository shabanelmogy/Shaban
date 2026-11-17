// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:293904-293939
appModule.controller('tenant.views.crs.staff.report', [
        '$scope', '$stateParams', 'abp.services.app.staff', 'utilities',
        function ($scope, $stateParams, staffService, utilities) {
            var vm = this;
            vm.filters = null;

            vm.showExpiries = abp.setting.get("App.DocumentNos.ShowExpiryDateofDocumentsInStaff") === 'true';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isDesignationFeatureEnabled = abp.features.isEnabled("Core.Staff.Designations");

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function init() {
                vm.loading = true;
                staffService.getStaffReport(vm.filters).success(function (data) {
                    vm.staffReportData = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
