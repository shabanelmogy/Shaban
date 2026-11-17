// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:121643-121951
appModule.controller('tenant.views.crs.accounting.balanceSheetMonthwise.index', [
        '$scope', '$uibModal', '$state', 'uiGridConstants', 'abp.services.app.journal', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.division', 'appSession', 'abp.services.app.driverTimeSheetForAgreement',
        function ($scope, $uibModal, $state, uiGridConstants, journalService, utilities, commonLookupService, divisionService, appSession, driverTimeSheetForAgreementService) {

            var vm = this;
            vm.balanceSheet = null;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.isDivisionEnabled = abp.features.isEnabled("Core.Divisions");
            vm.asOfDate = moment().endOf('day');
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.filters = {
                asOfDate: null,
                doNotShowAccountWithZeroActivity: false,
                state: null,
                locationId: null,
                toDate: null,
                fromDate: null,
                period: 12
            };
            vm.periods = [
                { id: 1, name: '01' },
                { id: 2, name: '02' },
                { id: 3, name: '03' },
                { id: 4, name: '04' },
                { id: 5, name: '05' },
                { id: 6, name: '06' },
                { id: 7, name: '07' },
                { id: 8, name: '08' },
                { id: 9, name: '09' },
                { id: 10, name: '10' },
                { id: 11, name: '11' },
                { id: 12, name: '12' }
            ];
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.stateBranchPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/locations/stateBranchModal.cshtml',
                    controller: 'tenant.views.common.locations.searchContactModal as vm',
                    backdrop: 'static',
                }).result.then(function (branch) {
                    if (branch.id != null) {
                        vm.filters.state = null;
                        vm.filters.locationName = branch.name;
                        vm.filters.locationId = branch.id;
                    }
                    else {
                        vm.filters.locationId = null;
                        vm.filters.state = branch;
                        vm.filters.locationName = branch;

                    }
                });
            };
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.clearLocation = function () {
                vm.filters.state = null;
                vm.filters.locationId = null;
                vm.filters.locationName = null;
            };
            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            function getDivisions() {
                divisionService.searchDivisions().success(function (response) {
                    vm.divisions = response.items;
                });
            }
            vm.totalAssets = 0.0;
            vm.totalLiability = 0.0;
            vm.totalEquity = 0.0;

            vm.monthCount = 0;
            //vm.getBalanceSheet = function () {
            //    vm.monthCount = 0;
            //    vm.loading = true;
            //    var monthNo = 0;
            //    var incrementalDate = null;
            //    vm.toDate = angular.copy(vm.asOfDate.endOf('month').endOf('day'));
            //    vm.filters.asOfDate = moment(vm.toDate).subtract(12, 'months').endOf('month').endOf('day');
            //    vm.filters.asOfDate = moment(vm.filters.asOfDate).add(1, 'month').endOf('month').endOf('day');

            //    journalService.getBalanceSheet(
            //        vm.filters
            //    ).success(function (data) {
            //        vm.balanceSheet = data;
            //        vm.balanceSheet.accounts.forEach(function (row) {
            //            if (!row.monthsData)
            //                row.monthsData = [];

            //            monthNo = 1;

            //            incrementalDate = moment(vm.filters.asOfDate);
            //            var rowTemp = angular.copy(row);
            //            rowTemp.monthsData = null;
            //            row.monthsData.push({ date: incrementalDate, monthNo: monthNo, account: rowTemp });
            //        });

            //        monthNo = 2;
            //        incrementalDate = moment(vm.filters.asOfDate).add(1, 'month').endOf('month');
            //        while (vm.filters.asOfDate < vm.toDate) {
            //            vm.filters.asOfDate = vm.filters.asOfDate.add(1, 'month').endOf('month');
            //            vm.getBalanceStatement(monthNo, incrementalDate);
            //            monthNo++;
            //            incrementalDate = moment(vm.filters.asOfDate).add(1, 'month').endOf('month');;
            //        };

            //        vm.monthCount++;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            //vm.getBalanceStatement = function (monthNo, incrementalDate) {

            //    /*filters.devisionId = vm.filters.devisionId;*/
            //    journalService.getBalanceSheet(vm.filters).success(function (data) {
            //        data.accounts.forEach(function (row) {
            //            var rowToAdd = vm.balanceSheet.accounts.filter(e => e.id == row.id)[0];
            //            rowToAdd.monthsData.push({ date: incrementalDate, monthNo: monthNo, account: row });
            //            vm.balanceSheet.accounts.forEach(function (row) {
            //                if (!row.isZeroRated)
            //                    row.isZeroRated = row.monthsData.some(item => item.account.netActivity > 0);
            //            });
            //        });
            //        vm.monthCount++;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};
            vm.getBalanceSheet = function () {
                vm.monthCount = 0;
                vm.loading = true;
                var monthNo = 0;
                var incrementalDate = null;
                vm.toDate = angular.copy(vm.asOfDate.endOf('month').endOf('day'));
                vm.filters.asOfDate = moment(vm.toDate).subtract(vm.filters.period - 1, 'months').endOf('month').endOf('day');
                //vm.filters.asOfDate = moment(vm.filters.asOfDate).add(1, 'month').endOf('month').endOf('day');

                journalService.getBalanceSheet(
                    vm.filters
                ).success(function (data) {
                    vm.balanceSheet = data;
                    vm.balanceSheet.accounts.forEach(function (row) {
                        if (!row.monthsData)
                            row.monthsData = [];

                        monthNo = 1;

                        incrementalDate = moment(vm.filters.asOfDate);
                        var rowTemp = angular.copy(row);
                        rowTemp.monthsData = null;
                        row.monthsData.push({ date: incrementalDate, monthNo: monthNo, account: rowTemp });
                        if (vm.filters.period == 1) {
                            if (!row.isZeroRated)
                                row.isZeroRated = row.monthsData.some(item => item.account.netActivity != 0);
                        }
                    });

                    monthNo = 2;
                    incrementalDate = moment(vm.filters.asOfDate).add(1, 'month').endOf('month');
                    while (vm.filters.asOfDate < vm.toDate) {
                        vm.filters.asOfDate = vm.filters.asOfDate.add(1, 'month').endOf('month');
                        vm.getBalanceStatement(monthNo, incrementalDate);
                        monthNo++;
                        incrementalDate = moment(vm.filters.asOfDate).add(1, 'month').endOf('month');;
                    };

                    vm.monthCount++;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getBalanceStatement = function (monthNo, incrementalDate) {

                /*filters.devisionId = vm.filters.devisionId;*/
                journalService.getBalanceSheet(vm.filters).success(function (data) {
                    data.accounts.forEach(function (row) {
                        var rowToAdd = vm.balanceSheet.accounts.filter(e => e.id == row.id)[0];
                        rowToAdd.monthsData.push({ date: incrementalDate, monthNo: monthNo, account: row });
                        vm.balanceSheet.accounts.forEach(function (row) {
                            if (!row.isZeroRated)
                                row.isZeroRated = row.monthsData.some(item => item.account.netActivity != 0);
                        });
                    });
                    vm.monthCount++;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getMonth = function (date) {
                if (date != null) {
                    //var localTime = moment.utc(date).toDate();
                    //date = moment(date).subtract(1, 'month');
                    return moment(date).format("MMM-YY");
                }
                else {
                    return "";
                }
            };
            vm.checkZeroActivity = function (account) {
                var result = account.monthsData.some(item => item.account.netActivity > 0);
                return result;
            }
            //vm.exportToExcel = function (tableID) {
            //    var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('Assets') + '</b>' + ': ' + vm.formatNumber(vm.rounding(vm.totalAssets)) + "<b>" + '<br/>' + app.localize('LiabilityPlusEquity') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.totalLiability + vm.totalEquity)) + "<b>" + "</div><br/>"
            //    var tab_text = summaryText + "<table border='1px'><tr>";
            //    var textRange;
            //    var j = 0;
            //    tab = document.getElementById(tableID); // id of table

            //    for (j = 0; j < tab.rows.length; j++) {

            //        tab_text = tab_text;

            //        tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
            //        //tab_text=tab_text+"</tr>";
            //    }

            //    tab_text = tab_text + "</table>";
            //    //tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
            //    // tab_text = tab_text.replace(/<img[^>]*>/gi, ""); //remove if u want images in your table
            //    // tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); //remove input params

            //    var ua = window.navigator.userAgent;
            //    var msie = ua.indexOf("MSIE ");

            //    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
            //    {
            //        txtArea1.document.open("txt/html", "replace");
            //        txtArea1.document.write('sep=,\r\n' + tab_text);
            //        txtArea1.document.close();
            //        txtArea1.focus();
            //        sa = txtArea1.document.execCommand("SaveAs", true, "balanceSheet.xls");
            //    } else {
            //        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
            //    }

            //    return (sa);
            //};

            vm.exportToExcel = function () {
                journalService.exportBalanceSheetMonthwise({
                    data: vm.balanceSheet,
                    filters: vm.filters
                })
                    .success((result) => {
                        app.downloadTempFile(result);
                    });
            };

            vm.openLedger = (row) => {
                var account = angular.copy(row);
                //replace signs temporarily to avoid url problems
                account.name = account.name.replaceAll('/', 'slash');
                account.name = account.name.replaceAll('&', '-and-');
                var params = { ...vm.filters, account: account };
                params.toDate = params.asOfDate;
                params.fromDate = moment(params.asOfDate).add('months', -12);
                params.fromDate = moment(params.fromDate).startOf('month');

                var url = $state.href('tenant.crs_ledgerReport', { "filters": params });
                window.open(url, '_blank');
            };

            function init() {
                getLocations();
                if (vm.isDivisionEnabled) {
                    getDivisions();
                }
                //vm.getBalanceSheet();
            };

            init();
        }
    ]);
