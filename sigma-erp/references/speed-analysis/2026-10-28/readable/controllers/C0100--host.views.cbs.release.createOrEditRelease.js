// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:45918-46048
appModule.controller('host.views.cbs.release.createOrEditRelease',
        [
            '$scope', 'release', '$uibModalInstance', '$uibModal', 'abp.services.app.release', 'appSession', 'abp.services.app.organizationUnit', 'abp.services.app.project',
            function ($scope, release, $uibModalInstance, $uibModal, releaseService, appSession, organizationUnitAppService, projectService) {
                var vm = this;
                vm.release = angular.copy(release);
                vm.teams = [];
                vm.openProjectsList = null;
                
                vm.getTeams = function () {
                    if (vm.release.id != 0) {
                        vm.release.teams.forEach(function (team) {
                            if (team != undefined)
                                vm.teams.push(team.organizationUnit);
                        });
                    }
                }

                //vm.filterTeams = function () {
                //    vm.searchTeams();
                   
                //}
                vm.isReleaseDateChanged = false;
                
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                
                //vm.searchTeams = function () {
                    
                //    organizationUnitAppService.getTeams().then(function (response) {
                //        vm.organizations = response.data.items;
                //        vm.teams.forEach(function (team) {

                //            for (var i = 0; i <= vm.organizations.length; i++) {
                //                if (vm.organizations[i].id === team.id) {
                //                    vm.organizations.splice(i, 1);
                //                    break;
                //                }
                //            }
                //        });
                //    });
                //};

                vm.getOpenProjects = function () {

                    var statusObj = {
                        status: 1,
                    }
                    projectService.getOpenProjects(statusObj).success(function (result) {
                        vm.openProjectsList = result;
                    })
                };
                vm.searchTeams = function ($select) {
                    if ($select.search == "")
                        return null;
                    organizationUnitAppService.searchTeams( $select.search).then(function (response) {
                        vm.organizations= response.data.items;
                    });
                };
                vm.teamsChanged = function () {
                    vm.release.teamsIds = [];
                    vm.teams.forEach(function (team) {
                        vm.release.teamsIds.push(team.id);
                    });
                    //vm.searchTeams();
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.releaseApplications = [
                    { type: "Speed Main", id: 1 },
                    { type: "Speed Aljazirah", id: 2 },
                    { type: "Speed KSA", id: 3 },
                    { type: "Speed EC And UAE", id: 4 },
                    { type: "CRS Android", id: 5 },
                    { type: "VMI Android", id: 6 }

                ];

                //moment lib
                vm.releaseApplicationsType = function () {
                    const ra = vm.releaseApplications.find(x => x.id == vm.release.releaseApplication);
                    if (ra) {
                        const date = vm.release.releaseDate ? moment(vm.release.releaseDate).add(1, 'days').format('DD-MMM') : ""; //planned date next date
                        vm.release.name = ra.type + " Release: " + date;
                    }
                    //else vm.isReleaseDateChanged = true;
                }

                vm.releaseTitleName = function () {
                    if (vm.release.name.includes(":")) {
                        const namePart = vm.release.name.split(":")[0].trim();
                        const date = vm.release.releaseDate ? moment(vm.release.releaseDate).add(1, 'days').format('DD-MMM') : "";
                        vm.release.name = namePart +": "+ date;
                    }
                };
                vm.getProjectDisplayText = function (projectId) {
                    if (!projectId || !vm.openProjectsList) return '';
                    const proj = vm.openProjectsList.find(p => p.id === vm.release.projectId);
                    return proj ? proj.projectNo + ' - ' + proj.title : '';
                };

                vm.projectFilterFn = function (search) {
                    if (!search) return [];
                    search = search.toLowerCase();
                    const filtered = vm.openProjectsList.filter(project =>
                        project.title.toLowerCase().includes(search) ||
                        project.projectNo.toString().toLowerCase().includes(search)
                    );
                    return filtered.slice(0, 5);
                };

                vm.save = function () {
                    vm.teamsChanged();
                    vm.loading = true;
                    releaseService.addOrEditRelease(vm.release).success(function (result) {
                        
                        $uibModalInstance.close();
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.loading = false;
                    });
                };
                //vm.searchTeams();
                vm.getTeams();
                vm.getOpenProjects();


            }
        ]);
