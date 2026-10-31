// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:277756-278370
appModule.controller('tenant.views.crs.reports.receivableAgeAnalysis.index', [
        '$scope', 'appSession', 'uiGridConstants', 'abp.services.app.outStandingReport', 'abp.services.app.directory', 'abp.services.app.receivableAgeAnalysisReport', 'abp.services.app.contactGroup', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.user', '$uibModal', 'abp.services.app.currency',
        function ($scope, appSession, uiGridConstants, outStandingReportService, directoryService, receivableAgeAnalysisReportService, contactGroupService, utilities, commonLookupService, userService, $uibModal, currencyService) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.periods = [];
            vm.customerGroups = [];
            vm.periodsday = [];
            vm.periodsdate = [];
            vm.loading = false;
            vm.totalAmount = null;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.tenantId = appSession.tenant.tenantId;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.unAllocatedAmountShowInReceivableAgeAnalysis = utilities.parseBoolean(abp.setting.get("App.Speed.Common.UnAllocatedAmountShowInReceivableAgeAnalysis"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.showCustomDetails = abp.features.isEnabled("CRS.CustomFeatures.ShowCustomDetailsInReceivableAgeAnalysis");
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.isMulticurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.showOutstandingVoucherLinesInCustomerAgingExport = abp.features.isEnabled("CRS.CustomFeatures.ShowOutstandingVoucherLinesInCustomerAgingExport");
            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            if (abp.features.isEnabled("CRS.Transportation"))
                vm.modules.push({ name: 'Transportation', id: 4 });
            if (abp.features.isEnabled("CRS.Chauffeur"))
                vm.modules.push({ name: 'Chauffeur', id: 5 });
            if (abp.features.isEnabled("WORKSHOP"))
                vm.modules.push({ name: 'Workshop', id: 6 });
            if (abp.features.isEnabled("ERS"))
                vm.modules.push({ name: 'Equipment', id: 7 });
            if (abp.features.isEnabled("CRS.AccessoriesRental"))
                vm.modules.push({ name: 'Accessories Rental', id: 8 });
            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: 'Sales', id: 9 });

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.locations = [];
            vm.filters = {
                asOfDate: null,
                customerId: null,
                customerCategory: null,
                status: null,
                groupIds: [],
                groups: null,
                salesPersonId: null,
                salesPerson: null,
                currencyId: null,
                currency: null,
                module: null
            };
            vm.isAllBranchUser = appSession.user.branchAccess == 3;
            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements'),
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.periodChange = function () {
                if (vm.period != false) {
                    vm.periodChangeDay();
                    vm.periodby = 0;
                }
                else {
                    vm.periodsdate = [];
                    vm.periodsday = [];
                    vm.periodby = null;
                }
            };

            vm.periodChangeDay = function () {
                if (vm.periodsday.length == 0) {
                    vm.periodsday.push({ fromDay: 0, toDay: 30 });
                    vm.periodsday.push({ fromDay: 31, toDay: 60 });
                    vm.periodsday.push({ fromDay: 61, toDay: 90 });
                    vm.periodsday.push({ fromDay: 91, toDay: 120 });
                    vm.periodsday.push({ fromDay: 121, toDay: 150 });
                    vm.periodsday.push({ fromDay: 151, toDay: 180 });
                    vm.periodsday.push({ fromDay: 181, toDay: null });
                }
            };
            //vm.datechange = function (todate) {

            //    vm.periodsdate({ lowerDate: angular.copy(vm.periodsdate[4].upperDate).subtract({ 'days': 1 }), upperDate: moment(vm.periodsdate[4].upperDate).subtract({ 'days': 1, 'months': 1 }) });

            //};
            vm.periodChangeDate = function () {

                if (vm.periodsdate.length == 0) {
                    vm.periodsdate.push({ lowerDate: vm.filters.asOfDate.startOf('day'), upperDate: moment(vm.filters.asOfDate.startOf('day')).startOf('month') });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[0].upperDate).add('days', -2).endOf('month').startOf('day'), upperDate: moment(vm.periodsdate[0].upperDate).subtract({ 'days': 1 }).startOf('month') });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[1].upperDate).subtract({ 'days': 1 }).endOf('month').startOf('day'), upperDate: moment(vm.periodsdate[1].upperDate).subtract({ 'days': 1 }).startOf('month') });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[2].upperDate).subtract({ 'days': 1 }).endOf('month').startOf('day'), upperDate: moment(vm.periodsdate[2].upperDate).subtract({ 'days': 1 }).startOf('month') });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[3].upperDate).subtract({ 'days': 1 }).endOf('month').startOf('day'), upperDate: moment(vm.periodsdate[3].upperDate).subtract({ 'days': 1 }).startOf('month') });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[4].upperDate).subtract({ 'days': 1 }).endOf('month').startOf('day'), upperDate: moment(vm.periodsdate[4].upperDate).subtract({ 'days': 1 }).startOf('month') });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[5].upperDate).subtract({ 'days': 1 }).endOf('month').startOf('day'), upperDate: null });
                }
            };

            vm.calculateperioddays = function () {
                vm.periods = [];
                for (var i = 0; i < vm.periodsdate.length; i++) {
                    vm.periods.push({
                        fromDay: vm.filters.asOfDate.startOf('day').diff(vm.periodsdate[i].lowerDate.startOf('day'), 'days'),
                        //toDay: vm.periodsdate[i].upperDate != null ? vm.rounding(moment.duration(vm.filters.asOfDate.startOf('day').diff(vm.periodsdate[i].upperDate)).asDays()) : null
                        toDay: vm.periodsdate[i].upperDate != null ? vm.filters.asOfDate.startOf('day').diff(vm.periodsdate[i].upperDate.startOf('day'), 'days') : null

                    });
                }
            };

            vm.upperDateChanged = function (row) {
                var dateChangeIndex = vm.periodsdate.indexOf(row);
                vm.periodsdate[dateChangeIndex + 1].lowerDate = angular.copy(vm.periodsdate[dateChangeIndex].upperDate).subtract({ 'days': 1 });


            }


            vm.rounding = function (value) {
                return utilities.round(value, 0);
            };


            vm.addRowDay = function () {
                vm.periodsday.push({ fromDay: null, toDay: null });
            };
            vm.addRowDate = function () {
                if (vm.periodsdate[vm.periodsdate.length - 1].upperDate)
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[vm.periodsdate.length - 1].upperDate).subtract({ 'days': 1 }).endOf('month').startOf('day') });
                //vm.periodsdate.push({ lowerDate: moment(vm.periodsdate[vm.periodsdate.length - 1].upperDate).subtract({ 'days': 1 }), upperDate: moment(vm.periodsdate[vm.periodsdate.length - 1].upperDate).subtract({ 'days': 1, 'months': 1 }) });
            };
            vm.removeRowDay = function (row) {
                var index = vm.periodsday.indexOf(row);
                vm.periodsday.splice(index, 1);
            };
            vm.removeRowDate = function (row) {
                var index = vm.periodsdate.indexOf(row);
                vm.periodsdate.splice(index, 1);
            };

            vm.customerCategories = [
                { id: 1, name: app.localize('Individual') }, { id: 2, name: app.localize('Company') }
            ];

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.formatBalance = function (balance) {
                if (balance != 0) {
                    return balance > 0 ? 'Dr ' + vm.CurrencyFormate(balance) : 'Cr ' + (vm.CurrencyFormate(-balance));
                }
                return balance;
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

            function getCustomerGroups() {
                vm.loading = true;

                contactGroupService.getContactGroupsOnContactType({ contactType: 2 }).success(function (result) {
                    vm.customerGroups = result.items;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchUsers = function ($select) {
                if (!$select.search) return;
                directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPersonOne().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };

            vm.getYearMonth = function (date) {
                if (date != null) {
                    return moment(date).format("DD-MMM-YY");
                }
                else {
                    return "";
                }
            };

            vm.getAgeAnalysisReport = function () {
                vm.loading = true;
                if (vm.filters.customerId) {
                    vm.filters.customerCategory = null;
                    vm.filters.groupIds = null;
                    vm.filters.salesPersonId = null;
                    vm.filters.salesPerson = null;
                }

                if (vm.filters.groups != null) {
                    vm.filters.groupIds = [];
                    angular.forEach(vm.filters.groups, function (group) {
                        vm.filters.groupIds.push(group.id);
                    });
                }

                vm.filters.salesPersonId = [];
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }
                vm.filters.currencyId = [];
                if (vm.filters.currency != null) {
                    vm.filters.currencyId = vm.filters.currency.id;
                }
                if (vm.filters.currency == null) {
                    vm.filters.salesPersonId = null;
                }

                if (vm.periodby == 0) {
                    vm.periodsday.forEach(function (row, index) {
                        row.periodNo = ++index;
                    });
                    vm.filters.periods = vm.periodsday;

                }
                else if (vm.periodby == 1) {
                    vm.calculateperioddays();
                    vm.periods.forEach(function (row, index) {
                        row.periodNo = ++index;
                    });
                    vm.filters.periods = vm.periods;

                }

                if (vm.period == false) {
                    vm.filters.periods = [];
                }
                vm.filters.asOfDate = vm.filters.asOfDate.endOf('day');


                if (vm.periodby == 1) {
                    if (vm.periodsdate.length <= 0) {
                        abp.message.info("Periods List Can not be  Empty");
                        vm.loading = false;
                        return;
                    }
                    if (vm.periodsdate[vm.periodsdate.length - 1].upperDate) {
                        abp.message.info("Periods Are not Fine");
                        vm.loading = false;
                        return;
                    }
                    if (vm.periodsdate.filter(row => row.lowerDate != null && row.upperDate != null && row.upperDate > row.lowerDate).length > 0) {
                        abp.message.info("Periods Are not Fine");
                        vm.loading = false;
                        return;
                    }

                }
                vm.filters.contactCategory = vm.filters.customerCategory;
                receivableAgeAnalysisReportService.getAgeAnalysisReportSp(vm.filters).success(function (data) {
                    vm.data = data.list;

                    vm.sum1 = [];
                    vm.allSum = [];
                    vm.sum2 = [];
                    vm.sum3 = [];
                    vm.sum4 = [];
                    vm.sum5 = [];
                    vm.sum6 = [];
                    vm.sum7 = [];
                    vm.sum8 = [];
                    vm.sum9 = [];
                    vm.sum10 = [];
                    vm.sum11 = [];
                    vm.sum12 = [];
                    vm.sum13 = [];
                    vm.sum14 = [];
                    vm.sum15 = [];
                    vm.sumOfUnAllocated = [];
                    vm.sumOfBalance = [];
                    angular.forEach(vm.data, function (row) {
                        if (row.p1Vouchers)
                            vm.sum1.push(...row.p1Vouchers);

                        if (row.p2Vouchers)
                            vm.sum2.push(...row.p2Vouchers);

                        if (row.p3Vouchers)
                            vm.sum3.push(...row.p3Vouchers);

                        if (row.p4Vouchers)
                            vm.sum4.push(...row.p4Vouchers);

                        if (row.p5Vouchers)
                            vm.sum5.push(...row.p5Vouchers);

                        if (row.p6Vouchers)
                            vm.sum6.push(...row.p6Vouchers);

                        if (row.p7Vouchers)
                            vm.sum7.push(...row.p7Vouchers);

                        if (row.p8Vouchers)
                            vm.sum8.push(...row.p8Vouchers);

                        if (row.p9Vouchers)
                            vm.sum9.push(...row.p9Vouchers);

                        if (row.p10Vouchers)
                            vm.sum10.push(...row.p10Vouchers);

                        if (row.p11Vouchers)
                            vm.sum11.push(...row.p11Vouchers);

                        if (row.p12Vouchers)
                            vm.sum12.push(...row.p12Vouchers);

                        if (row.p13Vouchers)
                            vm.sum13.push(...row.p13Vouchers);

                        if (row.p14Vouchers)
                            vm.sum14.push(...row.p14Vouchers);

                        if (row.p15Vouchers)
                            vm.sum15.push(...row.p15Vouchers);

                        if (row.unallocatedVouchers)
                            vm.sumOfUnAllocated.push(...row.unallocatedVouchers);

                        if (row.unallocatedVouchers)
                            vm.sumOfBalance.push(...row.unallocatedVouchers);


                        if (!row.p1Vouchers)
                            row.p1Vouchers = [];
                        if (!row.p2Vouchers)
                            row.p2Vouchers = [];
                        if (!row.p3Vouchers)
                            row.p3Vouchers = [];
                        if (!row.p4Vouchers)
                            row.p4Vouchers = [];
                        if (!row.p5Vouchers)
                            row.p5Vouchers = [];
                        if (!row.p6Vouchers)
                            row.p6Vouchers = [];
                        if (!row.p7Vouchers)
                            row.p7Vouchers = [];
                        if (!row.p8Vouchers)
                            row.p8Vouchers = [];
                        if (!row.p9Vouchers)
                            row.p9Vouchers = [];
                        if (!row.p10Vouchers)
                            row.p10Vouchers = [];
                        if (!row.p11Vouchers)
                            row.p11Vouchers = [];
                        if (!row.p12Vouchers)
                            row.p12Vouchers = [];
                        if (!row.p13Vouchers)
                            row.p13Vouchers = [];
                        if (!row.p14Vouchers)
                            row.p14Vouchers = [];
                        if (!row.p15Vouchers)
                            row.p15Vouchers = [];
                        if (!row.unallocatedVouchers)
                            row.unallocatedVouchers = [];

                            var allList = [...row.p1Vouchers, ...row.p2Vouchers, ...row.p3Vouchers, ...row.p4Vouchers,
                            ...row.p5Vouchers, ...row.p6Vouchers, ...row.p7Vouchers, ...row.p8Vouchers,
                            ...row.p9Vouchers, ...row.p10Vouchers, ...row.p11Vouchers, ...row.p12Vouchers,
                            ...row.p13Vouchers, ...row.p14Vouchers, ...row.p15Vouchers, row.unallocatedVouchers];
                        
                        vm.allSum.push(...allList);

                    });
                    vm.result = data;
                    vm.outPutPeriods = data.periods;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.showDetailLines = function (detailLines) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/receivableAgeAnalysis/details.cshtml',
                    controller: 'tenant.views.crs.reports.receivableAgeAnalysis.details as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        detailLines: function () {
                            return detailLines;
                        }
                    }
                });

            };
            vm.exportToExcel = function (tableId) {
                var tab_text = "<table border='1px'><tr>" + "<td><b>As of Date</b></td><td>" + vm.filters.asOfDate.format(vm.dateFormat) + "</td><tr></tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                var blob = b64toBlob(btoa(unescape(encodeURIComponent("\uFEFF" + tab_text))), "application/vnd.ms-excel;charset=utf-8");
                var blobUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'ReceivableAgeAnalyisReport.xls';
                a.click();

            };

            vm.exportDetailExcel = function () {

                vm.loading = true;

                receivableAgeAnalysisReportService.exportToExcelDetail(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    })
                    .finally(function () {
                        vm.loading = false;
                    });

            };
            vm.showAllDetails = function (row) {


                if (!row.p1Vouchers)
                    row.p1Vouchers = [];
                if (!row.p2Vouchers)
                    row.p2Vouchers = [];
                if (!row.p3Vouchers)
                    row.p3Vouchers = [];
                if (!row.p4Vouchers)
                    row.p4Vouchers = [];
                if (!row.p5Vouchers)
                    row.p5Vouchers = [];
                if (!row.p6Vouchers)
                    row.p6Vouchers = [];
                if (!row.p7Vouchers)
                    row.p7Vouchers = [];
                if (!row.p8Vouchers)
                    row.p8Vouchers = [];
                if (!row.p9Vouchers)
                    row.p9Vouchers = [];
                if (!row.p10Vouchers)
                    row.p10Vouchers = [];
                if (!row.p11Vouchers)
                    row.p11Vouchers = [];
                if (!row.p12Vouchers)
                    row.p12Vouchers = [];
                if (!row.p13Vouchers)
                    row.p13Vouchers = [];
                if (!row.p14Vouchers)
                    row.p14Vouchers = [];
                if (!row.p15Vouchers)
                    row.p15Vouchers = [];
                if (!row.unallocatedVouchers)
                    row.unallocatedVouchers = [];

                    var allList = [...row.p1Vouchers, ...row.p2Vouchers, ...row.p3Vouchers, ...row.p4Vouchers,
                    ...row.p5Vouchers, ...row.p6Vouchers, ...row.p7Vouchers, ...row.p8Vouchers,
                    ...row.p9Vouchers, ...row.p10Vouchers, ...row.p11Vouchers, ...row.p12Vouchers,
                    ...row.p13Vouchers, ...row.p14Vouchers, ...row.p15Vouchers, row.unallocatedVouchers];
                
                vm.showDetailLines(allList);

            }
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

            //vm.exportToExcel = function () {
            //    vm.loading = true;
            //    if (vm.filters.customerId) {
            //        vm.filters.customerCategory = null;
            //        vm.filters.groupIds = null;
            //        vm.filters.salesPersonId = null;
            //        vm.filters.salesPerson = null;
            //    }

            //    if (vm.filters.groups != null) {
            //        vm.filters.groupIds = [];
            //        angular.forEach(vm.filters.groups, function (group) {
            //            vm.filters.groupIds.push(group.id);
            //        });
            //    }

            //    vm.filters.salesPersonIds = [];
            //    if (vm.filters.salesPerson != null && vm.filters.salesPerson.length > 0) {
            //        angular.forEach(vm.filters.salesPerson, function (value) {
            //            vm.filters.salesPersonIds.push(value.id);
            //        });
            //    }

            //    receivableAgeAnalysisReportService.exportToExcel(vm.filters).success(function (result) {
            //        app.downloadTempFile(result);
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                    vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
                });
            }
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    if (appSession.user.branchAccess == 2)
                        getSelectiveBranches();
                    else if (appSession.user.branchAccess == 1) {
                        vm.filters.locationId = appSession.user.locationId;
                        vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                    }
                });
            }
            vm.getCurrencies = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                vm.filters.asOfDate = moment().endOf('day');
                getCustomerGroups();
                getStatuses();
                getLocationsActiveAndInActive();
                vm.searchUsersWithDesignation();
                vm.getCurrencies();

            }

            init();
        }
    ]);
