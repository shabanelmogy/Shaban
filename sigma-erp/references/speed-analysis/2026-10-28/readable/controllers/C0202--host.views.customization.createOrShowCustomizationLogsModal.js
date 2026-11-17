// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:68373-68490
appModule.controller('host.views.customization.createOrShowCustomizationLogsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.customizationHost', 'customization', '$uibModal',
        function ($scope, $uibModalInstance, customizationService, customization, $uibModal) {

            var vm = this;
            vm.saving = false;
            vm.customization = customization;
            vm.documents = [];
            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("ApprovalPending");
                else if (id == 2)
                    return app.localize("Closed");
                else if (id == 3)
                    return app.localize("Approved");
                else if (id == 5)
                    return "Estimation Pending";
                else if (id == 6)
                    return "Estimated, Customer Confirmation Pending";
                else if (id == 7)
                    return "Customer Confirmed, Finance Approval Pending";
                else if (id == 8)
                    return "Finance Approved";
                else if (id == 9)
                    return "In-Progress";
                else if (id == 10)
                    return "Scope Sent";
                else if (id == 11)
                    return "Scope Approved";
                else if (id == 12)
                    return "Quotation Sent";
                else if (id == 13)
                    return "Quotation Approved";
                else if (id == 14)
                    return "On Approval";
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

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/uploadDocumentsModal.cshtml',
                    controller: 'host.views.customization.uploadDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenantId: function () {
                            return vm.customization.tenantId
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);

                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.openLogDocumentsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/showLogDocumentsModal.cshtml',
                    controller: 'host.views.customization.showLogDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        logRequest: function () {
                            return row;
                        }
                    }
                });
            };

            vm.save = function () {
                vm.loading = true;
                customizationService.saveCustomizationLog({
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
            }

            vm.getCustomizationLogs = function () {
                vm.loading = true;
                customizationService.getCustomizationLogs({
                    id: customization.id
                }).success(function (data) {
                    vm.customization.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getCustomizationLogs();
        }
    ]);
