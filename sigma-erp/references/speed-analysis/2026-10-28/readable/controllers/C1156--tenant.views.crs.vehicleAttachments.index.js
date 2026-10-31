// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:305587-305845
appModule.controller('tenant.views.crs.vehicleAttachments.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicleAttachment', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.user','abp.services.app.vehicle',
        function ($scope, $uibModal, uiGridConstants, attachmentService, appSession, commonLookupService, userService, vehicleService) {

            var vm = this;
            vm.isAllBranchUser = appSession.user.branchAccess == 3;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                locationId: appSession.user.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Vehicles.Attachments.View'),
                create: abp.auth.hasPermission('Pages.Tenant.Vehicles.Attachments.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vehicles.Attachments.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vehicles.Attachments.Delete'),
            };


            vm.getBrandInfo = function (model, modelYear) {
                return model.name + ' ' + model.make + ' ' + modelYear;
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                enableSorting: false,
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAttachment(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editAttachment(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteAttachment(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Title'),
                        field: 'customField1',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customField1}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AttachmentNo'),
                        field: 'plateNo',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span>{{row.entity.plateNo}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Brand'),
                        field: 'model.make.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getBrandInfo(row.entity.model,row.entity.modelYear)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Supplier'),
                        field: 'supplier',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.supplier.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ParentVehicle'),
                        field: 'parentVehicle',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.parentVehicle.plateNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'location.name'
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

                        vm.getAttachments();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getAttachments();
                    });
                },
                data: []
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                attachmentService.exportToExcelTenant(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getAttachments = function () {
                vm.loading = true;
                attachmentService.getVehicleAttachments(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditAttachmentModal(attachmentId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicleAttachments/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vehicleAttachments.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        attachmentId: function () {
                            return attachmentId;
                        },
                        //isFromSearchScreen: function () {
                        //    return false;
                        //}
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getAttachments();
                });
            }

            function openViewModal(attachmentId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicleAttachments/viewModal.cshtml',
                    controller: 'tenant.views.crs.vehicleAttachments.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        attachmentId: function () {
                            return attachmentId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getAttachments();
                });
            }
            
            vm.createAttachment = function () {
                openCreateOrEditAttachmentModal(null);
            };

            vm.editAttachment = function (attachment) {
                openCreateOrEditAttachmentModal(attachment.id);
            };
            vm.viewAttachment = function (attachment) {
                openViewModal(attachment.id);
            };

            vm.deleteAttachment = function (attachment) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            attachmentService.deleteVehicleAttachment({
                                id: attachment.id
                            }).success(function () {
                                vm.getAttachments();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                }).error(function (data) {
                                    if (data) {
                                        setTimeout(() => abp.message.info(data.message), 300);
                                    }

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


            vm.searchVehicles = function ($select) {
                if ($select.search === "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.clearVehicle = function () {
                vm.filters.parentVehicle = null;
                vm.filters.parentVehicleId = null;
            };

            function init() {
                getLocationsActiveAndInActive();
                vm.getAttachments();
            }
            init();
        }
    ]);
