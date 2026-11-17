// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:162440-162642
appModule.controller('tenant.views.crs.assets.depreciation.index', [
        '$scope', 'abp.services.app.depreciation', 'utilities', 'abp.services.app.commonLookup',
        function ($scope, depreciationService, utilities, lookupService) {

            var vm = this;
            vm.depreciation = {};
            vm.depreciationData = [];
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.disableSaveButton = true;
            vm.skipCount = 0;
            var batchSize = 50;
            vm.filters = {
                rerunDepreciationForDisposedAsset: false,
                monthYear: new Date(),
                maxResultCount: batchSize
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });

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

            vm.sumAmount = function sumAmount() {
                if (vm.depreciation == null)
                    return 0;
                var sum = 0;
                for (var i = 0; i < vm.depreciation.voucherLines.length; i++) {
                    if (vm.depreciation.voucherLines[i].credit != null)
                        sum = sum + parseFloat(vm.depreciation.voucherLines[i].credit);
                }

                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.depreciation.amountInWords = utilities.toWords(sum);
                } else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.depreciation.amountInWords = '';
                }

                vm.depreciation.amount = sum;
                return sum;
            };

            vm.save = function () {
                vm.saving = true;
                vm.depreciation.date = vm.deprEndDate;
                vm.depreciation.fromDate = vm.deprStartDate;
                vm.depreciation.toDate = vm.deprEndDate;
                vm.depreciation.rerunDepreciationForDisposedAsset = vm.filters.rerunDepreciationForDisposedAsset;
                //moment(vm.filters.monthYear).endOf('month').startOf('day').utc();
                vm.depreciation.voucherLines = vm.depreciationData;
                vm.sumAmount();
                depreciationService.createDepreciation({ depreciation: vm.depreciation }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.disableSaveButton = true;

                }).finally(function () {

                    vm.saving = false;
                    vm.disableSaveButton = true;
                });
            };


            vm.exportToExcelMethod = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('depreciationData'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);
                // New Code 
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'DepreciationDetail.xls';
                a.click();
                //vm.loading = true;
                //vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').utc();
                //vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').startOf('day').utc();
                //depreciationService.exportToExcel(vm.filters).success(function (data) {
                //    app.downloadTempFile(data);
                //}).finally(function () {
                //    vm.loading = false;
                //});
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



            vm.getDepreciation = function () {

                vm.loading = true;
                vm.rerunDepreciationForDisposedAssetLoading = true

                //if first batch to be prepared then reset list to empty
                if (vm.skipCount == 0)
                    vm.depreciationData = [];

                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').utc();
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').startOf('day').utc();
                vm.filters.skipCount = vm.skipCount;

                depreciationService.prepareDepreciation(vm.filters).success(function (data) {

                    vm.totalAssetCount = data.totalCount;

                    data.depreciationList.forEach(function (value) {
                        vm.depreciationData.push(value);
                    });

                    vm.skipCount = vm.skipCount + batchSize;

                    if (vm.skipCount < vm.totalAssetCount)
                        vm.getDepreciation();
                    else {
                        vm.fyStartDate = data.fyStartDate;
                        vm.deprStartDate = data.deprStartDate;
                        vm.deprEndDate = data.deprEndDate;
                        vm.sumDepreValue = 0.0;

                        vm.loading = false;
                        vm.rerunDepreciationForDisposedAssetLoading = false;
                        vm.disableSaveButton = false;

                        vm.skipCount = 0;

                        angular.forEach(vm.depreciationData, function (row, key) {
                            row.credit = utilities.round(row.credit, 2);
                            vm.sumDepreValue += row.credit;
                            row.asset.annualDeprPercentage = utilities.round(row.asset.annualDeprPercentage, 2);
                        });
                        vm.sumDepreValue = utilities.round(vm.sumDepreValue, 2);
                    }

                    //angular.forEach(vm.depreciationData, function (row, key) {
                    //    row.credit = utilities.round(row.credit, 2);
                    //    vm.sumDepreValue += row.credit;
                    //    row.asset.annualDeprPercentage = utilities.round(row.asset.annualDeprPercentage, 2);
                    //});
                    //vm.sumDepreValue = utilities.round(vm.sumDepreValue, 2);

                }).finally(function () {
                    //vm.loading = false;
                });
            };

            vm.calculationDetail = function (depreciationRow) {
                abp.message.info(depreciationRow.calculationDetail, 'Calculation Detail');
            };
            function init() {
            }

            init();
        }]);
