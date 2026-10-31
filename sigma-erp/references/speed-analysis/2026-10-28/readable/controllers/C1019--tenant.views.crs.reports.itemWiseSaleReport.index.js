// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:273382-273567
appModule.controller('tenant.views.crs.reports.itemWiseSaleReport.index', [
        '$scope', 'utilities', 'abp.services.app.stockTransfer', 'abp.services.app.item', 'abp.services.app.stockReport', 'utilities',
        function ($scope, utilities, stockTransferService, itemAppService, stockReportService, utilities) {

            var vm = this;
            vm.total = 0.0;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
           


            vm.filters = {
                //fromDate: null,
                //toDate: null,
                //skipCount: 0,
                //maxResultCount: app.consts.grid.defaultPageSize,
                //id:null
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.round = function (amount) {
                if (amount == null) return null;
                return utilities.round(amount, 2);
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getVoucherType = function (type) {
                return utilities.getVoucherType(type);
            }

            vm.exportToExcel = function () {
                var tab_text = "<style>#exportTable tr td:first-child {width: 200px;}</style>";
                tab_text += "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('saleReportTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Item Wise Sale Report.xls';
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

            //vm.exportToExcel = function () {
            //    var tab_text = "<table border='1px'><tr>";
            //    var textRange; var j = 0;
            //    var tab = document.getElementById('expenseTable'); // id of table
            //    for (j = 0; j < tab.rows.length; j++) {
            //        tab_text = tab_text;
            //        tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
            //    }
            //    tab_text = tab_text + "</table>";
            //    var ua = window.navigator.userAgent;
            //    var msie = ua.indexOf("MSIE ");

            //    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

            //    {
            //        txtArea1.document.open("txt/html", "replace");
            //        txtArea1.document.write('sep=,\r\n' + tab_text);
            //        txtArea1.document.close();
            //        txtArea1.focus();
            //        sa = txtArea1.document.execCommand("SaveAs", true, "trialBalance.xls");
            //    }

            //    else {
            //        sa = window.open('data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(tab_text), 'Vehicle-Purchase-Report.xlsx');
            //    }

            //    return (sa);
            //};

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            };

            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return itemAppService.searchItems({ name: name }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            vm.clearItem = function () {
                vm.filters.item = null;
                vm.filters.itemId = null;
            };

            vm.getSalesReport = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //vm.total = 0.0;
                
                stockReportService.getItemWiseSaleReport(vm.filters).success(function (data) {
                    vm.saleReport = data.items;


                    //vm.transactions = vm.stockMovementData.transactions;

                    //vm.totalIncoming = vm.transactions.reduce((accumulator, transaction) => accumulator + transaction.inQuantity, 0);
                    //vm.totalOutgoing = vm.transactions.reduce((accumulator, transaction) => accumulator + transaction.outQuantity, 0);
                    //vm.closingBalance = vm.stockMovementData.beginningQuantity + vm.totalIncoming - vm.totalOutgoing;

                }).finally(function () {

                    vm.loading = false;
                });
            }
         

           // function init() {
           //     vm.getStockMovementReport();
           //}

           // init();
        }
    ]);
