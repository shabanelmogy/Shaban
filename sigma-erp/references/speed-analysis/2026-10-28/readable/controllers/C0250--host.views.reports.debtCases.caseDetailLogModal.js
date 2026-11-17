// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:76593-76698
appModule.controller('host.views.reports.debtCases.caseDetailLogModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.case', 'caseObj', '$uibModal',
        function ($scope, $uibModalInstance, caseService, caseObj , $uibModal) {

            var vm = this;
            vm.saving = false;
            vm.case = caseObj;
            vm.documents = [];

            vm.getStatus = function (status) {
                if (!status)
                    return '';
                if (status == 1)
                    return 'Open';
                if (status == 2)
                    return 'Closed';
                /*if (status == 3)
                    return 'On Hold';
                if (status == 4)
                    return 'Cancelled';*/
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

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };


            vm.openLogDocumentsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/showLogDocumentsModal.cshtml',
                    controller: 'host.views.reports.debtCases.showLogDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        caseLog: function () {
                            return row;
                        }
                    }
                });
            };

            vm.addLogs = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/addLogModal.cshtml',
                    controller: 'host.views.reports.debtCases.addLogModal as vm',
                    backdrop: 'static',
                    resolve: {
                        caseObj: function () {
                            return vm.case;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    vm.getCaseLogs();
                });
            };

            vm.save = function () {
                vm.loading = true;
                caseService.saveCaseLog({
                    caseId: caseObj.id,
                    detail: vm.case.detail,
                    assignedToUserId: vm.case.assignedToUser,
                    dueDate: vm.case.dueDate,
                    documents: vm.case.documents
                }).success(function (data) {
                    vm.getCaseLogs();
                    vm.case.detail = "";
                    assignedToUserId: vm.case.assignedToUserId;
                    dueDate: vm.case.dueDate;
                    vm.documents = [];
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getCaseLogs = function () {
                vm.loading = true;
                caseService.getCaseLogs({
                    id: caseObj.id
                }).success(function (data) {
                    vm.case.logs = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getCaseLogs();
        }
    ]);
