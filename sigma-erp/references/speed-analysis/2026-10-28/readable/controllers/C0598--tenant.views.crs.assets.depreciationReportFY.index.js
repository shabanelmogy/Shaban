// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:162801-162953
appModule.controller('tenant.views.crs.assets.depreciationReportFY.index', [
        '$scope', '$uibModal', 'abp.services.app.depreciationReportFY', 'abp.services.app.fiscalYear',  'abp.services.app.commonLookup', '$filter',
        function ($scope, $uibModal, depreciationReportFYService, fiscalYearService,lookupService, $filter) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.filters = {
                fiscalYear: null,
                locationId: null
            };

            function getFiscalYears() {
                fiscalYearService.getFiscalYears({}).success(function (data) {
                    vm.fiscalYears = data.items;
                }).finally(function () {

                });
            };
            function getLocations() {
                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.getLocationName = function () {
                if (!vm.locations || !vm.filters.locationId)
                    return null;
                angular.forEach(vm.locations, function (value, key) {
                    if (value.id == vm.filters.locationId) {
                        vm.locationName = value.name;
                        return;
                    }
                });
            };
            vm.getLocationNameTwo = function (id) {
                var loc = vm.locations.find(x => x.id === id);
                return loc ? loc.name : '';
            };
            vm.getPerColumTotal = function (data, obj) {
                var sum = 0.0;
                data.forEach(function (value) {
                    if (obj) {
                        var foundLines = $filter('filter')(value.monthsData, {
                            monthDate: obj.monthDate,
                        }, true);
                        sum = sum + foundLines[0].debit;
                    }
                });
                return vm.CurrencyFormate(sum);

            };

            vm.getSumBookAndDepreciationValue = function (data, type) {
                if (type == 'depreciation') {
                    var sum = 0.0;
                    data.forEach(function (value) {
                        sum = sum + value.previousDepreciation;
                    });
                    return vm.CurrencyFormate(sum);
                }
                else if (type == 'bookValue') {
                    var sum = 0.0;
                    data.forEach(function (value) {
                        sum = sum + value.bookValue;
                    });
                    return vm.CurrencyFormate(sum);
                }
                else {
                    return 0;
                }
            }

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
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

            vm.getMonth = function (date) {
                if (date != null) {
                    // var localTime = moment.utc(date).toDate();
                    return moment(date).format("MMM-YY");
                }
                else {
                    return "";
                }
            };

            vm.exportToExcelMethod = function (tableID) {

                var tab_text = "<table border='1px'><tr>";
                var textRange; var j = 0;
                tab = document.getElementById(tableID); // id of table

                for (j = 0; j < tab.rows.length; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
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
                    sa = txtArea1.document.execCommand("SaveAs", true, "depreciationReportFY.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            };

            vm.getDepreciationReportFY = function () {
                vm.loading = true;
                depreciationReportFYService.getDepreciationReportFY(vm.filters.fiscalYear).success(function (result) {
                    console.log(result);
                    vm.report = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            getFiscalYears();
            getLocations();
        }
    ]);
