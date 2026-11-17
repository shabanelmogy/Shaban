// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:408937-409641
appModule.controller('tenant.views.ers.rental.agreements.createOrEditModal', [
        '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'equipmentChargesCalculator', 'tariffHelperERS', 'abp.services.app.equipmentRentalAgreement',
        'abp.services.app.vehicle', 'abp.services.app.directory', 'options',
        'abp.services.app.commonLookup', 'abp.services.app.agreementSaleOrder', 'abp.services.app.designation',
        function ($filter, utilities, $uibModal, $uibModalInstance, equipmentChargesCalculator, tariffHelperERS, agreementService,
            vehicleService, directoryService, options, lookupService,
            agreementSaleOrderService, designationService) {

            var vm = this;
            var agreementId = options.agreementId;
            var chargesSettings = options.chargesSettings;
            var chargesLines = options.chargesLines;
            vm.canChangeRates = abp.auth.hasPermission('Pages.ERS.Rental.Agreements.Edit.CanChangeRates');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.enableAdditionalNotes = utilities.parseBoolean(abp.setting.get("App.General.EnableAdditionalNotes"));
            vm.isSalesPersonRequired = utilities.parseBoolean(abp.setting.get("App.General.IsSalesPersonRequired"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isReturnDateRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReturnDateRequired"));
            var enableFutureAgreementCheckOuts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableFutureAgreementCheckOuts"))
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.taxAccepted = false;
            vm.saveAndPrint = false;
            vm.loading = false;
            vm.tariffGroupId = null;
            vm.tariffGroup = null;
            vm.searchOtherGroupsVehicle = false;
            vm.chargesSettings = chargesSettings;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.canOpenAgreementWithoutSaleOrder = abp.auth.hasPermission('Pages.ERS.Rental.Agreements.CanOpenAgreementWithoutSaleOrder');

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

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
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

            vm.searchGoogleLocations = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                lookupService.searchGooglePlaces({ keyWord: $select.search }).then(function (response) {
                    vm.geoLocations = response.data.items;
                });
            };

            vm.agreementTypeChange = function () {
                return;
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            ////date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            var startDateLoaded = false;
            vm.startDateChanged = function () {

                //don't apply tariff in edit mode
                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff && startDateLoaded)
                    tariffHelperERS.applyTariff(vm.agreement);
                startDateLoaded = true;
            };

            function openApplyDiscountModal(chargesRow) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/discountCodes/applyDiscountModal.cshtml',
                    controller: 'tenant.views.crs.discountCodes.applyDiscountModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                chargesRow: chargesRow,
                                discountAuthCode: vm.discountAuthCode
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.discountAuthCode = result.discountAuthCode;
                    chargesRow.discountPercent = result.chargesRow.discountPercent;
                    chargesRow.discountedRate = result.chargesRow.discountedRate;
                    chargesRow.rate = chargesRow.discountedRate > chargesRow.rate ? chargesRow.discountedRate : chargesRow.rate;
                });
            }

            vm.addExternalEquipmentPopup = function () {
                openAddExternalEquipmentModal();
            };

            function openAddExternalEquipmentModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/addExternalVehicle.cshtml',
                    controller: 'tenant.views.crs.vehicles.addExternalVehicle as vm',
                    backdrop: 'static',
                    size: 'sm'
                });
                modalInstance.result.then(function (vehicle) {
                    vm.agreement.vehicle = vehicle;
                    vm.vehicleOwnership = 2; // External vehicle
                });
            }

            vm.applyDiscount = function (chargesRow) {

                openApplyDiscountModal(chargesRow);
            };

            vm.agreementTypeSelected = function () {
                //convert time based rates to corresponding rate type based on selected agreement type
                for (var i = 0; i < vm.agreement.charges.length; i++) {
                    if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
                        if (vm.agreement.agreementType == 2) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
                            vm.agreement.charges[i].rateType = rateTypes.perWeek;
                        }
                        else if (vm.agreement.agreementType == 3) {
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

            var endDateLoaded = false;
            vm.endDateChanged = function () {
                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff && endDateLoaded)
                    tariffHelperERS.applyTariff(vm.agreement);
                endDateLoaded = true;
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                return vehicleService.searchVehicles({
                    plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses,
                    tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId, ownership: vm.vehicleOwnership
                }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeSalesPerson: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchSupplier = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            function designationDetails() {
                designationService.getDesignations().success(function (result) {
                    vm.operators = result.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                        vm.customerSelected();
                    }
                });
            };



            //vm.searchSupplierPopoup = function () {
            //    var modalInstance = openSearchContactModel(null, 3);

            //    modalInstance.result.then(function (result) {
            //        if (result != null)
            //            vm.agreement.insuranceCompany = result;
            //    });
            //};


            vm.vehicleSelected = function () {

                vm.agreement.movements[0].outDetail.fuelLevel = vm.agreement.vehicle.fuelLevel;
                vm.agreement.movements[0].outDetail.km = vm.agreement.vehicle.kMs;

                vm.agreement.movements[0].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;

                var groupId = vm.agreement.vehicle.tariffGroupId;
                if (groupId == null) groupId = -1;


                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff) {
                    vm.loading = true;
                    tariffHelperERS.loadTariff(groupId, agreementCategory, function () {
                        tariffHelperERS.applyTariff(vm.agreement);
                        vm.loading = false;
                    }, vm.agreement.agreementType);
                }
            };

            vm.customerSelected = function () {

                //if contact (i.e individual person)
                if (vm.agreement.customer.contactCategory == 1) {
                    vm.isCompany = false;
                    vm.isIndividualCustomerRadio = true;
                    //vm.individualCustomerRadioSelected();
                }
                if (vm.agreement.customer.contactCategory == 2) {
                    vm.isCompany = true;
                    vm.isIndividualCustomerRadio = false;
                    vm.agreement.driverType = 3;
                    //vm.individualCustomerRadioSelected();
                }
                if (vm.isEditMod && vm.agreementTaxPercent > 0) {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.agreementTaxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
                }
                else {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.taxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
                }
                vm.agreement.salesPerson = vm.agreement.customer.salesPerson;
                vm.agreement.salesPersonId = vm.agreement.customer.salesPerson != null ? vm.agreement.customer.salesPerson.id : null;

                vm.agreement.saleOrder = null;
                vm.agreement.saleOrderId = null;
            };

            vm.searchSaleOrders = function ($select) {
                if (!$select.search) return;

                return agreementSaleOrderService.searchSaleOrdersForAgreement({ keyword: $select.search, contactId: vm.agreement.customer.id }).then(function (response) {
                    vm.saleOrders = response.data.items;
                });
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            function openSearchVehicleModal() {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                fromDateTime: moment(vm.agreement.movements[0].outDetail.dateTime ? vm.agreement.movements[0].outDetail.dateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
                                tariffGroup: vm.searchOtherGroupsVehicle ? null : vm.tariffGroup,
                                tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId,
                                statusId: 'IDL',
                                subStatuses: [1, 7], //1: Available, 7: Ready to go
                                // source: 'openagreement',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.vehicle = result;
                        vm.vehicleSelected();
                    }
                });
            }

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }

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

                    if (vm.agreement.customer.contactCategory != 2)
                        vm.agreement.poNo = null;

                    if (vm.agreement.salesPerson != null)
                        vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
                    else
                        vm.agreement.salesPersonId = null;

                    if (!vm.agreement.customer.contactCategory == 2 && !vm.isSaleOrderEnabled) {
                        vm.agreement.saleOrderId = null;
                    }

                    vm.agreement.startDate = moment(vm.agreement.startDate).set({ second: 0, millisecond: 0 });
                    vm.agreement.movements[0].outDetail.dateTime = moment(vm.agreement.movements[0].outDetail.dateTime).set({ second: 0, millisecond: 0 });
                    if (vm.agreement.operator1Supplier) {
                        vm.agreement.operator1Supplier = {
                            id: vm.agreement.operator1Supplier.id,
                            name: vm.agreement.operator1Supplier.name,
                            code: vm.agreement.operator1Supplier.code
                        };
                    }
                    if (vm.agreement.operator2Supplier) {
                        vm.agreement.operator2Supplier = {
                            id: vm.agreement.operator2Supplier.id,
                            name: vm.agreement.operator2Supplier.name,
                            code: vm.agreement.operator2Supplier.code
                        };
                    }

                    agreementService.createOrUpdateAgreement({
                        agreement: vm.agreement,
                        discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                    }).success(function (result) {
                        if (!vm.saveAndPrint) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                        }
                        vm.agreement.id = result;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.agreement.id);
                        $uibModalInstance.close();
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
            var saveAndPrint = function (id) {
                //window.open('/Report#/tenant/printModalAgreement/' + id);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.agreements.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return id;
                        }
                    }
                });
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

                        if (chargesRow.chargesTypeId == 58) {
                            chargesRow.accepted = true;
                        }

                        if (chargesLines && chargesLines.length > 0) {
                            if (chargesLines.some(e => e.chargesTypeId == chargesRow.chargesTypeId)) {
                                var filteredRow = chargesLines.filter(e => e.chargesTypeId == chargesRow.chargesTypeId)[0];
                                chargesRow.rate = filteredRow.rate;
                                chargesRow.limit = filteredRow.limit;
                                if (chargesRow.chargesTypeId == 1)
                                    chargesRow.rate = vm.disableOperator ? filteredRow.rate : filteredRow.excessRate;

                                if (chargesRow.rate > 0 || chargesRow.chargesTypeId == 58) {
                                    chargesRow.accepted = true;
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
                        if (chargesLines && chargesLines.length > 0) {
                            if (chargesLines.some(e => e.chargesTypeId == 1)) {
                                var rentRow = chargesLines.filter(e => e.chargesTypeId == 1)[0];
                                foundLines[0].rate = vm.hideCharges ? rentRow.rate : rentRow.excessRate;
                            }
                        }


                        foundLines[0].rentalRate = foundLines[0].rate;
                        if (vm.agreement.charges.some(e => e.chargesTypeId == 58)) {
                            var operatorRow = vm.agreement.charges.filter(e => e.chargesTypeId == 58)[0];
                            foundLines[0].rentalRate = foundLines[0].rentalRate - operatorRow.rate;
                            vm.operatorCharges = operatorRow.charges;
                        }

                    }
                    if (vm.agreement.charges.some(e => e.chargesTypeId == 68)) {
                        var extraHourRow = vm.agreement.charges.filter(e => e.chargesTypeId == 68)[0];
                        extraHourRow.rate = foundLines[0].rate / extraHourRow.limit;
                    }


                }
                return equipmentChargesCalculator.calculate(vm.agreement);
            };

            vm.includedChanged = function (chargesRow) {
                if (chargesRow.included)
                    chargesRow.rate = 0;
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
            };

            vm.discountApplied = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
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

            function initFromMasterAgreement() {
                vm.loading = true;
                agreementService.getEquipmentAgreementForEdit({
                    id: null
                }).success(function (result) {
                    vm.agreement = result.agreement;
                    vm.agreement.masterAgreementId = options.masterAgreementId;
                    vm.agreement.customerId = options.customerId;
                    vm.agreement.customer = options.customer;
                    vm.agreement.agreementType = options.agreementType;
                    vm.agreement.movements[0].outDetail.dateTime = options.date;
                    vm.vehicleOwnership = 1;
                    notLoadTariff = true;
                    vm.disableOperator = false;
                    var rentalRow = chargesLines.filter(e => e.chargesTypeId == 1)[0];
                    if (rentalRow.rate > 0 && !rentalRow.excessRate) {
                        vm.disableOperator = true;
                        vm.hideCharges = true;
                        vm.agreement.operator1Type = 6;
                        vm.agreement.operator2Type = 6;
                    }

                    loadChargesFromSettings();
                    vm.agreementTypeSelected();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                    vm.loading = false;
                });
            };

            function init() {
                vm.loading = true;
                agreementService.getEquipmentAgreementForEdit({
                    id: agreementId
                }).success(function (result) {

                    vm.agreement = result.agreement;
                    if (vm.agreement.vehicle != null) {
                        vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
                    }

                    if (vm.agreement.id > 0 || vm.agreement.bookingId > 0) {
                        vm.isEditMod = true;
                        vm.tariffGroupId = vm.agreement.tariffGroupId;
                        vm.tariffGroup = vm.agreement.tariffGroup;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        vm.vehicleOwnership = vm.agreement.vehicle.ownership;
                        if (vm.agreement.vehicle)
                            vm.searchOtherGroupsVehicle = vm.agreement.tariffGroupId != vm.agreement.vehicle.tariffGroupId;

                        /* Dont load or apply tariff in edit mode
                        //in edit mod load tariff for vehicle. which will be used if some parameter is changed like dates etc.
                        */


                        if (vm.agreement.customer.contactCategory == 1) {
                            vm.isIndividualCustomerRadio = true;
                        }
                        else if (vm.agreement.customer.contactCategory == 2) {
                            vm.isIndividualCustomerRadio = false;
                        }

                    } else {
                        if (vm.agreement.vehicle != null) {
                            vm.vehicleOwnership = 1;
                        }
                        else {
                            vm.vehicleOwnership = 1;
                        }
                        vm.agreement.agreementNo = null;
                        vm.isEditMod = false;
                    }

                    loadChargesFromSettings();

                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                    vm.agreementTypeChange();

                }).finally(function () {
                    vm.loading = false;
                });
            }

            designationDetails();
            function initAgreement() {
                if (options.masterAgreementId)
                    initFromMasterAgreement();
                else
                    init();
            }
            initAgreement();

        }
    ]);
