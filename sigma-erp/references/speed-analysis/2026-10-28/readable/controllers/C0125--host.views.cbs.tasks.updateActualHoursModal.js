// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:53427-53569
appModule.controller('host.views.cbs.tasks.updateActualHoursModal',
        [
            '$scope', '$uibModalInstance', 'options', 'abp.services.app.taskDetail',
            function ($scope, $uibModalInstance, options, taskDetailService) {
                var vm = this;

                $scope.showStillDuePanel = 0;

                vm.taskDetail = {
                    id: options.taskId
                };
                vm.showWarning = false;
                vm.statuses = [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'To Be Discussed' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' },
                    { id: 5, name: 'On Hold' }
                ];

                vm.tdClone = null;
                vm.message = "";
                function getTaskDetailForEdit() {
                    vm.loading = true;
                    taskDetailService.getTaskDetailForEdit(options.taskId).success(function (result) {
                        vm.taskDetail = result;

                        if (vm.taskDetail.revisedDuration === 0)
                            vm.taskDetail.revisedDuration = vm.taskDetail.duration;

                        vm.taskDetail.dueHours = vm.taskDetail.revisedDuration - vm.taskDetail.actualHours;
                        vm.taskDetail.stillDue = null;
                        vm.taskDetail.actualHoursNew = vm.taskDetail.actualHours;
                        vm.taskDetail.percentComplete = Math.round(vm.taskDetail.actualHours / vm.taskDetail.revisedDuration * 100, 2);

                        //to verify the changes ....
                        tdClone = angular.copy(result);
                        vm.loading = false;
                    });
                }

                vm.cancel = function () {
                    $uibModalInstance.close();
                };

                vm.hoursChanged = function () {
                    vm.taskDetail.actualHoursNew = vm.taskDetail.actualHours + (vm.taskDetail.hour ? vm.taskDetail.hour : 0) + (vm.taskDetail.mins ? vm.taskDetail.mins / 60 : 0);
                    if (vm.taskDetail.hour > 0 || vm.taskDetail.mins > 0) // No & hours changes
                    {
                        if ($scope.showStillDuePanel === '1')
                            vm.taskDetail.revisedDuration = vm.taskDetail.actualHoursNew +
                                (vm.taskDetail.stillDue ? vm.taskDetail.stillDue : 0);
                        else if (tdClone.duration !== vm.taskDetail.duration && vm.taskDetail.revisedDuration == 0) //estimation changed
                            vm.taskDetail.revisedDuration = vm.taskDetail.duration;
                    }
                    else
                        vm.taskDetail.revisedDuration = vm.taskDetail.duration;

                    vm.taskDetail.percentComplete = Math.round(vm.taskDetail.actualHoursNew / vm.taskDetail.revisedDuration * 100, 2);

                    if (vm.taskDetail.percentComplete <= 50 && !vm.taskDetail.stillDue)
                        $scope.showStillDuePanel = "0";

                    vm.taskDetail.dueHours = vm.taskDetail.revisedDuration - vm.taskDetail.actualHoursNew;

                    if (vm.taskDetail.percentComplete === 100) {
                        vm.taskDetail.status = 4;
                    } else if (vm.taskDetail.percentComplete > 0 && vm.taskDetail.percentComplete < 100) {
                        vm.taskDetail.status = 3;
                    }
                    vm.statusChange();
                };

                vm.estimatedHourChanged = function () {
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
                    if (vm.taskDetail.percentComplete === 100) {
                        vm.taskDetail.status = 4;
                    } else if (vm.taskDetail.percentComplete > 0 && vm.taskDetail.percentComplete < 100) {
                        vm.taskDetail.status = 3;
                    }
                    vm.statusChange();
                };

                vm.save = function () {
                    vm.loading = true;
                    vm.taskDetail.actualHours = vm.taskDetail.actualHoursNew;
                    
                    let convertMinToHour = vm.taskDetail.mins ? Math.round(vm.taskDetail.mins / 60, 2) : 0;
                    vm.taskDetail.hours = vm.taskDetail.hour + convertMinToHour;
                    taskDetailService.addActualHours(vm.taskDetail).success(function () {
                        $uibModalInstance.close(vm.taskDetail);
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    });
                };
                vm.statusChange = function () {
                   
                    if (vm.taskDetail.status === 4 && vm.taskDetail.dueHours > 0) {
                        vm.message = "Canot mark it complete if due time is not zero";
                        vm.showWarning = true;
                       
                    }
                    else if (vm.taskDetail.dueHours < 0)
                    {
                        vm.message = "Due task should never be negative";
                        vm.showWarning = true;
                    }
                    else {
                        vm.showWarning = false;
                    }
                };

                vm.stillDueChanged = function () {
                    if (!vm.taskDetail.stillDue) vm.taskDetail.stillDue = 0;
                    vm.taskDetail.revisedDuration = vm.taskDetail.actualHoursNew + (vm.taskDetail.stillDue ? vm.taskDetail.stillDue : 0);
                    vm.taskDetail.percentComplete = Math.round(vm.taskDetail.actualHoursNew / vm.taskDetail.revisedDuration * 100, 2);
                    vm.taskDetail.dueHours = vm.taskDetail.revisedDuration - vm.taskDetail.actualHoursNew;
                    vm.statusChange();
                };

                function init() {
                    getTaskDetailForEdit();
                    
                }

                init();

            }
        ]);
