// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:279205-279411
appModule.controller('tenant.views.crs.revenueAnalysis.index', [
        '$scope', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.estimatedRevenue', 'utilities', '$filter',
        function ($scope, appSession, commonLookupService, estimatedRevenueService, utilities, $filter) {

            var vm = this;
            vm.localize = (key) => app.localize(key);

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';

            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.filters = {
                enableDateRange :true,
                startDate: null,
                endDate: null,
                locationId: '',
            };

            vm.dateRangeModel = {
                startDate: todayAsString,
                endDate: todayAsString
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            };

            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };

            function getLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            function getVehicleTypes() {

                estimatedRevenueService.getVehicleTypes().success(function (data) {
                    vm.vehicleTypes = data;
                });
            }

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

            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getPerColumTotal = function (data, chargeId) {
                var sum = 0.0;
                data.forEach(function (value) {
                    if (chargeId) {
                        var foundLines = $filter('filter')(value.revenueAnalysisCharges, {
                            chargeId: chargeId,
                        }, true);
                        sum = sum + foundLines[0].charge;
                    }
                    else {
                        value.revenueAnalysisCharges.forEach(function (val) {
                            sum = sum + val.charge;
                        });
                    }
                });
                return utilities.round(sum, 2);;

            };

            vm.calculateLengthOfRevenue = function (rentalDays, rentals) {
                var lor = (parseFloat(rentalDays) / parseFloat(rentals));
                return utilities.round(lor, 2);
            }

            vm.rounding = function (value) {
                if (value) {
                    return utilities.round(value, 2);
                }
                else {
                    return 0.0;
                }
            }

            vm.calculateRevenuePerDay = function (revenue, billedDays) {
                var rpd = (parseFloat(revenue) / parseFloat(billedDays));
                return utilities.round(rpd, 2);
            }

            vm.exportToExcel = function (tableID) {
                var tableId = 'tblEstimatedRevenue';

                var tab_text = "<table border='1px'><tr>";
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
                a.download = 'EstimatedRevenueReport.xls';
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

            // Getting All The Bookings
            vm.getEstimatedRevenueByVehicleType = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                estimatedRevenueService.getRevenueAnalysis(vm.filters).success(function (data) {
                    vm.revenueAnalysisReport = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initializeFilters() {
                getLocations();
                getVehicleTypes();
            }

            initializeFilters();
        }
    ]);
