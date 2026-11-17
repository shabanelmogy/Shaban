// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:268717-268777
appModule.controller('tenant.views.crs.reports.detailedVehicleUtilizationReport.vehicleUtilizationDetail', [
        '$scope', '$uibModalInstance','options',
        function ($scope, $uibModalInstance, options) {
            var vm = this;
            
            vm.data = options;
         
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.exportToExcel = function () {
                var tableId = 'tblvehicleutilizationReport';
                var tab_text = "";

                tab_text = tab_text + "<br/>" + "<table border='1px'><tr>";
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
                a.download = 'VehicleUtilizationDetail.xls';
                a.click();
            }

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
