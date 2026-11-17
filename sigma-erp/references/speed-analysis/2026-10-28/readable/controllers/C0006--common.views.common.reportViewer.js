// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:25106-25168
appModule.controller('common.views.common.reportViewer', [
        '$scope', '$uibModalInstance', 'templateUrl', 'filters',
        function ($scope, $uibModalInstance, templateUrl, filters) {
            var vm = this;
            vm.filters = filters;            
            vm.templateUrl = templateUrl;

            vm.exportToExcelFromReport = function (tbl, reportTitle) {
                var tab_text = "<style>#" + tbl + " tr td:first-child {width: 200px;}</style>";
                tab_text += "<table border='1px'><tr>";

                var tab1 = document.getElementById(tbl); // id of table
                for (var j = 0; j < tab1.rows.length; j++) {
                    tab_text += tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text += "</table>";

                var BOM = '\uFEFF';

                var blob = new Blob([BOM + tab_text], {
                    type: "application/vnd.ms-excel;charset=utf-8"
                });

                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = reportTitle + '.xls';
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
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
