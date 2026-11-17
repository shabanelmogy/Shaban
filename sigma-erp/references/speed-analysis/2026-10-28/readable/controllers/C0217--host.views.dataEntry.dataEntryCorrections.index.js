// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:70759-70973
appModule.controller('host.views.dataEntry.dataEntryCorrections.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.dataEntryCorrectionHost', 'abp.services.app.tenant', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, dataEntryCorrectionService, tenantAppService, userService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            
            vm.loading = false;
            vm.users = [];

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
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

            var projectId = $scope.projectParams ? $scope.projectParams.projectId : null;
            vm.isOpenFromProjectDashboard = $scope.projectParams ? $scope.projectParams.isOpenFromProjectDashboard : null;

            vm.filters = {
                status: 1,
                tenantId: null,
                assignedToUserId: null,
                assignedToUser: null,
                startDate: null,
                endDate: null,
                enableDateRange: false,
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                unAssigned: false,
                slaTypesArray:
                    [
                        { id: 2, name: 'Post Go-Live' },
                        { id: 3, name: 'Live' }
                    ],
                slaTypes: [2, 3],
                projectId: projectId
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

            function editDataEntryCorrectionModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/dataEntry/dataEntryCorrections/editModal.cshtml',
                    controller: 'host.views.dataEntry.dataEntryCorrections.editModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        dataEntryId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDataEntryCorrection();
                });
            }

            vm.openDataEntryLogModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/dataEntry/dataEntryCorrections/createOrShowDataEntryLogsModal.cshtml',
                    controller: 'host.views.dataEntry.dataEntryCorrections.createOrShowEntryLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        dataEntry: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDataEntryCorrection();
                });
            }

            vm.editDataEntryCorrection = function (dataEntry) {
                editDataEntryCorrectionModal(dataEntry.id);
            };
            
            vm.statusChanged = function () {
                if (vm.filters.status == 1)
                    vm.filters.enableDateRange = false;
                else
                    vm.filters.enableDateRange = true;
            };
            
            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };
            
            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
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

            vm.dataEntryCorrectionClose = function (request) {
                abp.message.confirm(
                    app.localize('CloseRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            dataEntryCorrectionService.closeDataEntryCorrection({
                                id: request.id
                            }).success(function () {
                                vm.getDataEntryCorrection();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };

            vm.getDataEntryCorrection = function () {
                
                vm.loading = true; 
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //if (vm.filters.tenant) vm.filters.tenantId = vm.filters.tenant.id.id;
                dataEntryCorrectionService.getDataEntryCorrections(vm.filters).success(function (data) {
                    vm.dataEntries = data.items;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getDataEntryCorrection();
            getStatuses();
        }
    ]);
