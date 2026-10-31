// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:252975-253026
appModule.controller('tenant.views.crs.limousine.trips.logTripModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.limoTrip', 'options',
    function ($scope, $uibModal, $uibModalInstance, limoTripsService, options) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
        vm.tripNo = options.tripNo;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };
        function init() {
            vm.loading = true;
            limoTripsService.getTripLogs({ id: options.tripId }).success(function (result) {
                vm.tripLog = result.items;
            }).finally(function () {
                vm.loading = false;
            });
        }
        init();
        function openCreateLogModal(tripId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/limousine/trips/createLogModal.cshtml',
                controller: 'tenant.views.crs.limousine.trips.createLogModal as vm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    tripId: function () {
                        return tripId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                init();
            });
        }
        vm.createLog = function () {
            openCreateLogModal(options.tripId);
        };
    }
    ]);
