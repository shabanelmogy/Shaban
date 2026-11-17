// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:270278-270344
appModule.controller('tenant.views.crs.reports.finesReport.chooseAuthorityPrint', [
        '$scope', '$uibModal', '$uibModalInstance', 'fineId', 'selectedAuthority', 'FileUploader', 'abp.services.app.uaeFine',
        function ($scope, $uibModal, $uibModalInstance, fineId, selectedAuthority, fileUploader, uaeFineService) {
            var vm = this;
            vm.selectedAuthority = selectedAuthority.indexOf('Dubai') > -1 ? 1 :2 ;

            vm.showPopup = function () {
                if (vm.selectedAuthority == 1) {
                    vm.fineReportPrintByDubaiAuthorityModal(fineId);
                }
                else if (vm.selectedAuthority == 2)
                    vm.fineReportPrintByAuthorityModal(fineId);
            }

            vm.fineReportPrintByDubaiAuthorityModal = function (fineId) {
                let printFilter = fineId;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/finesReport/printtemplates/dubaiPrint.cshtml';
                        },
                        filters: function () {
                            return printFilter;
                        }
                    }
                });

                modalInstance.closed.then(function (result)
                {
                    vm.cancel();
                });
            };

            vm.fineReportPrintByAuthorityModal = function (fineId) {
                let printFilter = fineId;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/finesReport/printtemplates/emiratesCabPrint.cshtml';
                        },
                        filters: function () {
                            return printFilter;
                        }
                    }
                });

                modalInstance.closed.then(function (result)
                {
                    vm.cancel();
                });
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }
    ]);
