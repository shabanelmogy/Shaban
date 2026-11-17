// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:35551-35597
appModule.controller('host.views.cbs.lateProjects.index', [
        '$scope', '$uibModal', 'abp.services.app.projectTask',
        function ($scope, $uibModal, projectTaskService) {

            var vm = this;
            function openViewProjectModal(projectId) {
                var modalInstance
                    = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projects/viewModal.cshtml',
                        controller: 'host.views.cbs.projects.viewModal as vm',
                        backdrop: 'static',
                        resolve: {
                            projectId: function () {
                                return projectId;
                            }
                        }
                    });
            }

            vm.viewProject = function (project) {
                openViewProjectModal(project.id);
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

            vm.getLateProjects = function () {
                projectTaskService.getLateProjects().success(function (data) {
                    vm.lateProjectsData = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getLateProjects();
            }
            init();
        }
    ]);
