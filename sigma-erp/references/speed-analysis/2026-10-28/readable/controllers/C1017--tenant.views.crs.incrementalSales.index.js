// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:273009-273189
appModule.controller('tenant.views.crs.incrementalSales.index', [
        '$scope', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.incrementalSales', 'utilities',
        function ($scope, appSession, commonLookupService, incrementalSalesService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.localize = (key) => app.localize(key);
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

            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            function getLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
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

            vm.getPercentage = function (agreementRental, bookingRental) {
                var percentage = (parseFloat(agreementRental)/parseFloat(bookingRental)) * 100;
                return utilities.round(percentage, 2);
            }

            vm.rounding = function (value) {
                if (value) {
                    return utilities.round(value, 2);
                }
                else {
                    return 0.0;
                }
            }

            vm.exportToExcel = function (tableID) {
                var tableId = 'tblIncrementalSales';
                var tab_text = "";
                vm.incrementalSalesReport.forEach(function (value, key) {
                    var colspan = value.incrementalSales[0].agreementCharges.length + 4;
                    var tr = "<tr><td style='font-size:18px;font-weight:bold' colspan='" + colspan + "'>" + app.localize("EmployeeName") + ": " + (value.emloyeeName) + "</td></tr>"
                    tab_text = tab_text + "<br/>" + "<table border='1px'>" + tr + "<tr>";
                    var textRange;
                    var j = 0;

                    var tab1 = document.getElementById(tableId + key); // id of table
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
                a.download = 'IncrementalSalesReport.xls';
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
            vm.getIncrementalSales = function () {
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

                incrementalSalesService.getIncrementalSales(vm.filters).success(function (data) {
                    vm.incrementalSalesReport = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initializeFilters() {
                vm.getIncrementalSales();
                getLocations();
            }

            initializeFilters();
        }
    ]);
