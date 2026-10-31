// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:316574-316624
appModule.controller('tenant.views.crs.vehicles.viewServicesLogModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleServiceLog', 'vehicleServiceLogId',
    function ($scope, $uibModal, $uibModalInstance, vehicleServiceLogService,vehicleServiceLogId) {

        var vm = this;
        vm.serviceItems = [];
        vm.service = null;

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            }
            else {
                return "";
            }
        };
        vm.viewService = function (vehicleServiceId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vehicles/viewServicesModal.cshtml',
                controller: 'tenant.views.crs.vehicles.viewServicesModal as vm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    vehicleServiceId: function () {
                        return vehicleServiceId;
                    }
                }
            });
        };

        function init() {
            vm.loading = true;
            vehicleServiceLogService.getServiceLogForView({ id: vehicleServiceLogId })
            .success(function (result) {
                vm.data = result;
                vm.loading = false;
            })
            .error(function () {
                vm.loading = false;
            });
        }

        init();
    }
    ]);
