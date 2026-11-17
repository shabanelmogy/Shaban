// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:139353-141108
appModule.controller('tenant.views.crs.agreements.createOrEditModalForMaster', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'chargesCalculator', 'tariffHelper', 'abp.services.app.agreement',
        'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.tariffCard',
        'abp.services.app.commonLookup', 'abp.services.app.agreementSaleOrder', 'abp.services.app.rentalQuotation', 'abp.services.app.accident', 'options', 'appSession',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, chargesCalculator, tariffHelper, agreementService,
            vehicleService, directoryService, tariffCardService, lookupService, agreementSaleOrderService, rentalQuotationService, accidentService, options, appSession) {

            var vm = this;
            vm.picture = [];
            var agreementId = options.agreementId;
            var chargesSettings = options.chargesSettings;
            vm.enableAutoEndDate = utilities.parseBoolean(abp.setting.get("App.General.AgreementAutoEndDate"));
            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Agreements.Edit.CanChangeRates');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.branchTaxPercentage = null;
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.enableAdditionalNotes = utilities.parseBoolean(abp.setting.get("App.General.EnableAdditionalNotes"));
            vm.isSalesPersonRequired = utilities.parseBoolean(abp.setting.get("App.General.IsSalesPersonRequired"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isTariffCardExplicitSelection = utilities.parseBoolean(abp.setting.get("App.General.TariffCardExplicitSelection"));
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.isReturnDateRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReturnDateRequired"));
            var enableFutureAgreementCheckOuts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableFutureAgreementCheckOuts"))
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");
            vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            var doNotIncludeReplacementVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DoNotIncludeReplacementVehicles"));
            vm.makeQuotationMandatoryForAllIndividualCustomersForWeeklyAndMonthly = utilities.parseBoolean(abp.setting.get("App.General.QuotationIsMandatoryForAllIndividualCustomersForWeeklyAndMonthly"));
            vm.allowZeroValueRentalAgreement = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowZeroValueRentalAgreement"));
            vm.taxAccepted = false;
            vm.showAdvancePopupOnSave = false;
            vm.showDepositPopupOnSave = false;
            vm.saveAndPrint = false;
            vm.loading = false;
            vm.isAdditionalDriverCharges = false;
            vm.tariffGroupId = null;
            vm.tariffGroup = null;
            vm.searchOtherGroupsVehicle = false;
            vm.chargesSettings = chargesSettings;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");

            vm.isAdvancePaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsAdvancePaymentRequired"));
            vm.isDepositPaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsDepositPaymentRequired"));
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.isReadOnlyAdvanceAmount = false;
            vm.canChangeAdvanceAmount = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeAdvanceAmount');
            vm.canChangeKMOut = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeKMOut');
            vm.canOpenAgreementWithoutSaleOrder = abp.auth.hasPermission('Pages.Tenant.Agreements.CanOpenAgreementWithoutSaleOrderRental');
            vm.isSupplierAgreementsEnabled = abp.features.isEnabled("CRS.ExternalAgreements.SupplierAgreements");
            vm.isSagX3Enabled = abp.features.isEnabled("Core.SagX3Integration");
            vm.isRentalQuotationEnabled = abp.features.isEnabled("CRS.Rental.Quotations");
            vm.isAdvancePayment = abp.features.isEnabled("CRS.Rental.Agreements.AddMultipleAdvanceOnAgreementCreation");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isAuthCodeEnabled = abp.features.isEnabled("Core.AuthorizationCodes");

            //vm.userMaxdiscountPercent = appSession.user.maxDiscountPercent > 0 ? true : false;
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
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
            vm.quotation = { quotationLines: [] };
            vm.customerQuotations = [];
            vm.authorizationCode = null;

            //vm.agreement = {
            //    driverType:0,
            //};
            vm.discountType = [
                { type: "branch wise discount added", id: 1 },
                { type: "% discount applied", id: 2 }
            ];
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
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.isQuotationMandatory = function () {
                return vm.agreement.customer.contactCategory == 1
                    && vm.agreement.agreementType != 1 &&
                    vm.makeQuotationMandatoryForAllIndividualCustomersForWeeklyAndMonthly;
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

            vm.agreementTypeChange = function () {
                if (vm.agreement.agreementType != 3)
                    vm.agreement.isPermanentVehicle = false;

                //if ((vm.agreement.agreementType == 1 || vm.agreement.agreementType == 2) && !vm.advanceChanged && !vm.isEditMod) {
                //    vm.advance.amount = vm.calculate();
                //    if (!vm.canChangeAdvanceAmount) {
                //        vm.isReadOnlyAdvanceAmount = true;
                //    }
                //}
                //else if (vm.agreement.agreementType == 3) {
                //    vm.isReadOnlyAdvanceAmount = false;
                //}
                vm.startDateChanged();
                return;
            };


            vm.openAdvanceAgreementCreation = function () {
                vm.advanceChanged = true;

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/advanceAgreementCreation.cshtml',
                    controller: 'tenant.views.crs.agreements.advanceAgreementCreation as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                advanceList: vm.advanceList,

                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                    if (result.advanceList) {
                        vm.advanceList = result.advanceList;
                        vm.agreement.advance = vm.sumAmountReceipt();
                    }

                });
            };

            vm.sumAmountReceipt = function () {

                var amount = 0.0;

                vm.advanceList.forEach(function (advance) {
                    if (advance.amount > 0) {
                        amount += advance.amount;
                    }
                });

                return utilities.round(amount, 2);


            };

            vm.openDepositAgreementCreation = function () {
                vm.advanceChanged = true;

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/depositAgreementCreation.cshtml',
                    controller: 'tenant.views.crs.agreements.depositAgreementCreation as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                depositList: vm.depositList,

                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                    if (result.depositList) {
                        vm.depositList = result.depositList;
                        vm.agreement.deposit = vm.sumDepositAmountReceipt();
                    }

                });
            };

            vm.sumDepositAmountReceipt = function () {

                var amount = 0.0;

                vm.depositList.forEach(function (deposit) {
                    if (deposit.amount > 0) {
                        amount += deposit.amount;
                    }
                });

                return utilities.round(amount, 2);


            };


            vm.getTariffCards = function () {
                vm.loading = true;
                tariffCardService.getTariffCardsPeriodWise({ fromDate: vm.agreement.movements[0].outDetail.dateTime, toDate: vm.agreement.endDate }).success(function (data) {
                    vm.tariffCards = data.items;
                    vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.allFuelLevels = [{ name: "0/8", value: 0 }, { name: "1/8", value: 0.125 }, { name: "2/8", value: 0.25 }, { name: "3/8", value: 0.375 }, { name: "4/8", value: 0.5 }, { name: "5/8", value: 0.625 }, { name: "6/8", value: 0.75 }, { name: "7/8", value: 0.875 }, { name: "8/8", value: 1 }];

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.localizeChargesType = function (chargesRow) {
                if (chargesRow.chargesTypeId == 2 && chargesRow.excessRate == 0 && chargesRow.accepted)
                    return app.localize("SCDW");
                return app.localize(chargesRow.chargesType.name);
            };

            ////date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            var startDateLoaded = false;
            vm.startDateChanged = function () {

                if (vm.enableAutoEndDate && startDateLoaded) {
                    if (vm.agreement && vm.agreement.agreementType == 2)
                        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(1, 'weeks').utc();
                    if (vm.agreement && vm.agreement.agreementType == 3)
                        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(1, 'months').utc();
                }
                startDateLoaded = true;

                // if (abp.auth.hasPermission('Pages.Tenant.TariffCards')) {
                vm.getTariffCards();
                //}
                //don't apply tariff in edit mode
                if (isTariffEnabled && !vm.isEditMod && !options.skipTariff)
                    tariffHelper.applyTariff(vm.agreement);

                //apply tariff in edit mode if startDate & endDate initialized on first time load and tariff is enabled
                //if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod) {
                //    if (isTariffEnabled) 
                //        tariffHelper.applyTariff(vm.agreement);
                //}
                //else
                //    startDateLoaded = true;
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
                                discountAuthCode: vm.discountAuthCode,
                                minDiscount: vm.getCustomerDiscount(),
                                agreementEditMode: vm.agreement && vm.agreement.id > 0
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.discountAuthCode = result.discountAuthCode;
                    chargesRow.discountPercent = result.chargesRow.discountPercent;
                    chargesRow.discountedRate = result.chargesRow.discountedRate;
                    chargesRow.rate = chargesRow.discountedRate > chargesRow.rate ? chargesRow.discountedRate : chargesRow.rate;
                    chargesRow.discountDetail = result.chargesRow.discountPercent > 0 ? `${result.chargesRow.discountPercent}% discount applied by staff` : null;
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
                if (isTariffEnabled)
                    tariffHelper.applyTariff(vm.agreement);
            };

            //var endDateLoaded = false;
            vm.endDateChanged = function () {
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
                //if (abp.auth.hasPermission('Pages.Tenant.TariffCards')) {
                vm.getTariffCards();
                //}
                //if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod) {
                //    if (isTariffEnabled)
                //        tariffHelper.applyTariff(vm.agreement);
                //}
                //else
                //    endDateLoaded = true;
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [1, 7]; //1: Available, 7: Ready to go

                if (vm.agreement.masterAgreementId > 0) {
                    return vehicleService.searchVehicles(
                        {
                            plateNo: $select.search, vehicleType: 1, statusId: 'IDL', subStatuses: subStatuses, source: 'openagreement', tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.vehicleTypeId, doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle,
                            agreementCategory: 1, operationType: 1, isPermanent: vm.agreement.isPermanentVehicle, modelId: vm.vehicleModelId
                        }).then(function (response) {

                            vm.vehicles = response.data.items;
                        });

                } else {
                    return vehicleService.searchVehicles(
                        {
                            plateNo: $select.search, vehicleType: 1, statusId: 'IDL', subStatuses: subStatuses, source: 'openagreement', tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId, doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle,
                            agreementCategory: 1, operationType: 1, isPermanent: vm.agreement.isPermanentVehicle
                        }).then(function (response) {
                            vm.vehicles = response.data.items;
                        });
                }
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                var contactCategory = null;
                if (vm.isSagX3Enabled == true) contactCategory = 1;
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeSalesPerson: true, contactCategory: contactCategory }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchStaff = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.staffList = response.data.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2, false);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                        vm.customerSelected();
                    }
                });
            };

            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };


            vm.searchSupplierContact = function ($select) {
                if (!$select.search) return;
                // Only contact Suppliers=3 is required
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                var type = null;
                if (vm.agreement.driverType == 2) type = 1;
                if (vm.agreement.driverType == 3) type = 6;
                var modalInstance = openSearchContactModel(1, type, (vm.agreement.customer.contactCategory == 2 && vm.agreement.driverType == 3));
                //var modalInstance = openSearchContactModel(1, 2);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.driver = result;
                });
            };



            vm.searchSupplierPopoup = function () {
                var modalInstance = openSearchContactModel(null, 3, false);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.insuranceCompany = result;
                });
            };



            vm.driverChargesPopoup = function () {
                var modalInstance = openDriverChargesModel();
                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.charges = result;
                });
            };

            vm.clearAdditionalDriver = function () {
                vm.agreement.additionalDriver = null;
                vm.agreement.additionalDriverId = null;
            };


            vm.searchAdditionalDrivers = function ($select) {
                if (!$select.search) return;
                return directoryService.searchPersonStaffCustomer({ keyword: $select.search }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };

            vm.searchAdditionalDriverPopoup = function () {
                var modalInstance = openSearchContactModel(1, 2, false);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.additionalDriver = result;
                });
            };
            vm.tariffCardChanged = function () {

            };
            vm.changePermanentVehicle = function () {
                vm.agreement.vehicle = null;
                vm.agreement.movements[0].outDetail.km = null;
                vm.agreement.movements[0].outDetail.fuelLevel = null;
                vm.agreement.movements[0].outDetail.makeAndModel = null;
            }
            vm.vehicleSelected = function () {

                vm.agreement.movements[0].outDetail.fuelLevel = vm.agreement.vehicle.fuelLevel;
                vm.agreement.movements[0].outDetail.km = vm.agreement.vehicle.kMs;

                vm.agreement.movements[0].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;

                var groupId = vm.agreement.vehicle.tariffGroupId;
                if (groupId == null) groupId = -1;
                var contactCategory = null
                if (vm.agreement.customer)
                    contactCategory = vm.agreement.customer.contactCategory;
                if (isTariffEnabled && !vm.isEditMod) {
                    //load and apply tariff
                    tariffHelper.loadTariff(groupId, agreementCategory, contactCategory, function () { tariffHelper.applyTariff(vm.agreement); }, vm.tariffCard);

                    //vm.lockCharges = true;
                }
                vm.changesRegardingQuotationCharges();
                vm.calculate();
            };

            vm.changesRegardingQuotationCharges = function () {

                //vm.lockCharges = false;
                if (!vm.agreement.vehicle || !vm.isRentalQuotationEnabled)
                    return;
                var quotationLine = vm.quotation.quotationLines.find(e => e.vehicleModelId == vm.agreement.vehicle.modelId
                    && e.vehicleTypeId == vm.agreement.vehicle.tariffGroupId);

                if (quotationLine) {
                    vm.lockCharges = true;
                    takeRatesFromQuotation(quotationLine);
                }
            };
            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }
            vm.quotationSelected = function () {
                vm.agreement.quotationId = vm.agreement.quotation.id;
                vm.quotation = vm.agreement.quotation;
                vm.changesRegardingQuotationCharges();
                //vm.lockCharges = false;

                //vm.agreement.quotation.quotationLines.forEach(e => {
                //    if (e.vehicleModelId == vm.agreement.vehicle.modelId && e.vehicleTypeId == vm.agreement.vehicle.tariffGroupId) {
                //        //vm.agreement.charges = e.extrasLines;
                //        takeRatesFromQuotation(e);
                //        vm.lockCharges = true;
                //    }
                //});
            };

            function getCustomerPicture(id) {
                vm.picture = [];
                directoryService.searchCustomerPhoto({ id: id }).success(function (result) {
                    if (result) {
                        var img = result;
                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = img.url;
                        imageDetail.img = img.url;
                        imageDetail.description = img.description;
                        imageDetail.url = img.url;
                        imageDetail.name = img.name;
                        imageDetail.guid = img.guid;
                        imageDetail.ImageURL = img.url;
                        imageDetail.ImagePath = img.name;
                        vm.picture.push(imageDetail);
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.customerSelected = function () {
                getCustomerPicture(vm.agreement.customer.id);
                //if contact (i.e individual person)
                var chargesRow = vm.agreement.charges.filter(x => x.chargesTypeId == 1)[0];
                if (chargesRow) {
                    chargesRow.discountPercent = 0;
                    chargesRow.discountDetail = '';
                }
                if (vm.agreement.customer.contactCategory == 1) {

                    vm.agreement.driver = vm.agreement.customer;
                    vm.driverSelected();
                    vm.isCompany = false;
                    vm.isIndividualCustomerRadio = true;
                    vm.agreement.driverType = 1;
                    vm.individualCustomerRadioSelected();


                    if (vm.isRentalQuotationEnabled) {
                        vm.agreement.quotation = null;
                        vm.agreement.quotationId = null;
                        vm.customerQuotations = [];

                        rentalQuotationService.getQuotationsByContactId({ id: vm.agreement.customer.id }).success(function (result) {
                            vm.customerQuotations = result;
                            //vm.lockCharges = false;

                        }).finally(function () {
                            vm.loading = false;
                        });
                    }
                }
                if (vm.agreement.customer.contactCategory == 2) {
                    vm.isCompany = true;
                    vm.isIndividualCustomerRadio = false;
                    vm.agreement.driverType = 3;
                    vm.individualCustomerRadioSelected();
                    vm.customerQuotations = [];
                    vm.calculate();
                }
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                if (vm.isEditMod && vm.agreementTaxPercent > 0) {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.agreementTaxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.agreement.customer.isTaxExempted) {
                        if (vm.agreement.customer.taxCodeId > 0) {
                            vm.agreement.taxPercent = vm.agreement.customer.taxCode.taxPercent;
                        }
                        else {
                            if (vm.branchTaxPercentage)
                                vm.agreement.taxPercent = vm.branchTaxPercentage;
                        }
                    }
                }
                else {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.taxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.agreement.customer.isTaxExempted) {
                        if (vm.agreement.customer.taxCodeId > 0) {
                            vm.agreement.taxPercent = vm.agreement.customer.taxCode.taxPercent;
                        }
                        else {
                            if (vm.branchTaxPercentage)
                                vm.agreement.taxPercent = vm.branchTaxPercentage;
                        }
                    }
                }
                vm.agreement.salesPerson = vm.agreement.customer.salesPerson;
                vm.agreement.salesPersonId = vm.agreement.customer.salesPerson != null ? vm.agreement.customer.salesPerson.id : null;

                vm.agreement.saleOrder = null;
                vm.agreement.saleOrderId = null;

                vm.getSaleOrders();

                if (vm.agreement.customer.tariffCardId != null) {
                    var tariffCardsToCheck = vm.tariffCards.filter(row => row.id == vm.agreement.customer.tariffCardId);
                    if (tariffCardsToCheck.length > 0) {
                        vm.tariffCard = tariffCardsToCheck[0].id;
                        vm.disableTariffCard = true;
                        vm.vehicleSelected();
                    }
                }
                else {
                    vm.disableTariffCard = false;
                }
                var groupId = vm.agreement.vehicle.tariffGroupId;
                if (groupId == null) groupId = -1;
                var contactCategory = null
                if (vm.agreement.customer)
                    contactCategory = vm.agreement.customer.contactCategory;
                if (isTariffEnabled && !vm.isEditMod) {
                    //load and apply tariff
                    tariffHelper.loadTariff(groupId, agreementCategory, contactCategory, function () {
                        tariffHelper.applyTariff(vm.agreement);
                    }, vm.tariffCard);
                    //vm.lockCharges = true;
                }
                vm.changesRegardingQuotationCharges();

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


            vm.commonDriverSearch = function (contactCategoryId, contactTypeId) {
                vm.searchDrivers = function ($select) {
                    if (!$select.search) return;
                    //whereas contactCategory: 1 (person). get all persons which includes staff as well
                    return directoryService.search({ keyword: $select.search, contactCategory: contactCategoryId, contactType: contactTypeId }).then(function (response) {
                        vm.drivers = response.data.items;
                    });
                };
            };

            vm.individualCustomerRadioSelected = function () {
                //individual
                if (vm.agreement.customer.contactCategory == 1) {
                    if (vm.agreement.driverType == 1) {
                        vm.agreement.driver = null;
                        //vm.searchDrivers = function ($select) {
                        //    if (!$select.search) return;
                        //    //whereas contactCategory: 1 (person). get all persons which includes staff as well
                        //    return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                        //        vm.drivers = response.data.items;
                        //    });
                        //};
                        vm.commonDriverSearch(1, null);
                        if (vm.agreement.customer != null) {
                            vm.agreement.driver = vm.agreement.customer;
                            vm.driverSelected();
                        }
                    }
                    else if (vm.agreement.driverType == 2) {
                        vm.agreement.driver = null;
                        //vm.searchDrivers = function ($select) {
                        //    if (!$select.search) return;
                        //    //whereas contactCategory: 1 (person), contactType: 1 (staff)
                        //    return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType:1 }).then(function (response) {
                        //        vm.drivers = response.data.items;
                        //    });
                        //};

                        vm.commonDriverSearch(1, 1);
                    }
                    else if (vm.agreement.driverType == 4) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 1 (person), Exclude staff 
                            return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                                var staffExcludedData = response.data.items.filter(e => e.contactType != 1);
                                vm.drivers = staffExcludedData;
                            });
                        };
                    }
                }
                // company
                else if (vm.agreement.customer.contactCategory == 2) {
                    if (vm.agreement.driverType == 3) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;

                            var companyIdToForward = vm.agreement.customer ? vm.agreement.customer.id : null;
                            //whereas contactCategory: 2 (company), contactType: 1 (staff)
                            return directoryService.searchForCompany({ keyword: $select.search, companyId: companyIdToForward }).then(function (response) {
                                vm.drivers = response.data;
                            });
                        };
                    }
                    else if (vm.agreement.driverType == 2) {

                        vm.agreement.driver = null;
                        //vm.searchDrivers = function ($select) {
                        //    if (!$select.search) return;
                        //    //whereas contactCategory: 2 (company), contactType: 1 (staff)
                        //    return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType: 1 }).then(function (response) {
                        //        vm.drivers = response.data.items;
                        //    });
                        //};
                        vm.commonDriverSearch(1, 1);
                    }

                    else if (vm.agreement.driverType == 4) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 2 (company), Exclude staff 
                            return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                                var staffExcludedData = response.data.items.filter(e => e.contactType != 1);
                                vm.drivers = staffExcludedData;
                            });
                        };
                    }
                }
            };

            //vm.searchSaleOrders = function ($select) {
            //    if (!$select.search) return;

            //    return agreementSaleOrderService.searchSaleOrdersForAgreement({ keyword: $select.search, contactId: vm.agreement.customer.id }).then(function (response) {
            //        vm.saleOrders = response.data.items;
            //    });
            //};


            vm.getSaleOrders = function () {
                if (!vm.agreement.customer) return;

                return agreementSaleOrderService.getAgreementSaleOrdersByContactId({ id: vm.agreement.customer.id }).then(function (response) {
                    vm.saleOrders = response.data.items;
                });
            };

            vm.saleOrderChanged = function () {

                vm.agreement.saleOrderId = vm.agreement.saleOrder.id;
                if (vm.agreement.saleOrder.quotationId) {
                    vm.loading = true;
                    rentalQuotationService.getQuotationForEdit({ id: vm.agreement.saleOrder.quotationId }).success(function (result) {
                        vm.quotation = result;
                        vm.agreement.quotation = vm.quotation;
                        vm.changesRegardingQuotationCharges();
                        //vm.lockCharges = false;

                        //vm.quotation.quotationLines.forEach(e => {
                        //    if (e.vehicleModelId == vm.agreement.vehicle.modelId && e.vehicleTypeId == vm.agreement.vehicle.tariffGroupId) {
                        //        //vm.agreement.charges = e.extrasLines;
                        //        takeRatesFromQuotation(e);
                        //        vm.lockCharges = true;
                        //    }
                        //});
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };


            function takeRatesFromQuotation(quotationLine) {

                vm.agreement.charges.forEach(ac => {
                    var el = quotationLine.extrasLines.find(el => el.chargesTypeId == ac.chargesTypeId);
                    if (el) {
                        ac.rate = el.rate;
                        ac.accepted = el.accepted;
                        ac.included = el.included;
                        ac.limit = el.limit;
                        ac.excessRate = el.excessRate;
                    }
                    //quotationLine.extrasLines.forEach(qc => {
                    //    if (ac.chargesTypeId == qc.chargesTypeId) {
                    //        ac.rate = qc.rate;
                    //        ac.accepted = qc.accepted;
                    //        ac.included = qc.included;
                    //        ac.limit = qc.limit;
                    //        ac.excessRate = qc.excessRate;
                    //    }
                    //});
                });
            }

            vm.driverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
                vm.loading = true;
                vm.multipleAccidentsDriver = false;
                accidentService.checkRepeatedAccidentsOnDriver({ id: vm.agreement.driver.id })
                    .success(function (result) {
                        if (result)
                            vm.multipleAccidentsDriver = true;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.additionalDriverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            function openSearchVehicleModal() {

                if (vm.agreement.masterAgreementId > 0) {
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
                                    tariffGroup: vm.searchOtherGroupsVehicle ? null : vm.vehicleType,
                                    tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.vehicleTypeId,
                                    statusId: 'IDL',
                                    subStatuses: [1, 7], //1: Available, 7: Ready to go
                                    source: 'openagreement',
                                    agreementCategory: 1, operationType: 1, isPermanent: vm.agreement.isPermanentVehicle,
                                    selectable: true,
                                    vehicleType: 1,
                                    modelId: vm.vehicleModelId,
                                    model: vm.vehicleModel,
                                    doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle
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
                } else {
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
                                    source: 'openagreement',
                                    agreementCategory: 1, operationType: 1, isPermanent: vm.agreement.isPermanentVehicle,
                                    selectable: true,
                                    vehicleType: 1,
                                    doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle
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

            }

            vm.addExternalVehiclePopup = function () {
                openAddExternalVehicleModal();
            };

            function openAddExternalVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/addExternalVehicle.cshtml',
                    controller: 'tenant.views.crs.vehicles.addExternalVehicle as vm',
                    backdrop: 'static',
                    size: 'sm'
                });
                modalInstance.result.then(function (vehicle) {
                    vm.agreement.vehicle = vehicle;
                });
            }

            function openSearchContactModel(category, type, isOnlyCorporate) {
                if (vm.isSagX3Enabled) {
                    category = 1;
                }

                var companyIdToForward = vm.agreement.customer ? vm.agreement.customer.id : null;

                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactOptionModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactOptionModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                category: category,
                                type: type,
                                isOnlyCorporate: isOnlyCorporate,
                                companyId: companyIdToForward
                            }
                        }
                    }
                });
            }

            vm.addExternalVehiclePopup = function () {
                openAddExternalVehicleModal();
            };

            vm.disableRateRow = function (chargesRow) {
                console.log("chargesRow");
                console.log(chargesRow);
                if ((chargesRow.included && chargesRow.chargesTypeId == 5) || ((chargesRow.included || !chargesRow.accepted) && (chargesRow.chargesType.chargesCategory == 2 || chargesRow.chargesType.chargesCategory == 3 || chargesRow.chargesType.chargesCategory == 4)) || (!vm.canChangeRates))
                    //if ((chargesRow.included && chargesRow.chargesTypeId == 5) || ((chargesRow.included || !chargesRow.accepted) && (chargesRow.chargesType.chargesCategory == 2 || chargesRow.chargesType.chargesCategory == 3 || chargesRow.chargesType.chargesCategory == 4)) || (!vm.canChangeRates && vm.isEditMod))
                    return true;
                else
                    return false;
            }



            vm.addSagX3Contact = function () {
                var modalInstance = openSearchSagX3ContactModel();

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                        vm.customerSelected();
                    }
                });
            };

            function openSearchSagX3ContactModel() {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchSagX3ContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchSagX3ContactModal as vm',
                    backdrop: 'static'
                });
            }

            function openDriverChargesModel() {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/driverChargesModal.cshtml',
                    controller: 'tenant.views.crs.agreements.driverChargesModal as vm',
                    backdrop: 'static',
                    resolve: {
                        agreementCharges: function () {
                            return vm.agreement.charges
                        }
                    }
                });
            }

            function openVerifyAuthorizationCodeModal(validationObj) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/authorizationCodes/verifyAuthCodeModal.cshtml',
                    controller: 'tenant.views.common.authorizationCodes.verifyAuthCodeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        validationObj: function () {
                            return validationObj;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result)
                        vm.authorizationCode = result;
                    advanceAndDepositCheck();
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
                    errorMessage = errorMessage + '\n Agreement Out Date Can not be future Date';
                }
                if (vm.agreement.endDate != null) {
                    if (vm.agreement.movements[0].outDetail.dateTime > vm.agreement.endDate) {
                        isValid = false;
                        errorMessage = errorMessage + '\n Return Date can not  less than Out Date ';
                    }
                }

            }
            vm.save = function () {
                validate();

                lookupService.validateCreditLimit({ id: vm.agreement.customer.id }).success(function (result) {
                    if (result.isLimitCrossed && !vm.isEditMod)
                        openVerifyAuthorizationCodeModal(result);
                    else
                        advanceAndDepositCheck();
                });

            };

            //function openAgreementAdvanceAndDepositModel() {
            //    
            //    vm.saving = true;
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/agreements/agreementAdvanceAndDeposit.cshtml',
            //        controller: 'tenant.views.crs.agreements.agreementAdvanceAndDeposit as vm',
            //        backdrop: 'static',
            //        //size: 'sm',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    agreement: agreement,
            //                    advance: receipt,
            //                    securityDeposit: securityDeposit,
            //                };
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //        
            //        //If result.save that came from $uibModal in agreementAdvanceAndDeposit.js is true, loading will be shown on save button.
            //        vm.saving = result.save;
            //        if (result.save) {
            //            vm.agreement.advance = result.advance;
            //            vm.agreement.securityDeposit = result.securityDeposit;
            //            saveAgreementWithReceipt();
            //        }

            //    });
            //}

            function advanceAndDepositCheck() {


                //if (vm.validateCreditLimit(vm.agreement.customerId))
                //    return;

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
                    vm.agreement.driverId = vm.agreement.driver.id;
                    //if (vm.enableAutoEndDate) {
                    //    if (vm.agreement.agreementType == 2)
                    //        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(1, 'weeks');
                    //    if (vm.agreement.agreementType == 3)
                    //        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(1, 'months');
                    //}
                    if (vm.agreement.insuranceCompany != null)
                        vm.agreement.InsuranceCompanyId = vm.agreement.insuranceCompany.id;

                    if (vm.agreement.customer.contactCategory != 2)
                        vm.agreement.poNo = null;

                    if (vm.agreement.additionalDriver != null)
                        vm.agreement.additionalDriverId = vm.agreement.additionalDriver.id;
                    else
                        vm.agreement.additionalDriverId = null;

                    if (vm.agreement.salesPerson != null)
                        vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
                    else
                        vm.agreement.salesPersonId = null;

                    if (!vm.agreement.customer.contactCategory == 2 && !vm.isSaleOrderEnabled) {
                        vm.agreement.saleOrderId = null;
                    }
                    if (vm.quotation) {
                        vm.agreement.quotationId = vm.quotation.id;
                    }
                    console.log(vm.agreement.advance);
                    agreementService.createOrUpdateAgreement({
                        agreement: vm.agreement,
                        advance: vm.advance,
                        deposit: vm.deposit,
                        advanceList: vm.advanceList,
                        depositList: vm.depositList,
                        discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                        authorizationCodeId: vm.authorizationCode == null ? null : vm.authorizationCode.id,
                        tariffCardId: vm.tariffCard
                    }).success(function (result) {
                        if (!vm.saveAndPrint) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                        }
                        vm.agreement.id = result;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.agreement.id);
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

            function loadChargesFromOptions() {
                for (var i = 0; i < vm.chargesSettings.length; i++) {

                    var foundLines = $filter('filter')(options.quotationRates, {
                        chargesTypeId: vm.chargesSettings[i].chargesTypeId
                    }, true);

                    if (foundLines.length > 0) {
                        var foundLine = foundLines[0];
                        vm.agreement.charges.push(
                            {
                                agreementId: null,
                                order: vm.chargesSettings[i].order,
                                chargesTypeId: vm.chargesSettings[i].chargesTypeId,
                                rateTypeId: foundLine.rateTypeId,
                                discountPercent: 0,
                                rate: foundLine.rate,
                                units: null,
                                charges: null,
                                applyOnClosing: vm.chargesSettings[i].applyOnClosing,
                                isMandatory: vm.chargesSettings[i].isMandatory,
                                taxable: vm.chargesSettings[i].taxable,
                                accepted: ((vm.chargesSettings[i].chargesType.chargesCategory == 2 || vm.chargesSettings[i].chargesType.chargesCategory == 3 || vm.chargesSettings[i].chargesType.chargesCategory == 4) ? false : true),
                                included: false,
                                excessRate: foundLine.excessRate,
                                limit: foundLine.limit,
                                chargesType: vm.chargesSettings[i].chargesType,
                                rateType: foundLine.rateType,
                                tariff: []
                            }
                        );
                    }
                    else {
                        vm.agreement.charges.push(
                            {
                                agreementId: null,
                                order: vm.chargesSettings[i].order,
                                chargesTypeId: vm.chargesSettings[i].chargesTypeId,
                                rateTypeId: vm.chargesSettings[i].rateTypeId,
                                discountPercent: 0,
                                rate: vm.chargesSettings[i].rate,
                                units: null,
                                charges: null,
                                applyOnClosing: vm.chargesSettings[i].applyOnClosing,
                                isMandatory: vm.chargesSettings[i].isMandatory,
                                taxable: vm.chargesSettings[i].taxable,
                                accepted: ((vm.chargesSettings[i].chargesType.chargesCategory == 2 || vm.chargesSettings[i].chargesType.chargesCategory == 3 || vm.chargesSettings[i].chargesType.chargesCategory == 4) ? false : true),
                                included: false,
                                excessRate: vm.chargesSettings[i].excessRate,
                                limit: null,
                                chargesType: vm.chargesSettings[i].chargesType,
                                rateType: vm.chargesSettings[i].rateType,
                                tariff: []
                            }
                        );
                    }
                }

            }

            //vm.changeSuperCDW = (chargesRow, tariffLine) => {
            //    $scope.$watchCollection('vm.agreement', function (newNames, oldNames) {
            //        if (chargesRow.chargesType.chargesCategory === 2) {
            //            ((tariffLine.included == chargesRow.included && tariffLine.rate == chargesRow.rate && tariffLine.excessRate == chargesRow.excessRate) && tariffLine.to === 0) ?
            //                chargesRow.chargesType.name = "SCDW" :
            //                chargesRow.chargesType.name = "CDW";
            //        }
            //    });
            //}

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;

                //if (chargesRow.chargesType.chargesCategory === 2 && tariffLine.to !== 0) {
                //    chargesRow.chargesType.name = "CDW";
                //}
                //else if (chargesRow.chargesType.chargesCategory === 2 && tariffLine.to === 0) {
                //    chargesRow.chargesType.name = "SCDW";
                //}

                //vm.changeSuperCDW(chargesRow, tariffLine);
                vm.localizeChargesType(chargesRow, tariffLine);

            };

            vm.disableRate = function (chargesRow) {

                //tariffLine.included == chargesRow.included &&
                //tariffLine.rate == chargesRow.rate &&
                //tariffLine.excessRate == chargesRow.excessRate
                //&& tariffLine.limit == chargesRow.limit
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
            vm.round = function (amount) {
                return utilities.round(amount, 2);
            }
            //vm.calculate = function () {
            //    if (vm.agreement == null) return 0;

            //    if (vm.agreement && vm.agreement.charges) {
            //        var foundLines = $filter('filter')(vm.agreement.charges, {
            //            chargesTypeId: 1
            //        }, true);
            //        if (foundLines.length == 1) {
            //            if (foundLines[0].discountPercent >= 0) {
            //                foundLines[0].discountedRate = utilities.round(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)), 2);
            //            }
            //        }
            //    }

            //    //if ((vm.agreement.agreementType == 1 || vm.agreement.agreementType == 2) && !vm.advanceChanged && !vm.isEditMod) {
            //    //    vm.advance.amount = chargesCalculator.calculate(vm.agreement);
            //    //}
            //    //else if (vm.agreement.agreementType == 3) {
            //    //    vm.isReadOnlyAdvanceAmount = false;
            //    //}

            //    return chargesCalculator.calculate(vm.agreement);
            //};
            vm.getCustomerDiscount = function () {
                var customer = vm.agreement.customer;
                if (customer) {
                    if (vm.agreement.agreementType == 1)
                        return customer.dailyDiscount;
                    if (vm.agreement.agreementType == 2)
                        return customer.weeklyDiscount;
                    if (vm.agreement.agreementType == 3)
                        return customer.monthlyDiscount;
                }
            }

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
                        var discountPercent = foundLines[0].discountPercent;
                        var discountedRate = foundLines[0].discountedRate;
                        var chargesRow = vm.agreement.charges.filter(x => x.chargesTypeId == 1 && x.rateTypeId == vm.agreement.agreementType)[0];
                        var branchWiseDiscountApplied = false;
                        if (chargesRow != null) {
                            branchWiseDiscountApplied = chargesRow.branchDiscountPercent && chargesRow.branchDiscountPercent != 0;
                        }
                        if (!branchWiseDiscountApplied) {
                            var tg = vm.agreement.customer ? vm.agreement.customer : null;
                            if (vm.agreement.customer && vm.agreement.customer.contactCategory == 2 && (!vm.agreement.id || vm.agreement.id <= 0)) {
                                if (vm.agreement.agreementType == 1 && tg && tg.dailyDiscount > 0) {
                                    //foundLines[0].discountedRate = foundLines[0].discountedRate > 0 ? utilities.round(foundLines[0].rate - foundLines[0].discountedRate * (tg.dailyDiscount / 100), 2) : utilities.round(foundLines[0].rate - foundLines[0].rate * (tg.dailyDiscount / 100), 2);
                                    foundLines[0].discountedRate = utilities.round(foundLines[0].rate - foundLines[0].rate * (tg.dailyDiscount / 100), 2);
                                    foundLines[0].discountPercent = tg.dailyDiscount;
                                    foundLines[0].discountDetail = `${tg.dailyDiscount}% corporate discount applied`;
                                }
                                if (vm.agreement.agreementType == 2 && tg && tg.weeklyDiscount > 0) {
                                    //foundLines[0].discountedRate = foundLines[0].discountedRate > 0 ? utilities.round(foundLines[0].rate - foundLines[0].discountedRate * (tg.weeklyDiscount / 100), 2) : utilities.round(foundLines[0].rate - foundLines[0].rate * (tg.weeklyDiscount / 100), 2);
                                    foundLines[0].discountedRate = utilities.round(foundLines[0].rate - foundLines[0].rate * (tg.weeklyDiscount / 100), 2);
                                    foundLines[0].discountPercent = tg.weeklyDiscount;
                                    foundLines[0].discountDetail = `${tg.weeklyDiscount}% corporate discount applied`;
                                }

                                if (vm.agreement.agreementType == 3 && tg && tg.monthlyDiscount > 0) {
                                    //foundLines[0].discountedRate = foundLines[0].discountedRate > 0 ? utilities.round(foundLines[0].rate - foundLines[0].discountedRate * (tg.monthlyDiscount / 100), 2) : utilities.round(foundLines[0].rate - foundLines[0].rate * (tg.monthlyDiscount / 100), 2);
                                    foundLines[0].discountedRate = utilities.round(foundLines[0].rate - foundLines[0].rate * (tg.monthlyDiscount / 100), 2);
                                    foundLines[0].discountPercent = tg.monthlyDiscount;
                                    foundLines[0].discountDetail = `${tg.monthlyDiscount}% corporate discount applied`;
                                }
                            }
                        }
                        if (discountedRate < foundLines[0].discountedRate && discountPercent > foundLines[0].discountPercent) {
                            foundLines[0].discountPercent = discountPercent;
                            foundLines[0].discountedRate = discountedRate;
                            foundLines[0].discountDetail = `${foundLines[0].discountPercent}% discount applied by staff`;
                        }
                    }
                }
                return chargesCalculator.calculate(vm.agreement);
            };
            vm.alert = function (rate) {
                alert(rate);
            }
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

                    //old 1
                    //var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    // vm.totalDays = duration.days(); 
                    //vm.remainingHrs = utilities.round(duration.hours() + (duration.minutes() / 60), 2);

                    //old 2
                    //  vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                    // var totalHrs = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'hours');
                    // vm.remainingHrs = totalHrs - (vm.totalDays * 24);
                }
                else {
                    vm.isTotalDaysAndHrs = false;
                }
            };

            function initFromMasterAgreement() {

                vm.quotation.quotationLines = options.quotationRates;
                vm.branchTaxCode();
                vm.loading = true;

                agreementService.getAgreementWithAdvanceAndDepositForEdit({
                    id: null
                }).success(function (result) {
                    vm.isEditMod = true;

                    vm.agreement = result.agreement;
                    vm.agreement.customerId = options.customerId;
                    vm.agreement.customer = options.customer;
                    vm.agreement.notes = options.notes;
                    vm.agreement.saleOrder = options.saleOrderToPass
                    vm.agreement.salesPersonId = options.customer.salesPersonId;
                    vm.agreement.masterAgreementId = options.masterAgreementId;
                    vm.agreement.taxPercent = options.taxPercent;

                    /*vm.agreement.agreementType = 3;*/
                    vm.agreement.agreementType = angular.copy(options.rateType);

                    if (vm.agreement.customer.contactCategory == 1) {
                        vm.isIndividualCustomerRadio = true;
                        vm.agreement.driverType = 1;
                        vm.agreement.driver = angular.copy(options.customer);
                    }
                    else if (vm.agreement.customer.contactCategory == 2) {
                        vm.isIndividualCustomerRadio = false;
                        vm.agreement.driverType = 3;
                    }

                    if (vm.agreement.customer)
                        getCustomerPicture(vm.agreement.customer.id);



                    if (vm.isMultiCurrencyEnabled && vm.agreement.customer) {
                        if (vm.agreement.customer.currency)
                            vm.agreement.customer.currency = vm.agreement.customer.currency.code;
                    }

                    vm.agreement.poNo = options.customerPoNo;
                    vm.vehicleType = options.vehicleType;
                    vm.vehicleTypeId = options.vehicleType.id;
                    vm.vehicleModel = options.vehicleModel;
                    vm.vehicleModelId = options.vehicleModel.id;
                    vm.agreement.movements[0].outDetail.dateTime = options.date;

                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;

                    vm.agreement.endDate = angular.copy(options.date);
                    var number = options.noOfMonths;
                    /*vm.agreement.endDate = vm.agreement.endDate.add(number, 'months')*/

                    if (vm.agreement.agreementType == 1) {
                        vm.agreement.endDate = vm.agreement.endDate.add(number, 'days')
                    } else if (vm.agreement.agreementType == 2) {
                        vm.agreement.endDate = vm.agreement.endDate.add(number, 'weeks')
                    } else if (vm.agreement.agreementType == 3) {
                        vm.agreement.endDate = vm.agreement.endDate.add(number, 'months')
                    }

                    vm.isMasterAgreement = true;

                    loadChargesFromOptions();

                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.loading = true;
                vm.branchTaxCode();
                agreementService.getAgreementWithAdvanceAndDepositForEdit({
                    id: agreementId,
                    advanceList: vm.advanceList,
                    depositList: vm.depositList
                }).success(function (result) {

                    vm.agreement = result.agreement;
                    vm.advanceList = result.advanceList;
                    vm.depositList = result.depositList;
                    if (vm.agreement.customer)
                        getCustomerPicture(vm.agreement.customer.id);

                    if (vm.isMultiCurrencyEnabled && vm.agreement.customer) {
                        vm.agreement.customer.currency = vm.agreement.customer.currency.code;
                    }
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

                        vm.quotation = vm.agreement.quotation;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        if (vm.agreement.customer)
                            vm.disableTariffCard = vm.agreement.customer.tariffCardId != null;
                        if (vm.agreement.vehicle)
                            vm.searchOtherGroupsVehicle = vm.agreement.tariffGroupId != vm.agreement.vehicle.tariffGroupId;

                        /* Dont load or apply tariff in edit mode
                        //in edit mod load tariff for vehicle. which will be used if some parameter is changed like dates etc.
                        var groupId = vm.agreement.vehicle.tariffGroupId;
                        if (groupId == null) groupId = -1;

                        if (isTariffEnabled) {
                            //load tariff
                            tariffHelper.loadTariff(groupId, function () {
                                //don't apply
                            });
                        }
                        */

                        //calculate hold for days using fromdate and todate if cash or check deposit
                        if (vm.deposit.voucherSubTypeId != 11) // all types except
                        {
                            var td = moment(vm.deposit.toDate);
                            var duration = moment.duration(td.diff(vm.deposit.fromDate));
                            vm.deposit.holdForDays = utilities.round(duration.asDays(), 0);
                        }
                        //if (vm.agreement && vm.agreement.charges) {
                        //    var foundLines = $filter('filter')(vm.agreement.charges, {
                        //        chargesTypeId: 1
                        //    }, true);
                        //    
                        //    if (foundLines.length == 1) {
                        //        if (foundLines[0].discountPercent >0) {
                        //            foundLines[0].discountedRate = foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100));
                        //        }
                        //    }
                        //}

                        if (vm.agreement.customer.contactCategory == 1) {
                            vm.isIndividualCustomerRadio = true;
                        }
                        else if (vm.agreement.customer.contactCategory == 2) {
                            vm.isIndividualCustomerRadio = false;
                        }

                        //add display text in customer
                        if (vm.agreement.customer) {
                            var abrev = vm.agreement.customer.abrev;
                            var code = vm.agreement.customer.code;
                            var displayText = vm.agreement.customer.name;
                            if (abrev || code) {
                                displayText = displayText + " (";
                            } else {
                                displayText = displayText + "";
                            }
                            displayText = displayText + abrev;
                            if (abrev) {
                                displayText = displayText + ", ";
                            } else {
                                displayText = displayText + "";
                            }
                            displayText = displayText + code;
                            if (abrev || code) {
                                displayText = displayText + ")";
                            } else {
                                displayText = displayText + "";
                            }

                            vm.agreement.customer.displayText = displayText;
                        }


                    } else {
                        vm.agreement.agreementNo = null;
                        vm.isEditMod = false;
                        vm.agreement.driverType = 1;
                    }

                    loadChargesFromSettings();

                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                    // vm.agreementTypeChange();

                }).finally(function () {
                    vm.loading = false;
                });
            }

            function initAgreement() {
                if (options.masterAgreementId)
                    initFromMasterAgreement();
                else
                    init();
            }

            initAgreement();
        }
    ]);
