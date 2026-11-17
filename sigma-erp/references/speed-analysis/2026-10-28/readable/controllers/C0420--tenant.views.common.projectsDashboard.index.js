// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:103868-104701
appModule.controller('tenant.views.common.projectsDashboard.index', [
        '$scope', '$sce' , '$timeout', '$uibModal', 'abp.services.app.customerCareTenant', 'utilities',
        function ($scope, $sce, $timeout, $uibModal, customerCareTenantService, utilities) {

            var vm = this;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.projectTasks = [];
            vm.gapProjectTasks = [];
            vm.openProjects = [];
            vm.filteredTasks = [];
            vm.filteredGapTasks = [];
            vm.originalValues = {};
            vm.sortFeedbackState = { column: null, direction: null };
            vm.sortGapState = { column: null, direction: null };
            vm.filters = { title: '', description: '', reqNo : ''};
            vm.newTask = { title: '', description: '', projectId: null };
            vm.gapFilters = vm.gapFilters || {};
            vm.feedbackFilters = vm.feedbackFilters || {};
            vm.approvedCount = 0;
            vm.notApprovedCount = 0;
            vm.tempTaskCounter = 0;
            //GapCounts
            vm.statusNewGapCount = 0;
            vm.statusTbdGapCount = 0;
            vm.statusInprogressGapCount = 0;
            vm.completedGapCount = 0;
            vm.notCompletedGapCount = 0;
          
            vm.statusNewCount = 0;
            vm.statusTbdCount = 0;
            vm.statusInProgressCount = 0;
            vm.completedStatusCount = 0;
            vm.notCompletedStatusCount = 0;


            //WorkScope
            vm.workScope = {};
            vm.customModules = [];
            vm.documents = [];
            vm.selectedProductVariants = [];
            vm.groupedVariants = {};

            vm.mileStones = [];

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Support.ProjectsDashboard.Add'),
                edit: abp.auth.hasPermission('Pages.Tenant.Support.ProjectsDashboard.Edit'),
                importFromExcel: abp.auth.hasPermission('Pages.Tenant.Support.ProjectsDashboard.Import'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Support.ProjectsDashboard.Export'),
            };

            vm.exportFeedbackTasksToExcel = function () {
                vm.loading = true;

                var exportPayload = {
                    projectId: vm.selectedProject.id,
                    title: vm.feedbackFilters.title,
                    reqNo: vm.feedbackFilters.reqNo,
                    status: vm.feedbackFilters.status,
                    isApproved: vm.feedbackFilters.isApproved,
                    critical: vm.feedbackFilters.critical,
                    type: vm.feedbackFilters.type,
                    category: vm.feedbackFilters.category,
                    creationFromDate: vm.feedbackFilters.creationTime ? vm.feedbackFilters.creationTime.fromDate : null,
                    creationToDate: vm.feedbackFilters.creationTime ? vm.feedbackFilters.creationTime.toDate : null,
                    releaseFromDate: vm.feedbackFilters.releaseDate ? vm.feedbackFilters.releaseDate.fromDate : null,
                    releaseToDate: vm.feedbackFilters.releaseDate ? vm.feedbackFilters.releaseDate.toDate : null

                    
                };

                customerCareTenantService.exportFeedbackTasksToExcel(exportPayload)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportGapPointsToExcel = function () {
                vm.loading = true;

                var exportPayload = {
                    projectId: vm.selectedProject.id,
                    title: vm.gapFilters.title,
                    reqNo: vm.gapFilters.reqNo, status: vm.gapFilters.status,
                    releaseFromDate: vm.gapFilters.releaseDate ? vm.gapFilters.releaseDate.fromDate : null,
                    releaseToDate: vm.gapFilters.releaseDate ? vm.gapFilters.releaseDate.toDate : null
                };

                customerCareTenantService.exportGapPointsToExcel(exportPayload)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getMilestoneStatus = function (id) {
                if (id == 1) {
                    return "Open";
                }
                else if (id == 2) {
                    return "Complete";
                }
                else if (id == 3) {
                    return "Delivered";
                }

            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.getInvoiceStatus = function (id) {
                if (id == 1) {
                    return "Not-Invoiced";
                }
                else if (id == 2) {
                    return "Invoiced";
                }

            }

            vm.getPaymentMilestoneStatus = function (id) {
                if (id == 1) {
                    return "Pending";
                }
                else if (id == 2) {
                    return "Received";
                }

            }
             

            vm.importFeedbackTasks = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/tenant/views/common/projectsDashboard/importFeedbackTaskModal.cshtml',
                    controller: 'tenant.views.common.projectsDashboard.importFeedbackTaskModal as vm',
                    backdrop: 'static',
                    resolve: {}
                });

                modalInstance.result.then(function (importedTasks) {
                    importedTasks.forEach(function (task) {
                        task.projectId = vm.selectedProject.id;
                        task.tempId = 'tempId' + (vm.tempTaskCounter++);
                    });

                    vm.importFeedbackTaskList(importedTasks);
                });
            };
            vm.importFeedbackTaskList = function (importedTasks) {
                importedTasks.forEach(task => {
                    const tempTask = {
                        id: task.tempId,
                        title: task.title,
                        description: task.description,
                        projectId: task.projectId,
                    };
                    vm.projectTasks.unshift(tempTask);
                    vm.setOriginalValue(tempTask, 'title');
                    vm.setOriginalValue(tempTask, 'description');
                    //vm.notApprovedCount = vm.notApprovedCount + 1;
                });

                vm.feedbackSearch();
                const payload = {
                   feedbackTaskList: importedTasks,
                    token: '',
                };

                customerCareTenantService.importTasksList(payload).then(function (savedTasks) {
                    savedTasks.data.forEach(function (savedTask) {
                        const index = vm.projectTasks.findIndex(t => t.id === savedTask.tempId);
                        if (index !== -1) {
                            vm.projectTasks[index] = {
                                ...vm.projectTasks[index],
                                id: savedTask.id,
                                status: savedTask.status,
                                duration: savedTask.duration,
                                creationTime: savedTask.creationTime,
                                isApproved: savedTask.isApproved,
                            };
                            vm.setOriginalValue(vm.projectTasks[index], 'title');
                            vm.setOriginalValue(vm.projectTasks[index], 'description');
                        } else {
                            vm.projectTasks.unshift(savedTask);
                        }
                    });

                    abp.notify.success("Tasks imported successfully!");
                    vm.feedbackSearch(); 
                });
            };


            vm.openFeedbackFilter = function (type) {
                $uibModal.open({
                    templateUrl: '/App/tenant/views/common/projectsDashboard/feedbackTasksFilters.cshtml',
                    controller: 'tenant.views.common.projectsDashboard.feedbackTasksFilters as vm',
                    backdrop: 'static',
                    resolve: {
                        filterType: function () {
                            return type;
                        },
                        projectId: function () {
                            return vm.selectedProject.id;
                        },
                         previousValue: function () {
                             return vm.feedbackFilters[type] != null ? vm.feedbackFilters[type] : null
                        }
                    }
                }).result.then(function (result) {
                    if (result && result.projectId === vm.selectedProject.id) {
                        vm.feedbackFilters[result.type] = result.value;
                        vm.feedbackSearch();
                    }
                });
            };
            

            vm.openGapPointFilter = function (type) {
                $uibModal.open({
                    templateUrl: '/App/tenant/views/common/projectsDashboard/gapPointFilters.cshtml',
                    controller: 'tenant.views.common.projectsDashboard.gapPointFilters as vm',
                    backdrop: 'static',
                    resolve: {
                        filterType: function () {
                            return type;
                        },
                        projectId: function () {
                            return vm.selectedProject.id;
                        },
                         previousValue: function () {
                             return vm.gapFilters[type] || null;
                        }
                    }
                }).result.then(function (result) {
                    if (result && result.projectId === vm.selectedProject.id) {
                        vm.gapFilters[result.type] = result.value;
                        vm.gapPointSearch();
                    }
                });
            };
            //clear filters -- 
            vm.clearFilter = function (type, fromGapPointorFeedback) {
                if (fromGapPointorFeedback) {
                    delete vm.feedbackFilters[type];
                    vm.feedbackSearch();
                }
                else {
                    delete vm.gapFilters[type];
                    vm.gapPointSearch();
                }
            };

            vm.getTaskStatus = function (status) {
                if (!status) return '';
                else if (status == 1) return 'New';
                else if (status == 2) return 'TBD';
                else if (status == 3) return 'In Progress';
                else if (status == 4) return 'Completed';
                else return '';
            };
            vm.getChargingType = function (chargingType) {
                if (!chargingType) return '';
                else if (chargingType == 1) return 'Paid';
                else if (chargingType == 2) return 'Buffer';
                else if (chargingType == 3) return 'Complementary';
                else if (chargingType == 4) return 'GAP';
                else return '';
            };
            vm.getCategory = function (category) {
                if (!category) return '';
                
                else if (category == 2) return 'Bug';
                else if (category == 3) return 'CR';
               
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

            vm.setOriginalValue = function (task, field) {
                if (!task || !field) return;
                vm.originalValues[task.id] = vm.originalValues[task.id] || {};
                vm.originalValues[task.id][field] = (task[field] || '').trim();
            };

            vm.focusDescription = function (taskId) {
                vm.focusedDescriptionId = taskId;
                setTimeout(() => {
                    const descEl = document.getElementById("desc_" + taskId);
                    if (descEl) {
                        descEl.focus();
                    }
                }, 100);
            };

            vm.autoResizeTextarea = function () {
                setTimeout(function () {
                    var textareas = document.querySelectorAll('textarea');
                    textareas.forEach(function (value) {
                        value.style.height = 'auto';
                        value.style.height = value.scrollHeight + 'px';
                    });
                }, 0);
            };

            // Filters for Gap Point
       
            vm.gapPointSearch = function () {
                vm.filteredGapTasks = vm.gapProjectTasks.filter(function (task) {
                    if (vm.gapFilters.title && !task.title?.toLowerCase().includes(vm.gapFilters.title.toLowerCase())) {
                        return false;
                    }
                    if (vm.gapFilters.reqNo && !task.reqNo?.toLowerCase().includes(vm.gapFilters.reqNo.toLowerCase())) {
                        return false;
                    }
                    if (vm.gapFilters.status && vm.gapFilters.status.length > 0 && !vm.gapFilters.status.includes(task.status)) {
                        return false;
                    }
                    if (vm.gapFilters.releaseDate) {
                        const taskDate = new Date(task.releaseDate);
                        const from = vm.gapFilters.releaseDate.fromDate ? new Date(vm.gapFilters.releaseDate.fromDate) : null;
                        const to = vm.gapFilters.releaseDate.toDate ? new Date(vm.gapFilters.releaseDate.toDate) : null;

                        if ((from && taskDate < from) || (to && taskDate > to)) {
                            return false;
                        }
                    }

                   return true;
                });
                vm.statusNewGapCount = vm.filteredGapTasks.filter(t => t.status === 1).length;
                vm.statusTbdGapCount = vm.filteredGapTasks.filter(t => t.status === 2).length;
                vm.statusInProgressGapCount = vm.filteredGapTasks.filter(t => t.status === 3).length;
                vm.completedGapCount = vm.filteredGapTasks.filter(t => t.status === 4).length;


            };

            vm.sortGapPoint = function (column) {
                if (vm.sortGapState.column !== column) {
                    vm.sortGapState.column = column;
                    vm.sortGapState.direction = 'asc';
                } else {
                    if (vm.sortGapState.direction === 'asc') {
                        vm.sortGapState.direction = 'desc';
                    } else if (vm.sortGapState.direction === 'desc') {
                        vm.sortGapState.direction = null;
                    } else {
                        vm.sortGapState.direction = 'asc';
                    }
                }

                if (vm.sortGapState.direction) {
                    vm.filteredGapTasks = [...vm.filteredGapTasks].sort((a, b) => {
                        let valA = a[column];
                        let valB = b[column];

                        if (valA == null) valA = '';
                        if (valB == null) valB = '';

                        if (typeof valA === 'string') valA = valA.toLowerCase();
                        if (typeof valB === 'string') valB = valB.toLowerCase();

                        if (typeof valA === 'number' && typeof valB === 'number') {
                            return vm.sortGapState.direction === 'asc' ? valA - valB : valB - valA;
                        }
                        return vm.sortGapState.direction === 'asc'
                            ? String(valA).localeCompare(String(valB))
                            : String(valB).localeCompare(String(valA));
                    });
                } else {
                    vm.filteredGapTasks = [...vm.filteredGapTasks].sort((a, b) => {
                        const dateA = new Date(a.creationTime);
                        const dateB = new Date(b.creationTime);
                        return dateB - dateA;
                    });
                }
                


            };

            // Filters For Feedback Tasks
            vm.feedbackSearch = function () {
                vm.filteredTasks = vm.projectTasks.filter(function (task) {
                    if (vm.feedbackFilters.title && !task.title?.toLowerCase().includes(vm.feedbackFilters.title.toLowerCase())) {
                        return false;
                    }
                    if (vm.feedbackFilters.reqNo && !task.reqNo?.toLowerCase().includes(vm.feedbackFilters.reqNo.toLowerCase())) {
                        return false;
                    }
                    if (vm.feedbackFilters.type && vm.feedbackFilters.type.length > 0 && !vm.feedbackFilters.type.includes(task.type)) {
                        return false;
                    }
                    if (vm.feedbackFilters.status && vm.feedbackFilters.status.length > 0 && !vm.feedbackFilters.status.includes(task.status)) {
                        return false;
                    }
                    if (vm.feedbackFilters.category !== undefined && vm.feedbackFilters.category !== null && vm.feedbackFilters.category !== '') {
                        if (task.category !== vm.feedbackFilters.category) {
                            return false;
                        }
                    }
                    if (vm.feedbackFilters.creationTime) {
                        const taskDate = new Date(task.creationTime);
                        const from = vm.feedbackFilters.creationTime.fromDate ? new Date(vm.feedbackFilters.creationTime.fromDate) : null;
                        const to = vm.feedbackFilters.creationTime.toDate ? new Date(vm.feedbackFilters.creationTime.toDate) : null;

                        if ((from && taskDate < from) || (to && taskDate > to)) {
                            return false;
                        }
                    }
                    if (vm.feedbackFilters.releaseDate) {
                        const taskDate = new Date(task.releaseDate);
                        const from = vm.feedbackFilters.releaseDate.fromDate ? new Date(vm.feedbackFilters.releaseDate.fromDate) : null;
                        const to = vm.feedbackFilters.releaseDate.toDate ? new Date(vm.feedbackFilters.releaseDate.toDate) : null;

                        if ((from && taskDate < from) || (to && taskDate > to)) {
                            return false;
                        }
                    }
                    if (vm.feedbackFilters.isApproved !== undefined && vm.feedbackFilters.isApproved !== null && vm.feedbackFilters.isApproved !== '') {
                        if (task.isApproved !== vm.feedbackFilters.isApproved) {
                            return false;
                        }
                    }
                    if (vm.feedbackFilters.critical !== undefined && vm.feedbackFilters.critical !== null && vm.feedbackFilters.critical !== '') {
                        if (task.critical !== vm.feedbackFilters.critical) {
                            return false;
                        }
                    }
                    
                    return true;
                });
                vm.approvedCount = vm.filteredTasks.filter(t => t.isApproved === true).length;
                vm.notApprovedCount = vm.filteredTasks.filter(t => t.isApproved === false).length;


                vm.statusNewCount = vm.filteredTasks.filter(t => t.status === 1).length;
                vm.statusTbdCount = vm.filteredTasks.filter(t => t.status === 2).length;
                vm.statusInProgressCount = vm.filteredTasks.filter(t => t.status === 3).length;
                vm.completedStatusCount = vm.filteredTasks.filter(t => t.status === 4).length;
                
            };

            vm.sortFeedbackTasks = function (column) {
                if (vm.sortFeedbackState.column !== column) {
                    vm.sortFeedbackState.column = column;
                    vm.sortFeedbackState.direction = 'asc';
                } else {
                    if (vm.sortFeedbackState.direction === 'asc') {
                        vm.sortFeedbackState.direction = 'desc';
                    } else if (vm.sortFeedbackState.direction === 'desc') {
                        vm.sortFeedbackState.direction = null;
                    } else {
                        vm.sortFeedbackState.direction = 'asc';
                    }
                }

                if (vm.sortFeedbackState.direction) {
                    vm.filteredTasks = [...vm.filteredTasks].sort((a, b) => {
                        let valA = a[column];
                        let valB = b[column];

                        if (valA == null) valA = '';
                        if (valB == null) valB = '';

                        if (typeof valA === 'string') valA = valA.toLowerCase();
                        if (typeof valB === 'string') valB = valB.toLowerCase();

                        if (typeof valA === 'number' && typeof valB === 'number') {
                            return vm.sortFeedbackState.direction === 'asc' ? valA - valB : valB - valA;
                        }

                        return vm.sortFeedbackState.direction === 'asc'
                            ? String(valA).localeCompare(String(valB))
                            : String(valB).localeCompare(String(valA));
                    });
                } else {
                    vm.filteredTasks = [...vm.filteredTasks].sort((a, b) => {
                        if (a.critical !== b.critical) {
                            return b.critical - a.critical; 
                        }
                        const dateA = new Date(a.creationTime);
                        const dateB = new Date(b.creationTime);
                        return dateB - dateA;
                    });
                }
            };

            vm.handleEnterKey = function (event, task, isNewTask) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    if (isNewTask) {
                        if (!task.title || task.title.trim() === "") {
                            return;
                        }

                        vm.saveOrCreateTaskOnBlur(task, true);
                    }
                    else {
                        vm.saveOrCreateTaskOnBlur(task, false);
                    }
                }
            };

            vm.addNewTask = function (task, isNewTask) {
                if (isNewTask && (!task.title || task.title.trim() === "")) {
                    return;
                }
                vm.saveOrCreateTaskOnBlur(task, true);
            };

            vm.selectProject = function (project) {
                vm.selectedProject = project;
                vm.getGAPPointsByProjectId(project.id);
                vm.getTasksByProjectId(project.id);
                vm.getProjectWorkScope(project.id);
                vm.getProjectMilestone(project.id);
                vm.getPlannedReleases(project.id);
                vm.getClosedReleases(project.id);
                

            };

            vm.getOpenProjects = function () {
                vm.loading = true;
                customerCareTenantService.getOpenProjects()
                    .success(function (result) {
                        vm.openProjects = result.items;
                        vm.loading = false;
                        if (!vm.selectedProject && vm.openProjects && vm.openProjects.length > 0) {
                            var currentProject = vm.openProjects[0];
                            vm.selectProject(currentProject);
                        }

                    })
                    .error(function () {
                        abp.notify.error("Failed to load projects");
                    });
            };

            vm.getTasksByProjectId = function (projectId, skipLoading) {
                if (!projectId) return;

                if (!skipLoading) {
                    vm.loading = true;
                }
                vm.newTask.projectId = projectId;
                customerCareTenantService.getTasksByProjectId({ id: projectId })
                    .success(function (data) {                        
                        vm.projectTasks = data.items;
                        vm.tempTaskCounter = vm.projectTasks.length + 1;
                        vm.feedbackSearch();
                    })
                    .error(function () {
                        abp.notify.error("Failed to load tasks");
                    })
                    .finally(function () {
                        if (!skipLoading) {
                            vm.loading = false;
                        }
                    });
            };

            vm.getGAPPointsByProjectId = function (projectId) {
                if (!projectId) return;
                vm.loading = true;
                customerCareTenantService.getGAPPointsByProjectId({ id: projectId })
                    .success(function (data) {
                        vm.gapProjectTasks = data.items;
                        vm.gapPointSearch();
                    })
                    .error(function () {
                        abp.notify.error("Failed to load tasks");
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getPlannedReleases = function (projectId) {
                if (!projectId) return;
                vm.loading = true;
                customerCareTenantService.getPlannedReleases({ id: projectId })
                    .success(function (data) {
                        vm.plannedReleases = data;
                    })
                    .error(function () {
                        abp.notify.error("Failed to load releases");
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            vm.getClosedReleases = function (projectId) {
                if (!projectId) return;
                vm.loading = true;
                customerCareTenantService.getClosedReleases({ id: projectId })
                    .success(function (data) {
                        vm.closedReleases = data;
                    })
                    .error(function () {
                        abp.notify.error("Failed to load releases");
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }


            vm.openReleaseTasks = function (id) {
                 $uibModal.open({
                    templateUrl: '/App/tenant/views/common/projectsDashboard/releaseTasksModal.cshtml',
                    controller: 'tenant.views.common.projectsDashboard.releaseTasksModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {

                        releaseId: id

                    }
                });
            };

            vm.getProjectMilestone = function (projectId) {
                customerCareTenantService.getMilestonesByProjectId({ id: projectId }).success(function (response) {
                    vm.mileStones = response;
                    if (vm.mileStones.length > 0)
                        vm.filters.activeMilestoneId = vm.mileStones.find(m => m.milestoneStatus === 1) ? vm.mileStones.find(m => m.milestoneStatus === 1).id : null;
                    //vm.refresh();

                });

            };
            //Task Priority Update For Feedback Tab 

            vm.unCheckCriticalTask = function (taskId, critical) {
                //vm.loading = true;
                taskDetailService.updateTaskPriority({ key: taskId, value: critical })
                    .success(function () {
                        vm.feedbackSearch();
                    })
                    .finally(function () {
                        //vm.loading = false;
                    });
            }

            vm.saveOrCreateTaskOnBlur = function (task, isNewTask) {
                if (!task) return;

                task.title = task.title ? task.title.trim() : "";
                task.description = task.description ? task.description.trim() : "";
                //task.critical = task.Critical;

                if (!isNewTask) {
                    const original = vm.originalValues[task.id] || {};
                    const originalTitle = (original.title || '').trim();
                    const originalDescription = (original.description || '').trim();

                    const currentTitle = (task.title || '').trim();
                    const currentDescription = (task.description || '').trim();

                    const titleChanged = currentTitle !== originalTitle;
                    const descriptionChanged = currentDescription !== originalDescription;

                    const originalCritical = original.critical;
                    const currentCritical = task.critical;

                    const criticalChanged = currentCritical !== originalCritical;

                    if (!titleChanged && !descriptionChanged && !criticalChanged) {
                        return;
                    }
                }

                if (isNewTask) {
                    const tempId = 'temp_' + (vm.tempTaskCounter++);
                    const newTask = {
                        id: tempId,
                        title: task.title,
                        description: task.description,
                        projectId: vm.selectedProject.id
                    };
                    vm.projectTasks.unshift(newTask);
                    vm.feedbackSearch();
                    vm.newTask = {
                        title: '',
                        description: '',
                        projectId: vm.selectedProject.id
                    };
                   
                    customerCareTenantService.createOrEditProjectTask({ taskDetail: newTask })
                        .success(function (result) {
                            if (result && result.id) {
                                const index = vm.projectTasks.findIndex(t => t.id === tempId);
                                if (index !== -1) {
                                    vm.projectTasks[index] = {
                                        ...vm.projectTasks[index],
                                        id: result.id,
                                        status: result.status,
                                        duration: result.duration,
                                        creationTime: result.creationTime,
                                        isApproved: result.isApproved,
                                        critical: result.isCritical,
                                    };
                                   
                                    vm.setOriginalValue(vm.projectTasks[index], 'title');
                                    vm.setOriginalValue(vm.projectTasks[index], 'description');
                                }
                                vm.feedbackSearch();
                            }
                        })
                        .error(function () {
                            vm.feedbackSearch();
                        });

                } else {
                    customerCareTenantService.createOrEditProjectTask({ taskDetail: task})
                        .success(function () {
                        });
                }
            };
            vm.getModuleCategory = function (category) {
                return category === 2 ? 'Add On' : '';
            };
            vm.downloadAndOpen = function (doc, $event) {
                if ($event) $event.preventDefault();

                const extension = (doc.name || '').split('.').pop().toLowerCase();
                const browserViewableExtensions = [
                    'pdf', 'txt', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'html', 'htm'
                ];
                const officeExtensions = ['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt'];
                if (officeExtensions.includes(extension)) {
                    const previewUrl = "https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(doc.urlWithToken);
                    window.open(previewUrl, '_blank');
                } else if (browserViewableExtensions.includes(extension)) {
                    window.open(doc.urlWithToken, '_blank');
                }
                setTimeout(function () {
                    const link = document.createElement('a');
                    link.href = doc.urlWithToken;
                    link.setAttribute('download', vm.getOriginalName(doc));
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, 500);
            };

            vm.getOriginalName = function (doc) {
                return doc.name.replace("_" + doc.guid, "");
            };

            vm.getFormattedDetailText = function (mod) {
                if (!mod) return "";

                let text = mod;
                text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                text = text.replace(/(^|[^_])_(?!_)([^_]+)_(?!_)/g, "$1<em>$2</em>");
                text = text.replace(/(?:^|\n)\s*\*\s+(.*)/g, function (_, item) {
                    return "<li>" + item + "</li>";
                });
                text = text.replace(/\n(?!\s*\*)/g, "<br>");
                if (text.includes("<li>")) {
                    text = text.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");
                }

                return $sce.trustAsHtml(text);
            };

             vm.getProjectWorkScope = function (projectId) {
                vm.loading = true;
                customerCareTenantService.getProjectWorkScope({ id: projectId }).success(function (result) {
                    if (result) {
                        vm.workScope = result;
                        vm.documents = result.documents || [];

                        const parsedScope = JSON.parse(result.scope || '{}');

                        vm.selectedProductVariants = parsedScope.selectedProductVariants || [];
                        vm.customModules = parsedScope.customModules || [];


                        vm.groupedVariants = {};
                        vm.selectedProductVariants.forEach(function (item) {
                            if (!vm.groupedVariants[item.productCode]) {
                                vm.groupedVariants[item.productCode] = {
                                    productName: item.productName,
                                    variants: [],
                                    showVariants: true
                                };
                            }
                            vm.groupedVariants[item.productCode].variants.push(item);
                        });
                    }
                    else {
                        vm.workScope = null;
                        vm.documents = [];
                        vm.selectedProductVariants = [];
                        vm.customModules = [];
                    }
                    vm.loading = false;

                });
            };

            vm.getOpenProjects();
        }
    ]);
