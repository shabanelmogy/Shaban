// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:469675-469835
appModule.controller('tenant.views.stock.report.stockPurchaseDetailBillReport.index', ['$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.item', 'abp.services.app.bill', 'utilities', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, itemAppService, billAppService, utilities, directoryService) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.utilities = utilities;
            vm.totalAmount = 0;
            vm.filters = {

            }

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.clearSupplier = function () {
                vm.filters.supplier = null;
                vm.filters.contactId = null;
            };

            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return itemAppService.searchItems({ name: name }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            vm.clearItem = function () {
                vm.filters.item = null;
                vm.filters.itemId = null;
            };


            vm.searchSuppliers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3, activeOnly: true }).then(function (response) {
                    vm.suppliers = response.data.items;
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

            vm.searchSupplierPopoup = function () {
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
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.supplier = supplier;
                        vm.filters.contactId = supplier.id;
                    }
                });
            };

            vm.getPurchaseDetailReport = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(vm.dateFormat)).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(vm.dateFormat)).add(1, 'days').add(-1, 'milliseconds').utc();
                billAppService.getPurchaseDetailBillReport(vm.filters).success(function (data) {
                    vm.reportData = data.items;
                    vm.totalAmount = 0;
                    angular.forEach(vm.reportData, function (value) {
                        vm.totalAmount += value.amount;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('purchaseDetailTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'PurchaseDetailBillReport.xls';
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



            function init() {
                vm.getPurchaseDetailReport();
            }
            init();
        }]);
