// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:292082-292146
appModule.controller('tenant.views.crs.reports.vehicleUtilizationCncReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle', 'utilities',
        function ($scope, $uibModal, uiGridConstants, vehicleService, utilities) {
            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            
            vm.loading = false;
            vm.getVehiclesSummary = function () {
                vehicleService.getVehiclesUtilizationCommercialNonCommercial().success(function (result) {
                    vm.reportData = result;
                });
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange; var j = 0;
                var tab1 = document.getElementById('VehUtilizationCNCTable'); // id of table 

                for (j = 0 ; j < tab1.rows.length ; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                tab_text = tab_text + "<table border='1px'><tr>";
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "saleReport.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }
                return (sa);
            }







            function init() {
                vm.getVehiclesSummary();
            };
            
            init();
        }
    ]);
