// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:189683-189939
appModule.controller('tenant.views.crs.crm.marketing.campaign.detailModal', ['$scope', '$uibModal','$timeout', '$uibModalInstance', 'abp.services.app.directory',
        'campaignId', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.cRMCampaign', 'abp.services.app.user', 'uiGridConstants',

        function ($scope, $uibModal, $timeout, $uibModalInstance, directoryService, campaignId, lookupService, utilities, campaignService, userService, uiGridConstants) {
            var vm = this;

            vm.isLeaseInquiryStagePermission = abp.auth.hasPermission('Pages.Tenant.Lease.Inquiry.Stage');
            vm.referralIsEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseInquiry_CustomField1"));
            vm.isEditMode = false;
            vm.campaignId = campaignId || null;
            vm.customers = [];

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Contacts'),
                create: abp.auth.hasPermission('Pages.Tenant.Contacts.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Contacts.Edit'),
                limitedEdit: abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit'),
                editContactCards: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Contacts.Delete'),
                'export': abp.auth.hasPermission('Pages.Tenant.Contacts.Export'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers'),
            };

            vm.campaign = {
                id: null,
                name: null,
                startDate: null,
                endDate: null,
                status: 1,
                cRMMarketingMediaId: null,
                description: null
            } ;

            vm.campaignStatuses = [
                { type: "Planned", id: 1 },
                { type: "Active", id: 2 },
                { type: "Paused", id: 3 },
                { type: "Completed", id: 4 },
                { type: "Cancelled", id: 5 },
            ];

            vm.properytCategories = [
                { key: 'Residential', value: 1 },
                { key: 'Commercial', value: 2 },
                //{ key: 'Industrial', value: 3 },

            ];
            vm.getlocalizedString = function (leaseInquiryStage) {

                if (leaseInquiryStage == 0)
                    return app.localize('New');

                else if (leaseInquiryStage == 1)
                    return app.localize('Active');

                else if (leaseInquiryStage == 2)
                    return app.localize('Dead');

                else if (leaseInquiryStage == 3)
                    return app.localize('Closed');

                return '';
            };

            vm.searchModelFilters = {
                name: '',
                makeId: null,
            };


            // Initialize with dummy prospects data
            vm.dummyProspects = [
                {
                    id: 1, code: 'P001', firstName: 'John', lastName: 'Doe', nameToShow: 'John Doe',
                    mobileNo: '1234567890', contactNo: '1234567890', email: 'john@example.com'
                },
                {
                    id: 2, code: 'P002', firstName: 'Jane', lastName: 'Smith', nameToShow: 'Jane Smith',
                    mobileNo: '9876543210', contactNo: '9876543210', email: 'jane@example.com'
                },
                {
                    id: 3, code: 'P003', firstName: 'Robert', lastName: 'Johnson', nameToShow: 'Robert Johnson',
                    mobileNo: '5551234567', contactNo: '5551234567', email: 'robert@example.com'
                }
            ];



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
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.viewPerson(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="(grid.appScope.permissions.edit || grid.appScope.permissions.limitedEdit || grid.appScope.permissions.editContactCards) && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editPerson(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('FirstName'),
                    //    field: 'firstName'
                    //},
                    //{
                    //    name: app.localize('LastName'),
                    //    field: 'lastName'
                    //},
                    {
                        name: app.localize('Code'),
                        field: 'code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'firstName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isAddCardEnabled && row.entity.hasCard" class="label label-warning">CC</span><span>{{row.entity.nameToShow}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MobileNo'),
                        //field: 'mobileNo'
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.mobileNo}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('ContactNo'),
                        field: 'contactNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getContactsList(row.entity)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Email'),
                        //field: 'email',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.email}}</div>' +
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

                        vm.getPerson();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getPerson();
                    });
                },
                data: []
            };

            vm.openAddProspectsModal = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/marketing/campaign/addProspectsModal.cshtml',
                    controller: 'tenant.views.crs.crm.marketing.campaign.addProspectsModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        existingProspects: function () {
                            return vm.gridOptions.data || [];
                        },
                        campaignId: function () {
                            return vm.campaignId;
                        }
                    }
                }).result.then(function (selectedProspects) {
                    // Add selected prospects to grid
                    vm.gridOptions.data = vm.gridOptions.data.concat(selectedProspects);
                });
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                debugger

                if (vm.campaign.assignedUser) {
                    vm.campaign.assignedUserId = vm.campaign.assignedUser.id;
                }

                vm.saving = true;
                if (vm.campaignId) {

                    campaignService.editCRMCampaign(
                        vm.campaign
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
                }
                else {
                    campaignService.addCRMCampaign(
                        vm.campaign
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
                }
            };

            vm.getProspects = function () {
                vm.loading = true;
                campaignService.getCampaignProspects({ CRMCampaignId: vm.campaignId }).success(function (data) {
                    debugger
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                vm.getProspects();
            }


            init();


        }]);
