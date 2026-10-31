// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:320030-320167
appModule.controller('tenant.views.vouchers.authorizes.index', [
        '$scope', '$state', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.agreement','abp.services.app.directory', 'utilities', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.transAgreement', 'abp.services.app.transTrip', '$filter', 'abp.services.app.journal',
    function ($scope, $state, $uibModal, $window, uiGridConstants, agreementService, directoryService, utilities, appSession, commonLookupService, transAgreementService, tripAppService, $filter, journalAppService) {

        var vm = this;

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });


        vm.loading = false;

        vm.voucherTypes = [];

        vm.statuses = null;

        vm.filters = {
            voucherType: null
        };

        vm.filterChanged = function () {
            vm.allAuthorizeVoucher = false;
                vm.getUnAuthorizedVouchers();
        };

        vm.getAllVoucherTypes = function (){
             var voucherTypes = [];

            if (abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Authorizes')){
                voucherTypes.push({
                    voucherType: 1, name: app.localize("Invoice")
                });
            };
            if(abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Authorizes')){
                voucherTypes.push({
                    voucherType: 2, name: app.localize("Receipt")
                });
            };
            if (abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Authorizes')) {
                voucherTypes.push({
                    voucherType: 3, name: app.localize("Payment")
                });
            };
            if (abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.Authorizes')) {
                voucherTypes.push({
                    voucherType: 8, name: app.localize("CreditNote")
                });
            };
            if (abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Authorizes')) {
                voucherTypes.push({
                    voucherType: 9, name: app.localize("DebitNote")
                });
            };
            if(abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Authorizes')){
                voucherTypes.push({
                    voucherType: 5, name: app.localize("Bill")
                });
            };
            if(abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Authorizes')){
                voucherTypes.push({
                    voucherType: 6, name: app.localize("JV")
                });
            };
           
            return voucherTypes;
        }

        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD hh:mm');
            }
            else {
                return "";
            }
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

        vm.allBoxTicked = function () {
            vm.unAuthorizedVouchersData.forEach(function (value, key) {
                value.generate = vm.allAuthorizeVoucher;
            })
        };

        vm.authorizeUnAuthorizeVoucherAll = function (row) {
            var listOfIds = [];
            var foundLines = $filter('filter')(vm.unAuthorizedVouchersData, {
                generate: true
            }, true);

            foundLines.forEach(function (value, key) {
                listOfIds.push({ id: value.id });
            });
            vm.saving = true;
                journalAppService.authorizedVouchers(listOfIds).success(function () {
                    vm.getUnAuthorizedVouchers();
                }).finally(function () {
                    vm.saving = false;
                });
        };

        vm.getUnAuthorizedVouchers = function () {
            vm.loading = true;
            journalAppService.getUnAuthorizedVouchers(vm.filters).success(function (data) {
                
                vm.unAuthorizedVouchersData = data.items;
                vm.unAuthorizedVouchersData.forEach(function (value, key) {
                    if (value.isAuthorized == true)
                        value.generate = true;
                    else
                        value.generate = false;
                });
            }).finally(function () {
                vm.loading = false;
                vm.allAuthorizeVoucher = false;
            });
        };

        function init() {
            
            vm.voucherTypes = vm.getAllVoucherTypes();
            vm.getUnAuthorizedVouchers();
        }

        init();
    }
    ]);
