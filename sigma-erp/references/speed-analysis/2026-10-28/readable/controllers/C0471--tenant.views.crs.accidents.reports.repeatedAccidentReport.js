// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:120638-120941
appModule.controller('tenant.views.crs.accidents.reports.repeatedAccidentReport', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.accident', 'abp.services.app.vehicle', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, accidentService, vehicleService, appSession, lookupService, utilities, directoryService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-6, 'months').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = dateRangeCheck;
            function dateRangeCheck() {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            }
            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };


            vm.filters = {
                enableDateRange: true,
                driverId: null,
                vehicleId: null
            };
            
            
            vm.getFaultValue = function (value) {
                if (value === 1)
                    return "Driver At Fault";
                else if (value === 2)
                    return "Driver Not At Fault";
                else if (value === 3)
                    return "Unknown";
                else
                    return null;
            };

            vm.getChargingType = function (row) {
                if (row && row.chargingType) {
                    if (row.chargingType == 1)
                        return 'No Charging';
                    else if (row.chargingType == 2)
                        return 'Excess Charging';
                    else if (row.chargingType == 3)
                        return 'Damage Charging';
                }
                return '';
            };

            vm.getMovementType = function (mov) {

                if (!mov)
                    return '';
                else if (mov.movementTypeId == 1 && mov.inDetail.operationType == 2)
                    return 'Agreement Replacement';
                else if (mov.movementTypeId == 1 && mov.inDetail.operationType == 4)
                    return 'Agreement Custody';
                if (mov.movementTypeId == 1)
                    return app.localize("Agreement");
                else if (mov.movementTypeId == 2)
                    return app.localize("NRM");
                else if (mov.movementTypeId == 3)
                    return app.localize("Garage");
                else if (mov.movementTypeId == 4)
                    return app.localize("Delivery");
                else if (mov.movementTypeId == 5)
                    return app.localize("Collection");
                else
                    return app.localize("N/A");
            };
            vm.insuranceInvoicesOptions = [
                { name: app.localize("NA"), id: 0 },
                { name: app.localize("Invoiced"), id: 1 },
                { name: app.localize("DueToInvoice"), id: 2}
            ];

            vm.filterMovementTypes = [
                { name: app.localize("Agreement"), id: 1 },
                { name: app.localize("NRM"), id: 2 }
            ];

            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search === "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };

            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.searchPersonStaffCustomer({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.clearDriver = function () {
                vm.filters.driver = null;
                vm.filters.driverId = null;
            };


            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
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
                            return 1;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer !== null) {
                        vm.filters.customer = customer;
                    }
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.getInvoiceStatus = (accident) => {
                if (accident.invoiceId)
                    return 'Invoiced';
                else if (!accident.invoiceId && accident.excessAmount)
                    return 'Due';
                else if (!accident.excessAmount)
                    return 'N/A';
                else
                    return "";
            };

            vm.getReport = function () {
                vm.loading = true;


                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.driverAgeRange) {
                    vm.filters.fromAgeRange = null;
                    vm.filters.toAgeRange = null;
                }
                if (!vm.filters.movementType)
                    vm.filters.refNo = null;

                
                accidentService.getRepeatedAccidentReport(vm.filters).success(function (data) {

                    vm.reportData = data;

                    if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate === null && !vm.dateRangeModel.startDate === null))
                        initDate();

                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.driverAgeRangeChanged = function () {
                vm.filters.fromAgeRange = null;
                vm.filters.toAgeRange = null;
                if (vm.filters.driverAgeRange) {
                    vm.filters.fromAgeRange = 23;
                    vm.filters.toAgeRange = 25;
                }


            };

            vm.viewAccidentRecord = function (accident) {
                openViewAccidentRecordModal(accident.id);
            };

            function openViewAccidentRecordModal(accidentId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accidents/viewModal.cshtml',
                    controller: 'tenant.views.crs.accidents.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        accidentId: function () {
                            return accidentId;
                        }
                    }
                });
            }
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
                a.download = 'Repeated Accidents Report.xls';
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
                initDate();
                vm.getReport();
            }

            init();
        }
    ]);
