// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:255542-255688
appModule.controller('tenant.views.crs.loan.loanDetails.index', ['abp.services.app.paymentPlan', 'utilities',
        function (paymentPlanService, utilities) {
            var vm = this;
            vm.filters = {
                enableDateRange: true,
                DealNo: null,
                fromDate: null,
                toDate: null,
                dateType: 1,
            };


            vm.totalAmount = 0;
            vm.totalInterest = 0;
            vm.totalPaidAmount = 0;
            vm.totalPaidInterest = 0;
            vm.totalDueAmount = 0;
            vm.totalDueInterest = 0;

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.localize = function (input) {
                if (input == null)
                    return "";
                return app.localize(input);
            };

            vm.currencyFormate = function (amount) {
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

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Paid") }, { id: 2, name: app.localize("Unpaid") }];
            };



            vm.getLoadData = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                vm.filters.isPaid = vm.filters.status != null ? vm.filters.status == 1 ? true : false : null;
                paymentPlanService.getLoanDetails(vm.filters)
                    .success(function (result) {
                        vm.loanData = result;

                        vm.totalAmount = vm.loanData.reduce((acc, curr) => acc += curr.amount, 0);
                        vm.totalInterest = vm.loanData.reduce((acc, curr) => acc += curr.interest, 0);
                        vm.totalPaidAmount = vm.loanData.reduce((acc, curr) => acc += curr.paidAmount, 0);
                        vm.totalPaidInterest = vm.loanData.reduce((acc, curr) => acc += curr.paidInterest, 0);
                        vm.totalDueAmount = vm.loanData.reduce((acc, curr) => acc += curr.dueAmount, 0);
                        vm.totalDueInterest = vm.loanData.reduce((acc, curr) => acc += curr.dueInterestAmount, 0);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            }

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";

                var j = 0;
                var tab1 = document.getElementById('loanSummary'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'LoanSummaryReport.xls';
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
                getStatuses();
            }
            init();
        }]);
