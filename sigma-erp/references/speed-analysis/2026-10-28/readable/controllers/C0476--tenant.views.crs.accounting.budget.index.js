// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:121955-122115
appModule.controller('tenant.views.crs.accounting.budget.index', [
        '$scope', 'abp.services.app.fiscalYear', 'abp.services.app.budget', 'utilities',
        function ($scope, fiscalYearService, budgetService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.filters = {
                accountCategory: null,
                startDate: null,
                endDate: null,
            };

            vm.AccountCategory = {
                "": null,
                Asset: 1,
                Liability: 2,
                Equity: 3,
                Revenue: 4,
                Expense: 5
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getFiscalYears = function () {
                vm.loading = true;
                fiscalYearService.getFiscalYears().success(function (data) {
                    vm.fiscalYears = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.CurrencyFormate = function (amount) {
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

            vm.createOrUpdateBudget = function () {
                vm.loading = true;
                budgetService.craeteOrUpdateBuget({ budget: vm.budget }).success(function (result) {
                }).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.loading = false;
                    vm.getBudget();
                });
            };

            vm.getBudget = function () {
                vm.loading = true;
                vm.filters.startDate = vm.fiscalYear.startDate;
                vm.filters.endDate = vm.fiscalYear.endDate;
                vm.filters.fiscalYearId = vm.fiscalYear.id;
                budgetService.getBudget(vm.filters).success(function (result) {
                    vm.budget = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
          
            vm.getTotalByRow = function (row) {
                if (vm.budget) {
                    var sum = 0.0;
                    var budgetRowToFind = vm.budget.filter(e => e.accountId == row.accountId);
                    if (budgetRowToFind.length > 0) {
                        sum = budgetRowToFind[0].monthsData.map(m => m.amount).reduce((total, amount) => total + amount, 0)
                    }
                    return vm.rounding(sum);
                }

            };

            vm.getTotalByMonth = function (budget) {
                if (vm.budget) {                
                    vm.sumList = [];                    
                    var sumResult = 0;
                    for (var i = 0; i < budget[0].monthsData.length; i++) {
                        angular.forEach(budget, function (value, key) {
                             sumResult += value.monthsData[i].amount;
                        });
                        vm.sumList.push(sumResult);
                        sumResult = 0;
                    }
                    vm.CurrencyFormate(vm.rounding(vm.sumList));
                }
            };
            vm.getTotal = function () {
                if (vm.sumList) {
                    vm.total = vm.sumList.reduce((total, amount) => total + amount, 0);
                }
                vm.CurrencyFormate(vm.rounding(vm.total));
            };
            vm.exportToExcel = function (TableId) {


                var tab_text = "<table border='1px'><tr>";
                var j = 0;
                tab = document.getElementById(TableId); // id of table
                for (j = 0; j < tab.rows.length; j++) {
                    tab_text = tab_text;                   
                    tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";                   
                }
                tab_text = tab_text + "</table>";               
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");
                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "Budget.xlsx");
                }
                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }
                return (sa);
            };

            function init() {

                vm.getFiscalYears();

            }

            init();
        }
    ]);
