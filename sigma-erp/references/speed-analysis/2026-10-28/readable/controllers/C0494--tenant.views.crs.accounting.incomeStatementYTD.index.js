// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:125391-125547
appModule.controller('tenant.views.crs.accounting.incomeStatementYTD.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.incomeStatement', 'utilities', 'abp.services.app.costCenter', 'appSession',
        function ($scope, $uibModal, uiGridConstants, incomeStatementService, utilities, costCenterService, appSession) {

            var vm = this;

            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.profitLossStatement = null;

            vm.loading = false;
            vm.isSummaryShow = false;
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
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
            
            function initDate() {
                vm.filters.monthYear = moment().startOf('month');
            }
            vm.getlocalMonth = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM');
                }
                else {
                    return "";
                }
            };

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

            vm.getProfitLossStatement = function () {
                vm.loading = true;

                vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month');
                vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day');
              /*  vm.filters.locationId = vm.filters.locationId;*/
                
                incomeStatementService.getProfitLossStatementYTD(vm.filters).success(function (data) {
                    vm.profitLossStatement = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getCostCenters() {
                costCenterService.getCostCenters().success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }

            function init() {
                if (vm.isCostCenterEnabled) {
                    getCostCenters();
                }
                initDate();
                vm.getProfitLossStatement();
            }

            init();

            vm.exportToExcel = function (tableID) {
                var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('ProfitAndLoss') + '(' + app.localize('CurrentMonth') + ')' + '</b>' + ': ' + vm.rounding(vm.profitLossStatement.profitLoss) + "<b>" + '<br/>' + app.localize('ProfitAndLoss') + '(' + app.localize('CurrentYearToDate') + ')' + "</b>" + ': ' + vm.rounding(vm.profitLossStatement.profitLossCurrentYearToDate) + "<b>" + '<br/>' + app.localize('ProfitAndLoss') + '(' + app.localize('PreviousYearToDate') + ')' + "</b>" + ': ' + vm.rounding(vm.profitLossStatement.profitLossPreviousYearToDate) + "</div><br/>"

                var tab_text = summaryText + "<table border='1px'><tr>";
                var textRange; var j = 0;
                tab = document.getElementById(tableID); // id of table

                for (j = 0 ; j < tab.rows.length ; j++) {

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
