// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:114264-114356
appModule.controller('tenant.views.support.supportRequests.createOrShowRequestLogsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.supportRequest','abp.services.app.customerCareTenant', 'supportRequest', '$uibModal', 'utilities',
        function ($scope, $uibModalInstance, supportRequestService, customerCareTenantService, supportRequest, $uibModal,utilities) {
            var vm = this;
            vm.saving = false;
            vm.supportRequest = supportRequest;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

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
                    templateUrl: '~/App/tenant/views/common/supportRequests/showLogDocumentsModal.cshtml',
                    controller: 'tenant.views.common.supportRequests.showLogDocumentsModal as vm',
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
                customerCareTenantService.saveRequestLog({
                    requestId: supportRequest.id,
                    detail: vm.supportRequest.reply,
                    documents: vm.documents
                }).success(function (data) {
                    vm.getRequestLogs();
                    vm.supportRequest.reply = "";
                    vm.documents = [];

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getRequestLogs = function () {
                vm.loading = true;
                customerCareTenantService.getRequestLogs({
                    id: supportRequest.id
                }).success(function (data) {
                     vm.supportRequest.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getRequestLogs();
        }
    ]);
