// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:281160-281326
appModule.controller('tenant.views.crs.reports.salePerformanceReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.agreement', 'abp.services.app.agreementSalePerformanceReport', 'abp.services.app.vehicle', 'abp.services.app.commonLookup',
        'abp.services.app.directory', 'utilities',
        function ($scope, $uibModal, uiGridConstants, agreementService, agreementSalePerformanceService, vehicleService, commonLookupService, directoryService, utilities) {
            var vm = this;
            vm.month = null;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.locations = [];

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };
            vm.currencyFormat = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.rounding = function (value) {
                if (value) {
                    return utilities.round(value, 2);
                }
                else {
                    return 0.0;
                }
            }
            vm.filters = {
                fromDate: null,
                ToDate: null,
                agreementType: null,
                agreementCategory: null,
                locationId: null,
                salesPerson: null,

            };
            vm.agreementCategories = [
                { type: "Rental", id: 1 },
            ];

            if (abp.features.isEnabled("CRS.Lease")) {
                vm.agreementCategories.push({ type: "Lease", id: 2 });
            }
            if (abp.features.isEnabled("CRS.Chauffeur")) {
                vm.agreementCategories.push({ type: "Chauffeur", id: 4 });
            }
            vm.agreementTypes = [
                //{ type: app.localize("Daily"), id: 1 },
                //{ type: app.localize("Weekly"), id: 2 },
                //{ type: app.localize("Monthly"), id: 3 },
                //{ type: app.localize("Lease"), id: 4 }
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
                if (type == 1) return app.localize("Daily");
                else if (type == 2) return app.localize("Weekly");
                else if (type == 3) return app.localize("Monthly");
                else if (type == 4) return app.localize("Lease");
            };

            vm.contactTypes = [
                { type: app.localize("Individual"), id: 1 },
                { type: app.localize("Company"), id: 2 }
            ];

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };
            vm.searchUsers = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.users = response.data.items;
                });
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
            function getLocations() {
                vm.loading = true;
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.exportToExcel = function (id) {
                vm.loading = true;

                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate.startOf('day') : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate.endOf('day') : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }

                agreementSalePerformanceService.exportToExcelSalePerformanceReport(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.getSalePerformanceReport = function () {
                vm.loading = true;

                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate.startOf('day') : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate.endOf('day') : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }

                agreementSalePerformanceService.getSalePerformanceReport(vm.filters).success(function (result) {
                    vm.report = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            getLocations();
        }
    ]);
