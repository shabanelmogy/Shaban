// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:275419-275638
appModule.controller('tenant.views.crs.reports.parkingReport.externalVehiclesParking', [
        '$scope', 'abp.services.app.vehicle', 'abp.services.app.parkingTicket',
        function ($scope, vehicleService, parkingTicketService) {
            var vm = this;

            vm.externalVehicles = [];
            vehicleService.getVehicles({ "enableDateRange": false, "fleetCode": null, "vehicleType": null, "ownership": 2, "plateNo": "", "statusId": "", "subStatus": null, "modelId": null,"locationId": "", "status": null, "skipCount": 0, "maxResultCount": 1000, "startDate": null, "endDate": null, "serverArr": [] })
                .success(res => {
                    console.log(res);
                    vm.externalVehicles = res.items;
                });

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

            vm.exportToExcel = function () {
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
                const fromDate = moment(vm.filters.fromDate).startOf('day');
                const toDate = moment(vm.filters.toDate).endOf('day');
                const input = {
                    fromDate: fromDate,
                    toDate: toDate,
                    plateNoOrTag: vm.filters.selectedVehicle.eTag
                };

                parkingTicketService.getExternalVehiclesParkingReport(input)
                    .success(res => {
                        vm.tolls = res;
                        vm.allTollsSelected = false;
                    })
                    .finally(() => vm.loading = false);

            }

            vm.isExportToExcel = () => {
                return abp.auth.isGranted('');
            }

            vm.selectToll = function () {
                for (var i = 0; i < vm.tolls.length; i++) {
                    if (!vm.tolls[i].isChecked) {
                        vm.allTollsSelected = false;
                        return;
                    }
                }

                vm.allTollsSelected = true;
            };

            vm.selectAll = function () {
                for (var i = 0; i < vm.tolls.length; i++) {
                    vm.tolls[i].isChecked = vm.allTollsSelected;
                }
            };

            vm.selectedTollCount = function () {
                if (vm.tolls) {
                    return vm.tolls.filter(t => t.isChecked).length;
                }
                return 0;
            }

            vm.saveSelectedTolls = function () {
                if (vm.tolls) {
                    vm.loading = true;
                    let selectedTolls = vm.tolls.filter(t => t.isChecked);
                    let tollsForSave = [];
                    for (let i = 0; i < selectedTolls.length; i++) {
                        let st = selectedTolls[i];
                        tollsForSave.push({
                            ...st,
                            vehicleId: vm.filters.selectedVehicle.id
                        });
                    }
                    parkingTicketService.saveExternalParkingInBulk(tollsForSave)
                        .success((res) => {
                            abp.message.success('Successfully saved tolls', `Successfully saved ${vm.selectedTollCount()} tolls.`);
                            removeSelectedTolls();
                            vm.allTollsSelected = false;
                        })
                        .finally(() => vm.loading = false);
                }
            }

            function removeSelectedTolls() {
                if (vm.tolls) {
                    vm.tolls = vm.tolls.filter(t => !t.isChecked);
                }
            }

            function init() {
                getFiltersDateForSAF();
            }

            init();
        }
    ]);
