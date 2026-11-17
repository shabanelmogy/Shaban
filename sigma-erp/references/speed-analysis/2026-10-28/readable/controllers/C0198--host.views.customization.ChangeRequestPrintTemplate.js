// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:67984-68153
appModule.controller('host.views.customization.ChangeRequestPrintTemplate', [
        '$scope', 'abp.services.app.customizationHost', 'utilities', 'filters', '$uibModalInstance', 'abp.services.app.currency', 'abp.services.app.milestone',
        function ($scope, customizationService, utilities, filters, $uibModalInstance, currencyService, milestoneService)
        {

            var vm = this;
            vm.loading = false;
            vm.ChangeRequestId = filters;
            vm.milestones = [];
            vm.logos = [{ id: 1, name: 'Speed Auto Systems' }, { id: 2, name: 'karzansoft' }];
            //vm.currencies = [
            //    { id: 1, name: "USD", rate: 1 },
            //    { id: 2, name: "AED", rate: 3.67 },
            //    { id: 3, name: "GBP", rate: 0.84 },
            //    { id: 4, name: "SAR", rate: 3.75 }
            //];
            vm.dateNow = new Date();
            //vm.businessName = [
            //    { id: 1, name: "Karzansoft (UAE)", currency: "AED", tax: 0 },
            //    { id: 2, name: "Speed Auto Systems (UAE)", currency: "AED", tax: 0 },
            //    { id: 3, name: "Speed Auto Systems ", currency: "USD", tax: 0 },
            //    { id: 4, name: "Speed Auto Systems (UK)", currency: "GBP", tax: 0 },
            //];
            vm.businessName = utilities.divisionName();
            //vm.mileStones = [
            //    { id: 1, name: "Advance" },
            //    { id: 2, name: "On Delivery" }

            //];
            vm.getChargingType = function (type) {
                if (type == 1)
                    return 'Paid';
                if (type == 3)
                    return 'Complementary';

            };

            vm.selectTax = function ()
            {

                if (vm.data.discount) {
                    vm.costAfterDiscount = vm.total() - vm.data.discount;
                    vm.vat = (vm.costAfterDiscount * vm.data.vatPercent / 100).toFixed(0);
                }
                else {
                    vm.vat = (vm.total() * vm.data.vatPercent / 100).toFixed(0);
                }
            };
            vm.taxTotalAmount = function ()
            {

                if (vm.data.discount) {
                    vm.costAfterDiscount = vm.total() - vm.data.discount;

                    vm.totalTaxPrice = parseInt(vm.costAfterDiscount) + parseInt(vm.vat);
                }
                else {
                    vm.totalTaxPrice = parseInt(vm.total()) + parseInt(vm.vat);
                }
            };
            vm.logoId = 0;
            vm.logo = null;
            vm.costPerHour = 35;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
            vm.cancel = function ()
            {
                $uibModalInstance.dismiss();
            };

            vm.getLocalDate = function (date)
            {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YYYY');
                }
                else {
                    return "";
                }
            };

            vm.changeLogo = function ()
            {
                /* if (vm.logoId>0)
                 {
                     if (vm.logoId == 1) {
                         vm.logo = "/App/host/views/customization/headerLogos/speedautosystems.png";
                     }
                     else
                     {
                         if (vm.logoId == 2) {
                             vm.logo = "/App/host/views/customization/headerLogos/Karzansoft4.png";
                         }
                     }
                 }*/
                //vm.logoId = vm.businessName.find(obj => obj.id === vm.data.business).id;
                if (vm.data.businessDivision != null) {
                    if (vm.data.businessDivision.code == "KZ") {
                        vm.logo = "/App/host/views/customization/headerLogos/Karzansoft4.png";
                    }
                    else {

                        vm.logo = "/App/host/views/customization/headerLogos/speedautosystems.png";

                    }
                }


            };

            vm.getChangeRequestDataById = function ()
            {
                if (vm.ChangeRequestId > 0) {
                    vm.loading = true;
                    customizationService.getChangeRequestsById({ Id: vm.ChangeRequestId }).success(function (result)
                    {
                        vm.data = result;
                        vm.selectTax();
                        vm.taxTotalAmount();
                        vm.changeLogo();
                        vm.costPerHour = 35 * vm.currencies.find(obj => obj.id === vm.data.customCurrencyId).currencyToBaseRate;
                        getChangeRequestMilestone();
                    }).finally(function ()
                    {
                        vm.loading = false;
                    });
                }
            };

            vm.total = function total()
            {
                if (vm.data && vm.data.totalCost)
                    return vm.convertCurrency(vm.data.totalCost).toFixed(2);
                else return (0).toFixed(2);
            };

            vm.discount = function discount()
            {

                return vm.convertCurrency(vm.data.discount).toFixed(2);
            };

            vm.convertCurrency = function convertCurrency(amount)
            {

                return amount * vm.currencies.find(obj => obj.id === vm.data.customCurrencyId).currencyToBaseRate;
            };
            vm.getCurrencies = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getChangeRequestMilestone() {

                milestoneService.getMilestonesByProjectId({ changeRequestId: vm.ChangeRequestId }).then(function (response) {
                    vm.milestones = response.data;
                });

            };
            function init()
            {
                vm.getCurrencies();
                vm.getChangeRequestDataById();
            }
            init();
        }
    ]);
