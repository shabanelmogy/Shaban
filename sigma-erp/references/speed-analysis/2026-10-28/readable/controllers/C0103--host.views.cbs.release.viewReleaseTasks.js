// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:46393-46936
appModule.controller('host.views.cbs.release.viewReleaseTasks',
        [
            '$scope', 'releaseId', '$uibModalInstance', '$uibModal', 'abp.services.app.release', 'abp.services.app.user','abp.services.app.tenant','abp.services.app.taskDetail', 'appSession', 'utilities',
            function ($scope, releaseId, $uibModalInstance, $uibModal, releaseService, userService, tenantService,taskDetailService, appSession, utilities) {
                var vm = this;

                vm.permissions = {
                    manageRelease: abp.auth.hasPermission('Pages.CBS.Release.ManageRelease'),
                    approveExtraPoint: abp.auth.hasPermission('Pages.CBS.Release.ApproveExtraPoint')
                };
                vm.prepareRelease = true;

                vm.totalTasksCount = 0;
                vm.release = { releaseTasks: [] };
                //vm.releaseId = releaseId;
                vm.activeReleases = null;
                vm.released = false;
                vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
                vm.round = function (val) { return parseFloat(val).toFixed(2) };
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
                                }
                            });
                    }
                }
                Array.prototype.insert = function (index, ...items) {
                    this.splice(index, 0, ...items);
                };
                vm.filters = {
                    releaseId : releaseId,
                   /* userId: appSession.user.id,
                    user: appSession.user,
                    taskStatusesArray:
                        [
                            { id: 1, name: 'New' },
                            { id: 2, name: 'TBD' },
                            { id: 3, name: 'In Progress' }
                        ],
                    assignedToUserId: 0,
                    maxResultCount: app.consts.grid.defaultPageSize,*/

                };
                // Datetime Format
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.addEditRelease = function (taskId, rowIndex) {
                    vm.loading = true;
                    taskDetailService.addRemoveRelease(taskId, vm.activeRelease, true, null)
                        .success(function () {
                            init();
                        })
                        .finally(function () {
                            abp.notify.success(app.localize('Release Marked Successfully!'));
                            vm.loading = false;
                        });
                }
                vm.approveExtraPoint = function (taskId) {
                    vm.loading = true;
                    taskDetailService.approveExtraPoint({
                        id: taskId
                    }).success(function () {
                            init();
                    }).finally(function () {
                            abp.notify.success(app.localize('Approved Successfully!'));
                            vm.loading = false;
                    });
                }
                vm.rejectExtraPoint = function (taskId) {
                    vm.loading = true;
                    releaseService.updateTaskRelease({ key: taskId, value: null }).success(function () {
                        init();
                    }).finally(function () {
                        abp.notify.success(app.localize('Rejected Successfully!'));
                        vm.loading = false;
                    });
                };
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
                    if (!parentTask.children.length) {
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
                    if (!parentTask.children.length) {
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


                vm.getEstimatedHoursByGroup = function (g) {


                    let groupTotalHoursObject = {
                        revisedEstimated: 0,
                        done: 0,
                        due: 0
                    };

                    g.forEach(function (v) {
                        groupTotalHoursObject.revisedEstimated += v.revisedEstimated;
                        groupTotalHoursObject.done += v.done;
                        vm.totalTasksCount += 1;
                    });

                    groupTotalHoursObject.due = groupTotalHoursObject.revisedEstimated - groupTotalHoursObject.done;
                    vm.totalEstimatedHours += groupTotalHoursObject.revisedEstimated;
                    vm.totalActualHours += groupTotalHoursObject.done;
                    vm.totalDueHours += groupTotalHoursObject.due;

                    return groupTotalHoursObject;
                }


                // Export to Excel Button
                vm.exportReleaseNotes = function ()
                {
                    var tab_text = "<table border='1px'><tr>";
                    var textRange;
                    var j = 0;
                    var rows = [];
                    let titleRow = null;

                    document.querySelectorAll('#tblSubsReport').forEach(tbl => {
                        let rs = Array.from(tbl.cloneNode(true).rows);
                        if (!titleRow) titleRow = rs[1];

                        rs.splice(0, 2);
                        rows = [...rows, ...rs]
                    });

                    // Removing the column at index(1).  

                    rows.insert(0, titleRow);
                    var i = 4;
                    for (var k = 0; k < rows.length; k++) {

                        // Deleting the ith cell of each row.
                        if (k != 0) {
                            rows[k].cells[2].innerText = rows[k].cells[2].innerText.split('\n')[3].trim();
                        }
                        if (vm.permissions.manageRelease)
                            rows[k].deleteCell(11);
                        rows[k].deleteCell(4);
                        rows[k].deleteCell(3);
                        rows[k].deleteCell(0); // cells[0].innerHTML = '\n<span class="ng-binding">' + rows[k].cells[0].innerText.trim()  +'</span>\n';
                    }

                    for (j = 0; j < rows.length; j++) {

                        tab_text = tab_text;
                        tab_text = tab_text + rows[j].innerHTML + "</tr>";
                        //console.log(tab1.rows[j].innerHTML);

                    }

                    tab_text = tab_text + "</table>";


                    var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                    var blobUrl = URL.createObjectURL(blob);


                    var a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = 'ReleaseNotes.xls';
                    a.click();

                };


                function b64toBlob(b64Data, contentType, sliceSize) {
                    contentType = contentType || '';
                    sliceSize = sliceSize || 512;

                    var byteCharacters = atob(b64Data);
                    var byteArrays = [];

                    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        var slice = byteCharacters.slice(offset, offset + sliceSize);

                        var byteNumbers = new Array(slice.length);
                        for (var i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        var byteArray = new Uint8Array(byteNumbers);

                        byteArrays.push(byteArray);
                    }

                    var blob = new Blob(byteArrays, { type: contentType });
                    return blob;
                }


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
                    modalInstance.result.then(function (updatedTaskDetail) {
                        if (updatedTaskDetail !== null) {
                            init();
                            vm.getDueTasks();
                            vm.getUserWorkingHoursWeekly();

                        }
                    });
                };


                function editProjectTaskModal(projectTask) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/taskDetails/viewOrEditProjectTaskModal.cshtml',
                        controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                        //controller: 'host.views.cbs.projectTasks.createOrEditProjectTaskModal as vm',
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
                        init();
                    }).finally(function () {
                        vm.getDueTasks();
                    });
                }


                vm.editProjectTask = function (projectTask) {
                    editProjectTaskModal(projectTask);
                };

                
                // Release Checkbox
                //vm.addEditRelease = function (status, taskId) {
                //    taskDetailService.addRemoveRelease(taskId, vm.releaseId, status);
                //};


                // Cancel-Close Modal
                vm.cancel = function () {
                    $uibModalInstance.close();
                };

                // Save Updated Record
                vm.save = function () {
                    vm.loading = true;
                    releaseService.editRelease(vm.release).success(function (result) {
                        $uibModalInstance.close();
                        abp.notify.info(app.localize('Saved Successfully!'));
                        vm.loading = false;
                    });
                };
                vm.searchTenants = function ($select) {
                    if ($select.search == "")
                        return null;
                    tenantService.searchTenants({ filter: $select.search }).then(function (response) {
                        vm.tenants = response.data.items;
                    });
                };
                vm.searchProjects = function ($select) {
                    if ($select.search == "")
                        return null;
                    taskDetailService.searchProjects({ keyword: $select.search }).then(function (response) {
                        vm.projects = response.data.items;
                    });
                };
                vm.searchAssignedToUserName = function ($select) {
                    if (!$select.search)
                        return null;
                    userService.searchAssignedToUsers({ keyword: $select.search }).then(function (response) {
                        vm.assignedToUserNames = response.data.items;
                    });
                };

                vm.isInCompleteFilter = false;
                let allReleaseTasks = [];
                let inCompleteTasks = [];

                vm.inComplete = function () {
                    vm.totalTasksCount = 0;

                    vm.totalEstimatedHours = 0;
                    vm.totalActualHours = 0;
                    vm.totalDueHours = 0;

                    if (vm.isInCompleteFilter) {

                        inCompleteTasks = [];
                        allReleaseTasks.forEach(g => {
                            inCompleteTasks.push(g.filter(f => f.status != 'Completed'));
                        });

                        vm.release.regularTasks = inCompleteTasks
                    }
                    else {
                        vm.release.regularTasks = allReleaseTasks;
                    }
                }

              
                vm.openCreateReleaseModal = function (row, taskId) {

                    row.hasReleaseId = !row.hasReleaseId;

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/release/removeRelease.cshtml',
                        controller: 'host.views.cbs.release.removeRelease as vm',
                        backdrop: 'static',
                        resolve: {
                            taskId: taskId,
                            currentReleaseId: vm.filters.releaseId
                        }
                    });
                    modalInstance.result.then(function () {
                        init();
                        $scope.$apply();
                    });
                };

                vm.getReleaseDate = function () {

                }
                vm.getNameWithCompany = function (project) {
                    return project.title + " (" + project.company.companyName + ")";
                }; 
               

                vm.getDueTasks = function () {
                    vm.loading = true;
                    vm.totalTaskNumbers = 0;

                    if (vm.filters.releaseId) {

                        taskDetailService.getReleaseTasksWithUserGroupByReleaseId(vm.filters)
                            .success(function (data) {
                                vm.release = data;
                                vm.released = vm.release.isReleased;
                                allReleaseTasks = angular.copy(vm.release.releaseTasks);
                                vm.splitReleaseTasks();
                                vm.inComplete();
                            }).finally(function () {
                                vm.loading = false;
                            });

                    }
                    else {
                        taskDetailService.getPriorityTasksWithUserGroup(vm.filters)
                            .success(function (data) {
                                vm.release = data;
                            }).finally(function () {
                                vm.loading = false;
                            });
                    }

                };
                // Function to split release tasks into two categories
                // Function to split release tasks into two categories
                vm.splitReleaseTasks = function () {
                    if (!vm.release || !vm.release.releaseTasks) {
                        vm.release.regularTasks = [];
                        vm.release.extraPointBugTasks = [];
                        return;
                    }

                    vm.release.regularTasks = [];
                    vm.release.extraPointBugTasks = []; // Flat array for all extra point bug tasks

                    // Process each group (organization unit)
                    vm.release.releaseTasks.forEach(function (group) {
                        if (!group || group.length === 0) return;

                        var regularGroup = [];

                        group.forEach(function (task) {
                            // Check for Table 1: Tasks with IsExtraPoint=false + All CRs and Projects
                            var hasNoExtraPoint = !task.isExtraPoint;
                            var isCROrProject = task.type === "Project/CR" ||
                                task.type === "Project" ||
                                task.type === "Change Request" ||
                                task.type === "Support Request";

                            if (hasNoExtraPoint || isCROrProject) {
                                regularGroup.push(task);
                            }

                            // Check for Table 2: Tasks with IsExtraPoint=true AND Type=Bug
                            // Add directly to flat array (no grouping)
                            if (task.isExtraPoint === true && task.type === "Bug") {
                                vm.release.extraPointBugTasks.push(task);
                            }
                        });

                        // Only add groups that have tasks
                        if (regularGroup.length > 0) {
                            vm.release.regularTasks.push(regularGroup);
                        }
                       
                    });
                    console.log("regular", vm.release.regularTasks);
                    console.log("extra", vm.release.extraPointBugTasks);
                };
                // init Function
                function init() {
                    //taskDetailService.getReleaseTasks(vm.releaseId)
                    //    .success(function (data) {
                    //        vm.release = data;
                    //        vm.released = vm.release.isReleased;

                    //    });
                    vm.prepareReleaseChanged();
                    vm.totalDueHours = 0;
                    vm.totalActualHours = 0;
                    vm.totalEstimatedHours = 0;
                    vm.totalRevisedEstimatedHours = 0;
                    vm.totalEstimatedHoursbyGroup = 0;
                    vm.totalTasksCount = 0;
                    vm.getDueTasks();
                    /*if (vm.filters.releaseId) {
              
                        taskDetailService.getReleaseTasksWithUserGroupByReleaseId(vm.filters)
                            .success(function (data) {
                                vm.release = data;
                                vm.released = vm.release.isReleased;
                                allReleaseTasks = angular.copy(vm.release.releaseTasks);
                                vm.inComplete();
                            });

                    }
                    else {
                        taskDetailService.getPriorityTasksWithUserGroup({})
                            .success(function (data) {
                                vm.release = data;
                                

                            });
                    }*/

                }

                init();
            }
        ]);
