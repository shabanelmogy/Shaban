// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:69195-69235
appModule.controller('host.views.customization.estimateCustomizationModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.customizationHost', 'customization', '$uibModal',
        function ($scope, $uibModalInstance, customizationService, customization, $uibModal) {

            var vm = this;
            vm.saving = false;
            vm.customization = customization;
            debugger
            vm.documents = [];
            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };

            vm.cancel = function () {
                $uibModalInstance.close();;
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };

            vm.save = function () {
                vm.loading = true;
                customizationService.updateEstimateCustomization(vm.customization).success(function (data) {
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.loading = false;
                });
            }
        }
    ]);
