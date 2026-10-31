// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:161782-161951
appModule.controller('tenant.views.crs.assets.assetSaleReport.index', [
        '$scope','abp.services.app.asset','abp.services.app.assetSaleReport','utilities',
    function ($scope,assetService,assetSaleReportService,utilities) {
        var vm = this;
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });
        vm.loading = false;
        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.filters = {
            assetTypeId: null,
            assetNo: null,
            fromDate: null,
            toDate: null,
        };
        vm.CurrencyFormate = function (amount) {
            if (amount == null) return null;
            return amount.toLocaleString('en');
        };

        function initDate() {
            vm.dateRangeModel = {
                startDate: moment().add(-29, 'days').startOf('day'),
                endDate: moment().endOf('day')
            };
        }
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
      
        vm.getSumColumns = function (data) {
            if (data.length > 0) {
                var totalSalePrice = 0;
                var totalDepreciation = 0;
                var totalBookValue = 0;
                var totalProfitLoss = 0;
                for (var i = 0; i < data.length; i++) {
                    var record = data[i];
                    totalSalePrice += parseInt(record.salePrice);
                    totalDepreciation += parseInt(record.depreciation);
                    totalBookValue += parseInt(record.bookValue);
                    totalProfitLoss += parseInt(record.salePrice - record.bookValue);
                }
                vm.sumSalePrice = totalSalePrice;
                vm.sumDepreciation = totalDepreciation;
                vm.sumBookValue = totalBookValue;
                vm.sumProfitLoss = totalProfitLoss;
            }
            else {
                vm.sumSalePrice = 0;
                vm.sumDepreciation = 0;
                vm.sumBookValue = 0;
                vm.sumProfitLoss = 0;
            }
        };
        vm.exportToExcel = function () {
            var tab_text = "<table border='1px'><tr>";
            var textRange;
            var j = 0;
            var tab1 = document.getElementById('assetSaleReportTable'); // id of table
            for (j = 0; j < tab1.rows.length; j++) {
                tab_text = tab_text;
                tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";
            var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
            var blobUrl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'AssetSaleReport.xls';
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

        function getNetBookValue(bookValue, depression) {
            var pendingDepreciation = utilities.round(depression, 2);
            var netBookValue = utilities.round(bookValue - pendingDepreciation, 2);
            return netBookValue;
        }

        vm.CurrencyFormate = function (amount) {
            if (amount == null) return null;
            return amount.toLocaleString('en');
        };


        vm.calculateProfitLossAmount = function (data) {
            if (data == null) {
                return 0;
            } 
            else {
                if (data.bookValue != null && data.depression != null) {
                    var getNetBookValueResult = getNetBookValue(data.bookValue, data.depression);
                    if (data.salePrice > getNetBookValueResult) {
                        return utilities.round(data.salePrice - getNetBookValueResult, 2);
                    }
                    else {
                        return utilities.round(getNetBookValueResult - data.salePrice, 2);
                    }
                }
                else {
                    return 0;
                }
            }
          
        };
      
        function getAssetType() {
            vm.loading = true;
            assetService.getAssetType({}).success(function (data) {
                vm.assetTypes = data.items;
            }).finally(function () {
                vm.loading = false;
            });
        };

        vm.getAssetSaleReport = function () {
            vm.loading = true;
            vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            assetSaleReportService.getAssetForDisposal(vm.filters).success(function (data) {
                vm.reportData = data;
                vm.getSumColumns(vm.reportData);
            }).finally(
                function () {
                    vm.loading = false;
                });
        };

        function init() {
            initDate();
            getAssetType();
            vm.getAssetSaleReport();
        }

        init();
    }
    ]);
