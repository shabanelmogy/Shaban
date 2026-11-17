// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:295190-295789
appModule.controller('tenant.views.crs.supplierAgreements.createOrEditModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'chargesCalculator', 'abp.services.app.supplierAgreement',
        'agreementId', 'abp.services.app.vehicle', 'abp.services.app.directory', 'chargesSettings', '$rootScope','abp.services.app.commonLookup','abp.services.app.commonLookup','appSession',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, chargesCalculator, supplierAgreementService, agreementId,
            vehicleService, directoryService, chargesSettings, lookupService, appSession) {

            var vm = this;

            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Agreements.Edit.CanChangeRates');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            var enableFutureAgreementCheckOuts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableFutureAgreementCheckOuts"))
            vm.taxAccepted = false;
            vm.showAdvancePopupOnSave = false;
            vm.showDepositPopupOnSave = false;
            vm.saveAndPrint = false;
            vm.loading = false;
            vm.tariffGroupId = null;
            vm.tariffGroup = null;
            vm.searchOtherGroupsVehicle = false;
            vm.branchTaxPercentage = null;
            vm.chargesSettings = chargesSettings;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isAdvancePaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsAdvancePaymentRequired"));
            vm.isDepositPaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsDepositPaymentRequired"));
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.isReadOnlyAdvanceAmount = false;
            vm.canChangeAdvanceAmount = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeAdvanceAmount');
            vm.canOpenAgreementWithoutSaleOrder = abp.auth.hasPermission('Pages.Tenant.Agreements.CanOpenAgreementWithoutSaleOrderRental');
            //vm.userMaxdiscountPercent = appSession.user.maxDiscountPercent > 0 ? true : false;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.vehicles = [];
            vm.customers = [];
            var isValid = true;
            vm.discountCodeId = null;
            var errorMessage = {};
            var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.discountAuthCode = null;
            var agreementCategory = 1; //Rental
            vm.isTotalDaysAndHrs = false;
            vm.isIndividualCustomerRadio = true;
            vm.disableTariffCard = false;
            //  vm.agreement.driverType = 0;

            //vm.agreement = {
            //    driverType:0,
            //};
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

            vm.tariffCards = [];
            vm.tariffCard = null;
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

            vm.getDateTariffCard = function (row) {
                if (!row.fromDate)
                    return "";
                else
                    return '(' + vm.getlocalDateTime(row.fromDate) + " - " + vm.getlocalDateTime(row.toDate) + ')';
            };

            vm.searchGoogleLocations = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                lookupService.searchGooglePlaces({ keyWord: $select.search }).then(function (response) {
                    vm.geoLocations = response.data.items;
                });
            };

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.localize = function (input) {
                return app.localize(input);
            };

            ////date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            //var startDateLoaded = false;
            vm.startDateChanged = function () {
            };

            vm.branchTaxCode = function () {
                var userLocationId = appSession.user.locationId;
                if (userLocationId) {
                    lookupService.getLocationById({ id: userLocationId })
                        .success(function (data) {
                            var userLocation = data;
                            if (userLocation.taxCode) {
                                vm.branchTaxPercentage = userLocation.taxCode.taxPercent;
                            }
                        })
                }
            }

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
                
            };

            //var endDateLoaded = false;

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search,ownership : 2 }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchSuppliers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 3 (supplier). get Suppliers
                return directoryService.search({ keyword: $select.search, contactType: 3, activeOnly: true }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.setTaxPercentOnTaxCode = function () {
                if (vm.isTaxCodeEnabled && !vm.agreement.customer.isTaxExempted) {
                    if (vm.agreement.customer.taxCodeId > 0) {
                        vm.agreement.taxPercent = vm.agreement.customer.taxCode.taxPercent;
                        vm.taxPercent = vm.agreement.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.agreement.taxPercent = vm.branchTaxPercentage;
                    }
                }
            }

            vm.changeTaxOnSupplier = function () {
                if (vm.isTaxCodeEnabled && !vm.agreement.customer.isTaxExempted) {
                    vm.setTaxPercentOnTaxCode();
                }
            };

            vm.searchSupplierPopoup = function () {
                var modalInstance = openSearchContactModel(null, 3);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                    }
                });
            };
       
            vm.vehicleSelected = function () {

                vm.agreement.movements[0].outDetail.fuelLevel = vm.agreement.vehicle.fuelLevel;
                vm.agreement.movements[0].outDetail.km = vm.agreement.vehicle.kMs;

                vm.agreement.movements[0].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;                
            };

            //vm.searchVehiclePopup = function () {
            //    openSearchVehicleModal();
            //};

            //function openSearchVehicleModal() {

            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
            //        controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    fromDateTime: moment(vm.agreement.movements[0].outDetail.dateTime ? vm.agreement.movements[0].outDetail.dateTime : moment().startOf('day')).utc(),
            //                    toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
            //                    tariffGroup: vm.searchOtherGroupsVehicle ? null : vm.tariffGroup,
            //                    tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId,
            //                    statusId: 'IDL',
            //                    subStatuses: [1, 7], //1: Available, 7: Ready to go,
            //                    ownership: 2,
            //                    source: 'openagreement',
            //                    selectable: true
            //                };
            //            }
            //        }
            //    });

            //    modalInstance.result.then(function (result) {
            //        if (result != null) {
            //            vm.agreement.vehicle = result;
            //            vm.vehicleSelected();
            //        }
            //    });
            //}

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
                if (vm.agreement.customer.contactCategory != 2) {
                    vm.agreement.charges.forEach(function (value) {
                        value.invoiceToDriver = false;
                    });
                }
                vm.advanceChanged = true;
                //popup for advance or deposit if needed
                if (vm.showAdvancePopupOnSave || vm.showDepositPopupOnSave) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/agreements/agreementAdvanceAndDeposit.cshtml',
                        controller: 'tenant.views.crs.agreements.agreementAdvanceAndDeposit as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            options: function () {
                                return {
                                    agreement: vm.agreement,
                                    advance: vm.advance,
                                    deposit: vm.deposit,

                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        var continueSaving = false;
                        if (result != null && result.save != null)
                            continueSaving = result.save;

                        vm.saving = continueSaving;
                        if (continueSaving) {
                            vm.advanceChanged = true;
                            if (vm.deposit.voucherSubTypeId != 11) // all types except pre authoriation
                            {
                                //put hold for days in the from of fromdate & todate
                                vm.deposit.fromDate = moment();
                                var fromDate = angular.copy(vm.deposit.fromDate);
                                vm.deposit.toDate = fromDate.add(vm.deposit.holdForDays, 'day');
                            }

                            save(); //save on closing of popup
                        }
                        else
                            vm.saving = false; //saving cacelled on popup
                    });

                } else //if advance or deposit popup is not shown then save directly
                    save();
            };

            function save() {

                vm.saving = true;

                if (isValid) {
                    //update ids for selected records
                    vm.agreement.vehicleId = vm.agreement.vehicle.id;
                    vm.agreement.customerId = vm.agreement.customer.id;
                   
                    supplierAgreementService.createOrUpdateSupplierAgreement({
                        agreement: vm.agreement,
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
                ////if new agreement then load charges detail from settings
                //if (vm.isEditMod == false) {
                //    vm.agreement.charges.length = 0;    //clear charges list

                //navigation charges settings and add charges rows in agreement charges list
                for (var i = 0; i < vm.chargesSettings.length; i++) {

                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: vm.chargesSettings[i].chargesTypeId
                    }, true);



                    if (foundLines.length == 0) {
                        vm.agreement.charges.push(
                            {
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
                                //    { included: true, rate: 0, excessRate: 5, limit: 100 },
                                //    { included: false, rate: 30, excessRate: 4, limit: 250 },
                                //    { included: false, rate: 50, excessRate: 3, limit: 500 }

                                //]
                            }
                        );
                    }
                    //    }
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

                if (vm.agreement && vm.agreement.charges) {
                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: 1
                    }, true);
                    if (foundLines.length == 1) {
                        if (foundLines[0].discountPercent >= 0) {
                            foundLines[0].discountedRate = utilities.round(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)), 2);
                        }
                    }
                }

               

                return chargesCalculator.calculate(vm.agreement);
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
            vm.changeStatusReceiptCreation = function () {
                if (vm.advance.amount > 0)
                    vm.showAdvancePopupOnSave = true;
                else
                    vm.showAdvancePopupOnSave = false;
            };
            vm.changeStatusDepositCreation = function () {
                if (vm.deposit.amount > 0)
                    vm.showDepositPopupOnSave = true;
                else
                    vm.showDepositPopupOnSave = false;
            };

            vm.totalDaysAndTime = function () {
                var startDate = moment(vm.agreement.movements[0].outDetail.dateTime, "DD/MM/YYYY hh:mm");
                var endDate = moment(vm.agreement.endDate, "DD/MM/YYYY hh:mm");

                if (startDate.isValid() && endDate.isValid()) {
                    
                    vm.isTotalDaysAndHrs = true;
                    var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    // vm.totalDays = duration.days();
                    vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                    vm.remainingHrs = utilities.round(duration.hours() + (duration.minutes() / 60), 2);

                }
                else {
                    vm.isTotalDaysAndHrs = false;
                }
            };

            function init() {
                vm.loading = true;
                vm.branchTaxCode();
                allFuelLevels();
                supplierAgreementService.getAgreementWithAdvanceAndDepositForEdit({
                    id: agreementId
                }).success(function (result) {
                    
                    vm.agreement = result.agreement;
                    vm.tariffCard = vm.agreement.tariffCardId;
                    if (vm.agreement.vehicle != null) {
                        vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
                    }
                    vm.advance = result.advance;
                    vm.deposit = result.deposit;

                    if (vm.agreement.id > 0 || vm.agreement.bookingId > 0) {
                        vm.isEditMod = true;
                        vm.tariffGroupId = vm.agreement.tariffGroupId;
                        vm.tariffGroup = vm.agreement.tariffGroup;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        if (vm.agreement.customer)
                            vm.disableTariffCard = vm.agreement.customer.tariffCardId != null;
                        if (vm.agreement.vehicle)
                            vm.searchOtherGroupsVehicle = vm.agreement.tariffGroupId != vm.agreement.vehicle.tariffGroupId;

                        //calculate hold for days using fromdate and todate if cash or check deposit
                        if (vm.deposit.voucherSubTypeId != 11) // all types except
                        {
                            var td = moment(vm.deposit.toDate);
                            var duration = moment.duration(td.diff(vm.deposit.fromDate));
                            vm.deposit.holdForDays = utilities.round(duration.asDays(), 0);
                        }

                        if (vm.agreement.customer.contactCategory == 1) {
                            vm.isIndividualCustomerRadio = true;
                        }
                        else if (vm.agreement.customer.contactCategory == 2) {
                            vm.isIndividualCustomerRadio = false;
                        }

                    } else {
                        vm.agreement.agreementNo = null;
                        vm.isEditMod = false;
                        vm.agreement.driverType = 1;
                    }

                    loadChargesFromSettings();

                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                    //vm.agreementTypeChange();

                }).finally(function () {
                    vm.loading = false;
                });
            }


            init();

        }
    ]);
