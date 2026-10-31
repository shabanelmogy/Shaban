// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:263748-264015
appModule.controller('tenant.views.crs.reports.castleLimoDailyRevenueReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.saleReport', 'abp.services.app.vehicle', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'utilities',
        function ($scope, $uibModal, uiGridConstants, saleReportService, vehicleService, commonLookupService, directoryService, utilities) {
            var vm = this;
            vm.month = null;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.locations = [];
            
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }
            vm.customers = [];
            
            vm.filters = {
                asOfDate: null,
                fromDate: null,
                toDate: null,
                customerId: null,
                locationId: null,

            };
            vm.setToAndFromDates = function () {
                vm.filters.toDate = new Date(vm.filters.asOfDate);
                vm.filters.toDate.setHours(23, 59, 59, 999);
                vm.filters.fromDate = new Date(vm.filters.asOfDate);
                vm.filters.fromDate.setHours(0, 0, 0, 0);
            };

            vm.roundWithSerators = function (amount) {
                if (amount == null) return null;

                // Check if the amount is a whole number (no decimal places)
                const isWholeNumber = amount === Math.floor(amount);

                const formattedAmount = new Intl.NumberFormat('en', {
                    style: 'decimal',
                    minimumFractionDigits: isWholeNumber ? 2 : 2,
                    maximumFractionDigits: 2
                }).format(amount);

                return formattedAmount;
            };

            vm.agreementCategories = [
                { type: "Rental", id: 1 },
            ];
            vm.rentalAgreementOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 }
            ];
            if (abp.features.isEnabled("CRS.Lease")) {
                vm.agreementCategories.push({ type: "Lease", id: 2 });
            }
            if (abp.features.isEnabled("CRS.Chauffeur")) {
                vm.agreementCategories.push({ type: "Chauffeur", id: 4 });
            }
            vm.agreementTypes = [
                { type: app.localize("Daily"), id: 1 },
                { type: app.localize("Weekly"), id: 2 },
                { type: app.localize("Monthly"), id: 3 },
                { type: app.localize("Lease"), id: 4 }
            ];

            vm.changeAgreementCategory = function () {
                vm.agreementTypes = [];
                if (vm.filters.agreementCategory === 1 || vm.filters.agreementCategory === 4) {
                    vm.agreementTypes = [
                        { type: app.localize("Daily"), id: 1 },
                        { type: app.localize("Weekly"), id: 2 },
                        { type: app.localize("Monthly"), id: 3 },
                    ];
                } else if (vm.filters.agreementCategory === 2) {
                    vm.agreementTypes = [
                        { type: app.localize("Lease"), id: 4 }
                    ];
                } else {
                    vm.agreementTypes = [
                        { type: app.localize("Daily"), id: 1 },
                        { type: app.localize("Weekly"), id: 2 },
                        { type: app.localize("Monthly"), id: 3 },
                        { type: app.localize("Lease"), id: 4 }
                    ];
                }
            };

            vm.getAgreementType = function (type) {
                if (type == 1) {
                    return app.localize("Daily")
                }
                else if (type == 2) {
                    return app.localize("Weekly")
                }
                else if (type == 3) {
                    return app.localize("Monthly")
                }
                else if (type == 4) {
                    return app.localize("Lease")
                }
                else if (type == 5) {
                    return app.localize("LeaseToOwn")
                }
                else if (type == 6) {
                    return app.localize("Hourly")
                }
            };

            vm.contactTypes = [
                { type: app.localize("Individual"), id: 1 },
                { type: app.localize("Company"), id: 2 }
            ];

           

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            function getLocations() {

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getStatus = function (x) { // Agreement Status Name
                if (x == 1) {
                    return app.localize('Open');
                } else if (x == 2) {
                    return app.localize('Closed');
                }
            }
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.dateRangeModel = {
                startDate: null,
                endDate: null
            };
            vm.exportToExcel = function () {
                vm.loading = true;

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                saleReportService.exportToExcelDailyRevenueReport(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
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

            vm.reportModal = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/castleLimoDailyRevenueReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.getLimoDailyRevenueReport = function () {
                vm.loading = true;


                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                saleReportService.getDailyRevenueReport(vm.filters).success(function (result) {
                    vm.report = result;

                    vm.sumLimoDaily = 0.0;
                    vm.sumLimoMTD = 0.0;
                    vm.sumRental_LeaseDaily = 0.0;
                    vm.sumRental_LeaseMTD = 0.0;
                    vm.grandTotal = 0.0;

                    vm.sumLimoDaily = vm.report.map(item => item.limoDaily).reduce((acc, limoDaily) => acc + limoDaily, 0);
                    vm.sumLimoMTD = vm.report.map(item => item.limoMTD).reduce((acc, limoMTD) => acc + limoMTD, 0);
                    vm.sumRental_LeaseDaily = vm.report.map(item => item.rental_LeaseDaily).reduce((acc, rental_LeaseDaily) => acc + rental_LeaseDaily, 0);
                    vm.sumRental_LeaseMTD = vm.report.map(item => item.rental_LeaseMTD).reduce((acc, rental_LeaseMTD) => acc + rental_LeaseMTD, 0);
                    vm.grandTotal = vm.sumLimoMTD + vm.sumRental_LeaseMTD;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            getLocations();
            //vm.getLimoDailyRevenueReport();
            vm.changeAgreementCategory();
        }
    ]);
