// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:276287-276608
appModule.controller('tenant.views.crs.reports.payableAgeAnalysis.index', [
        '$scope', '$uibModal', 'appSession', 'uiGridConstants', 'abp.services.app.outStandingReport', 'abp.services.app.directory', 'abp.services.app.payableAgeAnalysisReport', 'abp.services.app.contactGroup',
        function ($scope, $uibModal, appSession, uiGridConstants, outStandingReportService, directoryService, payableAgeAnalysisReportService, contactGroupService) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.periods = [];
            vm.periodsday = [];
            vm.periodsdate = [];   
            vm.supplierGroups = [];
            vm.loading = false;
            vm.totalAmount = null;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.tenantId = appSession.tenant.tenantId;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.chargesWiseExportToExcelInPayableAgeAnalysis = abp.features.isEnabled("CRS.CustomFeatures.ChargesWiseExportToExcelInPayableAgeAnalysis");
            vm.filters = {
                asOfDate: null,
                supplierId: null,
                groupIds: [],
                groups: null,
              
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
           
            vm.periodChangeDate = function () {

                if (vm.periodsdate.length == 0) {
                    vm.periodsdate.push({ lowerDate: vm.filters.asOfDate.startOf('day'), upperDate: moment(vm.filters.asOfDate).subtract({ 'months': 1 }) });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[0].upperDate).subtract({ 'days': 1 }), upperDate: moment(vm.periodsdate[0].upperDate).subtract({ 'days': 1, 'months': 1 }) });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[1].upperDate).subtract({ 'days': 1 }), upperDate: moment(vm.periodsdate[1].upperDate).subtract({ 'days': 1, 'months': 1 }) });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[2].upperDate).subtract({ 'days': 1 }), upperDate: moment(vm.periodsdate[2].upperDate).subtract({ 'days': 1, 'months': 1 }) });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[3].upperDate).subtract({ 'days': 1 }), upperDate: moment(vm.periodsdate[3].upperDate).subtract({ 'days': 1, 'months': 1 }) });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[4].upperDate).subtract({ 'days': 1 }), upperDate: moment(vm.periodsdate[4].upperDate).subtract({ 'days': 1, 'months': 1 }) });
                    vm.periodsdate.push({ lowerDate: angular.copy(vm.periodsdate[5].upperDate).subtract({ 'days': 1 }), upperDate: null });
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
                vm.periodsdate.push({ lowerDate: moment(vm.periodsdate[vm.periodsdate.length - 1].upperDate).subtract({ 'days': 1 }), upperDate: moment(vm.periodsdate[vm.periodsdate.length - 1].upperDate).subtract({ 'days': 1, 'months': 1 }) });
            };

            vm.removeRowDay = function (row) {
                var index = vm.periodsday.indexOf(row);
                vm.periodsday.splice(index, 1);
            };

            vm.removeRowDate = function (row) {
                var index = vm.periodsdate.indexOf(row);
                vm.periodsdate.splice(index, 1);
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            //where balance = Credit - Debit
            vm.formatBalance = function (balance) {
                if (balance != 0) {
                    return balance > 0 ? 'Cr ' + vm.CurrencyFormate(balance) : 'Dr ' + (vm.CurrencyFormate (-balance));
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

            function getSupplierGroups() {
                vm.loading = true;
                contactGroupService.getContactGroupsOnContactType({ contactType: 3 }).success(function (result) {
                    vm.supplierGroups = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchUsers = function ($select) {
                if (!$select.search) return;
                directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.clearSupplier = function () {
                vm.filters.supplier = null;
                vm.filters.supplierId = null;
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

                if (vm.filters.supplierId) {
                    vm.filters.groupIds = null;
                }

                if (vm.filters.groups != null) {
                    vm.filters.groupIds = [];
                    angular.forEach(vm.filters.groups, function (group) {
                        vm.filters.groupIds.push(group.id);
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

                payableAgeAnalysisReportService.getAgeAnalysisReport(vm.filters).success(function (data) {
                    vm.data = data.list;
                    vm.result = data;
                    vm.outPutPeriods = data.periods;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportDetailExcel = function () {

                vm.loading = true;

                payableAgeAnalysisReportService.exportToExcelDetail(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    })
                    .finally(function () {
                        vm.loading = false;
                    });

            };
            //vm.exportToExcel = function () {
            //    vm.loading = true;
            //    if (vm.filters.supplierId) {
            //        vm.filters.groupIds = null;
                  
            //    }

            //    if (vm.filters.groups != null) {
            //        vm.filters.groupIds = [];
            //        angular.forEach(vm.filters.groups, function (group) {
            //            vm.filters.groupIds.push(group.id);
            //        });
            //    }

            //    vm.filters.asOfDate = vm.filters.asOfDate.endOf('day');

            //    payableAgeAnalysisReportService.exportToExcel(vm.filters).success(function (result) {
            //        app.downloadTempFile(result);
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            vm.exportToExcel = function (tableId) {
                var tab_text = "<table border='1px'><tr>";
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
                a.download = 'PayableAgeAnalyisReport.xls';
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

            function init() {
                vm.filters.asOfDate = moment().endOf('day');
                getSupplierGroups();
            }

            init();
        }
    ]);
