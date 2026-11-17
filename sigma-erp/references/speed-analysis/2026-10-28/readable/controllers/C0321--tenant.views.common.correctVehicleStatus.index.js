// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86715-86778
appModule.controller('tenant.views.common.correctVehicleStatus.index', [
        '$scope', 'abp.services.app.vehicle', 'abp.services.app.vehicleStatus', 
        function ($scope, vehicleService, vehicleStatusService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.saving = false;

            vm.vehicles = [];

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
            
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.vehicleChanged = function (id) {
                vm.loading = true;
                vehicleStatusService.getLastMovementAndSuggestedStatus({ id: id }).success
                    (function (result) {
                        vm.movementstatus = result;
                        
                    }).finally(function () {
                        vm.loading = false;
                       
                    });;
            };

            vm.convertVehicleStatus = function () {
                vm.loading = true;
                vm.saving = true;
               vehicleStatusService.convertStatus({ vehicleId: vm.vehicle.id, suggestedStatus: vm.movementstatus.suggestedStatus }).success
                   (function () {                      
                        vm.loading = false;
                        vm.saving = false;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).finally(function () {
                        vm.loading = false;
                        vm.saving = false;
                    });
            };

        }
    ]);
