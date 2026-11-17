// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:35479-35547
appModule.controller('host.views.cbs.lateMilestones.index', [
        '$scope', '$uibModal', 'abp.services.app.projectTask',
        function ($scope, $uibModal, projectTaskService) {

            var vm = this;
            function openViewMilestoneModal(milestone) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/milestones/viewModal.cshtml',
                    controller: 'host.views.cbs.milestones.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                milestoneId: milestone.id
                            }
                        }
                    }
                });
            }

            function editProjectMilestoneModal(projectTask) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/milestones/createOrEditMilestoneModal.cshtml',
                    controller: 'host.views.cbs.projectTasks.createOrEditMilestoneModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectTaskId: projectTask.id
                            }
                        }
                    }
                });
            }

            vm.viewMilestone = function (milestone) {
                openViewMilestoneModal(milestone);
            };

            vm.editProjectMilestone = function (projectTask) {
                editProjectMilestoneModal(projectTask);
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

            vm.getLateMilestones = function () {
                vm.loading = true;
                projectTaskService.getLateMilestones().success(function (data) {
                    vm.lateMilestoneData = data;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getLateMilestones();
            }
            init();
        }
    ]);
