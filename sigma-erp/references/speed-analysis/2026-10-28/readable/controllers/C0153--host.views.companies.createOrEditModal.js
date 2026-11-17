// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:60771-61004
appModule.controller('host.views.companies.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.companyHost', 'companyId','isChangeRequest', 'abp.services.app.industry', 'abp.services.app.designation', 'abp.services.app.carRental',  'abp.services.app.user',
        function ($scope, $uibModal, $uibModalInstance, countryService, companyHostService, companyId, isChangeRequest, industryService, designationService, carRentalService, userService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.selectedCountry = null;
            vm.companySegment = [{ id: 1, name: 'Small' }, { id: 2, name: 'Medium' }, { id: 3, name: 'Large' }];
            vm.customerCategories = [
                { id: 1, name: 'Unknown' },
                { id: 2, name: 'Golden' },
                { id: 3, name: 'Silver' },
                { id: 4, name: 'Black' }
            ];
            vm.verifiedList = [{ id: true, name: 'Verified' }, { id: false, name: 'Not Verified' }];
            vm.suitableList = [{ id: 1, name: 'Suitable' }, { id: 2, name: 'Not Suitable' }];
            vm.typeList = [{ id: 1, name: 'Dormant' }, { id: 2, name: 'Active' }, { id: 3, name: 'Customer' }];
            vm.users = [];
            vm.contactBranchRows = [];
            vm.contactPersons = [];

            vm.filters = {
                name: ''
            };
            vm.addContactBranchRow = function () {
                vm.contactBranchRows.push(
                        {
                        branchName: "",
                        longitude: "",
                        latitude: "",
                        contactId: null,
                        tenantId: null,
                        contact: null
                        }
                    );
            };
            vm.removeContactBranchRow = function (branchcode) {
                for (var i = 0; i < vm.contactBranchRows.length; i++) {
                    if (vm.contactBranchRows[i].branchName === branchcode) {
                        vm.contactBranchRows.splice(i, 1);
                        return;
                    }
                }
            };
            vm.company = {
                contactPersons: new Array(),
                address: {
                    city: null,
                    country: null,
                    state: null,
                        }
            };
            vm.getDesignations = function () {
                designationService.getDesignations().success(function (result) {
                    vm.designations = result.items;
                });
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            vm.searchCountries = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });
            };
            vm.save = function () {
                
                vm.saving = true;
                let contactPersons = new Array();

                vm.company.contactPersons = vm.contactPersons;

                vm.company.contactPersons.forEach(function (contactPerson) {
                    if (contactPerson.firstName != "" &&
                        contactPerson.firstName != null &&
                        contactPerson.firstName != undefined) {
                        contactPersons.push(contactPerson);
                    }
                });

                vm.company.contactPersons = contactPersons;
                vm.company.assignedToUser = null;
                if (vm.selectedCountry != null)
                {
                    vm.company.address.country = vm.selectedCountry.name;
                }
                if (isChangeRequest == "true" || isChangeRequest == true) {
                    //carRentalService.changeRequest({
                    companyHostService.createChangeLog({
                        company: vm.company,
                        contactBranch: vm.contactBranchRows
                    }).success(function () {
                        abp.notify.info(app.localize('Changed Log Requested'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    companyHostService.createOrUpdateCompany({
                    //companyHostService.createChangeLog({
                        company: vm.company,
                        contactBranch: vm.contactBranchRows
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function designationObject() {
                let designation = new Object();
                designation.designationId = null;
                designation.firstName = null;
                designation.lastName = null;
                designation.contactNo = null;
                designation.email = null;
                return designation;
            }
            vm.addRow = function () {
                vm.contactPersons.push(designationObject());
            };
            vm.removeRow = function (obj) {
                var index = vm.contactPersons.indexOf(obj);
                vm.contactPersons.splice(index, 1);
            };

            vm.openUploadPicture = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadImageModal as vm',
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
                    var img = {
                        guid: result.guid,
                        url: result.url,
                        name: result.name,
                        path: '',
                        documentType: 5
                    };
                    vm.company.logoUrl = img.url;
                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = '';
                    vm.picture = [];
                    vm.picture.push(imageDetail);
                });
            };
            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }
            function init() {
                vm.getDesignations();
                industryService.getIndustries().success(function (result) {
                    vm.industries = result.items;
                });
                if (companyId > 0)
                {

                    companyHostService.getCompanyForEdit({
                        id: companyId
                    }).success(function (result) {
                        vm.company = result;
                        vm.contactBranchRows = result.contactBranch;
                        vm.contactPersons = vm.company.contactPersons;
                        vm.selectedCountry = { name: vm.company.address.country };
                        debugger
                        if (vm.company.showUrlLogo) {
                            var img = vm.company.showUrlLogo;

                            //var imageDetail = imageGalleryObject();
                            //imageDetail.thumb = vm.company.LogoUrl;
                            //imageDetail.img = vm.company.LogoUrl;
                            //imageDetail.description = img.description;
                            //imageDetail.url = vm.company.LogoUrl;
                            //imageDetail.name = img.name;
                            //imageDetail.guid = img.guid;
                            //imageDetail.ImageURL = vm.company.LogoUrl;
                            //imageDetail.ImagePath = img.name;
                            //vm.picture.push(imageDetail);

                            var imageDetail = imageGalleryObject();
                            imageDetail.thumb = img;
                            imageDetail.img = img;
                            imageDetail.description = '';
                            vm.picture = [];
                            vm.picture.push(imageDetail);
                        }
                        if (vm.company.id > 0) {
                            vm.isEditMod = true;
                            vm.contactPersons.forEach(function (contactPerson) {
                                if (contactPerson.designationId == null) {
                                    contactPerson.isDisabledDesignation = false;
                                } else {
                                    contactPerson.isDisabledDesignation = true;
                                }
                            });
                        } else {
                            vm.isEditMod = false;
                        }
                    });
                }
            }

            init();
        }
    ]);
