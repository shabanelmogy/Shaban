// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:120484-120634
appModule.controller('tenant.views.crs.accidents.viewModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.accident', 'accidentId', 
        function ($scope, $uibModal, $uibModalInstance, accidentService, accidentId) {

            var vm = this;
            vm.saving = false;
            vm.policeReportDocs = [];
            vm.canChangeCharges = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.accidentFaults = [
                { name: app.localize("DriverAtFault"), value: 1 },
                { name: app.localize("DriverNotAtFault"), value: 2 },
                { name: app.localize("Unknown"), value: 3 }];

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
                else if (mov.movementTypeId == 1 && mov.inDetail && mov.inDetail.operationType == 2)
                    return 'Agreement Replacement';
                else if (mov.movementTypeId == 1 && mov.inDetail && mov.inDetail.operationType == 4)
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

            vm.getChargingType = function () {
                if (vm.accident && vm.accident.chargingType) {
                    if (vm.accident.chargingType == 1)
                        return app.localize('NoCharging');
                    else if (vm.accident.chargingType == 2)
                        return app.localize('ExcessCharging');
                    else if (vm.accident.chargingType == 3)
                        return app.localize('DamageCharging');
                }
                return '';
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

            vm.openViewInvoiceModal = function (invoiceId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });

            };

            vm.isDocument = function (i) {
                return i && i.name &&
                    (['jpg', 'jpeg', 'png'].indexOf(i.name.split('.')[1].toLowerCase()) == -1);
            };


            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }

            function init() {
                vm.loading = true;
                accidentService.getAccidentForView({
                    id: accidentId

                }).success(function (result) {
                    vm.loading = false;
                    vm.accident = result;
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
