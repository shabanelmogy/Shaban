// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:181528-181946
appModule.controller('tenant.views.crs.companies.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.company', 'utilities', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, companyService, utilities, directoryService, appSession, commonLookupService, userService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.isAllBranchUser = appSession.user.branchAccess == 3;

            vm.isAddCardEnabled = abp.features.isEnabled('OnlinePayments.Customer.AddCard');
            vm.statuses = null;
            vm.companyCustomerCustomField4 = utilities.parseBoolean(abp.setting.get("App.General.CompanyCustomerCustomField4"));
            vm.loading = false;
            vm.isExportCCDetailsEnabled = abp.features.isEnabled("CRS.CustomFeatures.ExportToExcelCreditCardsDetail")
            vm.filters = {
                code: '',
                name: '',
                customField4: '',
                status: null,
                locationId: appSession.user.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.showCreationDate = utilities.parseBoolean(abp.setting.get("App.General.ShowCreationDateForCompanyCustomer"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("ActiveAgreements") },
                    { id: 2, name: app.localize("InActiveAgreement") }
                ];

            };
            vm.openCustomLookups = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/customLookups/index.cshtml',
                    controller: 'tenant.views.customLookups.index as vm',
                    backdrop: 'static'
                    //resolve: {
                    //    companyId: function () {
                    //        return companyId;
                    //    }
                    //}
                });

                modalInstance.result.then(function (result) {
                    vm.getCompanies();
                });
            };

            vm.features = {
                rental: abp.features.isEnabled('CRS.Rental'),
                lease: abp.features.isEnabled('CRS.Lease'),
                chauffeur: abp.features.isEnabled('CRS.Chauffeur'),
            };
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Companies'),
                create: abp.auth.hasPermission('Pages.Tenant.Companies.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Companies.Edit'),
                limitedEdit: abp.auth.hasPermission('Pages.Tenant.Companies.LimitedEdit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Companies.Delete'),
                'export': abp.auth.hasPermission('Pages.Tenant.Companies.Export'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers'),
                exportCCDetails: abp.auth.hasPermission('Pages.Tenant.ExportToExcelCreditCards'),

            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
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
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.viewCompany(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-if="(grid.appScope.permissions.edit || grid.appScope.permissions.limitedEdit) && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editCompany(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.features.rental || grid.appScope.features.lease || grid.appScope.features.chauffeur" ng-click="grid.appScope.viewAgreementsHistoryModal(row.entity)">' + app.localize('ViewAgreementsHistory') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deleteCompany(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isAddCardEnabled && !row.entity.hasCard" ng-click="grid.appScope.addCard(row.entity)">' + app.localize('AddCard') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editContactGroup(row.entity)">' + app.localize('EditContactGroup') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Code'),
                        //field: 'code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CompanyName'),
                        field: 'companyName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isAddCardEnabled && row.entity.hasCard" class="label label-warning">CC</span><span>{{row.entity.companyName}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ContactNo'),
                        //field: 'contactNo'
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.contactNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Website'),
                        //field: 'domain'
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.domain}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Email'),
                        //field: 'email'
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isBlackListed: row.entity.isBlackListed}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.email}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CompanyCustomerCustomField4'),
                        field: 'customField4',
                        visible: vm.companyCustomerCustomField4


                    },
                    {
                        name: 'CreationDate',
                        field: 'creationTime',
                        visible: vm.showCreationDate,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.creationTime)}}</div>' +
                            '</div>'
                    },
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getCompanies();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getCompanies();
                    });
                },
                data: []
            };

            vm.getCompanies = function () {
                vm.loading = true;
                companyService.getCompanies(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                companyService.exportToExcelTenant(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openEditContactGroupModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/editContactGroupModal.cshtml',
                    controller: 'tenant.views.crs.companies.editContactGroupModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCompanies();
                });
            }

            vm.exportToExcelCreditCards = function () {
                vm.loading = true;
                companyService.exportToExcelCreditCards(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.addCard = (entity) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/emailLinkToCharge.cshtml',
                    controller: 'tenant.views.common.payments.emailLinkToCharge as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        data: () => {
                            return {
                                source: 'addCard',
                                voucherId: entity.id,
                                voucherNo: entity.voucherNo,
                                customerId: entity.id,
                                customerName: entity.companyName,
                                customerEmail: entity.email,
                                dueAmount: entity.dueAmount,
                                hasCard: entity.hasCard
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                });
            }

            function openCreateOrEditCompanyModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCompanies();
                });
            }
            function openCompanyViewModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/viewModel.cshtml',
                    controller: 'tenant.views.crs.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCompanies();
                });
            }

            function openViewAgreementsHistoryModal(ContactId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/viewAgreementsHistoryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.viewAgreementsHistoryModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        ContactId: function () {
                            return ContactId;
                        },
                        VehicleId: null
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getPerson();
                });
            };

            vm.viewAgreementsHistoryModal = function (person) {
                openViewAgreementsHistoryModal(person.id);
            };

            vm.createCompany = function () {
                openCreateOrEditCompanyModal(null);
            };

            vm.editCompany = function (company) {
                openCreateOrEditCompanyModal(company.id);
            };
            vm.viewCompany = function (company) {
                openCompanyViewModal(company.id);
            };

            vm.deleteCompany = function (company) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            companyService.deleteCompany({
                                id: company.id
                            }).success(function () {
                                vm.getCompanies();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                    vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
                });
            }

            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    if (appSession.user.branchAccess == 2)
                        getSelectiveBranches();
                    else if (appSession.user.branchAccess == 1) {
                        vm.filters.locationId = appSession.user.locationId;
                        vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                    }
                });
            }

            vm.editContactGroup = function (company) {
                openEditContactGroupModal(company.id);
            };

            vm.searchCorporateDrivers = function ($select) {

                //contactType: 6 (corporateDriver)
                return directoryService.search({ keyword: $select.search, contactType: 6, activeOnly: true }).then(function (response) {
                    vm.corporateDrivers = response.data.items;
                });
            };

            vm.searchCorporateDriverPopoup = function () {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 6;
                        }
                    }
                }).result.then(function (driver) {
                    if (driver != null) {
                        vm.filters.corporateDriver = driver;
                        vm.filters.companyId = driver.companyId;
                    }
                });
            };

            vm.clearCorporateDriver = function () {
                vm.filters.corporateDriver = null;
                vm.filters.companyId = null;
            };
            function init() {
                getLocationsActiveAndInActive();
                getStatuses();
                vm.getCompanies();
            }
            init();

        }
    ]);
