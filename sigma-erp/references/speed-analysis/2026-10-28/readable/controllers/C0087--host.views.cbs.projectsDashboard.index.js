// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:40011-41081
appModule.controller('host.views.cbs.projectsDashboard.index', [
        '$scope', '$sce', '$interval', '$uibModal', 'abp.services.app.project', 'abp.services.app.release', 'abp.services.app.taskDetail', 'appSession', 'abp.services.app.customizationHost', 'utilities', 'abp.services.app.businessDivision',
        function ($scope,$sce, $interval, $uibModal, projectService, releaseService, taskDetailService, appSession, customizationService, utilities, businessDivisionService) {

            var vm = this;
            vm.loading = false;
            vm.projects = [];
            vm.ExternalProjects = [];
            vm.ExternalProjectsCount = 0;
           /* vm.InternalProjects = [];
            vm.InternalProjectsCount = 0;
            vm.OnHoldProjects = [];
            vm.OnHoldProjectsCount = 0;*/
            vm.dueHours = 0;
            vm.development = 0;
            vm.implementation = 0;
            vm.others = 0;
            vm.searchText = null;
            vm.projectType = null;
            vm.category = null;
            vm.pmType = null;
            vm.associateConsultant = null;
            vm.division = null;
            vm.business = null;
            vm.businessDivisionId = null;
            vm.prepareRelease = true;
            vm.isInitiateFromCase = null;
            vm.releaseId = 0;
            vm.activeReleases = 0;
            vm.activeRelease = 0;
            vm.businessName = utilities.divisionName();
            var preMon = new Date();
            preMon = preMon.setDate(1);
            preMon = new Date(preMon);
            preMon = preMon.setMonth(preMon.getMonth() - 1);
            preMon = new Date(preMon);

            var firstMonth = preMon.toLocaleDateString('en', { year: '2-digit', month: 'short' }).replace(" ", "-")

            var curMon = preMon.setMonth(preMon.getMonth() + 1);
            curMon = new Date(curMon);

            var secondMonth = curMon.toLocaleDateString('en', { year: '2-digit', month: 'short' }).replace(" ", "-")

            var nextMon = curMon.setMonth(curMon.getMonth() + 1);
            nextMon = new Date(nextMon);
            var thirdMonth = nextMon.toLocaleDateString('en', { year: '2-digit', month: 'short' }).replace(" ", "-")

            var nextOneMon = nextMon.setMonth(nextMon.getMonth() + 1);
            nextOneMon = new Date(nextOneMon);
            var fourMonth = nextOneMon.toLocaleDateString('en', { year: '2-digit', month: 'short' }).replace(" ", "-")

            var nextTwoMon = nextOneMon.setMonth(nextOneMon.getMonth() + 1);
            nextTwoMon = new Date(nextTwoMon);
            var fifthMonth = nextTwoMon.toLocaleDateString('en', { year: '2-digit', month: 'short' }).replace(" ", "-")

            var nextThreeMon = nextTwoMon.setMonth(nextTwoMon.getMonth() + 1);
            nextThreeMon = new Date(nextThreeMon);
            var sixthMonth = nextThreeMon.toLocaleDateString('en', { year: '2-digit', month: 'short' }).replace(" ", "-")


            vm.monthList = [firstMonth, secondMonth, thirdMonth, fourMonth, fifthMonth, sixthMonth]
            vm.dateMonth = null;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

            // Approved Change Request Start
            vm.filters = {
                selectedStatuses: [{ id: 8, name: "Approved" }]
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.categories = [

                { id: 1, name: "Retail" },
                { id: 2, name: "Corporate" }
            ];
            vm.getPriority = function (priority) {
                if (priority == 3)
                    return app.localize("High");
                else
                    return "";
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY HH:mm');
                }
                else {
                    return "";
                }
            };
            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("ApprovalPending");
                else if (id == 2)
                    return app.localize("Closed");
                else if (id == 3)
                    return app.localize("Cancelled");
                else if (id == 5)
                    return "Estimation Pending";
                else if (id == 6)
                    return "Estimated, Customer Confirmation Pending";
                else if (id == 7)
                    return "Customer Confirmed, Finance Approval Pending";
                else if (id == 8)
                    return "Approved";
                else if (id == 9)
                    return "In-Progress";
                else return '';
            };
            vm.ViewChangeRequest = function (id) {
                viewHostChangeRequestModal(id);
            };
            function viewHostChangeRequestModal(id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/viewChangeRequestModal.cshtml',
                    controller: 'host.views.customization.createOrUpdateChangeRequestModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        changeRequestId: function () {
                            return id;
                        },
                        project: function () {
                            return null;
                        },
                        tasksToMove: function () {
                            return null;
                        },
                        isCRFromProjectDashboard: function () {
                            return false;
                        },
                        isCRFromNewPoints: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCustomizations();
                });
            }
            vm.openCRTasksModal = function (cr) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/projectTasks.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.projectTasks as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        project: function () {
                            return {
                                changeRequestId: cr.id,
                                id:null,
                                company:null,
                                tasks: []
                            };
                        },
                        prepareRelease: vm.prepareRelease,
                        releaseId: vm.activeRelease,
                        workspaceId: null,
                        isInitiateFromCase: null
                    }
                });
            }
            vm.getCustomizations = function () {
                vm.loading = true;
                customizationService.getCustomizations(vm.filters).success(function (data) {
                    vm.customizations = data.items;
                    vm.TotalApprovedChangeRequests = vm.customizations.length;
                }).finally(function () {
                    vm.loading = false;
                });
            };
           // Approved Change Request Start

            // get ActiveRelease List for Dropdown
            vm.prepareReleaseChanged = function () {
                if (vm.prepareRelease === true) {
                    releaseService.getActiveReleasesForPD()
                        .success(function (data) {
                            if (data.length === 0) {
                                vm.prepareRelease = false;
                                abp.notify.error('No Active Release');
                            }
                            else {
                                vm.activeReleases = data;
                                //vm.activeRelease = data.find(x=> x.id == vm.a).id;
                                vm.activeRelease = data[0].id;
                                vm.releaseId = vm.activeRelease;
                            }
                        });
                }
            }

           
            function calculateSummary(data) {
                vm.dueHours = 0;
                vm.implementation = 0;
                vm.development = 0;
                vm.others = 0;

                data.forEach(function (item) {

                    if (item.status == 1) {

                        item.tasks.forEach(function (task) {
                            vm.dueHours = vm.dueHours + vm.calculateHours(task.revisedDuration, task.actualHours);

                            var type = task.type;
                            if (type == 1) {
                                vm.development = vm.development + vm.calculateHours(task.revisedDuration, task.actualHours);
                            }
                            else if (type == 2) {
                                vm.implementation = vm.implementation + vm.calculateHours(task.revisedDuration, task.actualHours);
                            }
                            else {
                                vm.others = vm.others + vm.calculateHours(task.revisedDuration, task.actualHours);
                            }
                        });
                    }

                });

                vm.dueHours = Math.round((vm.dueHours + Number.EPSILON) * 100) / 100;
                vm.implementation = Math.round((vm.implementation + Number.EPSILON) * 100) / 100;
                vm.development = Math.round((vm.development + Number.EPSILON) * 100) / 100;
                vm.others = Math.round((vm.others + Number.EPSILON) * 100) / 100;
            }
            // Updated refresh function to work with dual search
            vm.refresh = function () {
                vm.loading = true;
                vm.prepareRelease = true;
                vm.prepareReleaseChanged();

                //Tables's Data
                projectService.getProjectsssForDashboard()
                    .success(function (data) {
                        vm.projectGroups = data; // Store grouped data

                        // Flatten all projects for existing logic
                        vm.projects = [];
                        angular.forEach(vm.projectGroups, function (group) {
                            vm.projects = vm.projects.concat(group.projects);
                        });

                        // Store all external projects (unfiltered base data)
                        vm.ExternalProjects = vm.projects.filter(f => f.status == 1 && (f.projectType == 1 || f.projectType == 2));

                        // FIXED: Initialize filters AFTER data is loaded
                        vm.initializeFilters();

                       /*  //Internal Projects
                            vm.InternalProjects = vm.projects.filter(f => f.status == 1 && f.projectType == 3);
                        vm.InternalProjectsCount = vm.InternalProjects.length;
                        vm.InternalProjectsRedCount = 0;
                        vm.InternalProjectYellowCount = 0;
                        vm.InternalProjectGreyCount = 0;
                        vm.InternalProjectGreenCount = 0;
                        vm.InternalProjectyellowPlusGreenCount = 0;
                        $.each(vm.InternalProjects, function (key, value) {
                            if (value.primarySortParam == 1) { vm.InternalProjectsRedCount = vm.InternalProjectsRedCount + 1; }
                            else if (value.primarySortParam == 2) { vm.InternalProjectYellowCount = vm.InternalProjectYellowCount + 1; vm.InternalProjectyellowPlusGreenCount = vm.InternalProjectyellowPlusGreenCount + 1; }
                            else if (value.primarySortParam == 3) { vm.InternalProjectGreyCount = vm.InternalProjectGreyCount + 1; }
                            else if (value.primarySortParam == 4) { vm.InternalProjectGreenCount = vm.InternalProjectGreenCount + 1; vm.InternalProjectyellowPlusGreenCount = vm.InternalProjectyellowPlusGreenCount + 1; }
                        });

                        //OnHold Projects
                        vm.OnHoldProjects = vm.projects.filter(f => f.status == 3);
                        vm.OnHoldProjectsCount = vm.OnHoldProjects.length;
                        vm.OnHoldProjectsRedCount = 0;
                        vm.OnHoldProjectYellowCount = 0;
                        vm.OnHoldProjectGreyCount = 0;
                        vm.OnHoldProjectGreenCount = 0;
                        vm.OnHoldProjectyellowPlusGreenCount = 0;
                        $.each(vm.OnHoldProjects, function (key, value) {
                            if (value.primarySortParam == 1) { vm.OnHoldProjectsRedCount = vm.OnHoldProjectsRedCount + 1; }
                            else if (value.primarySortParam == 2) { vm.OnHoldProjectYellowCount = vm.OnHoldProjectYellowCount + 1; vm.OnHoldProjectyellowPlusGreenCount = vm.OnHoldProjectyellowPlusGreenCount + 1; }
                            else if (value.primarySortParam == 3) { vm.OnHoldProjectGreyCount = vm.OnHoldProjectGreyCount + 1; }
                            else if (value.primarySortParam == 4) { vm.OnHoldProjectGreenCount = vm.OnHoldProjectGreenCount + 1; vm.OnHoldProjectyellowPlusGreenCount = vm.OnHoldProjectyellowPlusGreenCount + 1; }
                        });*/

                        calculateSummary(vm.projects);
                        totalOpenProjectCount = vm.projects.filter(x => x.status === 1 && x.projectType !== 3).length;
                    })
                    .error(function (error) {
                        console.error('Error loading projects:', error);
                        vm.loading = false;
                    });

                // get Critical Task Count
                taskDetailService.criticalTasksCount()
                    .success(function (data) {
                        vm.criticalTasks = data;
                        vm.loading = false;
                    })
                    .error(function (error) {
                        console.error('Error loading critical tasks:', error);
                        vm.loading = false;
                    });
            };

            // Initialize filter variables
            vm.globalBusinessDivisionId = null;
            vm.globalProjectType = null;
            vm.globalPmType = '';
            vm.globalAssociateConsultant = '';
            vm.globalSearchText = '';
            vm.globalDateMonth = null;

            // Initialize groups with filter structure
            vm.ExternalProjectGroups = [];

            // Initialize group filters when creating groups
            vm.initializeGroupFilters = function () {
                angular.forEach(vm.ExternalProjectGroups, function (group) {
                    if (!group.filters) {
                        group.filters = {
                            projectType: null,
                            pmType: '',
                            associateConsultant: '',
                            searchText: '',
                            dateMonth: null
                        };
                    }
                    if (!group.filteredProjects) {
                        group.filteredProjects = angular.copy(group.projects);
                    }
                });
            };

            // Global filter function - applies all filters including division
            vm.FilterExternalProjects = function () {
                // Start with all projects
                var filteredProjects = angular.copy(vm.ExternalProjects);

                // Apply global filters with null checks
                if (vm.globalBusinessDivisionId) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        return project.businessDivisionId === vm.globalBusinessDivisionId;
                    });
                }

                if (vm.globalProjectType) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        return project.projectType === vm.globalProjectType;
                    });
                }

                if (vm.globalPmType && vm.globalPmType.trim()) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        return project.projectManagerName &&
                            project.projectManagerName.toLowerCase().includes(vm.globalPmType.toLowerCase().trim());
                    });
                }

                if (vm.globalAssociateConsultant && vm.globalAssociateConsultant.trim()) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        return project.associateConsultantName &&
                            project.associateConsultantName.toLowerCase().includes(vm.globalAssociateConsultant.toLowerCase().trim());
                    });
                }

                // FIXED: Consistent naming and improved search text filtering
                if (vm.globalSearchText && vm.globalSearchText.trim()) {
                    filteredProjects = vm.searchAndHighlight(filteredProjects, vm.globalSearchText);
                }

                if (vm.globalDateMonth) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        if (!project.deadLine) return false;
                        return getfilterDeadlineFormatDate(project.deadLine) === vm.globalDateMonth;
                    });
                }

                // Group filtered projects by division
                vm.createProjectGroups(filteredProjects);

                // Update counts
                vm.updateProjectCounts();
            };

            // Create project groups based on business division
            vm.createProjectGroups = function (projects) {
                var groups = {};

                // Group projects by division
                angular.forEach(projects, function (project) {
                    var divisionKey = (project.businessDivision && project.businessDivision.groupName)
                        ? project.businessDivision.groupName
                        : 'No Division Group';

                    if (!groups[divisionKey]) {
                        groups[divisionKey] = {
                            division: divisionKey,
                            projects: [],
                            filteredProjects: [],
                            filters: {
                                divisionId: null,
                                projectType: null,
                                pmType: '',
                                associateConsultant: '',
                                searchText: '',
                                dateMonth: null
                            }
                        };
                    }
                    groups[divisionKey].projects.push(project);
                });

                // Convert to array and sort by division name
                vm.ExternalProjectGroups = Object.keys(groups).map(function (key) {
                    return groups[key];
                }).sort(function (a, b) {
                    return a.division.localeCompare(b.division);
                });

                // Apply group filters to each group
                angular.forEach(vm.ExternalProjectGroups, function (group) {
                    vm.FilterGroupProjects(group);
                });
            };

            // Group-specific filter function (excludes division filter)
            vm.FilterGroupProjects = function (group) {
                if (!group || !group.projects) return;

                var filteredProjects = angular.copy(group.projects);

                // Apply group filters with null checks
                if (group.filters.divisionId) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        return project.businessDivisionId === group.filters.divisionId;
                    });
                }

                if (group.filters.projectType) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        return project.projectType === group.filters.projectType;
                    });
                }

                if (group.filters.pmType && group.filters.pmType.trim()) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        return project.projectManagerName &&
                            project.projectManagerName.toLowerCase().includes(group.filters.pmType.toLowerCase().trim());
                    });
                }

                if (group.filters.associateConsultant && group.filters.associateConsultant.trim()) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        return project.associateConsultantName &&
                            project.associateConsultantName.toLowerCase().includes(group.filters.associateConsultant.toLowerCase().trim());
                    });
                }

                // FIXED: Improved search text filtering with better null handling
                if (group.filters.searchText && group.filters.searchText.trim()) {
                    filteredProjects = vm.searchAndHighlight(filteredProjects, group.filters.searchText);
                }

                if (group.filters.dateMonth) {
                    filteredProjects = filteredProjects.filter(function (project) {
                        if (!project.deadLine) return false;
                        return getfilterDeadlineFormatDate(project.deadLine) === group.filters.dateMonth;
                    });
                }

                group.filteredProjects = filteredProjects;
            };

            vm.highlightSearchText = function (text, searchText) {
                if (typeof text !== 'string') {
                    text = text != null ? String(text) : '';
                }

                if (!searchText || !searchText.trim()) {
                    return text;
                }

                var searchTerm = searchText.trim();
                var regex = new RegExp('(' + searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                return text.replace(regex, '<mark class="search-highlight">$1</mark>');
            };



            // NEW: Get highlighted text for global search
            vm.getHighlightedText = function (text, fieldName) {
                if (!text) return text;

                // Check if global search is active
                if (vm.globalSearchText && vm.globalSearchText.trim()) {
                    return vm.highlightSearchText(text, vm.globalSearchText);
                }

                return text;
            };

            // NEW: Get highlighted text for group search
            vm.getGroupHighlightedText = function (text, group, fieldName) {
                if (!text) return text;

                // Check if group search is active
                if (group && group.filters && group.filters.searchText && group.filters.searchText.trim()) {
                    return vm.highlightSearchText(text, group.filters.searchText);
                }

                return text;
            };

            // NEW: Enhanced search function that also handles highlighting
            vm.searchAndHighlight = function (projects, searchText) {
                if (!searchText || !searchText.trim()) {
                    return projects;
                }

                var searchTerm = searchText.toLowerCase().trim();

                return projects.filter(function (project) {
                    var matches = (project.title && project.title.toLowerCase().includes(searchTerm)) ||
                        (project.projectNo && project.projectNo.toString().includes(searchTerm)) ||
                        (project.company && project.company.toLowerCase().includes(searchTerm)) ||
                        (project.tenant && project.tenant.toLowerCase().includes(searchTerm));

                    // Add highlighting info to matched projects
                    if (matches) {
                        project._highlightedFields = {
                            title: project.title ? vm.highlightSearchText(project.title, searchText) : project.title,
                            projectNo: project.projectNo ? vm.highlightSearchText(project.projectNo, searchText) : project.projectNo,
                            company: project.company ? vm.highlightSearchText(project.company, searchText) : project.company,
                            tenant: project.tenant ? vm.highlightSearchText(project.tenant, searchText) : project.tenant
                        };
                    }

                    return matches;
                });
            };


            vm.getCombinedHighlightedText = function (text, group, fieldName) {
                if (!text) return '';

                let highlightedText = String(text);

                if (vm.globalSearchText && vm.globalSearchText.trim()) {
                    highlightedText = vm.highlightSearchText(highlightedText, vm.globalSearchText);
                }

                if (group && group.filters && group.filters.searchText && group.filters.searchText.trim()) {
                    highlightedText = vm.highlightSearchText(highlightedText, group.filters.searchText);
                }

                return $sce.trustAsHtml(highlightedText);
            };


            // Update project counts based on current filtered results
            vm.updateProjectCounts = function () {
                var totalProjects = 0;
                var redCount = 0;
                var yellowCount = 0;
                var greyCount = 0;
                var greenCount = 0;

                angular.forEach(vm.ExternalProjectGroups, function (group) {
                    totalProjects += group.filteredProjects.length;

                    angular.forEach(group.filteredProjects, function (project) {
                        // Use the same logic as your original code
                        if (project.primarySortParam == 1) {
                            redCount++;
                        } else if (project.primarySortParam == 2) {
                            yellowCount++;
                        } else if (project.primarySortParam == 3) {
                            greyCount++;
                        } else if (project.primarySortParam == 4) {
                            greenCount++;
                        }
                    });
                });

                vm.ExternalProjectsCount = totalProjects;
                vm.ExternalProjectsRedCount = redCount;
                vm.ExternalProjectYellowCount = yellowCount;
                vm.ExternalProjectGreyCount = greyCount;
                vm.ExternalProjectGreenCount = greenCount;
                vm.ExternalProjectyellowPlusGreenCount = yellowCount + greenCount;
            };

            // Initialize filters when loading data
            vm.initializeFilters = function () {
                // Only initialize if we have external projects data
                if (vm.ExternalProjects && vm.ExternalProjects.length > 0) {
                    // Create initial groups from all projects
                    vm.createProjectGroups(vm.ExternalProjects);

                    // Update counts
                    vm.updateProjectCounts();
                }
            };

           

            function getfilterDeadlineFormatDate(dropdowndate) {
                return new Date(dropdowndate).toLocaleDateString('en', { year: '2-digit', month: 'short' }).replace(" ", "-");
            }

            $scope.$on('$viewContentLoaded',
                function () {
                    App.initAjax();
                });

            vm.getOpenProjectsCount = 0;
            vm.getIternalOpenProjectsCount = 0;
            vm.projectTypes = [

                { id: 1, name: "Domestic" },
                { id: 2, name: "International" },

            ];

            vm.divisionName = function (id) {
                return utilities.getDivisionName(id);
            };
            vm.divisions = [
                { id: 1, name: "ERP" },
                { id: 2, name: "RPA" },
                { id: 3, name: "Mobility" }
            ];

           

            vm.permissions = {
                viewDashboard: abp.auth.hasPermission('Pages.CBS.ProjectsDashboard'),
                view: abp.auth.hasPermission('Pages.CBS.Projects'),
                create: abp.auth.hasPermission('Pages.CBS.Projects.AddNew'),
                edit: abp.auth.hasPermission('Pages.CBS.Projects.Edit'),
                complete: abp.auth.hasPermission('Pages.CBS.Projects.Complete'),
                'delete': abp.auth.hasPermission('Pages.CBS.Projects.Delete'),
                'print': abp.auth.hasPermission('Pages.Tenant.Projects.Print'),
                release: abp.auth.hasPermission('Pages.CBS.Release'),
                scope: abp.auth.hasPermission('Pages.CBS.Projects.Scope'),
                manageRelease: abp.auth.hasPermission('Pages.CBS.Release.ManageRelease')
            };

            vm.openScopeProjectModal = function (row) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/projectScopeModal.cshtml',
                    controller: 'host.views.cbs.projects.projectScopeModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        project: function () {
                            return row;
                        },
                    }
                });
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };

            vm.getProjectPriorityName = function (projectPriorityId) {
                if (projectPriorityId === 1) {
                    return "";
                } else if (projectPriorityId === 2) {
                    return "";
                } else if (projectPriorityId === 3) {
                    return "";
                } else if (projectPriorityId === 4) {
                    return "";
                }
                else {
                    return "";
                }
            }
            vm.openCreateProjectTaskModal = function (projectId, parentTaskId, taskId, addAboveOrBelowTask, selectTaskId) {
                let index = null;
                let parent = null;


                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/createOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectId: projectId,
                                parentId: parentTaskId,
                                taskId: taskId,
                                addAboveOrBelowTask: addAboveOrBelowTask,
                                selectTaskId: selectTaskId,
                                parentTaskName: parent !== null ? parent.name : null,
                                parentChildCount: parent && parent.children ? parent.children.length : 0
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.refresh();

                });
            };

            vm.openCRTasksModal = function (cr) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/changeRequestProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.changeRequestProjectTaskModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        changeRequest: function () {
                            return {
                                id: cr.id,
                                reqNo: cr.reqNo
                            };
                        }
                    }
                });
            }

            vm.addTask = function () {
                vm.loading = true;
                vm.assignedToUser = appSession.user;
                vm.taskDetail.type = 1;
                vm.taskDetail.assignedToId = vm.assignedToUser.id;
                taskDetailService.createTaskWithoutProject({
                    taskDetail: vm.taskDetail,
                    addAboveOrBelowTask: null,
                    selectTaskId: null
                }).success(function (result) {

                    vm.taskDetail.title = null;
                    vm.refresh();
                    vm.taskDetail.critical = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));

                    taskDetailService.criticalTasksCount()
                        .success(function (data) {


                            vm.criticalTasks = data;
                            vm.loading = false;

                        });
                });
            };

            vm.openPlanner = function (row) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/planner/index.cshtml',
                    controller: 'host.views.cbs.planner.index as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        project: function () {
                            return {
                                id: row.id
                                
                            };
                        }
                    }
                });
            };
            vm.openProjectTasksModal = function (project) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/projectTasks.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.projectTasks as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        project: function () {
                            return {
                                id: project.id,
                                company: project.company,
                                tasks: [],
                                crHours: project.crHours,
                                tenantId: project.tenantId,
                                tenancyName: project.tenant,
                                businessDivisionId: project.businessDivisionId,
                                title: project.title
                         
                            };
                        },
                        prepareRelease: vm.prepareRelease,
                        releaseId: vm.activeRelease,
                        workspaceId: null,
                        isInitiateFromCase: null
                    }
                });
            }

            vm.openCriticalTaskModal = function (project) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/CriticalTasks.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.CriticalTasks as vm',
                    backdrop: 'static',
                    size:'xl',
                    resolve: {
                        projectId: project.id,
                    }
                });

            }

            function openCreateOrEditProjectModal(projectId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/createOrEditProjectModal.cshtml',
                    controller: 'host.views.cbs.projects.createOrEditProjectModal as vm',
                    backdrop: 'static',
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }
                    },
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    vm.refresh();
                });
            }

            function openViewProjectModal(projectId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/viewModal.cshtml',
                    controller: 'host.views.cbs.projects.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }

                    },

                    size: 'lg'
                });

            }

            vm.OnHoldProjectCount = 0;

            vm.createProject = function () {
                openCreateOrEditProjectModal(null);
            };

            vm.viewProject = function (project) {
                openViewProjectModal(project.id);
            };

            vm.editProject = function (project) {
                openCreateOrEditProjectModal(project.id);
            };

            vm.deleteProject = function (deal) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectService.deleteProject({
                                id: deal.id
                            }).success(function () {
                                vm.refresh();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.closeProject = function (id) {
                abp.message.confirm(
                    app.localize('CloseProjectWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectService.closeProject({
                                id: id
                            }).success(function () {
                                vm.refresh();
                                abp.notify.success(app.localize('SuccessfullyClosed'));
                            });
                        }
                    }
                );
            };

            vm.completeProject = function (id) {
                abp.message.confirm(
                    app.localize('WantToMarkProjectAsCompleted?'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectService.completeProject({
                                id: id
                            }).success(function () {
                                vm.refresh();
                                abp.notify.success(app.localize('SuccessfullyCompleted'));
                            });
                        }
                    }
                );
            };

            function init() {
                vm.prepareReleaseChanged();
                //vm.getCustomizations();
                releaseService.getActiveRelease()
                    .success(function (data) {
                        if (data !== 0) {
                            vm.releaseId = data;
                        }
                        

                    });
                vm.refresh();
            }

            vm.projectLogsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/createOrShowProjectLogsModal.cshtml',
                    controller: 'host.views.cbs.projects.createOrShowProjectLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        project: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //
                });
            };
            vm.projectDocumentsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/projectDocumentsModal.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.projectDocumentsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        project: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //
                });
            };
            vm.calculateHours = function (revhours, actualhours) {

                return revhours - actualhours;
            }
            vm.calculateHoursPerProject = function (tasks) {
                var development = 0;
                var implementation = 0;
                var others = 0;
                tasks.forEach(function (task) {
                    var type = task.type;
                    if (type == 1) {
                        development = development + vm.calculateHours(task.revisedDuration, task.actualHours);
                    }
                    else if (type == 2) {
                        implementation = implementation + vm.calculateHours(task.revisedDuration, task.actualHours);
                    }
                    else {
                        others = others + vm.calculateHours(task.revisedDuration, task.actualHours);
                    }

                });
                
                implementation = Math.round((implementation + Number.EPSILON) * 100) / 100;
                development = Math.round((development + Number.EPSILON) * 100) / 100;
                others = Math.round((others + Number.EPSILON) * 100) / 100;
                return { development: development, implementation: implementation, others: others };
            };
          

            vm.getName = function (type) {
                var name = 'O ';
                if (type == 1) {
                    name = 'D ';
                }
                else if (type == 2) {
                    name = 'I ';
                }

                return name;
            };
            
            $scope.refresh = function () {

                taskDetailService.criticalTasksCount()
                    .success(function (data) {


                        vm.criticalTasks = data;


                    });
            };
            $interval(function () {
                $scope.refresh();
            }, 120000);
            vm.getbusinessDivisions();
            init();


            vm.exportExternalProjects = function () {
                var tab_text = "<table border='1px'>";
                var tables = document.querySelectorAll(".exportTable"); // Use class instead of ID

                tables.forEach(function (table) {
                    var clone = table.cloneNode(true); // Clone each table
                    var rows = clone.rows;

                    // Optional: remove first column (if needed)
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].cells.length > 0) {
                            rows[i].deleteCell(0);
                        }
                    }

                    for (var j = 0; j < rows.length; j++) {
                        tab_text += "<tr>" + rows[j].innerHTML + "</tr>";
                    }
                });

                tab_text += "</table>";

                // Create downloadable Excel file
                var blob = new Blob([tab_text], { type: "application/vnd.ms-excel" });
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'ExternalProjects.xls';
                a.click();
            };

        }

    ]);
