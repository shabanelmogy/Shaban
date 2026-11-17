// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:225271-225467
appModule.controller('tenant.views.crs.integrations.tars.tarsPostingStatus.viewModal', [
        '$scope', '$uibModalInstance', '$uibModal', 'abp.services.app.tarsPostingStatus', 'tarsPostingId',
        function ($scope, $uibModalInstance, $uibModal, tarsPostingStatusService, tarsPostingId) {

            var vm = this;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            };

            vm.getStatusName = function (id) {
                if (id == 0)
                    return "Pending"
                else if (id == 1)
                    return "Queued"
                else if (id == 2)
                    return "Picked"
                else if (id == 3)
                    return "Wait"
                else if (id == 4)
                    return "Error"
                else if (id == 5)
                    return "Success"
                else if (id == 6)
                    return "Expired"
            }

            vm.getSpeedOperationName = function (id) {
                if (id == 1)
                    return "Rental Agreement Opening"
                else if (id == 2)
                    return "Rental Agreement Editing"
                else if (id == 3)
                    return "Rental Agreement CutShort"
                else if (id == 4)
                    return "Replacement"
                else if (id == 5)
                    return "Rental Agreement Closing"
                else if (id == 6)
                    return "Lease Agreement Opening"
                else if (id == 7)
                    return "Lease Agreement Editing"
                else if (id == 8)
                    return "Lease Agreement Closing"
                else if (id == 9)
                    return "NRM Opening"
                else if (id == 10)
                    return "NRM Editing"
                else if (id == 11)
                    return "NRM Closing"
                else if (id == 12)
                    return "Workshop Opening"
                else if (id == 13)
                    return "Workshop Closing"
            }

            vm.getTarsOperationName = function (id) {
                if (id == 1)
                    return "Agreement Opening"
                else if (id == 2)
                    return "Agreement Modification"
                else if (id == 3)
                    return "Replacement"
                else if (id == 4)
                    return "Agreement Closing"
                else if (id == 5)
                    return "NRM Opening"
                else if (id == 6)
                    return "NRM Closing"
                else if (id == 7)
                    return "Workshop Opening"
                else if (id == 8)
                    return "Workshop Closing"
            }

            vm.getErrorTypeName = function (id) {
                if (id == 1)
                    return "Validation Error"
                else if (id == 2)
                    return "Temporary Issue"
                else if (id == 3)
                    return "Authentication Error"
                else if (id == 4)
                    return "Tars Error"
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.openTarsDocumentsModal = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/integrations/tars/tarsPostingStatus/uploadTarsDocumentModal.cshtml',
                    controller: 'tenant.views.crs.tars.uploadTarsDocumentModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {

                    var img = {
                        name: result.name,
                        guid: result.guid,
                        url: result.url,
                        urlWithToken: result.url + result.token
                    };

                    vm.tarsPosting.documents.push(img);

                });
            };
            vm.showHelp = false;
            vm.HideHint = false;
            vm.getHelp = function (id) {
                if (id == 0) {
                    vm.showHelp = true;
                    vm.HideHint = true;
                }
                if (id == 1) {
                    vm.showHelp = false;
                    vm.HideHint = false;
                }
            }

            vm.getHelpText = function (error) {
                if (error == "Pending for attachment" ) {
                    return "Please attach the signed agreement";
                }
                if (error.includes("addresses[0].emirate")) {
                    return "Please update the driver's address and set state and zip code properly";
                }
                if (error.includes("drivers[0].attachments")) {
                    return "Please attach the driving lisnence,national id/passport for the driver";
                }
                if (error.includes("Pending for Replacement's Attachment")) {
                    return "Please attach the driving lisnence,national id/passport for the driver";
                }

                if (error.includes("Pending for Replacement's Attachment")) {
                    return "Please attach the driving lisnence,national id/passport for the driver";
                }
                if (error.includes(" No trafic file credentials found for selected vehicle")) {
                    return "Traffic file id credential not found please add traffic file credential in TARS Setting under administraion tab of speed system ";
                }
                if (error.includes(" No trafic file credentials found for selected vehicle")) {
                    return "Traffic file id credential not found please add traffic file credential in TARS Setting under administraion tab of speed system ";
                }
                if (error.includes(" Requested state transition is not allowed")) {
                    return "Traffic file id credential not found please add traffic file credential in TARS Setting under administraion tab of speed system ";
                }

                return "";
            }


            vm.save = function () {
                vm.saving = true;
                tarsPostingStatusService.saveDocuments({
                    id: tarsPostingId,
                    documents: vm.tarsPosting.documents
                }).success(function (result) {
                    vm.saving = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close("saved");
                }).finally(function () {
                    vm.saving = false;
                });
            }

            vm.isDocumentTab = false;
            vm.clickTab = function (type) {
                if (type == 1)
                    vm.isDocumentTab = false;
                else if (type == 2)
                    vm.isDocumentTab = true;
            }

            function init() {
                vm.loading = true;
                tarsPostingStatusService.getTarsPostingForView({
                    id: tarsPostingId
                }).success(function (result) {
                    vm.tarsPosting = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
