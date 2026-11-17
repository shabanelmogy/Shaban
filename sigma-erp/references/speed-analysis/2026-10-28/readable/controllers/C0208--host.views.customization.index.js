// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:69374-70090
appModule.controller('host.views.customization.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.customizationHost', 'abp.services.app.tenant', 'abp.services.app.user', 'abp.services.app.taskDetail', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, uiGridConstants, customizationService, tenantAppService, userService, taskDetailService, utilities, businessDivisionService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            //vm.businessNames = [
            //    { id: 1, name: "Karzansoft" },
            //    { id: 2, name: "Speed Auto Systems" },
            //];
            //vm.businessName = [
            //    { id: 1, name: "Karzansoft (UAE)", currency: "AED", tax: 0 },
            //    { id: 2, name: "Speed Auto Systems (UAE)", currency: "AED", tax: 0 },
            //    { id: 3, name: "Speed Auto Systems ", currency: "USD", tax: 0 },
            //    { id: 4, name: "Speed Auto Systems (UK)", currency: "GBP", tax: 0 },
            //];
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.chargingTypes = [
                { id: 4, name: "Project GAP" },
                { id: 2, name: "Project Buffer" },
                { id: 1, name: "Paid" },
                { id: 3, name: "Complementary" }

            ];
            vm.projectStatuses = [
                { id: 1, name: "Open" },
                { id: 2, name: "Closed" },
                { id: 3, name: "OnHold" },
                { id: 4, name: "Cancelled" },
                { id: 5, name: "Completed" }

            ];
            vm.businessName = utilities.divisionName();
            vm.loading = false;
            vm.users = [];
            vm.projects = [];
            vm.RequestNos = [];
            vm.project = null;
            vm.estimatedHours = 0.0;
            vm.actualHours = 0.0;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.filters = {
                business: null,
                tenantId: null,
                assignedToUserId: null,
                chargingType: null,
                projectStatus:null,
                assignedToUser: null,
                fromDate: null,
                toDate: null,
                enableDateRange: false,
                projectId: null,
                reqNo: null,
                status: null,
                unAssigned: false,
                isCreationDate: "true",
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                selectedStatuses: [],
                //slaTypesArray:
                //    [
                //        { id: 2, name: 'Post Go-Live' },
                //        { id: 3, name: 'Live' }
                //    ],
                //slaTypes: [2, 3]
            };

            vm.slaTypes = [
                { id: 1, name: 'Implementation' },
                { id: 2, name: 'Post Go-Live' },
                { id: 3, name: 'Live' }
            ];

            vm.changeSlaTypesFilter = function () {

                vm.filters.slaTypes = [];
                if (vm.filters.slaTypesArray.length > 0) {
                    angular.forEach(vm.filters.slaTypesArray, function (value) {
                        vm.filters.slaTypes.push(value.id);
                    });
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

            vm.searchProjects = function ($select) {
                if ($select.search == "")
                    return null;
                taskDetailService.searchProjects({ keyword: $select.search }).then(function (response) {
                    vm.projects = response.data.items;
                });
            };

            vm.searchRequestNo = function ($select) {
                if ($select.search == "")
                    return null;
                customizationService.searchReqNo($select.search).then(function (response) {
                    vm.RequestNos = response.data;
                });
            };

            vm.getNameWithCompany = function (project) {
                return project.title + " (" + project.company.companyName + ")";
            };

            vm.getPriority = function (priority) {
                if (priority == 3)
                    return app.localize("High");
                else
                    return "";
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.SupportRequests'),
                create: abp.auth.hasPermission('Pages.Tenant.SupportRequests.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.SupportRequests.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.SupportRequests.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers'),
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
            vm.setStatuses = function () {
                vm.filters.selectedStatuses = [
                    { id: 13, name: "Quotation Approved" },
                    { id: 8, name: "Finance Approved" },
                    { id: 2, name: app.localize("Closed") }
                ];
                vm.filters.enableDateRange = true;
            };
            vm.estimateCustomization = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/estimateCustomizationModal.cshtml',
                    controller: 'host.views.customization.estimateCustomizationModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        customization: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCustomizations();
                });
            }

            function editCustomizationModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/editModal.cshtml',
                    controller: 'host.views.customization.editModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        customizationId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCustomizations();
                });
            }

            vm.openCustomizationLogModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/createOrShowCustomizationLogsModal.cshtml',
                    controller: 'host.views.customization.createOrShowCustomizationLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        customization: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCustomizations();
                });
            }

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
                        },
                        releaseId: null
                    }
                });
            }

            vm.editCustomization = function (customization) {
                editCustomizationModal(customization.id);
            };

            vm.statusChanged = function () {

                var f = false;
                vm.filters.selectedStatuses.forEach(function (value) {
                    if (value.id == 2) {
                        f = true;
                    }
                });
                if (vm.filters.selectedStatuses.length > 1) {
                    //Date will be enabled only on Closed status
                    f = false;
                }
                vm.filters.enableDateRange = f;
            };



            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("New");
                else if (id == 2)
                    return app.localize("Closed");
                else if (id == 3)
                    return app.localize("Cancelled");
                else if (id == 4)
                    return app.localize("OnHold");
                else if (id == 5)
                    return "Estimation Pending";
                else if (id == 6)
                    return "Estimated, Customer Confirmation Pending";
                else if (id == 7)
                    return "Customer Confirmed, Finance Approval Pending";
                else if (id == 8)
                    return "Finance Approved";
                else if (id == 9)
                    return "In-Progress";
                else if (id == 10)
                    return "Scope Sent";
                else if (id == 11)
                    return "Scope Approved";
                else if (id == 12)
                    return "Quotation Sent";
                else if (id == 13)
                    return "Quotation Approved";
                else if (id == 14)
                    return "On Approval";
                else if (id == 15)
                    return "Delivered";
                else return '';
            };

            vm.filters.selectedStatuses = [];// [{ id: 1, name: app.localize("ApprovalPending") }, { id: 3, name: app.localize("Approved") }];
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("New") },
                    { id: 10, name: "Scope Sent" },
                    { id: 11, name: "Scope Approved" },
                    { id: 12, name: "Quotation Sent" },
                    { id: 14, name: "On Approval" },
                    { id: 13, name: "Quotation Approved" },
                    { id: 8, name: "Finance Approved" },
                    { id: 15, name: "Delivered" },
                    { id: 2, name: app.localize("Closed") },
                    { id: 3, name: app.localize("Cancelled") },
                    { id: 4, name: app.localize("On Hold") }
                    //,
                    //{ id: 5, name: "Estimation Pending" },
                    //{ id: 6, name: "Estimated, Customer Confirmation Pending" },
                    //{ id: 7, name: "Customer Confirmed, Finance Approval Pending" },
                    //{ id: 9, name: "In-Progress" }
                ];
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

            vm.customizationClose = function (customization) {
                //var modalInstance = $uibModal.open({
                //    templateUrl: '~/App/host/views/customization/closeCustomizationModal.cshtml',
                //    controller: 'host.views.customization.closeCustomizationModal as vm',
                //    backdrop: 'static',
                //    size: 'md',
                //    resolve: {
                //        customization: function () {
                //            return customization;
                //        }
                //    }

                //});
                //modalInstance.result.then(function () {
                //    vm.getCustomizations();
                //});

                

                abp.message.confirm(
                    app.localize('CloseRequestMessage', customization.reqNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customizationService.closeCustomization({
                                customizationId: customization.id
                            }).success(function () {
                                vm.getCustomizations();
                                abp.notify.success(app.localize('SuccessfullyClosed'));
                            });
                        }
                    }
                );
            };

            vm.report = function ()
            {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/host/views/customization/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.customizationCancel = function (customization) {
                abp.message.confirm(
                    app.localize('CancelRequestMessage', customization.reqNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customizationService.cancelCustomization({
                                customizationId: customization.id
                            }).success(function () {
                                vm.getCustomizations();
                                abp.notify.success(app.localize('SuccessfullyCancelled'));
                            });
                        }
                    }
                );
            };

            vm.changeRequestApprove = function (customization) {
                abp.message.confirm(
                    app.localize('ApproveRequestMessage', customization.reqNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customizationService.approveChangeRequest({
                                customizationId: customization.id
                            }).success(function () {
                                vm.getCustomizations();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            });
                        }
                    }
                );
            };

            vm.setPaymentReceivedCustomization = function (customization) {
                //abp.message.confirm(
                //    app.localize('SetPaymentReceivedMessage', request.requestNo),
                //    function (isConfirmed) {
                //        if (isConfirmed) {
                //            customizationService.setPaymentReceivedCustomization({
                //                id: request.id
                //            }).success(function () {
                //                vm.getCustomizations();
                //                abp.notify.success(app.localize('SuccessfullySaved'));
                //            });
                //        }
                //    }
                //);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/financeApprovedModal.cshtml',
                    controller: 'host.views.customization.financeApprovedModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        customization: function () {
                            return customization;
                        }
                    }

                });
                modalInstance.result.then(function () {
                    vm.getCustomizations();
                });
            }

            vm.setInProgressCustomization = function (request) {
                abp.message.confirm(
                    app.localize('SetInProgressMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customizationService.setInProgressCustomization({
                                id: request.id
                            }).success(function () {
                                vm.getCustomizations();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            }

            vm.customizationApprove = function (request) {
                abp.message.confirm(
                    app.localize('ApproveRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customizationService.approveCustomization({
                                id: request.id
                            }).success(function () {
                                vm.getCustomizations();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.getCustomizations = function () {
                vm.loading = true;
                var selectedStatuses = [];
                if (vm.project != null) {
                    vm.filters.projectId = vm.project.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                customizationService.getCustomizations(vm.filters).success(function (data) {
                    vm.customizations = data.items;
                    getHours();
                }).finally(function () {
                    vm.loading = false;
                });
            };


            function openCreateHostCustomizationModal(id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/createModal.cshtml',
                    controller: 'host.views.customization.createModal as vm',
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



            vm.createCustomization = function () {

                openCreateHostCustomizationModal(null);
            };

            // CHANGE REQUEST WORK START

            vm.createChangeRequest = function () {
                openCreateOrUpdateHostChangeRequestModal(null);
            };

            vm.UpdateChangeRequest = function (id) {
                openCreateOrUpdateHostChangeRequestModal(id);
            };

            vm.updateChangeRequestStatus = function (request) {
                openUpdateHostChangeRequestStatusModal(request);
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
            function openCreateOrUpdateHostChangeRequestModal(id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/createOrUpdateChangeRequestModal.cshtml',
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
                        },
                        isGapFromScope: function () {
                            return false;
                        },
                        gapTaskFromScope: function () {
                            return null;
                        },
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCustomizations();
                });
            }

            function openUpdateHostChangeRequestStatusModal(request) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/changeRequestStatusModal.cshtml',
                    controller: 'host.views.customization.changeRequestStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        changeRequest: function () {
                            return request;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCustomizations();
                });
            }

            vm.print = function (changeRequestId) {

                $uibModal.open({
                    templateUrl: '~/App/host/views/customization/ChangeRequestPrintTemplate.cshtml',
                    controller: 'host.views.customization.ChangeRequestPrintTemplate as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return changeRequestId;
                        }
                    }
                });
            };
            //scope of work print
            vm.scopePrint = function (changeRequestId) {

                $uibModal.open({
                    templateUrl: '~/App/host/views/customization/ScopeOfWorkPrintTemplate.cshtml',
                    controller: 'host.views.customization.ChangeRequestPrintTemplate as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return changeRequestId;
                        }
                    }
                });
            };

            // CHANGE REQUEST WORK END


            getHours = function () {
                vm.estimatedHours = 0.0;
                vm.actualHours = 0.0;
                if (!vm.customizations) return;
                vm.customizations.forEach(function (customization) {
                    vm.estimatedHours = vm.estimatedHours + customization.estimatedHours;
                    vm.actualHours = vm.actualHours + customization.actualHours;
                });


            }
            vm.getbusinessDivisions();
            vm.getCustomizations();
            getStatuses();
        }
    ]);
