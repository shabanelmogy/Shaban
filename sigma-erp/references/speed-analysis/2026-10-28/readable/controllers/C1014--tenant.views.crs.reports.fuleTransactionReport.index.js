// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272570-272779
appModule.controller('tenant.views.crs.reports.fuleTransactionReport.index', [
        '$scope', 'abp.services.app.ePPCOImportData', 'abp.services.app.vehicle', 'utilities',
        function ($scope, eppcoImportDataService, vehicleService, utilities) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.isEnableCRS = abp.features.isEnabled("CRS");
            vm.fueltransactionReport = null;

            vm.totalAmount = 0;
            vm.totalvatAmount = 0;
            vm.totalWithoutAmount = 0;
            vm.dateRangeModel = {

            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate === undefined ? vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc() : (moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc());
                    vm.filters.toDate = vm.dateRangeModel.endDate === undefined ? vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc() : (moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc());
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.filters = {
                enableDateRange: true,
                cardNo: "",
                vehicle: null,
                status: 0,
                source: 0,
                fromDate: null,
                salesPerson: null,
                toDate: null,
                startDate: null,
                endDate: null
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment(date).utc().toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                    //return moment(moment(date).toDate()).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            function statusChanged() {
                vm.statuses = [{ id: 1, name: 'Processed' }, { id: 2, name: 'Not-Processed' }];
            }

            function sourceChanged() {
                vm.sources = [{ id: 1, name: 'Eppco Enoc' }, { id: 2, name: 'Eppco VIP' }];
            }

            vm.searchVehicles = function ($select) {
                if ($select.search === "") {
                    vm.vehicles = null; return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };

            vm.CurrencyFormate = function (amount) {
                if (amount === null) return null;
                return amount.toLocaleString('en');
            };

            vm.getFueltransactionReport = function () {
                vm.loading = true;

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel !== null ? (vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc()) : (moment(moment().format('YYYY-MM-DD')).utc());
                    vm.filters.toDate = vm.dateRangeModel !== null ? (vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()) : (moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc());
                }

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                if (vm.filters.startDate > vm.filters.endDate) return;

                if (vm.filters.vehicle !== null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                eppcoImportDataService.fuelTransactionReport(vm.filters).success(function (data) {

                    if (vm.dateRangeModel.startDate === null && vm.dateRangeModel.endDate === null)
                        initDate();

                    vm.fileReaderDataResponse = data;

                    vm.totalAmount = 0;
                    vm.totalvatAmount = 0;
                    vm.totalWithoutAmount = 0;
                    angular.forEach(vm.fileReaderDataResponse, function (value) {
                        vm.totalAmount += value.amount;
                        vm.totalvatAmount += value.vatRate;
                        vm.totalWithoutAmount += value.amountWithoutVat;
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            };




            vm.exportToExcel = function (exportTable) {
                var tab_text = "<style>#exportTable tr td:first-child {width: 200px;}</style>";
                tab_text += "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById(exportTable); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Fuel Transaction Report.xls';
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

            //initDate();
            //vm.dateRangeModelChange();
            //vm.dateRangeCheck();
            statusChanged();
            sourceChanged();
            //vm.getFueltransactionReport();
        }
    ]);
