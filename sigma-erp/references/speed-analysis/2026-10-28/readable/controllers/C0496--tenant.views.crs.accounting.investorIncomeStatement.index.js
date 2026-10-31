// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:125691-125962
appModule.controller('tenant.views.crs.accounting.investorIncomeStatement.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'utilities', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.journal',
        function ($scope, $uibModal, uiGridConstants, utilities, commonLookupService, appSession, journalService)
        {

            var vm = this;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;
            $scope.$on('$viewContentLoaded', function ()
            {
                App.initAjax();
            });

            vm.profitLossStatement = null;
            vm.isBudgetEnabled = abp.features.isEnabled('CRS.Accounts.Budget');
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.formatNumber = function (amount)
            {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
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


            vm.filters = {
                fromDate: null,
                toDate: null,
                doNotShowAccountWithZeroActivity: true,
                state: null,
                locationId: null
            };


            vm.vehicleOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 },
                { key: 'Buy Back', value: 3 },
                { key: 'Investor', value: 7 },
            ];


            window.onbeforeprint = function ()
            {

                var totalRows = $('#incomeStatementTable tr').length;
                pagingFunction(totalRows);
            };


            window.onafterprint = function ()
            {
                $("#incomeStatementTable tr.removeAfterPrint").remove();
            };


            vm.clearContact = function ()
            {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.searchCustomerPopoup = function ()
            {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function ()
                        {
                            return null;
                        },
                        type: function ()
                        {
                            return 2;
                        }
                    }
                }).result.then(function (customer)
                {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };

            vm.searchOwner = function ($select)
            {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return commonLookupService.searchContact({ keyword: $select.search }).then(function (response)
                {
                    vm.contactOwner = response.data.items;
                });
            };
            vm.stateBranchPopoup = function ()
            {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/locations/stateBranchModal.cshtml',
                    controller: 'tenant.views.common.locations.searchContactModal as vm',
                    backdrop: 'static',
                }).result.then(function (branch)
                {
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

            vm.clearLocation = function ()
            {
                vm.filters.state = null;
                vm.filters.locationId = null;
                vm.filters.locationName = null;
            };

            vm.rounding = function (value)
            {
                if (!value) value = 0;
                return utilities.round(value, 2);
            };

            function initDate()
            {
                vm.dateRangeModel = {
                    startDate: moment().startOf('month'),
                    endDate: moment().endOf('month'),
                };
            }


            function getLocations()
            {
                commonLookupService.getLocations({}).success(function (data)
                {
                    vm.locations = data.items;
                });
            };

            vm.getInvestorProfitLossStatementForVehicle = function ()
            {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                    vm.filters.investorId = vm.filters.customer.id;
                }

                journalService.getInvestorProfitLossStatementForVehicle(vm.filters).success(function (data)
                {
                    vm.profitLossStatement = data;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function ()
                {
                    vm.loading = false;
                });
            };

            function init()
            {
                initDate();
                getLocations();
            }

            init();

            vm.exportToExcel = function (tableID)
            {
                var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('Investor') + '</b>' + ': <b>' + vm.filters.customer.name + "</b> <b>" + '<br/>' + '<b>' + app.localize('Revenue') + '</b>' + ': ' + vm.formatNumber(vm.rounding(vm.profitLossStatement.totalRevenue)) + "<b>" + '<br/>' + app.localize('Expense') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.profitLossStatement.totalExpense)) + "<b>" + '<br/>' + app.localize('ProfitAndLoss') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.profitLossStatement.profitLoss)) + "</div><br/>"

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

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "incomeStatement.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            }

            vm.ledgerReport = function (account)
            {
                let ledgerOnAccount = [];

                if (account.isLeaf) {
                    ledgerOnAccount = vm.profitLossStatement.ledger.filter(x => x.accountCode == account.accountCode);
                }
                else {
                    const accountCodeParts = account.accountCode.split('-'); //4-1000 => [4 , 1000]
                    const validIntPart = accountCodeParts[1].replace(/0+$/, ''); //take on non zero like 1 in above case of 1000

                    const accountHead = accountCodeParts[0] + '-' + validIntPart; // make code part to search like 4-1 
                    ledgerOnAccount = vm.profitLossStatement.ledger.filter(x => x.accountCode.startsWith(accountHead));
                }

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/investorIncomeStatement/report.cshtml',
                    controller: 'tenant.views.crs.accounting.investorIncomeStatement.report.index as vm',
                    //backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        ledgerRows: function ()
                        {
                            return ledgerOnAccount;
                        }
                    }
                });

                modalInstance.result.then(function (result)
                {

                });
            };
        }
    ]);
