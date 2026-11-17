// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:308209-308266
appModule.controller('tenant.views.crs.vehicles.createOrShowInvestorLogsModal',
        [
            '$uibModalInstance', 'abp.services.app.vehicleInvestorsLog', 'investor', 'abp.services.app.commonLookup', 'vehicleId',
            function ($uibModalInstance, vehicleInvestorService, investor, lookupService, vehicleId) {
                var vm = this;
                
                debugger;

                vm.isInvestorMendatory = investor == null || investor.toDate != null;

                vm.save = function () {
                    vm.saving = true;
                    const input = {
                        id: investor && investor.id, vehicleId: vehicleId,
                        investorId: vm.newInvestor && vm.newInvestor.id,
                        toDate: vm.toDate.startOf('day')
                    };

                    if (!investor) { //first log entry
                        //input.toDate = moment().endOf('day').format('YYYY-MM-DD').utc();
                        input.fromDate = input.toDate;
                        input.toDate = null;

                        vehicleInvestorService.createOrUpdate(input)
                            .success(function () {
                                abp.notify.info(app.localize('SavedSuccessfully'));

                                $uibModalInstance.close();

                            }).finally(function () {
                                vm.saving = false;
                            });
                    }
                    else {
                        vehicleInvestorService.closeInvestorLog(input).success(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));

                            $uibModalInstance.close();

                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                };


                vm.searchInvestor = function ($select) {
                    return lookupService.searchContact({ keyword: $select.search }).then(function (response) {
                        vm.contactInvestor = response.data.items;
                    });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

            }
        ]);
