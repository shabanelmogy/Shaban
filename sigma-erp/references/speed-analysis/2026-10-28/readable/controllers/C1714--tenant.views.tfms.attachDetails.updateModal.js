// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:471313-471386
appModule.controller('tenant.views.tfms.attachDetails.updateModal', [
        '$scope', '$filter', '$uibModal', 'utilities', 'SelectedFinesDetail', 'uiGridConstants', '$uibModalInstance', 'abp.services.app.uaeFine',
        function ($scope, $filter, $uibModal, utilities, selectedFinesDetail, uiGridConstants, $uibModalInstance, finesService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.filters = {
                name: null
            };

            vm.loading = false;
            vm.selectedFinesDetail = selectedFinesDetail;
            vm.customerType = 1;
            vm.isDashboardRequest = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.cancel = function () {
                $uibModalInstance.close(vm.selectedFinesDetail);
            };

            vm.save = function () {
                vm.loading = true;
                vm.selectedFinesDetail.customerType = vm.customerType;
                vm.selectedFinesDetail.agreementNo = vm.agreementNo;
                vm.selectedFinesDetail.customerName = vm.customerName;
                vm.selectedFinesDetail.customerEmail = vm.customerEmail;
                vm.selectedFinesDetail.notes = vm.notes;
                vm.selectedFinesDetail.employeeCode = vm.employeeCode;
                vm.selectedFinesDetail.employeeName = vm.employeeName;
                vm.selectedFinesDetail.employeeEmail = vm.employeeEmail;

                finesService.updateFinesAccountDetails(vm.selectedFinesDetail).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(vm.selectedFinesDetail);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initialize() {
                if (!(vm.selectedFinesDetail.agreementNo === null || vm.selectedFinesDetail.agreementNo === undefined || vm.selectedFinesDetail.agreementNo === '')) {
                    vm.isDashboardRequest = true;
                    vm.agreementNo = vm.selectedFinesDetail.agreementNo;
                }
            }

            initialize();
        }
    ]);
