// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:423403-423949
appModule.controller('tenant.views.externalVehiclesControlPanel.fleet.vehicleTypes.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.externalTariffGroup', 'tariffGroupId', 'FileUploader', 'utilities', 'abp.services.app.safetyCheckTemplate',
        'abp.services.app.checkList', 'uiGridConstants', '$uibModal', 'isViewModal',
        function ($scope, $uibModalInstance, externalTariffGroupService, tariffGroupId, fileUploader, utilities, safetyCheckTemplateService, checkListService,
            uiGridConstants, $uibModal, isViewModal) {

            var vm = this;
            vm.activeTabIndex = 1;
            vm.isViewModal = isViewModal;
            vm.isMCCEnabled = abp.features.isEnabled("MCC");
            vm.vmiGenericInspectionEnabled = abp.features.isEnabled("VMIGeneric.Inspections");
            vm.isScsEnabled = abp.features.isEnabled("SCS");
            vm.isWebBookingPluginEnabled = abp.features.isEnabled("CRS.Bookings.WebBookingPlugIn");
            vm.isVehicleTypeWiseChecklistEnabled = abp.features.isEnabled("Core.VehicleTypeWiseChecklist");
            vm.notNoneGatway = true; //abp.features.getValue("CRS.Payment.Gateway") != "0";
            vm.isEnableWebBookingPlugIn = abp.features.isEnabled("CRS.Bookings.WebBookingPlugIn");

            vm.saving = false;
            vm.tariffGroup = null;
            vm.isEditMod = false;
            vm.AcrissCategoryTypes = [];
            vm.AcrissTypes = [];
            vm.AcrissTransDriveTypes = [];
            vm.AcrissFuelAcTypes = [];
            vm.documentImages = [];
            vm.documentImagesDocs = {
                imageDocs: [],
                gallaryImages: []
            };
            var acrissFuelAcTypes = null;
            vm.uploadedFileName = null;
            vm.isLeftHandDriving = utilities.parseBoolean(abp.setting.get("App.General.IsLeftHandDriving"));
            vm.showOnlyFewerDetailForvehicleType = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ShowOnlyFewerDetailForVehicleType'));
            vm.carDefaultInteriorImage = 'car_interior.jpg';
            if (vm.isLeftHandDriving)
                vm.carDefaultInteriorImage = 'car_interior_lefthand.jpg';
            vm.displayImage =
            {
                documentType: '',
                name: '',
                url: ''
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.uploader = new fileUploader({
                url: '', //initiazlie url later once tariff group object is retrieved
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|jpg|jpeg|png|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
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
                vm.loading = true;

                if (response.success) {

                    vm.uploadedFileName = response.result.fileName;
                    vm.uploadedFileUrl = response.result.url;

                    externalTariffGroupService.getImageForShow({ url: vm.uploadedFileUrl }).success(function (data) {
                        vm.displayImageWithToken = data;
                        vm.loading = false;
                    });

                } else {
                    abp.message.error(response.error.message);
                }

            };



            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }


            vm.openUploadDocumentModel = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadDocumentModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                identityDocument: null
                            };
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = result.name;
                    imageDetail.name = result.name;
                    imageDetail.url = result.url;
                    imageDetail.guid = result.guid;
                    imageDetail.ImageURL = result.url;
                    imageDetail.ImagePath = result.name;

                    var nameParts = result.name.split('_');
                    var baseName = nameParts[0];
                    var extension = result.name.substring(result.name.lastIndexOf('.') + 1);
                    imageDetail.displayName = baseName + ' (' + extension + ')';

                    vm.tariffGroup.documentImages.push(imageDetail);

                    if (vm.documentImagesDocs.gallaryImages === undefined)
                        vm.documentImagesDocs.gallaryImages = [];

                    if (vm.documentImagesDocs.imageDocs === undefined)
                        vm.documentImagesDocs.imageDocs = [];

                    if (vm.isDocument(imageDetail)) {
                        vm.documentImagesDocs.imageDocs.push(imageDetail);
                    }
                    else {
                        vm.documentImagesDocs.gallaryImages.push(imageDetail);
                    }
                });
            };

            vm.removeImage = function (fileToRemove) {
                vm.tariffGroup.documentImages = vm.tariffGroup.documentImages.filter(function (file) {
                    return file.name !== fileToRemove.name;
                });
                vm.documentImagesDocs.gallaryImages = vm.documentImagesDocs.gallaryImages.filter(function (file) {
                    return file !== fileToRemove;
                });
            };

            vm.isDocument = function (i) {
                let isimg = i && i.name && (i.name.toLowerCase().endsWith('.png') ||
                    i.name.toLowerCase().endsWith('.jpeg') ||
                    i.name.toLowerCase().endsWith('.jpg')) ||
                    i.name.toLowerCase().endsWith('.jfif');
                return !isimg;
            };

            vm.isDocumentSepr = function (i) {
                if (i && i.name) {
                    if (i.name.toLowerCase().endsWith('.png') ||
                        i.name.toLowerCase().endsWith('.jpeg') ||
                        i.name.toLowerCase().endsWith('.jpg') ||
                        i.name.toLowerCase().endsWith('.jfif')) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };


            vm.safetyCheckTemplates = [];
            function getTemplates() {
                vm.loading = true;
                safetyCheckTemplateService.searchTemplates().success(function (data) {
                    vm.safetyCheckTemplates = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.save = function () {


                vm.saving = true;
                // Uploading Image Portion Start 

                if ((!angular.isUndefined(vm.uploadedFileUrl) && vm.uploadedFileUrl != null) && (!angular.isUndefined(vm.uploadedFileName) && vm.uploadedFileName != null)) {
                    vm.displayImage.documentType = 5;
                    vm.displayImage.name = vm.uploadedFileName;

                    vm.displayImage.url = vm.uploadedFileUrl;

                    vm.tariffGroup.displayImage = vm.displayImage;
                }

                //End

                if (!vm.tariffGroup.exteriorDiagramName) {
                    vm.tariffGroup.exteriorDiagramName = null;
                }
                if (!vm.tariffGroup.interiorDiagramName) {
                    vm.tariffGroup.interiorDiagramName = null;
                }

                vm.tariffGroup.checklist = null;
                if (!tariffGroupId) {
                    vm.tariffGroup.checklist = vm.gridOptions.data;
                }

                externalTariffGroupService.createOrUpdateTariffGroup({
                    tariffGroup: vm.tariffGroup
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            function getAcrissCategoryTypes() {
                vm.loading = true;
                externalTariffGroupService.getAcrissCategoryTypes({}).success(function (data) {
                    angular.forEach(data.items,
                        function (item) {
                            var acrissCategoryType = new Object();
                            acrissCategoryType.id = item.id;
                            acrissCategoryType.name = item.name + " (" + item.code + ")";
                            acrissCategoryType.code = item.code;
                            vm.AcrissCategoryTypes.push(acrissCategoryType);
                        });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getAcrissTypes() {

                vm.loading = true;
                externalTariffGroupService.getAcrissTypes({}).success(function (data) {
                    angular.forEach(data.items,
                        function (item) {
                            var acrissType = new Object();
                            acrissType.id = item.id;
                            acrissType.name = item.name + " (" + item.code + ")";
                            acrissType.code = item.code;
                            vm.AcrissTypes.push(acrissType);
                        });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getInteriorDiagrams() {
                vm.interiorDiagrams = utilities.getInteriorDiagrams();
            }

            function getExteriorDiagrams() {
                vm.exteriorDiagrams = utilities.getExteriorDiagrams();
            }

            function getAcrissTransDriveTypes() {
                vm.loading = true;
                externalTariffGroupService.getAcrissTransDriveTypes({}).success(function (data) {
                    angular.forEach(data.items,
                        function (item) {
                            var acrissTransDriveType = new Object();
                            acrissTransDriveType.id = item.id;
                            acrissTransDriveType.name = item.name + " (" + item.code + ")";
                            acrissTransDriveType.code = item.code;
                            vm.AcrissTransDriveTypes.push(acrissTransDriveType);
                        });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getAcrissFuelAcTypes() {
                vm.loading = true;
                externalTariffGroupService.getAcrissFuelAcTypes({}).success(function (data) {
                    angular.forEach(data.items,
                        function (item) {
                            var acrissFuelAcType = new Object();
                            acrissFuelAcType.id = item.id;
                            acrissFuelAcType.name = item.name + " (" + item.code + ")";
                            acrissFuelAcType.code = item.code;
                            vm.AcrissFuelAcTypes.push(acrissFuelAcType);
                        });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getAccrissCode = function () {
                var selectedAcrissCategoryTypeCode = "";
                if (vm.tariffGroup.acrissCategoryId != null) {
                    selectedAcrissCategoryTypeCode = vm.AcrissCategoryTypes.filter(function (obj) {
                        return obj.id === vm.tariffGroup.acrissCategoryId;
                    })[0].code;
                }


                var selectedAcrissTypeCode = "";
                if (vm.tariffGroup.acrissTypeId != null) {
                    selectedAcrissTypeCode = vm.AcrissTypes.filter(function (obj) {
                        return obj.id === vm.tariffGroup.acrissTypeId;
                    })[0].code;
                }


                var selectedAcrissTransDriveTypeCode = "";
                if (vm.tariffGroup.acrissTransDriveId != null) {
                    selectedAcrissTransDriveTypeCode = vm.AcrissTransDriveTypes.filter(function (obj) {
                        return obj.id === vm.tariffGroup.acrissTransDriveId;
                    })[0].code;
                }


                var selectedAcrissFuelAcTypeCode = "";
                if (vm.tariffGroup.acrissFuelAcId != null) {
                    selectedAcrissFuelAcTypeCode = vm.AcrissFuelAcTypes.filter(function (obj) {
                        return obj.id === vm.tariffGroup.acrissFuelAcId;
                    })[0].code;
                }

                vm.tariffGroup.accrissCode = selectedAcrissCategoryTypeCode + selectedAcrissTypeCode + selectedAcrissTransDriveTypeCode + selectedAcrissFuelAcTypeCode;
            }


            function init() {
                getAcrissCategoryTypes();
                getAcrissTypes();
                getAcrissFuelAcTypes();
                getAcrissTransDriveTypes();

                externalTariffGroupService.getTariffGroupForEdit({
                    id: tariffGroupId
                }).success(function (result) {
                    vm.tariffGroup = result;
                    //vm.uploader.url = abp.appPath + 'Document/UploadImage/' + vm.tariffGroup.displayImage.guid + '.jpg';
                    vm.uploader.url = abp.appPath + 'Document/UploadImageWithoutGuid/';

                    if (vm.tariffGroup.id > 0) {
                        vm.isEditMod = true;

                        if (vm.tariffGroup.displayImage.url != null || vm.tariffGroup.displayImage.url != '') {
                            externalTariffGroupService.getImageForShow({ url: vm.tariffGroup.displayImage.url }).success(function (data) {
                                vm.displayImageWithToken = data;
                            });
                        }

                        vm.documentImages = [];
                        for (var i = 0; i < vm.tariffGroup.documentImages.length; i++) {
                            var img = vm.tariffGroup.documentImages[i];

                            var imageDetail = imageGalleryObject();
                            imageDetail.thumb = img.imageURL;
                            imageDetail.img = img.imageURL;
                            imageDetail.description = img.description;
                            imageDetail.url = img.url;
                            imageDetail.name = img.name;
                            imageDetail.guid = img.guid;
                            imageDetail.ImageURL = img.url;
                            imageDetail.ImagePath = img.name;

                            var nameParts = imageDetail.name.split('_');
                            var baseName = nameParts[0];
                            var extension = imageDetail.name.substring(imageDetail.name.lastIndexOf('.') + 1);
                            imageDetail.displayName = baseName + ' (' + extension + ')';

                            if (vm.isDocumentSepr(imageDetail))
                                vm.documentImagesDocs.imageDocs.push(imageDetail);
                            else {
                                vm.documentImagesDocs.gallaryImages.push(imageDetail);
                                //vm.documentImages.push(imageDetail);
                            }
                            vm.documentImages.push(imageDetail);
                        }

                    } else {
                        vm.tariffGroup.acrissCategoryId = null;
                        vm.isEditMod = false;
                    }
                });

            }


            // Code For Uploading  Documents //

            //vm.save2 = function ()
            //{
            //    
            //    if (!vm.uploadedFileName) {
            //        return;
            //    }

            //    movementService.addDocument({
            //        movementId: movementId,
            //        document: {
            //            documentType: 5,    // 5 = supporting documents
            //            guid: '',
            //            name: vm.uploadedFileName,
            //            url: vm.uploadedFileUrl
            //        }
            //    }).success(function () {
            //        $uibModalInstance.close();
            //    });
            //};


            //////// Vehicle Type wise checklist

            vm.checklistPermissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Checklist.Addnew') || abp.auth.hasPermission('Pages.Tenant.VMIWorkshop.Checklist.Addnew') || abp.auth.hasPermission('Pages.Tenant.VMIGeneric.Checklist.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Checklist.Edit') || abp.auth.hasPermission('Pages.Tenant.VMIWorkshop.Checklist.Edit') || abp.auth.hasPermission('Pages.Tenant.VMIGeneric.Checklist.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Checklist.Delete') || abp.auth.hasPermission('Pages.Tenant.VMIWorkshop.Checklist.Delete') || abp.auth.hasPermission('Pages.Tenant.VMIGeneric.Checklist.Delete')
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 100,
                        visible: !vm.isViewModal,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button ng-if="row.entity.id > 0 /*&& grid.appScope.checklistPermissions.edit*/" class="btn btn-xs btn-default"  aria-haspopup="true" ng-click="grid.appScope.editChecklistItem(row.entity)" ><i class="fa fa-edit"></i></button>' +
                            '    <button /*ng-if="grid.appScope.checklistPermissions.delete"*/ class="btn btn-xs btn-danger"  aria-haspopup="true" ng-click="grid.appScope.deleteChecklistItem(row.entity)" ><i class="fa fa-trash"></i></button>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ChecklistItemName'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Order'),
                        field: 'srNo'
                    }
                ],
                data: []
            };

            vm.getChecklist = function () {
                vm.loading = true;
                externalTariffGroupService.getVehicleTypeWiseCheckList({ vehicleTypeId: tariffGroupId }).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditChecklistItemModal(checklistId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/vehicleTypes/checklist/createOrEditModal.cshtml',
                    controller: 'tenant.views.vehicle.vehicleTypes.checklist.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        checklistId: function () {
                            return checklistId;
                        },
                        vehicleTypeId: function () {
                            return tariffGroupId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (tariffGroupId) {
                        vm.getChecklist();
                    }
                    else {
                        vm.gridOptions.data.push(result);
                    }
                });
            }

            vm.createChecklistItem = function () {
                openCreateOrEditChecklistItemModal(null);
            };

            vm.editChecklistItem = function (checklistItem) {
                openCreateOrEditChecklistItemModal(checklistItem.id);
            };

            vm.deleteChecklistItem = function (checklistItem) {
                if (tariffGroupId) {
                    abp.message.confirm(
                        app.localize('ChecklistItemDeleteWarningMessage', checklistItem.name),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                externalTariffGroupService.deleteCheckList({
                                    id: checklistItem.id
                                }).success(function () {
                                    vm.getChecklist();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                }
                else {
                    var index = vm.gridOptions.data.indexOf(checklistItem);
                    vm.gridOptions.data.splice(index, 1);
                }
            };

            vm.setActiveTabIndex = function (index) {
                vm.activeTabIndex = index;
            };

            if (vm.isVehicleTypeWiseChecklistEnabled == true) {
                vm.getChecklist();
            }

            ////////////////////////////////////


            //if (vm.isScsEnabled) {
            //    getTemplates();
            //}
            init();
            getInteriorDiagrams();
            getExteriorDiagrams();
        }
    ]);
