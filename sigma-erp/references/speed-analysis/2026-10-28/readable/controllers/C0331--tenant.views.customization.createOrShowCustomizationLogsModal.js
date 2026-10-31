// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:87801-87903
appModule.controller('tenant.views.customization.createOrShowCustomizationLogsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.customization', 'customization', 'abp.services.app.customerCareTenant', '$uibModal',
        function ($scope, $uibModalInstance, customizationService, customization, customerCareTenantService, $uibModal) {
            var vm = this;
            vm.saving = false;
            vm.customization = customization;
            vm.documents = [];
            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("New");
                else if (id == 2)
                    return app.localize("Closed");
                else if (id == 3)
                    return app.localize("Cancelled");
                else if (id == 5)
                    return "Estimation Pending";
                else if (id == 6)
                    return "Estimated, Customer Confirmation Pending";
                else if (id == 7)
                    return "Customer Confirmed, Finance Approval Pending";
                else if (id == 8)
                    return "Approved";
                else if (id == 9)
                    return "In-Progress";
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

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/supportRequests/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.common.supportRequests.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);

                });
            };

            vm.openLogDocumentsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/customization/showLogDocumentsModal.cshtml',
                    controller: 'tenant.views.common.customization.showLogDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        logRequest: function () {
                            return row;
                        }
                    }
                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.save = function () {
                vm.loading = true;
                customerCareTenantService.saveCustomizationLog({
                    customizationId: customization.id,
                    detail: vm.customization.reply,
                    documents: vm.documents
                }).success(function (data) {
                    vm.getCustomizationLogs();
                    vm.customization.reply = "";
                    vm.documents = [];

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getCustomizationLogs = function () {
                vm.loading = true;
                customerCareTenantService.getCustomizationLogs({
                    id: customization.id
                }).success(function (data) {
                    vm.customization.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getCustomizationLogs();
        }
    ]);
