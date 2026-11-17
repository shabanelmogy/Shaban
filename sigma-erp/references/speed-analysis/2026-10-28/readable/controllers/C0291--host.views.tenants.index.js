// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:82983-83514
appModule.controller('host.views.tenants.index', [
        '$scope', '$stateParams', '$uibModal', 'uiGridConstants', 'abp.services.app.tenant', 'abp.services.app.commonLookup', 'lookupModal', 'abp.services.app.country', 'abp.services.app.businessDivision',
        function ($scope, $stateParams, $uibModal, uiGridConstants, tenantService, commonLookupService, lookupModal, countryService, businessDivisionService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.allowDateRange = false;
            var baseUrl = window.location.origin;
            vm.isLocalhost =
                window.location.hostname === 'localhost';
            // vm.filterText = $stateParams.filterText || null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.searchCountries = function (filter) {
                var country = {
                    name: ''
                };
                country.name = filter;
                if (country.name === '')
                    country.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(country).then(function (response) {
                    vm.countries = response.data.items;
                });

            };
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.filters = {
                name: "",
                tenancyName: null,
                editionId: null,
                tenantType: 3,
                CreationTime: null,
                isActive: 1,
                restrictedTenants: abp.auth.hasPermission('Pages.Tenants.CanLoginRestrictedTenants'),
                country: null,
                // externalyHosted: false,
                hostingType: 0,
            };
            vm.tenantTypes = [

                { type: "Trial", id: 1 },
                { type: "Test", id: 2 },
                { type: "Production", id: 3 },
                { type: "Crn", id: 4 },
                { type: "Support", id: 5 }

            ];
            vm.hostingTypes = [
                { id: 1, type: "Speed Cloud" },
                { id: 2, type: "External Cloud" },

            ];

            vm.tenantIsActive = [
                { type: "No", id: 0 },
                { type: "Yes", id: 1 }
            ];

            vm.tenantSignupSources = [
                { type: "Unknown", id: 0 },
                { type: "Web App", id: 1 },
                { type: "Mobile App", id: 2 },
                { type: "Manual", id: 3 },
                { type: "Android", id: 4 },
                { type: "IOS", id: 5 }
            ];

            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenants.Create'),
                edit: abp.auth.hasPermission('Pages.Tenants.Edit'),
                changeFeatures: abp.auth.hasPermission('Pages.Tenants.ChangeFeatures'),
                impersonation: abp.auth.hasPermission('Pages.Tenants.Impersonation'),
                impersonationExternal: abp.auth.hasPermission('Pages.Tenants.Impersonation.External'),
                'delete': abp.auth.hasPermission('Pages.Tenants.Delete'),
                create: abp.auth.hasPermission('Pages.Tenants.Create'),
                canLoginRestrictedTenants: abp.auth.hasPermission('Pages.Tenants.CanLoginRestrictedTenants'),
                canUpdateSubscription: abp.auth.hasPermission('Pages.Tenants.Subscription.Update'),
                multipleSubscriptions: abp.auth.hasPermission('Pages.Tenants.Subscriptions'),
                canViewSubscription: abp.auth.hasPermission('Pages.Tenants.Subscription.View'),
                subscriptionReport: abp.auth.hasPermission('Pages.Tenants.Subscription.Report')
            };

            var requestParams = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };

            vm.getTenantType = function (tenantType) {

                var type = "";
                if (tenantType == 1) {
                    type = "Trial";

                }
                else if (tenantType == 2) {
                    type = "Test";

                }
                else if (tenantType == 3) {
                    type = "Production";

                }
                else if (tenantType == 4) {
                    type = "Crn";
                }
                else if (tenantType == 5) {
                    type = "Support";
                }

                return app.localize(type);
            };

            vm.getSignupSource = function (signupSource) {
                if (signupSource === 0)
                    return "Unknown";
                else if (signupSource === 1)
                    return "WebApp";
                else if (signupSource === 2)
                    return "MobileApp";
                else if (signupSource === 3)
                    return "Manual";
                else if (signupSource === 4)
                    return "Android";
                else if (signupSource === 5)
                    return "IOS";
            };

            vm.tenantGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                enableColumnResizing: true,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                useExternalSorting: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 80,
                        enableColumnResizing: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' +  ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.isLocalhost && grid.appScope.permissions.impersonation && row.entity.app.hosting!=2 && (!row.entity.app || (row.entity.app && row.entity.app.url == \'' + baseUrl + '\'))" ng-click="grid.appScope.impersonate(row.entity)">' + app.localize('LoginAsThisTenant') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isLocalhost && grid.appScope.permissions.impersonation && row.entity.app && row.entity.app.url != \'' + baseUrl + '\'" ng-click="grid.appScope.impersonateExternal(row.entity)">' + app.localize('LoginAsThisTenant') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editTenant(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.changeFeatures && row.entity.app.hosting!=2" ng-click="grid.appScope.editFeatures(row.entity)">' + app.localize('Features') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.canUpdateSubscription && (row.entity.tenantType == 3 || row.entity.tenantType == 5)" ng-click="grid.appScope.subscriptions(row.entity)">' + app.localize('Subscription') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.multipleSubscriptions" ng-click="grid.appScope.multipleSubscriptions(row.entity)">' + app.localize('Subscriptions') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.canViewSubscription && (row.entity.tenantType == 3 || row.entity.tenantType == 5)" ng-click="grid.appScope.viewSubscriptions(row.entity)">' + app.localize('ViewSubscription') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.changeFeatures" ng-click="grid.appScope.stripeSubscriptions(row.entity)">Stripe ' + app.localize('Subscriptions') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.changeFeatures && row.entity.contactId" ng-click="grid.appScope.contactLog(row.entity.contactId)">' + app.localize('Log') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteTenant(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.app.hosting!=2" ng-click="grid.appScope.cloneTenant(row.entity)">' + app.localize('CloneTenant') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TenancyName'),
                        field: 'tenancyName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <i ng-show="row.entity.connectionString" title="' + app.localize('HasOwnDatabase') +
                            '" class="fa fa-database"></i> {{row.entity.tenancyName}} ' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('App'),
                        field: 'app.name',
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                            '  {{row.entity.app.name}} ' +
                            '  <span ng-if="row.entity.app.hosting == 2" class="label label-danger">EXT</span>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Edition'),
                        width: 95,
                        field: 'editionDisplayName'
                    },
                    {
                        name: app.localize('Country'),
                        field: 'contact.address.country'
                    },
                    {
                        name: app.localize('Type'),
                        field: 'tenantType',
                        width: 85,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getTenantType(row.entity.tenantType)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SignupSource'),
                        field: 'signupSource',
                        width: 80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getSignupSource(row.entity.signupSource)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Active'),
                        field: 'isActive',
                        width: 75,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-show="row.entity.isActive" class="label label-success">' + app.localize('Yes') + '</span>' +
                            '  <span ng-show="!row.entity.isActive" class="label label-default">' + app.localize('No') + '</span>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Date'),
                        field: 'creationTime',
                        width: 90,
                        cellFilter: 'momentFormat: \'L\''
                    }
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            requestParams.sorting = null;
                        } else {
                            requestParams.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getTenants();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        requestParams.skipCount = (pageNumber - 1) * pageSize;
                        requestParams.maxResultCount = pageSize;

                        vm.getTenants();
                    });
                },
                data: []
            };

            //if (!vm.permissions.edit && !vm.permissions.delete) {
            //    vm.tenantGridOptions.columnDefs.shift();
            //}

            vm.getEditionsForCombobox = function () {
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                    vm.editions.unshift({ value: "0", displayText: app.localize('NotAssigned') });
                });
            };

            vm.clearCountry = function () {
                vm.filters.countryObj = null;
                vm.filters.country = null;
            };

            vm.getTenants = function () {
                vm.loading = true;
                //tenantService.getTenants({
                //    skipCount: requestParams.skipCount,
                //    maxResultCount: requestParams.maxResultCount,
                //    sorting: requestParams.sorting,
                //    filter: vm.filterText
                //}).success(function (data) {
                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                if (!(vm.filters.isActive >= 0))
                    vm.filters.isActive = null;
                if (!vm.filters.tenantType > 0)
                    vm.filters.tenantType = null;
                if (!vm.filters.hostingType > 0)
                    vm.filters.hostingType = null;

                tenantService.getTenants(
                    {
                        skipCount: requestParams.skipCount,
                        maxResultCount: requestParams.maxResultCount,
                        sorting: requestParams.sorting,
                        fromDate: vm.filters.fromDate,
                        toDate: vm.filters.toDate,
                        tenancyName: vm.filters.tenancyName,
                        name: vm.filters.name,
                        EditionId: vm.filters.editionId,
                        isActive: vm.filters.isActive,
                        //externalyHosted: vm.filters.externalyHosted,
                        tenantType: vm.filters.tenantType,
                        hostingType: vm.filters.hostingType,
                        signupSource: vm.filters.signupSource,
                        country: vm.filters.country,
                        businessDivisionId: vm.filters.businessDivisionId
                    }).success(function (data) {
                        vm.tenantGridOptions.totalItems = data.totalCount;
                        vm.tenantGridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.impersonate = function (tenant) {
                lookupModal.open({
                    title: app.localize('SelectAUser'),
                    serviceMethod: commonLookupService.findUsers,
                    extraFilters: {
                        tenantId: tenant.id
                    },
                    callback: function (selectedItem) {
                        abp.ajax({
                            url: abp.appPath + 'Account/Impersonate',
                            data: JSON.stringify({
                                tenantId: tenant.id,
                                userId: selectedItem.value
                            })
                        });
                    }
                });
            };

            vm.impersonateExternal = function (tenant) {
                vm.loading = true;
                tenantService.generateTokenForExternalImpersonate({
                    id: tenant.id
                }).success(function (data) {
                    debugger;
                    var url = data.appUrl + "/Account/ExernalImpersonate"
                        + "?token=" + encodeURIComponent(data.token);
                    window.open(url, '_blank');
                }).finally(function () {
                    vm.loading = false;
                });

            };


            vm.editTenant = function (tenant) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/tenants/editModal.cshtml',
                    controller: 'host.views.tenants.editModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenantId: function () {
                            return tenant.id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTenants();
                });
            };

            vm.contactLog = function (contactId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/companies/contactLog.cshtml',
                    controller: 'host.views.companies.contactLog as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        contactId: function () {
                            return contactId;
                        }
                    }
                });


            };

            vm.cloneTenant = function (tenant) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/cloneTenantModal.cshtml',
                    controller: 'host.views.tenants.cloneTenantModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenant: function () {
                            return tenant;
                        }
                    }
                });
            };

            vm.createTenant = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/tenants/createModal.cshtml',
                    controller: 'host.views.tenants.createModal as vm',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (result) {
                    vm.getTenants();
                });
            };

            vm.deleteTenant = function (tenant) {
                abp.message.confirm(
                    app.localize('TenantDeleteWarningMessage', tenant.tenancyName),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            tenantService.deleteTenant({
                                id: tenant.id
                            }).success(function () {
                                vm.getTenants();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.editFeatures = function (tenant) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/featuresModal.cshtml',
                    controller: 'host.views.tenants.featuresModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenant: function () {
                            return tenant;
                        }
                    }
                });
            };

            vm.stripeSubscriptions = function (tenant) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/subscriptionStripeModal.cshtml',
                    controller: 'host.views.tenants.subscriptionStripeModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tenant: function () {
                            return tenant;
                        }
                    }
                });
            };

            vm.subscriptions = function (tenant) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/subscriptionModal.cshtml',
                    controller: 'host.views.tenants.subscriptionModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tenant: function () {
                            return tenant;
                        }
                    }
                });
            };
            vm.multipleSubscriptions = function (tenant) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/multipleSubscriptionModal.cshtml',
                    controller: 'host.views.tenants.multipleSubscriptionModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        tenant: function () {
                            return tenant;
                        }
                    }
                });
            };

            vm.viewSubscriptions = function (tenant) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/subscriptionViewModal.cshtml',
                    controller: 'host.views.tenants.subscriptionModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tenant: function () {
                            return tenant;
                        }
                    }
                });
            };

            vm.openSubscriptionReportModal = function () {
                $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/subscriptionReportModal.cshtml',
                    controller: 'host.views.tenants.subscriptionReportModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });
            }
            vm.getbusinessDivisions();
            vm.getEditionsForCombobox();
            vm.getTenants();

        }]);
