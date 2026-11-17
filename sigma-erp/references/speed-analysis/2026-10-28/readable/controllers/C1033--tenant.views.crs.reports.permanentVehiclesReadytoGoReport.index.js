// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:276612-276736
appModule.controller('tenant.views.crs.reports.permanentVehiclesReadytoGoReport.index', [
        '$scope', 'abp.services.app.commonLookup',
        'abp.services.app.permanentVehiclesReadytoGoReport', 'appSession', 'abp.services.app.user', 'utilities',
        function ($scope, commonLookupService, permanentVehiclesReadytoGoReportService, appSession, userService, utilities) {

            var vm = this;
            vm.locations = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            vm.reportData = null;
            vm.filters = {};
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    console.log(date);
                    var localTime = moment.utc(date).toDate();
                    var dateTime = moment(localTime).format(vm.dateFormat);
                    console.log(dateTime);
                    return dateTime;
                }
                else {
                    return "";
                }
            };

            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                    if (appSession.user != null && appSession.user.locationId > 0)
                        vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
                });
            }

            function getAllLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    if (appSession.user.branchAccess == 2)
                        getSelectiveBranches();
                    else if (appSession.user.branchAccess == 1) {
                        vm.filters.locationId = appSession.user.locationId;
                        vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                    }
                });
            }

            vm.getPermanentVehiclesReadytoGoReport = function () {
                vm.loading = true;
                //vm.totalObj = {};

                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').utc();
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').utc();
                permanentVehiclesReadytoGoReportService.getPermanentVehiclesReadytoGoReport(vm.filters).success(function (result) {
                    vm.reportData = result;
                    vm.totalBeginningBal = 0;
                    vm.totalRentalLease = 0;
                    vm.totaltolls = 0;
                    vm.totalFines = 0;
                    vm.totalOther = 0;
                    vm.totalBalance = 0;
                    vm.totalCreditNote = 0;
                    vm.totalReceipts = 0;
                    vm.totalEndingBal = 0;
                    angular.forEach(vm.reportData, function (row) {
                        vm.totalBeginningBal += row.beginningBal;
                        vm.totalRentalLease += row.rentalLeaseBal;
                        vm.totaltolls += row.salik;
                        vm.totalFines += row.fines;
                        vm.totalOther += row.otherCharges;
                        vm.totalCreditNote += row.creditNote;
                        vm.totalReceipts += row.receipts;
                        vm.totalEndingBal += row.endingBal;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportToExcel = function (tableId) {
                var tab_text = "<style>#tableId tr td:first-child {width: 200px;}</style>";
                tab_text += "<table border='1px'><tr>";
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
                a.download = 'PermanentVehiclesReadyToGoReport.xls';
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
                getAllLocations();
            }

            init();
        }
    ]);
