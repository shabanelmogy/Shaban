// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:70359-70505
appModule.controller('host.views.customization.report', [
        '$scope', '$stateParams', 'abp.services.app.customizationHost', 'abp.services.app.currency',
        function ($scope, $stateParams, customizationService, currencyService)
        {

            var vm = this;
            vm.filters = null;
            vm.currencies = [];

            
            vm.convertCurrency = function convertCurrency(amount, currencyId) {
                return amount * vm.currencies.find(obj => obj.id === currencyId).currencyToBaseRate ;
            };
            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            $scope.$on('$viewContentLoaded', function ()
            {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' HH:mm';

            

            vm.CurrencyFormat = function (cost) {
                if (cost == null) return null;
                return cost.toLocaleString('en');
            };

            //vm.currencies = [
            //    { id: 1, name: "USD", rate: 1 },
            //    { id: 2, name: "AED", rate: 3.67 },
            //    { id: 3, name: "GBP", rate: 0.84 },
            //    { id: 4, name: "SAR", rate: 3.75 }
            //];

            vm.mileStones = [
                { id: 1, name: "Advance" },
                { id: 2, name: "On Delivery" }

            ];

            vm.getTotalCost = function (row) {
                
                return vm.convertCurrency(row.cost, row.customCurrencyId).toFixed(0);
                
            }

            //vm.getCurrencyName = function (currencyId)
            //{
            //    if (!currencyId) return "";
            //    else return vm.currencies.find(x => x.id == currencyId).name;
            //};

            vm.getlocalDateTime = function (date)
            {
                if (date != null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date)
            {
                if (date != null) {
                    return moment(date).utc().format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getStatus = function (statusId)
            {
                if (!statusId) return "";
                return [
                    { id: 1, name: app.localize("New") },
                    { id: 8, name: "Approved" },
                    { id: 2, name: app.localize("Closed") },
                    { id: 3, name: app.localize("Cancelled") },
                    { id: 4, name: app.localize("On Hold") },
                    { id: 10, name: "Scope Sent" },
                    { id: 11, name: "Scope Approved" },
                    { id: 12, name: "Quotation Sent" },
                    { id: 14, name: "On Approval" },
                    { id: 13, name: "Quotation Approved" },
                    { id: 15, name: "Delivered" }
                    //,
                    //{ id: 5, name: "Estimation Pending" },
                    //{ id: 6, name: "Estimated, Customer Confirmation Pending" },
                    //{ id: 7, name: "Customer Confirmed, Finance Approval Pending" },
                    //{ id: 9, name: "In-Progress" }
                ].find(x => x.id == statusId).name;
            }

            function init()
            {
                vm.loading = true;

                customizationService.getCustomizationsReport(vm.filters).success(function (data)
                {
                    vm.customization = data.items;
                    var groupedData = vm.customization.reduce(function (acc, report) {
                        if (report.customCurrency != null) {

                            var currencyCode = report.customCurrency.code;
                            if (!acc[currencyCode]) {
                                acc[currencyCode] = { currencyCode: currencyCode, totalAmount: 0 };
                            }
                            acc[currencyCode].totalAmount += (vm.getTotalCost(report) - report.discount);
                            return acc;
                        }
                        return acc;
                    }, {});

                    vm.groupAmount = Object.values(groupedData);
                }).finally(function ()
                {
                    vm.loading = false;
                });

            }
            vm.getCurrencies = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
            vm.getCurrencies();
        }]);
