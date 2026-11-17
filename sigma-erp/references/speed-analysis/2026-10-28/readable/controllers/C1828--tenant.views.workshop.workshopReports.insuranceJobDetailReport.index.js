// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:498161-498307
appModule.controller('tenant.views.workshop.workshopReports.insuranceJobDetailReport.index', [
        '$scope', 'abp.services.app.insuranceJobDetailReport', 'utilities', 'abp.services.app.commonLookup', '$uibModal', 'abp.services.app.directory',
        function ($scope, insuranceJobDetailReportAppService, utilities, commonLookupService, $uibModal, directoryService) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.invoiceInsuranceNumber = utilities.parseBoolean(abp.setting.get("App.Speed.Common.InsuranceInvoiceNumberInJobDetailInsuranceReport"));
            vm.reportData = null;
            vm.filters = {
                fromDate: null,
                toDate: null,
                company: null,
                closedJobs: false
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('month'),
                    endDate: moment().endOf('month'),
                };
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.searchCompanies = function ($select) {
                return directoryService.search({ keyword: $select.search, contactCategory: 2}).then(function (response) {
                    vm.companies = response.data.items;
                });
            };

            vm.clearCompany = function () {
                vm.filters.company = null;
                vm.filters.companyId = null;
            };


            vm.searchCompanyPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return 2;
                        },
                        type: function () {
                            return null;
                        }
                    }
                }).result.then(function (company) {
                    if (company !== null) {
                        vm.filters.company = company;
                    }
                });
            };

            vm.getinsuranceReport = function () {
                vm.loading = true;

                if (vm.filters.company) {
                    vm.filters.companyId = vm.filters.company.id;
                }
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                insuranceJobDetailReportAppService.getinsuranceReport(vm.filters).success(function (result) {
                    vm.reportData = result.items;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportToExcel = function (tableId) {
                var tab_text = "<table border='1px'><tr>";
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
                a.download = 'JobInsuranceDetailReport.xls';
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
                vm.getinsuranceReport();
            }

            init();
        }
    ]);
