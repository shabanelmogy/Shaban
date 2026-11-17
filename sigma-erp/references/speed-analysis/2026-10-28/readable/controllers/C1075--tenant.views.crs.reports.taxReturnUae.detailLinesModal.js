// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:285244-285357
appModule.controller('tenant.views.crs.reports.taxReturnUae.detailLinesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.limoTrip', 'options', 'utilities',
    function ($scope, $uibModal, $uibModalInstance, limoTripsService, options, utilities) {

        var vm = this;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat;
        vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
        vm.showSupplierBillNo = options.showSupplierBillNo;
        vm.showBranchColumnInTaxReturnReport = abp.setting.getBoolean("App.Speed.Common.ShowBranchColumnInTaxReturnReport");

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


        vm.CurrencyFormate = function (amount) {
            if (amount == null) return null;
            return amount.toLocaleString('en');
        };

        vm.roundingforView = function (value) {
            var roundedValue = utilities.roundforView(value, 2);
            return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

            //var ua = window.navigator.userAgent;
            //var msie = ua.indexOf("MSIE ");

            //if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

            //{
            //    txtArea1.document.open("txt/html", "replace");
            //    txtArea1.document.write('sep=,\r\n' + tab_text);
            //    txtArea1.document.close();
            //    txtArea1.focus();
            //    sa = txtArea1.document.execCommand("SaveAs", true, "trialBalance.xls");
            //}

            //else {
            //    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
            //}
            var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
            var blobUrl = URL.createObjectURL(blob);
            //document.querySelector('a').setAttribute('href', blobUrl);
            //window.open(blobUrl, "_blank");
            // window.location = blobUrl;
            //sa = window.open('data:application/vnd.ms-excel,' + blobUrl);
            //return (sa);
           
             // New Code 

            var a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'TaxReturnDetail.xls';
            a.click();
           
        };
        
        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];
            byteArrays.push(new Uint8Array([0xEF, 0xBB, 0xBF]));
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: "text/plain;charset=utf-8" });
            return blob;
        }
        function init() {
            vm.loading = true; 
            vm.detailLines = options.detailLines;
            vm.loading = false;
        }
        init();
    }
    ]);
