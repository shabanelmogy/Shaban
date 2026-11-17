// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:181950-181982
appModule.controller('tenant.views.crs.contacts.uploadDocumentModal', [
        '$scope', '$filter', '$uibModalInstance', 'abp.services.app.person', 'base64data',
    function ($scope, $filter, $uibModalInstance, personService, base64data) {

        var vm = this;
        vm.saving = false;
        vm.identityDocumentType = null;
        vm.base64data = base64data;

        vm.identityDocumentTypes = [
            { id: 2, name: app.localize('Passport') },
            { id: 3, name: app.localize('NationalId') },
            { id: 4, name: app.localize('DrivingLicense'), },
            { id: 5, name: app.localize('OtherDocument'), }
        ];

        vm.save = function () {
            vm.saving = true;

            personService.uploadDocumentImage({
                imageBase64String: vm.base64data,
            }).success(function (result) {
                $uibModalInstance.close({ guid: result.guid, url: result.url, urlWithToken: result.urlWithToken, identityDocumentType: vm.identityDocumentType });
            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
    ]);
