// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:189643-189680
appModule.controller('tenant.views.crs.crm.marketing.campaign.cRMCampaignLogsModal', ['id', 'abp.services.app.cRMCampaign', '$uibModalInstance', 'name',
        function (id, crmCampaignService, $uibModalInstance, name) {

            var vm = this;
            vm.loading = false;
            vm.name = name;

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
                debugger
                vm.loading = true;
                crmCampaignService.getCRMCampaignLogs({
                    id: id
                }).success(function (result) {
                    vm.logs = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
