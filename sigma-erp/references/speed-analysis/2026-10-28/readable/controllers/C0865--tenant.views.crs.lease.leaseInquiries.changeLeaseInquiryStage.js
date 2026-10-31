// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:236504-236550
appModule.controller('tenant.views.crs.lease.leaseInquiries.changeLeaseInquiryStage', ['inquiryId', 'abp.services.app.leaseInquiry', '$uibModalInstance', 'leaseInquiryNo', 'leaseInquiryStage',
        function (inquiryId, leaseInquiryService, $uibModalInstance, leaseInquiryNo, leaseInquiryStage) {

            var vm = this;
            vm.loading = false;

            vm.inquiry = {};
            
            vm.inquiry.leaseInquiryNo = leaseInquiryNo;
            vm.inquiry.leaseInquiryStage = leaseInquiryStage;
            vm.inquiry.id = inquiryId;

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

            vm.leaseInquiryStageOptions = [
                { key: 'New', value: 0 },
                { key: 'Cold', value: 1 },
                { key: 'Hot', value: 2 }
            ];

            vm.cancel = function () {
                $uibModalInstance.close();
            }

            vm.save = function () {
                vm.saving = true;
                
                leaseInquiryService.updateLeaseInquiryStage(vm.inquiry)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
            };
        }
    ]);
