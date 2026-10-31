// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:406835-407031
appModule.controller('tenant.views.ers.masterAgreements.viewModal', ['$uibModalInstance', '$uibModal', 'utilities', 'agreementId', 'abp.services.app.masterAgreement', 'abp.services.app.chargesSetting',
        function ($uibModalInstance, $uibModal, utilities, agreementId, masterAgreementService, chargesSettingService) {
            var vm = this;
            vm.customers = [];

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 }
            ];

            vm.getAgreementType = function (id) {
                if (id == 1)
                    return vm.localize("Daily")
                if (id == 2)
                    return vm.localize("Weekly")
                if (id == 3)
                    return vm.localize("Monthly")
                if (id == 4)
                    return vm.localize("Lease")
                if (id == 5)
                    return vm.localize("LeaseToOwn")
            }
            vm.getPeriodType = function (id) {
                if (id == 1)
                    return "Days"
                if (id == 2)
                    return "Weeks"
                if (id >= 3)
                    return "Months"
            }
            vm.getAgreementStatus = function (id) {
                if (id === 1)
                    return "Open";
                else if (id === 2)
                    return "Closed";
                else if (id === 3)
                    return "Cancelled";
            };

            vm.viewAgreement = function (line) {
                if (vm.masterAgreement.quotation.type >= 4)
                    openViewLeaseAgreementModal(line.id);
                else
                    openViewAgreementModal(line.id);
            };

            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/rental/agreements/viewModal.cshtml',
                    controller: 'tenant.views.ers.rental.agreements.viewModal as vm',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            };

            function openViewLeaseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/lease/agreements/viewModal.cshtml',
                    controller: 'tenant.views.ers.lease.agreements.viewModal as vm',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }

            vm.createIndividaulAgreement = function (quotationLine) {
                if (vm.masterAgreement.quotation.type >= 4)
                    openCreateOrEditLeaseAgreementModal(quotationLine);
                else
                    openCreateOrEditAgreementModal(quotationLine);
            };

            function openCreateOrEditAgreementModal(quotationLine) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/rental/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.ers.rental.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                chargesSettings: vm.chargesSettings,
                                masterAgreementId: vm.masterAgreement.id,
                                date: vm.masterAgreement.date,
                                agreementType: vm.masterAgreement.quotation.type,
                                customerId: vm.masterAgreement.quotation.customerId,
                                customer: vm.masterAgreement.quotation.customer,
                                chargesLines: quotationLine.extrasLines,

                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            function openCreateOrEditLeaseAgreementModal(quotationLine) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/lease/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.ers.lease.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                chargesSettings: vm.chargesSettings,
                                masterAgreementId: vm.masterAgreement.id,
                                date: vm.masterAgreement.date,
                                agreementType: vm.masterAgreement.quotation.type,
                                customerId: vm.masterAgreement.quotation.customerId,
                                customer: vm.masterAgreement.quotation.customer,
                                chargesLines: quotationLine.extrasLines,

                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            function getChargesSettings() {
                vm.loading = true;
                var module = 7;
                if (vm.masterAgreement.quotation.type >= 4) // if Type is lease or lease to own
                    module = 8;
                chargesSettingService.getChargesSettings({ module: module }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.loading = true;
                masterAgreementService.getMasterAgreementForView({ id: agreementId })
                    .success(function (data) {
                        vm.loading = false;
                        vm.masterAgreement = data;
                        vm.quotationType = vm.agreementTypes.filter(e => e.id == vm.masterAgreement.quotation.type)[0].type;

                        vm.extraHours = vm.masterAgreement.quotation.quotationLines[0].extrasLines.filter(e => e.chargesTypeId == 68)[0];   // filtering extra hours limit out of extraslines
                        vm.mobilizationCharges = vm.masterAgreement.quotation.quotationLines[0].extrasLines.filter(e => e.chargesTypeId == 26)[0];   // filtering mobilization charges out of extraslines
                        vm.period = vm.masterAgreement.quotation.quotationLines[0].years;

                        getChargesSettings();
                    }).finally(function () {

                    });

            }

            init();

        }]);
