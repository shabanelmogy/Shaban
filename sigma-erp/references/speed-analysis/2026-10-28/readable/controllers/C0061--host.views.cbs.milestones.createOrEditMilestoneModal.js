// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36199-36289
appModule.controller('host.views.cbs.milestones.createOrEditMilestoneModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.milestone', 'projectId', 'changeRequestId', 'id','workspaceId',
        function ($scope, $uibModalInstance, milestoneService, projectId, changeRequestId, id, workspaceId) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.isEditMode = false;
            vm.workspaceId = workspaceId;
            vm.milestone = {
                projectId : projectId,
                changeRequestId: changeRequestId,
                id: id,
                milestoneStatus: 1,
                milestonePaymentStatus: 1,
                invoiceStatus: 1
            }

            vm.getProjectStatus = function (status) {
                if (!status)
                    return '';
                if (status == 1)
                    return 'Open';
                if (status == 2)
                    return 'Closed';
                if (status == 3)
                    return 'On Hold';
                if (status == 4)
                    return 'Cancelled';
            };
            vm.statuses = [
                {id:1,name:'Open'},
                {id:2,name:'Complete'},
            ];
            vm.paymentStatuses = [
                {id:1,name:'Pending'},
                {id:2,name:'Received'},
            ];
            vm.save = function () {
                vm.saving = true;
                if (vm.milestone.title.toLowerCase() == 'advance' && !vm.workspaceId && vm.milestone.id<=0) {
                    vm.milestone.milestoneStatus= 2;
                    vm.milestone.milestonePaymentStatus= 2;
                    vm.milestone.invoiceStatus = 2;

                }
                milestoneService.createOrUpdateMilestone({
                    milestone: vm.milestone,
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            function init() {
                
                vm.loading = true;
                milestoneService.getMilestoneForEdit({
                    id: vm.milestone.id
                }).success(function (result) {
                    vm.milestone = result;
                    //vm.milestone.expectedEndDate = vm.getlocalDateTime(vm.milestone.expectedEndDate);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            if (vm.milestone.id)
                init();
        }
    ]);
