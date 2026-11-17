// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272783-272868
appModule.controller('tenant.views.crs.reports.higherCategoryVehiceReplacementHistoryReport.index', [
        '$scope','abp.services.app.documentsEmail',
        function ($scope, documentsEmailAppService) {

            var vm = this;
            vm.locations = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            vm.reportData = null;
            vm.filters = {};
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    console.log(date);
                    var localTime = moment.utc(date).toDate();
                    var dateTime = moment(localTime).format(vm.dateTimeFormat);
                    console.log(dateTime);
                    return dateTime;
                }
                else {
                    return "";
                }
            };

            vm.getHigherCategoryVehiceReplacementHistoryReport = function () {
                vm.loading = true;

                vm.filters.isReport = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                documentsEmailAppService.higherGroupReplacement(vm.filters).success(function (result) {
                    vm.reportData = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
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
                a.download = 'HigherCategoryVehiceReplacementHistoryReport.xls';
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
        }
    ]);
