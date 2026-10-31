// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:71790-71892
appModule.controller('host.views.hr.staffRequests.createOrShowRequestLogsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.staffRequest', 'staffRequest', '$uibModal',
        function ($scope, $uibModalInstance, staffRequestService, staffRequest, $uibModal) {

            var vm = this;
            vm.saving = false;
            vm.supportRequest = staffRequest;
            vm.documents = [];
            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };

            vm.cancel = function () {
                $uibModalInstance.close();
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

            vm.resolvedConfirmationPending = function () {
                var msg = "\n\nRequest is resolved / clarified.If you still have some concern please reply, otherwise request will be closed automatically after 3 days.";
                if (vm.supportRequest.reply == undefined)
                    vm.supportRequest.reply = '';
                if (vm.ResolvedConfirmationPending == true && !vm.supportRequest.reply.includes(msg))                 
                   vm.supportRequest.reply = vm.supportRequest.reply.concat("", msg);
                else if (vm.ResolvedConfirmationPending == false)
                    vm.supportRequest.reply = vm.supportRequest.reply.split("\n")[0];

            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/hr/staffRequests/uploadDocumentsModal.cshtml',
                    controller: 'host.views.hr.staffRequests.uploadDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenantId: function () {
                            return vm.supportRequest.tenantId
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
                    templateUrl: '~/App/host/views/support/supportRequests/showLogDocumentsModal.cshtml',
                    controller: 'host.views.support.supportRequests.showLogDocumentsModal as vm',
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
                var data = { id: vm.supportRequest.id, detail: vm.supportRequest.reply, documents: vm.documents };
                staffRequestService.addStaffRequestLog(data).success(function (data) {
                    vm.getRequestLogs();
                    vm.supportRequest.reply = "";
                    vm.documents = [];
                }).finally(function () {
                    vm.ResolvedConfirmationPending = false;
                    vm.loading = false;
                });
            };

            vm.getRequestLogs = function () {
                vm.loading = true;
                staffRequestService.getStaffRequestLogs(vm.supportRequest.id).success(function (data) {
                    vm.supportRequest.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getRequestLogs();
        }
    ]);
