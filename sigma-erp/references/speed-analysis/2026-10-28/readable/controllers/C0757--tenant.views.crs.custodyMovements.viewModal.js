// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:196068-196123
appModule.controller('tenant.views.crs.custodyMovements.viewModal', ['custodyMovementId', '$uibModalInstance', 'utilities', 'abp.services.app.custody', 'abp.services.app.commonLookup',
        function (custodyMovementId, $uibModalInstance, utilities, custodyMovementService, commonLookupService) {

            var vm = this;
            vm.loading = false;

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

            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                getLocations();
                vm.loading = true;

                custodyMovementService.getCustodyForEdit({ id: custodyMovementId })
                    .then(function (response) {
                        vm.custodyList = response.data;
                        var refNo = vm.custodyList.inMovement.refNo;
                        if (vm.custodyList.inMovement.refNo) {
                            return custodyMovementService.getManualAgreementNo(refNo);
                        }
                    })
                    .then(function (response) {
                        vm.custodyList.manualAgreementNo = response.data;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }
    ]);
