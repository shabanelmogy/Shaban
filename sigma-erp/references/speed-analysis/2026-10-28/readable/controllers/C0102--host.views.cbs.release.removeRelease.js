// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:46341-46390
appModule.controller('host.views.cbs.release.removeRelease',
        [
            '$scope', '$uibModalInstance', '$uibModal', 'abp.services.app.release', 'appSession', 'taskId', 'currentReleaseId',
            function ($scope, $uibModalInstance, $uibModal, releaseService, appSession, taskId, currentReleaseId) {
                var vm = this;
                vm.isReleaseDateChanged = false;


                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                function getActiveReleases() {
                    releaseService.getActiveReleasesForPD()
                        .success(function (data) {
                            vm.activeReleases = data;
                            vm.activeReleases = [{ id: null, name: 'Return To Back Log' }, ...vm.activeReleases];

                            //remove current release from dropdown
                            if (currentReleaseId) {
                                const index = vm.activeReleases.indexOf(vm.activeReleases.find(x => x.id == currentReleaseId));
                                vm.activeReleases.splice(index, 1);
                            }

                            releaseService.getNextReleaseId({ id: currentReleaseId })
                                .success(function (nextReleaseId) {
                                    if (nextReleaseId)
                                        vm.selectedRelease = vm.activeReleases.find(x => x.id == nextReleaseId);
                                    else vm.selectedRelease = vm.activeReleases[0];
                                });
                        });
                }

                vm.save = function () {
                    vm.loading = true;
                    releaseService.updateTaskRelease({ key: taskId, value: vm.selectedRelease.id }).success(function (result) {
                        $uibModalInstance.close();
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.loading = false;
                    }).error(function (error) {
                        vm.loading = false;
                    });
                };

                getActiveReleases();
            }
        ]);
