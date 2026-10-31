// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:313918-314011
appModule.controller('tenant.views.crs.vehicles.serviceLogReport', ['$scope', '$stateParams', 'abp.services.app.vehicleServiceLog',
        function ($scope, $stateParams, serviceLogService) {

            var vm = this;

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            vm.localize = function (text) {
                return app.localize(text);
            };

            if (vm.filters.plateNo && vm.filters.plateNo != "") {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.workShopId = null;
            }

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            function init() {
                vm.loading = true;
                vm.filters.doNotPaginate = true;
                vm.filters.sorting = "id desc";
                serviceLogService.getVehicleServiceLogs(vm.filters).success(function (data) {
                    vm.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();


            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('serviceTableReport'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'ServiceLog.xls';
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
        }]);
