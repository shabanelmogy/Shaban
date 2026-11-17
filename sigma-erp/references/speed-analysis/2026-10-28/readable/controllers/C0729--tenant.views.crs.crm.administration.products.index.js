// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:188709-189070
appModule.controller('tenant.views.crs.crm.administration.products.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.cRMProduct', 'utilities', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, productService, utilities, directoryService, appSession, commonLookupService, userService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.tempData = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.isAllBranchUser = appSession.user.branchAccess == 3;

            vm.isAddCardEnabled = abp.features.isEnabled('OnlinePayments.Customer.AddCard');
            vm.statuses = null;
            vm.companyCustomerCustomField4 = utilities.parseBoolean(abp.setting.get("App.General.CompanyCustomerCustomField4"));
            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                customField4: '',
                status: null,
                locationId: appSession.user.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("Completed") },
                    { id: 2, name: app.localize("Active") },
                    { id: 3, name: app.localize("Inactive") }

                ];

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
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };

            vm.getModuleName = function (module) {
                if (!module && module !== 0) // Check for null/undefined but allow 0
                    return '';

                switch (module) {
                    case 0:
                        return '';
                    case 1:
                        return 'Rental';
                    case 2:
                        return 'Lease';
                    case 3:
                        return 'Limousine';
                    case 4:
                        return 'Transportation';
                    case 5:
                        return 'Chauffeur';
                    case 6:
                        return 'Workshop';
                    case 7:
                        return 'Equipment';
                    case 8:
                        return 'Accessories';
                    case 9:
                        return 'Sales';
                    default:
                        return '';
                }
            };

            vm.getAgreementTypeName = function (type) {
                if (!type && type !== 0) // Check for null/undefined but allow 0
                    return '';

                switch (type) {
                    case 0:
                        return '';
                    case 1:
                        return 'Daily';
                    case 2:
                        return 'Weekly';
                    case 3:
                        return 'Monthly';
                    case 4:
                        return 'Lease';
                    case 5:
                        return 'Lease To Own';
                    case 6:
                        return 'Hourly';
                    default:
                        return '';
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
                            '      <li><a  ng-if="(grid.appScope.permissions.edit) && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editProduct(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deleteProduct(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        //field: 'code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Code'),
                        field: 'code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Active'),
                        field: 'isActive',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-show="row.entity.isActive" class="label label-success">' + app.localize('Yes') + '</span>' +
                            '  <span ng-show="!row.entity.isActive" class="label label-default">' + app.localize('No') + '</span>' +
                            '</div>',
                        minWidth: 80
                    },
                    {
                        name: app.localize('Category'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getModuleName(row.entity.productCategory)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('AgreementType'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getAgreementTypeName(row.entity.agreementType)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Detail'),
                        field: 'detail',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.detail}}</div>' +
                            '</div>',
                        minWidth: 250
                    },
                    {
                        name: app.localize('CreatedOn'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDate(row.entity.creationTime)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('UpdatedOn'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDate(row.entity.lastModificationTime)}}</div>' +
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

                        vm.getProducts();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getProducts();
                    });
                },
                data: []
            };

            vm.getProducts = function () {
                vm.loading = true;
                productService.getCRMProducts(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.exportToExcel = function () {
                //vm.loading = true;
                //productService.exportToExcelTenant(vm.filters).success(function (result) {
                //    app.downloadTempFile(result);
                //}).finally(function () {
                //    vm.loading = false;
                //});
            };


            vm.getDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD / MM / YYYY  HH: mm: ss');
                }
                else {
                    return "";
                }
            };


            vm.createProduct = function () {
                openCreateOrEditProduct(null);
            };
            vm.editProduct = function (productId) {
                openCreateOrEditProduct(productId);
            };




            openCreateOrEditProduct = function (productId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/administration/products/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.crm.administration.products.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        productId: function () {
                            return productId;
                        },
                        options: function () {
                            return {
                                projectId: null
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getProducts();
                });
            }
            vm.leadQualification = function () {
                openLeadQualification(null);
            };




            openLeadQualification = function (leadId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/marketing/leads/leadQualification.cshtml',
                    controller: 'tenant.views.crs.crm.marketing.leads.leadQualification as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        inquiryId: function () {
                            return leadId;
                        },
                        options: function () {
                            return {
                                projectId: null
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    //vm.getPropertyInquiries();
                });
            }

            vm.deleteProduct = function (product) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            productService.deleteCRMProduct(product.id).success(function () {
                                vm.getProducts();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
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
                vm.getProducts();
                vm.gridOptions.totalItems = vm.tempData.length;
                vm.gridOptions.data = vm.tempData;
            }
            init();

        }
    ]);
