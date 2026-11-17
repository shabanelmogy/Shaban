// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:134769-135154
appModule.controller('tenant.views.crs.agreements.agreementDocumentsModal', ['$scope', '$filter', 'options',
        '$uibModal', '$uibModalInstance', 'abp.services.app.agreement',
        function ($scope, $filter, options, $uibModal, $uibModalInstance, agreementService) {

            var vm = this;
            vm.options = options;
            vm.loading = false;
            vm.agreementNo = options.agreementNo;
            vm.agreementId = options.agreementId;
            vm.settings = null;
            vm.gender = '';
            vm.genders = [{ id: 1, name: app.localize('Male') }, { id: 2, name: app.localize('Female') }];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm A';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.agreementDocuments = [];

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementDocuments.AddDocument'),
                edit: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementDocuments.EditDocument'),
                delete: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementDocuments.DeleteDocument')
            };
            console.log(vm.permissions);
            vm.customer = {
                identityDocuments: []
            };
            vm.agreementDocument = {
                agreementDocuments: []
            };
            vm.filters = {
                name: ''
            };
            vm.tabSelected = function (tabIndex) {

                vm.selectedTabIndex = tabIndex;

            };
            vm.getAllAgreementDocumentsSettings = function () {
                vm.loading = true;

                agreementService.getAgreementDocumentsSettings({
                    agreementId: options.agreementId
                })
                    .success(function (result) {
                        vm.settings = result;
                        if (result.agreementDocumentsSetting) {
                            vm.settings.agreementDocuments = JSON.parse(result.agreementDocumentsSetting);
                        } else {
                            vm.settings.agreementDocuments = result.agreementDocuments;
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });

            };

            function checkingIssueAndExpiryDate(documents) {
                isValid = true;
                errorMessage = 'Contact Can Not Be Saved Due To Following Issues: \n';

                if (documents != null) {
                    angular.forEach(documents, function (value, key) {


                        if (value.issueDate == false) value.issueDate = null; //due to picker issue if date is made empty then in model it sets false, so in that case set to null
                        if (value.expiryDate == false) value.expiryDate = null; //due to picker issue if date is made empty then in model it sets false, so in that case set to null

                        if (value.expiryDate != null && value.issueDate != null) {
                            if (value.issueDate > value.expiryDate) {
                                isValid = false;
                                errorMessage = errorMessage + '\n Expiry Date is less than the Issue Date';
                            }
                        }
                    });
                }
            }

            vm.addIndentityDocument = function (documentType, isDriver) {
                if (vm.doesIdentityDoucmentExist(documentType, isDriver)) return;

                var documentsToAdd = vm.agreementDocument.customerIdentityDocuments;
                if (isDriver)
                    documentsToAdd = vm.agreementDocument.driverIdentityDocuments;

                documentsToAdd.push(
                    {
                        documentNo: "",
                        identityDocumentType: documentType,
                        issuedBy: "",
                        issueDate: null,
                        expiryDate: null,
                        contactId: vm.options.customerId,
                        images: []
                    }
                );
            };

            vm.doesIdentityDoucmentExist = function (documentType, isDriver) {
                if (!vm.agreementDocument) return false;
                var documentsToSearch = vm.agreementDocument.customerIdentityDocuments;
                if (isDriver)
                    documentsToSearch = vm.agreementDocument.driverIdentityDocuments;
                if (documentsToSearch == null) return false;

                var docs = $filter('filter')(documentsToSearch, {
                    identityDocumentType: documentType
                }, true);

                return (docs.length > 0);
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            };


            function uploadReceivedImage(base64data) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/uploadDocumentModal.cshtml',
                    controller: 'tenant.views.crs.contacts.uploadDocumentModal as vm',
                    backdrop: 'static',
                    resolve: {
                        base64data: function () {
                            return base64data;
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    vm.addIndentityDocument(result.identityDocumentType); //add if not already added.

                    var docs = $filter('filter')(vm.agreementDocument.customerIdentityDocuments, {
                        identityDocumentType: result.identityDocumentType
                    }, true);

                    if (docs.length > 0) {
                        var img = {
                            guid: result.guid,
                            url: result.url,
                            path: ''
                        };

                        docs[0].images.push(img);

                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = result.urlWithToken;
                        imageDetail.img = result.urlWithToken;
                        imageDetail.description = vm.getIdentificationDocumentType(result.identityDocumentType);

                        if (docs[0].gallaryImages == undefined)
                            docs[0].gallaryImages = [];

                        docs[0].gallaryImages.push(imageDetail);
                    }
                });
            }

            vm.openUploadDocument = function (identityDocument) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadImageModal as vm',
                    backdrop: 'static',
                    resolve: {
                        //identityDocumentType: function () {
                        //    return identityDocumentType;
                        //}
                        options: function () {
                            debugger;
                            return {
                                //agreementId: agreement.id,
                                //agreementNo: agreement.agreementNo,
                                identityDocument: identityDocument
                            };
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    //vm.addIndentityDocument(result.identityDocumentType); //add if not already added.
                    //var docs = $filter('filter')(vm.agreementDocument.customerIdentityDocuments, {
                    //    identityDocumentType: result.identityDocumentType
                    //}, true);

                    //if (docs.length > 0) {
                    var img = {
                        guid: result.guid,
                        url: result.url,
                        path: ''
                    };

                    identityDocument.images.push(img);

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = vm.getIdentificationDocumentType(identityDocument.identityDocumentType);

                    if (identityDocument.gallaryImages === undefined)
                        identityDocument.gallaryImages = [];

                    identityDocument.gallaryImages.push(imageDetail);
                    //}
                });
            };

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }

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
                else
                    return "";
            };

            vm.removeIndentityDocument = function (documentType, isDriver) {
                var documentsToRemove = vm.agreementDocument.customerIdentityDocuments;
                if (isDriver)
                    documentsToRemove = vm.agreementDocument.driverIdentityDocuments;
                for (var i = 0; i < documentsToRemove.length; i++) {
                    if (documentsToRemove[i].identityDocumentType === documentType) {
                        documentsToRemove.splice(i, 1);
                        return;
                    }
                }
            };

            function fillDocumentsObject(documents) {
                //add gallary images list with each document
                for (var i = 0; i < documents.length; i++) {
                    if (documents[i].images == null)
                        documents[i].images = [];

                    var gallaryImages = [];
                    for (var j = 0; j < documents[i].images.length; j++) {
                        var img = documents[i].images[j];

                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = img.url;
                        imageDetail.img = img.url;
                        imageDetail.description = vm.getIdentificationDocumentType(documents[i].identityDocumentType);
                        gallaryImages.push(imageDetail);
                    }
                    documents[i].gallaryImages = gallaryImages;
                }
            }
            vm.openAgreementDocumentsModal = function (identityDocument) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadImageModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                identityDocument: identityDocument
                            };
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    
                    var img = {
                        guid: result.guid,
                        url: result.url,
                        path: ''
                    };

                    identityDocument.images = [];//temp
                    identityDocument.images.push(img);

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = vm.getIdentificationDocumentType(identityDocument.identityDocumentType);

                    if (identityDocument.gallaryImages === undefined)
                        identityDocument.gallaryImages = [];

                    identityDocument.gallaryImages.push(imageDetail);
                    //}
                });
            };

            vm.removeAgreementDocument = function (doc) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', doc.id),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            agreementService.deleteAgreementDocument({
                                Id: doc.id,
                                agreementId: options.agreementId
                            }).success(function (result) {

                                //var row = vm.agreementDocument.agreementDocuments.find(f => f.id === doc.id)[0];
                                //var index = vm.agreementDocument.agreementDocuments.indexOf(row);
                                //vm.agreementDocument.agreementDocuments.splice(index, 1);
                                //$scope.$digest();
                                //$scope.$apply();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                vm.agreementDocuments = result;
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            function init() {
                vm.loading = true;
                var driverId = null;
                if (options.customerId != options.driverId && options.driverType == 2)
                    driverId = options.driverId;
                agreementService.getAgreementDocuments({
                    customerId: options.customerId,
                    driverId: driverId,
                    agreementId: options.agreementId
                }).success(function (result) {
                    vm.agreementDocument = result;
                    vm.agreementDocuments = vm.agreementDocument.agreementDocuments;
                    fillDocumentsObject(vm.agreementDocument.customerIdentityDocuments);
                    if (vm.agreementDocument.driverIdentityDocuments && vm.agreementDocument.driverIdentityDocuments.length > 0)
                        fillDocumentsObject(vm.agreementDocument.driverIdentityDocuments);

                    //vm.agreementDocument.agreementDocuments = JSON.parse(vm.agreementDocument.agreementDocumentsSetting);
                }).finally(function () {
                    vm.loading = false;
                });

            }
            vm.getAllAgreementDocumentsSettings();
            init();

            vm.save = function () {

                checkingIssueAndExpiryDate(vm.agreementDocument.customerIdentityDocuments);
                checkingIssueAndExpiryDate(vm.agreementDocument.driverIdentityDocuments);

                vm.saving = true;
                vm.agreementDocument.agreementDocuments = vm.settings.agreementDocuments;
                if (isValid) {
                    vm.agreementDocument.agreementId = options.agreementId;

                    agreementService.saveAgreementDocuments(
                        vm.agreementDocument
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    //abp.message.info(app.localize('Expiry Date cannot be less than the Issue Date'));
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            };
        }
    ]);
