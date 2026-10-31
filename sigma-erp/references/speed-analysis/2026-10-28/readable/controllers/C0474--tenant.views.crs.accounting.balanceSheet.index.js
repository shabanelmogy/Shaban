// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:121438-121639
appModule.controller('tenant.views.crs.accounting.balanceSheet.index', [
        '$scope', '$uibModal', '$state', 'uiGridConstants', 'abp.services.app.journal', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.division', 'appSession',
        function ($scope, $uibModal, $state, uiGridConstants, journalService, utilities, commonLookupService, divisionService, appSession) {

            var vm = this;
            vm.balanceSheet = null;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;
            vm.isMultiCurrencyReportsEnabled = abp.features.isEnabled('CRS.CustomFeatures.MulticurrencyReports');
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.isLocationLocked = false;

            vm.loading = false;
            vm.isDivisionEnabled = abp.features.isEnabled("Core.Divisions");
            vm.asOfDate = moment().endOf('day');
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.filters = {
                asOfDate: null,
                doNotShowAccountWithZeroActivity: true,
                state: null,
                depth: 0,
                locationId: null
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
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
                if (vm.isLocationLocked) return;
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

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.clearLocation = function () {
                if (vm.isLocationLocked) return;
                vm.filters.state = null;
                vm.filters.locationId = null;
                vm.filters.locationName = null;
            };
            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    if (vm.isLocationLocked && !vm.filters.locationName) {
                        var userLoc = vm.locations.find(l => l.id === vm.filters.locationId);
                        if (userLoc) vm.filters.locationName = userLoc.name;
                    }
                });
            };

            function getDivisions() {
                divisionService.searchDivisions().success(function (response) {
                    vm.divisions = response.items;
                });
            }


            vm.getBalanceSheet = function () {
                vm.loading = true;
                vm.filters.asOfDate = vm.asOfDate.endOf('day');
                if (vm.isMultiCurrencyReportsEnabled) {
                    journalService.getBalanceSheetForMultiCurrency(vm.filters).success(function (data) {
                        vm.balanceSheet = data;
                    }).finally(function () {
                        vm.loading = false;
                        vm.getDepths();
                    });
                }
                else {
                    journalService.getBalanceSheet(vm.filters).success(function (data) {
                        vm.balanceSheet = data;
                    }).finally(function () {
                        vm.loading = false;
                        vm.getDepths();
                    });
                }
            };

            vm.getDepths = function () {
                vm.depths = [];
                if (vm.balanceSheet && vm.balanceSheet.accounts.length > 0) {
                    var maxDepth = 0;
                    var depths = vm.balanceSheet.accounts.map(x => x.depth);
                    if (depths && depths.length > 0) {
                        var maxDepth = Math.max.apply(Math, depths);
                        if (maxDepth > 0) {
                            var allDepths = [];
                            for (var i = 0; i <= maxDepth; i++) {
                                allDepths.push({ id: i + 1, name: `Level - ${i + 1}` });
                            }
                            vm.depths.push(...allDepths);
                            vm.filters.depth = Math.max.apply(Math, vm.depths.map(x => x.id));
                        }
                    }
                }
            }



            vm.exportToExcel = function (tableID) {
                var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('Assets') + '</b>' + ': ' + vm.formatNumber(vm.rounding(vm.balanceSheet.totalAssets)) + "<b>" + '<br/>' + app.localize('LiabilityPlusEquity') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.balanceSheet.totalLiability + vm.balanceSheet.totalEquity)) + "<b>" + "</div><br/>"
                var tab_text = summaryText + "<table border='1px'><tr>";
                var textRange;
                var j = 0;
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
                    sa = txtArea1.document.execCommand("SaveAs", true, "balanceSheet.xls");
                } else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            };

            vm.openLedger = (row) => {
                var account = angular.copy(row);
                //replace signs temporarily to avoid url problems
                account.name = account.name.replaceAll('/', 'slash');
                account.name = account.name.replaceAll('&', '-and-');
                var params = { ...vm.filters, account: account };
                params.toDate = params.asOfDate;
                params.fromDate = moment(params.asOfDate).add('days', -30);

                var url = $state.href('tenant.crs_ledgerReport', { "filters": params });
                window.open(url, '_blank');
            };

            function init() {
                getLocations();
                if (vm.isDivisionEnabled) {
                    getDivisions();
                }
                if (!utilities.canViewAnyOtherBranchVouchers() && appSession.user && appSession.user.locationId) {                    vm.filters.locationId = appSession.user.locationId;
                    vm.filters.locationName = appSession.user.locationName; // TODO: confirm this exists too, else look it up from vm.locations after getLocations() resolves
                    vm.isLocationLocked = true;
                }
                vm.getBalanceSheet();
            };

            init();
        }
    ]);
