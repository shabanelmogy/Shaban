// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:297026-297343
appModule.controller('tenant.views.crs.suppliers.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.country',
        //'abp.services.app.city',
        'abp.services.app.supplier', 'supplierId', 'abp.services.app.contactGroup', '$filter', 'utilities', 'abp.services.app.currency',
        'abp.services.app.taxCode',
        function ($scope, $uibModal, $uibModalInstance, countryService,
            //cityService,
            supplierService, supplierId, contactGroupService, $filter, utilities, currencyService, taxCodeService) {

            var vm = this;
            vm.saving = false;
            vm.contactPersons = [];

            vm.isEditMod = false;
            vm.selectedCountry = null;
            vm.isManualCode = utilities.parseBoolean(abp.setting.get("App.DocumentNos.ManualSupplierCode"));
            vm.isSupplierBankDetails = utilities.parseBoolean(abp.setting.get("App.General.ShowSupplierBankDetails"));
            vm.isContactPerson = utilities.parseBoolean(abp.setting.get("App.General.IsContactPerson"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isCreditPeriod = utilities.parseBoolean(abp.setting.get("App.General.IsCreditPeriod"));
            vm.isEnableVerifiedFeature = abp.features.isEnabled("CRS.Vouchers.Approval.Suppliers");
            vm.isEnableDocumentFeature = abp.features.isEnabled("Core.Suppliers.Documents");
            vm.isDocumentsEnabled = abp.auth.hasPermission("Pages.Tenant.Suppliers.Documents");
            vm.isMulticurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isLimitPermissions = !abp.auth.hasPermission('Pages.Tenant.Contacts.Edit') && abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit') && vm.isEditMod;
            vm.isContactCardPermission = vm.isEditMod && abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards') && !abp.auth.hasPermission('Pages.Tenant.Contacts.Edit') && !abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit');
            vm.isGroupTRNEnabled = abp.features.isEnabled("CRS.CustomFeatures.GroupTRNAsTaxRuleInCustomer");
            vm.taxRules = utilities.getTaxRulesForSupplier();

            vm.supplier = null;
            vm.filters = {
                name: ''
            };

            vm.save = function () {
                vm.saving = true;

                if (vm.selectedCountry != null) vm.supplier.address.country = vm.selectedCountry.name;
                if (vm.isEnableDocumentFeature) {
                    vm.getAdvanceSettings();
                } else {
                    vm.supplier.identityDocuments = null;

                }
                supplierService.createOrUpdateSupplier({
                    company: vm.supplier,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchCountries = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });
            };
            function getContactGroups() {
                contactGroupService.getContactGroupsOnContactType({ contactType: 3 }).success(function (result) {
                    vm.contactGroups = $filter('filter')(result.items, {
                        isDefault: false
                    }, true);

                }).finally(function () { vm.loading = false; })
            }
            function showReqIdentityDocumentsRow() {
                angular.forEach(vm.indentityDocuments, function (row) {

                    if (row.isRequired) {
                        vm.addIndentityDocument(row);
                    }

                });
            }
            function getCurrencies() {
                currencyService.getCurrencies().success(function (result) {
                    vm.currencies = result.items;
                }).finally(function () { vm.loading = false; });
            }
            function getBaseCurrency() {
                currencyService.getCurrencies().success(function (result) {
                    vm.supplier.currencyId = result.items.filter(p => p.isBase)[0].id;
                }).finally(function () { vm.loading = false; });
            }
            function init() {
                vm.loading = true;
                if (vm.isEnableDocumentFeature) {
                    vm.getAdvanceSettings();
                }
                supplierService.getSupplierForEdit({
                    id: supplierId
                }).success(function (result) {
                    vm.supplier = result;
                    getContactGroups();
                    getTaxCodes();
                    if (vm.supplier.address.country != null) vm.selectedCountry = { name: vm.supplier.address.country };
                    //vm.selectedCountry = { name: vm.supplier.address.country };
                    if (vm.isMulticurrencyEnabled) {
                        getCurrencies();
                        if (vm.supplier.currencyId == null) {
                            getBaseCurrency();
                        }
                    }
                    if (vm.supplier.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }
            //vm.searchCities = function ($select) {
            //    return cityService.getCities({ keyword: $select.search }).then(function (response) {
            //        vm.cities = response.data.items;
            //    });
            //};

            function getTaxCodes() {
                taxCodeService.getTaxCodes().success(function (result) {
                    vm.taxCodes = result.items;
                }).finally(function () {
                    vm.loading = false;
                })
            }
            vm.addMandatoryDesignations = function (row) {
                let isDisabledVerified = !vm.isEnableVerifiedFeature || vm.supplier.verified;
                if (!vm.designations) return;
                let designation = vm.designations.filter(e => e.name === row.name)[0];

                let prevfound = vm.contactPersons.filter(e => e.designation.name === row.name)[0];
                if (prevfound) {
                    //if (vm.isEditMod) {
                    prevfound.designationId = designation.id;
                    prevfound.isRequired = row.isRequired;
                    prevfound.verifiedRequired = isDisabledVerified && row.isRequired;
                    //}
                } else {
                    vm.contactPersons.push(
                        {
                            designationId: designation.id,
                            designation: designation,
                            firstName: "",
                            lastName: "",
                            contactNo: null,
                            email: null,
                            isRequired: row.isRequired,
                            verifiedRequired: isDisabledVerified && row.isRequired
                        }
                    );
                }
            };
            function showReqMandatoryDesignationsRow() {

                angular.forEach(vm.contactPersons, function (value) {
                    if (!value.designation)
                        value.designation = vm.designations.filter(e => e.id === value.designationId)[0];
                });
                angular.forEach(vm.mandatoryDesignations, function (row) {
                    if (row.isRequired) {
                        vm.addMandatoryDesignations(row);
                    }
                });
            }
            vm.doesIdentityDoucmentExist = function (documentType) {

                if (!vm.supplier) return false;
                if (!vm.supplier.identityDocuments) return false;

                var docs = $filter('filter')(vm.supplier.identityDocuments, {
                    identityDocumentType: documentType
                }, true);

                return (docs.length > 0);
            };
            vm.openUploadDocument = function (identityDocument) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadDocumentModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                identityDocument: identityDocument,
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    var img = {
                        guid: result.guid,
                        url: result.url,
                        path: '',
                        name: result.name
                    };

                    identityDocument.images.push(img);

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = vm.getIdentificationDocumentType(identityDocument.identityDocumentType);
                    imageDetail.name = result.name;
                    imageDetail.url = result.url;

                    if (identityDocument.gallaryImages == undefined)
                        identityDocument.gallaryImages = [];

                    if (vm.isDocument(imageDetail)) {
                        imageDetail.identityDocumentId = identityDocument.id;
                        imageDocs.push(imageDetail);
                    }
                    else
                        identityDocument.gallaryImages.push(imageDetail);

                });
            };
            vm.removeIndentityDocument = function (documentType) {
                for (var i = 0; i < vm.supplier.identityDocuments.length; i++) {
                    if (vm.supplier.identityDocuments[i].identityDocumentType === documentType) {
                        vm.supplier.identityDocuments.splice(i, 1);
                        return;
                    }
                }
            };
            vm.getIdentificationDocumentType = function (id) {
                if (id == 1)
                    return app.localize('TradeLicense');
                else if (id == 2)
                    return app.localize('Passport');
                else if (id == 3)
                    return app.localize('NationalId');
                else if (id == 4)
                    return app.localize('DrivingLicense');
                else if (id == 5)
                    return app.localize('OtherDocument');
                else if (id == 8)
                    return app.localize('Visa');
                else if (id == 9)
                    return app.localize('CreditApplication');
                else if (id == 15)
                    return app.localize('OtherDocument2');
                else if (id == 16)
                    return app.localize('OtherDocument3');
                else if (id == 17)
                    return app.localize('OtherDocument4');
                else
                    return "";
            };
            vm.addIndentityDocument = function (row) {

                let isDisabledVerified = !vm.isEnableVerifiedFeature || vm.supplier.verified;
                if (!vm.supplier.identityDocuments) return;
                let prevfound = vm.supplier.identityDocuments.filter(e => e.identityDocumentType === row.identityDocumentType)[0];
                if (prevfound) {
                    //if (vm.isEditMod) {
                    prevfound.identityDocumentType = row.identityDocumentType;
                    prevfound.isRequired = row.isRequired;
                    prevfound.verifiedRequired = isDisabledVerified && row.isRequired;
                    //}
                } else {
                    if (vm.doesIdentityDoucmentExist(row.identityDocumentType)) return;
                    vm.supplier.identityDocuments.push(
                        {
                            documentNo: "",
                            identityDocumentType: row.identityDocumentType,
                            issuedBy: "",
                            issueDate: null,
                            expiryDate: null,
                            isRequired: row.isRequired,
                            verifiedRequired: isDisabledVerified && row.isRequired,
                            images: []
                        }
                    );
                }
            };
            vm.getAdvanceSettings = function () {

                supplierService.getAdvanceSettings().success(function (data) {
                    if (data.name) {
                        vm.indentityDocuments = data.documents;
                        vm.mondatoryFields = data.mondatoryFields;
                        vm.additionalFields = data.additionalFields;
                        vm.mandatoryDesignations = data.mandatoryDesignations;
                    }
                    else {
                        vm.mondatoryFields = utilities.advanceSettingMondatoryFieldsSupplier();
                        vm.indentityDocuments = utilities.advanceSettingEnumscompanyCustomer();
                    }
                    if (vm.supplier && vm.indentityDocuments) {
                        showReqIdentityDocumentsRow();
                    }
                    if (vm.supplier && vm.mandatoryDesignations) {
                        showReqMandatoryDesignationsRow();
                    }

                }).finally(function () {
                    //vm.loading = false;
                });
            };

            init();
           
        }
    ]);
