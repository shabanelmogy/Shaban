// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:498515-498676
appModule.controller('tenant.views.workshop.workshopReports.revenueAnalysisReport.index', [
        '$scope', 'abp.services.app.revenueAnalysisReport', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.designation',
        function ($scope, revenueAnalysisReportAppService, utilities, commonLookupService, designationAppService) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            vm.totalTimeWorked = 0;
            vm.totalAmount = 0;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.reportData = null;
            vm.filters = {
               
                monthYear: new Date(),
                plateNo: '',
                chassisNo: '',
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('month'),
                    endDate: moment().endOf('month'),
                };
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            var groupBy = function (jobCharges, key) {
                let groupByArray = jobCharges.reduce((r, a) => {
                    r[a[key]] = [...r[a[key]] || [], a];
                    return r;
                }, {});
                return groupByArray;
            };


            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            function getDesignations() {
                vm.loading = true;
                designationAppService.getDesignations()
                    .success(function (result) {
                        vm.designations = result.items;
                        vm.filters.designationId = vm.designations[0].id;
                    })
                    .error(function () {
                        vm.loading = false;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }


            vm.getDesignationName = function () {
                if (vm.filters.designationId)
                    vm.DesignationName = vm.designations.filter(e => e.id == vm.filters.designationId)[0].name;
            };

            vm.totalTimeWorkedInHours = function (items) {
                return items.reduce(function (accumulator, item) {
                    return accumulator + item.timeWorkedHours;
                }, 0);
            };

            vm.totatAmountByRow = function (items) {
                return items.reduce(function (accumulator, item) {
                    return accumulator + item.amount;
                }, 0);
            };

            vm.getRevenueReport = function () {
                vm.loading = true;
                vm.totalTimeWorked = 0;
                vm.totalAmount = 0;
                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').utc();
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').startOf('day').utc();
                revenueAnalysisReportAppService.getRevenueReport(vm.filters).success(function (result) {
                    vm.reportData = result.items;
                    vm.distinctStaff = [...new Set(vm.reportData.map(e => e.staffId))].length;

                    angular.forEach(vm.reportData, function (value) {
                        vm.totalTimeWorked = vm.totalTimeWorked + value.timeWorkedHours;
                        vm.totalAmount = vm.totalAmount + value.amount;
                    });
                    vm.reportData = groupBy(vm.reportData, 'jobNo');
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportToExcel = function (tableId) {
                var tab_text = "<table border='1px'><tr>";
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
                a.download = 'RevenueAnalysisReport.xls';
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
                getDesignations();
            }

            init();
        }
    ]);
