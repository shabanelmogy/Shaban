// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272872-273005
appModule.controller('tenant.views.crs.reports.idleVehicle.index', [
        '$scope', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.commonLookup',
        function ($scope, vehicleService, directoryService, commonLookupService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.localize = function (text) {
                return app.localize(text);
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

            vm.masterFilters = {
                days: 7
            };

            vm.loading = false;

            vm.exportToExcel = function () {
                vm.loading = true;
                vehicleService.exportToExcelIdleVehicle(vm.masterFilters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportToExcelMethod = function (tableID, tableID2) {
                var tab_text = "<b>IDLE VEHICLES SUMMARY</b><br/><table border='1px'><tr>";
                var textRange; var j = 0;
                tab = document.getElementById(tableID); // id of table
                var tab2 = document.getElementById(tableID2);
                for (j = 0; j < tab.rows.length; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }

                tab_text = tab_text + "</table>";


                tab_text += "<br/><b>IDLE VEHICLES</b><table border='1px'><tr>";
                var tab2 = document.getElementById(tableID2);
                for (j = 0; j < tab2.rows.length; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab2.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }

                tab_text = tab_text + "</table>";

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "depreciationReportFY.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);

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

            vm.getVehiclesSummaryIdleBranchWise = function () {
                vm.idleVehiclesSummaryLoading = true;
                vehicleService.getIdleVehicleReport(vm.masterFilters).success(function (result) {
                    vm.vehiclesSummaryIdleBranchWise = result.summary;
                    vm.idleVehicles = result.idleVehicles;

                }).finally(function () {
                    vm.idleVehiclesSummaryLoading = false;
                });
            };
            getLocations();
            vm.getVehiclesSummaryIdleBranchWise();
        }
    ]);
