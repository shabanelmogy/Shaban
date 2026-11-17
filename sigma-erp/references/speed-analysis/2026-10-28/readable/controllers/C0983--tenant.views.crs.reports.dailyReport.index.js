// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:267140-267320
appModule.controller('tenant.views.crs.reports.dailyReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.dailyReport', 'utilities', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, uiGridConstants, dailyReportService, utilities, commonLookupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts'),
            };
            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = {
                monthYear: new Date(),
                locationId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };


            function getLocationsActiveAndInActive() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    vm.LocationsForAgreement = data.items;
                });
            };
            vm.getLocationName = function (locationId) {
                var locationName = null;
                for (var i = 0; i < vm.locations.length; i++) {
                    if (vm.locations[i].id == locationId) {
                        locationName = vm.locations[i].name;
                        break;
                    }
                }
                return locationName;

            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.totalAmount = null;

            vm.exportToExcel = function () {
                vm.loading = true;

                dailyReportService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.getlocalDateTime = function (date, format) {
                
                vm.format = null;
                if (format)
                    vm.format = format;
                if (!vm.format)
                    vm.format = vm.dateFormat;
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.format);
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('ReportTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'DailyReport.xls';
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
            vm.getDailyReport = function () {
                vm.loading = true;
                dailyReportService.getDailyReport(vm.filters).success(function (data) {
                    vm.totalAmount = data.totalAmount;
                    vm.totalItems = data.totalCount;
                    vm.dailyReport = data;

                    vm.sumChargesType = [];
                    var chargesTypeIndex = 0;

                    if (vm.sumChargesType.length == 0)
                        for (var i = 0; i < vm.dailyReport.chargesTypes.length; i++) {
                            vm.sumChargesType.push(0.0);
                        }

                    vm.sumRevenue = 0.0;
                    vm.sumDeposits = 0.0;
                    vm.sumCollection = 0.0;
                    vm.sumRefunds = 0.0;

                    angular.forEach(vm.dailyReport.dailyReportList, function (row, key) {

                        row.revenue = utilities.round(row.revenue, 2);
                        row.deposits = utilities.round(row.deposits, 2);
                        row.collection = utilities.round(row.collection, 2);
                        row.refunds = utilities.round(row.refunds, 2);

                        vm.sumRevenue += row.revenue;
                        vm.sumDeposits += row.deposits;
                        vm.sumCollection += row.collection;
                        vm.sumRefunds += row.refunds;

                        chargesTypeIndex = 0;
                        angular.forEach(row.chargesWiseCollection, function (charges, key) {
                            vm.sumChargesType[chargesTypeIndex] += charges;
                            chargesTypeIndex += 1;
                        });
                    });

                    vm.sumRevenue = utilities.round(vm.sumRevenue, 2);
                    vm.sumDeposits = utilities.round(vm.sumDeposits, 2);
                    vm.sumCollection = utilities.round(vm.sumCollection, 2);
                    vm.sumRefunds = utilities.round(vm.sumRefunds, 2);

                }).finally(function () {
                    vm.loading = false;
                });

            };

            getLocationsActiveAndInActive();
            vm.getDailyReport();
        }
    ]);
