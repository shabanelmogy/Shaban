// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:72082-72488
appModule.controller('host.views.hr.staffRequests.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.staffRequest', 'abp.services.app.user', 'abp.services.app.hostSettings','appSession',
        function ($scope, $uibModal, uiGridConstants, staffRequestService, userService, hostSettingsService,appSession) {
            var vm = this;
            vm.belongToTier = false;
            vm.canEscalateToNextTier = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            
            vm.loading = false;
            vm.users = [];
            vm.settings;
            
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.dateDifferenceInDays = function (replyDate) {
                //moment.utc(date).toDate()
                var now = moment.utc(new Date()); //todays date
                var end = moment.utc(replyDate); // another date
                var duration = moment.duration(now.diff(end));
                var days = duration.asDays();
                return days;
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

            vm.filters = {
                status: 1,
                requestedById: null,
                requestedBy: null,
                type: null,
                tier: null,
                assignedToId: null,
                fromDate: null,
                toDate: null,
                unAssigned: false,
                enableDateRange: false,
                assignedToUser: null,
                requestNo:''
            };

            function editSupportRequestModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/hr/staffRequests/editModal.cshtml',
                    controller: 'host.views.hr.staffRequests.editModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        staffRequestId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            }

          

            vm.createStaffRequest = function () {
                openCreateOrEditStaffRequestModal(null);
            };

            vm.editSupportRequest = function (supportRequest) {
                editSupportRequestModal(supportRequest.id);
            };
            
            
            vm.getType = function (id) {
                if (id == 1)
                    return "Hardware";
                else if (id == 2)
                    return "Admin";
                else if (id == 3)
                    return "Hr";
                else if (id == 4)
                    return "Other";
                else if (id == 5)
                    return "Suggestion";
                
                
                else return '';
            };
            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };
            vm.openRequestLogModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/hr/staffRequests/createOrShowRequestLogsModal.cshtml',
                    controller: 'host.views.hr.staffRequests.createOrShowRequestLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        staffRequest: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            }

            function openCreateOrEditSupportRequestModal(id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/hr/staffRequests/createModal.cshtml',
                    controller: 'host.views.hr.staffRequests.createModal as vm',
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
                    templateUrl: '~/App/host/views/hr/staffRequests/escalateModal.cshtml',
                    controller: 'host.views.hr.staffRequests.escalateModal as vm',
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
            vm.supportRequestsByTier = function (tierId) {
                if (!vm.supportRequests) return 0;
                return vm.supportRequests.filter(x => x.tier === tierId).length;
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
                    templateUrl: '~/App/host/views/hr/staffRequests/closeModal.cshtml',
                    controller: 'host.views.hr.staffRequests.closeModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        staffRequestId: function () {
                            return request.id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
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
            vm.getStaffRequestUsersByTier = function (tier) {

                let r = vm.settings.userManagement.staffRequestTierUsers.filter(x => x.tier === tier);
                if (r.length > 0) return r[0];
                else return { tier: tier, userIds: [] };
            };
            vm.searchUser = function (keyword) {
                var tier1UserIds = vm.getStaffRequestUsersByTier(1).userIds;
                var tier2UserIds = vm.getStaffRequestUsersByTier(2).userIds;
                var tier3UserIds = vm.getStaffRequestUsersByTier(3).userIds;
                var id = appSession.user.id;
                if (tier1UserIds.includes(id)) {
                    vm.belongToTier = true;
                    vm.canEscalateToNextTier = true;
                }
                else if (tier2UserIds.includes(id)) {
                    vm.belongToTier = true;
                    vm.canEscalateToNextTier = true;
                }
                else if (tier3UserIds.includes(id)) {
                    vm.belongToTier = true;
                    vm.canEscalateToNextTier = true;
                }
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


                staffRequestService.getStaffRequests(
                    vm.filters
                ).success(function (result) {
                    vm.supportRequests = result;
                    
                    vm.loading = false;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.loading = true;
                hostSettingsService.getTierUsers()
                    .success(function (result) {
                        vm.settings = result;
                        vm.searchUser();

                        if (vm.belongToTier) {
                            vm.filters = {
                                status: 1,
                                requestedById: null,
                                requestedBy: null,
                                type: null,
                                tier: null,
                                assignedToId: null,
                                fromDate: null,
                                toDate: null,
                                unAssigned: false,
                                enableDateRange: false,
                                assignedToUser: null,
                                requestNo:''
                            };
                        }
                        else {
                            vm.filters = {
                                status: 1,
                                requestedById: appSession.user.id,
                                requestedBy: appSession.user,
                                type: null,
                                tier: null,
                                assignedToId: null,
                                fromDate: null,
                                toDate: null,
                                unAssigned: false,
                                enableDateRange: false,
                                assignedToUser: null,
                                requestNo:''
                            };
                        }


                        staffRequestService.getStaffRequests(
                            vm.filters
                        ).success(function (result) {
                            vm.supportRequests = result;

                            vm.loading = false;

                        }).finally(function () {
                            vm.loading = false;
                        });

                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
            getStatuses();
        }
    ]);
