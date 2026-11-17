// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:274095-274291
appModule.controller('tenant.views.crs.nonRevenueMovementReport.index', [
        '$scope', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.nonRevenueMovementReport', 'utilities', 'abp.services.app.vehicle',
        function ($scope, directoryService, appSession, commonLookupService, nonRevenueService, utilities, vehicleService) {

            var vm = this;
            var errorMessage = {};
            var isValid = true;
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
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.agreementTypes = null;
            vm.locations = [];
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            vm.filters = {
                enableDateRange: true,
                startDate: null,
                endDate: null,
                locationId: '',
                varianceThreshold: 30,
                vehicleId: null
            };

            vm.dateRangeModel = {
                startDate: todayAsString,
                endDate: todayAsString
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            };
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Bookings'),
                create: abp.auth.hasPermission('Pages.Tenant.Bookings.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Bookings.Edit'),
                print: abp.auth.hasPermission('Pages.Tenant.Bookings.Addnew'),
                close: abp.auth.hasPermission('Pages.Tenant.Bookings.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Bookings.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Bookings.AllActionsOnOtherBranchBookings'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Bookings.ViewOtherBranchBookings'),
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            function getLocations() {

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };

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

            vm.getlocalizedString = function (bookingStatus) {
                return app.localize(bookingStatus);
            };

            vm.exportToExcel = function () {
                var tableId = 'tblNonRevenueAgreementReport';
                var tab_text = "";

                tab_text = tab_text + "<br/>" + "<table border='1px'><tr>";
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
                a.download = 'NonRevenueMovementsReport.xls';
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
            vm.getNonRevenueMovementReport = function () {
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

                if (!vm.filters.varianceThreshold) {
                    vm.filters.varianceThreshold = 0
                }

                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }

                nonRevenueService.nonRevenueReport(vm.filters).success(function (data) {
                    vm.nonRevenueMovements = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initializeFilters() {
                vm.getNonRevenueMovementReport();
                getLocations();
            }

            initializeFilters();
        }
    ]);
