// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:125966-126029
appModule.controller('tenant.views.crs.accounting.investorIncomeStatement.report.index', [
        '$scope', '$uibModalInstance', 'utilities', 'ledgerRows',
        function ($scope, $uibModalInstance, utilities, ledgerRows)
        {
            var vm = this;

            vm.getlocalDate = function (date)
            {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.ledgerRows = ledgerRows;
            vm.cancel = () => $uibModalInstance.close();

            function getTotal(isDebit)
            {
                const totalAmount = ledgerRows.reduce((accumulator, currentDrCr) =>
                {
                    return accumulator + (isDebit ? currentDrCr.debit : currentDrCr.credit);
                }, 0);
                return totalAmount;
            }

            vm.getVoucherType = function (type, subType)
            {
                return utilities.getVoucherType(type, subType);
            };

            vm.roundOf2Decimal = (value) =>
            {
                if (!value) value = 0;
                return utilities.round(value, 2);
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.exportToExcel = (function ()
            {
                var uri = 'data:application/vnd.ms-excel;base64,'
                    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
                    , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
                    , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
                return function (table, name)
                {
                    if (!table) table = document.querySelector('table');
                    if (!table.nodeType) table = document.getElementById(table)
                    var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
                    window.location.href = uri + base64(format(template, ctx))
                }
            })();

            vm.totalDebit = getTotal(true);
            vm.totalCredit = getTotal(false);
            vm.netActivity = vm.roundOf2Decimal(vm.totalDebit - vm.totalCredit, 2);

        }
    ]);
