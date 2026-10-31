// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:400228-400749
appModule.controller('tenant.views.ers.deliveries.createOrEditModal', [
        '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'equipmentChargesCalculator', 'tariffHelperERS', 'abp.services.app.equipmentDelivery',
        'abp.services.app.directory', 'options', 'abp.services.app.designation', 'abp.services.app.synch',
        function ($filter, utilities, $uibModal, $uibModalInstance, equipmentChargesCalculator, tariffHelperERS, equipmentDeliveryService,
            directoryService, options, designationService, synchAppService) {

            var vm = this;
            var agreementId = options.agreementId;
            var chargesSettings = options.chargesSettings;
            var chargesLines = options.chargesLines;
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            var enableFutureAgreementCheckOuts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableFutureAgreementCheckOuts"))
            vm.taxAccepted = false;
            vm.loading = false;
            vm.tariffGroupId = null;
            vm.tariffGroup = null;
            vm.searchOtherGroupsVehicle = false;
            vm.chargesSettings = chargesSettings;

            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            var isValid = true;
            vm.discountCodeId = null;
            var errorMessage = {};
            var isTariffEnabled = abp.features.isEnabled("ERS.Rental.Tariff");
            vm.discountAuthCode = null;
            var agreementCategory = 7; //ERS Rental
            vm.isTotalDaysAndHrs = false;
            vm.isIndividualCustomerRadio = true;
            var notLoadTariff = false;
            vm.vehicleOwnership = 1;
            vm.checklistItems = null;
            vm.allSelected = false;

            vm.agreementTypes = [
                { type: app.localize("Daily"), id: 1 },
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

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            ////date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            //var startDateLoaded = false;
            //vm.startDateChanged = function () {

            //    //don't apply tariff in edit mode
            //    if (isTariffEnabled && !vm.isEditMod && !notLoadTariff && startDateLoaded)
            //        tariffHelperERS.applyTariff(vm.agreement);
            //    startDateLoaded = true;
            //};


            vm.agreementTypeSelected = function () {
                //convert time based rates to corresponding rate type based on selected agreement type
                for (var i = 0; i < vm.agreement.charges.length; i++) {
                    if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
                        if (vm.agreement.agreementType == 2) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
                            vm.agreement.charges[i].rateType = rateTypes.perWeek;
                        }
                        else if (vm.agreement.agreementType == 3 || vm.agreement.agreementType == 4 || vm.agreement.agreementType == 5) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perMonth.id;
                            vm.agreement.charges[i].rateType = rateTypes.perMonth;
                        } else {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perDay.id;
                            vm.agreement.charges[i].rateType = rateTypes.perDay;
                        }
                    }
                }
                if (!notLoadTariff) {
                    var groupId = vm.agreement.vehicle.tariffGroupId;
                    if (groupId == null) groupId = -1;

                    if (isTariffEnabled) {
                        vm.loading = true;
                        tariffHelperERS.loadTariff(groupId, agreementCategory, function () {
                            tariffHelperERS.applyTariff(vm.agreement);
                            vm.loading = false;
                        }, vm.agreement.agreementType);
                    }
                }
            };

            vm.searchSupplier = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = [];
                    vm.suppliersTemp = response.data.items;

                    if (vm.suppliersTemp) {
                        vm.suppliersTemp.forEach(s => {
                            var obj = new Object();
                            obj.id = s.id;
                            obj.name = s.name;
                            obj.code = s.code;
                            vm.suppliers.push(obj);
                        });
                    }



                });
            };

            function designationDetails() {
                designationService.getDesignations().success(function (result) {
                    vm.operators = result.items;
                });
            };



            //vm.searchSupplierPopoup = function () {
            //    var modalInstance = openSearchContactModel(null, 3);

            //    modalInstance.result.then(function (result) {
            //        if (result != null)
            //            vm.agreement.insuranceCompany = result;
            //    });
            //};


            // Validating CreateOrUpdateAgreement 
            function validate() {
                errorMessage = '';
                errorMessage = 'Agreement Can Not Be Saved Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }
                if (vm.agreement.movements[0].outDetail.dateTime > moment().endOf('day') && !enableFutureAgreementCheckOuts) {
                    isValid = false;
                    errorMessage = errorMessage + '\n Agreement Out Date Can not less than Current Date';
                }
                if (vm.agreement.endDate != null) {
                    if (vm.agreement.movements[0].outDetail.dateTime > vm.agreement.endDate) {
                        isValid = false;
                        errorMessage = errorMessage + '\n Return Date can not  less than Out Date ';
                    }
                }

            }

            vm.save = function () {
                vm.saving = true;
                validate();
                save();
            };

            function save() {

                vm.saving = true;

                if (isValid) {
                    //update ids for selected records
                    vm.agreement.vehicleId = vm.agreement.vehicle.id;
                    vm.agreement.customerId = vm.agreement.customer.id;

                    //if (vm.agreement.customer.contactCategory != 2)
                    //    vm.agreement.poNo = null;

                    if (vm.agreement.salesPerson != null)
                        vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
                    else
                        vm.agreement.salesPersonId = null;

                    if (!vm.agreement.customer.contactCategory == 2 && !vm.isSaleOrderEnabled) {
                        vm.agreement.saleOrderId = null;
                    }

                    // pass charges which rate are greater than zero

                    vm.agreement.charges = vm.agreement.charges.filter(e => e.rate > 0);

                    vm.agreement.startDate = moment(vm.agreement.startDate).set({ second: 0, millisecond: 0 });
                    vm.agreement.movements[0].outDetail.dateTime = moment(vm.agreement.movements[0].outDetail.dateTime).set({ second: 0, millisecond: 0 });

                    vm.agreement.movements[0].outCheckList = vm.checklistItems.filter(e => e.isSelected);

                    equipmentDeliveryService.createOrUpdateAgreement({
                        agreement: vm.agreement,
                        discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                    }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.agreement.id = result;
                        $uibModalInstance.close(vm.agreement.id);
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function loadChargesFromSettings() {
                //navigation charges settings and add charges rows in agreement charges list
                for (var i = 0; i < vm.chargesSettings.length; i++) {

                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: vm.chargesSettings[i].chargesTypeId
                    }, true);



                    if (foundLines.length == 0) {

                        var chargesRow = {
                            agreementId: null,
                            order: vm.chargesSettings[i].order,
                            chargesTypeId: vm.chargesSettings[i].chargesTypeId,
                            rateTypeId: vm.chargesSettings[i].rateTypeId,
                            discountPercent: 0,
                            rate: null,
                            units: null,
                            charges: null,
                            applyOnClosing: vm.chargesSettings[i].applyOnClosing,
                            isMandatory: vm.chargesSettings[i].isMandatory,
                            taxable: vm.chargesSettings[i].taxable,
                            accepted: ((vm.chargesSettings[i].chargesType.chargesCategory == 2 || vm.chargesSettings[i].chargesType.chargesCategory == 3 || vm.chargesSettings[i].chargesType.chargesCategory == 4) ? false : true),
                            included: false,
                            excessRate: null,
                            limit: null,
                            chargesType: vm.chargesSettings[i].chargesType,
                            rateType: vm.chargesSettings[i].rateType,
                            tariff: []
                        };

                        if (chargesRow.chargesTypeId == 70) {
                            chargesRow.accepted = true;
                        }

                        if (chargesLines && chargesLines.length > 0) {
                            if (chargesLines.some(e => e.chargesTypeId == chargesRow.chargesTypeId)) {
                                if (chargesRow.chargesTypeId != 71) {
                                    var filteredRow = chargesLines.filter(e => e.chargesTypeId == chargesRow.chargesTypeId)[0];
                                    chargesRow.rate = filteredRow.rate;
                                    chargesRow.limit = filteredRow.limit;
                                    if (chargesRow.chargesTypeId == 1)
                                        chargesRow.rate = vm.disableOperator ? filteredRow.rate : filteredRow.excessRate;

                                    if (chargesRow.rate > 0 || chargesRow.chargesTypeId == 70 || chargesRow.chargesTypeId == 71) {
                                        chargesRow.accepted = true;
                                    }
                                }
                                else {
                                    var attachmentRows = chargesLines.filter(e => e.chargesTypeId == chargesRow.chargesTypeId);
                                    attachmentRows.forEach(attachment => {
                                        var attachmentRow = angular.copy(chargesRow);
                                        attachmentRow.rate = attachment.rate;
                                        attachmentRow.vehicleId = attachment.vehicleId;
                                        attachmentRow.accepted = true;

                                        vm.agreement.charges.push(attachmentRow);
                                    });
                                }
                            }
                        }
                        vm.agreement.charges.push(
                            chargesRow
                        );
                    }
                }
            }

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;
            };

            vm.disableRate = function (chargesRow) {
                if (chargesRow.tariff.length > 1) {
                    var foundLines = $filter('filter')(chargesRow.tariff, {
                        included: chargesRow.included,
                        rate: chargesRow.rate,
                        excessRate: chargesRow.excessRate,
                        limit: chargesRow.limit
                    }, true);
                    if (foundLines.length > 0) {
                        return foundLines[0].rate > 0;
                    }
                    else {
                        return false;
                    }
                }

                return chargesRow.tariff[0].rate > 0;
            };

            vm.calculate = function () {
                if (vm.agreement == null) return 0;

                vm.hideCharges = false;
                if (vm.agreement.operator1Type == 6 && vm.agreement.operator2Type == 6) {
                    vm.hideCharges = true;
                }

                if (vm.agreement && vm.agreement.charges) {
                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: 1
                    }, true);

                    if (foundLines.length == 1) {

                        if (chargesLines.some(e => e.chargesTypeId == 1)) {
                            //var rentRow = chargesLines.filter(e => e.chargesTypeId == 1)[0];
                            var rentRow = chargesLines.find(e => e.chargesTypeId == 1);
                            foundLines[0].rate = vm.hideCharges ? rentRow.rate : rentRow.excessRate;
                        }

                        foundLines[0].rentalRate = foundLines[0].rate;
                        if (vm.agreement.charges.some(e => e.chargesTypeId == 70)) {
                            //var operatorRow = vm.agreement.charges.filter(e => e.chargesTypeId == 70)[0];
                            var operatorRow = vm.agreement.charges.find(e => e.chargesTypeId == 70);
                            foundLines[0].rate = foundLines[0].rentalRate - operatorRow.rate;
                            vm.operatorCharges = operatorRow.charges;
                            vm.operatorCharges = utilities.round(vm.operatorCharges, 2);
                        }

                        if (vm.agreement.charges.some(e => e.chargesTypeId == 71)) {
                            var attachmentTotalCharges = 0.0;
                            vm.agreement.charges.filter(e => e.chargesTypeId == 71).forEach(e => { attachmentTotalCharges += e.rate; });
                            foundLines[0].rate = foundLines[0].rate - attachmentTotalCharges;
                        }

                    }
                    if (vm.agreement.charges.some(e => e.chargesTypeId == 68)) {
                        //var extraHourRow = vm.agreement.charges.filter(e => e.chargesTypeId == 68)[0];
                        var extraHourRow = vm.agreement.charges.find(e => e.chargesTypeId == 68);
                        var operatorCharges = vm.agreement.charges.find(e => e.chargesTypeId == 70);
                        var attachmentCharges = 0.0;
                        vm.agreement.charges.filter(e => e.chargesTypeId == 71).forEach(e => { attachmentCharges += e.rate; });
                        var rateForCalculation = foundLines[0].rate + attachmentCharges;
                        if (operatorCharges)
                            rateForCalculation += operatorCharges.rate;
                        extraHourRow.rate = rateForCalculation / extraHourRow.limit;

                        if (vm.agreement.customer.verified)
                            extraHourRow.rate = utilities.getFlooredFixed(extraHourRow.rate, 3);
                        else
                            extraHourRow.rate = utilities.round(extraHourRow.rate, 2);
                    }


                }
                return equipmentChargesCalculator.calculate(vm.agreement);
            };

            vm.totalDaysAndTime = function () {
                var startDate = moment(vm.agreement.movements[0].outDetail.dateTime, "DD/MM/YYYY hh:mm");
                var endDate = moment(vm.agreement.endDate, "DD/MM/YYYY hh:mm");

                if (startDate.isValid() && endDate.isValid()) {

                    vm.isTotalDaysAndHrs = true;
                    var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                    vm.remainingHrs = utilities.round(duration.hours() + (duration.minutes() / 60), 2);
                }
                else {
                    vm.isTotalDaysAndHrs = false;
                }
            };

            function getAllChecklistItems() {
                vm.loading = true;
                synchAppService.getAllCheckListItems()
                    .success(function (result) {
                        vm.checklistItems = result;
                    }).finally(function () { vm.loading = false; });
            }

            vm.selectAllChange = function () {
                if (vm.checklistItems)
                    vm.checklistItems.forEach(e => e.isSelected = vm.allSelected);
            };

            function initFromMasterAgreement() {
                vm.loading = true;
                equipmentDeliveryService.getEquipmentDeliveryForEdit({
                    id: null
                }).success(function (result) {
                    vm.agreement = result.equipmentDelivery;
                    vm.agreement.masterAgreementId = options.masterAgreement.id;
                    vm.agreement.masterAgreement = options.masterAgreement;
                    vm.agreement.customerId = options.masterAgreement.quotation.customerId;
                    vm.agreement.customer = options.masterAgreement.quotation.customer;
                    vm.agreement.vehicle = options.schedule.vehicle;
                    vm.agreement.vehicleId = options.schedule.vehicleId;
                    vm.agreement.flightDateTime = options.schedule.expectedDeliveryDate;
                    vm.agreement.agreementType = options.masterAgreement.quotation.type;
                    vm.agreement.movements[0].outDetail.dateTime = options.masterAgreement.date;
                    vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.km = options.schedule.kMs;
                    vm.agreement.poNo = options.masterAgreement.poNo;
                    vm.agreement.vehicle.tariffGroup = options.schedule.vehicleType;
                    vm.agreement.vehicle.tariffGroupId = options.schedule.vehicleTypeId;

                    vm.vehicleOwnership = 1;
                    notLoadTariff = true;
                    //vm.disableOperator = true;
                    vm.showOperators = true;
                    vm.agreement.operator1Type = 2;
                    vm.agreement.operator2Type = 2;
                    if (!options.schedule.withOperator) {
                        vm.showOperators = false;
                        //vm.disableOperator = false;
                        vm.agreement.operator1Type = 6;
                        vm.agreement.operator2Type = 6;
                    }
                    //var rentalRow = chargesLines.filter(e => e.chargesTypeId == 1)[0];
                    //if (rentalRow.rate > 0 && !rentalRow.excessRate) {
                    //    vm.disableOperator = true;
                    //    vm.hideCharges = true;
                    //    vm.agreement.operator1Type = 6;
                    //    vm.agreement.operator2Type = 6;
                    //}

                    loadChargesFromSettings();
                    vm.agreementTypeSelected();
                    getAllChecklistItems();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                    vm.calculate();
                    vm.loading = false;
                });
            };

            //function init() {
            //    vm.loading = true;
            //    equipmentDeliveryService.getEquipmentAgreementForEdit({
            //        id: agreementId
            //    }).success(function (result) {

            //        vm.agreement = result.agreement;
            //        if (vm.agreement.vehicle != null) {
            //            vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
            //        }

            //        if (vm.agreement.id > 0 || vm.agreement.bookingId > 0) {
            //            vm.isEditMod = true;
            //            vm.tariffGroupId = vm.agreement.tariffGroupId;
            //            vm.tariffGroup = vm.agreement.tariffGroup;
            //            vm.agreementTaxPercent = vm.agreement.taxPercent;
            //            vm.vehicleOwnership = vm.agreement.vehicle.ownership;
            //            if (vm.agreement.vehicle)
            //                vm.searchOtherGroupsVehicle = vm.agreement.tariffGroupId != vm.agreement.vehicle.tariffGroupId;

            //            /* Dont load or apply tariff in edit mode
            //            //in edit mod load tariff for vehicle. which will be used if some parameter is changed like dates etc.
            //            */


            //            if (vm.agreement.customer.contactCategory == 1) {
            //                vm.isIndividualCustomerRadio = true;
            //            }
            //            else if (vm.agreement.customer.contactCategory == 2) {
            //                vm.isIndividualCustomerRadio = false;
            //            }

            //        } else {
            //            if (vm.agreement.vehicle != null) {
            //                vm.vehicleOwnership = 1;
            //            }
            //            else {
            //                vm.vehicleOwnership = 1;
            //            }
            //            vm.agreement.agreementNo = null;
            //            vm.isEditMod = false;
            //        }

            //        loadChargesFromSettings();

            //        vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;

            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}

            designationDetails();
            function initAgreement() {
                if (options.masterAgreement)
                    initFromMasterAgreement();
                //else
                //    init();
            }
            initAgreement();

        }
    ]);
