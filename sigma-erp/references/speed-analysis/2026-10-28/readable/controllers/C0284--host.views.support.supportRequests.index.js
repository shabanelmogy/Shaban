// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:81896-82362
appModule.controller('host.views.support.supportRequests.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.supportRequestHost', 'abp.services.app.customerCareTenant', 'abp.services.app.tenant', 'abp.services.app.user', 'appSession', 'utilities',
        function ($scope, $uibModal, uiGridConstants, supportRequestService, customerCareTenantService, tenantAppService, userService, appSession, utilities) {
            var vm = this;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);


            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            
            vm.loading = false;
            vm.users = [];
            vm.canEscalateToNextTier = abp.auth.hasPermission('Pages.Support.CanEscalateToNextTier');

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            var projectId = $scope.projectParams? $scope.projectParams.projectId: null;
            vm.isOpenFromProjectDashboard = $scope.projectParams? $scope.projectParams.isOpenFromProjectDashboard: null;
            
            vm.filters = {
                status: 1,
                tenantId: null,
                assignedToUserId: null,
                assignedToUser: null,
                escalatedToUserId: null,
                escalatedToUser: null,
                fromDate: null,
                toDate: null,
                enableDateRange: false,
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                unAssigned: false,
                isEscalated: false,
                unConcern: false,
                IsPostGoLive: null,
                projectId: projectId,
                slaTypesArray:
                    [
                        { id: 2, name: 'Post Go-Live' },
                        { id: 3, name: 'Live' }
                    ],
                slaTypes: [2, 3],
                customerCategoriesArray: [],
                customerCategories:[]

            };

            vm.slaTypes = [
                { id: 1, name: 'Implementation' },
                { id: 2, name: 'Post Go-Live' },
                { id: 3, name: 'Live' }
            ];
            vm.customerCategories = [];

            vm.changeSlaTypesFilter = function () {

                vm.filters.slaTypes = [];
                if (vm.filters.slaTypesArray.length > 0) {
                    angular.forEach(vm.filters.slaTypesArray, function (value) {
                        vm.filters.slaTypes.push(value.id);
                    });
                }
            }

            vm.changeCustomerCategeroiesFilter = function () {
                vm.filters.customerCategories = [];
                if (vm.filters.customerCategoriesArray.length > 0) {
                    angular.forEach(vm.filters.customerCategoriesArray, function (value) {
                        vm.filters.customerCategories.push(value.groupName);
                    })
                }
            }

            vm.getSlaTypeName = function (id) {
                if (id == 1)
                    return "Implementation";
                else if (id == 2)
                    return "Post Go-Live";
                else if (id == 3)
                    return "Live";
                else
                    return "";
            }

            vm.getPriority = function (priority) {
                if (priority == 3)
                    return app.localize("High");
                else
                    return "";
            };

            vm.supportRequestsByTier = function (tierId) {
                if (!vm.supportRequests) return 0;
                return vm.supportRequests.filter(x => x.tier === tierId).length;
            };
            
            //vm.getPriority = function (priority) {
            //    if (priority == 1)
            //        return app.localize("Low");
            //    else if (priority == 2)
            //        return app.localize("Medium");
            //    else if (priority == 3)
            //        return app.localize("High");
            //    else
            //        return "";
            //};


            vm.dateDifferenceInDays = function (replyDate) {
                //moment.utc(date).toDate()
                var now = moment.utc(new Date()); //todays date
                var end = moment.utc(replyDate); // another date
                var duration = moment.duration(now.diff(end));
                var days = duration.asDays();
                return days;
            };


            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.SupportRequests'),
                create: abp.auth.hasPermission('Pages.Tenant.SupportRequests.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.SupportRequests.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.SupportRequests.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers'),
            };

            function editSupportRequestModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/support/supportRequests/editModal.cshtml',
                    controller: 'host.views.support.supportRequests.editModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        supportRequestId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            }

            vm.openRequestLogModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/support/supportRequests/createOrShowRequestLogsModal.cshtml',
                    controller: 'host.views.support.supportRequests.createOrShowRequestLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        supportRequest: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            }

            vm.createSupportRequest = function () {
                openCreateOrEditSupportRequestModal(null);
            };

            vm.editSupportRequest = function (supportRequest) {
                editSupportRequestModal(supportRequest.id);
            };
            
            vm.statusChanged = function () {
                //if (vm.filters.status == 1)
                //    vm.filters.enableDateRange = false;
                //else
                //    vm.filters.enableDateRange = true;
            };
            
            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };
            function openCreateOrEditSupportRequestModal(id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/support/supportRequests/createModal.cshtml',
                    controller: 'host.views.support.supportRequests.createModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        supportRequestId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            }
            vm.createSupportRequest = function () {
                openCreateOrEditSupportRequestModal(null);
            };
            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            };
            vm.getPostGoLive = [
                { id: false, name: "Normal" },
                { id: true, name: "Post Go-Live" }];
            vm.tiers = [
                { id: 1, name: "Tier 1" },
                { id: 2, name: "Tier 2" },
                { id: 3, name: "Tier 3" }];
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY HH:mm');
                }
                else {
                    return "";
                }
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
            
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return;

                userService.searchAssignedToUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.escalateTier = function (supportRequest) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/support/supportRequests/escalateModal.cshtml',
                    controller: 'host.views.support.supportRequests.escalateModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        SupportRequest: function () {
                            return supportRequest;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });


                //abp.message.confirm(
                //    "Are you sure to Escalate Support Request?",
                //    function (isConfirmed) {
                //        if (isConfirmed) {
                //            supportRequestService.escalateTier(supportRequest).success(function () {
                //                vm.getSupportRequests();
                //                abp.notify.success(app.localize('SuccessfullySaved'));
                //            });
                //        }
                //    }
                //);
            };

            vm.supportRequestClose = function (request) {
                //abp.message.confirm(
                //    app.localize('CloseRequestMessage', request.requestNo),
                //    function (isConfirmed) {
                //        if (isConfirmed) {
                //            supportRequestService.closeRequest({
                //                id: request.id
                //            }).success(function () {
                //                vm.getSupportRequests();
                //                abp.notify.success(app.localize('SuccessfullySaved'));
                //            });
                //        }
                //    }
                //);

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/support/supportRequests/closeModal.cshtml',
                    controller: 'host.views.support.supportRequests.closeModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        supportRequestId: function () {
                            return request.id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            };

            vm.supportRequestReOpen = function (request) {
                vm.saving = true;
                supportRequestService.reOpenSupportRequest({
                    supportRequest: request
                }).success(function () {
                    abp.notify.info(app.localize('Re-OpenSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                    vm.getSupportRequests();
                });
            };

            vm.supportRequestMovetoCustomization = function (request) {
                abp.message.confirm(
                    app.localize('MoveToCustomizationRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            supportRequestService.moveToCustomization({
                                id: request.id
                            }).success(function () {
                                vm.getSupportRequests();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };

            vm.supportRequestMovetoDataEntryCorrection = function (request) {
                abp.message.confirm(
                    app.localize('MoveToDataEntryRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            supportRequestService.moveToDataEntryCorrection({
                                id: request.id
                            }).success(function () {
                                vm.getSupportRequests();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };


            vm.editOrViewProjectTaskModal = function (bugid, supportId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/bugs/viewOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.bugs.createOrEditProjectTaskModal as vm',
                    //controller: 'host.views.cbs.projectTasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                projectId: null,
                                parentId: null,
                                taskId: bugid
                            };
                        },
                        supportRequestid: supportId
                    }
                });

                modalInstance.result.then(function (tasks) {

                });
            };


            vm.openCreateProjectTaskModal = function (SupportData) {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/bugs/createOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.bugs.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectId: null,
                                parentId: null,
                                taskId: null,
                                addAboveOrBelowTask: null,
                                selectTaskId: null,
                                parentTaskName: null,
                                parentChildCount: 0
                            };
                        },
                        supportRequestid: SupportData
                    }
                });
                modalInstance.result.then(function () {
                    vm.getSupportRequests();

                });
            };

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.getSupportRequests = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                supportRequestService.getSupportRequests(vm.filters).success(function (data) {
                    vm.supportRequests = data.items;
                    //debugger
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getGroupNamesList = function () {
                supportRequestService.getBusinessDivisionGroupList().success(function (data) {
                    vm.customerCategories = data.items;
                })
            }

            vm.getSupportRequests();
            getStatuses();
            vm.getGroupNamesList(); 

        }
    ]);
