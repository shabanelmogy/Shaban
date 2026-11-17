// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:67544-67624
appModule.controller('host.views.crm.proposal.costSetting.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.proposal', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'abp.services.app.hostSettings',
        function ($scope, $uibModal, uiGridConstants, proposalService, commonLookupService, directoryService, hostSettingsService) {
            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.proposalCostSetting = {
                customizationPerManHour: null,
                consultancyPerManHour: null,
                onSiteTraingPerManHour: null,
                remoteTrainingPerManHour: null
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

         

            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };


         
            vm.save = function () {
                vm.saving = true;
                hostSettingsService.updateProposalCostSetting({ costSetting: vm.proposalCostSetting}).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                });
            };
         

         
            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };


            vm.getProposalCostSettings = function () {
                vm.loading = true;
                hostSettingsService.getProposalSetting().success(function (result) {
                    vm.proposalCostSetting = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getProposalCostSettings();
            }

            init();
        }
    ]);
