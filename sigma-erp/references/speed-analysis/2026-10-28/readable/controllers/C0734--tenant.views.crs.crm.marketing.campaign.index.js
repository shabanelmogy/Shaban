// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:189943-190389
appModule.controller('tenant.views.crs.crm.marketing.campaign.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.cRMCampaign', 'utilities', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, campaignService, utilities, directoryService, appSession, commonLookupService, userService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.isAllBranchUser = appSession.user.branchAccess == 3;

            vm.isAddCardEnabled = abp.features.isEnabled('OnlinePayments.Customer.AddCard');
            vm.statuses = null;
            vm.campaignCustomerCustomField4 = utilities.parseBoolean(abp.setting.get("App.General.CampaignCustomerCustomField4"));
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.filters = {
                code: '',
                name: '',
                customField4: '',
                status: null,
                assignedUserId: null,
                startDateFrom: null,
                startDateTo: null,
                enableDateRange: false,
                locationId: appSession.user.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.users = [];
            vm.assignedUser = null;
            vm.dateRangeModel = {
                startDate: null,
                endDate: null
            };
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("Planned") },
                    { id: 2, name: app.localize("Active") },
                    { id: 3, name: app.localize("Paused") },
                    { id: 4, name: app.localize("Completed") },
                    { id: 5, name: app.localize("Cancelled") }

                ];

            };
           
            vm.getCampaignStatus = function (status) {


                if (status === 1) {
                    return 'Planned';
                }
                else if (status === 2) {
                    return 'Active';
                }
                else if (status === 3) {
                    return 'Paused';
                }
                else if (status === 4) {
                    return 'Completed';
                }
                else if (status === 5) {
                    return 'Cancelled';
                }
                else {
                    return '';
                }
            };
            vm.features = {
                rental: abp.features.isEnabled('CRS.Rental'),
                lease: abp.features.isEnabled('CRS.Lease'),
                chauffeur: abp.features.isEnabled('CRS.Chauffeur'),
            };
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Campaigns'),
                create: abp.auth.hasPermission('Pages.Tenant.Campaigns.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Campaigns.Edit'),
                limitedEdit: abp.auth.hasPermission('Pages.Tenant.Campaigns.LimitedEdit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Campaigns.Delete'),
                'export': abp.auth.hasPermission('Pages.Tenant.Campaigns.Export'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers'),
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a /*ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)"*/ ng-click="grid.appScope.viewCampaign(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a /*ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)"*/ ng-click="grid.appScope.editCampaign(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  /*ng-if="(grid.appScope.permissions.edit || grid.appScope.permissions.limitedEdit) && grid.appScope.locationPermission(row.entity)"*/ ng-click="grid.appScope.detailCampaign(row.entity)">' + app.localize('Detail') + '</a></li>' +
                            '      <li><a  /*ng-if="(grid.appScope.permissions.edit || grid.appScope.permissions.limitedEdit) && grid.appScope.locationPermission(row.entity)"*/ ng-click="grid.appScope.campaignLogs(row.entity)">' + app.localize('Logs') + '</a></li>' +
                            '      <li><a /*ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)"*/ ng-click="grid.appScope.deleteCampaign(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CampaignName'),
                        //field: 'code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        field: 'campaignName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.type}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        //field: 'contactNo'
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getCampaignStatus(row.entity.status)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('StartDate'),
                        //field: 'domain'
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('EndDate'),
                        //field: 'email'
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AssignedTo'),
                        field: 'customField4',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.assignedUser}}</div>' +
                            '</div>'


                    },
                    {
                        name: app.localize('Product'),
                        field: 'customField4',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.product.name}}</div>' +
                            '</div>'


                    },
                    {
                        name: app.localize('Leads'),
                        field: 'leads',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.leads || 0}}</div>' +
                            '</div>'


                    },
                    {
                        name: app.localize('Conversions'),
                        field: 'conversions',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.conversions || 0}}</div>' +
                            '</div>'


                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getCampaigns();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getCampaigns();
                    });
                },
                data: []
            };

            vm.getCampaigns = function () {
                vm.loading = true;
                // Prepare filters for API
                var filters = {
                    code: vm.filters.code || '',
                    status: vm.filters.status,
                    assignedUserId: vm.filters.assignedUserId,
                    startDateFrom: vm.filters.enableDateRange && vm.filters.startDateFrom ? moment(vm.filters.startDateFrom).utc().format() : null,
                    startDateTo: vm.filters.enableDateRange && vm.filters.startDateTo ? moment(vm.filters.startDateTo).endOf('day').utc().format() : null,
                    skipCount: vm.filters.skipCount,
                    maxResultCount: vm.filters.maxResultCount,
                    sorting: vm.filters.sorting
                };
                campaignService.getCRMCampaigns(filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                campaignService.exportToExcelTenant(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };





            function openCreateOrEditCampaignModal(campaignId, editFlag, viewFlag) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/marketing/campaign/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.crm.marketing.campaign.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        campaignId: function () {
                            return campaignId;
                        },
                        editFlag: function () {
                            return editFlag;
                        },
                        viewFlag: function () {
                            return viewFlag;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCampaigns();
                });
            }
            function openCampaignDetailModal(campaignId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/marketing/campaign/detailModal.cshtml',
                    controller: 'tenant.views.crs.crm.marketing.campaign.detailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        campaignId: function () {
                            return campaignId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCampaigns();
                });
            }
            function openCampaignViewModal(campaignId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/campaign/viewModel.cshtml',
                    controller: 'tenant.views.crs.campaign.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        campaignId: function () {
                            return campaignId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCampaigns();
                });
            }


            vm.viewAgreementsHistoryModal = function (person) {
                openViewAgreementsHistoryModal(person.id);
            };

            vm.createCampaign = function () {
                openCreateOrEditCampaignModal(null, false, false);
            };

            vm.editCampaign = function (campaign) {
                openCreateOrEditCampaignModal(campaign.id, true, false);
            };
            vm.detailCampaign = function (campaign) {
                openCreateOrEditCampaignModal(campaign.id, false, false);
            };
            vm.campaignLogs = function (campaign) {
                debugger
                vm.openCRMCampaignLogsModal(campaign);
            };
            vm.viewCampaign = function (campaign) {
                openCreateOrEditCampaignModal(campaign.id, false, true);
            };
            //vm.detailCampaign = function (campaign) {
            //    openCampaignDetailModal(campaign.id);
            //};

            vm.deleteCampaign = function (campaign) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            campaignService.deleteCampaign({
                                id: campaign.id
                            }).success(function () {
                                vm.getCampaigns();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };



            vm.openCRMCampaignLogsModal = function (campaign) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/marketing/campaign/cRMCampaignLogsModal.cshtml',
                    controller: 'tenant.views.crs.crm.marketing.campaign.cRMCampaignLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        id: function () {
                            return campaign.id;
                        },
                        name: function () {
                            return campaign.name;
                        }
                    }
                });
            };





            // Search users for Assigned To filter
            vm.searchUsers = function ($select) {
                if (!$select || !$select.search) {
                    return;
                }
                var keyword = $select.search;
                if (keyword.length < 1) {
                    vm.users = [];
                    return;
                }
                userService.searchUsers({ keyword: keyword }).then(function (response) {
                    vm.users = response.data.items || [];
                });
            };

            // On assigned user change
            vm.onAssignedUserChange = function () {
                if (vm.filters.assignedUser && vm.filters.assignedUser.id) {
                    vm.filters.assignedUserId = vm.filters.assignedUser.id;
                } else {
                    vm.filters.assignedUserId = null;
                }
            };

            // Clear assigned user
            vm.clearAssignedUser = function () {
                vm.filters.assignedUser = null;
                vm.filters.assignedUserId = null;
            };

            // Date range model changed
            vm.dateRangeModelChanged = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDateFrom = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : null;
                    vm.filters.startDateTo = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : null;
                }
            };

            // Date range check
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDateFrom = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.startDateTo = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                } else {
                    vm.filters.startDateFrom = null;
                    vm.filters.startDateTo = null;
                }
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            function init() {
                //getLocationsActiveAndInActive();
                getStatuses();
                vm.getCampaigns();
                //vm.gridOptions.totalItems = vm.tempData.length;
                //vm.gridOptions.data = vm.tempData;
            }
            init();

        }
    ]);
