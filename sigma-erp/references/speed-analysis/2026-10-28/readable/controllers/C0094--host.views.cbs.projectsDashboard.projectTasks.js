// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:41948-45457
appModule.controller('host.views.cbs.projectsDashboard.projectTasks',
        [
            'appSession', '$timeout', '$scope', '$sce','$window', 'project', 'isInitiateFromCase', 'workspaceId', 'prepareRelease', 'releaseId', '$uibModalInstance', '$uibModal', 'abp.services.app.taskDetail', 'utilities', 'abp.services.app.searchUser', 'abp.services.app.projectTask', 'abp.services.app.release', 'abp.services.app.milestone', 'abp.services.app.customizationHost',
            function (appSession, $timeout, $scope,$sce, $window, project, isInitiateFromCase, workspaceId, prepareRelease, releaseId, $uibModalInstance, $uibModal, taskDetailService, utilities, userService, projectTaskService, releaseService, milestoneService, customizationService) {
                var vm = this;
                vm.loading = false;
                vm.projectTask = {
                    mileStones: [],
                    projectId: project.id,
                    changeRequestId: project.changeRequestId
                }
                //GAP & Feedback Tasks Variables. 
                vm.projectTasks = [];
                vm.gapProjectTasks = [];
                vm.openProjects = [];
                vm.filteredTasks = [];
                vm.filteredGapTasks = [];
                vm.originalValues = {};
                vm.sortFeedbackState = { column: null, direction: null };
                vm.sortGapState = { column: null, direction: null };
                vm.filters = { title: '', description: '', reqNo: '' };
                vm.newTask = { title: '', description: '', projectId: null };
                vm.gapFilters = vm.gapFilters || {};
                vm.feedbackFilters = vm.feedbackFilters || {};
                vm.approvedCount = 0;
                vm.notApprovedCount = 0;
                vm.selectedFeedbackType = '';
                //Gap Task Counter 


                vm.statusNewGapCount = 0;
                vm.statusTbdGapCount = 0;
                vm.statusInprogressGapCount = 0;
                vm.completedGapCount = 0;
                vm.notCompletedGapCount = 0;


                //Feedback Task Counters 
                vm.statusNewCount = 0;
                vm.statusTbdCount = 0;
                vm.statusInProgressCount = 0;
                vm.completedStatusCount = 0;
                vm.notCompletedStatusCount = 0;

                //On Modal return CR Number Variable
                vm.crNumber = "";

                //Scope Tab Variables ***
                vm.workScope = {};
                vm.customModules = [];
                vm.documents = [];
                vm.gapPoints = [];

                vm.selectedProductVariants = [];
                vm.groupedVariants = {};
                vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

                //***

                vm.tempTaskCounter = 0;

                vm.totalExtHrs = 0;
                vm.totalComplimentaryHours = 0;
                vm.totalWithoutComplimentaryHours = 0;
                //vm.removeMilestones = function (row) {
                //    var index = vm.projectTask.mileStones.indexOf(row);
                //    vm.projectTask.mileStones.splice(index, 1);
                //};
                vm.newpoints = [];
                vm.permissions = {
                    manageRelease: abp.auth.hasPermission('Pages.CBS.Release.ManageRelease'),
                    view: abp.auth.hasPermission('Pages.CBS.Projects.Milestones'),
                    crs: abp.auth.hasPermission('Pages.CBS.Projects.CRs'),
                    create: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.AddNew'),
                    edit: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.Edit'),
                    'delete': abp.auth.hasPermission('Pages.CBS.Projects.Milestones.Delete'),
                    'generateInvoice': abp.auth.hasPermission('Pages.CBS.Projects.Milestones.GenerateInvoice'),
                    status: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.Status'),
                    invoiceStatus: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.InvoiceStatus'),
                    paymentStatus: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.PaymentStatus')
                    
                    
                };

                vm.getInvoiceStatus = function (id) {
                    if (id == 1) {
                        return "Not-Invoiced";
                    }
                    else if (id == 2) {
                        return "Invoiced";
                    }

                }

                vm.createMilestone = function () {
                    openCreateOrEditMilestoneModal(null);
                };
                vm.editMilestone = function (id) {
                    openCreateOrEditMilestoneModal(id);
                };

                vm.deleteMilestone = function (id) {
                    abp.message.confirm(
                        app.localize('YesDelete'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                milestoneService.deleteMilestone({
                                    id: id
                                }).success(function () {
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                    getProjectMilestone();
                                });
                            }
                        }
                    );
                };

                function openCreateOrEditMilestoneModal(id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/milestones/createOrEditMilestoneModal.cshtml',
                        controller: 'host.views.cbs.milestones.createOrEditMilestoneModal as vm',
                        backdrop: 'static',
                        resolve: {
                            projectId: function () {
                                return vm.project.id;
                            },
                            changeRequestId: vm.project.changeRequestId,
                            id: id,
                            workspaceId: vm.workspaceId
                        }
                    });

                    modalInstance.result.then(function () {
                        getProjectMilestone();
                    });
                }

                vm.openViewMilestoneModal = function (id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/milestones/viewMilestoneModal.cshtml',
                        controller: 'host.views.cbs.milestones.createOrEditMilestoneModal as vm',
                        backdrop: 'static',
                        resolve: {
                            projectId: function () {
                                return project.id;
                            },
                            changeRequestId: project.changeRequestId,
                            id: id,
                            workspaceId: vm.workspaceId
                        }
                    });

                    modalInstance.result.then(function () {
                        getProjectMilestone();
                    });
                }

                vm.canMoveTask = true;
                vm.workspaceId = workspaceId;
                vm.prepareRelease = prepareRelease;
                vm.isInitiateFromCase = isInitiateFromCase;
                vm.releaseId = releaseId;
                vm.totalDueHours = 0;
                vm.totalActualHours = 0;
                vm.totalEstimatedHours = 0;
                vm.totalRevisedEstimatedHours = 0;
                vm.project = project;
                vm.inputList = [];
                vm.choices = [];
                vm.selectedTasks = [];
                vm.newCrId = null;
                vm.selectedParent = null;
                vm.focusEnable = true;
                vm.taskAction = null;
                vm.assignedToUser = null;
                vm.leftArrow = false;
                vm.rightArrow = false;
                vm.toolbarActions = false;
                vm.userType = null;
                vm.prepareRelease = true;
                vm.releaseId = 0;
                vm.activeReleases = 0;
                vm.activeRelease = 0;

                //vm.addMileStones = function () {

                //    vm.projectTask.mileStones.push(
                //        {
                //            id: 0,
                //            title: "",
                //            projectId: vm.project.id,
                //            supportRequestId: vm.project.changeRequestId,
                //            percentage: 0.0,
                //            isDeleted: false
                //        }
                //    );
                //};



                vm.getTypeName = function (type) {
                    if (type === 1) {
                        return 'D';
                    }
                    else if (type === 2) {
                        return 'P';
                    }
                    else if (type === 3) {
                        return 'C';
                    }
                    else if (type === 4) {
                        return 'F';
                    }
                    else if (type === 5) {
                        return 'M';
                    }
                    else if (type === 6) {
                        return 'S';
                    }
                    else if (type === 7) {
                        return 'A';
                    }
                    else if (type === 8) {
                        return 'O';
                    }
                };
                vm.getEndDate = function (endDate) {
                    const date = new Date(endDate);

                    const day = date.getDate();
                    const monthNames = [
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
                    const month = monthNames[date.getMonth()];

                    const formattedDate = `${day} ${month}`;
                    return formattedDate;

                };
                vm.toogleChild = function (task) {
                    //task.showChildren = true;
                    task.showChildren = !task.showChildren;
                    vm.heightAdjust();
                }
                vm.expandChild = function () {
                    //task.showChildren = true;
                    //vm.project.tasks.forEach(function (task) {
                    //    task.showChildren = false;
                    //});
                    expandAndCollapseTree(vm.project.tasks, false);

                    vm.heightAdjust();
                }
                vm.collapseChild = function () {
                    expandAndCollapseTree(vm.project.tasks, true);
                    //vm.project.tasks.forEach(function (task) {
                    //    task.showChildren = true;
                    //});
                    vm.heightAdjust();
                }
                function expandAndCollapseTree(projectList, setFormat) {
                    projectList.forEach(function (task) {

                        if (task.children) {
                            task.showChildren = setFormat;
                            expandAndCollapseTree(task.children, setFormat);
                        }
                    });
                }
                vm.isLeftMove = function () {

                    vm.selectedTasks.some(function (task) {
                        if (task.parentId == null) {
                            vm.leftArrow = true;

                            return true; // Stop the loop when the condition is met
                        }
                        vm.leftArrow = false;
                        return false; // Continue the loop if the condition is not met
                    });
                }
                vm.isRightMove = function () {

                    vm.selectedTasks.some(function (task) {
                        if (task.parentId == null) {
                            let selectedTaskIndex = vm.project.tasks.findIndex(x => x.id == task.id);
                            if (selectedTaskIndex == 0) {
                                vm.rightArrow = true;
                                return true; // Stop the loop when the condition is met
                            }
                        }
                        else {
                            let parentTask = nestedSearch(task.parentId);
                            let taskIndex = parentTask.children.findIndex(x => x.id == task.id);
                            if (taskIndex == 0) {
                                vm.rightArrow = true;
                                return true; // Stop the loop when the condition is met
                            }
                        }
                        vm.rightArrow = false;
                        //return false; // Continue the loop if the condition is not met
                    });
                }

                var myInterval = null;

                var tempRow = {};
                vm.assignUser = function (task) {

                    task.isEnabled = true;
                    setTimeout(function () {
                        $("#uiSelect_" + task.id + " span")[0].click();
                        tempRow = task;
                    }, 100);
                    myInterval = setInterval(vm.focsOut, 1);
                }
                vm.focsOut = function () {
                    $("#uiSelect_" + tempRow.id + " input").focusout(function () {
                        tempRow.isEnabled = false;
                        clearInterval(myInterval);

                    });
                };

                //$("#uiSelect_" + tempRow.id + " input").on("focusout", function () {
                //
                //    tempRow.isEnabled = false;

                //});
                vm.newTask = { title: '', description: '', projectId: vm.project.id };

                vm.createTaskOnBlur = function (task) {
                    task.description = task.description ? task.description.trim() : "";
                    if ((task.title) || (task.description)) {
                        // Call your create task service
                        taskDetailService.createNewPoint({
                            taskDetail: task
                        }).success(function (result) {
                            init();
                            task.descriptionAdd = false;
                            vm.newTask = { title: '', description: '', projectId: vm.project.id };
                        });
                    }
                    //vm.heightAdjust();

                };
                vm.saveOnBlur = function (task) {

                    if (task.id != 0 && task.title != "") {
                        taskDetailService.createOrEdit({
                            taskDetail: task
                        }).success(function (result) {
                            task.descriptionAdd = false;
                            task.id = result.key;
                        });
                    }
                };
                vm.heightAdjust = function () {
                    setTimeout(function () {
                        var textareas = document.querySelectorAll('textarea');
                        textareas.forEach(function (element) {
                            element.value = element.value.trim();
                            element.style.height = "25px"; // Reset the height to auto
                            element.style.height = (element.scrollHeight) + "px";
                        });
                    }, 200);
                };
                vm.toggleDescription = function ($event,task) {
                    //task.descriptionAdd = true;
                    var element = event.target; // Get the specific textarea element
                    element.value = element.value.trim();
                    element.style.height = "auto"; // Reset the height to auto
                    element.style.height = (element.scrollHeight) + "px";
                };
                vm.resetTextareaHeight = function ($event,task) {
                    var element = event.target; // Get the specific textarea element
                    element.value = element.value.trim();
                    element.style.height = "25px";
                };

                vm.getTasks = function () {


                    if (vm.filters.assignToUserId == undefined && vm.filters.assignToUserId == null && vm.filters.status == undefined && vm.filters.status == null) {
                        vm.canMoveTask = false;
                    } else {
                        vm.canMoveTask = true;
                    }
                    vm.selectedTasks.length = 0;
                    vm.changeTaskStatusFilter();
                    vm.filters.taskType = 2;
                    taskDetailService.getProjectTasksNew(vm.filters)
                        .success(function (result) {
                            vm.project.tasks = result;
                            vm.calcSummaries();
                            if (!vm.project.tasks)
                                vm.project.tasks = [];
                            vm.addNewTask();
                        });
                    /*taskDetailService.getProjectNewPoints(vm.project.id)
                        .then(function (response) {
                            vm.newpoints = response.data || [];
                            vm.addNewTask();
                        }, function (error) {
                            console.error("API call failed", error);
                        });*/



                };
                vm.searchUsers = function ($select) {
                    if ($select.search == "")
                        return null;
                    userService.searchUsers({ keyword: $select.search }).then(function (response) {
                        vm.users = response.data.items;
                    });
                };
                vm.addNewTask = function () {

                    if (vm.project.tasks.length == 0 || vm.project.tasks[vm.project.tasks.length - 1].title) {
                        if (vm.project.tasks.length > 0) {
                            var maxPriority = vm.project.tasks.reduce(function (max, status) {
                                return status.priority > max ? status.priority : max;
                            }, vm.project.tasks[0].priority);
                        }

                        if (vm.workspaceId) {

                            vm.project.tasks.push({ 'title': '', 'id': 0, projectId: vm.project.id, 'children': [], 'parentId': null, 'type': vm.project.boardType ? vm.project.boardType : 8, 'taskStageId': 15, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': vm.project.tasks.length > 0 ? (maxPriority + 1) : 1, 'addAboveOrBelowTask': null, 'selectTask': null });
                        }
                        else {

                            vm.project.tasks.push({ 'title': '', 'id': 0, projectId: vm.project.id, supportRequestId: vm.project.changeRequestId, 'children': [], 'parentId': null, 'type': 2, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': vm.project.tasks.length > 0 ? (maxPriority + 1) : 1, 'addAboveOrBelowTask': null, 'selectTask': null });
                        }
                    }
                };

                vm.selectAllCheckbox = false;
                vm.isTaskSelected = function (task) {
                    return task.selected === true;
                };
                
                //multitask selection 
                vm.toggleSelectAll = function () {
                    var eligibleTasks = vm.filteredTasks.filter(function (task) {
                        return task.category == 3 && task.category != 2 && task.supportRequestId == null;
                    });

                    angular.forEach(eligibleTasks, function (task) {
                        task.selected = vm.selectAll;
                    });

                    vm.selectedTasks = eligibleTasks.filter(function (task) {
                        return task.selected;
                    });
                };


                // Toggle Individual Task Selection
                vm.toggleTaskSelection = function (task, index) {
                    // Agar task disable hai
                    if (task.category == 2 || task.category != 3 || task.supportRequestId != null) {
                        task.selected = false; // safety
                        return;
                    }

                    if (task.selected) {
                        if (!vm.selectedTasks.includes(task)) {
                            vm.selectedTasks.push(task);
                        }
                    } else {
                        vm.selectedTasks = vm.selectedTasks.filter(function (selectedTask) {
                            return selectedTask !== task;
                        });
                    }

                    // Eligible tasks nikalo
                    var eligibleTasks = vm.filteredTasks.filter(function (t) {
                        return t.category == 3 && t.category != 2 && t.supportRequestId == null;
                    });

                    // Agar koi eligible task hai aur sabhi selected hain to hi true hoga
                    vm.selectAll = eligibleTasks.length > 0 && eligibleTasks.every(function (t) {
                        return t.selected;
                    });
                };



                // Optional: Initialize selected tasks on load or filter change
                vm.initializeSelection = function () {
                    // Ensure all disabled tasks (category == 2) are not selected
                    angular.forEach(vm.filteredTasks, function (task) {
                        if (task.category == 2) {
                            task.selected = false;
                        }
                    });

                    // Update selected tasks array
                    vm.selectedTasks = vm.filteredTasks.filter(function (task) {
                        return task.selected && task.category != 2;
                    });

                    // Update select all checkbox state
                    var selectableTasksCount = vm.filteredTasks.filter(function (t) {
                        return t.type === null && t.category != 2;
                    }).length;

                    var selectedSelectableTasksCount = vm.filteredTasks.filter(function (t) {
                        return t.type === null && t.category != 2 && t.selected;
                    }).length;

                    vm.selectAll = selectableTasksCount > 0 && selectableTasksCount === selectedSelectableTasksCount;
                };


                vm.toggleSelection = function (row, index) {
                    arrangeList = [];
                    if (row.id != 0) {

                        var isRowIdInArray = vm.selectedTasks.some(function (item) {
                            return item.id === row.id;
                        });

                        if (isRowIdInArray) {

                            //row.selected = false;

                            // The row ID already exists in the array
                            document.getElementById('task_' + row.id).style.backgroundColor = 'white';
                            document.getElementById('input_' + row.id + "_" + index).style.backgroundColor = 'white';

                            if (row.description || row.descriptionAdd) {

                                document.getElementById('inputDes_' + row.id + "_" + index).style.backgroundColor = 'white';
                            }
                            if (row.parentId != null) {

                                let parent = nestedSearch(row.parentId);
                                let indexRemove = parent.children.findIndex(x => x.id === 0);
                                if (indexRemove > -1) {
                                    parent.children.splice(indexRemove, 1)
                                }

                            }
                            else {
                                let indexRemove = vm.project.tasks.findIndex(function (item) {
                                    return item.id === 0;
                                });
                                if (indexRemove > -1) {
                                    vm.project.tasks.splice(indexRemove, 1)
                                }

                            }

                            var index = vm.selectedTasks.findIndex(function (item) {
                                return item.id === row.id;
                            });
                            if (index > -1) {
                                vm.selectedTasks.splice(index, 1);
                            }

                            if (vm.selectedTasks.length > 0 && vm.project.tasks[vm.project.tasks.length - 1].id == 0) {

                                vm.project.tasks.pop();

                            }
                            else {
                                if (vm.selectedTasks.length == 0) {

                                    if (!vm.project.tasks)
                                        vm.project.tasks = [];
                                    vm.addNewTask();
                                }
                            }

                            if (row.children.length > 0) {
                                if (row.children[row.children.length - 1].id == 0) {

                                    row.children.pop();
                                }

                            }

                            vm.isLeftMove();
                            vm.isRightMove();
                            vm.heightAdjust();
                        } else {

                            document.getElementById('task_' + row.id).style.backgroundColor = 'rgb(233 233 233)';
                            document.getElementById('input_' + row.id + "_" + index).style.backgroundColor = 'rgb(233 233 233)';
                            if (row.description || row.descriptionAdd) {

                                document.getElementById('inputDes_' + row.id + "_" + index).style.backgroundColor = 'rgb(233 233 233)';
                            }
                            vm.selectedTasks.push(row);
                            reArrangeList(vm.project.tasks);
                            vm.selectedTasks = arrangeList;

                            if (vm.selectedTasks.length > 0 && vm.project.tasks[vm.project.tasks.length - 1].id == 0) {
                                vm.project.tasks.pop();

                            }
                            vm.isLeftMove();
                            vm.isRightMove();

                            //row.selected = true;
                        }
                    }
                };

                var arrangeList = [];
                function reArrangeList(projectList) {
                    if (vm.selectedTasks.length > 0) {
                        projectList.forEach(function (task) {
                            for (var i = 0; i < vm.selectedTasks.length; i++) {
                                if (task.id == vm.selectedTasks[i].id && task.priority == vm.selectedTasks[i].priority) {
                                    arrangeList.push(vm.selectedTasks[i]);
                                }
                            }
                            if (task.children) {
                                reArrangeList(task.children);
                            }
                        });
                    }
                }
                //vm.showTextArea = function (item, index) {

                //    if (item.id != 0) {

                //        item.textAreaVisible = true;
                //        setTimeout(function () {
                //            document.getElementById('textArea_' + index).focus();
                //        }, 200);
                //    }

                //};
                //vm.hideTextArea = function (item) {
                //        item.textAreaVisible = false;

                //};
                vm.removeNewChoice = function () {
                    var newItemNo = vm.project.endTasks.length;
                    if (newItemNo > 0) {
                        vm.project.endTasks.pop();
                    }
                };

                //vm.taskDetail = {
                //    title: "",
                //    id: ""
                //};
                vm.editTitle = "";
                vm.filters = {
                    changeRequestId: vm.project.changeRequestId,
                    id: vm.project.id,
                    activeMilestoneId: null,
                    taskStatusesArray:
                        [
                            { id: 1, name: 'New' },
                            { id: 2, name: 'To Be Discussed' },
                            { id: 3, name: 'In Progress' }
                        ],
                    taskStatuses: [1, 2, 3],
                    taskType: 0
                };
                if ((vm.filters.changeRequestId != null && vm.filters.changeRequestId != 0 && vm.filters.changeRequestId != undefined) || vm.workspaceId) {
                    vm.filters.taskStatusesArray.push({ id: 4, name: 'Completed' });
                }
                //var previousTask = {
                //    title: ""
                //};
                vm.saveAssigned = function (task) {
                    if (task.id != 0 && task.title != "") {
                        task.assignedToId = task.assignedToUser.id;
                        taskDetailService.createOrEdit({
                            taskDetail: task
                        }).success(function (result) {

                            task.assignedTo = task.assignedToUser;
                            task.isEnabled = false;
                        });
                    }
                };
                vm.handleKeyPress = function (event, task, index) {


                    var taskId = task.id;
                    if (task.title) {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            //if (previousTask != null && previousTask.title == task.title) {
                            //    previousTask.title = task.title;
                            //    task.textAreaVisible = false;
                            //    return;
                            //}
                            //previousTask.title = task.title;
                            task.title = task.title.trim();
                            taskDetailService.createOrEdit({
                                taskDetail: task,
                                addAboveOrBelowTask: task.addAboveOrBelowTask,
                                selectTaskId: task.selectTask != null ? task.selectTask.id : null
                            }).success(function (result) {

                                //vm.focusEnable = true;
                                task.id = result.key;
                                //document.getElementById('input_' + taskId).blur();
                            });
                            //document.getElementById('input_' + taskId).blur();
                            if (taskId == 0) {
                                //vm.addNewChoice();

                                if (task.parentId && task.addAboveOrBelowTask == undefined) {
                                    vm.createProjectChildTask(vm.selectedParent, index);

                                }
                                else if (task.addAboveOrBelowTask == 2) {
                                    vm.createProjectTaskUP(task.addAboveOrBelowTask, task.selectTask);

                                }
                                else if (task.addAboveOrBelowTask == 1) {
                                    vm.createProjectTaskDown(task.addAboveOrBelowTask, task);

                                }
                                else {
                                    vm.addNewTask();
                                    setTimeout(function () {
                                        document.getElementById("input_0" + "_" + (index + 1)).focus();
                                    }, 200);
                                }
                            }
                            else {
                                document.getElementById('input_' + task.id + "_" + index).blur();
                                if (task.description) {
                                    document.getElementById('inputDes_' + task.id + "_" + index).blur();
                                }
                            }
                            //vm.heightAdjust();

                        }
                    }
                };


                vm.toggleInput = function () {
                    vm.addNewChoice();
                    vm.showInput = !vm.showInput;
                    //document.querySelector("#newTaskTitle_1").focus();
                };
                vm.handleDes = function (task, $index) {
                    let isRow = vm.selectedTasks.some(function (item) {
                        return item.id === task.id;
                    });

                    task.descriptionAdd = true;

                    setTimeout(function () {
                        if (isRow) {
                            document.getElementById('inputDes_' + task.id + "_" + $index).style.backgroundColor = 'rgb(233 233 233)';
                        }
                        document.getElementById("inputDes_" + task.id + "_" + $index).focus();
                    }, 200);
                };
                vm.refresh = function () {
                    if (vm.filters.assignToUserId == undefined && vm.filters.assignToUserId == null && vm.filters.status == undefined && vm.filters.status == null) {
                        vm.canMoveTask = false;
                    } else {
                        vm.canMoveTask = true;
                    }
                    vm.selectedTasks.length = 0;
                    vm.loading = true;
                    vm.changeTaskStatusFilter();
                   /* taskDetailService.getProjectNewPoints(vm.project.id)
                        .then(function (response) {
                            vm.newpoints = response.data || [];
                            vm.addNewTask();
                            vm.loading = false;
                        }, function (error) {
                            console.error("API call failed", error);
                            vm.loading = false;
                        });*/
                    //vm.filters.activeMilestoneId = null;
                    vm.filters.taskType = 2;
                    taskDetailService.getProjectTasksNew(vm.filters)
                        .success(function (result) {
                            vm.project.tasks = result;
                            vm.calcSummaries();
                            if (!vm.project.tasks)
                                vm.project.tasks = [];
                            vm.addNewTask();
                            //vm.project.tasks = list_to_tree(vm.project.tasks);


                            vm.loading = false;
                            //vm.heightAdjust();
                            //$scope.$apply();
                        });




                };
                vm.changeTaskStatusFilter = function () {

                    vm.filters.taskStatuses = [];
                    if (vm.filters.taskStatusesArray.length > 0) {
                        angular.forEach(vm.filters.taskStatusesArray, function (value) {
                            vm.filters.taskStatuses.push(value.id);
                        });
                    }
                }

                vm.addEditRelease = function (status, taskId, task) {
                    if (!vm.releaseId) abp.message.error('Active Release is not selected.');
                    else {
                        taskDetailService.addRemoveRelease(taskId, vm.activeRelease, status, null)
                            .success(function () {
                                abp.notify.success(app.localize('Release Marked Successfully!'));
                            })
                            .error(function (err) {
                                if (err && err.message) {
                                    $timeout(function () {
                                        task.hasReleaseId = !status;
                                    }, 0);
                                }
                            })
                            .finally(function () {
                                vm.loading = false;
                            });
                    }
                };
                vm.addEditCritical = function (taskId, critical) {
                    taskDetailService.addRemoveCritical(taskId, critical);
                };
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
                        size: 'lg'
                    });
                    modalInstance.result.then(function (updateTask) {
                        //vm.refresh();
                        if (updateTask.parentId) {
                            let parentTask = nestedSearch(updateTask.parentId);
                            let taskIndex = parentTask.children.findIndex(t => t.id === updateTask.id);
                            //let t = parentTask.children[taskIndex];

                            parentTask.children[taskIndex].actualHours = updateTask.actualHours;
                            parentTask.children[taskIndex].assignedTo = updateTask.assignedTo;
                            if (updateTask.assignedTo != null) {
                                parentTask.children[taskIndex].assignedToId = updateTask.assignedTo.id;
                            }
                            else {
                                parentTask.children[taskIndex].assignedToId = null;
                            }
                            parentTask.children[taskIndex].resources = updateTask.resources;
                            parentTask.children[taskIndex].status = updateTask.status;
                            parentTask.children[taskIndex].taskStage = updateTask.taskStage;
                            parentTask.children[taskIndex].duration = updateTask.duration;
                            parentTask.children[taskIndex].revisedDuration = updateTask.revisedDuration;
                            vm.project.tasks[taskIndex].status = updateTask.status;
                        } else {
                            let taskIndex = vm.project.tasks.findIndex(t => t.id === updateTask.id);

                            vm.project.tasks[taskIndex].assignedTo = updateTask.assignedTo;
                            if (updateTask.assignedTo != null) {
                                vm.project.tasks[taskIndex].assignedToId = updateTask.assignedTo.id;
                            }
                            else {
                                vm.project.tasks[taskIndex].assignedToId = null;
                            }
                            vm.project.tasks[taskIndex].resources = updateTask.resources;


                            vm.project.tasks[taskIndex].actualHours = updateTask.actualHours;
                            vm.project.tasks[taskIndex].status = updateTask.status;
                            vm.project.tasks[taskIndex].taskStage = updateTask.taskStage;
                            vm.project.tasks[taskIndex].duration = updateTask.duration;
                            vm.project.tasks[taskIndex].revisedDuration = updateTask.revisedDuration;
                        }

                        vm.calcSummaries();
                    });
                };
                vm.statuses = [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'To Be Discussed' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' },
                    { id: 5, name: 'On Hold' }
                ];



                vm.getLocalDate = function (date) {
                    if (date !== null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('DD-MMM-YY');
                    }
                    else {
                        return "";
                    }
                };

                vm.clearAssignToUser = function () {
                    vm.filters.assignToUser = null;
                    vm.filters.assignToUserId = null;
                };

                vm.searchUsers = function ($select) {
                    if ($select.search == "")
                        return null;
                    userService.searchUsers({ keyword: $select.search }).then(function (response) {
                        vm.users = response.data.items;
                    });
                };

                //vm.moveLeftTasks = function (task) {


                //};
                //function childMove(tasks) {// task obj
                //     
                //        tasks.children.forEach(function (task) {
                //            console.log(task);
                //            var isRowIdSelected = vm.selectedTasks.some(function (item) {
                //                return item.id === task.id;
                //            });
                //            if (isRowIdSelected) {
                //                vm.moveLeftTasks(task);
                //            }
                //                childMove(task);
                //        });
                //}
                var tasksDetailEdit = [];
                vm.moveToUpLevel = function () {
                    //vm.loading = true;


                    //$scope.$apply(function () {
                    vm.selectedTasks.forEach(function (task) {

                        if (task.children.length > 0) {
                            if (task.children[task.children.length - 1].id == 0) {

                                task.children.pop();
                            }

                        }

                        let parentTask = nestedSearch(task.parentId);
                        let taskIndex = parentTask.children.findIndex(x => x.id == task.id);
                        parentTask.children.splice(taskIndex, 1);

                        let grandParentTask = nestedSearch(parentTask.parentId);

                        if (grandParentTask !== null) {
                            let parentTaskIndex = grandParentTask.children.findIndex(x => x.id == parentTask.id);
                            let parentNextSibling = grandParentTask.children[parentTaskIndex + 1];
                            if (parentNextSibling === undefined) {
                                task.priority = parentTask.priority + 1;
                                task.parentId = parentTask.parentId;
                            } else {
                                task.priority = (parentNextSibling.priority + parentTask.priority) / 2;
                                task.parentId = parentTask.parentId;
                            }
                            grandParentTask.children.splice(parentTaskIndex + 1, 0, task);
                        } else {
                            let parentTaskIndex = vm.project.tasks.findIndex(x => x.id == parentTask.id);
                            let parentNextSibling = vm.project.tasks[parentTaskIndex + 1];
                            if (parentNextSibling === undefined) {
                                task.priority = parentTask.priority + 1;
                                task.parentId = parentTask.parentId;
                            } else {
                                task.priority = (parentNextSibling.priority + parentTask.priority) / 2;
                                task.parentId = parentTask.parentId;
                            }
                            vm.project.tasks.splice(parentTaskIndex + 1, 0, task);
                        }
                        tasksDetailEdit.push(task);
                    });
                    taskDetailService.editTaskHierarchy({ tasksDetailEdit: tasksDetailEdit, isIndentOrDedent: 2 }).success(function () {
                        //taskDetailService.getTasksForProjectByProjectId(vm.project.id)
                        //    .success(function (result) {
                        //vm.loading = false;
                        //   });

                        vm.calcSummaries();
                        vm.selectedTasks.length = 0;
                        tasksDetailEdit.length = 0;
                        if (!vm.project.tasks)
                            vm.project.tasks = [];
                        vm.addNewTask();
                        vm.heightAdjust();
                    });


                    //});




                    //parentTask.children.splice(task, 1);
                    //task.parentId = parentTask.parentId;

                    //if (!parentNextSibling) {
                    //    task.priority = parentTask.priority + 1;
                    //}
                    //else {
                    //    task.priority = (parentNextSibling.priority + parentTask.priority) / 2;
                    //}

                    //if (grandParentTask) {
                    //    let index = grandParentTask.children.findIndex(t => t.id === parentTask.id) + 1;
                    //    grandParentTask.children.splice(index, 0, task);
                    //}
                    //else {
                    //    let index = vm.project.tasks.indexOf(parentTask) + 1;
                    //    vm.project.tasks.splice(index, 0, task);
                    //}
                    //----------------------------------------------
                };


                vm.moveToDownLevel = function () {
                    vm.selectedTasks.forEach(function (task) {
                        //vm.loading = true;
                        if (task.children.length > 0) {
                            if (task.children[task.children.length - 1].id == 0) {

                                task.children.pop();
                            }

                        }

                        let parentTask = nestedSearch(task.parentId);
                        if (parentTask === null) {
                            let taskIndex = vm.project.tasks.findIndex(x => x.id == task.id);
                            vm.project.tasks.splice(taskIndex, 1);
                            let previousTask = vm.project.tasks[taskIndex - 1];
                            task.parentId = previousTask.id;
                            if (previousTask.children.length === 0) {
                                task.priority = 1;
                            } else {
                                task.priority = previousTask.children[previousTask.children.length - 1].priority + 1;
                            }
                            previousTask.children.push(task);
                        } else {
                            let taskIndex = parentTask.children.findIndex(x => x.id == task.id);
                            parentTask.children.splice(taskIndex, 1);
                            previousTask = parentTask.children[taskIndex - 1];
                            task.parentId = previousTask.id;
                            if (previousTask.children.length === 0) {
                                task.priority = 1;
                            } else {
                                task.priority = previousTask.children[previousTask.children.length - 1].priority + 1;
                            }
                            previousTask.children.push(task);
                        }
                        tasksDetailEdit.push(task);
                        //task.selected = false;
                    });
                    taskDetailService.editTaskHierarchy({ tasksDetailEdit: tasksDetailEdit, isIndentOrDedent: 1 }).success(function () {
                        //taskDetailService.getTasksForProjectByProjectId(vm.project.id).success(function (result) {
                        //vm.loading = false;
                        //   });
                        vm.calcSummaries();
                        vm.selectedTasks.length = 0;
                        tasksDetailEdit.length = 0;
                        if (!vm.project.tasks)
                            vm.project.tasks = [];
                        vm.addNewTask();
                        vm.heightAdjust();
                    });




                    //if (task.parentId) {
                    //    let parent = nestedSearch(task.parentId);
                    //    parent.children.splice(parent.children.findIndex(x => x.id === task.id), 1);
                    //}
                    //else {
                    //    vm.project.tasks.splice(vm.project.tasks.findIndex(x => x.id === task.id), 1);
                    //}

                    //task.parentId = previousSibling.id;

                    //if (previousSibling.children.length === 0) {
                    //    task.priority = 1;
                    //} else {
                    //    task.priority = previousSibling.children[previousSibling.children.length - 1].priority + 1;
                    //}

                    //previousSibling.children.push(task);

                };

                vm.childSortChanged = function (event, ui) {
                    let u = ui.item.attr('childData-id');
                    if (!u) return;

                    vm.loading = true;

                    var obj = JSON.parse(u);
                    let task = nestedSearch(obj.id);

                    let parentTask = nestedSearch(task.parentId);
                    let perviousIndex = parentTask.children.findIndex(x => x.id === task.id);
                    let updatedIndex = ui.item.index();

                    if (updatedIndex === 0) { //Moved to Top
                        task.priority = (parentTask.children[0].priority) / 2;
                        parentTask.children.splice(perviousIndex, 1);
                        parentTask.children.splice(updatedIndex, 0, task);
                    }
                    else if (updatedIndex === (parentTask.children.length - 1)) { //Moved To Last
                        task.priority = parentTask.children[parentTask.children.length - 1].priority + 1;
                        parentTask.children.splice(updatedIndex, 0, task);
                        parentTask.children.splice(perviousIndex, 1);
                    }
                    else {

                        if (updatedIndex > perviousIndex) {
                            task.priority = (parentTask.children[updatedIndex].priority + parentTask.children[updatedIndex + 1].priority) / 2;
                            parentTask.children.splice(updatedIndex, 0, task);
                            parentTask.children.splice(perviousIndex, 1);
                        } else {
                            task.priority = (parentTask.children[updatedIndex - 1].priority + parentTask.children[updatedIndex].priority) / 2;
                            parentTask.children.splice(perviousIndex, 1);
                            parentTask.children.splice(updatedIndex, 0, task);
                        }
                    }


                    taskDetailService.updateProjectTaskPriority(task).success(function () {
                        vm.refresh();
                        var interval = setInterval(function () {

                            //document.getElementById("task_"+task.id).scrollIntoView();
                            vm.loading = false;
                            clearInterval(interval);
                        },
                            1500);
                    });
                };

                vm.sortChanged = function (event, ui) {

                    let u = ui.item.attr('data-id');
                    if (!u) return;

                    vm.loading = true;

                    var obj = JSON.parse(u);
                    let perviousIndex = project.tasks.findIndex(x => x.id === obj.id);
                    let updatedIndex = ui.item.index();
                    let task = project.tasks[perviousIndex];

                    if (updatedIndex === 0) {
                        task.priority = (project.tasks[0].priority) / 2;
                        project.tasks.splice(perviousIndex, 1);
                        project.tasks.splice(updatedIndex, 0, task);
                    }
                    else if (updatedIndex === (project.tasks.length - 1)) {
                        task.priority = project.tasks[project.tasks.length - 1].priority + 1;
                        project.tasks.splice(updatedIndex, 0, task);
                        project.tasks.splice(perviousIndex, 1);
                    }
                    else {
                        if (updatedIndex > perviousIndex) {
                            task.priority = (project.tasks[updatedIndex].priority + project.tasks[updatedIndex + 1].priority) / 2;
                            project.tasks.splice(updatedIndex, 0, task);
                            project.tasks.splice(perviousIndex, 1);
                        } else {
                            task.priority = (project.tasks[updatedIndex - 1].priority + project.tasks[updatedIndex].priority) / 2;
                            project.tasks.splice(perviousIndex, 1);
                            project.tasks.splice(updatedIndex, 0, task);

                        }
                    }

                    taskDetailService.updateProjectTaskPriority(task).success(function () {
                        vm.refresh();
                        var interval = setInterval(function () {
                            //document.getElementById("task_" +task.id).scrollIntoView();
                            vm.loading = false;
                            clearInterval(interval);
                        }, 1500);
                    });

                    //$scope.$apply();
                };

                vm.openUpdateStatusAcdProgressModal = function (projectId, parentTaskId, taskId) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/taskDetails/updateStatusAndProgressModal.cshtml',
                        controller: 'host.views.cbs.tasks.updateStatusAndProgress as vm',
                        backdrop: 'static',
                        resolve: {
                            options: function () {
                                return {
                                    projectId: projectId,
                                    parentId: parentTaskId,
                                    taskId: taskId
                                };
                            }
                        },
                        size: 'sm'
                    });
                    modalInstance.result.then(function (task) {
                        let parentTask = nestedSearch(task.parentId);
                        if (parentTask !== null) {
                            let taskIndex = parentTask.children.findIndex(t => t.id === task.id);
                            let t = parentTask.children[taskIndex];
                            t.percentComplete = task.percentComplete;
                            t.status = task.status;
                        } else {
                            let taskIndex = vm.project.tasks.findIndex(t => t.id === task.id);
                            let t = vm.project.tasks[taskIndex];
                            t.percentComplete = task.percentComplete;
                            t.status = task.status;
                        }
                    });
                };


                vm.openEditAssignToUserModal = function (task) {
                    document.getElementById("selectUserDropDown").blur();
                    document.getElementById("searchButton").blur();
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/taskDetails/editAssignToUserModal.cshtml',
                        controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                        backdrop: 'static',
                        resolve: {
                            options: function () {
                                return {
                                    projectId: task.projectId,
                                    parentId: task.parentId,
                                    taskId: task.id
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (updateTask) {
                        if (updateTask.parentId) {
                            let parentTask = nestedSearch(updateTask.parentId);
                            let taskIndex = parentTask.children.findIndex(t => t.id === updateTask.id);
                            let t = parentTask.children[taskIndex];
                            t.assignedTo = updateTask.assignedTo;
                            t.resources = updateTask.resources;
                        } else {
                            let taskIndex = vm.project.tasks.findIndex(t => t.id === updateTask.id);
                            vm.project.tasks[taskIndex].assignedTo = updateTask.assignedTo;
                            vm.project.tasks[taskIndex].resources = updateTask.resources;
                        }
                    });
                };

                vm.openViewOrEditProjectTaskModal = function (projectId, parentTaskId, taskId) {
                    document.getElementById("selectUserDropDown").blur();
                    document.getElementById("searchButton").blur();
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/taskDetails/viewOrEditProjectTaskModal.cshtml',
                        controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            options: function () {
                                return {
                                    projectId: projectId,
                                    parentId: parentTaskId,
                                    taskId: taskId
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (tasks) {

                        let parentTask = nestedSearch(tasks[0].parentId);
                        if (parentTask !== null) {
                            let taskIndex = parentTask.children.findIndex(t => t.id === tasks[0].id);
                            let t = parentTask.children[taskIndex];
                            t.title = tasks[0].title;
                            t.description = tasks[0].description;
                            t.startDate = tasks[0].startDate;
                            t.endDate = tasks[0].endDate;
                            t.assignedTo = tasks[0].assignedTo;
                            if (tasks[0].assignedTo != null) {
                                t.assignedToId = tasks[0].assignedToId;
                            }
                            else {
                                t.assignedToId = null;
                            }
                            t.resources = tasks[0].resources;
                            t.critical = tasks[0].critical;
                        } else {
                            let taskIndex = vm.project.tasks.findIndex(t => t.id === tasks[0].id);
                            let t = vm.project.tasks[taskIndex];
                            t.title = tasks[0].title;
                            t.description = tasks[0].description;
                            t.startDate = tasks[0].startDate;
                            t.endDate = tasks[0].endDate;
                            t.assignedTo = tasks[0].assignedTo;
                            if (tasks[0].assignedTo != null) {
                                t.assignedToId = tasks[0].assignedToId;
                            }
                            else {
                                t.assignedToId = null;
                            }
                            t.resources = tasks[0].resources;
                            t.critical = tasks[0].critical;
                        }
                        vm.refresh();
                    });
                };

                vm.openUpdateActualHoursModal = function (task) {

                    document.getElementById("selectUserDropDown").blur();
                    document.getElementById("searchButton").blur();

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/taskDetails/updateActualHoursModal.cshtml',
                        controller: 'host.views.cbs.tasks.updateActualHoursModal as vm',
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
                        let parentTask = nestedSearch(updatedTaskDetail.parentId);
                        if (parentTask !== null) {
                            let taskIndex = parentTask.children.findIndex(t => t.id === updatedTaskDetail.id);
                            let t = parentTask.children[taskIndex];
                            t.duration = updatedTaskDetail.duration;
                            t.actualHours = updatedTaskDetail.actualHoursNew;
                            t.revisedDuration = updatedTaskDetail.revisedDuration;
                            t.status = updatedTaskDetail.status;
                        } else {
                            let taskIndex = vm.project.tasks.findIndex(t => t.id === updatedTaskDetail.id);
                            let t = vm.project.tasks[taskIndex];
                            t.duration = updatedTaskDetail.duration;
                            t.actualHours = updatedTaskDetail.actualHoursNew;
                            t.revisedDuration = updatedTaskDetail.revisedDuration;
                            t.status = updatedTaskDetail.status;
                        }
                        vm.calcSummaries();

                    });
                };
                vm.showInput = false;


                //vm.addTask = function (projectId) {
                //    var new_input = "<div class='dd3-content' style='height: auto!important; background - color: white; '>"+
                //        "< div class='row margin-bottom-10' >" +
                //        "< input style=' width: 763px; border: white; ' class='form - control' type='text' > "
                //    "</div >" +
                //        "</div >";



                //    $('#new_chq').append(new_input);


                //};
                vm.createProjectChildTask = function (task, index) {

                    vm.selectedParent = task;

                    if (task.parentId != null) {
                        let parent = nestedSearch(task.parentId);
                        let indexRemove = parent.children.findIndex(x => x.id === 0);
                        if (indexRemove > -1) {
                            parent.children.splice(indexRemove, 1)
                        }

                    }
                    else {
                        let indexRemove = vm.project.tasks.findIndex(function (item) {
                            return item.id === 0;
                        });
                        if (indexRemove > -1) {
                            vm.project.tasks.splice(indexRemove, 1)
                        }
                    }
                    var taskLength;
                    if (task.children.length == 0) {
                        if (task.children.length > 0) {
                            var maxPriorityChild = task.children.reduce(function (max, status) {
                                return status.priority > max ? status.priority : max;
                            }, task.children[0].priority);
                        }
                        if (vm.workspaceId) {

                            task.children.push({ 'title': '', 'id': 0, projectId: vm.project.id, 'parentId': task.id, 'selectTaskId': task.id, 'children': [], 'type': task.type, 'taskStageId': 15, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': 1, 'addAboveOrBelowTask': null, 'selectTask': null });
                        }
                        else {

                            task.children.push({ 'title': '', 'id': 0, projectId: vm.project.id, supportRequestId: vm.project.changeRequestId, 'parentId': task.id, 'selectTaskId': task.id, 'children': [], 'type': task.type, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': 1, 'addAboveOrBelowTask': null, 'selectTask': null });
                        }
                        taskLength = index == undefined ? (task.children.length - 1) : (index + 1);
                        setTimeout(function () {
                            document.getElementById("input_0_" + taskLength).focus();
                        }, 200);
                    }
                    else {
                        if (task.children[task.children.length - 1].title) {
                            if (task.children.length > 0) {
                                var maxPriorityChild = task.children.reduce(function (max, status) {
                                    return status.priority > max ? status.priority : max;
                                }, task.children[0].priority);
                            }
                            if (vm.workspaceId) {

                                task.children.push({ 'title': '', 'id': 0, projectId: vm.project.id, 'parentId': task.id, 'selectTaskId': task.id, 'children': [], 'type': task.type, 'taskStageId': 15, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': task.children.length > 0 ? (maxPriorityChild + 1) : 1, 'addAboveOrBelowTask': null, 'selectTask': null });
                            }
                            else {

                                task.children.push({ 'title': '', 'id': 0, projectId: vm.project.id, supportRequestId: vm.project.changeRequestId, 'parentId': task.id, 'selectTaskId': task.id, 'children': [], 'type': task.type, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': task.children.length > 0 ? (maxPriorityChild + 1) : 1, 'addAboveOrBelowTask': null, 'selectTask': null });
                            }
                            taskLength = index == undefined ? (task.children.length - 1) : (index + 1);
                            setTimeout(function () {
                                document.getElementById("input_0_" + taskLength).focus();
                            }, 200);
                        }
                    }
                };
                vm.createProjectTaskUP = function (addAboveOrBelowTask, selectTask) {
                    if (selectTask.children.length > 0) {
                        if (selectTask.children[selectTask.children.length - 1].id == 0) {
                            selectTask.children.splice(selectTask.children.length - 1, 1)
                        }
                    }
                    if (selectTask.parentId != null) {
                        let parent = nestedSearch(selectTask.parentId);
                        let indexRemove = parent.children.findIndex(x => x.id === 0 && x.addAboveOrBelowTask === 1);
                        if (indexRemove > -1) {
                            parent.children.splice(indexRemove, 1)
                        }

                    }
                    else {
                        let indexRemove = vm.project.tasks.findIndex(function (item) {
                            return item.id === 0 && item.addAboveOrBelowTask === 1;
                        });
                        if (indexRemove > -1) {
                            vm.project.tasks.splice(indexRemove, 1)
                        }
                    }
                    if (selectTask.parentId == null) {
                        let index = vm.project.tasks.findIndex(x => x.id === selectTask.id);
                        let setPriority = 0;
                        if (index == 0) {
                            setPriority = vm.project.tasks[index].priority / 2;
                        }
                        else {
                            setPriority = (vm.project.tasks[index].priority +
                                vm.project.tasks[index - 1].priority) / 2;
                        }
                        let addTask;
                        if (vm.workspaceId) {

                            addTask = { 'title': '', 'id': 0, projectId: vm.project.id, 'children': [], 'parentId': null, 'type': vm.project.boardType ? vm.project.boardType : 8, 'taskStageId': 15, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': setPriority, 'addAboveOrBelowTask': addAboveOrBelowTask, 'selectTask': selectTask };
                        }
                        else {

                            addTask = { 'title': '', 'id': 0, projectId: vm.project.id, supportRequestId: vm.project.changeRequestId, 'children': [], 'parentId': null, 'type': vm.userType, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': setPriority, 'addAboveOrBelowTask': addAboveOrBelowTask, 'selectTask': selectTask };
                        }
                        if (index == 0) {
                            vm.project.tasks.splice(index, 0, addTask);
                            setTimeout(function () {
                                document.getElementById("input_0_" + index).focus();
                            }, 200);
                        }
                        else if (vm.project.tasks[index - 1].title) {
                            vm.project.tasks.splice(index, 0, addTask);
                            setTimeout(function () {
                                document.getElementById("input_0_" + index).focus();
                            }, 200);
                        }

                    }
                    else {
                        let setPriority = 0;
                        let parent = nestedSearch(selectTask.parentId);
                        let index = parent.children.findIndex(x => x.id === selectTask.id);
                        if (index == 0) {
                            setPriority = parent.children[index].priority / 2;
                        }
                        else {
                            setPriority = (parent.children[index].priority +
                                parent.children[index - 1].priority) / 2;
                        }
                        let addTask;
                        if (vm.workspaceId) {

                            addTask = { 'title': '', 'id': 0, projectId: vm.project.id, 'children': [], 'parentId': parent.id, 'type': parent.type, 'taskStageId': 15, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': setPriority, 'addAboveOrBelowTask': addAboveOrBelowTask, 'selectTask': selectTask };
                        }
                        else {

                            addTask = { 'title': '', 'id': 0, projectId: vm.project.id, supportRequestId: vm.project.changeRequestId, 'children': [], 'parentId': parent.id, 'type': parent.type, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': setPriority, 'addAboveOrBelowTask': addAboveOrBelowTask, 'selectTask': selectTask };
                        }
                        if (index == 0) {
                            parent.children.splice(index, 0, addTask);
                            setTimeout(function () {
                                document.getElementById("input_0_" + index).focus();
                            }, 200);
                        }
                        else if (parent.children[index - 1].title) {
                            parent.children.splice(index, 0, addTask);
                            setTimeout(function () {
                                document.getElementById("input_0_" + index).focus();
                            }, 200);
                        }
                    }
                };
                vm.createProjectTaskDown = function (addAboveOrBelowTask, selectTask) {
                    if (selectTask.children.length > 0) {
                        if (selectTask.children[selectTask.children.length - 1].id == 0) {
                            selectTask.children.splice(selectTask.children.length - 1, 1)
                        }
                    }
                    if (selectTask.parentId == null) {
                        let taskIndex = vm.project.tasks.findIndex(x => x.id === selectTask.id);
                        if (taskIndex != 0) {
                            if (vm.project.tasks[taskIndex - 1].id == 0)
                                vm.project.tasks.splice(taskIndex - 1, 1)
                        }
                    }
                    else {
                        let parent = nestedSearch(selectTask.parentId);
                        let taskIndex = parent.children.findIndex(x => x.id === selectTask.id);
                        if (taskIndex != 0) {
                            if (parent.children[taskIndex - 1].id == 0)
                                parent.children.splice(taskIndex - 1, 1);
                        }
                    }

                    if (selectTask.parentId == null) {
                        let index = vm.project.tasks.findIndex(x => x.id === selectTask.id);
                        let setPriority = 0;
                        if (index == (vm.project.tasks.length - 1)) {
                            setPriority = vm.project.tasks[index].priority + 1;
                        }
                        else {
                            setPriority = (vm.project.tasks[index].priority +
                                vm.project.tasks[index + 1].priority) / 2;
                        }
                        let addTask;
                        if (vm.workspaceId) {

                            addTask = { 'title': '', 'id': 0, projectId: vm.project.id, 'children': [], 'parentId': null, 'type': vm.project.boardType ? vm.project.boardType : 8, 'taskStageId': 15, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': setPriority, 'addAboveOrBelowTask': addAboveOrBelowTask, 'selectTask': selectTask };
                        }
                        else {

                            addTask = { 'title': '', 'id': 0, projectId: vm.project.id, supportRequestId: vm.project.changeRequestId, 'children': [], 'parentId': null, 'type': vm.userType, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': setPriority, 'addAboveOrBelowTask': addAboveOrBelowTask, 'selectTask': selectTask };
                        }
                        if (index == (vm.project.tasks.length - 1)) {
                            vm.project.tasks.splice(index + 1, 0, addTask);
                            setTimeout(function () {
                                document.getElementById("input_0_" + (index + 1)).focus();
                            }, 200);
                        }
                        else if (vm.project.tasks[index + 1].title) {
                            vm.project.tasks.splice(index + 1, 0, addTask);
                            setTimeout(function () {
                                document.getElementById("input_0_" + (index + 1)).focus();
                            }, 200);
                        }
                    }
                    else {
                        let parent = nestedSearch(selectTask.parentId);
                        let index = parent.children.findIndex(x => x.id === selectTask.id);
                        let setPriority = 0;
                        if (index == (parent.children.length - 1)) {
                            setPriority = parent.children[index].priority + 1;
                        }
                        else {
                            setPriority = (parent.children[index].priority +
                                parent.children[index + 1].priority) / 2;
                        }
                        let addTask;
                        if (vm.workspaceId) {

                            addTask = { 'title': '', 'id': 0, projectId: vm.project.id, 'children': [], 'parentId': parent.id, 'type': parent.type, 'taskStageId': 15, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': setPriority, 'addAboveOrBelowTask': addAboveOrBelowTask, 'selectTask': selectTask };
                        }
                        else {

                            addTask = { 'title': '', 'id': 0, projectId: vm.project.id, supportRequestId: vm.project.changeRequestId, 'children': [], 'parentId': parent.id, 'type': parent.type, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': setPriority, 'addAboveOrBelowTask': addAboveOrBelowTask, 'selectTask': selectTask };
                        }
                        if (index == (parent.children.length - 1)) {
                            parent.children.splice(index + 1, 0, addTask);
                            setTimeout(function () {
                                document.getElementById("input_0_" + (index + 1)).focus();
                            }, 200);
                        }
                        else if (parent.children[index + 1].title) {
                            parent.children.splice(index + 1, 0, addTask);
                            setTimeout(function () {
                                document.getElementById("input_0_" + (index + 1)).focus();
                            }, 200);
                        }
                    }
                };
                vm.openCreateProjectTaskModal = function (projectId, parentTaskId, taskId, addAboveOrBelowTask, selectTaskId) {





                    let parent = nestedSearch(parentTaskId);
                    let index = null;
                    if (parent !== null) {
                        if (parent.children.length > 0)
                            index = parent.children.findIndex(x => x.id === selectTaskId);
                        else
                            index = 0;
                    } else
                        index = vm.project.tasks.findIndex(x => x.id === selectTaskId);

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/taskDetails/createOrEditProjectTaskModal.cshtml',
                        controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                        backdrop: 'static',
                        resolve: {
                            options: function () {
                                return {
                                    projectId: projectId,
                                    parentId: parentTaskId,
                                    taskId: taskId,
                                    addAboveOrBelowTask: addAboveOrBelowTask,
                                    selectTaskId: selectTaskId,
                                    parentTaskName: parent !== null ? parent.name : null,
                                    parentChildCount: parent && parent.children ? parent.children.length : 0,
                                    isLeaf: true
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (task) {
                        //vm.refresh();
                        var parentfound = false;
                        task[0].children = [];
                        if (task[0].parentId == null) {
                            vm.project.tasks.push(task[0]);
                            vm.project.tasks.sort(function (a, b) {
                                return parseFloat(a.priority) - parseFloat(b.priority);
                            });
                        }
                        else {
                            Recursive(vm.project.tasks, task[0], parentfound);
                        }
                        vm.calcSummaries();
                    });
                };

                function Recursive(AllTasks, task, parentfound) {
                    if (parentfound == false) {
                        for (var i = 0; i < AllTasks.length; i++) {
                            if (AllTasks[i].id == task.parentId) {
                                AllTasks[i].children.push(task);
                                parentfound = true;
                                break;
                            }
                            else {
                                if (AllTasks[i].children.length > 0) {
                                    Recursive(AllTasks[i].children, task, parentfound);
                                }
                            }
                        }

                    }
                }

                function nestedSearch(value) {
                    if (value !== null) {
                        return vm.project.tasks.reduce(function f(acc, val) {
                            return (val.id === value) ? val :
                                (val.children && val.children.length) ? val.children.reduce(f, acc) : acc;
                        }, null);
                    } else {
                        return null;
                    }
                }

                function calculateSum(sum, o, key) {
                    sum += o[key];
                    if (o.children && o.children.length)
                        for (let c in o.children)
                            sum = check(sum, o.children[c], key);
                    return sum;
                }

                vm.cancel = function () {
                    $uibModalInstance.close();
                };
                vm.feedbackType = [{ id: 2, Name: "Bug" }, { id: 3, Name: "CR" }, {id: 4, Name: "CR"}];
                vm.deleteTask = function () {


                    abp.message.confirm(
                        app.localize('DeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.selectedTasks.forEach(function (task) {
                                   

                                    let taskId = task.id;
                                    let parentTask = nestedSearch(task.parentId);
                                    taskDetailService.deleteTask(taskId).success(function () {
                                        if (parentTask !== null) {
                                            let index = parentTask.children.findIndex(x => x.id === taskId);
                                            parentTask.children.splice(index, 1);
                                        } else {
                                            let index = vm.project.tasks.findIndex(x => x.id === taskId);
                                            vm.project.tasks.splice(index, 1);
                                        }
                                        vm.getFeedbacksByProjectId();
                                        vm.getTasks();
                                    });
                                });
                               
                                vm.calcSummaries();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                vm.selectedTasks.length = 0;
                                if (!vm.project.tasks)
                                    vm.project.tasks = [];
                                vm.addNewTask();
                                
                                vm.refresh();
                            }
                        }
                    );
                };

                //function list_to_tree(list) {
                //    var map = {}, node, roots = [], i;

                //    for (i = 0; i < list.length; i += 1) {
                //        map[list[i].id] = i; // initialize the map
                //        list[i].children = []; // initialize the children
                //    }

                //    for (i = 0; i < list.length; i += 1) {
                //        node = list[i];
                //        if (node.parentId !== null) {
                //            // if you have dangling branches check that map[node.parentId] exists
                //            list[map[node.parentId]].children.push(node);
                //        } else {
                //            roots.push(node);
                //        }
                //    }
                //    return roots;
                //}



                //vm.calculateTotals = function () {
                //    vm.totalEstimatedHours = 0;
                //    vm.totalActualHours = 0;
                //    vm.totalDueHours = 0;
                //    vm.totalRevisedEstimatedHours = 0;

                //    for (let a in vm.project.tasks) {
                //        vm.totalEstimatedHours += calculate(0, vm.project.tasks[a], 'duration');
                //        vm.totalActualHours += calculate(0, vm.project.tasks[a], 'actualHours');
                //        vm.totalRevisedEstimatedHours += calculate(0, vm.project.tasks[a], 'revisedDuration');
                //    }

                //    vm.totalDueHours = vm.totalRevisedEstimatedHours - vm.totalActualHours;
                //    vm.totalPercentage = vm.totalActualHours / vm.totalEstimatedHours * 100;
                //    return 'Est:' + vm.totalEstimatedHours + 'h, Done: <span class="text-warning">' + vm.totalActualHours + 'h</span> , Due: <span class="text-danger">' + vm.totalDueHours + 'h </span>';
                //};

                vm.calcSummaries = function () {

                    vm.totalEstimatedHours = 0;
                    vm.totalActualHours = 0;
                    vm.totalDueHours = 0;
                    vm.totalRevisedEstimatedHours = 0;

                    for (let i in vm.project.tasks) {
                        sumUpDuration(vm.project.tasks[i]);
                        sumUpRevisedDuration(vm.project.tasks[i]);
                        sumUpDoneHours(vm.project.tasks[i]);
                    }

                    for (let i in vm.project.tasks) {
                        vm.totalEstimatedHours += vm.project.tasks[i].duration;
                        vm.totalActualHours += vm.project.tasks[i].actualHours;
                        vm.totalRevisedEstimatedHours += vm.project.tasks[i].revisedDuration;
                    }

                    vm.totalDueHours = vm.totalRevisedEstimatedHours - vm.totalActualHours;
                    vm.totalPercentage = vm.totalRevisedEstimatedHours ? (vm.totalActualHours / vm.totalRevisedEstimatedHours * 100) : 0;
                }

                function sumUpDuration(parentTask) {
                    if (!parentTask.children || !parentTask.children.length) {
                        return parentTask.duration;
                    } else {
                        let val = 0.0;
                        for (let i in parentTask.children) {
                            val += sumUpDuration(parentTask.children[i]);
                        }
                        parentTask.duration = val;
                        return val;
                    }
                }

                function sumUpRevisedDuration(parentTask) {
                    if (!parentTask.children || !parentTask.children.length) {
                        return parentTask.revisedDuration;
                    } else {
                        let val = 0.0;
                        for (let i in parentTask.children) {
                            val += sumUpRevisedDuration(parentTask.children[i]);
                        }
                        parentTask.revisedDuration = val;
                        return val;
                    }
                }

                function sumUpDoneHours(parentTask) {
                    if (!parentTask.children || !parentTask.children.length) {
                        return parentTask.actualHours;
                    } else {
                        let val = 0.0;
                        for (let i in parentTask.children) {
                            val += sumUpDoneHours(parentTask.children[i]);
                        }
                        parentTask.actualHours = val;
                        return val;
                    }
                }

                function calculate(sum, o, key, parentCalc) {
                    let hasChildren = o.children && o.children.length;
                    if (hasChildren) {
                        for (let c in o.children)
                            sum += calculate(sum, o.children[c], key, true);
                    }

                    if (!parentCalc) sum = o[key];
                    else if (!hasChildren) sum += o[key];

                    return sum;
                }

                vm.calcSum = function (sum, o, key) {
                    if (o.children && o.children.length)
                        return calculate(sum, o, key);
                    else
                        return o[key];
                };


                $scope.loadFile = function (files) {
                    vm.allowImport = false;
                    if (files.length > 0) {
                        $scope.$apply(function () {
                            vm.selectedFile = files[0];
                            readFileData();
                        });
                    } else {
                        vm.refresh();
                        $scope.$apply();
                    }
                };

                let selectedParentTask = null;
                vm.uploadTasks = function (task) {
                    selectedParentTask = task;
                    document.getElementById('dataFile').click();
                }

                function readFileData() {
                    (async function () {
                        vm.loading = true;

                        vm.fileDataList = [];
                        var file = vm.selectedFile;

                        if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                            var reader = new FileReader();
                            vm.loading = true;

                            reader.onload = function (e) {

                                var data = e.target.result;
                                var workbook = XLSX.read(data, { type: 'binary', cellDates: false, cellNF: false, cellText: false, dateNF: 'yyyy-mm-dd' });

                                ;
                                if (workbook.Strings[0].t.trim() !== "Name") {
                                    abp.message.error("In-valid Excel File Template must have columns(Name, Notes, Estimation)", "Error");
                                    vm.loading = false;

                                    $scope.$apply();

                                    return;
                                }

                                var first_sheet_name = workbook.SheetNames[0];

                                var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true });

                                if (dataObjects.length > 0) {

                                    for (var i = 0; i < dataObjects.length; i++) {

                                        var value = dataObjects[i];
                                        var record = {
                                            error: '',
                                            name: value['Name'] ? value['Name'].toString().trim() : '',
                                            notes: value['Notes'] ? value['Notes'].toString().trim() : '',
                                            estimation: value['Estimation'] ? value['Estimation'].toString().trim() : 0
                                        };

                                        vm.fileDataList.push(record);
                                    }

                                    if (vm.fileDataList.length > 0) {
                                        vm.allowImport = true;

                                        ;

                                        let tasks = [];
                                        vm.fileDataList.forEach(d => {
                                            tasks.push({
                                                title: d.name,
                                                description: d.notes,
                                                projectId: selectedParentTask.projectId,
                                                parentId: selectedParentTask.id,
                                                type: selectedParentTask.type,
                                                duration: d.estimation,
                                                taskStageId: selectedParentTask.taskStageId,
                                                status: selectedParentTask.status
                                            });
                                        });

                                        const getTaskBatch = () => {
                                            return tasks.splice(0, tasks.length > 300 ? 300 : tasks.length);
                                        }

                                        const saveTasks = function (tsks) {
                                            taskDetailService.addChildTasks({
                                                taskList: tsks,
                                                parentTaskId: selectedParentTask.id
                                            }).success(r => {
                                                if (tasks.length == 0) {
                                                    vm.loading = false;
                                                    init();
                                                }
                                                else
                                                    saveTasks(getTaskBatch())

                                            }).error(e => {
                                                abp.message.error(`Error in tasks import from Task: ${tsks[0].title}`);
                                            });
                                        }

                                        saveTasks(getTaskBatch());
                                    }
                                } else {
                                    abp.message.error("Something is Wrong Or File is empty !", "Error");
                                }

                                //vm.loading = false;
                                //$scope.$apply();
                            };

                            reader.onerror = function (ex) {
                                vm.loading = false;
                                abp.message.warn(
                                    app.localize(ex),
                                    'Unknown File'
                                );
                            };

                            reader.readAsBinaryString(file);

                        } else {
                            abp.message.error("Please select Valid file to upload !", "Unknown File");
                            vm.loading = false;
                        }

                    })();
                }

                // get ActiveRelease List for Dropdown
                vm.prepareReleaseChanged = function () {
                    if (vm.prepareRelease === true) {
                        releaseService.getActiveReleasesForPD()
                            .success(function (data) {
                                if (data.length === 0) {
                                    //vm.prepareRelease = false;
                                    abp.notify.error('No Active Release');
                                }
                                else {
                                    vm.activeReleases = data;
                                    vm.activeRelease = data[0].id;
                                    vm.releaseId = vm.activeRelease;
                                }
                            });
                    }
                }

                vm.releaseDetail = function () {

                    vm.loading = true;
                    taskDetailService.getReleaseTasks(vm.releaseId)
                        .success(function (data) {
                            vm.release = data;
                            vm.released = vm.release.isReleased;

                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                }


                //function calculate(sum, o, key) {
                //    let hasChildren = o.children && o.children.length;
                //    if (hasChildren) {
                //        for (let c in o.children)
                //            sum += calculate(sum, o.children[c], key);
                //    } else {
                //        sum += o[key];
                //    }
                //    return sum;
                //}

                //vm.calcSum = function (sum, o, key) {
                //    if (o.children && o.children.length)
                //        return calculate(sum, o, key);
                //    else
                //        return o[key];
                //};

                vm.multilineStringToHTML = (s) => utilities.multilineStringToHTML(s);
                vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);


                function init() {

                    vm.refresh();
                    //vm.addNewChoice();
                }

                vm.userChanged = function (userId) {

                };

                vm.round = function (val) { return Math.round(val, 2); }

                vm.exportTasksToExcel = function (taskList) {

                    function checkstatuses(status) {
                        if (status == 1)
                            return "New";
                        else if (status == 2)
                            return "To Be Discussed";
                        else if (status == 3)
                            return "InProgress";
                        else if (status == 4)
                            return "Completed";
                        else if (status == 5)
                            return "OnHold";
                    }

                    var parentTasks = [];
                    function getLeafNodes(nodes, result = []) {

                        for (var i = 0, length = nodes.length; i < length; i++) {
                            if (nodes[i].isLeaf) {
                                if (vm.filters.taskStatuses.includes(nodes[i].status))
                                //if (nodes[i].hasReleaseId) {
                                {
                                    result.push(nodes[i]);
                                }
                                //}
                            } else {
                                if (nodes[i].id > 0) {

                                    parentTasks.push({ id: nodes[i].id, title: nodes[i].title });
                                    result = getLeafNodes(nodes[i].children, result);
                                }
                            }
                        }
                        return result;
                    }

                    let leafTasks = getLeafNodes(taskList);
                    var tab1 = `<table border='1px'>
                    <tr>
                    <th>Name</th>
                    <th>Notes</th>
                    <th>Parent</th>
                    <th>Estimated Hours</th>
                    <th>Done</th>
                    <th>Percentage</th>
                    <th>Stage</th>
                    <th>Status</th>

                    </tr>
                    `;
                    leafTasks.forEach(t => {
                        let row = `<tr>
                        <td>${t.title}</td>
                        <td>${t.description}</td>
                        <td>${parentTasks.length > 0 && t.parentId != null ? parentTasks.find(x => x.id == t.parentId).title : ''}</td>
                        <td>${t.revisedEstimatedHours}</td>
                        <td>${t.doneHours}</td>
                        <td>${t.percentComplete}</td>
                        <td>${t.taskStage ? t.taskStage.name : ''}</td>
                        <td>${t.status ? checkstatuses(t.status) : ''}</td>
                        </tr>`
                        tab1 += row;
                    });

                    tab1 += "</table>";
                    var blob = new Blob([tab1], { type: "application/vnd.ms-excel" })
                    var blobUrl = URL.createObjectURL(blob);


                    var a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = 'ProjectsTask.xls';
                    a.click();

                };
                vm.getUserType = function () {
                    taskDetailService.getUserType(appSession.user.id).success(function (result) {

                        if (result != null)
                            vm.userType = result.type;
                        else {
                            vm.userType = 1;
                        }
                    });
                };
                vm.getMilestoneStatus = function (id) {
                    if (id == 1) {
                        return "Open";
                    }
                    else if (id == 2) {
                        return "Complete";
                    }
                    else if (id == 3) {
                        return "Delivered";
                    }

                }
                vm.getlocalDateTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('DD-MMM-YY');
                    }
                    else {
                        return "";
                    }
                };

                vm.getPriority = function (priority) {
                    if (priority == 3)
                        return app.localize("High");
                    else
                        return "";
                };

                vm.getPaymentMilestoneStatus = function (id) {
                    if (id == 1) {
                        return "Pending";
                    }
                    else if (id == 2) {
                        return "Received";
                    }

                }
                vm.getChargingType = function (id) {
                    if (id == 1) {
                        return "Paid";
                    }
                    else if (id == 2) {
                        return "Project Buffer";
                    }
                    else if (id == 3) {
                        return "Complementary";
                    }
                    else if (id == 4) {
                        return "Project GAP";
                    }

                }

                function getProjectMilestone() {
                    milestoneService.getMilestonesByProjectId(vm.projectTask).success(function (response) {
                        vm.projectTask.mileStones = response;
                        vm.refresh();

                    });

                };
                //Project GAPPoints ****Start****



                //Export To Excel Funciton For GAP Points

                vm.exportGapPointsToExcel = function () {
                    vm.loading = true;

                    var exportPayload = {
                        projectId: vm.projectTask.projectId,
                        title: vm.gapFilters.title,
                        reqNo: vm.gapFilters.reqNo,
                        status: vm.gapFilters.status,
                        releaseFromDate: vm.gapFilters.releaseDate ? vm.gapFilters.releaseDate.fromDate : null,
                        releaseToDate: vm.gapFilters.releaseDate ? vm.gapFilters.releaseDate.toDate : null
                    }

                    taskDetailService.exportGapPointsToExcel(exportPayload)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                };

                //GAP Points Filter View & Controller 
                vm.openGapPointFilter = function (type) {
                    $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projectsDashboard/gapPointFilters.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.gapPointFilters as vm',
                        backdrop: 'static',
                        resolve: {
                            filterType: function () {
                                return type;
                            },
                            projectId: function () {
                                return vm.project.id;
                            },
                            previousValue: function () {
                                return vm.gapFilters[type] || null;
                            }
                        }
                    }).result.then(function (result) {
                        if (result && result.projectId === vm.project.id) {
                            vm.gapFilters[result.type] = result.value;
                            vm.gapPointSearch();
                        }
                    });
                };


                //Project Status 
                vm.getTaskStatus = function (status) {
                    if (!status) return '';
                    else if (status == 1) return 'New';
                    else if (status == 2) return 'TBD';
                    else if (status == 3) return 'In Progress';
                    else if (status == 4) return 'Completed';
                    else return '';
                };
                vm.getChargingType = function (chargingType) {
                    if (!chargingType) return '';
                    else if (chargingType == 1) return 'Paid';
                    else if (chargingType == 2) return 'Buffer';
                    else if (chargingType == 3) return 'Complementary';
                    else if (chargingType == 4) return 'GAP';
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

                vm.setOriginalValue = function (task, field) {
                    if (!task || !field) return;
                    vm.originalValues[task.id] = vm.originalValues[task.id] || {};
                    vm.originalValues[task.id][field] = (task[field] || '').trim();
                };
                //Description of Project 
                vm.focusDescription = function (taskId) {
                    vm.focusedDescriptionId = taskId;
                    setTimeout(() => {
                        const descEl = document.getElementById("desc_" + taskId);
                        if (descEl) {
                            descEl.focus();
                        }
                    }, 100);
                };
                // Resizing Text Area Funciton for GAP Points 
                vm.autoResizeTextarea = function () {
                    setTimeout(function () {
                        var textareas = document.querySelectorAll('textarea');
                        textareas.forEach(function (value) {
                            value.style.height = 'auto';
                            value.style.height = value.scrollHeight + 'px';
                        });
                    }, 0);
                };
                //Gap point filters clear 

                vm.clearFilter = function (type, fromGapPointorFeedback) {
                    if (fromGapPointorFeedback) {
                        delete vm.feedbackFilters[type];
                        vm.feedbackSearch();
                    }
                    else {
                        delete vm.gapFilters[type];
                        vm.gapPointSearch();
                    }
                };
                //GAP Points Filters 

                vm.gapPointSearch = function () {
                    vm.filteredGapTasks = vm.gapProjectTasks.filter(function (task) {
                        if (vm.gapFilters.title && !task.title?.toLowerCase().includes(vm.gapFilters.title.toLowerCase())) {
                            return false;
                        }
                        if (vm.gapFilters.reqNo && !task.reqNo?.toLowerCase().includes(vm.gapFilters.reqNo.toLowerCase())) {
                            return false;
                        }
                        if (vm.gapFilters.status && vm.gapFilters.status.length > 0 && !vm.gapFilters.status.includes(task.status)) {
                            return false;
                        }
                        if (vm.gapFilters.releaseDate) {
                            const taskDate = new Date(task.releaseDate);
                            const from = vm.gapFilters.releaseDate.fromDate ? new Date(vm.gapFilters.releaseDate.fromDate) : null;
                            const to = vm.gapFilters.releaseDate.toDate ? new Date(vm.gapFilters.releaseDate.toDate) : null;

                            if ((from && taskDate < from) || (to && taskDate > to)) {
                                return false;
                            }
                        }

                        return true;
                    });

                    vm.statusNewGapCount = vm.filteredGapTasks.filter(t => t.status === 1).length;
                    vm.statusTbdGapCount = vm.filteredGapTasks.filter(t => t.status === 2).length;
                    vm.statusInProgressGapCount = vm.filteredGapTasks.filter(t => t.status === 3).length;
                    vm.completedGapCount = vm.filteredGapTasks.filter(t => t.status === 4).length;
                };
                //GAP POINTS SORTING 
                vm.sortGapPoint = function (column) {
                    if (vm.sortGapState.column !== column) {
                        vm.sortGapState.column = column;
                        vm.sortGapState.direction = 'asc';
                    } else {
                        if (vm.sortGapState.direction === 'asc') {
                            vm.sortGapState.direction = 'desc';
                        } else if (vm.sortGapState.direction === 'desc') {
                            vm.sortGapState.direction = null;
                        } else {
                            vm.sortGapState.direction = 'asc';
                        }
                    }

                    if (vm.sortGapState.direction) {
                        vm.filteredGapTasks = [...vm.filteredGapTasks].sort((a, b) => {
                            let valA = a[column];
                            let valB = b[column];

                            if (valA == null) valA = '';
                            if (valB == null) valB = '';

                            if (typeof valA === 'string') valA = valA.toLowerCase();
                            if (typeof valB === 'string') valB = valB.toLowerCase();

                            if (typeof valA === 'number' && typeof valB === 'number') {
                                return vm.sortGapState.direction === 'asc' ? valA - valB : valB - valA;
                            }
                            return vm.sortGapState.direction === 'asc'
                                ? String(valA).localeCompare(String(valB))
                                : String(valB).localeCompare(String(valA));
                        });
                    } else {
                        vm.filteredGapTasks = [...vm.filteredGapTasks].sort((a, b) => {
                            const dateA = new Date(a.creationTime);
                            const dateB = new Date(b.creationTime);
                            return dateB - dateA;
                        });
                    }
                };
                var projectId = vm.projectTask.projectId;


                //GAP Points By ProjectID 
                vm.getGAPPointsByProjectId = function () {

                    vm.loading = true;
                    taskDetailService.getGAPPointsByProjectId({ projectId: vm.projectTask.projectId })
                        .success(function (data) {
                            vm.gapProjectTasks = data.items;
                            vm.gapPointSearch();
                        })
                        .error(function () {
                            abp.notify.error("Failed to load tasks");
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };



                //GAP Points ****END****

                // ************* FEEDBACK || CODE START *************

                //Export Feedback Tasks To Excel 
                vm.exportFeedbackTasksToExcel = function () {
                    vm.loading = true;

                    //feedback object for excel input 
                    var exportPayload = {
                        projectId: vm.projectTask.projectId,
                        title: vm.feedbackFilters.title,
                        reqNo: vm.feedbackFilters.reqNo,
                        status: vm.feedbackFilters.status,
                        isApproved: vm.feedbackFilters.isApproved,
                        critical: vm.feedbackFilters.critical,
                        category: vm.feedbackFilters.category,
                        type: vm.feedbackFilters.type,
                        creationFromDate: vm.feedbackFilters.creationTime ? vm.feedbackFilters.creationTime.fromDate : null,
                        creationToDate: vm.feedbackFilters.creationTime ? vm.feedbackFilters.creationTime.toDate : null,
                        releaseFromDate: vm.feedbackFilters.releaseDate ? vm.feedbackFilters.releaseDate.fromDate : null,
                        releaseToDate: vm.feedbackFilters.releaseDate ? vm.feedbackFilters.releaseDate.toDate : null


                    };

                    taskDetailService.exportFeedbackTasksToExcel(exportPayload
                    ).success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                //Feedback Import Function 
                vm.importFeedbackTasks = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projectsDashboard/importFeedbackTaskModal.cshtml',
                        controller: 'host.views.cbs.projectDashboard.importFeedbackTaskModal as vm',
                        backdrop: 'static',
                        resolve: {}
                    });
                    modalInstance.result.then(function (importedTasks) {
                        importedTasks.forEach(function (task) {
                            task.projectId = vm.projectTask.projectId;
                            task.tempId = 'tempId' + (vm.tempTaskCounter++);
                        });
                        vm.importFeedbackTaskList(importedTasks);
                    });
                };

                //Feedback Task List Import 
                vm.importFeedbackTaskList = function (importedTasks) {
                    importedTasks.forEach(task => {
                        const tempTask = {
                            id: task.tempId,
                            title: task.title,
                            description: task.description,
                            projectId: task.projectId,
                        };
                        vm.projectTasks.unshift(tempTask);
                        vm.setOriginalValue(tempTask, 'title');
                        vm.setOriginalValue(tempTask, 'description');
                    });

                    vm.feedbackSearch();
                    /* const payload = {
                         feebackTaskList: importedTasks,
                     };*/

                    taskDetailService.importTasksList({ feedbackTaskList: importedTasks }).then(function (savedTasks) {
                        savedTasks.data.forEach(function (savedTask) {
                            const index = vm.projectTasks.findIndex(t => t.id === savedTask.tempId);
                            if (index !== -1) {
                                vm.projectTasks[index] = {
                                    ...vm.projectTasks[index],
                                    id: savedTask.id,
                                    status: savedTask.status,
                                    duration: savedTask.duration,
                                    creationTime: savedTask.creationTime,
                                    isApproved: savedTask.isApproved,
                                    taskNo: savedTask.taskNo,
                                };
                                vm.setOriginalValue(vm.projectTasks[index], 'title');
                                vm.setOriginalValue(vm.projectTasks[index], 'description');
                            } else {
                                vm.projectTasks.unshift(savedTask);
                            }
                        });

                        abp.notify.success("Tasks imported successfully!");
                        vm.feedbackSearch();
                    });
                };

             
                

                


                //Feedback Tasks By Project Id

                vm.getFeedbacksByProjectId = function (skipLoading) {
                    if (!projectId) return;

                    if (!skipLoading) {
                        vm.loading = true;
                    }
                    vm.newTask.projectId = vm.projectTask.projectId;
                    taskDetailService.getFeedbacksByProjectId({ projectId: vm.projectTask.projectId })
                        .success(function (data) {
                            vm.projectTasks = data.items;
                            vm.tempTaskCounter = vm.projectTasks.length + 1;
                            vm.feedbackSearch();
                        })
                        .error(function () {
                            abp.notify.error("Failed to load tasks");
                        })
                        .finally(function () {
                            if (!skipLoading) {
                                vm.loading = false;
                            }
                        });
                };

                //Priority change 
                vm.sortFeedback = function () {
                    vm.filteredTasks.sort(function (a, b) {
                        if (a.critical && !b.critical) return -1;
                        if (!a.critical && b.critical) return 1;

                        return new Date(a.date) - new Date(b.date);
                    });
                };

                //Enter To Add New FeedBack
                vm.handleEnterKey = function (event, task, isNewTask) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        if (isNewTask) {
                            if (!task.title || task.title.trim() === "") {
                                return;
                            }

                            vm.saveOrCreateTaskOnBlur(task, true);
                        }
                        else {
                            vm.saveOrCreateTaskOnBlur(task, false);
                        }
                    }
                };
                //Add New FeedBack Function 

                // vm.addNewTask

                vm.addNewTaskFeedback = function (task, isNewTask) {
                    if (isNewTask && (!task.title || task.title.trim() === "")) {
                        return;
                    }
                    vm.saveOrCreateTaskOnBlur(task, true);
                };
                //Create or Edit Feedback 
                vm.categoryChanged = false; 
                vm.saveOrCreateTaskOnBlur = function (task, isNewTask) {
                    if (!task) return;
                    if (task.category == 3 || task.category == 2) {
                        vm.categoryChanged = true; 
                    }
                    if (task.category == 2) {
                        task.duration = 0;
                        task.type = "Bug";
                        task.isApproved = true;
                        task.reqNo = task.taskNo;
                    }
                    task.title = task.title ? task.title.trim() : "";
                    task.description = task.description ? task.description.trim() : "";

                    if (!isNewTask) {
                        const original = vm.originalValues[task.id] || {};
                        const originalTitle = (original.title || '').trim();
                        const originalDescription = (original.description || '').trim();
                        
                        const currentTitle = (task.title || '').trim();
                        const currentDescription = (task.description || '').trim();
                     
                        const titleChanged = currentTitle !== originalTitle;
                        const descriptionChanged = currentDescription !== originalDescription;

                        const originalCritical = original.critical;
                        const currentCritical = task.critical;


                        const criticalChanged = currentCritical !== originalCritical;
                        
                        if (!titleChanged && !descriptionChanged && !criticalChanged && vm.categoryChanged ==false) {
                            return;
                        }
                    }
                    //create 

                    if (isNewTask) {
                        const tempId = 'temp_' + (vm.tempTaskCounter++);
                        const newTask = {
                            id: tempId,
                            title: task.title,
                            description: task.description,
                            projectId: vm.projectTask.projectId
                        };
                        vm.projectTasks.unshift(newTask);
                        vm.feedbackSearch();
                        vm.newTask = {
                            title: '',
                            description: '',
                            projectId: vm.projectTask.id
                        };


                        taskDetailService.createOrEditProjectTask({ taskDetail: newTask })
                            .success(function (result) {
                                if (result && result.id) {
                                    const index = vm.projectTasks.findIndex(t => t.id === tempId);
                                    if (index !== -1) {
                                        vm.projectTasks[index] = {
                                            ...vm.projectTasks[index],
                                            id: result.id,
                                            status: result.status,
                                            duration: result.duration,
                                            creationTime: result.creationTime,
                                            isApproved: result.isApproved,
                                            category: result.category,
                                            taskNo: result.taskNo,


                                        };

                                        vm.setOriginalValue(vm.projectTasks[index], 'title');
                                        vm.setOriginalValue(vm.projectTasks[index], 'description');
                                        //vm.setOriginalValue(vm.projectTasks[index], 'category');
                                    }
                                    vm.feedbackSearch();

                                }
                            })
                            .error(function () {
                                vm.feedbackSearch();
                            });

                    } else {
                        taskDetailService.createOrEditProjectTask({ taskDetail: task })
                            .success(function () {
                                vm.sortFeedback();
                            });

                    }
                };


                // Filter Feedback 
                vm.openFeedbackFilter = function (type) {
                    $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projectsDashboard/feedbackTasksFilters.cshtml',
                        controller: 'host.views.cbs.projectDashboard.feedbackTasksFilters as vm',
                        backdrop: 'static',
                        resolve: {
                            filterType: function () {
                                return type;

                            },
                            projectId: function () {
                                return vm.projectTask.projectId;
                            },
                            previousValue: function () {
                                return vm.feedbackFilters[type] != null ? vm.feedbackFilters[type] :  null;
                            }
                        }
                    }).result.then(function (result) {
                        if (result && result.projectId === vm.projectTask.projectId) {
                            vm.feedbackFilters[result.type] = result.value;
                            vm.feedbackSearch();

                        }
                    });
                };

                //Feedback Search Filters 
                vm.feedbackSearch = function () {
                    vm.filteredTasks = vm.projectTasks.filter(function (task) {
                        if (vm.feedbackFilters.title && !task.title?.toLowerCase().includes(vm.feedbackFilters.title.toLowerCase())) {
                            return false;
                        }
                        if (vm.feedbackFilters.reqNo && !task.reqNo?.toLowerCase().includes(vm.feedbackFilters.reqNo.toLowerCase())) {
                            return false;
                        }
                        if (vm.feedbackFilters.type && vm.feedbackFilters.type.length > 0 && !vm.feedbackFilters.type.includes(task.type)) {
                            return false;
                        }
                       /* if (vm.feedbackFilters.category && vm.feedbackFilters.category.length > 0 && !vm.feedbackFilters.category.includes(task.category)) {
                            return false;
                        }*/
                        if (vm.feedbackFilters.category !== undefined && vm.feedbackFilters.category !== null && vm.feedbackFilters.category !== '') {
                            if (task.category !== vm.feedbackFilters.category) {
                                return false;
                            }
                        }
                        if (vm.feedbackFilters.status && vm.feedbackFilters.status.length > 0 && !vm.feedbackFilters.status.includes(task.status)) {
                            return false;
                        }
                        if (vm.feedbackFilters.creationTime) {
                            const taskDate = new Date(task.creationTime);
                            const from = vm.feedbackFilters.creationTime.fromDate ? new Date(vm.feedbackFilters.creationTime.fromDate) : null;
                            const to = vm.feedbackFilters.creationTime.toDate ? new Date(vm.feedbackFilters.creationTime.toDate) : null;

                            if ((from && taskDate < from) || (to && taskDate > to)) {
                                return false;
                            }
                        }
                        if (vm.feedbackFilters.releaseDate) {
                            const taskDate = new Date(task.releaseDate);
                            const from = vm.feedbackFilters.releaseDate.fromDate ? new Date(vm.feedbackFilters.releaseDate.fromDate) : null;
                            const to = vm.feedbackFilters.releaseDate.toDate ? new Date(vm.feedbackFilters.releaseDate.toDate) : null;

                            if ((from && taskDate < from) || (to && taskDate > to)) {
                                return false;
                            }
                        }
                        if (vm.feedbackFilters.isApproved !== undefined && vm.feedbackFilters.isApproved !== null && vm.feedbackFilters.isApproved !== '') {
                            if (task.isApproved !== vm.feedbackFilters.isApproved) {
                                return false;
                            }
                        }
                        if (vm.feedbackFilters.critical !== undefined && vm.feedbackFilters.critical !== null && vm.feedbackFilters.critical !== '') {
                            if (task.critical !== vm.feedbackFilters.critical) {
                                return false;
                            }
                        }

                        return true;
                    });
                    vm.approvedCount = vm.filteredTasks.filter(t => t.isApproved === true).length;
                    vm.notApprovedCount = vm.filteredTasks.filter(t => t.isApproved === false).length;
                    vm.statusNewCount = vm.filteredTasks.filter(t => t.status === 1).length;
                    vm.statusTbdCount = vm.filteredTasks.filter(t => t.status === 2).length;
                    vm.statusInProgressCount = vm.filteredTasks.filter(t => t.status === 3).length;
                    vm.completedStatusCount = vm.filteredTasks.filter(t => t.status === 4).length;

                };

                vm.sortFeedbackTasks = function (column) {
                    if (vm.sortFeedbackState.column !== column) {
                        vm.sortFeedbackState.column = column;
                        vm.sortFeedbackState.direction = 'asc';
                    } else {
                        if (vm.sortFeedbackState.direction === 'asc') {
                            vm.sortFeedbackState.direction = 'desc';
                        } else if (vm.sortFeedbackState.direction === 'desc') {
                            vm.sortFeedbackState.direction = null;
                        } else {
                            vm.sortFeedbackState.direction = 'asc';
                        }
                    }

                    if (vm.sortFeedbackState.direction) {
                        vm.filteredTasks = [...vm.filteredTasks].sort((a, b) => {
                            let valA = a[column];
                            let valB = b[column];

                            if (valA == null) valA = '';
                            if (valB == null) valB = '';

                            if (typeof valA === 'string') valA = valA.toLowerCase();
                            if (typeof valB === 'string') valB = valB.toLowerCase();

                            if (typeof valA === 'number' && typeof valB === 'number') {
                                return vm.sortFeedbackState.direction === 'asc' ? valA - valB : valB - valA;
                            }

                            return vm.sortFeedbackState.direction === 'asc'
                                ? String(valA).localeCompare(String(valB))
                                : String(valB).localeCompare(String(valA));
                        });
                    } else {
                        vm.filteredTasks = [...vm.filteredTasks].sort((a, b) => {
                            const dateA = new Date(a.creationTime);
                            const dateB = new Date(b.creationTime);
                            return dateB - dateA;
                        });
                    }
                };




                // ************* FEEDBACK || END *************



                function getProjectChangeReqs() {
                    customizationService.getChangeRequestsByProjectId({ id: vm.projectTask.projectId }).then(function (response) {
                        vm.changeRequests = response.data;

                        vm.totalExtHrs = 0;
                        vm.totalComplimentaryHours = 0;
                        vm.totalWithoutComplimentaryHours = 0;
                        vm.totalBufferHours = 0;

                        angular.forEach(vm.changeRequests, function (value) {
                            vm.totalExtHrs += value.estimatedHours;
                            if (value.chargingType == 3)
                                vm.totalComplimentaryHours += value.estimatedHours;
                            if (value.chargingType != 3)
                                vm.totalWithoutComplimentaryHours += value.estimatedHours;
                            if (value.chargingType == 2)
                                vm.totalBufferHours += value.estimatedHours;

                        });
                    });

                };
                vm.completeMark = function (id) {
                    openCompleteMarkModal(id);
                };

                vm.createChangeRequest = function () {
                    openCreateOrUpdateHostChangeRequestModal(null);
                };
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

                //vm.documentsView= function (id) {
                //    var modalInstance = $uibModal.open({
                //        templateUrl: '~/App/host/views/cbs/projectsDashboard/documentsViewModal.cshtml',
                //        controller: 'host.views.cbs.projectsDashboard.documentsViewModal as vm',
                //        backdrop: 'static',
                //        size: 'md',
                //        resolve: {
                //            milestoneId: function () {
                //                return id;
                //            }
                //        }
                //    });

                //};
                vm.updateStatus = function (row) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/customization/milestoneStatusModal.cshtml',
                        controller: 'host.views.customization.milestoneStatusModal as vm',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            milestone: function () {
                                return row;
                            },
                            workspaceId: vm.workspaceId
                        }
                    });

                    modalInstance.result.then(function (result) {
                        getProjectMilestone();
                    });
                }
                vm.updateInvoiceStatus = function (row) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/customization/milestoneInvoiceStatusModal.cshtml',
                        controller: 'host.views.customization.milestoneInvoiceStatusModal as vm',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            milestone: function () {
                                return row;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        getProjectMilestone();
                    });
                }
                vm.updatePaymentStatus = function (row) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/customization/milestonePaymentStatusModal.cshtml',
                        controller: 'host.views.customization.milestonePaymentStatusModal as vm',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            milestone: function () {
                                return row;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        getProjectMilestone();
                    });
                }
                vm.generateInvoice = function (row) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projectsDashboard/generateInvoiceModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.generateInvoiceModal as vm',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            milestone: function () {
                                return row;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        getProjectMilestone();
                    });
                }

                function openCompleteMarkModal(id) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projectsDashboard/compleleMarkModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.compleleMarkModal as vm',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            milestoneId: function () {
                                return id;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        getProjectMilestone();
                    });
                }
                vm.openCRTasksModal = function (cr) {
                    $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projectsDashboard/changeRequestProjectTaskModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.changeRequestProjectTaskModal as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            changeRequest: function () {
                                return {
                                    id: cr.id,
                                    reqNo: cr.reqNo
                                };
                            },
                            releaseId: vm.activeRelease,
                        }
                    });
                }
                vm.openMoveCrModal = function (cr) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projectsDashboard/moveCrModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.moveCrModal',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            taskDetail: function () {
                                return cr;
                            },
                        }

                    });
                    modalInstance.result.then(function (result) {
                        vm.getTasks();
                    });
                }
                vm.openMoveTaskModal = function (taskList) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projectsDashboard/moveTaskModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.moveTaskModal',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            taskDetail: function () {
                                return taskList;
                            },
                        }

                    });
                    modalInstance.result.then(function (result) {
                        init();
                    });
                }

                vm.openCustomizationLogModal = function (row) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/customization/createOrShowCustomizationLogsModal.cshtml',
                        controller: 'host.views.customization.createOrShowCustomizationLogsModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            customization: function () {
                                return row;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        getProjectChangeReqs();
                    });
                }

                vm.UpdateChangeRequest = function (id) {
                    openCreateOrUpdateHostChangeRequestModal(id);
                };

                function openCreateOrUpdateHostChangeRequestModal(id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/customization/createOrUpdateChangeRequestModal.cshtml',
                        controller: 'host.views.customization.createOrUpdateChangeRequestModal as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            changeRequestId: function () {
                                return id;
                            },
                            project: function () {
                                return vm.project;
                            },
                            tasksToMove: function () {
                                return null;
                            },
                            isCRFromProjectDashboard: function () {
                                return true;
                            },
                            isCRFromNewPoints: function () {
                                return false;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {

                        getProjectChangeReqs();
                    });
                }
                
                vm.moveTasksAsFeedback = function (tasks) {
                    vm.Taskslist = tasks.map(t => t.id);
                    openMoveTaskAsFeedbackModal(vm.Taskslist);

                }

                vm.openMoveTaskAsFeedbackModal = function(tasks) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projectsDashboard/moveTaskAsFeedbackModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.moveTaskAsFeedbackModal as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            changeRequestId: function () {
                                return null;
                            },
                            
                            project: function () {
                                return vm.project;
                            },
                            isCRFromNewPoints: function () { return true; },
                            taskDetail: function () {
                                return tasks;
                            }
                           
                        }

                    });
                    modalInstance.result.then(function (result) {
                        //vm.getFeedbacksByProjectId();
                        tasks.forEach(function (task) {
                            task.reqNo = result.reqNo;
                            if (result.type.id == 3 || result.type.id == 4) { task.type = "CR Feedback" }
                            if (result.type.id == 2) { task.type = "Feedback/Bug", task.category = 2 }
                            task.selected = false;
                            vm.selectAll = false; 
                            
                        })
                        vm.selectedTasks = [];
                    });

                    

                };

                vm.moveFeedbacksToCr = function (tasks, crType) {
                    vm.TasksList = tasks.map(t => t.id); // cleaner way to create array of IDs

                    if (crType === 'Paid') { vm.type = 1 }
                    if (crType === 'Buffer') { vm.type = 2 }
                    if (crType === 'Comp') { vm.type = 3 }
                    debugger;
                    openMoveFeedbackToCrModal(vm.TasksList, vm.type, tasks)
                        .then(function (result) {
                            tasks.forEach(function (task) {
                                task.reqNo = result.crReqNo;
                                task.selected = false; 
                                if (result.type == 1) {task.type = "Paid"}
                                if (result.type == 2) {task.type = "Buffer"}
                                if (result.type == 3) {task.type = "Complementary"}
                            })
                            vm.selectedTasks = [];
                            vm.selectAll = false; 

                        })
                        .catch(function () {
                            console.log("Modal was dismissed or closed without CR.");
                        });
                };

                  function openMoveFeedbackToCrModal(taskList, crType,tasks) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projectsDashboard/moveFeedbackToCr.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.moveFeedbackToCr as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            changeRequestId: function () {
                                return null;
                            },
                            tasksToMove: function () {
                                return taskList;
                            },
                            project: function () {
                                return vm.project;
                            },
                            isCRFromProjectDashboard: function () {
                                return false;
                            },
                            isCRFromNewPoints: function () { return true; },
                            taskDetail: function () {
                                return tasks;
                            },
                            type: function () {
                                return crType;
                            }
                        }
                    });

                      return modalInstance.result.then(function (result) {
                          vm.crNumber = result.reqNo; 
                        //vm.getFeedbacksByProjectId();
                        //getProjectChangeReqs();
                        return result
                    });

                };

                
                


                function openCreateOrUpdateHostChangeRequestFromPointsModal(taskList) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/customization/createOrUpdateChangeRequestModal.cshtml',
                        controller: 'host.views.customization.createOrUpdateChangeRequestModal as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            changeRequestId: function () {
                                return null;
                            },
                            tasksToMove: function () {
                                return taskList;
                            },
                            project: function () {
                                return vm.project;
                            },
                            isCRFromProjectDashboard: function () {
                                return false;
                            },
                            isCRFromNewPoints: function () {
                                return true;
                            }
                        }
                    });

                    return modalInstance.result.then(function (result) {
                        getProjectChangeReqs();
                        return result;
                    });
                }



               




                vm.reportRequest = function (id) {
                    openReportRequestModal(id);
                };

                function openReportRequestModal(id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projectsDashboard/reportRequestModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.reportRequestModal as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            project: function () {
                                return id;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        getProjectChangeReqs();
                    });
                }

                vm.print = function (changeRequestId) {

                    $uibModal.open({
                        templateUrl: '~/App/host/views/customization/ChangeRequestPrintTemplate.cshtml',
                        controller: 'host.views.customization.ChangeRequestPrintTemplate as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            filters: function () {
                                return changeRequestId;
                            }
                        }
                    });
                };
                //scope of work print
                vm.scopePrint = function (changeRequestId) {

                    $uibModal.open({
                        templateUrl: '~/App/host/views/customization/ScopeOfWorkPrintTemplate.cshtml',
                        controller: 'host.views.customization.ChangeRequestPrintTemplate as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            filters: function () {
                                return changeRequestId;
                            }
                        }
                    });
                };

                vm.updateChangeRequestStatus = function (request) {
                    openUpdateHostChangeRequestStatusModal(request);
                };

                function openUpdateHostChangeRequestStatusModal(request) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/customization/changeRequestStatusModal.cshtml',
                        controller: 'host.views.customization.changeRequestStatusModal as vm',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            changeRequest: function () {
                                return request;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        getProjectChangeReqs();
                    });
                }

                vm.openSupportRequestModal = function () {
                    var modalScope = $scope.$new(); // Create a new child scope
                    modalScope.projectParams = {
                        projectId: vm.projectTask.projectId, isOpenFromProjectDashboard: true
                    }

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/support/supportRequests/index.cshtml',
                        controller: 'host.views.support.supportRequests.index as vm',
                        backdrop: 'static',
                        scope: modalScope,
                        size: 'xl'
                    });
                }

                vm.openDataEntryCorrectionModal = function () {
                    var modalScope = $scope.$new(); // Create a new child scope
                    modalScope.projectParams = {
                        projectId: vm.projectTask.projectId, isOpenFromProjectDashboard: true
                    }

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/dataEntry/dataEntryCorrections/index.cshtml',
                        controller: 'host.views.dataEntry.dataEntryCorrections.index as vm',
                        backdrop: 'static',
                        scope: modalScope,
                        size: 'xl'
                    });
                }

                function getSupportRequestAndDataEntryCorrectionCount() {
                    taskDetailService.getSupportRequestAndDataEntryCorrectionCount({ id: vm.projectTask.projectId }).then(function (response) {
                        vm.ticketCountSummary = response.data;
                    });
                };


                //Scope Tab Functions 
           

                // Module Category 
                vm.getModuleCategory = function (category) {
                    return category === 2 ? 'Add On' : '';
                };

                
                
              
                vm.downloadAndOpen = function (doc, $event) {
                    if ($event) $event.preventDefault();

                    const extension = (doc.name || '').split('.').pop().toLowerCase();
                    const browserViewableExtensions = [
                        'pdf', 'txt', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'html', 'htm'
                    ];
                    const officeExtensions = ['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt'];
                    if (officeExtensions.includes(extension)) {
                        const previewUrl = "https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(doc.urlWithToken);
                        window.open(previewUrl, '_blank');
                    } else if (browserViewableExtensions.includes(extension)) {
                        window.open(doc.urlWithToken, '_blank');
                    }
                    setTimeout(function () {
                        const link = document.createElement('a');
                        link.href = doc.urlWithToken;
                        link.setAttribute('download', vm.getOriginalName(doc));
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }, 500);
                };

                vm.getOriginalName = function (doc) {
                    return doc.name.replace("_" + doc.guid, "");
                };
                vm.getFormattedDetailText = function (mod) {
                    if (!mod) return "";

                    let text = mod;
                    text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                    text = text.replace(/(^|[^_])_(?!_)([^_]+)_(?!_)/g, "$1<em>$2</em>");
                    text = text.replace(/(?:^|\n)\s*\*\s+(.*)/g, function (_, item) {
                        return "<li>" + item + "</li>";
                    });
                    text = text.replace(/\n(?!\s*\*)/g, "<br>");
                    if (text.includes("<li>")) {
                        text = text.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");
                    }

                    return $sce.trustAsHtml(text);
                };
                //Get Scope Details 
                vm.getProjectWorkScope = function () {
                    vm.loading = true;
                    taskDetailService.getProjectWorkScope({
                        id: vm.project.id
                    }).success(function (result) {
                        if (result) {
                            vm.workScope = result;
                            vm.documents = result.documents || [];

                            const parsedScope = JSON.parse(result.scope || '{}');

                            vm.selectedProductVariants = parsedScope.selectedProductVariants || [];
                            vm.customModules = parsedScope.customModules || [];

                            vm.groupedVariants = {};
                            vm.selectedProductVariants.forEach(function (item) {
                                if (!vm.groupedVariants[item.productCode]) {
                                    vm.groupedVariants[item.productCode] = {
                                        productName: item.productName,
                                        variants: [],
                                        showVariants: true
                                    };
                                }
                                vm.groupedVariants[item.productCode].variants.push(item);
                            });
                        }
                        vm.loading = false;

                    });
                };

                //End Scope Tab *************


                vm.getPlannedRelease = function () {
                    vm.loading = true;
                    taskDetailService.getPlannedReleases({ projectId: vm.projectTask.projectId })
                        .success(function (data) {
                            vm.plannedReleases = data;
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };

                vm.getClosedRelease = function () {
                    vm.loading = true;
                    taskDetailService.getClosedReleases({ projectId: vm.projectTask.projectId })
                        .success(function (data) {
                            vm.closedReleases = data;
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };

                vm.openReleaseTasks = function (id) {
                    $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projectsDashboard/viewReleaseTasksModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.viewReleaseTasksModal as vm',
                        backdrop: 'static',
                        size: 'full',
                        resolve: {
                            releaseId: id
                        }
                    });
                };

                

                vm.prepareReleaseChanged();
                vm.getUserType();
                vm.getGAPPointsByProjectId();
                vm.getFeedbacksByProjectId();
                vm.getProjectWorkScope();
                vm.getPlannedRelease();
                vm.getClosedRelease();
                getProjectMilestone();
                if (!vm.projectTask.changeRequestId && vm.permissions.crs)
                    getProjectChangeReqs();
                //init();
                getSupportRequestAndDataEntryCorrectionCount();

            }
        ]);
