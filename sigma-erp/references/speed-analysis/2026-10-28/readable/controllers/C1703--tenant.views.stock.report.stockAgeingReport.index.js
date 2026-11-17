// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:469233-469391
appModule.controller('tenant.views.stock.report.stockAgeingReport.index', ['$scope', 'uiGridConstants', 'abp.services.app.stockReport', 'abp.services.app.item', 'utilities', '$uibModal', 'abp.services.app.job', 'abp.services.app.itemType',
        function ($scope, uiGridConstants, stockReportService, itemAppService, utilities, $uibModal, jobAppService, itemTypeService) {

            var vm = this;
            vm.loading = false;
            vm.utilities = utilities;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.asOfDate = moment();
            vm.filters = {
                itemTypeId: null,
                asOfDate: moment().toDate(),
                enableDateRange: true,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            }

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
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
                            return 3;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getStockAgeingReport = function () {
                vm.loading = true;;
                stockReportService.getStockAgeingReport(vm.filters).success(function (data) {
                    vm.reportData = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getItemTypes = function () {
                vm.loading = true;

                itemTypeService.getItemTypes({}).success(function (data) {
                    vm.itemTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return itemAppService.searchItems({ name: name, itemTypeId: vm.filters.itemTypeId }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            vm.clearItem = function () {
                vm.filters.item = null;
                vm.filters.itemId = null;
            };

            vm.clearItemType = function () {
                vm.filters.itemType = null;
                vm.filters.itemTypeId = null;
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('stockTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'StockAgeingReport.xls';
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


            vm.rounding = function (value) {
                if (value) {
                    return utilities.round(value, 2);
                }
            }

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getStockAgeingReport();
                    eventOnKeyPress.preventDefault();
                }
            }

            function init() {
                vm.getItemTypes();
                //vm.getStockAgeingReport();
            }
            init();
        }]);
