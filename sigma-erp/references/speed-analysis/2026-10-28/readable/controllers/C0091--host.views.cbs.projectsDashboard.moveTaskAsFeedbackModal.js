// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:41414-41695
appModule.controller('host.views.cbs.projectsDashboard.moveTaskAsFeedbackModal', [
        '$scope', 'taskDetail', '$uibModalInstance','project', '$uibModal', 'utilities', 'abp.services.app.taskDetail', 'abp.services.app.customizationHost',
        function ($scope, taskDetail, $uibModalInstance, project, $uibModal, utilities, taskDetailService, customizationHostService) {
            var vm = this;
            // Properties
            vm.tasks = taskDetail; // This now holds the array of tasks
            vm.taskIds = []; // Array to store all task IDs
            vm.requestNumbers = [];
            vm.project = project;
            vm.selectedRequestNoId = null;
            vm.isLoading = false;
            vm.moving = false;
            vm.parentTasks = []; // Array to store tasks from the selected support request
            vm.selectedParentTask = null; // Selected parent task
            vm.projectCrs = true;
            vm.parentTasksTable = false; 
            vm.categories = [
                { id: 2, name: 'Bug' },
                { id: 3, name: 'Enhancement' },
                { id: 4, name: 'ChangeInScope' }
            ]; // Category options
            vm.selectedCategory = null; // Selected category
            vm.onRequestNoSelected = onRequestNoSelected;
            vm.backToCr = backToCr;
            vm.backToTask = backToTask;
            // Functions
            //vm.searchRequestNo = searchRequestNo;
            vm.moveTask = moveTask;
           vm.cancel = cancel;
           /* vm.clearSelection = clearSelection;
           
            vm.onParentTaskSelected = onParentTaskSelected;
            vm.onCategorySelected = onCategorySelected;
            vm.loadParentTasks = loadParentTasks;
            vm.filterTasksWithNoChildren = filterTasksWithNoChildren;*/

            // Initialize immediately with passed task details
            initialize();

            function initialize() {
                // Initialize the modal with task details passed from parent
                vm.requestNumbers = [];

                // Ensure tasks is always an array
                if (!Array.isArray(vm.tasks)) {
                    vm.tasks = [vm.tasks];
                }
                
                              // Extract and log all task IDs
                                if (vm.tasks && vm.tasks.length > 0) {
                                    vm.taskIds = vm.tasks.map(function (task) {
                                        return task.id;
                                    });
                
                                    // Log the task details and IDs for debugging
                                    console.log('Tasks received:', vm.tasks);
                                    console.log('Selected task IDs:', vm.taskIds);
                                }
                
                              //  filterTasksWithNoChildren();
                getProjectChangeReqs(); 
                
            }
                /*
                            function filterTasksWithNoChildren() {
                                if (!vm.tasks || vm.tasks.length === 0) return;
                
                                var filteredTasks = [];
                
                                vm.tasks.forEach(function (task) {
                                    if (task.children.length === 0)
                                        filteredTasks.push(task);
                                });
                
                                vm.tasks = filteredTasks; // Update the main tasks array
                                vm.taskIds = filteredTasks.map(function (task) {
                                    return task.id;
                                }); // Update the IDs array
                
                                console.log('Tasks received:', vm.tasks);
                                console.log('Selected task IDs:', vm.taskIds);
                
                
                            }*/
                
                
                



                // SAAD STARTING

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

             function getProjectChangeReqs () {
                    vm.isLoading = true;
                    taskDetailService.getCrByProjectIdAndType({ type: vm.crType, projectId: vm.project.id }).then(function (result) {
                        vm.changeRequests = result.data.items;
                        vm.isLoading = false;
                    })

            };

            function backToCr() {
                vm.projectCrs = true;
                vm.parentTasksTable = false; 
            }
            function backToTask() {
                vm.projectCrs = false;
                vm.parentTasksTable = true;
                vm.selectedParentTask = null; 
            }

                //ENDING
                vm.searchRequestNo = function($select) {
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

                vm.clearSelection = function () {
                    vm.selectedRequestNo = null;
                    vm.parentTasks = [];
                    vm.selectedParentTask = null;
                }
            vm.selectedReqNo = ""
            function onRequestNoSelected(item, reqNo) {
                vm.selectedRequestNoId = item;
                vm.selectedReqNo = reqNo;
                    loadParentTasks();
                }

                vm.onParentTaskSelected = function (item) {
                    vm.selectedParentTask = item;
                    vm.parentTasksTable = false
                }

                vm.onCategorySelected= function (item, task) {
                    vm.selectedCategory = item;
                }


                 function loadParentTasks () {
                    if (!vm.selectedRequestNoId) {
                        return;
                    }

                    vm.isLoading = true;
                    vm.parentTasks = [];
                    vm.selectedParentTask = null;

                    // Call backend function to get tasks for the selected support request
                    taskDetailService.getTasksForDropdown({
                        id: vm.selectedRequestNoId
                    }).then(function (response) {
                        if (response.data && response.data.items) {
                            vm.parentTasks = response.data.items;
                            console.log('Loaded parent tasks:', vm.parentTasks);
                        }
                        vm.projectCrs = false; 
                        vm.isLoading = false;
                        vm.parentTasksTable = true;
                    }).catch(function (error) {
                        vm.isLoading = false;
                        utilities.showError('Error loading tasks: ' + (error.message || 'Unknown error'));
                    });
                }

                function moveTask(parentTaskId) {
                    if (!vm.selectedRequestNoId || !vm.selectedCategory) {
                        utilities.showError('Please select a request, parent task, and category before moving tasks.');
                        return;
                    }

                    vm.moving = true;

                    // Check if we're dealing with multiple tasks or a single task
                    if (vm.tasks.length > 1) {
                        // Move multiple tasks
                        var movePromises = [];

                        // Create a promise for each task move operation
                        vm.tasks.forEach(function (task) {
                            taskDetailService.moveTasksAsChild({
                                taskIds: [task.id],
                                parentTaskId: parentTaskId,
                                category: vm.selectedCategory.id
                            }).then(function () {

                                abp.notify.success(app.localize('MovedSuccessfully'));
                                var resultObj = {
                                    reqNo: vm.selectedReqNo,
                                    type: vm.selectedCategory
                                }
                                $uibModalInstance.close(resultObj);
                            }).catch(function (error) {
                                vm.moving = false;
                                utilities.showError('Failed to move task: ' + (error.message || 'Unknown error'));
                            }).finally(function () {
                                vm.moving = false;
                            });
                           
                        });

                        // Execute all move operations and handle the result
                        /*Promise.all(movePromises)
                            .then(function (results) {
                                abp.notify.success(app.localize('TasksMovedSuccessfully'));
                                $uibModalInstance.close(results);
                            })
                            .catch(function (error) {
                                vm.moving = false;
                                utilities.showError('Failed to move tasks: ' + (error.message || 'Unknown error'));
                            }).finally(function () {
                                vm.moving = false;
                            });*/
                    } else if (vm.tasks.length === 1) {
                        // Move a single task
                        taskDetailService.moveTasksAsChild({
                            taskIds: vm.taskIds,
                            parentTaskId: parentTaskId,
                            category: vm.selectedCategory.id
                        }).then(function () {
                            abp.notify.success(app.localize('MovedSuccessfully'));
                            var resultObj = {
                                reqNo: vm.selectedReqNo,
                                type: vm.selectedCategory
                            }
                            $uibModalInstance.close(resultObj);
                        }).catch(function (error) {
                            vm.moving = false;
                            utilities.showError('Failed to move task: ' + (error.message || 'Unknown error'));
                        }).finally(function () {
                            vm.moving = false;
                        });
                    }
                }

                function cancel () {
                    $uibModalInstance.dismiss('cancel');
                }
            
        }]);
