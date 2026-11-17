// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:287333-287572
appModule.controller('tenant.views.crs.reports.vehiclePriceBaseOnTariffGroup.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'utilities', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, uiGridConstants, vehiclesProfitAndLoss, vehicleService, vehicleModelService, utilities, lookupService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.models = null;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.selectedVehicle = null;

            vm.profitLoss = {
                vehicleId: null,
                ownership: 1,
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
            vm.reportModal = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/vehiclePriceBaseOnTariffGroup/report.cshtml';
                        },
                        filters: function () {
                            return vm.profitLoss;
                        }
                    }
                });
            };

            

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ includeDefleeted: false, plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.clearVehicle = function () {
                vm.profitLoss.vehicle = null;
                vm.profitLoss.vehicleId = null;
                vm.makeAndModel = null;

                vm.getVehiclesTariffGroupReport();
            };
            vm.searchModel = function ($select) {
                vm.profitLoss.name = $select.search;
                if (vm.profitLoss.name == '')
                    vm.profitLoss.name = "~";  //to avoid default suggestions

                return vehicleModelService.searchPreUsedVehicleModels(vm.profitLoss).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            function getTariffGroups() {
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };
            //Make/Model
            vm.clearModel = function () {
                vm.profitLoss.model = null;
                vm.profitLoss.modelId = null;
                /*vm.filters.modelId = null;*/
            };

            vm.getMakeAndModel = function () {
                vm.getVehiclesTariffGroupReport();
                if (vm.profitLoss.vehicle)
                    vm.makeAndModel = vm.profitLoss.vehicle.make + " " + vm.profitLoss.vehicle.model;
            };
            vm.vehicleOwnerships = [
                { name: "Own", id: 1 },
                { name: "External", id: 2 },
                // { name: "BuyBack", id: 3 },
                { name: "TempExternal", id: 4 }
            ];

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffGroup: function () {
                            return null;
                        },
                        options: function () {
                            return { fromDateTime: null, toDateTime: null, allSelectable: true }
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.profitLoss.vehicle = result;
                        //   vm.vehicleSelected();
                    }
                });
            }

            vm.permissions = {
                detail: abp.auth.hasPermission('Pages.Tenant.Reports.VehiclePriceBaseOnTariffGroup.Detail'),
            };
            

            vm.getVehiclesTariffGroupReport = function () {
                vm.loading = true;
                debugger;
                if (vm.profitLoss.vehicle)
                    vm.profitLoss.vehicleId = vm.profitLoss.vehicle.id;
                if (vm.profitLoss.model)
                    vm.profitLoss.modelId = vm.profitLoss.model.id;

                vehiclesProfitAndLoss.getVehiclesTariffGroupReport({
                    vehicleId: vm.profitLoss.vehicleId,
                    tariffGroupId: vm.profitLoss.tariffGroupId,
                    modelId: vm.profitLoss.modelId
                }).success(function (data) {
                    vm.report = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('salesTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'ReportByTariffGroup.xls';
                a.click();

            };

            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }




            vm.vehiclesPricebaseOnTarrifGroupExportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vehiclesProfitAndLoss.vehiclesRevenueReportExportToExcel(vm.profitLoss)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            getTariffGroups();
        }
    ]);
