// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:255366-255538
appModule.controller('tenant.views.crs.limousine.vehicleRevenueReport.index', [
        '$scope', 'utilities', '$uibModal', 'abp.services.app.commonLookup', 'abp.services.app.limoTrip', 'abp.services.app.vehicle', 'abp.services.app.commonLookup',
        function ($scope, utilities, $uibModal, commonLookupService, limoTripService, vehicleService, lookupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.models = null;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = {
                fromDate: null,
                toDate: null,
                vehicleId: null,
                vehicle: null
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };


            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };
            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions

                return vehicleModelService.searchPreUsedVehicleModels(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.clearModel = function () {
                vm.filters.model = null;
                vm.filters.modelId = null;
            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ includeDefleeted: true, plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            function getTariffGroups() {
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };
            vm.getMakeAndModel = function (vehicle) {
                if (vehicle != null)
                    return vehicle.model.make.name + ' ' + vehicle.model.name;
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
                            return { fromDateTime: null, toDateTime: null, selectable: true }
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.filters.vehicle = result;
                        vm.filters.vehicleId = result.id;
                    }
                });
            }
           
            vm.exportToExcel = function (tableId) {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'VehicleRevenueReport.xls';
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
            vm.getVehicleReport = function ()
            {
                vm.loading = true;
                vm.totalAmount = 0;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                return limoTripService.getVechileRevenueReport(vm.filters)
                    .then(function (response) {
                        vm.vehicleRevenue = response.data;
                        vm.totalAmount = 0;
                        angular.forEach(vm.vehicleRevenue, function (value) {
                            vm.totalAmount += value.charges;
                            
                        });
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

           
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            function init() {
                vm.getVehicleReport();
                getTariffGroups();
            }

            init();
        }
    ]);
