// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:280441-280666
appModule.controller('tenant.views.crs.reports.saleReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'utilities', 'abp.services.app.saleReport', 'abp.services.app.vehicle', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, utilities, saleReportService, vehicleService, commonLookupService, directoryService) {
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
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            var isSalesPersonWithDesignationSetting = parseInt(abp.setting.get("App.General.SalesPersonDesignation"));
            if (isSalesPersonWithDesignationSetting > 0) {
                vm.isSalesPersonWithDesignation = true;

            }
            else {
                vm.isSalesPersonWithDesignation = false;
            }
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };

            vm.filters = {
                fromDate: null,
                ToDate: null,
                agreementCategory: null,
                agreementType: null,
                contactCategory: null,
                locationId: null,
                salesPerson: null,

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

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPersonOne().then(function (response) {

                    vm.userList = response.data.items;
                });
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
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
            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('salesTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);
             
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'saleReport.xls';
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

            vm.reportModal = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/saleReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.getSaleReport = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate.startOf('day') : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate.endOf('day') : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }

                saleReportService.getSaleReport(vm.filters).success(function (result) {
                    vm.report = result;
                }).finally(function () {
                    vm.loading = false;
                });;
            };
            getLocationsActiveAndInActive();
            vm.changeAgreementCategory();
            vm.searchUsersWithDesignation();
        }
    ]);
