// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:124754-125079
appModule.controller('tenant.views.crs.accounting.incomeStatementFY2.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.journal', 'utilities', 'abp.services.app.fiscalYear', 'appSession',
        function ($scope, $uibModal, uiGridConstants, journalService, utilities, fiscalYearService, appSession) {

            var vm = this;

            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.profitLossStatement = null;

            var noOfMonths = 0;
            var counter = 0;

            vm.loading = false;
            vm.isSummaryShow = false;
            vm.filters = {
                fromDate: null,
                toDate: null,
                doNotShowAccountWithZeroActivity: true,
                state: null,
                locationId: null
            };

            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            vm.clearLocation = function () {
                vm.filters.state = null;
                vm.filters.locationId = null;
                vm.filters.locationName = null;
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getMonth = function (date) {
                if (date != null) {
                    // var localTime = moment.utc(date).toDate();
                    return moment(date).format("MMM-YY");
                }
                else {
                    return "";
                }
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

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            function initDate() {
                vm.filters.monthYear = moment().startOf('month');
            }

            function getFiscalYears() {
                fiscalYearService.getFiscalYears({}).success(function (data) {
                    vm.fiscalYears = data.items;
                }).finally(function () {

                });
            };


            // Testing 
            vm.getProfitLossStatements = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.filters.fiscalYear.startDate;
                vm.filters.toDate = vm.filters.fiscalYear.endDate;


                var toDate = moment(vm.filters.toDate).endOf('day').add('second', 1);

                var differenceInMonths = toDate.diff(moment(vm.filters.fromDate), 'months');
                noOfMonths = differenceInMonths;
                counter = 0;

                var monthNo = 2;
             

                var fromDate = angular.copy(vm.filters.fromDate);
                fromDate = moment(fromDate);
                var fromDateFirst = angular.copy(fromDate);
                var toDateFirst = fromDateFirst.endOf('month').endOf('day');
                var locationId = vm.filters.locationId;  // Assuming locationId is part of vm.filters
                journalService.getProfitLossStatement2({
                    fromDate: fromDate.startOf('day'),
                    toDate: toDateFirst,
                    monthNo: 1,
                    locationId: locationId
                }).success(function (data) {
                    vm.profitLossStatement = data;
                    vm.grossProfitLoss = [];
                    vm.totalProfitLossBeforeSaleOfAssets = [];
                    vm.totalProfitLossOnSaleOfAssets = [];
                    vm.profitLoss = [];
                    vm.grossProfitLoss.push({
                        key: 1,
                        value: vm.profitLossStatement.grossProfitLoss
                    });
                    vm.totalProfitLossBeforeSaleOfAssets.push({
                        key: 1,
                        value: data.totalProfitLossBeforeSaleOfAssets
                    });
                    vm.totalProfitLossOnSaleOfAssets.push({
                        key: 1,
                        value: data.totalProfitLossOnSaleOfAssets
                    });
                    vm.profitLoss.push({
                        key: 1,
                        value: data.profitLoss
                    });
                    var list = [vm.profitLossStatement.accounts, vm.profitLossStatement.profitLossBeforeSaleOfAssets, vm.profitLossStatement.profitLossOnSaleOfAssets];
                    list.forEach(function (accounts) {
                        accounts.forEach(function (row) {
                            if (!row.monthsData)
                                row.monthsData = [];

                            row.monthsData.push({ date: row.date, monthNo: row.monthNo, account: row });
                            fromDate = fromDate.add(1, 'months');
                           
                            while (fromDate <= moment(vm.filters.fiscalYear.endDate)) {
                                var fromDateLoop = angular.copy(fromDate);
                                var toDateLoop = fromDateLoop.endOf('month').endOf('day');
                                vm.getProfitLossStatement({
                                    fromDate: fromDate.startOf('day'),
                                    toDate: toDateLoop,
                                    monthNo: monthNo,
                                    locationId: locationId
                                });
                                fromDate = fromDate.add(1, 'months');
                                monthNo++;
                            }

                        });
                    })

                })
            };

            vm.getProfitLossStatement= function (filters) {
               
                journalService.getProfitLossStatement2(filters).success(function (data) {
                        data.accounts.forEach(function (row) {
                            var rowToAdd = vm.profitLossStatement.accounts.filter(e => e.id == row.id)[0];
                            rowToAdd.monthsData.push({ date: row.date, monthNo: row.monthNo, account: row });

                    });
                    data.profitLossBeforeSaleOfAssets.forEach(function (row) {
                        var rowToAdd = vm.profitLossStatement.profitLossBeforeSaleOfAssets.filter(e => e.id == row.id)[0];
                        rowToAdd.monthsData.push({ date: row.date, monthNo: row.monthNo, account: row });

                    });
                    data.profitLossOnSaleOfAssets.forEach(function (row) {
                        var rowToAdd = vm.profitLossStatement.profitLossOnSaleOfAssets.filter(e => e.id == row.id)[0];
                        rowToAdd.monthsData.push({ date: row.date, monthNo: row.monthNo, account: row });

                    });
                    vm.grossProfitLoss.push({
                        key: filters.monthNo,
                        value:data.grossProfitLoss
                    });
                    vm.totalProfitLossBeforeSaleOfAssets.push({
                        key: filters.monthNo,
                        value: data.totalProfitLossBeforeSaleOfAssets
                    });
                    vm.totalProfitLossOnSaleOfAssets.push({
                        key: filters.monthNo,
                        value: data.totalProfitLossOnSaleOfAssets
                    });
                    vm.profitLoss.push({
                        key: filters.monthNo,
                        value: data.profitLoss
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };




            vm.getTotalByRow = function (monthNo) {
                if (vm.profitLossStatement.accounts)
                {
                    var sum = 0.0;
                    vm.profitLossStatement.accounts.forEach(row => {
                        var months = row.monthsData.filter(e => e.monthNo == monthNo && e.account.isLeaf );
                        if (months.length > 0)
                        {
                            if (months[0].account.accountCategory == 4)
                            {
                                sum = sum + months[0].account.netActivity;
                            }
                            else if (months[0].account.accountCategory == 5)
                            {
                                sum = sum - months[0].account.netActivity;
                            }
                            
                        }
                    });
                    return sum;
                }

            };
            // if want to calculate sum of coloumn
       /*     vm.getTotalByColumn = function (list) {
                if (list) {
                    var sum = 0.0;
                    list.forEach(row => {
                        sum += row.account.netActivity;

                    });
                    return vm.formatNumber(vm.rounding(sum));
                }
                return 0;
            };*/

            vm.hasNonZeroValues = function (list) {
                if (list) {
                    return list.some(row => row.account.netActivity !== 0);
                }
                return false;
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('incomeStatementFyTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";


                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'IncomeStatementFY2.xls';
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
                getFiscalYears();
                
            }

            init();


        }
    ]);
