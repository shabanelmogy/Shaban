// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:87503-87542
appModule.controller('tenant.views.customization.confirmCustomizationModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.customization', 'customization', '$uibModal',
        function ($scope, $uibModalInstance, customizationService, customization, $uibModal) {
            var vm = this;
            vm.saving = false;
            vm.customization = customization;
            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };

            vm.cancel = function () {
                $uibModalInstance.close();;
            }

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
                customizationService.confirmCustomization({
                    id: customization.id
                }).success(function (data) {
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.loading = false;
                });
            };
        }
    ]);
