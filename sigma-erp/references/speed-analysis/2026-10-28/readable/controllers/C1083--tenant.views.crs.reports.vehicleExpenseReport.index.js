// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:286958-287074
appModule.controller('tenant.views.crs.reports.vehicleExpenseReport.index', [
        '$scope', 'utilities', 'abp.services.app.vehicleExpenseReport','utilities',
        function ($scope, utilities, vehicleExpenseReportAppService, utilities) {

            var vm = this;
            vm.total = 0.0;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
           


            vm.filters = {
                fromDate: null,
                toDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
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
                return utilities.round(amount, 2);
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


            vm.exportToExcel = function myfunction() {
                var tab_text = "<table border='1px'><tr>";
                var textRange; var j = 0;
                var tab = document.getElementById('expenseTable'); // id of table
                for (j = 0; j < tab.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                tab_text = tab_text + "<h2>Total: " + vm.CurrencyFormate(vm.total)+"</h2>";
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "trialBalance.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            };


            vm.getVehicleExpenseReport = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.total = 0.0;

                vehicleExpenseReportAppService.getVehicleExpenseReport(vm.filters).success(function (data) {
                    vm.vehicleExpenseReportData = data.items;
                   for (var i = 0; i < vm.vehicleExpenseReportData.length; i++) {
                        vm.total += vm.vehicleExpenseReportData[i].amount;
                    }
                    vm.total = Number(vm.total).toFixed(0);

                }).finally(function () {

                    vm.loading = false;
                });
            }
         

            function init() {
                vm.getVehicleExpenseReport();
           }

            init();
        }
    ]);
