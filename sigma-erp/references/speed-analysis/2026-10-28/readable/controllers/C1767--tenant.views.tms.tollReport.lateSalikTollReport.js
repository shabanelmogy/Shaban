// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:482990-483165
appModule.controller('tenant.views.tms.tollReport.lateSalikTollReport', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.toll','abp.services.app.salikAccount',
        function ($scope, $uibModal, uiGridConstants, tollsService, salikAccountService) {
            var vm = this;

            vm.lateTolls = [];

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
                lateThenDays: 3,
                dateTimeOffset: dateTimeOffset,
            };

            function getFiltersDateForSAF() {
                vm.filters.fromDate = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(moment().format('YYYY-MM-DD HH:mm')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.filters.fromTime = moment(new Date()).startOf('day').utc();
                vm.filters.toTime = moment(new Date()).endOf('day').utc();
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

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
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
                a.download = 'LateTollsReport.xls';
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

            vm.getLateSalikTollReport = function () {
                if (vm.filters.lateThenDays > 0) {
                    vm.loading = true;
                    const fromDate = moment(vm.filters.fromDate).utc().format('YYYY-MM-DD');
                    const toDate = moment(vm.filters.toDate).utc().format('YYYY-MM-DD');
                    tollsService.getLateSalikTollReport({
                        fromDate: fromDate,
                        toDate: toDate,
                        lateThenDays: vm.filters.lateThenDays,
                    }).success(res => {
                        vm.lateTolls = res;
                    }).finally(() => {
                        vm.loading = false;
                    });
                }
                else {
                    alert('Late Days should be greater then zero.');
                }
            }

            vm.isExportToExcel = () => {
                return abp.auth.isGranted('Pages.TMS.Late.Salik.Tolls.TollsReport.ExportToExcel');
            }

            function init() {
                getFiltersDateForSAF();
            }


            init();
        }
    ]);
