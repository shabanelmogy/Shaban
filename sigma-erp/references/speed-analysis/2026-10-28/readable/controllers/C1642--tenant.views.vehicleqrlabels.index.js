// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:451339-451469
appModule.controller('tenant.views.vehicleqrlabels.index', [
        '$scope', 'abp.services.app.qRLabel', 'abp.services.app.location', 'abp.services.app.vehicleModel', 'abp.services.app.commonLookup' ,'abp.services.app.vehicle',
        function ($scope, qrlabelService, locationService, vehicleModelService, lookupService, vehicleService) {

            var vm = this;
            vm.labelType = 1;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.labels = null;
            vm.models = null;
            vm.filters = {
                fleetCode: null,
                location: '',
                labelType: 1,
                vehicleId: ''
            };

            vm.clearVehicle = function () {
                vm.vehicle = null;
                vm.filters.vehicleId = '';
            };
            vm.clearModel = function () {
                vm.model = null;
                vm.filters.modelId = '';
            };
            vm.getVehicles = function () {
                vm.loading = true;
                if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
                    dateRangeCheck();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                if (vm.vehicle) {
                    if (vm.vehicle.model)
                        vm.filters.modelId = vm.vehicle.model.id;
                }
                if (vm.filters.vehicleOwner != null) {
                    vm.filters.vehicleOwnerId = vm.filters.vehicleOwner.id;
                }
                if (vm.filters.ownership != 2) {
                    vm.filters.vehicleOwnerId = null;
                    vm.filters.vehicleOwner = null;
                }
                vm.filters.serverArr = [];
                if (vm.filters.statusId == 'BKD') {
                    vm.filters.dontPaginate = false;
                    vehicleService.getBookedVehicles(vm.filters).success(function (data) {
                        debugger
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                        if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate == null && !vm.dateRangeModel.startDate == null))
                            initDate();

                    }).finally(function () {
                        vm.loading = false;
                    });
                } else {
                    vehicleService.getVehicles(vm.filters).success(function (data) {

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                        if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate == null && !vm.dateRangeModel.startDate == null))
                            initDate();

                    }).finally(function () {
                        vm.loading = false;
                    });

                }
            };
            vm.searchVehicles = function ($select) {

                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.getLabels = function () {
                vm.loading = true;

                vm.filters.labelType = vm.labelType;
                if (vm.vehicle) {
                    vm.filters.vehicleId = vm.vehicle.id;
                }
                if (vm.model) {
                    vm.filters.modelId = vm.model.id;
                }
                qrlabelService.generateQRLabels(vm.filters).success(function (data) {
                    vm.labels = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchPreUsedVehicleModels(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            function getTariffGroups() {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };
            function init() {
                lookupService.getLocationsActiveAndInActive().success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
            getTariffGroups();
            vm.getVehicles();
            //vm.getLabels();
        }
    ]);
