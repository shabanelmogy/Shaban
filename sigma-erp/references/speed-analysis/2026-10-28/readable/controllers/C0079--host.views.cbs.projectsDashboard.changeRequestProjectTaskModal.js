// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:38860-39085
appModule.controller('host.views.cbs.projectsDashboard.changeRequestProjectTaskModal', [
        '$scope', '$uibModal', '$timeout', 'changeRequest', '$uibModalInstance', 'utilities','abp.services.app.taskDetail', 'abp.services.app.release',
        function ($scope, $uibModal, $timeout, changeRequest, $uibModalInstance, utilities, taskDetailService, releaseService) {

            var vm = this;
            vm.loading = false;
            vm.activeRelease = null;
            vm.reqNo = changeRequest.reqNo;
            vm.prepareRelease = true;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.permissions = {
                manageRelease: abp.auth.hasPermission('Pages.CBS.Release.ManageRelease'),
            }
            
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
           /* vm.addEditRelease = function (taskId, rowIndex) {
                vm.loading = true;
                taskDetailService.addRemoveRelease(taskId, vm.activeRelease, true, null)
                    .success(function () {
                        abp.notify.success(app.localize('Release Marked Successfully!'));
                    })
                    .error(function (err) {
                        if (err && err.message) {
                            $timeout(function () {
                                vm.tasks[rowIndex].hasReleaseId = false;
                            }, 0);
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };*/
            vm.moveTask = function (taskDetail) {

                if (!Array.isArray(taskDetail)) {
                    taskDetail = [taskDetail];  // wrap single task in array
                }
                vm.openMoveCrModal(taskDetail);
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
                    init();
                });
            }
            vm.openFeedbackDetailModal = function (taskDetail) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/feedbackDetailModal.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.feedbackDetailModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        taskDetail: function () {
                            return taskDetail;
                        },
                        prepareRelease: vm.prepareRelease,
                        releaseId: vm.activeRelease,
                        isFromReportModal: false,
                    }
                });

                modalInstance.result.then(function (result) {
                    init();
                });
            };

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

            vm.deleteTask = function (taskId) {
                if (taskId != null) {
                    vm.isLoading = true;
                    abp.message.confirm(
                        app.localize('DeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                taskDetailService.deleteTaskAndChild(taskId).success(function () {
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                    init();
                                }).catch(function (error) {
                                    vm.isLoading = false;
                                    utilities.showError('Failed to delete task: ' + (error.message || 'Unknown error'));
                                });
                            }
                        }
                    );
                }
            }
            vm.addEditRelease = function (row, rowIndex) {
                if (row.hasReleaseId) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projectsDashboard/assignToUserModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.assignToUserModal as vm',
                        backdrop: 'static',
                        resolve: {
                            task: function () {
                                return row;
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedUser) {
                        if (selectedUser) {
                            vm.loading = true;

                            taskDetailService.addRemoveRelease(row.id, vm.activeRelease, true, selectedUser.userId)
                                .success(function () {
                                    abp.notify.success(app.localize('Release Marked Successfully!'));
                                })
                                .error(function (err) {
                                    if (err && err.message) {
                                        $timeout(function () {
                                            vm.tasks[rowIndex].hasReleaseId = false;
                                        }, 0);
                                    }
                                })
                                .finally(function () {
                                    vm.loading = false;
                                });
                        } 
                    }, function () {
                        row.hasReleaseId = false;
                    });
                } else {
                    taskDetailService.addRemoveRelease(row.id, vm.activeRelease, false, null)
                        .then(function () {
                            abp.notify.success("Task removed from release.");
                        });
                }
            };

            vm.saveOnBlur = function (task) {
               // task.description = task.description ? task.description.trim() : "";
                if (task.id != 0 && task.title != "") {
                    taskDetailService.crTaskInlineEdit({
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        duration: task.duration
                    }).success(function () {
                        init();
                    });
                }
                //vm.heightAdjust();
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
            vm.autoResizeTextarea = function (event, text) {
                setTimeout(function () {
                    var textareas = document.querySelectorAll('textarea');
                    textareas.forEach(function (value) {
                        value.style.height = 'auto';
                        value.style.height = value.scrollHeight + 'px';
                    });
                }, 0);
            };

            function init() {
                //vm.loading = true;
                vm.prepareReleaseChanged();

                taskDetailService.getChangeRequestTaskById({ id: changeRequest.id }).success(function (data) {
                    vm.tasks = data;
                }).finally(function () {
                   // vm.loading = false;
                });
            }
            init();
        }
    ]);
