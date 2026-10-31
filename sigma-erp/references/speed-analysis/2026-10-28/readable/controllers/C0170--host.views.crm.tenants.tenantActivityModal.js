// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:64166-64216
appModule.controller('host.views.crm.tenants.tenantActivityModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.tenantActivity', 'tenantId',
        function ($scope, $uibModalInstance, tenantActivityService, tenantId) {
            var vm = this;
            vm.filters = {
                fromDate: '',
                toDate: '',
                Id: tenantId,
            };

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                }
                else {
                    return "";
                }
            };

            vm.getTenantActivity = function () {

                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                tenantActivityService.getTenantActivity(vm.filters).success(function (result) {
                    vm.tenantActivity = result;
                    vm.createDate = vm.getlocalDateTime(vm.tenantActivity.creationTime)
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                vm.getTenantActivity();
                var a = vm.tenent
            }
            init();
        }
    ]);
