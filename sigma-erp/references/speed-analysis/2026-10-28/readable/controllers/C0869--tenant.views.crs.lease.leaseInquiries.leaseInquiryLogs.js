// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:237401-237438
appModule.controller('tenant.views.crs.lease.leaseInquiries.leaseInquiryLogs', ['inquiryId', 'abp.services.app.leaseInquiry', '$uibModalInstance', 'leaseInquiryNo',
        function (inquiryId, leaseInquiryService, $uibModalInstance, leaseInquiryNo) {

            var vm = this;
            vm.loading = false;
            
            vm.leaseInquiryNo = leaseInquiryNo;

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

            vm.cancel = function () {
                $uibModalInstance.close();
            }

            function init() {
                vm.loading = true;
                leaseInquiryService.getLeaseInquiryLogs({
                    id: inquiryId
                }).success(function (result) {
                    vm.leaseInquiryLogs = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
