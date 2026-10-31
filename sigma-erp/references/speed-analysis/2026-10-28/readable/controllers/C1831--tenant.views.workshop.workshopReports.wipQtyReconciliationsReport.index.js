// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:498680-498779
appModule.controller('tenant.views.workshop.workshopReports.wipQtyReconciliationsReport.index', [
        '$scope', 'utilities','abp.services.app.grn',
        function ($scope, utilities, grnService) {

            var vm = this;
            vm.loading = false;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
           
            vm.filters = {
                jobNo: '',             
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.getJobType = function (id) {
                if (id == 1)
                    return "Routine Service";
                if (id == 2)
                    return "Mechnical Service";
                if (id == 3)
                    return "Electrical Service";
                if (id == 4)
                    return "Denting And Painting";
                if (id == 5)
                    return "Accident Service";
                if (id == 6)
                    return "AC Service";
                if (id == 7)
                    return "Breakdown Service";
                if (id == 8)
                    return "Tyre Service";
                if (id == 9)
                    return "Unit Maintenance";
                if (id == 10)
                    return "Unit Repair";
                if (id == 11)
                    return "Regular Lubrications";
            };
            vm.getWipQtyReport = function () {
                vm.loading = true;

              grnService.getWipQtyReconciliationsReport(vm.filters).success(function (result) {
                    vm.reportData = result;

                }).finally(function () {
                        vm.loading = false;
                });

            };

            vm.exportToExcel = function (tableId) {
                var tab_text = "<table border='1px'><tr>";
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
                a.download = 'WipQtyReconciliationsReport.xls';
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

            function init() {
                vm.getWipQtyReport();
            }

            init();
        }
    ]);
