// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:405209-405291
appModule.controller('tenant.views.ers.masterAgreements.addOrViewSaleOrder', [
        '$scope', '$uibModalInstance', 'abp.services.app.masterAgreement', 'masterAgreementId', 'agreementNo', 'contactId', 'utilities',
        function ($scope, $uibModalInstance, masterAgreementSaleOrderService, masterAgreementId, agreementNo, contactId, utilities) {

            var vm = this;
            vm.loading = false;
            vm.agreementNo = agreementNo;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
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

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            function saleOrdersLineObject() {

                var line = new Object();
                line.masterAgreementId = masterAgreementId;
                line.saleOrderId = null;
                line.saleOrder = new Object();
                line.saleOrder.date = null;
                line.saleOrder.toDate = null;
                line.saleOrder.amount = null;
                line.saleOrder.voucherNo = null;
                return line;
            };

            vm.addRow = function () {
                vm.results.push(saleOrdersLineObject());
            };

            vm.removeRow = function (obj) {
                var index = vm.results.indexOf(obj);
                vm.results.splice(index, 1);
            };

            vm.searchSaleOrders = function ($select) {
                return masterAgreementSaleOrderService.searchSaleOrdersForAgreement({ keyword: $select.search, contactId: contactId }).then(function (response) {
                    vm.saleOrders = response.data.items;
                });
            };

            vm.save = function () {
                vm.saving = true;
                masterAgreementSaleOrderService.updateSaleOrdersForAgreement(vm.results).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);

                }).finally(function () {
                    vm.saving = false;
                });
            }

            function init() {
                vm.loading = true;

                masterAgreementSaleOrderService.getAgreementSaleOrders({
                    id: masterAgreementId
                }).success(function (data) {
                    vm.results = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
