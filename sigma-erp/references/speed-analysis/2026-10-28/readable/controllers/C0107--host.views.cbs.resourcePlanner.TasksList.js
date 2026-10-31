// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:49449-49712
appModule.controller('host.views.cbs.resourcePlanner.TasksList', [
        '$scope', 'selectedUser', 'selectedDate', '$uibModalInstance', '$uibModal', 'utilities', 'abp.services.app.resourcePlanner',
        function ($scope, selectedUser, selectedDate, $uibModalInstance, $uibModal,  utilities, resourcePlannerService) {

            var vm = this;
            vm.loading = false;
            vm.dueTasks = [];
            vm.filterDueTaskData = [];
            vm.searchText = null;
            vm.projectType = null;
            vm.division = null;
            vm.dueTasksCount = 0;


            // Tasks Status Filter
            vm.filters = {
                taskStatusesArray:
                    [
                        { id: 1, name: 'New' },
                        { id: 2, name: 'TBD' },
                        { id: 3, name: 'In Progress' }
                    ],
            };

             //// GetDueTasks in the Modal Table.
             vm.getDueTasks = function () {
                vm.loading = true;
                vm.filters.taskStatuses = [];
                 if (vm.filters.taskStatusesArray.length > 0)
                 {
                    angular.forEach(vm.filters.taskStatusesArray, function (value) {
                        vm.filters.taskStatuses.push(value.id);
                    });
                }
                resourcePlannerService.getDueTaskForResourcePlanner(vm.filters).success(function (data)
                {
                    vm.dueTasks = data;
                    vm.filterDueTaskData = data;
                    vm.dueTasksCount = data.length;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            // Data Filter based on Dropdowns
            vm.FilterDueTasks = function () {
                vm.dueTasks = vm.filterDueTaskData;
                vm.dueTasksCount = 0;
                if (vm.division !== null) {
                    vm.dueTasks = vm.dueTasks.filter(f => f.division == vm.division);
                }
                if (vm.projectType !== null) {
                    vm.dueTasks = vm.dueTasks.filter(f => f.projectType == vm.projectType);
                }
                if (vm.searchText !== null) {
                    vm.dueTasks = vm.dueTasks.filter(f => (f.title.toLowerCase().includes(vm.searchText.toLowerCase())));
                }
                vm.dueTasksCount = vm.dueTasks.length;
            };

            // Dropdowns Data
            vm.divisions = [
                { id: 1, name: "ERP" },
                { id: 2, name: "RPA" },
                { id: 3, name: "Mobility" }
            ];
            vm.projectTypes = [
                { id: 1, name: "Domestic" },
                { id: 2, name: "International" },

            ];

            //Refresh modal.
            vm.refresh = function () {
                vm.searchText = null;
                vm.projectType = null;
                vm.division = null;
                vm.getDueTasks();
            };

            //Close the Modal.
            vm.cancel = function () {
                $uibModalInstance.close();
            };


            // Make the Task Column in Correct Format.
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);




            // Select Task to add in RP
            vm.TaskSelected = function (Taskid) {
                var param = { UserId: selectedUser.userId, Taskid: Taskid, Start: selectedDate, End: null};
                resourcePlannerService.updateTask(param).success(function (result) {
                    abp.notify.info(app.localize('Added Successfully!'));
                    $uibModalInstance.close(result);
                }).finally(function () {
                    vm.loading = false;
                });
                    
                
            };

            
            // Edit Due Tasks's Project Detail
            vm.editProjectTask = function (projectTask) {
                editProjectTaskModal(projectTask);
            };
            function editProjectTaskModal(projectTask) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/viewOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                projectId: projectTask.projectId,
                                parentId: projectTask.parentTaskId,
                                taskId: projectTask.id
                            };
                        }
                    }
                });

                modalInstance.result.then(function (tasks) {
                    vm.FilterDueTasks();
                });
            }


            // Update Due Tasks's Detail
            vm.openmanageTaskModal = function (task) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/taskManageModal.cshtml',
                    controller: 'host.views.cbs.task.taskManagerModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectId: task.projectId,
                                parentId: task.parentId,
                                taskId: task.id
                            };
                        }
                    },
                    size: 'md'
                });
                modalInstance.result.then(function (updatedTaskDetail) {
                    if (updatedTaskDetail !== null) {
                        vm.FilterDueTasks();

                    }
                });
            };


            // Conversions
            vm.taskStatuses =
                [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'TBD' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' }
                ];
            vm.getTaskStatus = function (status) {
                if (!status) return '';
                else if (status == 1) return 'New';
                else if (status == 2) return 'To Be Discussed';
                else if (status == 3) return 'In Progress';
                else if (status == 4) return 'Completed';
                else return '';
            };
            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };
            vm.getDateColorClass = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    var todaysDate = new Date();
                    if (localTime.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
                        // Date equals today's date
                        return 1;
                    }
                    else if (localTime.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)) {
                        // Date equals today's date
                        return 2;
                    }
                    return -1;
                }
                else {
                    return -1;
                }
            };
            vm.roundOf = function (value) {
                if (!value) return 0;
                return Math.round(value, 2);
            };
            vm.divisionName = function (type) {
                var name = '';
                if (type == 1) {
                    name = 'ERP';
                }
                else if (type == 2) {
                    name = 'RPA';
                }
                else if (type == 3) {
                    name = 'Mobility';
                }

                return name;
            };
            vm.projectTypesName = function (type) {
                var name = '';
                if (type == 1) {
                    name = 'Domestic';
                }
                else if (type == 2) {
                    name = 'International';
                }
                 return name;
            };
            vm.StageTypesName = function (type) {
                var name = '';
                if (type == 1) {
                    name = 'Scope';
                }
                else if (type == 2) {
                    name = 'Design';
                }
                else if (type == 3) {
                    name = 'Development';
                }
                else if (type == 4) {
                    name = 'QA';
                }
                else if (type ==5) {
                    name = 'Ready to Release';
                }
                else if (type == 6) {
                    name = 'Released';
                }
                return name;
            };

       


            // Default Function
            function init() {
                vm.getDueTasks();
            }
            init();
        }
    ]);
