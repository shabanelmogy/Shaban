// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:184211-184630
appModule.controller('tenant.views.crs.contacts.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.person', 'appSession','utilities', 'abp.services.app.commonLookup', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, personService, appSession, utilities, commonLookupService, userService) {

            var vm = this;
            vm.individualCustomerCustomField4 = utilities.parseBoolean(abp.setting.get("App.General.IndividualCustomerCustomField4"));
            vm.documentReaderEnabled = abp.features.isEnabled("Core.DocumentReader");
            vm.isAllBranchUser = appSession.user.branchAccess == 3;
            vm.allBranchPermission = abp.auth.hasPermission('Pages.Tenant.Customers.ViewOtherBranchCustomers');
            vm.isExportCCDetailsEnabled = abp.features.isEnabled("CRS.CustomFeatures.ExportToExcelCreditCardsDetail")
            if (vm.documentReaderEnabled) {
                vm.hasRequiredTenantId = abp.session.tenantId === 950 || abp.session.tenantId === 290 || location.hostname === 'localhost'; //Regency || crs demo, ABC Rac

                if (vm.hasRequiredTenantId) {
                    var srcElement = document.createElement('script');
                    srcElement.src = 'https://localhost:44334/signalR/hubs';
                    document.body.appendChild(srcElement);
                }

            }
            vm.showCreationDate = utilities.parseBoolean(abp.setting.get("App.General.ShowCreationDateForIndividualCustomer"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isAddCardEnabled = abp.features.isEnabled('OnlinePayments.Customer.AddCard');
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.statuses = null;
            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                status: null,
                customField4: '',
                locationId: appSession.user.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.features = {
                rental: abp.features.isEnabled('CRS.Rental'),
                lease: abp.features.isEnabled('CRS.Lease'),
                chauffeur: abp.features.isEnabled('CRS.Chauffeur'),
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Contacts'),
                create: abp.auth.hasPermission('Pages.Tenant.Contacts.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Contacts.Edit'),
                limitedEdit: abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit'),
                editContactCards: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Contacts.Delete'),
                'export': abp.auth.hasPermission('Pages.Tenant.Contacts.Export'),
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
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("ActiveAgreements") },
                    { id: 2, name: app.localize("InActiveAgreement") }
                ];
                
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
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.viewPerson(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="(grid.appScope.permissions.edit || grid.appScope.permissions.limitedEdit || grid.appScope.permissions.editContactCards) && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editPerson(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.features.rental || grid.appScope.features.lease || grid.appScope.features.chauffeur" ng-click="grid.appScope.viewAgreementsHistoryModal(row.entity)">' + app.localize('ViewAgreementsHistory') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deletePerson(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isAddCardEnabled && !row.entity.hasCard" ng-click="grid.appScope.addCard(row.entity)">' + app.localize('AddCard') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editContactGroup(row.entity)">' + app.localize('EditContactGroup') + '</a></li>' +
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
                    },
                    {
                        name: app.localize('IndividualCustomerCustomField4'),
                        field: 'customField4',
                        visible: vm.individualCustomerCustomField4


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

            vm.getContactsList = function (contact) {

                var contactList = '';
                if (contact != null) {

                    if (contact.contactNo != null && contact.contactNo != '') {
                        contactList = contact.contactNo;

                        if (contact.contactNo2 != null && contact.contactNo2 != '')
                            contactList = contactList + ', ' + contact.contactNo2;
                    }

                    if (contact.contactNo == null) {
                        if (contact.contactNo2 != null && contact.contactNo2 != '')
                            contactList = contact.contactNo2;
                    }

                    return contactList;
                }
                else {
                    return "";
                }
            };

            vm.addCard = (entity) => {
                debugger;
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
                                customerName: entity.name,
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

            vm.exportToExcel = function () {
                vm.loading = true;
                personService.exportToExcelTenant(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportToExcelCreditCards = function () {
                vm.loading = true;
                personService.exportToExcelCreditCards(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getPerson = function () {
                vm.loading = true;
                // personService.getPerson({ filter: vm.filterText }).success(function (data) {
                personService.getPerson(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditPersonModal(personId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return personId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getPerson();
                });
            }
            function openEditContactGroupModal(personId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/editContactGroupModal.cshtml',
                    controller: 'tenant.views.crs.contacts.editContactGroupModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return personId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getPerson();
                });
            }

            function openViewModal(personId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/viewModel.cshtml',
                    controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return personId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getPerson();
                });
            }

            function openViewAgreementsHistoryModal(ContactId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/viewAgreementsHistoryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.viewAgreementsHistoryModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        ContactId: ContactId,
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

            vm.createPerson = function () {
                openCreateOrEditPersonModal(null);
            };

            vm.editPerson = function (person) {
                openCreateOrEditPersonModal(person.id);
            };
            vm.editContactGroup = function (person) {
                openEditContactGroupModal(person.id);
            };
            vm.viewPerson = function (person) {
                openViewModal(person.id);
            };

            vm.deletePerson = function (person) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            personService.deletePerson({
                                id: person.id
                            }).success(function () {
                                vm.getPerson();
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
                    if (!vm.allBranchPermission) {
                        if (appSession.user.branchAccess == 2)
                            getSelectiveBranches();
                        else if (appSession.user.branchAccess == 1) {
                            vm.filters.locationId = appSession.user.locationId;
                            vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                        }
                    }
                    
                });
            }

            function init() {
                getLocationsActiveAndInActive();
                getStatuses();
                vm.getPerson();
            }
            init();
        }
    ]);
