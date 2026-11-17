// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:41180-41253
appModule.controller('host.views.cbs.projectsDashboard.moveFeedbackModal', [
        '$scope', 'taskDetail', '$uibModalInstance', '$uibModal', 'utilities', 'abp.services.app.taskDetail', 'abp.services.app.taskFeedback',
        function ($scope, taskDetail, $uibModalInstance, $uibModal, utilities, taskDetailService, taskFeedbackService) {
            var vm = $scope;
            // Properties
            vm.task = taskDetail;
            vm.requestNumbers = [];
            vm.selectedRequestNo = null;
            vm.isLoading = false;
            vm.moving = false;
            // Functions
            vm.searchRequestNo = searchRequestNo;
            vm.moveTask = moveTask;
            vm.cancel = cancel;
            vm.clearSelection = clearSelection;
            vm.onRequestNoSelected = onRequestNoSelected;
            // Initialize
            initialize();
            function initialize() {
                // Initialize the modal
                vm.requestNumbers = [];
            }
            function searchRequestNo($select) {
                if (!$select.search)
                    return null;
                vm.isLoading = true;
                taskDetailService.searchCrForMoveTask({ keyword: $select.search }).then(function (response) {
                    vm.requestNumbers = response.data.items;
                    vm.isLoading = false;
                }).catch(function (error) {
                    vm.isLoading = false;
                    utilities.showError('Error searching support requests: ' + (error.message || 'Unknown error'));
                });
            }
            function clearSelection() {
                vm.selectedRequestNo = null;
            }
            function onRequestNoSelected(item) {
                vm.selectedRequestNo = item;
                console.log('Selected request number:', vm.selectedRequestNo);
            }
            function moveTask() {
                if (!vm.selectedRequestNo) {
                    return;
                }
                vm.moving = true;

                taskFeedbackService.moveFeedbackToOtherCr({
                    taskId: vm.task.id,
                    supportRequestId: vm.selectedRequestNo.id
                }).success(function (result) {
                    abp.notify.success(app.localize('MovedSuccessfully'));
                    $uibModalInstance.close(result);
                }).catch(function (error) {
                    //vm.saving = false;
                    utilities.showError('Failed to move task: ' + (error.message || 'Unknown error'));
                }).finally(function () {
                    vm.moving = false;
                });
            }
            /* vm.save = function () {
                 vm.saving = true;
                 productVariantService.createOrUpdateProductVariant({ variant: vm.variant }).success(function () {
                     abp.notify.info(app.localize('SavedSuccessfully'));
                     $uibModalInstance.close();
                 }).finally(function () {
                     vm.saving = false;
                 });
             };*/
            function cancel() {
                $uibModalInstance.dismiss('cancel');
            }
        }
    ]);
