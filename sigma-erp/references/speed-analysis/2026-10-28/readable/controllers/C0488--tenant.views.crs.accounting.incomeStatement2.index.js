// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:123922-124114
appModule.controller('tenant.views.crs.accounting.incomeStatement2.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.journal', 'utilities', 'appSession',
        function ($scope, $uibModal, uiGridConstants, journalService, utilities, appSession) {

            var vm = this;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.profitLossStatement = null;
            vm.isBudgetEnabled = abp.features.isEnabled('CRS.Accounts.Budget');
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(abp.setting.get("App.General.DateFormat"));
                }
                else {
                    return "";
                }
            };
            vm.rounding = function (value) {
                return utilities.round(value, 0);
            };
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.roundinghead = function (value) {
                return utilities.round(value, 2);
            };

            vm.mod = function (value) {
                if (value < 0)
                 return value * -1;
                else
                return value;
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('month'),
                    endDate: moment().endOf('month'),
                };
            }

            vm.filters = {
                fromDate: null,
                toDate: null,
                doNotShowAccountWithZeroActivity: true,
                state: null,
                locationId: null
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

            // Testing 
            /*vm.getProfitLossStatements = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.filters.locationId = vm.filters.locationId;
                var toDate = moment(vm.filters.toDate).endOf('day').add('second', 1);

                var fromDate = angular.copy(vm.filters.fromDate);
                fromDate = moment(fromDate);
                var fromDateFirst = angular.copy(fromDate);
                var toDateFirst = fromDateFirst.endOf('month').endOf('day');
                var locationId = vm.filters.locationId; 

                journalService.getProfitLossStatement({
                    fromDate: fromDate.startOf('day'),
                    toDate: toDateFirst,
                    locationId: locationId
                }).success(function (data) {
                    vm.profitLossStatement = data;
                    vm.profitLossStatement.accounts.forEach(function (row) {
                        fromDate = fromDate.add('month', 1);

                        while (fromDate <= moment(vm.dateRangeModel.endDate)) {
                            var fromDateLoop = angular.copy(fromDate);
                            var toDateLoop = fromDateLoop.endOf('month').endOf('day');
                            vm.getProfitLossStatement({
                                fromDate: fromDate.startOf('day'),
                                toDate: toDateLoop,
                                locationId: locationId
                            });
                            fromDate = fromDate.add('month', 1);
                        }
                    });
                });
            };*/

            vm.getProfitLossStatement = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                journalService.getProfitLossStatement2(vm.filters).success(function (data) {
                    vm.profitLossStatement = data;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                initDate();
                vm.getProfitLossStatement();
            }

            init();

            vm.exportToExcel = function (tableID) {
                var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('Revenue') + '</b>' + ': ' + vm.formatNumber(vm.rounding(vm.profitLossStatement.totalRevenue)) + "<b>" + '<br/>' + app.localize('Expense') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.profitLossStatement.totalExpense)) + "<b>" + '<br/>' + app.localize('ProfitAndLoss') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.profitLossStatement.profitLoss)) + "</div><br/>"

                var tab_text = summaryText + "<table border='1px'><tr>";
                var textRange; var j = 0;
                tab = document.getElementById(tableID); // id of table

                for (j = 0; j < tab.rows.length; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }

                tab_text = tab_text + "</table>";
                //tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
                // tab_text = tab_text.replace(/<img[^>]*>/gi, ""); //remove if u want images in your table
                // tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); //remove input params

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "incomeStatement.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            }
        }
    ]);
