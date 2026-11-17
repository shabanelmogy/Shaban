// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:443703-443782
appModule.controller('tenant.views.hrm.staffTimeSheet.importBiometricAttendanceModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.staffTimeSheet',
        function ($scope, $uibModalInstance, staffTimeSheetService) {

            var vm = this;

            vm.loading = false;
            vm.monthYear = new Date();
            vm.fileContent = null;
            vm.fileName = null;
            vm.result = null;
            vm.errorMessage = null;

            vm.onFileSelected = function (input) {
                var file = input.files[0];
                if (!file) return;

                vm.fileName = file.name;
                vm.result = null;
                vm.errorMessage = null;

                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.$apply(function () {
                        vm.fileContent = e.target.result;
                    });
                };
                reader.readAsText(file);
            };

            vm.import = function () {
                if (!vm.fileContent) {
                    abp.message.warn(app.localize('PleaseSelectAFile'));
                    return;
                }

                var month = moment(vm.monthYear).month() + 1;
                var year = moment(vm.monthYear).year();

                vm.loading = true;
                vm.result = null;
                vm.errorMessage = null;

                staffTimeSheetService.importBiometricAttendance({
                    month: month,
                    year: year,
                    fileContent: vm.fileContent
                }).success(function (data) {
                    vm.result = data;
                    abp.notify.success(data.message || app.localize('ImportSuccessful'));
                }).error(function (err) {
                    vm.errorMessage = err && err.error && err.error.message ? err.error.message : app.localize('ImportFailed');
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.process = function () {
                var month = moment(vm.monthYear).month() + 1;
                var year = moment(vm.monthYear).year();

                vm.loading = true;
                staffTimeSheetService.processBiometricAttendance({
                    month: month,
                    year: year
                }).success(function (data) {
                    abp.notify.success(data.message || app.localize('ProcessingComplete'));
                    $uibModalInstance.close();
                }).error(function (err) {
                    vm.errorMessage = err && err.error && err.error.message ? err.error.message : app.localize('ProcessingFailed');
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
