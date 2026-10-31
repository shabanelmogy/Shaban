// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:244411-244533
appModule.controller('tenant.views.crs.limousine.holidayTaxiIntegrations.index', [
        '$scope', 'abp.services.app.holidayTaxi', 'abp.services.app.commonLookup',
        function ($scope, holidayTaxiService, commonLookupService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.configuration = {
                holidayTaxiTripTypeMappings: [],
                holidayTaxiVehicleTypeMappings: []
            };

            vm.locations = [];
            function getLocations() {
                commonLookupService.getLocations({
                }).success(function (data) {
                    vm.locations = data.items;
                });
            };

            vm.addTripTypeRow = function () {
                vm.configuration.holidayTaxiTripTypeMappings.push({
                    tripTypeId: null,
                    holidayTaxiTripType: ""
                });
            };

            vm.addVehicleTypeRow = function () {
                vm.configuration.holidayTaxiVehicleTypeMappings.push({
                    tariffGroupId: null,
                    holidayTaxiVehicleType: ""
                });
            };

            vm.removeTripTypeRow = function (row) {
                var index = vm.configuration.holidayTaxiTripTypeMappings.indexOf(row);
                if (index > -1) {
                    vm.configuration.holidayTaxiTripTypeMappings.splice(index, 1);
                }
            };

            vm.removeVehicleTypeRow = function (row) {
                var index = vm.configuration.holidayTaxiVehicleTypeMappings.indexOf(row);
                if (index > -1) {
                    vm.configuration.holidayTaxiVehicleTypeMappings.splice(index, 1);
                }
            };

            function getTripTypes() {
                commonLookupService.getTripTypes().success(function (data) {
                    vm.tripTypes = data.items;
                });
            }

            function getTariffGroup() {
                vm.loading = true;
                commonLookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getallsettings() {
                vm.loading = true;
                holidayTaxiService.getHolidayTaxiMappingSettings().success(function (result) {
                    vm.settings = result;

                    if (vm.settings && vm.settings.configuration) {
                        vm.configuration = vm.settings.configuration;
                    }

                    if (!vm.configuration.holidayTaxiTripTypeMappings)
                        vm.configuration.holidayTaxiTripTypeMappings = [];

                    if (!vm.configuration.holidayTaxiVehicleTypeMappings)
                        vm.configuration.holidayTaxiVehicleTypeMappings = [];

                }).finally(function () {
                    if (!vm.configuration.holidayTaxiTripTypeMappings || vm.configuration.holidayTaxiTripTypeMappings.length === 0) {
                        vm.addTripRow();
                    }

                    if (!vm.configuration.holidayTaxiVehicleTypeMappings || vm.configuration.holidayTaxiVehicleTypeMappings.length === 0) {
                        vm.addVehicleRow();
                    }
                    vm.loading = false;
                });
            }

            vm.save = function () {
                vm.saving = true;
                vm.loading = true;
                vm.settings.dataToShare = 10;
                vm.settings.sharingFormat = 0;
                vm.settings.isActive = 1;
                vm.configuration.postingStartDate = moment(vm.configuration.postingStartDate).startOf('day');
                vm.settings.configuration = vm.configuration;
                holidayTaxiService.updateAllSettings(vm.settings).success(function (result) {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    getallsettings();
                }).finally(function () {
                    vm.saving = false;
                })
            }

            function init() {
                getallsettings();
                getTripTypes();
                getTariffGroup();
                getLocations();
            }


            init();
        }
    ]);
