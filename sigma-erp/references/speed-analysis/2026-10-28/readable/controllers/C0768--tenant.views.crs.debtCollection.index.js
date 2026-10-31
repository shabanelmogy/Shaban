// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:200334-200849
appModule.controller('tenant.views.crs.debtCollection.index', [
        '$scope', 'appSession', 'uiGridConstants', 'abp.services.app.outStandingReport', 'abp.services.app.directory', 'abp.services.app.debtCollection', 'abp.services.app.contactGroup', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.user', '$uibModal',
        function ($scope, appSession, uiGridConstants, outStandingReportService, directoryService, debtCollectionService, contactGroupService, utilities, commonLookupService, userService, $uibModal) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.periods = [];
            vm.periodsday = [];
            vm.periodsdate = [];
            vm.loading = false;
            vm.totalAmount = null;
            vm.statuses = null;
            vm.dueToday = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.unAllocatedAmountShowInReceivableAgeAnalysis = utilities.parseBoolean(abp.setting.get("App.Speed.Common.UnAllocatedAmountShowInReceivableAgeAnalysis"));
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.contactCategories = [
                { id: 1, name: app.localize('Individual') },
                { id: 2, name: app.localize('Company') }
            ];
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
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

            //vm.contactCategories = [{ id: 1, name: app.localize('Person') }, { id: 2, name: app.localize('Company') }];
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 }
            ];
            vm.isBlackListedFilter = [
                { type: "BlackListed", id: 1 },
                { type: "Not BlackListed", id: 2 },
            ];
            vm.locations = [];
            vm.filters = {
                asOfDate: null,
                status: null,
                groupIds: [],
                groups: null,
                salesPersonId: null,
                isPromised: false,
                showCustomersWithoutDebtCollector: false,
                module: null
            };
            vm.isAllBranchUser = appSession.user.branchAccess == 3;
            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements'),
                canSeeAllCustomerDebtCollection: abp.auth.hasPermission('Pages.Tenant.Reports.CanSeeAllCustomerDebtCollection'),
                showCustomersWithoutDebtCollector: abp.auth.hasPermission('Pages.Tenant.Reports.ShowCustomersWithoutDebtCollector'),
            };

            vm.getFollowupsDueToday = function () {
                vm.dateRangeCheck();
                if (vm.dueToday) {
                    vm.data = vm.allData.filter(q => moment(q.nextFollowup) <= moment(vm.filters.asOfDate).endOf('day'));
                } else {
                    vm.data = vm.allData;
                }
            }

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
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("Open") },
                    { id: 2, name: app.localize("Closed") },


                ];
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

            //function getStatuses() {
            //    vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            //};
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.formatBalance = function (balance) {
                if (balance != 0) {
                    return balance > 0 ? 'Dr ' + vm.CurrencyFormate(balance) : 'Cr ' + (-vm.CurrencyFormate(balance));
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

            vm.searchUsers = function ($select) {
                if (!$select.search) return;
                directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.users = response.data.items;
                });
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
            vm.showExceedLimitOnly = false;
            vm.filteredData = []; // this will be used in ng-repeat instead of allData

            vm.filterExceedCreditLimitRecords = function () {
                if (vm.showExceedLimitOnly) {
                    vm.filteredData = vm.allData.filter(function (row) {
                        return row.creditLimit < row.subTotalWithoutUnalloc;
                    });
                } else {
                    vm.filteredData = angular.copy(vm.allData);
                }
            };

            vm.getAgeAnalysisReport = function () {
                vm.loading = true;

                vm.filters.dueToday = vm.dueToday;
                if (vm.permissions.canSeeAllCustomerDebtCollection) {
                    vm.filters.debtCollectorId = null;
                   
                }
                else if (vm.permissions.showCustomersWithoutDebtCollector) {
                    vm.filters.debtCollectorId = null;
                    vm.filters.showCustomersWithoutDebtCollector = true
                }
                else {
                    vm.filters.debtCollectorId = appSession.user.contactId;

                }
                if (vm.filters.groups != null) {
                    vm.filters.groupIds = [];
                    angular.forEach(vm.filters.groups, function (group) {
                        vm.filters.groupIds.push(group.id);
                    });
                }

                vm.filters.salesPersonIds = [];
                if (vm.filters.salesPerson != null && vm.filters.salesPerson.length > 0) {
                    angular.forEach(vm.filters.salesPerson, function (value) {
                        vm.filters.salesPersonIds.push(value.id);
                    });
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

                debtCollectionService.getAgeAnalysisReportView(vm.filters).success(function (data) {
                    vm.allData = data.list;
                    vm.result = data;
                    vm.outPutPeriods = data.periods;

                    vm.creditLimitExceededCount = vm.allData.filter(function (row) {
                        return row.creditLimit < row.subTotalWithoutUnalloc;
                    }).length;
                    vm.filterExceedCreditLimitRecords();
                    vm.getFollowupsDueToday();
                }).finally(function () {
                    vm.loading = false;


                });
            };
            vm.showAllDetails = function (row, withUnallocated) {


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
                ...row.p13Vouchers, ...row.p14Vouchers, ...row.p15Vouchers];
                if (withUnallocated) {
                    allList = allList.concat(...row.unallocatedVouchers);
                }
                vm.showDetailLines(allList);

            }
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
            vm.followup = function (contact) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/debtCollection/followupModal.cshtml',
                    controller: 'tenant.views.crs.debtCollection.followupModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        followupContact: function () {
                            return contact;
                        }

                    }
                });
                modalInstance.result.then(function () {
                    vm.getAgeAnalysisReport();
                });
            };

            vm.openCustomerBlackListModal = function (contact) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/debtCollection/customerBlackListModal.cshtml',
                    controller: 'tenant.views.crs.debtCollection.customerBlackListModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        contact: function () {
                            return contact;
                        }

                    }
                });
                modalInstance.result.then(function (res) {
                    if (res)
                        vm.getAgeAnalysisReport();
                });
            };

            vm.dateRangeModelChanged = function () {
                vm.getFollowupsDueToday();
            };

            vm.dateRangeCheck = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
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
                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'ReceivableAgeAnalyisReport.xls';
                a.click();

            };

            vm.displayContactNos = (row) => {
                let contactsStr = '';
                if (row.mobileNo) {
                    contactsStr += contactsStr ? ', ' + row.mobileNo : row.mobileNo;
                }
                if (row.contactNo) {
                    contactsStr += contactsStr ? ', ' + row.contactNo : row.contactNo;
                }
                if (row.contactNo2) {
                    contactsStr += contactsStr ? ', ' + row.contactNo2 : row.contactNo2;
                }
                return contactsStr;
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


            //function getSelectiveBranches() {
            //    userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
            //        let selectedBranchIds = result;
            //        let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
            //        vm.locations = selectedBranchs;
            //        vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
            //    });
            //}
            //function getAllLocations() {

            //    commonLookupService.getLocations({}).success(function (data) {
            //        vm.locations = data.items;
            //        if (appSession.user.branchAccess == 2)
            //            getSelectiveBranches();
            //        else if (appSession.user.branchAccess == 1) {
            //            vm.filters.locationId = appSession.user.locationId;
            //            vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
            //        }
            //    });
            //}

            function init() {
                vm.filters.asOfDate = moment().endOf('day');
                getStatuses();
                //getStatuses();
                //getAllLocations();
                //vm.getAgeAnalysisReport();
            }

            init();
        }
    ]);
