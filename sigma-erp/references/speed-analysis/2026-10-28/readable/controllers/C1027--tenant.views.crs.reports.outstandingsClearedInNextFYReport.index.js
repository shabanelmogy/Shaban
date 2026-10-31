// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:275072-275220
appModule.controller('tenant.views.crs.reports.outstandingsClearedInNextFYReport.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.outstandingsClearedInNextFYReport', 'utilities',
        'abp.services.app.fiscalYear', '$filter',
        function ($scope, uiGridConstants, outstandingsClearedInNextFYReportService, utilities, fiscalYearService, $filter) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filter = {
                fiscalYear: null,
                prepaidAccountId: null,
                prepaidAccount: null,
                account: null
            };
            vm.linkedPrepaidAccounts = [];
            vm.reportData = null;

            function getFiscalYears() {
                fiscalYearService.getFiscalYears({}).success(function (data) {
                    vm.fiscalYears = data.items;
                }).finally(function () {

                });
            };
 
            vm.getPerColumTotal = function (data, obj) {
                var sum = 0.0;
                data.forEach(function (value) {
                    if (obj) {
                        var foundLines = $filter('filter')(value.monthsData, {
                            monthDate: obj.monthDate,
                        }, true);
                        sum = sum + foundLines[0].debit;
                    }
                });
                return vm.CurrencyFormate(sum);

            };

            vm.getMonth = function (date) {
                if (date != null) {
                    // var localTime = moment.utc(date).toDate();
                    return moment(date).format("MMM-YY");
                }
                else {
                    return "";
                }
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.exportToExcelMethod = function (tableID) {

                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('tblReportFY'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Prev FY Outstandings Cleared In Next FY Report.xls';
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






            vm.getReport = function () {
                vm.loading = true;
                console.log(vm.filter);
                outstandingsClearedInNextFYReportService.getOutstandingsClearedInNextFYReport(vm.filter).success(function (result) {
                    vm.reportData = result;
                    vm.totalAllocatedAmount = 0.0;
                    angular.forEach(vm.reportData, function (value, index) {
                        vm.totalAllocatedAmount += utilities.round(parseFloat(value.allocatedAmount), 2);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                getFiscalYears();
            }

            init();
        }
    ]);
