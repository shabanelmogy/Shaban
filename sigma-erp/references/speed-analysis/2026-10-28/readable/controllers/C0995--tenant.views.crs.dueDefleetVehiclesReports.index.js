// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:269385-269482
appModule.controller('tenant.views.crs.dueDefleetVehiclesReports.index', [
        '$scope', 'abp.services.app.vehicle', 'utilities',
        function ($scope, vehicleService, utilities) {

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            var vm = this;
            var errorMessage = {};
            var isValid = true;
            vm.loading = false;
            vm.count = 0;

            vm.defleetKMs = abp.setting.get("App.General.DueDefleetVehiclesReportsKMs");
            vm.defleetYears = abp.setting.get("App.General.DueDefleetVehiclesReportsPeriod");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.exportToExcel = function () {
                var tab_text = "<style>table tr td {text-align:left;}</style><table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('dueDeFleetVehicles'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Due DeFleet Vehicles.xls';
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
                vm.loading = true;
                vehicleService.getDueDefleetVehiclesReports().success(function (data) {
                    vm.dueVehicles = data.items;
                    angular.forEach(vm.dueVehicles, function (value, key) {
                        vm.count++;
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
