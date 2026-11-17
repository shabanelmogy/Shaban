// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:268506-268714
appModule.controller('tenant.views.crs.reports.detailedVehicleUtilizationReport.index', [
        '$scope', 'abp.services.app.detailedVehicleUtilization', '$uibModal', 'utilities',
        function ($scope, detailedVehicleUtilizationService, $uibModal, utilities) {
            var vm = this;

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

            vm.getlocalDay = function (date) {
                if (date != null) {
                    //var localTime = moment.utc(date).toDate();
                    return moment(date).format('DD');
                }
                else {
                    return "";
                }
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            var getClientMonthYear = function (date) {
                return moment(date).format('MM-YYYY');
            }

            var generateOverAllExcel = function () {
                var tableId = 'tblOverAll';
                var tab_text = "<b>Overall</b><br/><table border='1px'><tr>";
                var j = 0;

                var tab1 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table><br/>";
                return tab_text;
            }

            var generateServiceMaintenanceExcel = function () {
                var tableId = 'tblServiceMaintenance';
                var tab_text = "<b>Service and Maintenance</b><br/><table border='1px'><tr>";
                var j = 0;

                var tab1 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table><br/>";
                return tab_text;
            }

            var generateAccidentRepairExcel = function () {
                var tableId = 'tblAccidentRepair';
                var tab_text = "<b>Accident Repair</b><br/><table border='1px'><tr>";
                var j = 0;

                var tab1 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table><br/>";
                return tab_text;
            }

            var generateRentedExcel = function () {
                var tableId = 'tblRented';
                var tab_text = "<b>Rented</b><br/><table border='1px'><tr>";
                var j = 0;

                var tab1 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table><br/>";
                return tab_text;
            }

            var generateAverageValuesExcel = function () {
                var tableId = 'tblAverageValues';
                var tab_text = "<b>Average Values</b><br/><table border='1px'><tr>";
                var j = 0;

                var tab1 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table><br/>";
                return tab_text;
            }

            var generateBranchwiseExcel = function () {
                var tab_text = "<b>Branch Wise Values</b><br/>";
                vm.reportData.branchWiseList.forEach(function (value, key) {
                    tab_text = tab_text + "<b>" + value.branchName + "</b><table border='1px'><tr>";
                    var j = 0;

                    var tab1 = document.getElementById("tblBranchWise" + key); // id of table
                    for (j = 0; j < tab1.rows.length; j++) {

                        tab_text = tab_text;
                        tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                    }
                    tab_text = tab_text + "</table>";
                });
                return tab_text;
            }

            vm.exportToExcelMethod = function (tableID) {
                var tab_text = generateOverAllExcel() + generateServiceMaintenanceExcel() + generateAccidentRepairExcel() +
                    generateRentedExcel() + generateAverageValuesExcel() + generateBranchwiseExcel();

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'DetailedVehicleUtilizationReport.xls';
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

            vm.getDetailedVehicleUtilizationReport = function () {
                vm.loading = true;
                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month');
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day');
                vm.daysInMonth = moment(vm.filters.monthYear).daysInMonth();
                if (vm.filters.endDate >= moment().endOf('day'))
                    vm.filters.endDate = moment().endOf('day').subtract(1, "days");
                detailedVehicleUtilizationService.getDetailedVehicleUtilizationReport(vm.filters).success(function (data) {
                    vm.reportData = data;
                    if (vm.daysInMonth - vm.reportData.overAllStatusList[0].dayValues.length > 0)
                        vm.arrayToIterate = new Array(vm.daysInMonth - vm.reportData.overAllStatusList[0].dayValues.length);
                    else
                        vm.arrayToIterate = [];
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.report = function (dayForwoded) {
                debugger;
                dayForwoded = parseInt(dayForwoded);
                var obj = {};
                var finalArray = [];
                angular.forEach(vm.reportData.overAllStatusList, function (value, key) {
                    obj.type = value.status;
                    obj.movementList = value.dayValues[dayForwoded - 1].movementList;
                    finalArray.push(obj);
                    obj = {};
                });              
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/detailedVehicleUtilizationReport/vehicleUtilizationDetail.cshtml',
                    controller: 'tenant.views.crs.reports.detailedVehicleUtilizationReport.vehicleUtilizationDetail as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {                    
                        options: function () {
                            return finalArray;
                        }
                    }
                });
            };
        }
    ]);
