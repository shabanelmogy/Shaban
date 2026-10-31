// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:59211-59247
appModule.controller('host.views.cmmi.projectHealth.addProjectHealthNotesModal', [
        '$uibModalInstance', 'projectId', 'projectHealth', 'abp.services.app.project',
        function ($uibModalInstance, projectId, projectHealth, projectService) {
            var vm = this;
            vm.projectHealth = projectHealth;
            vm.projectId = projectId;

            vm.projectNotes = "";
          
            var result = {
                updatedHealth: projectHealth,
                
            }

            vm.updateProjectHealth = function () {

                const projectHealthobj = {
                    projectId: vm.projectId,
                    projectHealth: vm.projectHealth,
                    notes: vm.projectNotes,
                }
                projectService.updateProjectHealth(projectHealthobj).success(function () {
                    $uibModalInstance.close(result);
                })
            }
           

            vm.save = function () {
                vm.updateProjectHealth();
               
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
