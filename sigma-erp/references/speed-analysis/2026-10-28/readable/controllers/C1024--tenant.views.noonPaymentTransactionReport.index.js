// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:274295-274533
appModule.controller('tenant.views.noonPaymentTransactionReport.index', ['abp.services.app.directory', 'abp.services.app.commonAgreement',
        'utilities', 'abp.services.app.noonPayment', 'abp.services.app.saleOrigin', 'utilities',
        function (directoryService, commonAgreementService, utilities, noonPaymentService, saleOriginService, utilities) {

            var vm = this;
            vm.agreementsData = {};
            vm.transactions = [];
            vm.paymentStatuses = null;
            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
                        
            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements')
            };
           
            vm.statuses = null;
            vm.disableDate = false;
            vm.customers = [];
            vm.vehicleTypes = [];
            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                invoiceNo: null,
                startDate: null,
                endDate: null,
                customerId: null,
                paymentStatus: null
            };

            vm.paymentStatuses = [
                { id: 1, name: app.localize("Success") },
                { id: 2, name: app.localize("Failed") }
            ];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
          
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getPaymentStatus = function (status) {

                switch (status) {
                    case 1:
                        return "Success";

                    case 2:
                        return "Failed";

                    default:
                        return "";
                }
            };
            vm.getAttemptName = function (id) {
                if (id === 1)
                    return "1st";
                else if (id === 2)
                    return "2nd";
                else if (id === 3)
                    return "3rd";
                else if (id === 4)
                    return "4th";
                else if (id === 5)
                    return "5th";
                else 
                    return "";
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

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            vm.getNoonPaymentTransactions = function () {
                vm.loading = true;

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
               
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                noonPaymentService.getNoonPaymentTransactionsForReport(vm.filters).success(function (data) {

                    vm.transactions = data.items;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            //vm.exportToExcel = function () {
            //    commonAgreementService.exportToExcelAgreementsReport(vm.filters)
            //        .success(function (result) {
            //            app.downloadTempFile(result);
            //        });
            //};
            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('transactionsTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'noonPaymentTransactionReport.xls';
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
            //function getStatuses() {
            //    vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            //}

            //vm.getStatus = function (id) {
            //    if (id == 1)
            //        return app.localize("Open");
            //    else if (id == 2)
            //        return app.localize("Closed");
            //    else
            //        return "";
            //};

            initializeFilters();

            function initializeFilters() {
                initDate();
                //getStatuses();
                vm.getNoonPaymentTransactions();
            }

        }
    ]);
