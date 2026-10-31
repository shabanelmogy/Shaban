// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:270093-270233
appModule.controller('tenant.views.crs.reports.expenseReportsByAccount.index', [
        '$scope', 'abp.services.app.expenseReportByAccountName', 'abp.services.app.directory', '$uibModal','utilities',
        function ($scope, expenseReport, directoryService, $uibModal, utilities) {
            var vm = this;
            vm.suppliers = [];
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.filters = {
                enableDateRange: true,
                startDate: null,
                endDate: null,
                contactId: null
            };

            vm.exportToExcel = function (exportTable) {
                var tab_text = "<style>#exportTable tr td:first-child {width: 200px;}</style>";
                tab_text += "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById(exportTable); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Expense Report By Account.xls';
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

            vm.searchSupplier = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.clearSupplier = function () {
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.round = function (amount) {
                if (amount == null) return null;
                return utilities.round(amount,2);
            };

            // extended search using search contact popup
            vm.searchContactPopoup = function () {
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
                }).result.then(function (contact) {
                    if (contact != null) {
                        vm.filters.contact = contact;
                        vm.filters.contactId = contact.id;
                    }
                });
            };

            vm.dateRangeModel = {
                startDate: todayAsString,
                endDate: todayAsString
            };
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            };

            vm.getExpenseReportByAccountName = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                
                expenseReport.getExpenseReport(vm.filters).success(function (data) {
                    vm.expenseReportRecords = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getExpenseReportByAccountName();
        }
    ]);
