// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:270402-270658
appModule.controller('tenant.views.crs.reports.finesReport.externalVehiclesFine', [
        '$scope', '$q', 'abp.services.app.vehicle', 'abp.services.app.uaeFine', 'abp.services.app.directory','utilities',
        function ($scope, $q, vehicleService, uaeFineService, directoryService, utilities) {
            var vm = this;
            vm.allSelected = false;
            vm.fines = [];
            vm.suppliers = [];

            vm.externalVehicles = [];

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' HH:mm';

            var now = new Date();
            var dateTimeOffset = (now.getTimezoneOffset() * 60000);

            vm.filters = {
                enableDateRange: true,
                fromDate: null,
                toDate: null,
                selectedVehicle: '',
                dateTimeOffset: dateTimeOffset,
                selectedSupplier: null
            };

            function getFiltersDateForSAF() {

                vm.filters.fromDate = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(moment().format('YYYY-MM-DD HH:mm')).add(1, 'days').add(-1, 'milliseconds').utc();
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(-1, 'milliseconds').utc()
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };


            vm.CurrencyFormate = function (amount) {
                if (amount === null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.exportToCsv = function () {
                vm.loading = true;
                tollsService.exportToCsvCustom(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getDateFormat = function (date) {
                if (date !== null) {
                    return moment.utc(date).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.selectedCount = function () { return vm.fines.filter(x => x.selected).length; };

            vm.selectAll = function () {
                if (vm.allSelected) {
                    if (vm.fines)
                        for (let i in vm.fines) {
                            vm.fines[i].selected = true;

                        }
                }
                else {
                    if (vm.fines)
                        for (let i in vm.fines) {
                            vm.fines[i].selected = false;
                        }
                }
            };

            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3, }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.selectExternalVehicles = function () {
                if (vm.filters.selectedSupplier.id > 0)
                    vehicleService.getExternalOnFleetVehiclesBySupplierForDropdown({ id: vm.filters.selectedSupplier.id })
                        .success((response) => {
                            const vehiclesOnSupplier = response;
                            vm.filters.selectedVehicles = vehiclesOnSupplier;

                        })
                        .finally(() => { });
            }

            vm.exportToExcel = function () {
                vm.loading = true;
                var tab_text = "<table border='1px'><tr>";
                var tab1 = document.getElementById('ReportTable'); // id of table
                for (let j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'ExternalVehiclesFineReport.xls';
                a.click();
                vm.loading = false;

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

            vm.getExternalVehiclesFineReport = function () {

                vm.loading = true;
                vm.fines = [];

                const fromDate = moment(vm.filters.fromDate).startOf('day');
                const toDate = moment(vm.filters.toDate).endOf('day');

                const input = {
                    fromDate: fromDate,
                    toDate: toDate,
                    plateNo: ''
                };

                const promiselist = [];
                for (var i = 0; i < vm.filters.selectedVehicles.length; i++) {
                    input.plateNo = vm.filters.selectedVehicles[i].plateNo;
                    promiselist.push(new Promise((resolve, reject) => {
                        uaeFineService.externalVehicleFinesReport2(input).success(resolve).catch(reject);
                    }));
                }

                $q.all(promiselist).then((values) => {
                    for (var i = 0; i < values.length; i++) {
                        vm.fines = $.merge(vm.fines, values[i]);
                    }
                    vm.loading = false;
                });
            }

            vm.saveSelectedFines = function () {
                if (vm.fines) {
                    debugger;
                    vm.loading = true;

                    let selectedFines = vm.fines.filter(t => t.selected);
                    for (let i = 0; i < selectedFines.length; i++) {
                        selectedFines[i].vehicleId = vm.filters.selectedVehicles.find(x => x.plateNo.indexOf(selectedFines[i].plateInfo) > -1).id;
                    }

                    uaeFineService.saveExternalFines(selectedFines)
                        .success((res) => {
                            vm.disabledSavedBtn = false;
                            abp.message.success('Successfully saved fines', `Successfully saved ${vm.selectedFinesCount()} fines.`);
                            vm.fines = null;
                            vm.allSelected = false;
                        })
                        .catch(e => abp.notify.error(e))
                        .finally(() => vm.loading = false);
                }
            }

            vm.selectedFinesCount = function () {
                if (vm.fines) {
                    return vm.fines.filter(t => t.selected).length;
                }
                return 0;
            }

            vm.isExportToExcel = () => {
                return abp.auth.isGranted('');
            }

            function init() {
                debugger;
                getFiltersDateForSAF();
                vehicleService.getExternalVehicleForDropdown({ id: null })
                    .success(res => {
                        vm.externalVehicles = res;
                    });
            }

            init();
        }
    ]);
