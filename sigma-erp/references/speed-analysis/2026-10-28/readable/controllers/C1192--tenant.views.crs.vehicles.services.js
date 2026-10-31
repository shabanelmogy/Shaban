// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:314014-314451
appModule.controller('tenant.views.crs.vehicles.services', [
        '$scope', '$uibModal', 'abp.services.app.vehicleModel', 'abp.services.app.vehicleService', 'uiGridConstants', 'abp.services.app.make','FileUploader',
        function ($scope, $uibModal, vehicleModelService, vehicleServiceService, uiGridConstants, makeService, fileUploader) {
            var vm = this;
            vm.loading = false;
            vm.activeTabIndex = 1;

            vm.filters = {
                name: '',
                makeId: null,
                makeName: '',
            };

            vm.setActiveTabIndex = function (index) {
                vm.activeTabIndex = index;
            };

            //for Make selection
            vm.searchMake = function ($select) {
                vm.filters.makeName = $select.search;
                if (vm.filters.makeName == '')
                    vm.filters.makeName = "~";  //to avoid default suggestions 

                makeService.searchPreUsedMakes({ name: vm.filters.makeName }).then(function (response) {
                    vm.makes = response.data.items;
                });
            };

            //for Model selection
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchPreUsedVehicleModels(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            //clone default services for selected model
            vm.copyDefaultServices = function () {
                vm.loading = true;
                vehicleServiceService.copyDefaultServices({ id: vm.make.id })
                .success(function (result) {
                    
                    vm.makeGridOptions.data = result.items;
                })
                .finally(function () {
                    vm.loading = false;
                });
            };

            vm.copyDefaultOrMakeServices = function () {
                vm.loading = true;
                vehicleServiceService.copyDefaultOrMakeServices({ vehicleModel: vm.model })
                .success(function (result) {
                    vm.modelGridOptions.data = result.items;
                })
                .finally(function () {
                    vm.loading = false;
                });
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Services.Addnew'),
                view: abp.auth.hasPermission('Pages.Tenant.Services.View'),
                edit: abp.auth.hasPermission('Pages.Tenant.Services.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Services.Delete')
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewService(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editService(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteService(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('DueToKms'),
                        field: 'dueOnKMs'
                    },
                    {
                        name: app.localize('OrMonths'),
                        field: 'dueOnMonths'
                    }

                ],
                data: []
            };

            vm.modelGridOptions = {
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewService(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editModelService(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteModelService(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('DueToKms'),
                        field: 'dueOnKMs'
                    },
                    {
                        name: app.localize('OrMonths'),
                        field: 'dueOnMonths'
                    }

                ],
                data: []
            };

            vm.makeGridOptions = {
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewService(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editMakeService(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteMakeService(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('DueToKms'),
                        field: 'dueOnKMs'
                    },
                    {
                        name: app.localize('OrMonths'),
                        field: 'dueOnMonths'
                    }

                ],
                data: []
            };

            function openCreateOrEditServicesModal(id, makeId, modelId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/createOrEditServicesModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.createOrEditServicesModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleServiceId: function () {
                            return id;
                        },
                        makeId: function () {
                            return makeId;
                        },
                        modelId: function () {
                            return modelId;
                        },
                    }
                });

                modalInstance.result.then(function (result) {
                    if (makeId)
                        vm.getVehicleServicesByMake();
                    else if (modelId)
                        vm.getVehicleServicesByModel();
                    else
                        getVehicleServices();
                });
            }

            vm.createService = function () {
                
                openCreateOrEditServicesModal(null, null);
            };

            vm.createModelService = function (makeId, modelId) {
                
                openCreateOrEditServicesModal(null, makeId, modelId);
            };

            vm.editService = function (service) {
                openCreateOrEditServicesModal(service.id, null);
            };

            vm.editModelService = function (service) {
                openCreateOrEditServicesModal(service.id, null, vm.model.id);
            };

            vm.editMakeService = function (service) {
                openCreateOrEditServicesModal(service.id, vm.make.id, null);
            };

            vm.deleteService = function (service) {
                abp.message.confirm(
                   app.localize('DeleteWarningMessage', service.name),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           vehicleServiceService.deleteVehicleService({
                               id: service.id
                           }).success(function () {
                               getVehicleServices();
                               abp.notify.success(app.localize('SuccessfullyDeleted'));
                           });
                       }
                   }
               );
            };

            vm.deleteModelService = function (service) {
                abp.message.confirm(
                   app.localize('DeleteWarningMessage', service.name),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           vehicleServiceService.deleteVehicleService({
                               id: service.id
                           }).success(function () {
                               vm.getVehicleServicesByModel();
                               abp.notify.success(app.localize('SuccessfullyDeleted'));
                           });
                       }
                   }
               );
            };

            vm.deleteMakeService = function (service) {
                abp.message.confirm(
                   app.localize('DeleteWarningMessage', service.name),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           vehicleServiceService.deleteVehicleService({
                               id: service.id
                           }).success(function () {
                               vm.getVehicleServicesByMake();
                               abp.notify.success(app.localize('SuccessfullyDeleted'));
                           });
                       }
                   }
               );
            };

            vm.viewService = function (service) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/viewServicesModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.viewServicesModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleServiceId: function () {
                            return service.id;
                        }
                    }
                });
            };
            

            vm.openCopyServicesModal = function (makeId, modelId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/copyServicesModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.copyServicesModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                makeId: makeId,
                                modelId: modelId
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    if (modelId)
                        vm.getVehicleServicesByModel();
                    else if (makeId)
                        vm.getVehicleServicesByMake();
                    else 
                        getVehicleServices();
                });
            };

            function getVehicleServices() {
                vm.loading = true;
                vehicleServiceService.getVehicleServices()
                .success(function (result) {
                    vm.gridOptions.data = result.items;
                })
                .finally(function () {
                    vm.loading = false;
                });
            }

            vm.getVehicleServicesByModel = function () {
                vm.loading = true;
                vehicleServiceService.getVehicleServicesByModel({ id: vm.model.id })
                    .success(function (result) {
                        vm.modelGridOptions.data = result.items;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getVehicleServicesByMake = function () {
                vm.loading = true;
                vehicleServiceService.getVehicleServicesByMake({ id: vm.make.id })
                    .success(function (result) {
                        vm.makeGridOptions.data = result.items;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            function init() {
                getVehicleServices();
            }

            init();

            // Import Services Code
            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    openImportServiceModel(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            function openImportServiceModel(fileName) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/importServiceModel.cshtml',
                    controller: 'tenant.views.crs.vehicles.importServiceModel as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    // initSupplierOpeningBalance();
                    vm.importing = false;
                });
            }
        }
    ]);
