// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:407304-407685
appModule.controller('tenant.views.ers.quotation.createOrEditModal', ['$uibModal', '$uibModalInstance', 'utilities',
        'abp.services.app.directory', 'abp.services.app.commonLookup', 'abp.services.app.chargesSetting',
        'abp.services.app.quotation', 'quotationId', 'abp.services.app.eRSTariff', 'tariffHelperERS', 'isRevised', 'abp.services.app.vehicleModel',
        function ($uibModal, $uibModalInstance, utilities, directoryService, lookupService, chargesSettingService,
            quotationService, quotationId, tariffService, tariffHelperERS, isRevised, vehicleModelService) {
            var vm = this;
            vm.customers = [];
            vm.isRevised = isRevised;
            vm.revisedQuotationId = quotationId;
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


            vm.extraHours = {
                chargesTypeId: 68,
                limit: 0,
                rateTypeId: 7,
            };

            vm.mobilizationCharges = {
                chargesTypeId: 26,
                limit: 0,
                rate: 0,
                rateTypeId: 6
            };

            vm.quotationTypes = [
                { type: vm.localize("Daily"), id: 1 },
                { type: vm.localize("Weekly"), id: 2 },
                { type: vm.localize("Monthly"), id: 3 },
                { type: vm.localize("Lease"), id: 4 },
                { type: vm.localize("LeaseToOwn"), id: 5 }
            ];

            vm.getPeriodType = function (id) {
                if (id == 1)
                    return "Days";
                if (id == 2)
                    return "Weeks";
                if (id >= 3)
                    return "Months";
            }
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

            //function loadChargesSettings(loadTariff) {
            //    vm.loading = true;

            //    var module = 7;
            //    if (vm.quotation.type >= 4) // if Type is lease or lease to own
            //        module = 8;

            //    chargesSettingService.getChargesSettings({ module: module }).success(function (data) {
            //        vm.chargesSettings = data.items;
            //        vm.getTariffGroups();

            //        vm.commonCharges = angular.copy(vm.chargesSettings);

            //        //if (vm.quotation.quotationLines && vm.quotation.quotationLines.length > 0) {
            //        //    vm.quotation.quotationLines.forEach(row => {
            //        //        row.extrasLines = angular.copy(vm.chargesSettings);
            //        //        row.extrasLines.forEach(chargesRow => {
            //        //            if (chargesRow.rateTypeId === 1 || chargesRow.rateTypeId === 2 || chargesRow.rateTypeId === 3) {
            //        //                if (vm.quotation.type === 1) {
            //        //                    chargesRow.rateTypeId = rateTypes.perDay.id;
            //        //                    chargesRow.rateType = rateTypes.perDay;
            //        //                }
            //        //                else if (vm.quotation.type === 2) {
            //        //                    chargesRow.rateTypeId = rateTypes.perWeek.id;
            //        //                    chargesRow.rateType = rateTypes.perWeek;
            //        //                }
            //        //                else if (vm.quotation.type >= 3) {
            //        //                    chargesRow.rateTypeId = rateTypes.perMonth.id;
            //        //                    chargesRow.rateType = rateTypes.perMonth;
            //        //                }
            //        //            }
            //        //        });
            //        //        vm.currentExtrasLines = angular.copy(row.extrasLines);
            //        //    });
            //        //}

            //        //if (loadTariff)
            //        //    loadTariffLines();
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};


            function quotationLineObject() {
                var line = new Object();
                line.tariffGroupId = null;
                line.tariffGroup = null;
                line.quantity = null;
                line.cost = null;
                line.extras = null;
                line.extrasLines = [];
                //line.extrasLines.push(...vm.chargesSettings);
                return line;
            }
            function extrasLineObject() {
                var obj = new Object();
                obj.vehicleModelId = null;
                obj.vehicleModel = null;
                obj.vehicleModelId = null;
                obj.vehicleModel = null;
                obj.chargesTypeId = 71;
                obj.rateTypeId = 1;

                return obj;
            }
            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchContactPerson = function ($select) {
                //whereas contactCategory: 2 (company), contactType: 1 (staff)
                directoryService.getContactsByCompanyId({ id: vm.quotation.customer.id }).then(function (response) {
                    vm.contactPersons = response.data;
                });
            };

            vm.customerChanged = function () {
                vm.quotation.customerId = vm.quotation.customer.id;
                vm.quotation.contactPerson = null;
                vm.quotation.contactPersonId = null;
                vm.contactPersons = [];
                vm.searchContactPerson();
            }
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

            vm.modelSelected = function (line) {
                checkDuplicateMakeModelAndVehicleType(line);
            };

            vm.vehicleTypeChanged = function (line) {
                checkDuplicateMakeModelAndVehicleType(line);
            };

            function checkDuplicateMakeModelAndVehicleType(line) {
                if (line.vehicleTypeId && line.vehicleModelId) {
                    var foundLines = vm.quotation.quotationLines.filter(e => e.vehicleTypeId == line.vehicleTypeId && e.vehicleModelId == line.vehicleModelId);
                    if (foundLines.length > 1) {
                        abp.message.info("duplicate type and make model");
                        line.vehicleTypeId = null;
                        line.vehicleModelId = null;
                        line.vehicleType = null;
                        line.vehicleModel = null;
                    }
                }
            }

            vm.searchModel = function ($select) {
                return vehicleModelService.searchVehicleModelsNew({ name: $select.search }).then(function (response) {
                    vm.models = response.data.items;
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

            //Add attachment row
            vm.addAttachementRow = function (line) {
                line.extrasLines.push(extrasLineObject());
            };

            //Remove attachement row
            vm.removeAttachmentRow = function (obj, line) {
                var index = line.extrasLines.indexOf(obj);
                line.extrasLines.splice(index, 1);

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;

                vm.getTariffGroups();

                lookupService.getLocations()
                    .success(r => {
                        vm.locations = r.items;
                    });

                var createOrRevise = null;

                if (isRevised)
                    createOrRevise = quotationService.getQuotationForRevision({ id: quotationId });
                else
                    createOrRevise = quotationService.getQuotationForEdit({ id: quotationId });

                createOrRevise.success(function (data) {
                    vm.quotation = data;
                    if (!vm.quotation.id && !isRevised) {
                        vm.quotation.type = 1;
                        //loadChargesSettings();
                        vm.addRow();
                    }
                    else {
                        if (vm.quotation.quotationLines[0].extrasLines.some(e => e.chargesTypeId == 68)) // filtering extra hours limit out of extraslines
                            vm.extraHours = vm.quotation.quotationLines[0].extrasLines.find(e => e.chargesTypeId == 68);

                        if (vm.quotation.quotationLines[0].extrasLines.some(e => e.chargesTypeId == 26))
                            vm.mobilizationCharges = vm.quotation.quotationLines[0].extrasLines.find(e => e.chargesTypeId == 26);   // filtering mobilization charges out of extraslines

                        vm.period = vm.quotation.quotationLines[0].years;
                    }
                }).finally(function () {
                    vm.loading = false;
                });

            }

            vm.save = function () {

                vm.saving = true;

                vm.quotation.quotationLines.forEach(e => {
                    var rentRow = {
                        chargesTypeId: 1,
                        rate: e.extras,
                        excessRate: e.cost,
                        rateTypeId: 1
                    };
                    var demobilizationCharges = {
                        chargesTypeId: 27,
                        limit: 0,
                        rate: vm.mobilizationCharges.rate,
                        rateTypeId: 6
                    };

                    if (!e.extrasLines)
                        e.extrasLines = [];
                    e.extrasLines = e.extrasLines.filter(el => el.chargesTypeId == 71); // attachment CHarges
                    //e.extrasLines = [rentRow, vm.extraHours, vm.mobilizationCharges, demobilizationCharges]; //pushing extra hours and mobilization charges to extraslines in quotation lines
                    e.extrasLines.push(rentRow);
                    e.extrasLines.push(vm.extraHours);
                    e.extrasLines.push(vm.mobilizationCharges);
                    e.extrasLines.push(demobilizationCharges);

                    e.years = vm.period;
                });

                //vm.quotation.isRevised = isRevised;
                //if (isRevised) {
                //    vm.quotation.id = 0;
                //}
                var createOrRevise = null;
                if (isRevised)
                    createOrRevise = quotationService.reviseQuotation({ quotation: vm.quotation, revisedQuotationId: vm.revisedQuotationId });
                else
                    createOrRevise = quotationService.createOrUpdateQuotation({ quotation: vm.quotation });

                createOrRevise.success(function () {

                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            init();

        }]);
