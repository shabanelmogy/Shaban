// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:39315-39569
appModule.controller('host.views.cbs.projectsDashboard.feedbackDetailModal', [
        '$scope', '$timeout', 'taskDetail', 'prepareRelease', 'isFromReportModal', '$uibModalInstance', '$uibModal', 'utilities', 'abp.services.app.taskFeedback', 'abp.services.app.release', 'abp.services.app.taskDetail',
        function ($scope, $timeout, taskDetail, prepareRelease, isFromReportModal, $uibModalInstance, $uibModal, utilities, taskFeedbackService, releaseService, taskDetailService) {

            var vm = this;
            vm.loading = false;

            vm.prepareRelease = prepareRelease;
            vm.activeRelease = null;
            vm.prepareRelease = true;
            vm.isFromReport = isFromReportModal,
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
            vm.taskDetail = taskDetail;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.permissions = {
                manageRelease: abp.auth.hasPermission('Pages.CBS.Release.ManageRelease'),
            }

            /*vm.addEditRelease = function (taskId, row) {
                vm.loading = true;
                taskDetailService.addRemoveRelease(taskId, vm.activeRelease, true, null)
                    .success(function () {
                        abp.notify.success(app.localize('Release Marked Successfully!'));
                    })
                    .error(function (err) {
                        if (err && err.message) {
                            $timeout(function () {
                                row.hasReleaseId = false; 
                            }, 0);
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };*/
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

            vm.getTaskStatus = function (status) {
                if (!status) return '';
                else if (status == 1) return 'New';
                else if (status == 2) return 'To Be Discussed';
                else if (status == 3) return 'In Progress';
                else if (status == 4) return 'Completed';
                else return '';
            };

            vm.getFeedbackCategoryName = function (id) {
                if (id == 3)
                    return 'Enhancement';
                else if (id == 4)
                    return 'Change in Scope';
                else if (id == 2)
                    return 'Bug';
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

            vm.openAddFeedbackModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/addFeedbackModal.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.addFeedbackModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        taskDetail: function () {
                            return vm.taskDetail;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    init();
                });
            }

            vm.openMoveFeedbackModal = function (cr) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/moveFeedbackModal.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.moveFeedbackModal',
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
            vm.saveOnBlur = function (task) {
                // task.description = task.description ? task.description.trim() : "";
                if (task.id != 0 && task.title != "") {
                    taskDetailService.crTaskInlineEdit({
                        id: task.id,
                        title: task.detail,
                        description: null,
                        duration: task.feedbackHours
                    }).success(function () {
                        init();
                    });
                }
                vm.heightAdjust();
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
            vm.autoResizeTextarea = function (event) {
                //document.getElementById("input_" + task.id + "_" + index).click();
                var element = event.target; // Get the specific textarea element
                element.value = element.value.trim();
                element.style.height = "auto"; // Reset the height to auto
                element.style.height = (element.scrollHeight) + "px";

            };
            vm.deleteTask = function (taskId) {
                if (taskId != null) {
                    abp.message.confirm(
                        app.localize('DeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.loading = true;
                                taskDetailService.deleteTaskAndChild(taskId).success(function () {
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                    init();
                                }).finally(function () {
                                    vm.loading = false;
                                });
                            }
                        }
                    );
                }
            }
            vm.approveFeedback = function (feedback) {
                if (feedback != null) {
                    if (feedback.category != 2 && feedback.feedbackHours == 0) {
                        abp.message.warn("Please enter feedback hours to Approve");
                        vm.loading = false;
                        return;
                    }
                    else
                    {
                       abp.message.confirm(
                           app.localize('ApproveConfirmationMessage'),
                          function (isConfirmed) {
                              if (isConfirmed) {
                                  vm.loading = true;
                                  taskFeedbackService.approveFeedback({ taskDetailId: feedback.id }).success(function () {
                                     abp.notify.success(app.localize('ApprovedSuccesfully'));
                                     init();
                                  }).finally(function () {
                                     vm.loading = false;
                                  });
                              }
                          }
                       );
                    }
                    
                }
            }

            function init() {
               // vm.loading = true;
                vm.prepareReleaseChanged();
                taskFeedbackService.getTaskFeedbacksByCategory({ taskDetailId: taskDetail.id }).success(function (data) {
                    vm.data = data;
                }).finally(function () {
                   // vm.loading = false;
                });
            }
            init();
        }
    ]);
