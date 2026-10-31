// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:122335-122534
appModule.controller('tenant.views.crs.accounting.cashFlowStatement.index', [
        '$scope', '$uibModal', 'abp.services.app.fiscalYear', 'abp.services.app.fiscalMonth',  'utilities', 'abp.services.app.cashFlowStatement',
        function ($scope, $uibModal, fiscalYearService, fiscalMonthsService, utilities, cashFlowStatementService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.filters = {
                fiscalYearId: null,
                fiscalMonthId: null,
                isFascalMonthActive: false,
                

            };
            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.cashFlowSettingPermission = abp.auth.hasPermission('Pages.Administration.Tenant.Settings');
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };


            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
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

            vm.getFiscalYears = function () {
                vm.loading = true;
                fiscalYearService.getFiscalYearsDesc().success(function (data) {
                    vm.fiscalYears = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getMonthYear = function (date) { return date.add(1, 'days').format('MMM-YYYY'); };
            vm.getMonths = function () {
                
                
                
                //input.startDate = moment(moment(vm.fiscalYear.startDate).format('YYYY-MM-DD')).utc();
                //input.endDate = moment(moment(vm.fiscalYear.endDate).format('YYYY-MM-DD')).utc();
                if (vm.filters.fiscalYear)
                {
                    

                    vm.filters.fiscalYearId = vm.filters.fiscalYear.id;
                    vm.filters.startDate = vm.filters.fiscalYear.startDate;
                    vm.filters.endDate = vm.filters.fiscalYear.endDate;
                        fiscalMonthsService.getFiscalMonths(vm.filters).success(function (data) {


                            vm.fiscalMonths = data.items;

                        }).finally(function () {
                            vm.loading = false;
                        });
                    
                }
                    
                //input.id = null;
                

                

            };
            
            vm.rounding = function (value) {
                var result = utilities.round(value, 2);
                if (result % 1 != 0) {
                    return result;
                }
                else {
                    return result.toFixed(2);
                }
            };

            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                var roundedAmount = vm.roundingforView(amount);
                return roundedAmount.toLocaleString('en');
            };

            vm.openSettingModal = () => {
                 $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/cashFlowStatement/cashFlowSettingsModal.cshtml',
                    controller: 'tenant.views.crs.accounting.cashFlowStatement.cashFlowSettingsModal as vm',
                     backdrop: 'static',
                    size:'lg'
                    //resolve: {
                    //    contactCreditCard: function () {
                    //        return {};
                    //    }

                    //}

                });

            }


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
                a.download = 'CashFlowStatement.xls';
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

            function formatFields() {
                vm.data.income = vm.formatNumber(vm.data.income);
                vm.data.operatingActivitiesCashFlow = vm.formatNumber(vm.data.operatingActivitiesCashFlow);
                vm.data.investingActivitiesCashFlow = vm.formatNumber(vm.data.investingActivitiesCashFlow);
                vm.data.financingActivitiesCashFlow = vm.formatNumber(vm.data.financingActivitiesCashFlow);
                vm.data.cashFlow = vm.formatNumber(vm.data.cashFlow);
                vm.data.operatingActivities.forEach(e => e.value = vm.formatNumber(e.value));
                vm.data.investingActivities.forEach(e => e.value = vm.formatNumber(e.value));
                vm.data.financingActivities.forEach(e => e.value = vm.formatNumber(e.value));
            }

            vm.getcashFlowStatements = function () {
                vm.loading = true;
                if (vm.filters.fiscalMonth) {
                    vm.filters.fiscalMonthId = vm.filters.fiscalMonth.id;
                }
                    
                else {
                    vm.filters.fiscalMonthId = null;
                }
                if (vm.filters.fiscalYear)
                    vm.filters.fiscalYearId = vm.filters.fiscalYear.id;
                //vm.filters.fiscalYear = null;
                //vm.filters.fiscalMonth = null;
                cashFlowStatementService.getCashFlowStatement(vm.filters).success(function (data) {
                    vm.data = data;
                    formatFields();
                }).finally(() => vm.loading = false);
            }

            function init() {
                vm.getFiscalYears();
            }

            init();
        }
    ]);
