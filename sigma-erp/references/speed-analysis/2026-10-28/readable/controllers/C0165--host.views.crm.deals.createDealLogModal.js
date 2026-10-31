// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:63269-63338
appModule.controller('host.views.crm.deals.createDealLogModal', [
        '$scope', '$uibModalInstance', 'deal', 'abp.services.app.deal',
    function ($scope, $uibModalInstance, deal, dealService) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
        vm.selectedCountry = null;
        vm.deal = deal;
        vm.dealLog = {
            nextFollowupDate: moment(),
            dealStatus: vm.deal.status,
            dealStage: vm.deal.stage
        };
        vm.getDealStatus = function (status) {
            if (!status)
                return '';
            if (status == 1)
                return 'Open';
            if (status == 2)
                return 'Closed';
            if (status == 3)
                return 'In-Active';
            if (status == 4)
                return 'Cancelled';
        };
        vm.dealStages = [
            { id: 1, name: 'New' },
            { id: 2, name: 'Average' },
            { id: 3, name: 'Hot' },
            { id: 4, name: 'Final' }
        ];
        vm.filters = {
            name: ''
        };
        vm.statuses = [
       { id: 1, name: 'Open' },
       { id: 2, name: 'Closed' },
       { id: 3, name: 'In-Active' },
       { id: 4, name: 'Cancelled' },
        ];

        vm.save = function () {
            vm.saving = true;
            vm.dealLog.dealId = vm.deal.id;
            vm.dealLog.nextFollowupDate = moment(vm.dealLog.nextFollowupDate).startOf('day').utc();
            dealService.createDealLog(vm.dealLog).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        
        //function init() {
        //    vm.loading = true;
        //    dealService.getDealLogForCreate().success(function (result) {
        //        vm.dealLog = result;
        //        vm.dealLog.dealStatus = vm.deal.status;
        //        vm.dealLog.nextFollowupDate = moment(vm.dealLog.nextFollowupDate).startOf('day').utc();
        //    }).finally(function () { vm.loading = false; });
        //}

        //init();
    }
    ]);
