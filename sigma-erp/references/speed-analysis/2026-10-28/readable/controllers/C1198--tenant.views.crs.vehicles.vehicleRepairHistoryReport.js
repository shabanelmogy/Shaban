// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:315262-315368
appModule.controller('tenant.views.crs.vehicles.vehicleRepairHistoryReport', [
        '$scope', 'abp.services.app.job',
        function ($scope, jobAppService) {

            var vm = this;
            vm.saving = false;
            //vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            console.log(vm.filters);

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD/MM/YYYY');
                }
                else {
                    return "";
                }
            };
            vm.getJobs = function () {
                console.log(vm.filters);
                vm.loading = true;
                vm.filters.vehicleId = vm.filters.vehicle.id;
                jobAppService.getVehicleRepairHistory(vm.filters)
                    .success(function (data) {
                        if (data) {
                            vm.vehicleReportData = data;
                            var total = 0;
                            angular.forEach(data, function (value) {
                                total += value.amount;
                            });
                            vm.totalAmount = total;
                        }

                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getStatusString = function (status) {
                if (status === 1) {
                    return app.localize('Open');
                }
                else if (status === 2) {
                    return app.localize('Closed');
                }
            };

            function init() {
                vm.getJobs();
            }


            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('vehicleRepairHistoryReport'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'vehicleRepairHistory.xls';
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
            init();
        }
    ]);
