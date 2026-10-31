// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:265361-265723
appModule.controller('tenant.views.crs.reports.dailyBusinessReport.index', [
        '$scope', 'uiGridConstants','abp.services.app.dailyBusinessReport', 'utilities', 'abp.services.app.billingMethod', 'abp.services.app.commonLookup','$filter','$stateParams',
        function ($scope, uiGridConstants, dailyBusinessReportAppService, utilities, billingMethodService, commonLookupService, $filter,$stateParams) {

            var vm = this;
            var movementId = 0;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.agreements = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");
            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts'),
            };
            if (!isNaN($stateParams.query))
                movementId = $stateParams.query;

            vm.filters = {
                fromDate: null,
                toDate: null,
                locationId: null,
                locationId2: null,
                skipCount: 0,
                agreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: null,
                startDate: null,
                endDate: null,
                customerId: null,
                plateNo: '',
                locationId: '',
                movementTypeId: null,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            //vm.CurrencyFormate = function (count) {
            //    if (count == null) return null;
            //    return count.toLocaleString('en');
            //};

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
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
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };


        vm.getVoucherType = function (type, subType) {
            return utilities.getVoucherType(type, subType);
        };



            //Location related code Start ------------
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
                    vm.LocationsForAgreement = data.items;
                });
            };

            //Location related code END ---------------
            vm.getDailyBusinessReport = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                dailyBusinessReportAppService.getDailyBusinessReport(vm.filters).success(function (result) {
                vm.reportData = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getOpenedAgreements = function () {
                
                vm.loading = true;
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                dailyBusinessReportAppService.getOpenedAgreements(vm.filters).success(function (result) {
                    
                    vm.openedAgreementData = result.items;
                    
                  //if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                    //    initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getLength = function (a) {
                return a.length();
            }
            vm.getClosedAgreements = function () {

                vm.loading = true;
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                dailyBusinessReportAppService.getClosedAgreements(vm.filters).success(function (result) {
                    vm.closedAgreementData = result.items;
                    //if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                    //    initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getStaffMovements = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                dailyBusinessReportAppService.getStaffMovements(vm.filters).success(function (result) {
                    vm.getStaffData = $filter('filter')(result.items, {
                        movementTypeId: 2
                    }, true);

                    vm.getWorkShopData= $filter('filter')(result.items, {
                        movementTypeId: 3
                    }, true);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getVehicleReplacementStatus = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                dailyBusinessReportAppService.getVehicleReplacementStatus(vm.filters).success(function (result) {
                    vm.vehicleReplacements = result;
                    angular.forEach(vm.vehicleReplacements, function (item) {
                        item.date = vm.getlocalDateTime(item.date);
                    });
                }).finally(function () {
                    vm.loading = false;
                    });

            };
        vm.exportToExcel = function () {
            var tab_text = "<h1>Collection Summary</h1>";
            tab_text = tab_text + "<br/>";

            tab_text = tab_text + "<table border='1px'><tr>";
            var tab1 = document.getElementById('collectionSummaryTable'); // id of table
            var tab2 = document.getElementById('collectionDetailTable');
            var tab3 = document.getElementById('agreementsOpenedTable');
            var tab4 = document.getElementById('agreementsClosedTable');
            var tab5 = document.getElementById('staffMovementsTable');
            var tab6 = document.getElementById('workshopMovementsTable');
            var tab7 = document.getElementById('vehicleReplacementTable');

           // var tab_text = "<table border='1px'><tr>";
            var textRange; var j = 0;
            for (j = 0; j < tab1.rows.length; j++) {
                tab_text = tab_text;
                tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";
            tab_text = tab_text + "<br/>";
            tab_text = tab_text + " <h1>Collection Detail</h1> ";
            tab_text = tab_text + "<br/>";
            tab_text = tab_text + "<table border='1px'><tr>";

            for (j = 0; j < tab2.rows.length; j++) {
                tab_text = tab_text;
                tab_text = tab_text + tab2.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";
            tab_text = tab_text + "<br/>";
            tab_text = tab_text + " <h1>Agreements Opened</h1> ";
            tab_text = tab_text + "<br/>";
            tab_text = tab_text + "<table border='1px'><tr>";

            for (j = 0; j < tab3.rows.length; j++) {
                tab_text = tab_text;
                tab_text = tab_text + tab3.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";
            tab_text = tab_text + "</br>";
            tab_text = tab_text + " <h1>Agreements Closed</h1> ";
            tab_text = tab_text + "<br/>";
            tab_text = tab_text + "<table border='1px'><tr>";

            for (j = 0; j < tab4.rows.length; j++) {
                tab_text = tab_text;
                tab_text = tab_text + tab4.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";
            tab_text = tab_text + "</br>";
            tab_text = tab_text + " <h1>NRMS</h1> ";
            tab_text = tab_text + "<br/>";
            tab_text = tab_text + "<table border='1px'><tr>";

            for (j = 0; j < tab5.rows.length; j++) {
                tab_text = tab_text;
                tab_text = tab_text + tab5.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";
            tab_text = tab_text + "</br>";
            tab_text = tab_text + " <h1>Workshop Movements</h1> ";
            tab_text = tab_text + "<br/>";
            tab_text = tab_text + "<table border='1px'><tr>";

            for (j = 0; j < tab6.rows.length; j++) {
                tab_text = tab_text;
                tab_text = tab_text + tab6.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";
            tab_text = tab_text + "</br>";
            tab_text = tab_text + " <h1>Vehicle Replacement</h1> ";
            tab_text = tab_text + "<br/>";
            tab_text = tab_text + "<table border='1px'><tr>";

            for (j = 0; j < tab7.rows.length; j++) {
                tab_text = tab_text;
                tab_text = tab_text + tab7.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";
            tab_text = tab_text + "</br>";

            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

            {
                txtArea1.document.open("txt/html", "replace");
                txtArea1.document.write('sep=,\r\n' + tab_text);
                txtArea1.document.close();
                txtArea1.focus();
                sa = txtArea1.document.execCommand("SaveAs", true, "trialBalance.xls");
            }

            else {
                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'DailyBusinessReport.xls';
                a.click();
            }

            return (true);
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

            vm.getReplacedVehicles = function () {
                vm.loading = true;
                dailyBusinessReportAppService.getReplacedVehicles({
                    id: 185
                }).success(function (result) {
                    vm.replacedVehiclesData = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            //vm.exportToExcel = function () {
            //    vm.loading = true;
            //    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //     dailyBusinessReportAppService.exportToExcel(vm.filters) .success(function (result) {
            //        app.downloadTempFile(result);
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            function init() {
                getLocations();
                vm.getDailyBusinessReport();
                vm.getOpenedAgreements();
                vm.getClosedAgreements();
                vm.getStaffMovements();
                vm.getVehicleReplacementStatus();
            //    vm.getReplacedVehicles();
            }

            init();
        }
    ]);
