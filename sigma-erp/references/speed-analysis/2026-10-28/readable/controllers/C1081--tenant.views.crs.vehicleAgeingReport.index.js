// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:286616-286777
appModule.controller('tenant.views.crs.vehicleAgeingReport.index', [
        '$scope', 'abp.services.app.directory', 'appSession', 'abp.services.app.vehicleAgeingReport', 'utilities', '$filter',
        function ($scope, directoryService, appSession, vehicleAgeingReportService, utilities, $filter) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    //return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.getPerColumTotal = function (data, year) {
                var sum = 0.0;
                data.forEach(function (value) {
                    if (year) {
                        var foundLines = $filter('filter')(value.yearModels, {
                            year: year,
                        }, true);
                        sum = sum + foundLines[0].totalVehicle;
                    }
                    else {
                        value.yearModels.forEach(function (valueYear) {
                            sum = sum + valueYear.totalVehicle;
                        });
                    }
                });
                return utilities.round(sum, 2);

            };

            vm.horizontalTotal = function (data) {
                var sum = 0;
                angular.forEach(data, function (value) {
                    sum = sum + parseInt(value.totalVehicle);
                });
                return sum;
            }

            //vm.exportToExcelMethod = function (tableID) {

            //    var tab_text = "<table border='1px'><tr>";
            //    var textRange; var j = 0;
            //    tab = document.getElementById(tableID); // id of table

            //    for (j = 0 ; j < tab.rows.length ; j++) {

            //        tab_text = tab_text;

            //        tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
            //        //tab_text=tab_text+"</tr>";
            //    }

            //    tab_text = tab_text + "</table>";

            //    var ua = window.navigator.userAgent;
            //    var msie = ua.indexOf("MSIE ");

            //    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

            //    {
            //        txtArea1.document.open("txt/html", "replace");
            //        txtArea1.document.write('sep=,\r\n' + tab_text);
            //        txtArea1.document.close();
            //        txtArea1.focus();
            //        sa = txtArea1.document.execCommand("SaveAs", true, "vehicleAgeingReportFY.xls");
            //    }

            //    else {
            //        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
            //    }

            //    return (sa);
            //};

            vm.exportToExcelMethod = function (tableID) {
                var tableId = 'tblVehicleAgeingReportFY';
                var tab_text = "";
                vm.vehicleAgeings.forEach(function (value, key) {
                    var colspan=value.makeAndModels[0].yearModels.length+2;
                    var tr = "<tr><td style='font-size:18px;font-weight:bold' colspan=" + colspan + ">" + (value.categoryName?value.categoryName:"Other") +"</td></tr>"
                    tab_text =tab_text+"<br/>"+ "<table border='1px'>"+tr+ "<tr>";
                    var textRange;
                    var j = 0;
                    
                    var tab1 = document.getElementById(tableId+key); // id of table
                    for (j = 0; j < tab1.rows.length; j++) {

                        tab_text = tab_text;
                        tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                    }
                    tab_text = tab_text + "</table>";
                });
                
                
                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);
               
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'VehicleAgeingReport.xls';
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

            init = function () {
                vm.loading = true;

                vehicleAgeingReportService.getVehicleAgeingReport().success(function (data) {
                    vm.vehicleAgeings = data;
                    console.log(data);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            init();
        }
    ]);
