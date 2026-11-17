// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:407068-407301
appModule.controller('tenant.views.ers.quotation.createOrEditModal', ['$uibModal', '$uibModalInstance', 'utilities',
        'abp.services.app.directory', 'abp.services.app.commonLookup', 'abp.services.app.chargesSetting', 'abp.services.app.quotation', 'quotationId', 'abp.services.app.eRSTariff', 'tariffHelperERS',
        function ($uibModal, $uibModalInstance, utilities, directoryService, lookupService, chargesSettingService, quotationService, quotationId, tariffService, tariffHelperERS) {
            var vm = this;
            vm.customers = [];

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            var tariffLines = [];

            vm.quotation = {
                quotationLines: []
            };

            if (quotationId)
                vm.quotation.type = 3;


            vm.quotationTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 }
            ];

            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.getRateType = function () {
                if (vm.quotation.type == 1) {
                    vm.rateType = rateTypes.perDay;
                }
                else if (vm.quotation.type == 2) {
                    vm.rateType = rateTypes.perWeek;
                }
                else if (vm.quotation.type >= 3) {
                    vm.rateType = rateTypes.perMonth;
                }
            };

            function loadTariffLines() {
                var agreementCategory = 7;
                if (vm.quotation.type >= 4) // if Type is lease or lease to own
                    agreementCategory = 8;
                tariffService.getTariff({ agreementCategory: agreementCategory, agreementType: vm.quotation.type }).success(function (result) {
                    tariffLines = result.items;
                    if (vm.quotation.quotationLines) {
                        angular.forEach(vm.quotation.quotationLines, function (line) {
                            vm.vehicleTypeChanged(line);
                        });
                    }
                });
            }

            vm.vehicleTypeChanged = function (line) {
                if (line.vehicleTypeId)
                    applyTariff(line);
            }
            function applyTariff(line) {

                if (!(tariffLines.length > 0))
                    return;
                var agreementCategory = 7;
                if (vm.quotation.type >= 4) // if Type is lease or lease to own
                    agreementCategory = 8;
                var tariffLinesToPass = tariffLines.filter(e => e.tariffGroupId == line.vehicleTypeId);
                tariffHelperERS.applyTariffQuotation(line, tariffLinesToPass, agreementCategory, vm.quotation.type);
            };



            vm.quotationTypeChanged = function () {
                loadChargesSettings(true);
            };

            function loadChargesSettings(loadTariff) {
                vm.loading = true;

                var module = 7;
                if (vm.quotation.type >= 4) // if Type is lease or lease to own
                    module = 8;

                chargesSettingService.getChargesSettings({ module: module }).success(function (data) {
                    vm.chargesSettings = data.items;
                    vm.getTariffGroups();


                    if (vm.quotation.quotationLines && vm.quotation.quotationLines.length > 0) {
                        vm.quotation.quotationLines.forEach(row => {
                            row.extrasLines = angular.copy(vm.chargesSettings);
                            row.extrasLines.forEach(chargesRow => {
                                if (chargesRow.rateTypeId === 1 || chargesRow.rateTypeId === 2 || chargesRow.rateTypeId === 3) {
                                    if (vm.quotation.type === 1) {
                                        chargesRow.rateTypeId = rateTypes.perDay.id;
                                        chargesRow.rateType = rateTypes.perDay;
                                    }
                                    else if (vm.quotation.type === 2) {
                                        chargesRow.rateTypeId = rateTypes.perWeek.id;
                                        chargesRow.rateType = rateTypes.perWeek;
                                    }
                                    else if (vm.quotation.type >= 3) {
                                        chargesRow.rateTypeId = rateTypes.perMonth.id;
                                        chargesRow.rateType = rateTypes.perMonth;
                                    }
                                }
                            });
                            vm.currentExtrasLines = angular.copy(row.extrasLines);
                        });
                    }

                    if (loadTariff)
                        loadTariffLines();
                }).finally(function () {
                    vm.loading = false;
                });
            };


            function quotationLineObject() {
                var line = new Object();
                line.tariffGroupId = null;
                line.tariffGroup = null;
                line.quantity = null;
                var copyOfChargesSetting = angular.copy(vm.chargesSettings);
                line.extrasLines = vm.currentExtrasLines;
                //line.extrasLines.push(...vm.chargesSettings);
                return line;
            }

            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search contact popup
            vm.searchContactPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.quotation.customer = customer;
                        vm.quotation.customerId = customer.id;
                    }
                });
            };

            vm.getTariffGroups = function () {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.vehicleTypes = data.items;
                });
            };

            vm.getStatus = function (code) {
                if (code === 1)
                    return "Open";
                else if (code === 2)
                    return "Approved";
                else if (code === 3)
                    return "Rejected";
                else
                    return "Open";
            };

            //Add row
            vm.addRow = function () {
                vm.quotation.quotationLines.push(quotationLineObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.quotation.quotationLines.indexOf(obj);
                vm.quotation.quotationLines.splice(index, 1);

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;

                vm.getTariffGroups();
                quotationService.getQuotationForEdit({ id: quotationId }).success(function (data) {
                    vm.quotation = data;
                    if (!vm.quotation.id) {
                        vm.quotation.type = 1;
                        loadChargesSettings();
                        vm.addRow();
                    }
                }).finally(function () {
                    vm.loading = false;
                });

            }

            vm.save = function () {

                vm.saving = true;

                quotationService.createOrUpdateQuotation({ quotation: vm.quotation }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            init();

        }]);
