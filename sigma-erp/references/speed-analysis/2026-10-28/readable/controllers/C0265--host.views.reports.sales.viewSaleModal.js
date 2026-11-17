// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:79120-79240
appModule.controller('host.views.reports.sales.viewSaleModal', [
        '$scope', 'utilities', '$uibModalInstance', 'saleId', 'abp.services.app.hostProduct', 'abp.services.app.salesHost',
        function ($scope, utilities, $uibModalInstance, saleId, productService, salesService) {

            var vm = this;
            vm.loading = false;

            vm.saleId = saleId;

            vm.products = [];
            vm.getSubscriptionType = function(type){
                if(type == 1)
                {
                    return "Yearly";
                }
                if (type == 2)
                {
                    return "Monthly";
                }
                if (type == 3)
                {
                    return "Quarterly";
                }
            };

            vm.documents = [];
            vm.selectedProductVariants = [];
            vm.groupedVariants = {};
            vm.customModules = [];
            vm.gapPoints = [];
            vm.totalEstimatedHours = null;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
            vm.milestones = [];


            vm.getProducts = function () {
                productService.getProductsForVariants({}).then(function (response) {
                    vm.products = [];
                    vm.products = response.data;
                });
            };

            vm.getCharges = function () {
                vm.totalOTC = 0;
                vm.totalSubscriptionCharges = 0;
                vm.subscription.subscriptionPackages.forEach(x => {
                    vm.totalOTC += x.oneTimeCharges;
                    vm.totalSubscriptionCharges += x.subscriptionCharges;
                });
                vm.subscription.amount = vm.totalSubscriptionCharges;
                vm.subscription.SetupCharges = vm.totalOTC;
            };

            vm.getOriginalName = function (doc) {
                return doc.name.replace("_" + doc.guid, "");
            };

            vm.getModuleCategory = function (category) {
                return category === 2 ? 'Add On' : '';
            };

            vm.calculateHours = function () {
                vm.totalHours = 0.0;
                vm.gapPoints.forEach(function (item) {
                    if (item.estimatedHours !== undefined) {
                        vm.totalHours += item.estimatedHours;
                    }
                });
                vm.gapPoints.totalEstimatedHours = vm.totalHours;
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };
     

            // Get functions     

            vm.getSaleById = function () {
                vm.loading = true;

                salesService.getSaleById({ id: saleId }).success(function (result) {
                    vm.sale = result.sale;

                    vm.scope = result.scope ? JSON.parse(result.scope) : {};
                    vm.documents = result.documents || [];
                   
                    vm.detail = result.detail ? JSON.parse(result.detail) : {};

                    vm.selectedProductVariants = vm.scope.selectedProductVariants || [];
                    vm.customModules = vm.scope.customModules || [];
                    vm.gapPoints = vm.scope.gapPoints || [];

                    vm.milestones = vm.detail.milestones || [];
                    vm.subscription = vm.detail.subscription || {};

                }).finally(function () {
                    vm.getCharges();
                    vm.calculateHours();
                    vm.loading = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.getProducts();
                vm.getSaleById();
            }

            init();
        }
    ]);
