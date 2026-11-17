// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:243484-243602
appModule.controller('tenant.views.crs.limousine.branchRevenueReport.index', [
        '$scope', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.limoTrip', 'abp.services.app.commonLookup',
        function ($scope, utilities, commonLookupService, limoTripService, commonLookupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ViewOtherBranchTrips'),
            vm.locations = [];
            vm.filters = {
                fromDate: null,
                toDate: null,
                locationId: ''
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
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
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({
                }).success(function (data) {
                    vm.locations = data.items;
                });
            };

            vm.exportToExcel = function (tableId) {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
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
                a.download = 'BranchRevenueReport.xls';
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
            vm.getBranchRevenueReport = function () 
            {
                vm.loading = true;
                vm.totalAmount = 0;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                return limoTripService.getBranchRevenueReport(vm.filters)
                    .then(function (response) {
                        vm.branchRevenue = response.data;
                        vm.totalAmount = 0;
                        angular.forEach(vm.branchRevenue, function (value) {
                            vm.totalAmount += value.charges;

                        });
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            function init() {
                vm.getBranchRevenueReport();
                getLocationsActiveAndInActive();
            }

            init();
        }
    ]);
