// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:498311-498511
appModule.controller('tenant.views.workshop.workshopReports.jobProfitAndLossReport.index', [
        '$scope', 'abp.services.app.jobProfitAndLossReport', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'abp.services.app.designation',
        function ($scope, jobProfitAndLossAppService, utilities, commonLookupService, directoryService , designationAppService) {

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
                startDate: null,
                endDate: null,
                fromDate: null,
                toDate: null,
                enableDateRange: true,
                plateNo: '',
                chassisNo: '',
                jobNo: '',
                createdBy: null,
                salesPerson: null,
            };

            vm.totalPartsCharges = 0;
            vm.totalPartsCost = 0;
            vm.totalProfitAndLoss = 0;

            vm.dateRangeModel = {
                startDate: moment().add(-29, 'days').startOf('day'),
                endDate: moment().endOf('day')
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };
            vm.CurrencyFormate = function (amount) {
                if (amount === null) return null;
                return amount.toLocaleString('en');
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            //vm.rounding = function (number) {
            //    return utilities.round(number, 2);
            //}
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

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };

            vm.searchCreator = function ($select) {
                if ($select.search == "")
                    return null;
                commonLookupService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.creators = response.data.items;
                });
            };


            vm.searchUsers = function ($select) {

                return directoryService.search({
                    keyword: $select.search, contactType: 1
                }).then(function (response) {

                    vm.users = response.data.items;
                });
            };

            vm.trialBalance = null;
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getJobProfitAndLossReport = function () {
                vm.loading = true;

                //vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    vm.filters.fromDate = vm.filters.startDate;
                    vm.filters.toDate = vm.filters.endDate;
                }

                jobProfitAndLossAppService.getJobProfitAndLossReport(vm.filters).success(function (result) {
                    vm.reportData = result.items;

                    vm.totalPartsCharges = 0;
                    vm.totalPartsCost = 0;
                    vm.totalProfitAndLoss = 0;
                    angular.forEach(vm.reportData, function (val) {
                        vm.totalPartsCharges += val.partsCharges;
                        vm.totalPartsCost += val.partsCost;
                        vm.totalProfitAndLoss += val.profitAndLoss;
                    });


                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    console.log(result);
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
                a.download = 'JobProfitAndLossReport.xls';
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
                initDate();
                //vm.getJobProfitAndLossReport();
            }

            init();
        }
    ]);
