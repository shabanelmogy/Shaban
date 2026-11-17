// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:244660-244929
appModule.controller('tenant.views.crs.limousine.limoUtilizationReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.vehicle', 'abp.services.app.limoTrip', 'appSession', 'utilities', 'abp.services.app.commonLookup', 'FileUploader', 'abp.services.app.invoice',
        "abp.services.app.limoTripSearch", "abp.services.app.limoTripExport",
        function ($scope, $uibModal, uiGridConstants, directoryService, vehicleService, limoTripsService, appSession, utilities, commonLookupService, fileUploader, invoiceService, limoTripSearchService, limoTripExportService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'hh:mm a';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.customers = null;
            vm.contactId = appSession.user.contactId;
            vm.contact = null;
            vm.isCustomerLogin = false;
            vm.locations = [];
            vm.tripTypes = [];
            vm.totalTrips = 0;
            vm.totalKms = 0;
            vm.totalcharges = 0;
            vm.date1 = moment().utc();
            vm.date2 = moment().endOf('day').utc();
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;
            vm.filters = {
                enableDateRange: true,
                fromDate:null,
                toDate: null,
                locationId: null,
                customerId: null,
                tariffGroupId: null,
                utilizationBreakUp: 1,
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            function getTariffGroup() {
                vm.loading = true;
                commonLookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.locationName = function (id) {
                return vm.locations.filter(e => e.id == id)[0].name;
            }

            vm.getTariifName = function (id) {
                return vm.tariffGroups.filter(e => e.id == id)[0].title;
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };
            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };






            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };


          
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({
                    keyword: $select.search, contactType: 2, activeOnly: true
                }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
        
            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                        vm.filters.customerId = customer.id;
                        vm.getTrips();
                    }
                });
            };
            vm.searchDriverPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 1;
                        }
                    }
                }).result.then(function (driver) {
                    if (driver != null) {
                        vm.filters.driver = driver;
                        vm.filters.driverId = driver.id;
                        vm.getTrips();
                    }
                });
            };




            vm.clearCustomer = function () {
                vm.filters.customerId = null;
                vm.filters.customer = null;
            };
            vm.clearDriver = function () {
                vm.filters.driverId = null;
                vm.filters.driver = null;
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('hh:mm a');
                }
                else {
                    return "";
                }
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('utilizationReportTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'utilizationReport.xls';
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

            vm.searchUtilizationReport = function () {
                vm.loading = true;
                vm.totalTrips = 0;
                vm.totalKms = 0;
                vm.totalcharges = 0;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                limoTripSearchService.getUtilizationReport(
                   vm.filters
                ).success(function (result) {
                    vm.listData = result;
                   
                    angular.forEach(vm.listData, function (value, key) {
                        vm.totalTrips = vm.totalTrips + value.tripsCount;
                        vm.totalKms = vm.totalKms + value.kms;
                        vm.totalcharges = vm.totalcharges + value.charges;
                    });   
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    eventOnKeyPress.preventDefault();
                }
            };
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }


            function init() {
                getTariffGroup();
                getLocations();
            }
            init();
        }
    ]);
