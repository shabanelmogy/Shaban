// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:280781-281030
appModule.controller('tenant.views.crs.reports.saleReportBaseOnInvoice.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.saleReport', 'abp.services.app.vehicle', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'utilities',
        function ($scope, $uibModal, uiGridConstants, saleReportService, vehicleService, commonLookupService, directoryService, utilities) {
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
            vm.dateTimeFormat = vm.dateFormat;
            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };

            vm.filters = {
                fromDate: null,
                toDate: null,
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

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };
            vm.searchUsers = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.users = response.data.items;
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
                            return '~/App/tenant/views/crs/reports/saleReportBaseOnInvoice/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            //function getAgreementTypes() {
            //    vm.agreementTypes = [{ id: 1, name: "Daily" }, { id: 2, name: "Weekly" }, { id: 3, name: "Monthly" }];
            //};

            //vm.getSaleReport = function () {
            //    vm.loading = true;

            //    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate.startOf('day') : moment(moment().format('YYYY-MM-DD')).utc();
            //    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate.endOf('day') : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

            //    if (vm.filters.salesPerson != null) {
            //        vm.filters.salesPersonId = vm.filters.salesPerson.id;
            //    }

            //    saleReportService.getSaleReport(vm.filters).success(function (result) {
            //        vm.report = result;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });;
            //};
            vm.getSaleReportBaseOnInvoice = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate.startOf('day') : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate.endOf('day') : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }

                saleReportService.getSaleReportBaseOnInvoice(vm.filters).success(function (result) {
                    vm.report = result;
                }).finally(function () {
                    vm.loading = false;
                });;
            };

            getLocations();
            vm.getSaleReportBaseOnInvoice();
            //vm.getAgreementType();
            //getAgreementTypes();
            vm.changeAgreementCategory();
        }
    ]);
