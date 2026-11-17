// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:222225-222486
appModule.controller('tenant.views.crs.fines.createOrEditModal', ['$uibModal', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.trafficFine', 'trafficFineId', 'FileUploader', 'utilities', 'abp.services.app.directory',
    function ($uibModal, $uibModalInstance, vehicleService,
        trafficFineAppService, trafficFineId, fileUploader, utilities, directoryService) {
        var vm = this;
        vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
        vm.isShowCustomerInMissingFines = abp.features.isEnabled('CRS.CustomFeatures.ShowCustomerInMissingFines');
        vm.clearCustomer = function () {
            vm.trafficFine.contact = null;
            vm.trafficFine.contactId = null;
        };
        //  Displaying Image Code
        vm.fineImage =
            {
                documentType: '',
                name: '',
                url: ''
            };
        vm.uploader = new fileUploader({
            url: '', //initiazlie url later once Traffic Fine object is retrieved
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

        vm.searchCustomers = function ($select) {

            //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
            return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: vm.contactCategory, activeOnly: true }).then(function (response) {
                vm.customers = response.data.items;
            });
        };
        vm.searchCustomerPopoup = function () {
            $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                backdrop: 'static',
                resolve: {
                    category: function () {
                        return null;
                    },
                    type: function () {
                        return 2;
                    }
                }
            }).result.then(function (contact) {
                if (contact != null) {
                    vm.trafficFine.contact = contact;
                    vm.trafficFine.contactId = contact.id;
                }
            });
        };

        vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            vm.loading = true;
            if (response.success) {

                vm.uploadedFileName = response.result.fileName;
                vm.uploadedFileUrl = response.result.url;

                trafficFineAppService.getImageForShow({ url: vm.uploadedFileUrl }).success(function (data) {
                    var random = (new Date()).toString();
                    vm.displayImageWithToken = data;
                    console.log(vm.displayImageWithToken.url);
                    //vm.displayImageWithToken.url = vm.displayImageWithToken.url + "?cb=" + random;
                    //vm.displayImageWithToken = data;
                    vm.loading = false;
                });

            } else {
                abp.message.error(response.error.message);
            }

        };

        // Vehicle Search
        vm.searchVehicles = function ($select) {
            if ($select.search == "") { vm.vehicles = null; return null; }
            return vehicleService.searchVehicles({ plateNo: $select.search}).then(function (response) {
                vm.vehicles = response.data.items;
            });
        };

        vm.roundingforView = function (value) {
            var roundedValue = utilities.roundforView(value, 2);
            return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        vm.localize = function (input) {
            if (input == null)
                return "";
            return app.localize(input);
        };
        function openViewModalPerson(personId) {
            
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

        }
        function openViewModalCompany(companyId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/companies/viewModel.cshtml',
                controller: 'tenant.views.crs.companies.createOrEditModal as vm',
                backdrop: 'static',
                resolve: {
                    companyId: function () {
                        return companyId;
                    }
                }
            });

        }
        function openViewModalStaff(staffId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/staff/viewModel.cshtml',
                controller: 'tenant.views.crs.staff.createOrEditModal as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    staffId: function () {
                        return staffId;
                    }
                }
            });

        }
        vm.viewContact = function () {
            
            if (vm.vehicleMovement.contact.contactType == 2 && vm.vehicleMovement.contact.contactCategory == 1)
                openViewModalPerson(vm.vehicleMovement.contact.id);
            else if (vm.vehicleMovement.contact.contactType == 2 && vm.vehicleMovement.contact.contactCategory == 2)
                openViewModalCompany(vm.vehicleMovement.contact.id);
            else if (vm.vehicleMovement.contact.contactType == 1)
                openViewModalStaff(vm.vehicleMovement.contact.id);
        };
        function getMovementType(movementTypeId) {
            if (movementTypeId == 1)
                return vm.localize("Agreement");
            if (movementTypeId == 2)
                return vm.localize("StaffMove");
            if (movementTypeId == 3)
                return vm.localize("Garage");
            if (movementTypeId == 4)
                return vm.localize("Delivery");
            if (movementTypeId == 5)
                return vm.localize("Collection");
        }
        vm.vehicleChanged = function () {
            if (vm.trafficFine.vehicle) {
                vm.loading = true;
                trafficFineAppService.getMovementOnVehicle(vm.trafficFine).success(
                     function (result) {
                         vm.vehicleMovement = result;
                         if (vm.vehicleMovement) {
                             vm.vehicleMovementType = getMovementType(vm.vehicleMovement.movementTypeId);
                             if (vm.vehicleMovement.movementTypeId == 1) {
                                 vm.vehicleMovementLabel = vm.localize("AgreementNo");
                                 vm.vehicleMovementId = vm.vehicleMovement.refNo;
                                 vm.vehicleMovementContactLabel = vm.localize("Customer");
                                 vm.vehicleMovementContact = vm.vehicleMovement.contact.name;
                             }
                             else {
                                 vm.vehicleMovementLabel = vm.localize("MovementNo");
                                 vm.vehicleMovementId = vm.vehicleMovement.id;
                                 vm.vehicleMovementContactLabel = vm.localize("Staff");
                                 vm.vehicleMovementContact = vm.vehicleMovement.contact.name;
                             }
                         }
                     }).finally(function () {
                         vm.loading = false;
                     });
            }
        };

        vm.save = function () {
            vm.saving = true;
            // Uploading Image Portion Start 

            if ((!angular.isUndefined(vm.uploadedFileUrl) && vm.uploadedFileUrl != null) && (!angular.isUndefined(vm.uploadedFileName) && vm.uploadedFileName != null)) {
                //vm.fineImage.documentType = 5;
                //vm.fineImage.name = vm.uploadedFileName;
                //vm.fineImage.url = vm.uploadedFileUrl;
                vm.trafficFine.fineImage.name = vm.uploadedFileName;
                vm.trafficFine.fineImage.url = vm.uploadedFileUrl;
                // vm.trafficFine.fineImage = vm.fineImage;
            }

            //End
            vm.trafficFine.vehicleId = vm.trafficFine.vehicle.id;
            if (vm.vehicleMovement) {
                vm.trafficFine.agreementId = vm.vehicleMovement.agreementId;
                vm.trafficFine.movementId = vm.vehicleMovement.id;
            }
            trafficFineAppService.createOrUpdateTrafficFine({ trafficFine: vm.trafficFine }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function init() {
            vm.loading = true;
            trafficFineAppService.getTrafficFineForEdit({ id: trafficFineId }).success(
                   function (result) {
                       vm.trafficFine = result;
                       vm.uploader.url = abp.appPath + 'Document/UploadImage/' + vm.trafficFine.fineImage.guid + '.jpg';
                       if (vm.trafficFine.id > 0) {
                           vm.vehicleChanged();
                           if (vm.trafficFine.fineImage.url != null || vm.tariffGroup.fineImage.url != '') {
                               trafficFineAppService.getImageForShow({ url: vm.trafficFine.fineImage.url }).success(function (data) {
                                   var random = (new Date()).toString();
                                   vm.displayImageWithToken = data;
                               });
                           }
                       }
                       else {
                           vm.trafficFine.amount = null;
                           vm.trafficFine.fineNo = null;
                       }
                   }).finally(function () {
                       vm.loading = false;
                   });
        }
        init();

    }]);
