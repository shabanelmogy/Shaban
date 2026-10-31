// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:276739-276909
appModule.controller('tenant.views.crs.reports.pointInTime.index',[
        '$scope', 'abp.services.app.directory', 'utilities',  'abp.services.app.agreementSalePerformanceReport',
        function ($scope, directoryService, utilities, agreementSalePerformanceReport) {
           

            var vm = this;
            $scope.$on('$viewContentLoaded',
                function () {
                    App.initAjax();
                });
            vm.date = moment();
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));


            vm.filters = {
                enableDateRange: true,
                startDate: null,
                endDate: null,
                salesPersonId: null,
                salesPerson : null
            };

            vm.getAgreementType = function(agreementTypeNo) {
                if (agreementTypeNo == 1) {
                    return 'Daily';
                } else if (agreementTypeNo == 2) {
                    return 'Weekly';
                } else if (agreementTypeNo == 3) {
                    return 'Monthly';
                } else if (agreementTypeNo == 4) {
                    return 'Lease';
                } else if (agreementTypeNo == 5) {
                    return 'LeaseToOwn';
                } else {
                    return 'NA';
                }
            };

            vm.currencyFormat = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.searchUsers = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(
                    function (response) {
                        vm.users = response.data.items;
                    });
            };

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPerson().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPersonId = null;
                vm.filters.salesPerson = null;
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
                a.download = 'Point In Time Sales Performance Report.xls';
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

            var sumAmounts = function () {
                vm.totals = {};
                vm.totals = vm.pointInTimeSalePerformanceRecord.reduce((accumulator, current) => {

                        accumulator.totalNoOfAgreements = accumulator.totalNoOfAgreements || 0;
                        accumulator.totalAvgrentperday = accumulator.totalAvgrentperday || 0;
                        accumulator.totalAvgAdditionalperday = accumulator.totalAvgAdditionalperday || 0;
                        accumulator.totalAvgperday = accumulator.totalAvgperday || 0;

                        accumulator.totalRentPerDay = accumulator.totalRentPerDay || 0;
                        accumulator.totalAdditionalPerDay = accumulator.totalAdditionalPerDay || 0;
                        accumulator.totalperday = accumulator.totalperday || 0;


                        accumulator.totalNoOfAgreements = accumulator.totalNoOfAgreements + current.noOfAgreements;
                        accumulator.totalAvgrentperday = accumulator.totalAvgrentperday + current.averageRentRate;
                        accumulator.totalAvgAdditionalperday =
                            accumulator.totalAvgAdditionalperday + current.averageAdditionalRate;
                        accumulator.totalAvgperday = accumulator.totalAvgperday + current.totalAverageRate;

                        accumulator.totalRentPerDay = accumulator.totalRentPerDay + current.dailyRentRateTotal;
                        accumulator.totalAdditionalPerDay =
                            accumulator.totalAdditionalPerDay + current.dailyAdditionalRateTotal;
                        accumulator.totalperday = accumulator.totalperday + current.totalRate;

                        return accumulator;
                    },
                    {});
            }

            vm.getPointInTimeSalePerformanceReport = function () {
                vm.loading = true;
                vm.filters.startDate = moment(vm.date).startOf('day');
                vm.filters.endDate = moment(vm.date).endOf('day');

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }
                agreementSalePerformanceReport.getPointInTimeSalePerformanceReport(vm.filters).success(
                    function(data) {
                        vm.pointInTimeSalePerformanceRecord = data;
                        sumAmounts();
                    }).finally(function() {
                    vm.loading = false;
                });
            };
            function init() {
                vm.getPointInTimeSalePerformanceReport();
                vm.searchUsersWithDesignation();
            }
            init();

        }]);
