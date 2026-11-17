// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:177497-177616
appModule.controller('tenant.views.crs.chauffeur.agreements.replaceDriverModal', [ 'agreementId', 'abp.services.app.chauffeurAgreement',
        'abp.services.app.commonAgreement', '$uibModalInstance', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        function (agreementId, chauffeurAgreementService, commonAgreementService, $uibModalInstance, commonLookupService, directoryService) {

            var vm = this;
            vm.loading = false;
            vm.agreement = null;
            vm.inMovement = null;
            vm.outMovement = null;
            vm.locations = [];
            var isValid = true;
            var errorMessage = {};

            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

           

            vm.getAgreementTypeName = function (agreementType) {
                if (agreementType == null)
                    return "";

                if (agreementType == 1) {
                    return "Daily";
                } else if (agreementType == 2) {
                    return "Weekly";
                } else if (agreementType == 3) {
                    return "Monthly";
                } else {
                    return "";
                }
            };

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
                $uibModalInstance.dismiss();
            };

            
            function validate() {
                errorMessage = '';
                errorMessage = 'Agreement Can Not Be Saved Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }

                //var TimeFormat = moment.utc(vm.inDriver.outDateTime).toDate();
                //var outDriverDate = moment(vm.inDriver.outDateTime);
                if (moment(vm.inDriver.outDateTime) > moment(vm.outDriver.outDateTime)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n In Date can not less than Out Date ';
                }
            }

            vm.save = function () {
                vm.saving = true;

                validate();
                if (isValid) {

                    chauffeurAgreementService.replaceDriver({
                        agreementId: vm.agreement.id,
                        inDriver: vm.inDriver,
                        outDriver: vm.outDriver
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            };

            function init() {
                vm.loading = true;
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                commonAgreementService.getAgreementForDriverReplacement({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    vm.inDriver = vm.agreement.driverLogs[vm.agreement.driverLogs.length - 1];
                    
                    
                    vm.outDriver = null;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
