// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:329569-329623
appModule.controller('tenant.views.crs.vouchers.changeVoucherNo.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.voucher',
    function ($scope, $uibModal, uiGridConstants, voucherService) {
        var vm = this;
        vm.loading = false;

        vm.permissions = {
            canChange: abp.auth.hasPermission('Pages.Tenant.Vouchers'),
        };

        vm.input = {
            type: 0,
            newVoucherNo: '',
            currentVoucherNo: ''
        };

        vm.voucherTypes = [
            { key: app.localize('Invoice'), value: 1 },
            { key: app.localize('Receipt'), value: 2 },
            { key: app.localize('Payment'), value: 3 },
            { key: app.localize('Grn'), value: 28 },
            { key: app.localize('Bill'), value: 5 },
            { key: app.localize('JV'), value: 6 },
            { key: app.localize('CreditNote'), value: 8 },
            { key: app.localize('DebitNote'), value: 9 },
            { key: app.localize('CreditCardTransactionsBankTransfers'), value: 17 },
        ];


        vm.changeVoucherNo = function () {
            
            vm.loading = true;
            if (vm.input.currentVoucherNo == vm.input.newVoucherNo) {
                abp.message.info(app.localize('CurrentAndNewVoucherNoSame'));
                return;
            }

            voucherService.changeVoucherNo(vm.input)
            .success(function (result) {
                abp.notify.success(app.localize('SavedSuccessfully'))
                //vm.input.type = 0;
                vm.input.currentVoucherNo = null;
                vm.input.newVoucherNo = null;
            })
            .finally(function () {
                vm.loading = false;
            });
        };

        function init() {
            if (!vm.permissions.canChange)
                abp.message.info(app.localize('NotPermitted'));
        }
        init();
    }]);
