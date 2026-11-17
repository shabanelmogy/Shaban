// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:53069-53424
appModule.controller('host.views.cbs.task.taskManagerModal',
        [
            '$scope', '$uibModalInstance', '$uibModal', 'options', 'abp.services.app.taskDetail', 'abp.services.app.user', 'appSession', 'abp.services.app.organizationUnit',
            function ($scope, $uibModalInstance, $uibModal, options, taskDetailService, userService, appSession, organizationUnitService)
            {
                var vm = this;
                vm.taskStages = [];
                $scope.showStillDuePanel = 0;
                vm.previousStage = null;
                vm.oldDue = 0;
                vm.updatedRev = 0;
                vm.actualHoursNow = 0;

                vm.taskDetail = {
                    id: options.taskId
                };
                vm.showWarning = false;
                vm.statuses = [

                ];
                vm.oldStage = null;
                vm.statusesall = [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'To Be Discussed' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' },
                    { id: 5, name: 'On Hold' }
                ];
                vm.searchUsers = function ($select)
                {
                    if ($select.search == "")
                        return null;
                    userService.searchUsers({ keyword: $select.search }).then(function (response)
                    {
                        vm.users = response.data.items;
                    });
                };

                //Select team automatically with the selection of assigned user on the basis of "Teams selected" 
                //in host > settings > User Management...
                const teamIdsForTasksAssignmentSetting = abp.setting.get('App.UserManagement.TeamIdsForTasksAssignment') ? JSON.parse(abp.setting.get('App.UserManagement.TeamIdsForTasksAssignment')) : [];
                const selectTeamOnAssignedToUserSelection = function (userId)
                {
                    organizationUnitService.getOrginizationUnitsByContactId({ id: userId }).success((r) =>
                    {
                        debugger;
                        console.debug('User in teams: ' + r.length);
                        const teamFound = r.length > 0 && r.find(y => teamIdsForTasksAssignmentSetting.find(x => y.id == x));
                        if (teamFound) {
                            vm.taskDetail.organizationUnitId = teamFound.id;
                            vm.taskDetail.organizationUnit = teamFound.displayName;
                        }

                    }).finally(() => { });
                };

                vm.assignedUserChange = function ()
                {
                    vm.taskDetail.assignedToId = vm.assignedToUser.id
                    selectTeamOnAssignedToUserSelection(vm.assignedToUser.id);
                };

                vm.searchOrganizationContactPopup = function ()
                {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/resourcePlanner/searchOrganizationUnitModal.cshtml',
                        controller: 'host.views.cbs.resourcePlanner.searchOrganizationUnitModal as vm',
                        backdrop: 'static',
                        size: 'lg'
                    });
                    modalInstance.result.then(function (result)
                    {
                        if (result) {
                            vm.taskDetail.organizationUnitId = result.id;
                            vm.taskDetail.organizationUnit = result.name;
                            vm.taskDetail.assignedToId = null;
                            vm.assignedToUser = null;

                        }

                    });
                };

                vm.clearSelection = function ()
                {
                    vm.taskDetail.organizationUnitId = null;
                    vm.taskDetail.organizationUnit = null;
                    vm.assignedToUser = null;
                    vm.taskDetail.assignedToId = null;
                    //vm.assignedToUser = appSession.user;
                    //vm.taskDetail.assignedToId = vm.assignedToUser.id;

                };
                vm.resourcesChanged = function ()
                {
                    vm.taskDetail.resourcesIds = [];
                    vm.resources.forEach(function (resource)
                    {
                        vm.taskDetail.resourcesIds.push(resource.id);
                    });
                    vm.users = [];
                };
                vm.observersChanged = function ()
                {
                    vm.taskDetail.observersIds = [];
                    vm.observers.forEach(function (observer)
                    {
                        vm.taskDetail.observersIds.push(observer.id);
                    });
                    vm.users = [];
                };
                vm.tdClone = null;
                vm.clearUser = function ()
                {
                    vm.filters.user = null;
                    vm.filters.userId = null;
                };
                vm.message = "";
                function getTaskDetailForEdit()
                {
                    vm.loading = true;
                    taskDetailService.getTaskDetailForEdit(options.taskId).success(function (result)
                    {
                        vm.taskDetail = result;
                        vm.previousStage = result.taskStageId;
                        userService.getHostUserAccounts().success(function (hostUser)
                        {
                            vm.users = hostUser.items;
                            vm.taskDetail = result;
                            if (result.project != null) {
                                vm.taskDetail.projectId = result.project.id;
                            }
                            if (vm.taskDetail.assignedToId != null) {
                                vm.assignedToUser = vm.users.filter(function (user)
                                {
                                    return user.userId == vm.taskDetail.assignedToId;
                                })[0].user;
                            }
                            vm.observers = [];
                            if (vm.taskDetail.observersIds.length > 0) {
                                vm.taskDetail.observersIds.forEach(function (observersId)
                                {
                                    let observer = vm.users.filter(function (user)
                                    {
                                        return user.userId == observersId;
                                    })[0];
                                    if (observer != undefined)
                                        vm.observers.push(observer.user);
                                });
                            }

                            vm.resources = [];
                            if (vm.taskDetail.resourcesIds.length > 0) {
                                vm.taskDetail.resourcesIds.forEach(function (resourcesId)
                                {
                                    let resource = vm.users.filter(function (user)
                                    {
                                        return user.userId == resourcesId;
                                    })[0];
                                    if (resource != undefined)
                                        vm.resources.push(resource.user);
                                });
                            }
                            vm.users = [];
                        });

                        if (vm.taskDetail.revisedDuration === 0)
                            vm.taskDetail.revisedDuration = vm.taskDetail.duration;
                        vm.updatedRev = vm.taskDetail.revisedDuration;
                        vm.taskDetail.dueHours = vm.taskDetail.revisedDuration - vm.taskDetail.actualHours;
                        vm.taskDetail.stillDue = vm.taskDetail.revisedDuration - vm.taskDetail.actualHours;
                        vm.oldDue = vm.taskDetail.revisedDuration - vm.taskDetail.actualHours;
                        vm.taskDetail.actualHoursNew = vm.taskDetail.actualHours;
                        vm.taskDetail.percentComplete = Math.round(vm.taskDetail.actualHours / vm.taskDetail.revisedDuration * 100, 2);
                        vm.taskDetail.qaCycle = vm.taskDetail.qaCycle != null ? vm.taskDetail.qaCycle : 0;

                        //to verify the changes ....
                        tdClone = angular.copy(result);
                        getTaskStages();

                        vm.loading = false;
                    });
                }

                vm.cancel = function ()
                {
                    $uibModalInstance.close();
                };

                vm.hoursChanged = function ()
                {
                    vm.taskDetail.actualHoursNew = vm.taskDetail.actualHours + (vm.taskDetail.hour ? vm.taskDetail.hour : 0) + (vm.taskDetail.mins ? vm.taskDetail.mins / 60 : 0);
                    console.log(vm.taskDetail.actualHoursNew);
                    vm.actualHoursNow = (vm.taskDetail.hour ? vm.taskDetail.hour : 0) + (vm.taskDetail.mins ? vm.taskDetail.mins / 60 : 0);
                    //if (vm.taskDetail.hour > 0 || vm.taskDetail.mins > 0) // No & hours changes
                    //{
                    //    if ($scope.showStillDuePanel === '1')
                    //        vm.taskDetail.revisedDuration = vm.taskDetail.actualHoursNew +
                    //            (vm.taskDetail.stillDue ? vm.taskDetail.stillDue : 0);
                    //    else if (tdClone.duration !== vm.taskDetail.duration && vm.taskDetail.revisedDuration == 0) //estimation changed
                    //        vm.taskDetail.revisedDuration = vm.taskDetail.duration;
                    //}
                    //else
                    //    vm.taskDetail.revisedDuration = vm.taskDetail.duration;

                    //vm.taskDetail.percentComplete = Math.round(vm.taskDetail.actualHoursNew / vm.taskDetail.revisedDuration * 100, 2);

                    //if (vm.taskDetail.percentComplete <= 50 && !vm.taskDetail.stillDue)
                    //    $scope.showStillDuePanel = "0";

                    vm.taskDetail.stillDue = vm.updatedRev - vm.taskDetail.actualHoursNew;
                    vm.taskDetail.percentComplete = Math.round(vm.taskDetail.actualHoursNew / vm.updatedRev * 100, 2);
                    if (vm.taskDetail.stillDue < 0) {
                        vm.showWarning = true;
                    }
                    else {
                        vm.showWarning = false;
                    }

                    //vm.taskDetail.revisedDuration = vm.updatedRev;
                    //vm.oldDue = vm.taskDetail.revisedDuration - vm.taskDetail.actualHours;
                    //vm.stillDue=


                };
                vm.clearUser = function ()
                {
                    vm.assignedToUser = null;
                    vm.taskDetail.assignedToId = null;
                };
                vm.estimatedHourChanged = function ()
                {
                    if (vm.taskDetail.hour > 0 && vm.taskDetail.mins > 0) { // No & hours changes
                        if ($scope.showStillDuePanel === '1')
                            vm.taskDetail.revisedDuration = vm.taskDetail.actualHoursNew + (vm.taskDetail.stillDue ? vm.taskDetail.stillDue : 0);
                        else
                            vm.taskDetail.revisedDuration = vm.taskDetail.duration;
                    }
                    else
                        vm.taskDetail.revisedDuration = vm.taskDetail.duration;

                    vm.taskDetail.percentComplete = Math.round(vm.taskDetail.actualHoursNew / vm.taskDetail.revisedDuration * 100, 2);

                    if (vm.taskDetail.percentComplete <= 50 && !vm.taskDetail.stillDue)
                        $scope.showStillDuePanel = "0";
                    else $scope.showStillDuePanel = "-1";

                    vm.taskDetail.dueHours = vm.taskDetail.revisedDuration - vm.taskDetail.actualHoursNew;



                };

                vm.save = function ()
                {
                    vm.loading = true;
                    vm.taskDetail.actualHours = vm.taskDetail.actualHoursNew;
                    vm.taskDetail.revisedDuration = vm.updatedRev;
                    vm.taskDetail.assignedTo = vm.assignedToUser;
                    vm.taskDetail.taskStage = vm.taskStages.find(x => x.id === vm.taskDetail.taskStageId);

                    let convertMinToHour = vm.taskDetail.mins ? (vm.taskDetail.mins / 60) : 0;
                    vm.taskDetail.hours = (vm.taskDetail.hour ? vm.taskDetail.hour : 0) + convertMinToHour;
                    vm.taskDetail.resources = vm.resources;
                    taskDetailService.updateTaskStage(vm.taskDetail).success(function ()
                    {
                        $uibModalInstance.close(vm.taskDetail);
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.loading = false;

                    })
                        .error(function ()
                        {
                            vm.loading = false;
                        });

                };

                vm.stageChange = function ()
                {

                    getTaskStageStatus();

                };

                vm.stillDueChanged = function ()
                {

                    //if (!vm.taskDetail.stillDue) vm.taskDetail.stillDue = 0;
                    //vm.taskDetail.revisedDuration = vm.taskDetail.actualHoursNew + (vm.taskDetail.stillDue ? vm.taskDetail.stillDue : 0);
                    //vm.taskDetail.percentComplete = Math.round(vm.taskDetail.actualHoursNew / vm.taskDetail.revisedDuration * 100, 2);
                    //vm.taskDetail.dueHours = vm.taskDetail.revisedDuration - vm.taskDetail.actualHoursNew;

                    var diff = vm.taskDetail.stillDue - vm.oldDue;
                    vm.updatedRev = vm.taskDetail.revisedDuration + diff + vm.actualHoursNow;
                    console.log("revised duration updated = " + vm.updatedRev);
                    if (vm.updatedRev < 0) {
                        vm.showWarning = true;
                    }
                    else {
                        vm.showWarning = false;
                    }
                    if (vm.taskDetail.stillDue < 0) {
                        vm.showWarning = true;
                    }
                    else {
                        vm.showWarning = false;
                    }

                };
                function getTaskStages()
                {

                    vm.loading = true;
                    taskDetailService.getTaskStages({ taskType: vm.taskDetail.type }).success(function (result)
                    {
                        vm.taskStages = result;
                        getTaskStageStatus();
                        vm.loading = false;
                    });
                }
                function getTaskStageStatus()
                {

                    vm.loading = true;

                    taskDetailService.getTaskStageStatus({ stageId: vm.taskDetail.taskStageId }).success(function (result)
                    {
                        vm.statuses = vm.statusesall.filter(f => result.includes(f.id));
                        if (vm.statuses.length > 0) {
                            if (vm.previousStage != vm.taskDetail.taskStageId) {
                                console.log(vm.taskDetail.status);

                                vm.taskDetail.status = vm.statuses[0].id;
                            }


                        }
                        vm.loading = false;


                        console.log(vm.statuses);
                    });
                }
                function init()
                {

                    getTaskDetailForEdit();


                }

                init();

            }
        ]);
