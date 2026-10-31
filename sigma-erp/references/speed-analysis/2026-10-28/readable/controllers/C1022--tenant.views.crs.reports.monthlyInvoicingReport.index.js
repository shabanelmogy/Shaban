// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:273892-274091
appModule.controller('tenant.views.crs.reports.monthlyInvoicingReport.index', [
        '$scope', 'abp.services.app.monthlyInvoicingReport', 'utilities', 'abp.services.app.directory', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, monthlyInvoicingReportService, utilities, directoryService, commonLookupService, utilities) {

            var vm = this;
            vm.locations = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            vm.totalTimeWorked = 0;
            vm.totalAmount = 0;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.reportData = null;
            vm.filters = {
                monthYear: new Date(),
                salesPersonId: null,
                salesPerson: null
            };

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 }
            ];

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.customerTypes = [
                { id: 1, name: "Person" },
                { id: 2, name: "Company" },
            ];

            function getLocations() {

                commonLookupService.getLocationsActiveAndInActive({
                }).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };

            vm.searchSalesPersonPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.company.salesPerson = result;

                    }
                });
            };
            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };
            vm.searchUsers = function ($select) {

                return directoryService.search({
                    keyword: $select.search, contactType: 1
                }).then(function (response) {

                    vm.users = response.data.items;
                });
            };

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPerson().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            vm.formatBalanceAsDrCr = function (balance) {
                if (balance > 0)
                    return 'Dr ' + vm.CurrencyFormate(utilities.round(balance, 2));
                else if (balance < 0)
                    return 'Cr ' + vm.CurrencyFormate(utilities.round(-balance, 2));
                else
                    return "0";
            };

            vm.CurrencyFormate = function (amount) {
                if (!amount) return 0;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }

            vm.getMonthlyInvoicingReport = function () {
                vm.loading = true;
                //vm.totalObj = {};

                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').utc();
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').utc();
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }
                monthlyInvoicingReportService.getMonthlyInvoicingReport(vm.filters).success(function (result) {
                    vm.reportData = result;
                    vm.totalBeginningBal = 0;
                    vm.totalRentalLease = 0;
                    vm.totaltolls = 0;
                    vm.totalFines = 0;
                    vm.totalOther = 0;
                    vm.totalBalance = 0;
                    vm.totalCreditNote = 0;
                    vm.totalReceipts = 0;
                    vm.totalEndingBal = 0;
                    angular.forEach(vm.reportData, function (row) {
                        vm.totalBeginningBal += row.beginningBal;
                        vm.totalRentalLease += row.rentalLeaseBal;
                        vm.totaltolls += row.salik;
                        vm.totalFines += row.fines;
                        vm.totalOther += row.otherCharges;
                        vm.totalCreditNote += row.creditNote;
                        vm.totalReceipts += row.receipts;
                        vm.totalEndingBal += row.endingBal;
                    });
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
                a.download = 'RevenueAnalysisReport.xls';
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
                //  getDesignations();
                getLocations();
                vm.searchUsersWithDesignation();
            }

            init();
        }
    ]);
