// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:275224-275415
appModule.controller('tenant.views.crs.overdueAgreementReport.index', [
        '$scope', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.overdueAgreementReport', 'utilities',
        function ($scope, directoryService, appSession, commonLookupService, overdueAgreementService, utilities) {

            var vm = this;
            var errorMessage = {};
            var isValid = true;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.overdueAgreementsReport = [];
            vm.summaryList = [];
            vm.overdueAgreements = 0;

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

            vm.getlocalizedString = function (bookingStatus) {
                return app.localize(bookingStatus);
            };

            vm.exportToExcelMethod = function (tableID) {
                var tableId = 'tblOverdueAgreementsReport';
                var tab_text = "";
                vm.overdueAgreementsReport.forEach(function (value, key) {
                    var tr = "<tr><td style='font-size:18px;font-weight:bold' colspan='9'>" + (value.location) + "</td></tr>"
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


                tab_text = tab_text + "<br/>" + "<table border='1px'><tr>";
                var j = 0;

                var tab2 = document.getElementById("tblSummary"); // id of table
                for (j = 0; j < tab2.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab2.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'OverdueVehicleReport.xls';
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
            vm.getOverdueAgreementReport = function () {
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

                overdueAgreementService.getOverdueAgreementReport(vm.filters).success(function (data) {
                    vm.overdueAgreementsReport = data.reportData;
                    vm.summaryList = data.summaryData;
                    vm.overdueAgreements = data.overdueAgreements;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initializeFilters() {
                vm.getOverdueAgreementReport();
                getLocations();
            }

            initializeFilters();
        }
    ]);
