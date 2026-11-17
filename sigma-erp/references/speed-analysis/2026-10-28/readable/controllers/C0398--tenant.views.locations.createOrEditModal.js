// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:101337-101424
appModule.controller('tenant.views.locations.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.location', 'abp.services.app.taxCode', 'locationId', 'utilities',
        function ($scope, $uibModalInstance, locationService, taxCodeService, locationId, utilities) {

            var vm = this;
            vm.saving = false;
            vm.location = null;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isStateFieldMandatory = utilities.parseBoolean(abp.setting.get("App.Speed.Common.StateFieldMandatoryInLocation"));
            vm.updateTRN = abp.features.isEnabled("CRS.CustomFeatures.UpdateTRN");
            vm.location = {
                trnLogsList: []
            };
            vm.isCrsEnabled = abp.features.isEnabled("CRS");
            vm.isTaxBranchEnabled = abp.features.isEnabled("CRS.CustomFeatures.TaxBranchwise");
            vm.isCommercialRegistrationNumber = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CommercialRegistrationNumberInPrint"));

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            function trnLogsListObject() {
                var line = new Object();
                line.id = 0;
                line.fromDate = null;
                line.toDate = null;
                line.taxId = null;
                return line;
            }

            vm.addRow = function () {
                vm.location.trnLogsList.push(trnLogsListObject());
            };

            vm.removeRow = function (obj) {
                var index = vm.location.trnLogsList.indexOf(obj);
                vm.location.trnLogsList.splice(index, 1);
            };


            vm.save = function () {
                vm.saving = true;
                locationService.createOrUpdateLocation({
                    location: vm.location,
                    trnLogsList: vm.location.trnLogsList
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

            function getTaxCodes() {
                taxCodeService.getTaxCodes().success(function (result) {
                    vm.taxCodes = result.items;
                }).finally(function () {
                    vm.loading = false;
                })
            }

            function init() {
                locationService.getLocationForEdit({
                    id: locationId
                }).success(function (result) {
                    vm.location = result;
                    if (!vm.location.trnLogsList) {
                        vm.location.trnLogsList = [];
                    }
                    getTaxCodes();
                });
            }

            init();
        }
    ]);
