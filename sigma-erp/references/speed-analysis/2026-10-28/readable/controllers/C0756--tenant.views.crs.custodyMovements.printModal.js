// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:196010-196064
appModule.controller('tenant.views.crs.custodyMovements.printModal', ['custodyMovementId', '$uibModalInstance', 'abp.services.app.custody', 'utilities', 'abp.services.app.commonLookup', 'appSession',
        function (custodyMovementId, $uibModalInstance, custodyMovementService, utilities, commonLookupService, appSession) {

            var vm = this;
            vm.loading = false;
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
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
                commonLookupService.getLocations({}).success(function (data) {
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
                custodyMovementService.getCustodyForPrint({ id: custodyMovementId }
                ).then(function (result) {
                    vm.custodyList = result.data;
                    var refNo = vm.custodyList.inMovement.refNo;
                    if (vm.custodyList.inMovement.refNo) {
                        return custodyMovementService.getManualAgreementNo(refNo);
                    }
                }).then(function (response) {
                    vm.custodyList.manualAgreementNo = response.data;
                })
                .finally(function () {
                vm.loading = false;
                });
            }

            init();
        }
    ]);
