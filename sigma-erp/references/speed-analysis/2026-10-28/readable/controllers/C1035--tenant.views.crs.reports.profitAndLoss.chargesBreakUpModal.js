// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:276913-277011
appModule.controller('tenant.views.crs.reports.profitAndLoss.chargesBreakUpModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'detailLines', 'utilities',
    function ($scope, $uibModal, $uibModalInstance, detailLines, utilities) {

        var vm = this;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat;
        vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.rounding = function (amount) {
            return utilities.round(amount, 2);
        };
        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };

        vm.getVoucherType = function (voucherType, subType) {
            return utilities.getVoucherType(voucherType, subType);
        };


        vm.CurrencyFormate = function (amount) {
            if (amount == null) return null;
            return amount.toLocaleString('en');
        };
        vm.round = function (amount) {
            if (amount == null) return null;
            return utilities.round(amount, 2);
        };

        vm.exportToExcel = function() {
            var tab_text = "<table border='1px'><tr>";
            var textRange;
            var j = 0;
            var tab1 = document.getElementById('detailLines'); // id of table
            for (j = 0; j < tab1.rows.length; j++) {

                tab_text = tab_text;
                tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";
            var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
            var blobUrl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'ChargesBreakUp.xls';
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

        vm.calculateTotalAmount = function () {
            vm.totalAmount = 0;
            vm.totalTax = 0;
            angular.forEach(vm.detailLines, function (row) {
                vm.totalAmount += row.amount;
                vm.totalTax += row.tax;
            });
        };

        function init() {
            vm.loading = true; 
            vm.detailLines = detailLines;
            vm.calculateTotalAmount();
            vm.loading = false;
        }
        init();
    }
    ]);
