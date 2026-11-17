// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:224391-224460
appModule.controller('tenant.views.crs.integrations.eInvoicing.viewLogModal', [
        '$scope', '$uibModalInstance', '$uibModal', 'abp.services.app.eInvoicingUAE', 'options',
        function ($scope, $uibModalInstance, $uibModal, eInvoicingUAEAppService, options) {

            var vm = this;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.voucherNo = options.voucherNo;
            vm.eInvoicePostingLogs = [];

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getStatusName = function (id) {
                if (id == 0)
                    return "Pending"
                else if (id == 1)
                    return "Queued"
                else if (id == 2)
                    return "Picked"
                else if (id == 3)
                    return "Wait"
                else if (id == 4)
                    return "Error"
                else if (id == 5 || id == 9)
                    return "Success"
                else if (id == 6)
                    return "Expired"
            }
            vm.getErrorTypeName = function (id) {
                if (id == 1)
                    return "Validation Error"
                else if (id == 2)
                    return "Temporary Issue"
                else if (id == 3)
                    return "Authentication Error"
                else if (id == 4)
                    return "Internal Error"
                else if (id == 6)
                    return "External Api Error"
            }

            function init() {
                vm.loading = true;
                eInvoicingUAEAppService.getEInvoicePostingLogs({
                    id: options.voucherId
                }).success(function (result) {
                    vm.eInvoicePostingLogs = result;
                    angular.forEach(vm.eInvoicePostingLogs, function (value) {
                        value.warning = value.documentResponses.warningDetails.map(warning => warning.message).join('<br><br>');
                        value.error = value.documentResponses.errorDetails.map(error => error.errorMessage).join('<br><br>');
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
