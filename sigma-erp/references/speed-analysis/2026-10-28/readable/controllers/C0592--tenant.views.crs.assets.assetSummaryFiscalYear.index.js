// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:161954-162058
appModule.controller('tenant.views.crs.assets.assetSummaryFiscalYear.index', [
        '$scope', '$uibModal', 'abp.services.app.assetSummaryFiscalYear', 'abp.services.app.fiscalYear', '$filter',
        function ($scope, $uibModal, assetSummaryFiscalYearService, fiscalYearService, $filter) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.filters = {
                fiscalYear: null
            };
            vm.startDate = null;
            vm.endDate = null;

            function getFiscalYears() {
                fiscalYearService.getFiscalYears({}).success(function (data) {
                    vm.fiscalYears = data.items;
                }).finally(function () {

                });
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('tblAssetSummaryFY'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                
                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);
              

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'AssetSummaryFiscalYear.xls';
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
            vm.getAssetSummaryFiscalYearReport = function () {
                vm.loading = true;
                assetSummaryFiscalYearService.getAssetSummaryFiscalYearReport(vm.filters.fiscalYear).success(function (result) {
                  
                    vm.report = result;
                    vm.startDate = vm.getlocalDateTime(vm.filters.fiscalYear.startDate);
                    vm.endDate = vm.getlocalDateTime(vm.filters.fiscalYear.endDate);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            getFiscalYears();
        }
    ]);
