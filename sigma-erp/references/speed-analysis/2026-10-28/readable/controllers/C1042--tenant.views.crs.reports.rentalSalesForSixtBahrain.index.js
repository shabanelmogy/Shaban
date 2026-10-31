// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:279048-279201
appModule.controller('tenant.views.crs.reports.rentalSalesForSixtBahrain.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'abp.services.app.commonAgreement', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'utilities', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, uiGridConstants, vehiclesProfitAndLoss, commonAgreementService, vehicleService, vehicleModelService, utilities, commonLookupService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.filters =
            {
                enableDateRange: true
            }
            vm.loading = false;
            vm.models = null;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.selectedVehicle = null;

            vm.profitLoss = {
                agreementId: null,              
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.localizeArabicUsingKey = function (input) {
                if (input == null)
                    return "";
                
                return app.localize(input + 'Lang');
            };
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ includeDefleeted: true, plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.clearVehicle = function () {
                vm.profitLoss.vehicle = null;
                vm.profitLoss.vehicleId = null;
                vm.makeAndModel = null;

                vm.getRentalSalesForSixtBahrain();
            };
            vm.searchModel = function ($select) {
                vm.profitLoss.name = $select.search;
                if (vm.profitLoss.name == '')
                    vm.profitLoss.name = "~";  //to avoid default suggestions

                return vehicleModelService.searchPreUsedVehicleModels(vm.profitLoss).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            //Make/Model
            vm.clearModel = function () {
                vm.profitLoss.model = null;
                vm.filters.modelId = null;
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.permissions = {
                detail: abp.auth.hasPermission('Pages.Tenant.Reports.RentalSalesForSixtBahrain.Detail'),
            };
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };
            vm.getlocalTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('HH:mm');
            };
            function getLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.getRentalSalesForSixtBahrain = function () {
                debugger;
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = null;
                    vm.profitLoss.toDate = null;
                }
              
                commonAgreementService.getRentalSalesForSixtBahrain(vm.profitLoss).success(function (data) {
                    //vm.gridOptions.data = data.items;
                    vm.dataList = data;
                   
                }).finally(function () {
                    vm.loading = false;
                });
            };
            
            vm.rentalSalesForSixtBahrainExportToExcel = function () {
                vm.loading = true;                         
                if (vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = null;
                    vm.profitLoss.toDate = null;
                }
             
                commonAgreementService.exportToExcelSixtBahrain(vm.profitLoss)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            getLocations();
            vm.getRentalSalesForSixtBahrain();
        }
    ]);
