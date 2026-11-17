// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:286781-286954
appModule.controller('tenant.views.crs.vehicleChagredVsDrivenReport.index', [
        '$scope', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.vehicleChargedVsDriven', 'utilities',
        function ($scope, appSession, commonLookupService, vehicleChargedVsDrivenService, utilities) {

            var vm = this;

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
                enableDateRange: true,
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

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

                vehicleChargedVsDrivenService.getVehicleTypes().success(function (data) {
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

            vm.getPercentage = function (agreementRental, bookingRental) {
                var percentage = (parseFloat(agreementRental) / parseFloat(bookingRental)) * 100;
                return utilities.round(percentage, 2);
            }

            vm.exportToExcelMethod = function (tableID) {
                var tableId = 'tblVehicleChargedVsDriven';
                var tab_text = "";
                vm.vehicleChargedVsDrivenReport.forEach(function (value, key) {
                    var tr = "<tr><td style='font-size:18px;font-weight:bold' colspan='4'><b>" + app.localize("Booking") + " " + app.localize("VehicleType") + ": </b>" + (value.vehicleType) + "<b> " + app.localize("Rentals") + ": </b>" + (value.rental) + "<b> " + app.localize("RentalDays") + ": </b>" + (value.rentalDays) + "</td></tr>"
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
                a.download = 'VehicleChargedVsDrivenReport.xls';
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
            vm.getVehicleChargedVsDriven = function () {
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

                vehicleChargedVsDrivenService.getVehicleChargedVsDriven(vm.filters).success(function (data) {
                    vm.vehicleChargedVsDrivenReport = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initializeFilters() {
                vm.getVehicleChargedVsDriven();
                getLocations();
                getVehicleTypes();
            }

            initializeFilters();
        }
    ]);
