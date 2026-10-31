// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:184832-185013
appModule.controller('tenant.views.crs.contacts.searchContactOptionModal',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.tariffGroup', 'uiGridConstants', 'options', 'utilities',
            function ($scope, $uibModal, $uibModalInstance, directoryService, tariffGroupService, uiGridConstants, options, utilities) {

            var vm = this;
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.filters = {
                keyword: '',
                contactType: options.type,
                activeOnly: true,
                isOnlyCorporate: options.isOnlyCorporate,
                isAdditionalDriverSearch: options.isAdditionalDriverSearch,
                companyId: options.companyId,
                contactCategory: options.category,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.searchContacts = function () {
                vm.loading = true;
                return directoryService.searchDirectoryPaged(vm.filters)
                    .then(function (response) {
                        vm.gridOptions.totalItems = response.data.totalCount;
                        vm.gridOptions.data = response.data.items;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });               
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Contacts.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Contacts.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Contacts.Delete')
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
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue"  aria-haspopup="true" ng-click="grid.appScope.contactSelected(row.entity)" ><i class="fa fa-check"></i></button>' +
                            '    <button  ng-if="row.entity.contactType ==2 && row.entity.contactCategory == 1" class="btn btn-xs btn-default"  aria-haspopup="true" ng-click="grid.appScope.contactEdit(row.entity)" ><i class="fa fa-edit"></i></button>' +
                            '  </div>' +
                            '</div>'
                    },
                     {
                         name: app.localize('Name'),
                         field: 'name', 
                         width:200,
                         cellTemplate:
                             '<div class=\"ui-grid-cell\">' +
                             '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getNameWithCode(row.entity)}} <span  style="color:red;" ng-show="grid.appScope.isVipCustomer && row.entity.isVip">*</span></div>' +
                             '</div>'
                     },
                       {
                           name: app.localize('MobileNo'),
                           field: 'mobileNo'
                       },

                      {
                          name: app.localize('ContactNo'),
                          field: 'contactNo',
                          cellTemplate:
                             '<div class=\"ui-grid-cell\">' +
                             '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getContactsList(row.entity)}}</div>' +
                             '</div>'
                      }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "id desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.searchContacts();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.searchContacts();
                    });
                },
                data: []
            };

            vm.showAddContact = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return null;
                        },
                        isFromSearchScreen: function () {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    
                    var fullName = result.firstName;
                    if (result.middleName) fullName += ' ' + result.middleName;
                    fullName += ' ' + result.lastName;
                    vm.filters.keyword = fullName;
                    vm.searchContacts();
                });
            };

            vm.contactSelected = function (contact) {
                $uibModalInstance.close(contact);
            };

            vm.contactEdit = function (contact) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return contact.id;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.searchContacts();
                });
            };
            
            vm.getContactsList = function (contact) {
                var contactList = '';
                if (contact != null) {

                    if (contact.contactNo != null)
                        contactList = contact.contactNo;

                    if (contact.contactNo2 != null)
                        contactList = contactList + ', ' + contact.contactNo2;
                    return contactList;
                }
                else {
                    return "";
                }
            };          
            vm.getNameWithCode = function (contact) {
                var namewithcode = '';
                if (contact.code != null)
                    namewithcode = contact.name + '   (' + contact.code + ')';
                else
                    namewithcode = contact.name;

                return namewithcode;
            };

            vm.searchContacts();

        }]);
