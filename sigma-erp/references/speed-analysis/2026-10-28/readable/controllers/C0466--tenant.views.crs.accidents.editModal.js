// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:119547-119815
appModule.controller('tenant.views.crs.accidents.editModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.accident', 'accidentId', 'abp.services.app.vehicleModel', '$q', 'abp.services.app.commonLookup', 'appSession', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, accidentService, accidentId, vehicleModelService, $q, lookupService, appSession, utilities) {

            var vm = this;
            vm.saving = false;
            vm.policeReportDocs = [];
            vm.canChangeCharges = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.allowEnterExcessInsuranceDamageChargesManually = utilities.parseBoolean(abp.setting.get("App.General.AllowEnterExcessInsuranceDamageChargesManually"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.accidentFaults = [
                { name: app.localize("DriverAtFault"), value: 1 },
                { name: app.localize("DriverNotAtFault"), value: 2 },
                { name: app.localize("Unknown"), value: 3 }
            ];

            vm.chargingTypes = [
                { name: app.localize("NoCharging"), value: 1 },
                { name: app.localize("ExcessCharging"), value: 2 },
                { name: app.localize("DamageCharging"), value: 3}
            ];

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getMovementType = function (mov) {

                if (!mov)
                    return '';
                else if (mov.movementTypeId == 1 && mov.inDetail.operationType == 2)
                    return 'Agreement Replacement';
                else if (mov.movementTypeId == 1 && mov.inDetail.operationType == 4)
                    return 'Agreement Custody';
                if (mov.movementTypeId == 1)
                    return app.localize("Agreement");
                else if (mov.movementTypeId == 2)
                    return app.localize("NRM");
                else if (mov.movementTypeId == 3)
                    return app.localize("Garage");
                else if (mov.movementTypeId == 4)
                    return app.localize("Delivery");
                else if (mov.movementTypeId == 5)
                    return app.localize("Collection");
                else
                    return app.localize("N/A");
            };

            vm.openExcessChargesInfoModal = function (excessChargesDetail) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accidents/excessChargesInfoModal.cshtml',
                    controller: 'tenant.views.crs.accidents.excessChargesInfoModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        excessChargesDetail: () => excessChargesDetail
                    }

                });
            };
            vm.isDocument = function (i) {
                return i && i.name &&
                    (['jpg', 'jpeg', 'png'].indexOf(i.name.split('.')[1].toLowerCase()) == -1);
            };
            vm.openUploadImage = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadImageModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: {}
                    }

                });
                modalInstance.result.then(function (result) {
                    //vm.addIndentityDocument(result.identityDocumentType); //add if not already added.
                    //var docs = $filter('filter')(vm.person.identityDocuments, {
                    //    identityDocumentType: result.identityDocumentType
                    //}, true);


                    //if (docs.length > 0) {
                    var img = {
                        guid: result.guid,
                        url: result.url,
                        name: result.name,
                        path: '',
                        documentType: 10, // accident images
                        accidentId: accidentId
                    };

                    vm.accident.documents.push(img);

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = "Accident Image";
                    imageDetail.name = result.name;
                    imageDetail.url = result.url;
                    imageDetail.documentType = 10;

                    if (vm.accident.accidentImages == undefined)
                        vm.accident.accidentImages = [];

                    vm.accident.accidentImages.push(imageDetail);

                });
            };
            vm.openUploadDocument = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadDocumentModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: {}
                    }

                });
                modalInstance.result.then(function (result) {
                    //vm.addIndentityDocument(result.identityDocumentType); //add if not already added.
                    //var docs = $filter('filter')(vm.person.identityDocuments, {
                    //    identityDocumentType: result.identityDocumentType
                    //}, true);


                    //if (docs.length > 0) {
                    var img = {
                        guid: result.guid,
                        url: result.url,
                        name: result.name,
                        path: '',
                        documentType: 9, // police docs
                        accidentId: accidentId
                    };

                    vm.accident.documents.push(img);

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = "Police Report Image";
                    imageDetail.name = result.name;
                    imageDetail.url = result.url;
                    imageDetail.documentType = 9;

                    if (vm.accident.policeReportImages == undefined)
                        vm.accident.policeReportImages = [];

                    if (vm.isDocument(imageDetail))
                        vm.policeReportDocs.push(imageDetail);
                    else
                        vm.accident.policeReportImages.push(imageDetail);

                });
            };

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }

            vm.getChargingType = function () {
                if (vm.accident && vm.accident.chargingType) {
                    if (vm.accident.chargingType == 1)
                        return 'No Charging';
                    else if (vm.accident.chargingType == 2)
                        return 'Excess Charging';
                    else if (vm.accident.chargingType == 3)
                        return 'Damage Charging';
                }
                return '';
            };

            vm.getExcessCharges = function () {
                vm.loading = true;
                vm.canChangeCharges = false;

                accidentService.getExcessCharges(vm.accident).success(function (result) {
                    vm.canChangeCharges = result.canChangeCharges;
                    vm.accident.excessAmount = result.excessCharges;
                    vm.accident.chargingType = result.chargingType;
                    vm.accident.calcDetail = result.calcDetail;
                    if (vm.allowEnterExcessInsuranceDamageChargesManually)
                        vm.canChangeCharges = true;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.save = function () {
                vm.saving = true;

                if (!vm.accident.isPoliceReport) {
                    vm.accident.policeReportNo = null;
                    vm.accident.documents = vm.accident.documents.filter(e => e.documentType == 10);
                }
                accidentService.createOrUpdateAccident({
                    accident: vm.accident,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                vm.loading = true;
                accidentService.getAccidentForEdit({
                    id: accidentId

                }).success(function (result) {
                    vm.loading = false;
                    vm.accident = result;
                    if (vm.allowEnterExcessInsuranceDamageChargesManually)
                        vm.canChangeCharges = true;
                    if (vm.accident.documents) {
                        for (var i = 0; i < vm.accident.documents.length; i++) {
                            var img = vm.accident.documents[i];

                            var imageDetail = imageGalleryObject();
                            imageDetail.thumb = img.url;
                            imageDetail.img = img.url;
                            imageDetail.description = img.documentType == 9 ? "Police Report Image" : "Accident Image";
                            imageDetail.name = img.name;
                            imageDetail.url = img.url;
                            imageDetail.guid = img.guid;

                            if (vm.accident.accidentImages == undefined)
                                vm.accident.accidentImages = [];

                            if (vm.accident.policeReportImages == undefined)
                                vm.accident.policeReportImages = [];

                            if (vm.isDocument(imageDetail)) {
                                vm.policeReportDocs.push(imageDetail);
                            }
                            else {
                                if (img.documentType == 9)
                                    vm.accident.policeReportImages.push(imageDetail);

                                else if (img.documentType == 10)
                                    vm.accident.accidentImages.push(imageDetail);
                            }
                        }
                    }
                });
            }

            init();
        }
    ]);
