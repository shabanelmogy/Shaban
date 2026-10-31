// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:41698-41893
appModule.controller('host.views.cbs.projectsDashboard.moveTaskModal', [
        '$scope', 'taskDetail', '$uibModalInstance', '$uibModal', 'utilities', 'abp.services.app.taskDetail', 'abp.services.app.customizationHost',
        function ($scope, taskDetail, $uibModalInstance, $uibModal, utilities, taskDetailService, customizationHostService) {
            var vm = $scope;
            // Properties
            vm.tasks = taskDetail; // This now holds the array of tasks
            vm.taskIds = []; // Array to store all task IDs
            vm.requestNumbers = [];
            vm.selectedRequestNo = null;
            vm.isLoading = false;
            vm.moving = false;
            vm.parentTasks = []; // Array to store tasks from the selected support request
            vm.selectedParentTask = null; // Selected parent task
            vm.categories = [
                { id: 2, name: 'Bug' },
                { id: 3, name: 'Enhancement' },
                { id: 4, name: 'ChangeInScope' }
            ]; // Category options
            vm.selectedCategory = null; // Selected category

            // Functions
            vm.searchRequestNo = searchRequestNo;
            vm.moveTask = moveTask;
            vm.cancel = cancel;
            vm.clearSelection = clearSelection;
            vm.onRequestNoSelected = onRequestNoSelected;
            vm.onParentTaskSelected = onParentTaskSelected;
            vm.onCategorySelected = onCategorySelected;
            vm.loadParentTasks = loadParentTasks;
            vm.filterTasksWithNoChildren = filterTasksWithNoChildren;

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

                filterTasksWithNoChildren();

            }

            function filterTasksWithNoChildren() {
                if (!vm.tasks || vm.tasks.length === 0) return;

                var filteredTasks = [];

                vm.tasks.forEach(function (task) {                   
                       if(task.children.length===0)
                          filteredTasks.push(task);
                });

                        vm.tasks = filteredTasks; // Update the main tasks array
                        vm.taskIds = filteredTasks.map(function (task) {
                            return task.id;
                        }); // Update the IDs array

                        console.log('Tasks received:', vm.tasks);
                        console.log('Selected task IDs:', vm.taskIds);
                    
                   
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
                vm.parentTasks = [];
                vm.selectedParentTask = null;
            }

            function onRequestNoSelected(item) {
                vm.selectedRequestNo = item;
                loadParentTasks();
            }

            function onParentTaskSelected(item) {
                vm.selectedParentTask = item;
            }

            function onCategorySelected(item) {
                vm.selectedCategory = item;
            }


            function loadParentTasks() {
                if (!vm.selectedRequestNo) {
                    return;
                }

                vm.isLoading = true;
                vm.parentTasks = [];
                vm.selectedParentTask = null;

                // Call backend function to get tasks for the selected support request
                taskDetailService.getTasksForDropdown({
                    id: vm.selectedRequestNo.id
                }).then(function (response) {
                    if (response.data && response.data.items) {
                        vm.parentTasks = response.data.items;
                        console.log('Loaded parent tasks:', vm.parentTasks);
                    }
                    vm.isLoading = false;
                }).catch(function (error) {
                    vm.isLoading = false;
                    utilities.showError('Error loading tasks: ' + (error.message || 'Unknown error'));
                });
            }

            function moveTask() {
                if (!vm.selectedRequestNo || !vm.selectedParentTask || !vm.selectedCategory) {
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
                        var movePromise = taskDetailService.moveTasksAsChild({
                            taskIds: [task.id],
                            parentTaskId: vm.selectedParentTask.id,
                            category: vm.selectedCategory.id
                        });
                        movePromises.push(movePromise);
                    });

                    // Execute all move operations and handle the result
                    Promise.all(movePromises)
                        .then(function (results) {
                            abp.notify.success(app.localize('TasksMovedSuccessfully'));
                            $uibModalInstance.close(results);
                        })
                        .catch(function (error) {
                            vm.moving = false;
                            utilities.showError('Failed to move tasks: ' + (error.message || 'Unknown error'));
                        }).finally(function () {
                            vm.moving = false;
                        });
                } else if (vm.tasks.length === 1) {
                    // Move a single task
                    taskDetailService.moveTasksAsChild({
                        taskIds: vm.taskIds,
                        parentTaskId: vm.selectedParentTask.id,
                        category: vm.selectedCategory.id
                    }).then(function (result) {
                        abp.notify.success(app.localize('MovedSuccessfully'));
                        $uibModalInstance.close(result);
                    }).catch(function (error) {
                        vm.moving = false;
                        utilities.showError('Failed to move task: ' + (error.message || 'Unknown error'));
                    }).finally(function () {
                        vm.moving = false;
                    });
                }
            }

            function cancel() {
                $uibModalInstance.dismiss('cancel');
            }
        }
    ]);
