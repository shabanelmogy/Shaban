// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36319-36363
appModule.controller('host.views.cbs.orgProcesses.createOrgProcessModel',
        [
            '$scope', 'process', '$uibModalInstance', '$uibModal', 'abp.services.app.orgProcess', 'appSession',
            function ($scope, process, $uibModalInstance, $uibModal, orgProcessesService, appSession, utilities) {
                var vm = this;
                vm.process = process;
                vm.parentProcess = {};

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };


                vm.searchProcesses = function ($select) {
                    return orgProcessesService.search({ keyword: $select.search }).then(function (response) {
                        vm.processes = response.data.items;
                    });
                };

                vm.multilineStringToHTML = (s) => utilities.multilineStringToHTML(s);
                
                vm.save = function () {

                    vm.process.detail = $("#htmlText").code();
                    vm.loading = true;
                    orgProcessesService.createOrUpdateOrgProcesses(vm.process).success(function (result) {
                        $uibModalInstance.close();
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.loading = false;
                    });
                };
                function init() {
                    if (vm.process.parentId > 0 && vm.process.parentName != null) {
                        vm.parentProcess = { id: vm.process.parentId, title: vm.process.parentName };
                    }
                    setTimeout(() => {
                        $(".summernote").code(vm.process.detail);
                    }, 1500);
                }
                init();


                
            }
        ]);
