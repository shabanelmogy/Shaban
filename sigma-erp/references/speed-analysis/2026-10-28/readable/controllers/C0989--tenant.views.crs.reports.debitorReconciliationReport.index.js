// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:268404-268503
appModule.controller('tenant.views.crs.reports.debitorReconciliationReport.index', [
        '$scope', 'abp.services.app.debitorReconciliationReport', 'utilities',
        function ($scope, debitorReconciliationReportService, utilities) {
            var vm = this;
            vm.month = null;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.locations = [];

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };
            vm.currencyFormat = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.rounding = function (value) {
                if (value) {
                    return utilities.round(value, 2);
                }
                else {
                    return 0.0;
                }
            }
            vm.filters = {
                fromDate: null,
                ToDate: null
            };
            
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange; var j = 0;
                var tab1 = document.getElementById('debitorReconciliationReport'); // id of table

                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");
                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "DebitorReconciliationReport.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            }
            
            vm.getDebitorReconciliationReport = function () {
                vm.loading = true;

                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate.startOf('day') : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate.endOf('day') : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                debitorReconciliationReportService.getReconciliationReport(vm.filters).success(function (result) {
                    vm.report = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };
        }
    ]);
