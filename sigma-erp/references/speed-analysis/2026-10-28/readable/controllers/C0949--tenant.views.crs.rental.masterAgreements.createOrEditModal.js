// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:256572-256629
appModule.controller('tenant.views.crs.rental.masterAgreements.createOrEditModal', [
        '$uibModalInstance', 'utilities', 'abp.services.app.rentalMasterAgreement', 'options', 'abp.services.app.agreementSaleOrder',
        function ($uibModalInstance, utilities, masterAgreementService, options, agreementSaleOrderService) {
            var vm = this;
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.customers = [];
            
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.onSaleOrderSelection = function () {

                vm.masterAgreement.saleOrderId = vm.masterAgreement.saleOrder.id;

            }

            vm.getSaleOrders = function () {
                if (!vm.quotation.customer) return;

                return agreementSaleOrderService.getAgreementSaleOrdersByContactId({ id: vm.quotation.customer.id }).then(function (response) {
                    vm.saleOrders = response.data.items;
                });
            };

            function init() {
                if (options.quotationId) {
                    vm.quotation = options;
                    vm.masterAgreement = {
                        quotationId: options.quotationId
                    };
                }
                vm.getSaleOrders();
            }

            vm.save = function () {

                vm.saving = true;
                vm.masterAgreement.invoicingStartDate = moment();
                masterAgreementService.createOrUpdateMasterRentalAgreement({ masterAgreement: vm.masterAgreement }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            init();

        }]);
