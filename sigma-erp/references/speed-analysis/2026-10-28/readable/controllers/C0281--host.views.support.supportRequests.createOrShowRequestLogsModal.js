// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:81570-81698
appModule.controller('host.views.support.supportRequests.createOrShowRequestLogsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.supportRequestHost', 'supportRequest', '$uibModal','utilities',
        function ($scope, $uibModalInstance, supportRequestHostService, supportRequest, $uibModal, utilities) {

            var vm = this;
            vm.saving = false;
            vm.supportRequest = supportRequest;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

            vm.documents = [];
            vm.isInternal = false;
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

            vm.resolvedConfirmationPending = function () {
                var msg = "\n\nDear User,\nI trust this message finds you well.\nWe are pleased to inform you that your recent request has been successfully resolved and clarified.\nShould you have any further concerns or inquiries, please do not hesitate to reply to this ticket.\n\nThank you for your understanding and cooperation.\n\nBest regards,\nSpeed Customer Care";

                if (vm.supportRequest.reply == undefined)
                    vm.supportRequest.reply = '';
                if (vm.ResolvedConfirmationPending == true && !vm.supportRequest.reply.includes(msg))
                    vm.supportRequest.reply = vm.supportRequest.reply.concat("", msg);
                else if (vm.ResolvedConfirmationPending == false)
                    vm.supportRequest.reply = vm.supportRequest.reply.split("\n")[0];

            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/support/supportRequests/uploadDocumentsModal.cshtml',
                    controller: 'host.views.support.supportRequests.uploadDocumentsModal as vm',
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



            vm.removeDocument = function (urlWithToken){
                vm.documents.forEach(function (item, index) {
                    if (item.urlWithToken === urlWithToken) {
                        vm.documents.splice(index, 1);
                    }
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
                supportRequestHostService.saveRequestLog({
                    requestId: supportRequest.id,
                    detail: vm.supportRequest.reply,
                    isInternal: vm.isInternal,
                    documents: vm.documents
                }).success(function (data) {
                    vm.getRequestLogs();
                    vm.supportRequest.reply = "";
                    vm.documents = [];
                }).finally(function () {
                    vm.ResolvedConfirmationPending = false;
                    vm.loading = false;
                });
            }

            vm.getRequestLogs = function () {
                vm.loading = true;
                supportRequestHostService.getRequestLogs({
                    id: supportRequest.id
                }).success(function (data) {
                    vm.supportRequest.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getRequestLogs();
        }
    ]);
