// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:263283-263486
appModule.controller('tenant.views.crs.reports.amortizationReportFY.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.amortizationReportFY', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.linkedPrepaidExpense',
        'abp.services.app.fiscalYear', '$filter',
        function ($scope, uiGridConstants, amortizationReportFYService, utilities, commonLookupService, linkedPrepaidExpenseService, fiscalYearService, $filter) {

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

            vm.getLinkedPrepaid = function($select) {
                //linkedPrepaidExpenseService.getLinkedPrepaidExpense().success(function (data) {
                //    vm.linkedPrepaid = data.items;
                //}).finally(function () {
                //    vm.loading = false;
                //});
                if ($select.search == "") { vm.linkedPrepaid = null; return null; }
                return amortizationReportFYService.searchPrepaidAccounts({ filter: $select.search }).then(function (result) {
                    vm.linkedPrepaidAccounts = result.data.items;
                });
            }
 
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
                var tab1 = document.getElementById('tblAmortizationReportFY'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'amortizationReportFY.xls';
                a.click();









                //var tab_text = "<table border='1px'><tr>";
                //var textRange; var j = 0;
                //tab = document.getElementById(tableID); // id of table

                //for (j = 0 ; j < tab.rows.length ; j++) {

                //    tab_text = tab_text;

                //    tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
                //}

                //tab_text = tab_text + "</table>";

                //var ua = window.navigator.userAgent;
                //var msie = ua.indexOf("MSIE ");

                //if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                //{
                //    txtArea1.document.open("txt/html", "replace");
                //    txtArea1.document.write('sep=,\r\n' + tab_text);
                //    txtArea1.document.close();
                //    txtArea1.focus();
                //    sa = txtArea1.document.execCommand("SaveAs", true, "depreciationReportFY.xls");
                //}

                //else {
                //    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                //}

                //return (sa);
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






            vm.getAmortizationReport = function () {
                vm.loading = true;
                console.log(vm.filter);
                amortizationReportFYService.getAmortizationReportFY(vm.filter).success(function (result) {
                    vm.reportData = result;
                    vm.totalAmount = 0.0;
                    vm.totalPreviousAmount = 0.0;
                    vm.totalPendingAmount = 0.0;
                    angular.forEach(vm.reportData, function (value, index) {
                        vm.totalAmount += utilities.round(parseFloat(value.prepaidExpenseAmount), 2);
                        vm.totalPreviousAmount += utilities.round(parseFloat(value.previousAmortization), 2);
                        vm.totalPendingAmount += utilities.round(parseFloat(value.pendingAmortization), 2);
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
