// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:367447-367532
appModule.controller('tenant.views.crs.vouchers.jvs.fineDetailsModel', [
        '$uibModalInstance', 'JV', 'abp.services.app.uaeFine',
    function ($uibModalInstance, JV, uaeFineService) {

        var vm = this;
        vm.fine = null;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.jv = JV;

        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        vm.exportToExcel = function (tableId) {
            var tab_text = "<table border='1px'><tr>";
            var textRange;
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
            a.download = 'FineDetail.xls';
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

        function getFine() {
            vm.loading = true;
            uaeFineService.getFineByJV({ id: JV.id }).success(function (data) {
                
                vm.fine = data;
            }).finally(function () {
                vm.loading = false;
            });
        }

        function init() {
            getFine();
        }

        init();
    }]);
