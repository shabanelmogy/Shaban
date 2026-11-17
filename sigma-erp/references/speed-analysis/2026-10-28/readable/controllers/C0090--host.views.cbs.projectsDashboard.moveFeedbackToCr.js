// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:41256-41411
appModule.controller('host.views.cbs.projectsDashboard.moveFeedbackToCr', [
        '$scope', '$uibModalInstance', 'changeRequestId', 'tasksToMove','type', 'taskDetail', '$filter', 'abp.services.app.customizationHost', '$uibModal', 'abp.services.app.taskDetail', 'project', 'isCRFromProjectDashboard', 'isCRFromNewPoints', 'utilities',
        function ($scope, $uibModalInstance, changeRequestId, tasksToMove,type, taskDetail, $filter, customizationHostService, $uibModal, taskDetailService, project, isCRFromProjectDashboard, isCRFromNewPoints, utilities, customizationService) {

            var vm = this;
            vm.loading = false;
            vm.newOrExistingSelection = '';
            vm.tasksList = tasksToMove;
            vm.project = project
            vm.isCRFromNewPoints = isCRFromNewPoints
            vm.tasks = taskDetail;
            vm.isLoading = false;
            vm.moving = false;
            vm.crType = type;
            vm.estimatedHours = 0; 
            // Functions
            //svm.cancel = cancel;
            vm.changeRequests = [];
            // Initialize


            function calculateEstimateHours() {
                let total = 0;

                if (vm.tasks && vm.tasks.length) {
                    for (let task of vm.tasks) {
                        total += Number(task.duration) || 0;
                    }
                }

                vm.estimatedHours = total;
            }

            
            vm.moveTask = function (supportRequestId, reqNo) {

                vm.moving = true;

                //if (vm.tasks.length > 1) {
                    // Multiple tasks — use moveNewPointToCr with array
                    vm.TasksList = vm.tasksList;  // simpler array mapping

                    taskDetailService.moveNewPointToCr({
                        taskIds: vm.TasksList,
                        supportRequestId: supportRequestId
                    }).success(function () {
                        var result = {
                            crReqNo: reqNo,
                            type: vm.crType

                        }
                        abp.notify.success(app.localize('MovedSuccessfully'));
                        $uibModalInstance.close(result);
                    }).catch(function (error) {
                        utilities.showError('Failed to move task: ' + (error.message || 'Unknown error'));
                    }).finally(function () {
                        vm.moving = false;
                    });
                /*} else if (vm.tasks.length === 1) {
                    // Single task — use moveTaskToOtherCr with single ID
                    var singleTask = vm.tasks[0];

                    taskDetailService.moveTaskToOtherCr({
                        taskId: singleTask,
                        supportRequestId: supportRequestId
                    }).success(function (result) {
                        abp.notify.success(app.localize('MovedSuccessfully'));
                        $uibModalInstance.close(result);
                    }).catch(function (error) {
                        utilities.showError('Failed to move task: ' + (error.message || 'Unknown error'));
                    }).finally(function () {
                        vm.moving = false;
                    });
                }*/

            }


            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("New");
                else if (id == 2)
                    return app.localize("Closed");
                else if (id == 3)
                    return app.localize("Cancelled");
                else if (id == 4)
                    return app.localize("OnHold");
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
                else if (id == 15)
                    return "Delivered";
                else return '';
            };

            //Get CR's From Project ID 
            vm.getProjectChangeReqs = function () {
                vm.loading = true;
                taskDetailService.getCrByProjectIdAndType({ type: vm.crType, projectId: vm.project.id }).then(function (result) {
                    vm.changeRequests = result.data.items;
                    vm.loading = false;
                })

            };
            //Create New Buffer CR 
            //vm.totalEstimatedHours = tasksToMove.duration

            vm.createAndMoveToCr = function () {
                vm.createBufferObj = {

                    projectId: project.id,
                    tenantId: project.tenantId,
                    businessDivisionId: project.businessDivisionId,
                    chargingType: vm.crType,
                    totalEstimatedHours: vm.estimatedHours,
                    title: project.title,
                    discount: 0,
                    totalCost: 0,
                    isCrFromWorkScope: true,
                    isCRFromNewPoints: vm.isCRFromNewPoints,
                    vATPercent: 0,
                    tasksToBeMove: tasksToMove,
                    id: 0,
                }
                customizationHostService.createOrUpdateChangeRequest(vm.createBufferObj).then(function (result) {
                    abp.notify.success(app.localize('Release Created Successfully!'));
                    var resultObj = {
                        crReqNo: result.data,
                        type: vm.crType
                    }
                    $uibModalInstance.close(resultObj);
                })
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            calculateEstimateHours(); 
        }]);
