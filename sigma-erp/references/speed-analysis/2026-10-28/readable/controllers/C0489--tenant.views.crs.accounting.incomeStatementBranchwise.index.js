// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:124118-124378
appModule.controller('tenant.views.crs.accounting.incomeStatementBranchwise.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.journal', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.division', 'abp.services.app.costCenter', 'appSession',
        function ($scope, $uibModal, uiGridConstants, journalService, utilities, commonLookupService, divisionService, costCenterService, appSession) {

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
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.isDivisionEnabled = abp.features.isEnabled("Core.Divisions");

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
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
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


            function pagingFunction(totalRows) {
                //first page contains 54 rows and further full pages contains 61 rows
                var rows = totalRows;
                var onlyFirstTime = 1;
                var pageCounter = 1;
                var fullPageRows = 61;
                while (rows > 0) {
                    if (rows && rows > 54 && onlyFirstTime == 1) {
                        $('#incomeStatementTable tr').eq(54 - 1).after('<tr class="removeAfterPrint rowPageBreak"><td colspan="4" class="text-center bold">Page: ' + pageCounter + '</td></tr>');
                        onlyFirstTime++;
                        pageCounter++;
                        rows = rows - 54;
                    }
                    else {
                        if (rows > 61) {
                            $('#incomeStatementTable tr').eq((54 + fullPageRows) - 1).after('<tr class="removeAfterPrint rowPageBreak"><td colspan="4" class="text-center bold">Page:' + pageCounter + '</td></tr>');
                            fullPageRows = fullPageRows + 61;
                            rows = rows - 61;
                            pageCounter++;
                        }
                        else {
                            $('#incomeStatementTable tr:last').after('<tr class="removeAfterPrint"><td colspan="4" class="text-center bold">Page: ' + pageCounter + '</td></tr>');
                            break;
                        }
                    }
                }
            };

            vm.getCostCenterValue = function (costCenterId) {
                var costCenter = vm.costCenters.find(e => e.id == costCenterId);
                return costCenter ? costCenter.name : "";
            };

            window.onbeforeprint = function () {

                var totalRows = $('#incomeStatementTable tr').length;
                pagingFunction(totalRows);
            };


            window.onafterprint = function () {
                $("#incomeStatementTable tr.removeAfterPrint").remove();
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

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            //vm.dateRangeModel = {
            //    startDate: todayAsString,
            //    endDate: todayAsString
            //};
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('month'),
                    endDate: moment().endOf('month'),
                };
            }



            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            function getDivisions() {
                divisionService.searchDivisions().success(function (response) {
                    vm.divisions = response.items;
                });
            }

            function getCostCenters() {
                costCenterService.getCostCenters().success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }

            vm.getProfitLossStatement = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                journalService.branchWiseStatement(vm.filters).success(function (data) {
                    vm.profitLossStatement = data;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            //Not using just for reference...
            vm.exportBranchWiseToExcelOld = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                journalService.exportToExcelIncomeStatementBranchWise(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportBranchWiseToExcel = function ()
            {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                journalService.branchWiseStatementReportExcel(vm.filters).success(function (result)
                {
                    app.downloadTempFile(result);
                }).finally(function ()
                {
                    vm.loading = false;
                });
            };

            function init() {
                initDate();
                getLocations();
                if (vm.isDivisionEnabled) {
                    getDivisions();
                }
                if (vm.isCostCenterEnabled) {
                    getCostCenters();
                }

                vm.getProfitLossStatement();
            }

            init();
            //  this is on screen function to export excel file and it exporting data in row wise now new function is in  journal app service
           /* vm.exportToExcel = function (tableID) {
                //var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('Revenue') + '</b>' + ': ' + vm.formatNumber(vm.rounding(vm.profitLossStatement.totalRevenue)) + "<b>" + '<br/>' + app.localize('Expense') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.profitLossStatement.totalExpense)) + "<b>" + '<br/>' + app.localize('ProfitAndLoss') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.profitLossStatement.profitLoss)) + "</div><br/>"

                var tab_text = "<table border='1px'><tr>";
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
            }*/
        }
    ]);
