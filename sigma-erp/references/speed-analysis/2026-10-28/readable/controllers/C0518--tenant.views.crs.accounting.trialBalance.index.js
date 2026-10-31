// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:133219-133591
appModule.controller('tenant.views.crs.accounting.trialBalance.index', [
        '$scope', '$state', 'appSession', '$uibModal', 'uiGridConstants', 'abp.services.app.journal', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.division', 'abp.services.app.costCenter',
        function ($scope, $state, appSession, $uibModal, uiGridConstants, journalService, utilities, commonLookupService, divisionService, costCenterService) {

            var vm = this;

            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;
            vm.isMultiCurrencyForReportsEnabled = abp.features.isEnabled("CRS.CustomFeatures.MulticurrencyReports");
            vm.isDivisionEnabled = abp.features.isEnabled("Core.Divisions");
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.isEnaledExportToExcel2 = vm.tenancyName.toLowerCase() === "almasaood";
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.showDebitwiseExportToExcel = abp.features.isEnabled("CRS.Accounts.TrialBalanceAsDebitorInExportToExcel");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isLocationLocked = false;
            vm.filtersForLedger = {};

            vm.rounding = function (value) {
                //  return utilities.round(value, 2);
                // var result = Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);

                var result = utilities.round(value, 2);
                if (result % 1 != 0) {
                    return result;
                }
                else {
                    return result.toFixed(2);
                }
            };


            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.trialBalance = null;
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return Number(amount).toLocaleString('en-US');
            };
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
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
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
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

            vm.filters = {
                fromDate: null,
                toDate: null,
                doNotShowAccountWithZeroActivity: false,
                doNotShowAccountWithEndingBalance: false,
                isLeafAccount: false,
                depth: 0,
                state: null,
                locationId: null,
                costCenterId: null,
                costCenter2Id: null,
                accountId: null
            };

            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }

            vm.openLedger = (row) => {
                var account = angular.copy(row);
                //replace signs temporarily to avoid url problems
                account.name = account.name.replaceAll('/', 'slash');
                account.name = account.name.replaceAll('&', '-and-');
                var params = { ...vm.filters, account: account };
                var url = $state.href('tenant.crs_ledgerReport', { "filters": params });
                window.open(url, '_blank');
            }

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

            vm.clearLocation = function () {
                if (vm.isLocationLocked) return;
                vm.filters.state = null;
                vm.filters.locationId = null;
                vm.filters.locationName = null;
            };

            vm.exportToExcel2 = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                journalService.exportToExcel2TrialBalance(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getTrialBalance = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.isMultiCurrencyForReportsEnabled) {
                    journalService.getTrialBalanceForMultiCurrency(vm.filters).success(function (data) {
                        vm.trialBalance = data;
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();
                    }).finally(function () {
                        vm.loading = false;
                        vm.getDepths();
                    });
                }
                else {
                    journalService.getTrialBalance(vm.filters).success(function (data) {
                        vm.trialBalance = data;
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();
                    }).finally(function () {
                        vm.loading = false;
                        vm.getDepths();
                    });
                }
            };

            vm.getDebitTrialBalance = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.isMultiCurrencyForReportsEnabled) {
                    journalService.getTrialBalanceForMultiCurrency(vm.filters).success(function (data) {
                        vm.trialBalance = data;
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();
                    }).finally(function () {
                        vm.loading = false;
                        vm.getDebitDepths();
                    });
                }

                journalService.getDebitorTrialBalance(vm.filters).success(function (data) {
                    vm.debitorTrialBalance = data;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                    vm.getDebitDepths();
                });

            };

            vm.exportToExcel = function (tableID) {
                var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('TotalDebit') + '</b>' + ': ' + vm.formatNumber(vm.rounding(vm.trialBalance.totalDebit)) + "<b>" + '<br/>' + app.localize('TotalCredit') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.trialBalance.totalCredit)) + "<b>" + "</div><br/>"
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

                //var ua = window.navigator.userAgent;
                //var msie = ua.indexOf("MSIE ");

                //if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer


                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'trialBalance.xls';
                a.click();
            };

            vm.debitwiseExportToExcel = function (tableID) {
                var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('TotalDebit') + '</b>' + ': ' + vm.formatNumber(vm.rounding(vm.debitorTrialBalance.totalDebit)) + "<b>" + '<br/>' + app.localize('TotalCredit') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.debitorTrialBalance.totalCredit)) + "<b>" + "</div><br/>"
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

                //var ua = window.navigator.userAgent;
                //var msie = ua.indexOf("MSIE ");

                //if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer


                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'trialBalance.xls';
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

            vm.getDepths = function () {
                vm.depths = [];
                if (vm.trialBalance && vm.trialBalance.accounts.length > 0) {
                    var maxDepth = 0;
                    var depths = vm.trialBalance.accounts.map(x => x.depth);
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

            vm.getDebitDepths = function () {
                vm.debitDepths = [];
                if (vm.debitorTrialBalance && vm.debitorTrialBalance.accounts.length > 0) {
                    var maxDepth = 0;
                    var debitDepths = vm.debitorTrialBalance.accounts.map(x => x.depth);
                    if (debitDepths && debitDepths.length > 0) {
                        var maxDepth = Math.max.apply(Math, debitDepths);
                        if (maxDepth > 0) {
                            var allDepths = [];
                            for (var i = 0; i <= maxDepth; i++) {
                                allDepths.push({ id: i + 1, name: `Level - ${i + 1}` });
                            }
                            vm.debitDepths.push(...allDepths);
                            vm.filters.depositDepth = Math.max.apply(Math, vm.debitDepths.map(x => x.id));
                        }
                    }
                }
            }

            function init() {
                initDate();
                getCostCenters();
                getLocations();
                if (vm.isDivisionEnabled) {
                    getDivisions();
                }
                if (!utilities.canViewAnyOtherBranchVouchers() && appSession.user && appSession.user.locationId) {
                    vm.filters.locationId = appSession.user.locationId;
                    vm.isLocationLocked = true;
                }
                vm.getTrialBalance();

                if (vm.showDebitwiseExportToExcel) {
                    vm.getDebitTrialBalance();
                }
            }
            init();

        }
    ]);
