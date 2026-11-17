// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:187101-187180
appModule.controller('tenant.views.crs.coupons.luckyDraw.viewModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.luckyDraw', 'luckyDrawId',
        function ($scope, $uibModal, $uibModalInstance, luckyDrawService, luckyDrawId) {

            var vm = this;
            vm.saving = false;
            vm.policeReportDocs = [];
            vm.canChangeCharges = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            

            


            vm.openExcessChargesInfoModal = function (excessChargesDetail) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accidents/excessChargesInfoModal.cshtml',
                    controller: 'tenant.views.crs.accidents.excessChargesInfoModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        excessChargesDetail: () => excessChargesDetail
                    }

                });
            };

            vm.openViewInvoiceModal = function (invoiceId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });

            };

            


            

            function init() {
                vm.loading = true;
                luckyDrawService.getLuckyDrawForView({
                    id: luckyDrawId

                }).success(function (result) {
                    vm.loading = false;
                    vm.luckyDraw = result;
                    
                });
            }

            init();
        }
    ]);
