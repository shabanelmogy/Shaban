// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:269239-269382
appModule.controller('tenant.views.crs.reports.driverTimeSheetReport.index', [
        '$scope', 'abp.services.app.documentsEmail', 'abp.services.app.directory', 'abp.services.app.driverTimeSheetForAgreement', 'abp.services.app.agreement',
        function ($scope, documentsEmailAppService, directoryService, driverTimeSheetAgreementService, agreementService) {

            var vm = this;
            vm.locations = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            vm.reportData = null;
            vm.filters = {};
            vm.driver = null;
            vm.reportData = null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment(moment().startOf('month').format(abp.setting.get("App.General.DateFormat"))),
                    endDate: moment(moment().endOf('month').format(abp.setting.get("App.General.DateFormat"))),
                };
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    var dateTime = moment(localTime).format(vm.dateFormat);
                    return dateTime;
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function (tableId) {
                var tab_text = "<style>#tableId tr td:first-child {width: 200px;}</style>";
                tab_text += "<table border='1px'><tr>";
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
                a.download = 'DriverTimeSheetReport.xls';
                a.click();
            };

            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.search = function () {
                if (!vm.dateRangeModel.startDate || !vm.dateRangeModel.endDate) {
                    vm.reportData = null;
                    return null;
                } else {
                    vm.loading = true;
                    return driverTimeSheetAgreementService.driverTimeSheetReport({
                        startDate: vm.dateRangeModel.startDate, endDate: vm.dateRangeModel.endDate,
                        agreementId: vm.filters.agreementId, driverType: vm.filters.driverType, driverId: vm.filters.driverId
                    })
                        .success(function (response) {
                            vm.reportData = response;
                        })
                        .finally(() => {
                            vm.loading = false;
                        });
                }
            }

            vm.searchAgreement = function ($select) {
                if ($select.search == '') return;
                agreementService.searchAgreement({ agreementNo: $select.search }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            };

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.getHoliday = function (isHoliday) {
                if (isHoliday == true) {
                    return "Yes";
                } else {
                    return "No";
                }
            };
            
            vm.dateRangeModelChanged = function () {
                vm.dateRangeModel.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.dateRangeModel.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
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

            function init() {
                initDate();
                vm.driverTypes = [
                    { key: 'none', value: null },
                    { key: 'staff', value: 2 },
                    { key: 'external', value: 5 }
                ];
            }

            init();
        }
    ]);
