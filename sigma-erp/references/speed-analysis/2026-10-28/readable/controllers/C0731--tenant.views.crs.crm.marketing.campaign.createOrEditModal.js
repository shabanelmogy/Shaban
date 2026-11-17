// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:189165-189640
appModule.controller('tenant.views.crs.crm.marketing.campaign.createOrEditModal', ['$uibModal','$timeout','$scope', '$uibModalInstance', 'abp.services.app.directory',
        'campaignId', 'editFlag', 'viewFlag', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.cRMCampaign', 'abp.services.app.user', 'uiGridConstants', 'abp.services.app.person', 'abp.services.app.vehicleModel', 'abp.services.app.country',

        function ($uibModal, $timeout, $scope, $uibModalInstance, directoryService, campaignId, editFlag, viewFlag, commonLookupService, utilities, campaignService, userService, uiGridConstants, personService, vehicleModelService, countryService) {
            var vm = this;

            vm.isLeaseInquiryStagePermission = abp.auth.hasPermission('Pages.Tenant.Lease.Inquiry.Stage');
            vm.referralIsEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseInquiry_CustomField1"));
            vm.isHighLightCountryEnabled = abp.features.isEnabled("CRS.CustomFeatures.HighLightBlackListCountry");
            vm.isEditMode = false;
            vm.campaignId = campaignId || null;
            vm.customers = [];
            vm.models = [];
            vm.filters = {
                name: '',
                makeId: null
            };
            vm.activeTab = 0;
            vm.editFlag = editFlag || false;
            vm.viewFlag = viewFlag || false;
            vm.selectedNationality = null;
            vm.checkHighlighted = false;
            vm.campaign = {
                id: null,
                name: null,
                startDate: null,
                endDate: null,
                status: 1,
                customerType: null,
                cRMMarketingMediaId: null,
                cRMMarketingMedia: null,
                modelId: null,
                model: null,
                tariffGroupId: null,
                tariffGroup: null,
                description: null,
                nationality: null
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
            vm.customerTypes = [
                { name: "Individual", id: 1 },
                { name: "Company", id: 2 }
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

            function inquiryLineObject() {

                var line = new Object();
                line.vehicle = null;
                line.quantity = '';
                line.years = null;
                return line;
            }

            vm.searchProperties = function ($select) {

            };







            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                debugger

                if (vm.campaign.assignedUser) {
                    vm.campaign.assignedUserId = vm.campaign.assignedUser.id;
                }
                if (vm.campaign.cRMMarketingMedia) {
                    vm.campaign.cRMMarketingMediaId = vm.campaign.cRMMarketingMedia.id;
                }
                if (vm.campaign.model) {
                    vm.campaign.modelId = vm.campaign.model.id;
                }
                if (vm.campaign.tariffGroup) {
                    vm.campaign.tariffGroupId = vm.campaign.tariffGroup.id;
                }

                if (vm.selectedNationality !== null) vm.campaign.nationality = vm.selectedNationality.name;

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

            vm.getEnums = function () {

                //Status
                angular.forEach(vm.campaignStatuses, function (obj) {
                    if (!parseInt(vm.campaign.status)) return;
                    if (obj.id == vm.campaign.status) {
                        vm.campaign.status = obj;
                        return;
                    }
                    if (vm.campaignStatuses.indexOf(obj) == vm.campaignStatuses.length - 1)
                        vm.campaign.status = '';
                });
            };
            function getCRMProducts() {
                vm.loading = true;
                campaignService.getProducts({}).success(function (data) {

                    vm.products = data.items;
                    vm.loading = false;
                });
            };
            function getCRMCampaignTypes() {
                vm.loading = true;
                campaignService.getCRMCampaignTypes({}).success(function (data) {

                    vm.campaignTypes = data.items;
                    vm.loading = false;
                });
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            vm.clearSalesPersonUser = function () {
                vm.campaign.assignedUserId = null;
                vm.campaign.assignedUser = null;
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
                        width: 150,
                        cellTemplate: '<div class="ui-grid-cell-contents">' +
                            '  <div class="btn-group" uib-dropdown>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu><li><a ng-click="grid.appScope.removeProspect(row.entity)">Remove</a></li></ul>' +
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
                    console.log('Grid API registered, appScope:', vm); // Debug to confirm scope
                    console.log('removeProspect available:', vm.removeProspect); // Check function
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

            vm.getProspects = function () {
                vm.loading = true;
                console.log('Fetching prospects for campaignId:', vm.campaignId);
                campaignService.getCampaignProspects({ CRMCampaignId: vm.campaignId }).success(function (data) {
                    debugger; // For debugging
                    $timeout(function () {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                        console.log('Grid data set:', vm.gridOptions.data);
                        // Force redraw
                        if ($scope.gridApi) $scope.gridApi.core.handleWindowResize();
                    });
                }).finally(function () {
                    vm.loading = false;
                    console.log('Loading state:', vm.loading);
                });
            };

            vm.removeProspect = function (prospect) {
                if (!prospect || !prospect.id) {
                    console.error('Invalid prospect:', prospect);
                    return;
                }
                vm.loading = true;
                console.log('Removing prospect with id:', prospect.id, 'for campaignId:', vm.campaignId);
                campaignService.removeProspectFromCampaign({
                    CRMCampaignId: vm.campaignId, // Ensure this is set
                    prospectId: prospect.id
                }).success(function (data) {
                    console.log('Prospect removed, refreshing grid');
                    abp.notify.info(app.localize('SuccessfullyRemoved'));
                    vm.getProspects();
                }).error(function (error) {
                    console.error('Error removing prospect:', error);
                    abp.notify.error(app.localize('ErrorOccurred'));
                }).finally(function () {
                    vm.loading = false;
                    console.log('Loading state:', vm.loading);
                });
            };

            vm.onAudienceTabSelect = function () {
                if (vm.campaignId && !vm.gridOptions.data.length) {
                    vm.getProspects();
                }
            };

            vm.exportToExcel = function () {
                debugger
                vm.loading = true;
                campaignService.exportToExcelProspects(vm.campaignId).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });

                //campaignService.getProspectsByCampaignId(vm.campaignId).success(function (result) {
                //    app.downloadTempFile(result);
                //}).finally(function () {
                //    vm.loading = false;
                //});
            };
            vm.downloadProspectExcel = function () {
                debugger;
                vm.loading = true;
                personService.exportProspectsByCampaignId(vm.campaignId).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.searchModel = function ($select, makeId) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions
                vm.filters.makeId = makeId;

                vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });

            };

            vm.getTeriffGroups = function () {
                //vm.loading = true;

                commonLookupService.getTariffGroups({ inActive: false }).success(function (data) {
                    vm.tariffGroups = data.items;
                });

            };
            vm.searchCountries = function (filter) {
                if (!vm.isHighLightCountryEnabled) {
                    vm.filters.name = filter;
                    if (vm.filters.name === '')
                        vm.filters.name = "~";  //to avoid default suggestions 

                    return countryService.searchCountries(vm.filters).then(function (response) {
                        vm.countries = response.data.items;
                    });
                }
                else {
                    vm.filters.name = filter;
                    if (vm.filters.name === '') {
                        vm.filters.name = "~";  // to avoid default suggestions 
                    }
                    return countryService.searchCountries(vm.filters).then(function (response) {
                        if (response && response.data && response.data.items) {
                            vm.countries = response.data.items.map(country => ({
                                id: country.id,
                                name: country.name,
                                isHighlighted: false
                            }));
                            vm.countries.forEach(country => {
                                const isBlacklisted = vm.searchCountriesFromSetting.some(e => e.id === country.id);
                                if (isBlacklisted) {
                                    country.isHighlighted = true;
                                } else if (vm.selectedNationality && vm.selectedNationality.id === country.id) {
                                    country.isHighlighted = true;
                                }
                            });
                        }

                    });
                }


            };
            function init() {
                getCRMCampaignTypes();
                getCRMProducts();
                vm.getTeriffGroups();
                if (vm.campaignId) {
                    vm.loading = true;

                    campaignService.getCRMCampaignForEdit(vm.campaignId).success(function (data) {
                        var mediaId = data.crmMarketingMediaId;
                        vm.isEditMode = true;
                        vm.campaign = data;
                        //vm.getEnums();
                        if (!vm.gridOptions.data) {
                            vm.gridOptions.data = [];
                        }
                        vm.getProspects();
                        $timeout(function () {
                            vm.campaign.cRMMarketingMediaId = mediaId;
                        });
                        vm.campaign.cRMProductId = vm.campaign.crmProductId


                        if (vm.campaign.nationality !== null) {
                            if (!vm.isHighLightCountryEnabled) {
                                vm.selectedNationality = { name: vm.campaign.nationality };
                            }
                            else {
                                const isNationalHighlighted = vm.searchCountriesFromSetting.some(country => country.name === result.nationality);
                                vm.selectedNationality = {
                                    name: vm.campaign.nationality,
                                    isHighlighted: isNationalHighlighted
                                };
                                vm.checkHighlighted = vm.selectedNationality.isHighlighted;
                            }
                        }

                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    //vm.lead.status = vm.inquiryStatuses[0];
                }
            }


            init();


        }]);
