// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:457141-457209
appModule.controller('tenant.views.scs.inspections.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.inspection', 'inspectionId',
        function ($scope, $uibModalInstance, inspectionService, inspectionId) {

            var vm = this;
            vm.loading = false;


            vm.geoLocationMap = function (lat, lng) {
                var url = "https://maps.google.com/?q=" + lat + "," + lng;
                window.open(url);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.editQuestionModal = function (item, isView) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/scs/safetyCheckTemplates/editQuestionModal.cshtml',
                    controller: 'tenant.views.safetyCheckTemplates.editQuestionModal as vm',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        item: function () {
                            return item;
                        },
                        isView: function () {
                            return isView;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            }

            vm.inspection = {};
            
            function init() {
                vm.loading = true;
                inspectionService.getInspectionForView({
                    id: inspectionId
                }).success(function (result) {
debugger;
                    vm.inspection = result;
                    vm.inspection.templateJson = JSON.parse(result.safetyChecks);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
