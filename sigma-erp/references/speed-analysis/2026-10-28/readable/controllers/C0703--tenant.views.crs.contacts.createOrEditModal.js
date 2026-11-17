// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:182381-184122
appModule.controller('tenant.views.crs.contacts.createOrEditModal', [
        '$scope', '$filter', '$uibModal', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.taxCode', 'abp.services.app.person', 'personId', 'isFromSearchScreen', 'mrzParser', 'utilities',
        'abp.services.app.contactGroup', 'abp.services.app.chargesSetting', 'abp.services.app.directory', 'abp.services.app.tariffCard', 'abp.services.app.commonLookup', 'abp.services.app.tenantSettings', 'abp.services.app.currency', 'appSession',
        function ($scope, $filter, $uibModal, $uibModalInstance, countryService, taxCodeService, personService, personId, isFromSearchScreen, mrzParser, utilities,
            contactGroupService, chargesSettingService, directoryService, tariffCardService, commonLookupService, tenantSettingsService, currencyService, appSession) {

            var vm = this;
            vm.isCreditLimitNotValid = false;
            vm.saving = false;
            vm.individualCustomerCustomField4 = utilities.parseBoolean(abp.setting.get("App.General.IndividualCustomerCustomField4"));
            vm.isEditMod = false;
            vm.checkHighlighted = false;
            vm.selectedCountry = null;
            vm.selectedNationality = null;
            vm.picture = [];
            vm.isCvv = utilities.parseBoolean(abp.setting.get("App.General.IsCvv"));
            vm.isCardLast4DigitsOnly = utilities.parseBoolean(abp.setting.get("App.General.IsCardLast4DigitsOnly"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.gender = '';
            vm.residenceStatus = '';
            vm.fuelSurchargeType = '';
            vm.fuelSurchargeType =
                [{ id: 1, name: app.localize('Percentage') }, { id: 2, name: app.localize('Amount') }];
            vm.genders = [{ id: 1, name: app.localize('Male') }, { id: 2, name: app.localize('Female') }];
            vm.residenceStatus = [{ id: 1, name: app.localize('Resident') }, { id: 2, name: app.localize('Visitor') }];
            vm.MissingTypes = [2, 3, 4];
            vm.taxPercentage = abp.setting.get("App.General.TaxPercentage");
            vm.isBusinessSourceBroker_CustomFieldType = parseInt(abp.setting.get("App.General.IsBusinessSourceBroker_CustomFieldType"));
            vm.tollSurcharge = parseFloat(abp.setting.get("App.General.TollsSurCharge"));
            vm.darbSurCharge = parseFloat(abp.setting.get("App.General.DarbTollsSurCharge"));
            vm.allowSavingExpiryDocument = utilities.parseBoolean(abp.setting.get("App.General.AllowTOSaveContactWithExpiryDoucment"));
            vm.trafficFineSurCharge = parseFloat(abp.setting.get("App.General.TrafficFineSurCharge"));
            vm.parkingTicketSurCharge = parseFloat(abp.setting.get("App.General.ParkingSurCharge"));
            vm.invoicingRule = parseFloat(abp.setting.get("App.General.InvoicingRuleIndividual"));
            vm.invoicingType = parseFloat(abp.setting.get("App.General.InvoicingTypeIndividual"));
            vm.isTariffCardEnable = abp.auth.hasPermission("Pages.Tenant.TariffCards");
            vm.isCustomerWiseDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseDiscount");
            vm.isChargesTypeMergingInInvoiceCustomerWise = abp.features.isEnabled("CRS.CustomFeatures.ChargesTypeMergingInInvoiceCustomerWise");
            vm.isERSenabled = abp.features.isEnabled("ERS");
            vm.isCreditPeriodEnabled = abp.auth.hasPermission("Pages.Tenant.Customers.EnableCreditPeriod");
            vm.isCreditLimitEnabled = abp.auth.hasPermission("Pages.Tenant.Customers.EnableCreditLimit");
            vm.isMulticurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isEnableVerifiedFeature = abp.features.isEnabled("CRS.Vouchers.Approval.CustomerApproval");

            vm.isCRSVouchersInvoicesEnabled = abp.features.isEnabled("CRS.Vouchers.Invoices");
            vm.isCRSParkingsEnabled = abp.features.isEnabled("CRS.Parking");
            vm.isCRSTollsEnabled = abp.features.isEnabled("CRS.Tolls");
            vm.isCRSFinesEnabled = abp.features.isEnabled("CRS.Fines");
            vm.emailTemplates = utilities.getEmailTemplates();
            vm.isMultipleSmtpEnabled = abp.features.isEnabled("CRS.CustomFeatures.MultipleEmailSmtp");
            //vm.customerWiseTrnBasedOnPeriod = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseTrnBasedOnPeriod");


            vm.invoicingOptions = [{ id: 1, name: app.localize('ClubWithRental') }, { id: 2, name: app.localize('Separate') }];

            vm.isEmiratesIDCardReaderEnable = abp.features.isEnabled("CRS.CustomFeatures.EmiratesIDCardReader");
            vm.leaseInvoicingRule = parseFloat(abp.setting.get("App.General.LeaseInvoicingRuleIndividual"));
            vm.leaseInvoicingType = parseFloat(abp.setting.get("App.General.LeaseInvoicingTypeIndividual"));
            vm.isfinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar"); //added by arslan for Qatar fines
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isParkingModuleEnabled = abp.features.isEnabled("CRS.Parking");
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");
            vm.isCustomerWiseSettingEnabled = utilities.parseBoolean(abp.setting.get("App.General.AllowCustomerWiseSetting"));
            vm.tollsSurChargeType = gettollsSurChargeType(parseFloat(abp.setting.get("App.General.TollsSurChargeType")));
            vm.darbTollsSurChargeType = getDarbtollsSurChargeType(parseFloat(abp.setting.get("App.General.DarbTollsSurChargeType")));
            vm.trafficFineSurChargeType = gettrafficFineSurChargeType(parseFloat(abp.setting.get("App.General.FineSurchargeType")));
            vm.parkingTicketSurChargeType = getParkingSurChargeType(parseFloat(abp.setting.get("App.General.ParkingSurchargeType")));
            vm.isFirstNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsFirstNameRequired"));
            vm.isMiddleNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsMiddleNameRequired"));
            vm.isLastNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsLastNameRequired"));
            vm.isGenderRequired = utilities.parseBoolean(abp.setting.get("App.General.IsGenderRequired"));
            vm.isResidenceStatus = utilities.parseBoolean(abp.setting.get("App.General.ResidenceStatus"));
            vm.isResidenceStatusRequired = utilities.parseBoolean(abp.setting.get("App.General.IsResidenceStatusRequired"));
            vm.isEmailRequired = utilities.parseBoolean(abp.setting.get("App.General.IsEmailRequired"));
            vm.isNationalityRequired = utilities.parseBoolean(abp.setting.get("App.General.IsNationalityRequired"));
            vm.isNationalIdRequired = utilities.parseBoolean(abp.setting.get("App.General.IsNationalIdRequired"));
            vm.isCompanyRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCompanyRequired"));
            vm.showAdvancePhoneNumberInputInContacts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAdvancePhoneNumberInputInContacts"));
            vm.isNextOfKinNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsNextOfKinNameRequired"));
            vm.isNextOfKinContactNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsNextOfKinContactNoRequired"));
            vm.isMobileNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsMobileNoRequired"));
            vm.isTelephoneHomeRequired = utilities.parseBoolean(abp.setting.get("App.General.IsTelephoneHomeRequired"));
            vm.isTelephoneWorkRequired = utilities.parseBoolean(abp.setting.get("App.General.IsTelephoneWorkRequired"));
            vm.isAddressNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsAddressNoRequired"));
            vm.isCityRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCityRequired"));
            vm.isStateRequired = utilities.parseBoolean(abp.setting.get("App.General.IsStateRequired"));
            vm.isZipCodeRequired = utilities.parseBoolean(abp.setting.get("App.General.IsZipCodeRequired"));
            vm.isCountryRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCountryRequired"));
            vm.isAgeRequired = utilities.parseBoolean(abp.setting.get("App.General.IsAgeRequired"));
            vm.isDateOfBirthRequired = utilities.parseBoolean(abp.setting.get("App.General.IsDateOfBirthRequired"));
            vm.isManualCode = utilities.parseBoolean(abp.setting.get("App.DocumentNos.ManualCustomerCode"));
            vm.isDrivingExperienceRequired = utilities.parseBoolean(abp.setting.get("App.General.IsDrivingExperienceRequired"));
            vm.isSalesPersonRequired = utilities.parseBoolean(abp.setting.get("App.General.IsSalesPersonRequired"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isReferralNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReferralNameRequired"));
            vm.isReferralContactNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReferralContactNoRequired"));
            vm.isReferralRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReferralRequired"));
            vm.isDateOfBirthFeildRequired = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsDateOfBirthFeildRequired"));

            vm.isBusinessSourceBroker = utilities.parseBoolean(abp.setting.get("App.General.IsBusinessSourceBroker"));
            vm.isLoyalityNumber = utilities.parseBoolean(abp.setting.get("App.General.IsLoyalityNumber"));

            vm.isCodeRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCodeRequired"));
            vm.fuelSurchargeInvoiceClubWithFuelInvoice = utilities.parseBoolean(abp.setting.get("App.Speed.Common.FuelSurchargeInvoiceClubWithFuelInvoice"));
            vm.percentageFuelSurchargeInvoiceClubWithFuelInvoice = parseFloat(abp.setting.get("App.General.PercentageFuelSurchargeInvoiceClubWithFuelInvoice"));
            vm.isDriverLicenseRequired = utilities.parseBoolean(abp.setting.get("App.General.IsDriverLicenseRequired"));
            vm.tollsSurchargeTypes = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.darbTollsSurchargeTypes = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.trafficFineSurchargeTypes = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.parkingSurchargeTypes = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.isFinancialLeaseEnabled = abp.features.isEnabled("CRS.LeaseFinancial");
            vm.isDebtCollectionEnabled = abp.features.isEnabled("Core.DebtCollection");
            vm.allowFusionMapping = abp.auth.hasPermission('Pages.Administration.Tenant.Integration.Fusion.Mappings');
            vm.externalIds = [];
            vm.isHighLightCountryEnabled = abp.features.isEnabled("CRS.CustomFeatures.HighLightBlackListCountry");
            vm.showCreationDate = utilities.parseBoolean(abp.setting.get("App.General.ShowCreationDateForIndividualCustomer"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.contactCardpermissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards'),
                add: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Add'),
                edit: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Delete'),
                viewCreditCardWithLastFourDigit: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.ViewCreditCardWithLastFourDigit'),
                viewFullCreditCard: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.ViewFullCreditCardDetails'),

            };

            vm.contactExternalIdTypes = [
                {
                    key: 100,
                    name: 'Fusion Customer Number'
                },
                {
                    key: 101,
                    name: 'Customer Bill to site number'
                },
                {
                    key: 102,
                    name: 'Fusion Payment Tems'
                }
            ];

            vm.permissions = {
                isEnableVerified: abp.auth.hasPermission('Pages.Tenant.Contacts.CustomerApproval'),
            };
            vm.isLimitPermissions = !abp.auth.hasPermission('Pages.Tenant.Contacts.Edit') && abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit') && vm.isEditMod;
            vm.hasLimitedEditPermission = abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit'),
                vm.hasEditPermission = abp.auth.hasPermission('Pages.Tenant.Contacts.Edit'),
                vm.allowOnlyNumericNumberInContactNumber = utilities.parseBoolean(abp.setting.get("App.Common.AllowOnlyNumericNumberInContactNumber"));
            vm.locations = [];
            var imageDocs = [];
            vm.formateSettingName = "AdvanceSettings.Formates.NationalIdFormate";
            vm.formate = null;
            vm.taxRules = utilities.getTaxRules();

            vm.tariffCards = [];
            vm.tariffCard = null;
            //vm.person = {
            //    trnLogsList: []
            //};

            function gettollsSurChargeType(id) {
                if (id == 1)
                    return "Fixed";
                else if (id == 2)
                    return "Percentage";
                else return '';
            }

            function getDarbtollsSurChargeType(id) {
                if (id === 1)
                    return "Fixed";
                else if (id === 2)
                    return "Percentage";
                else return '';
            }

            function gettrafficFineSurChargeType(id) {
                if (id === 1)
                    return "Fixed";
                else if (id === 2)
                    return "Percentage";
                else return '';
            }
            function getParkingSurChargeType(id) {
                if (id === 1)
                    return "Fixed";
                else if (id === 2)
                    return "Percentage";
                else return '';
            }

            vm.localize = function (value) {
                return app.localize(value);
            };

            function getAllChargesSettings() {
                vm.loading = true;
                chargesSettingService.getChargesTypes().success(function (data) {
                    vm.allChargesSettings = data.filter(e => e.id != 1 && e.id != 7 && e.id != 8
                        && e.id != 33 && e.id != 34 && e.id != 39
                        && e.id != 73 && e.id != 74 && e.id != 77);
                    angular.forEach(vm.allChargesSettings, function (value, key) {
                        value.key = value.name;
                        value.name = app.localize(value.name);
                        if (value.detail != null) value.name = value.name + ' (' + value.detail + ')';
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            function externalIdObject() {
                var Obj = new Object();
                Obj.externalId = null;
                Obj.type = null;

                return Obj;
            }

            vm.removeExternalIdRow = function (obj) {
                let index = vm.externalIds.indexOf(obj);
                if (index > -1) {
                    vm.externalIds.splice(index, 1);
                }
            };

            vm.addExternalIdRow = function () {
                vm.externalIds.push(externalIdObject());
            };

            vm.getContactExternalType = (t) => {
                return vm.contactExternalIdTypes.find(x => x.key === t).name;
            }

            vm.isContactExternalType = (obj) => {
                if (vm.externalIds.filter(x => x.type === obj.type).length < 2) {
                    let contactExternalIdType = vm.contactExternalIdTypes.filter(x => x.key > 99).find(x => x.key === obj.type);
                    return contactExternalIdType ? true : false;
                }
                return false;
            }

            function setRequiredExternalIds() {
                vm.contactExternalIdTypes.forEach(x => {
                    let eid = vm.externalIds.find(y => y.type === x.key);
                    if (!eid) {
                        vm.externalIds.push({ type: x.key });
                    }
                });
            }
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM');
                }
                else {
                    return "";
                }
            };

            vm.person = {
                chargesTypeMerging: []
            };

            vm.filters = {
                name: ''
            };
            vm.options = {
                format: vm.dateFormat,
                maxDate: moment().endOf('day')
            };
            vm.person = {
                dateOfBirth: null,
                verified: true
            };
            vm.getCardType = function (type) {
                if (type === 1)
                    return 'MasterCard';
                else if (type === 2)
                    return 'Visa';
                else if (type === 3)
                    return 'AmericanExpress';
            };
            vm.invoicingRules = [
                {
                    id: 1,
                    name: app.localize('DateToDate')
                },
                {
                    id: 2,
                    name: app.localize('CalendarMonth')
                },
                {
                    id: 3,
                    name: app.localize('ThirtyDays')
                }];

            vm.invoicingTypes = [
                {
                    id: 1,
                    name: app.localize('Advance')
                },
                {
                    id: 2,
                    name: app.localize('Post')
                }];

            vm.leaseInvoicingRules = [
                {
                    id: 1,
                    name: app.localize('DateToDate')
                },
                {
                    id: 2,
                    name: app.localize('CalendarMonth')
                },
                {
                    id: 3,
                    name: app.localize('ThirtyDays')
                }];
            if (vm.isFinancialLeaseEnabled)
                vm.leaseInvoicingRules.push({ id: 4, name: app.localize('LeaseFinancial') });

            vm.leaseInvoicingTypes = [
                {
                    id: 1,
                    name: app.localize('Advance')
                },
                {
                    id: 2,
                    name: app.localize('Post')
                }];

            var isValid = true;
            var errorMessage = '';
            var scan = null;
            vm.documentReaderEnabled = abp.features.isEnabled("Core.DocumentReader");

            vm.removeRow = function (row) {
                var index = vm.person.contactCards.indexOf(row);
                vm.person.contactCards.splice(index, 1);
            };
            //function trnLogsListObject() {
            //    var line = new Object();
            //    line.id = 0;
            //    line.fromDate = null;
            //    line.toDate = null;
            //    line.taxId = null;
            //    line.locationId = null; 
            //    line.contactId = null; 
            //    return line;
            //}

            //vm.addTRNRow = function () {

            //    vm.person = vm.person || {};

            //    if (!vm.person.trnLogsList) {
            //        vm.person.trnLogsList = [];
            //    }

            //    vm.person.trnLogsList.push(trnLogsListObject());
            //};
            //vm.removeTRNRow = function (obj) {
            //    var index = vm.person.trnLogsList.indexOf(obj);
            //    vm.person.trnLogsList.splice(index, 1);
            //};



            vm.searchSalesPersons = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.salesPersons = response.data.items;
                });
            };

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPersonOne().then(function (response) {

                    vm.userList = response.data.items;
                });
            };
            vm.searchSalesPersonPopoup = function () {
                var modalInstance = openSearchContactModel(null, 1);

                modalInstance.result.then(function (result) {
                    if (result !== null) {
                        vm.person.salesPerson = result;
                        vm.salesPersonSelected();
                    }
                });
            };

            vm.salesPersonSelected = function () {
                vm.person.salesPersonId = vm.person.salesPerson.id;
            };

            vm.searchDebtCollectorPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result !== null) {
                        vm.person.debtCollector = result;
                        vm.person.debtCollectorId = result.id;
                    }
                });
            };

            //vm.getDocsByContactId = function (identityDocumentId) {
            //    return imageDocs.filter(x => x.identityDocumentId === identityDocumentId);
            //};

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

            var hasRequiredTenantId = abp.session.tenantId === 950 || abp.session.tenantId === 290; //Regency || crs demo, ABC Rac

            function initDocumentReader() {

                //if document reader is enabled
                if (!vm.documentReaderEnabled) return;
                if (scan !== null) return;
                if ($.connection.ScanHub === undefined) return;

                scan = $.connection.ScanHub;
                $.connection.hub.url = (hasRequiredTenantId || location.hostname === "localhost" ? 'https' : 'http') + '://localhost:44334/signalr';

                scan.client.ReceiveMessage = function (tag, message) {
                    parseMrzAndUpdateFields(message);
                };

                scan.client.ReceiveFile = function (tag, filename, filepath, base64data) {
                    uploadReceivedImage(base64data);
                };

                $.connection.hub.start();
            };

            function stopDocumentReader() {
                if (vm.documentReaderEnabled && scan !== null) {
                    $.connection.hub.stop();
                    scan = null;
                }
            }
            vm.searchCustomLookup = function ($select, lookup) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return commonLookupService.searchCustomLookups({ keyword: $select.search, lookup: lookup }).then(function (response) {
                    vm.customLookups = response.data.items;
                });
            };

            vm.getCustomLookups = function () {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return commonLookupService.getCustomLookups({ lookup: 'CustomFieldTypeBusinessBroker' }).then(function (response) {
                    vm.customLookupsList = response.data.items;
                });
            };

            vm.scanDocument = function scanDocumentFromScanner() {
                try {
                    if (scan !== null) {
                        scan.server.doscanning()
                            .done(function (result) {
                                //scanning done...
                                abp.notify.info('Document scanned.');
                                console.log(result);
                            })
                            .fail(function (reason) {
                                abp.notify.error(reason);
                            });
                    }
                    else {
                        abp.notify.error('Please install Service.');
                    }
                } catch (exp) {
                    alert(JSON.stringify(exp));
                }

            };

            function parseMrzAndUpdateFields(mrz) {
                var docMrz = mrzParser.parse(mrz);
                if (docMrz === null) return;

                var docs = $filter('filter')(vm.person.identityDocuments, {
                    identityDocumentType: docMrz.identityDocumentType
                }, true);

                $scope.$apply(function () {
                    if (vm.person.firstName === null || vm.person.firstName === '') {
                        vm.person.firstName = docMrz.names.firstName;
                        vm.person.middleName = docMrz.names.middleName;
                        vm.person.lastName = docMrz.names.lastName;
                    }


                    if (vm.person.referralName === null || vm.person.referrallName == '')
                        vm.person.referralName = docMrz.refferalName;

                    if (vm.person.referralContactNo === null || vm.person.referralContactNo == '')
                        vm.person.referrallContactNo = docMrz.referralContactNo;

                    if (vm.person.referral === null || vm.person.referral <= 0)
                        vm.person.referral = docMrz.referral;

                    if (vm.person.gender === null || vm.person.gender <= 0)
                        vm.person.gender = docMrz.gender;

                    if (vm.person.dateOfBirth === null)
                        vm.person.dateOfBirth = docMrz.dateOfBirth;

                    if (vm.selectedNationality === null && docMrz.nationality.code !== '') {
                        countryService.searchCountries({ name: docMrz.nationality.code }).then(function (response) {
                            var countries = response.data.items;
                            if (countries.length > 0)
                                vm.selectedNationality = countries[0];
                        });
                    }

                    if (docs.length > 0) { //update
                        docs[0].documentNo = docMrz.documentNo;
                        docs[0].issuedBy = docMrz.issuedBy.name;
                        docs[0].expiryDate = docMrz.expiryDate;

                    } else { //add
                        vm.person.identityDocuments.push(
                            {
                                documentNo: docMrz.documentNo,
                                identityDocumentType: docMrz.identityDocumentType,
                                issuedBy: docMrz.issuedBy.name,
                                issueDate: null,
                                expiryDate: docMrz.expiryDate,
                                images: []
                            }
                        );
                    }
                });


            }

            function uploadReceivedImage(base64data) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/uploadDocumentModal.cshtml',
                    controller: 'tenant.views.crs.contacts.uploadDocumentModal as vm',
                    backdrop: 'static',
                    resolve: {
                        base64data: function () {
                            return base64data;
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    vm.addIndentityDocument(result.identityDocumentType); //add if not already added.

                    var docs = $filter('filter')(vm.person.identityDocuments, {
                        identityDocumentType: result.identityDocumentType
                    }, true);

                    if (docs.length > 0) {
                        var img = {
                            guid: result.guid,
                            url: result.url,
                            path: ''
                        };

                        docs[0].images.push(img);

                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = result.urlWithToken;
                        imageDetail.img = result.urlWithToken;
                        imageDetail.description = vm.getIdentificationDocumentType(result.identityDocumentType);

                        if (docs[0].gallaryImages === undefined)
                            docs[0].gallaryImages = [];

                        docs[0].gallaryImages.push(imageDetail);
                    }
                });
            }

            vm.openUploadDocument = function (identityDocument) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadDocumentModal as vm',
                    backdrop: 'static',
                    resolve: {
                        //identityDocumentType: function () {
                        //    return identityDocumentType;
                        //}
                        options: function () {
                            return {
                                identityDocument: identityDocument,
                            };
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    //vm.addIndentityDocument(result.identityDocumentType); //add if not already added.
                    //var docs = $filter('filter')(vm.person.identityDocuments, {
                    //    identityDocumentType: result.identityDocumentType
                    //}, true);

                    //if (docs.length > 0) {
                    var img = {
                        guid: result.guid,
                        url: result.url,
                        name: result.name,
                        path: ''
                    };

                    identityDocument.images.push(img);

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = vm.getIdentificationDocumentType(identityDocument.identityDocumentType);
                    imageDetail.name = result.name;
                    imageDetail.url = result.url;


                    if (identityDocument.gallaryImages === undefined)
                        identityDocument.gallaryImages = [];

                    if (vm.isDocument(imageDetail)) {
                        imageDetail.identityDocumentId = identityDocument.id;

                        if (!identityDocument.nonImgDocs)
                            identityDocument.nonImgDocs = [];
                        identityDocument.nonImgDocs.push(imageDetail);
                    }
                    else
                        identityDocument.gallaryImages.push(imageDetail);
                    //}
                });
            };


            vm.openUploadPicture = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadImageModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                identityDocument: null
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    var img = {
                        guid: result.guid,
                        url: result.url,
                        name: result.name,
                        path: '',
                        documentType: 5
                    };
                    vm.person.picture = img;

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = '';
                    vm.picture = [];
                    vm.picture.push(imageDetail);
                });
            };

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }

            vm.addCreditCardRow = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/addCreditCardModal.cshtml',
                    controller: 'tenant.views.common.documents.addCreditCardModal as vm',
                    backdrop: 'static',
                    resolve: {
                        contactCreditCard: function () {
                            return {};
                        }

                    }

                });

                modalInstance.result.then(function (result) {
                    vm.person.contactCards.push(result);
                });
            };
            vm.updateCreditCardRow = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/addCreditCardModal.cshtml',
                    controller: 'tenant.views.common.documents.addCreditCardModal as vm',
                    backdrop: 'static',
                    resolve: {
                        contactCreditCard: function () {
                            return row;
                        }

                    }

                });


            }

            //  Expiry And IssueDate Check Function
            function checkingIssueAndExpiryDate() {
                isValid = true;
                errorMessage = 'Contact Can Not Be Saved Due To Following Issues: \n';
                if (vm.allowSavingExpiryDocument) {

                    if (vm.person.identityDocuments !== null) {

                        var identityDocuments = vm.person.identityDocuments;
                        if (identityDocuments.length > 0) {
                            identityDocuments.forEach(doc => {
                                if (doc.expiryDate <= moment().startOf('day')) {
                                    isValid = false;
                                    errorMessage = errorMessage + '\n Expiry Date can  not less than Current Date';
                                }
                            });
                        }
                        angular.forEach(vm.person.identityDocuments, function (value, key) {
                            if (value.issueDate === false) value.issueDate = null; //due to picker issue if date is made empty then in model it sets false, so in that case set to null
                            if (value.expiryDate === false) value.expiryDate = null; //due to picker issue if date is made empty then in model it sets false, so in that case set to null

                            if (value.expiryDate !== null && value.issueDate !== null) {
                                if (value.issueDate > value.expiryDate) {
                                    isValid = false;
                                    errorMessage = errorMessage + '\n Expiry Date is less than the Issue Date';
                                }
                            }
                        });
                    }
                }
            }
            vm.save = function () {
                let isDisabledVerified = !vm.isEnableVerifiedFeature || vm.person.verified;

                isDisabledVerified && checkingIssueAndExpiryDate();

                vm.person.externalIds = vm.externalIds;

                vm.saving = true;
                if (vm.isResidenceStatus) {
                    //vm.nationalIdCheck = vm.person.identityDocuments.length > 0 && vm.person.identityDocuments.some(e => e.identityDocumentType === 3);
                    if (vm.person.residenceStatus == 1 && !(vm.person.identityDocuments.length > 0 && vm.person.identityDocuments.some(e => e.identityDocumentType === 3))) {
                        abp.message.info("As Resident, National ID Is Required");
                        vm.saving = false;
                        return;
                    }
                    if (vm.person.residenceStatus == 1 && !(vm.person.identityDocuments.length > 0 && vm.person.identityDocuments.some(e => e.identityDocumentType === 4))) {
                        abp.message.info("As Resident, Driving License Is Required");
                        vm.saving = false;
                        return;
                    }
                    if (vm.person.residenceStatus == 2 && !(vm.person.identityDocuments.length > 0 && vm.person.identityDocuments.some(e => e.identityDocumentType === 2))) {
                        abp.message.info("As Visitor, Passport Is Required");
                        vm.saving = false;
                        return;
                    }
                    if (vm.person.residenceStatus == 2 && !(vm.person.identityDocuments.length > 0 && vm.person.identityDocuments.some(e => e.identityDocumentType === 4))) {
                        abp.message.info("As Visitor, Driving License Is Required");
                        vm.saving = false;
                        return;
                    }
                }
                else {
                    if ((vm.isNationalIdRequired)) {
                        if (!(vm.person.identityDocuments.length > 0 && vm.person.identityDocuments.some(e => e.identityDocumentType === 3))) {
                            abp.message.info("National ID Is Required");
                            vm.saving = false;
                            return;
                        }
                    }
                }

                if (vm.isDriverLicenseRequired && isDisabledVerified) {
                    if (!(vm.person.identityDocuments.length > 0 && vm.person.identityDocuments.some(e => e.identityDocumentType === 4))) {
                        abp.message.info("Driving License Is Required");
                        vm.saving = false;
                        return;
                    }
                }




                if (vm.person.dateOfBirth > moment() && isDisabledVerified) {
                    abp.message.info("DOB Should not be Future Date");
                    vm.saving = false;
                    return;
                }
                if (isValid) {

                    if (vm.filters.chargesTypeMerging)
                        vm.person.chargesTypeMerging = angular.toJson(vm.filters.chargesTypeMerging);
                    else
                        vm.person.chargesTypeMerging = "";

                    if (vm.selectedCountry !== null) vm.person.address.country = vm.selectedCountry.name;
                    if (vm.selectedNationality !== null) vm.person.nationality = vm.selectedNationality.name;
                    if (vm.person.picture && vm.dbPicture) {
                        if (vm.person.picture.guid == vm.dbPicture.guid) {
                            vm.person.picture = null;
                        }
                    }
                    personService.createOrUpdatePerson({
                        person: vm.person,
                        contactCards: vm.person.contactCards
                        //trnLogsList: vm.person.trnLogsList
                    }).success(function () {
                        if (!isFromSearchScreen) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            stopDocumentReader();
                            $uibModalInstance.close();
                        } else {
                            stopDocumentReader();
                            $uibModalInstance.close(vm.person);
                        }
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    //abp.message.info(app.localize('Expiry Date cannot be less than the Issue Date'));
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            };

            vm.cancel = function () {
                stopDocumentReader();
                $uibModalInstance.dismiss();
            };

            vm.isPersonVerifiedChange = function () {
                showReqIdentityDocumentsRow();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            };

            vm.doesIdentityDoucmentExist = function (documentType) {
                if (!vm.person) return false;
                if (!vm.person.identityDocuments) return false;

                var docs = $filter('filter')(vm.person.identityDocuments, {
                    identityDocumentType: documentType
                }, true);

                return (docs.length > 0);
            };



            vm.addIndentityDocument = function (row) {
                let isDisabledVerified = !vm.isEnableVerifiedFeature || vm.person.verified;
                if (!vm.person.identityDocuments) return;
                let prevfound = vm.person.identityDocuments.filter(e => e.identityDocumentType === row.identityDocumentType)[0];
                if (prevfound) {
                    //if (vm.isEditMod) {
                    prevfound.identityDocumentType = row.identityDocumentType;
                    prevfound.isRequired = row.isRequired;
                    prevfound.verifiedRequired = isDisabledVerified && row.isRequired;
                    //}
                } else {
                    if (vm.doesIdentityDoucmentExist(row.identityDocumentType)) return;
                    vm.person.identityDocuments.push(
                        {
                            documentNo: "",
                            identityDocumentType: row.identityDocumentType,
                            isRequired: row.isRequired,
                            verifiedRequired: isDisabledVerified && row.isRequired,
                            issuedBy: "",
                            issueDate: null,
                            expiryDate: null,
                            images: []
                        }
                    );
                }
            };

            vm.getIdentificationDocumentType = function (id) {
                if (id === 1)
                    return app.localize('TradeLicense');
                else if (id === 2)
                    return app.localize('Passport');
                else if (id === 3)
                    return app.localize('NationalId');
                else if (id === 4)
                    return app.localize('DrivingLicense');
                else if (id === 5)
                    return app.localize('OtherDocument');
                else if (id === 8)
                    return app.localize('Visa');
                else if (id == 9)
                    return app.localize('CreditApplication');
                else if (id == 15)
                    return app.localize('OtherDocument2');
                else if (id == 16)
                    return app.localize('OtherDocument3');
                else if (id == 17)
                    return app.localize('OtherDocument4');
                else
                    return "";
            };

            vm.removeIndentityDocument = function (documentType) {
                for (var i = 0; i < vm.person.identityDocuments.length; i++) {
                    if (vm.person.identityDocuments[i].identityDocumentType === documentType) {
                        vm.person.identityDocuments.splice(i, 1);
                        return;
                    }
                }
            };
            vm.removeDoc = function (identityDoc, doc) {
                identityDoc.nonImgDocs = identityDoc.nonImgDocs.filter(x => x.url !== doc.url);
                identityDoc.images = identityDoc.images.filter(e => e.url != doc.url);
            };

            vm.isFieldMondatory = function (name) {
                if (!vm.isEnableVerifiedFeature || vm.person.verified) {
                    if (name === "FirstName")
                        return vm.isFirstNameRequired;
                    else if (name === "MiddleName")
                        return vm.isMiddleNameRequired;
                    else if (name === "LastName")
                        return vm.isLastNameRequired;
                    else if (name === "Gender")
                        return vm.isGenderRequired;
                    else if (name === "Email")
                        return vm.isEmailRequired;
                    else if (name === "Nationality")
                        return vm.isNationalityRequired;
                    else if (name === "Company")
                        return vm.isCompanyRequired;
                    else if (name === "NextOfKinName")
                        return vm.isNextOfKinNameRequired;
                    else if (name === "NextOfKinContactNo")
                        return vm.isNextOfKinContactNoRequired;
                    else if (name === "MobileNo")
                        return vm.isMobileNoRequired;
                    else if (name === "TelephoneHome")
                        return vm.isTelephoneHomeRequired;
                    else if (name === "TelephoneWork")
                        return vm.isTelephoneWorkRequired;
                    else if (name === "Address")
                        return vm.isAddressNoRequired;
                    else if (name === "City")
                        return vm.isCityRequired;
                    else if (name === "State")
                        return vm.isStateRequired;
                    else if (name === "ZipCode")
                        return vm.isZipCodeRequired;
                    else if (name === "Country")
                        return vm.isCountryRequired;
                    else if (name === "Age")
                        return vm.isDateOfBirthFeildRequired;
                    else if (name === "DateOfBirth")
                        return vm.isDateOfBirthFeildRequired;
                    else if (name === "DrivingExperience")
                        return vm.isDrivingExperienceRequired;
                    else if (name === "SalesPerson")
                        return vm.isSalesPersonRequired;
                    else if (name === "Code")
                        return true;
                    else if (name === "ManualCode")
                        return false;
                    else if (name === "ReferralName")
                        return vm.isReferralNameRequired;
                    else if (name === "ReferralContactNo")
                        return vm.isReferralContactNoRequired;
                } else {
                    var notVerifiedFeildsArr = ["FirstName"];//mondatory feilds for in valid person in array
                    return [...notVerifiedFeildsArr].indexOf(name) > -1;
                }

            };

            vm.searchCountries = function (filter) {
                if (!vm.isHighLightCountryEnabled) {
                    vm.filters.name = filter;
                    if (vm.filters.name === '')
                        vm.filters.name = "~";  //to avoid default suggestions 

                    return countryService.searchCountries(vm.filters).then(function (response) {
                        vm.countries = response.data.items;
                    });
                }
                else {
                    vm.filters.name = filter;
                    if (vm.filters.name === '') {
                        vm.filters.name = "~";  // to avoid default suggestions 
                    }
                    return countryService.searchCountries(vm.filters).then(function (response) {
                        if (response && response.data && response.data.items) {
                            vm.countries = response.data.items.map(country => ({
                                id: country.id,
                                name: country.name,
                                isHighlighted: false
                            }));
                            vm.countries.forEach(country => {
                                const isBlacklisted = vm.searchCountriesFromSetting.some(e => e.id === country.id);
                                if (isBlacklisted) {
                                    country.isHighlighted = true;
                                } else if (vm.selectedNationality && vm.selectedNationality.id === country.id) {
                                    country.isHighlighted = true;
                                }
                            });
                        }

                    });
                }


            };

            function getContactGroups() {
                contactGroupService.getContactGroupsOnContactType({ contactType: 2 }).success(function (result) {
                    vm.contactGroups = $filter('filter')(result.items, {
                        isDefault: false
                    }, true);

                }).finally(function () { vm.loading = false; });
            }
            function getTaxCodes() {
                taxCodeService.getTaxCodes().success(function (result) {
                    vm.taxCodes = result.items;
                }).finally(function () {
                    vm.loading = false;
                })
            }
            function getCurrencies() {
                currencyService.getCurrencies().success(function (result) {
                    vm.currencies = result.items;
                }).finally(function () { vm.loading = false; });
            }
            function getBaseCurrency() {
                currencyService.getCurrencies().success(function (result) {
                    vm.person.currencyId = result.items.filter(p => p.isBase)[0].id;
                }).finally(function () { vm.loading = false; });
            }
            //vm.searchCompany = function ($select) {
            //    return directoryService.search({ keyword: $select.search, contactCategory: 2 }).then(function (response) {
            //        vm.company = response.data.items;

            //    });
            //};
            function getGender(id) {
                if (id === 1)
                    vm.gender = "Male";
                if (id === 2)
                    vm.gender = "Female";

            };

            vm.emiratesDataReader = function () {
                var url = 'http://localhost:7845';

                $.ajax({
                    type: "GET", //GET , POST
                    url: url + "/api/Emirates/GetData",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        //console.log(result);
                        if (result !== null) {
                            if (result.Success) {
                                vm.emiratesDataFieldManager(result.Data);
                            }
                            else {
                                abp.notify.warn(result.Message);
                            }
                        } else {
                            abp.notify.warn('Device or Card not found', 'Not Found');
                        }
                    },
                    error: function (error) {
                        console.log(error);
                        abp.notify.error('Please start service', 'Service Error');
                    }
                });
            };
            vm.emiratesDataFieldManager = function (person) {

                var fullName = person.NonModifiableData.FullNameEnglish.split(",").filter(part => part.trim() !== '');

                if (fullName !== null) {
                    if (fullName.length > 0) {
                        vm.person.firstName = fullName[0];
                    }

                    if (fullName.length > 2) {
                        vm.person.middleName = fullName[1];
                        vm.person.lastName = fullName.slice(2).join(' ');
                    } else if (fullName.length === 2) {
                        vm.person.lastName = fullName[1];
                    }
                }

                var fullNameArabic = person.NonModifiableData.FullNameArabic.split(",");

                if (fullNameArabic !== null) {
                    vm.person.nameLang = fullNameArabic[0] + ' ' + fullNameArabic[1] + ' ' + fullNameArabic[2] + ' ' + fullNameArabic[3];
                }

                if (person.HomeAddress.Email !== null) {
                    vm.person.email = person.HomeAddress.Email;
                }

                vm.person.address.state = "Abu Dhabi";

                vm.person.gender = "";
                if (person.NonModifiableData.Gender === "M" || person.NonModifiableData.Gender === "Male") {
                    vm.person.gender = 1;
                } else if (person.NonModifiableData.Gender === "F" || person.NonModifiableData.Gender === "Female") {
                    vm.person.gender = 2;
                }

                vm.person.age = "";

                vm.person.age = Math.abs(new Date().getFullYear() - new Date(moment(person.NonModifiableData.DateOfBirth, "DD/MM/YYYY")).getFullYear());

                vm.selectedNationality = "";
                vm.filters.name = person.NonModifiableData.NationalityEnglish;
                countryService.searchCountries(vm.filters).then(function (response) {
                    vm.selectedNationality = response.data.items[0];
                });

                vm.selectedCountry = "";
                vm.filters.name = "United Arab Emirates";
                countryService.searchCountries(vm.filters).then(function (response) {
                    vm.selectedCountry = response.data.items[0];
                });

                vm.person.loyaltyNo = person.CardNumber;
                vm.person.contactNo = person.HomeAddress.ResidentPhoneNumber;
                vm.person.mobileNo = person.HomeAddress.MobilePhoneNumber;
                vm.person.address.zipCode = person.HomeAddress.POBOX;
                if (person.HomeAddress.StreetEnglish !== null || person.HomeAddress.POBOX !== null) {
                    vm.person.address.addressLine1 = (person.HomeAddress.StreetEnglish + ' ' + person.HomeAddress.POBOX).trim();
                } else {
                    vm.person.address.addressLine1 = "";
                }
                vm.person.address.city = person.HomeAddress.CityDescEnglish;
                vm.person.dateOfBirth = moment(person.NonModifiableData.DateOfBirth, "DD/MM/YYYY");
                vm.person.code = person.ModifiableData.OccupationCode;

                // document number 3 is National Id 
                if (vm.doesIdentityDoucmentExist(3)) {
                    let prevfound = vm.person.identityDocuments.filter(e => e.identityDocumentType === 3)[0];
                    if (prevfound) {
                        prevfound.documentNo = person.IdNumber;
                        prevfound.issuedBy = "UAE";
                        prevfound.issueDate = moment(person.NonModifiableData.IssueDate, "DD/MM/YYYY");
                        prevfound.expiryDate = moment(person.NonModifiableData.ExpiryDate, "DD/MM/YYYY");
                    }
                } else {
                    vm.person.identityDocuments.push(
                        {
                            documentNo: person.IdNumber,
                            identityDocumentType: 3,
                            issuedBy: "UAE",
                            issueDate: moment(person.NonModifiableData.IssueDate, "DD/MM/YYYY"),
                            expiryDate: moment(person.NonModifiableData.ExpiryDate, "DD/MM/YYYY")
                        }
                    );
                }

                // document number 2 is Passport
                if (vm.doesIdentityDoucmentExist(2)) {
                    let prevfound = vm.person.identityDocuments.filter(e => e.identityDocumentType === 2)[0];
                    if (prevfound) {
                        prevfound.documentNo = person.ModifiableData.PassportNumber;
                        prevfound.issuedBy = "";
                        prevfound.issueDate = moment(person.ModifiableData.PassportIssueDate, "DD/MM/YYYY");
                        prevfound.expiryDate = moment(person.ModifiableData.PassportExpiryDate, "DD/MM/YYYY");
                    }
                } else {
                    if (person.ModifiableData.PassportNumber !== null) {
                        vm.person.identityDocuments.push(
                            {
                                documentNo: person.ModifiableData.PassportNumber,
                                identityDocumentType: 2,
                                issuedBy: "",
                                issueDate: moment(person.ModifiableData.PassportIssueDate, "DD/MM/YYYY"),
                                expiryDate: moment(person.ModifiableData.PassportExpiryDate, "DD/MM/YYYY")
                            }
                        );
                    }
                }
            };

            //vm.emiratesDataFieldManager = function (person) {

            //    var fullName = person.FullName.split(" ");
            //    if (fullName[0] !== null) {
            //        vm.person.firstName = "";
            //        vm.person.firstName = fullName[0];
            //    }
            //    if (fullName[1] !== null) {
            //        vm.person.middleName = "";
            //        vm.person.middleName = fullName[1];
            //    }
            //    if (fullName[2] !== null) {
            //        vm.person.lastName = "";
            //        for (var i = 2; i <= fullName.length - 1; i++) {
            //            vm.person.lastName += fullName[i] + " ";
            //        }
            //    }

            //    vm.person.gender = "";
            //    if (person.Sex === "Male") {
            //        vm.person.gender = 1;
            //    }
            //    else if (person.Sex === "Female") {
            //        vm.person.gender = 2;
            //    }


            //    vm.person.age = "";
            //    vm.person.age = Math.abs(new Date().getFullYear() - new Date(moment(person.DateOfBirth, "DD/MM/YYYY")).getFullYear());

            //    vm.removeIndentityDocument(3);
            //    vm.person.identityDocuments.push(
            //        {
            //            documentNo: person.IdNumber,
            //            identityDocumentType: 3,
            //            issuedBy: "UAE",
            //            issueDate: moment(person.IssueDate, "DD/MM/YYYY"),
            //            expiryDate: moment(person.ExpiryDate, "DD/MM/YYYY")
            //        }
            //    );

            //    vm.selectedNationality = "";
            //    vm.filters.name = person.Nationality;
            //    countryService.searchCountries(vm.filters).then(function (response) {
            //        vm.selectedNationality = response.data.items[0];
            //    });

            //    //additional feilds
            //    vm.person.address = {};
            //    vm.person.address.addressLine1 = person.PlaceOfBirthEnglish + (person.ResidencyNumber !== null ? " (" + person.ResidencyNumber + ") " : "");
            //    if (person.HomeAddress) {
            //        vm.person.email = person.HomeAddress.Email;
            //        vm.person.mobileNo = person.HomeAddress.MobilePhoneNumber;
            //        vm.person.contactNo = person.HomeAddress.ResidentPhoneNumber;



            //        vm.person.address.city = person.HomeAddress.CityDescriptionEnglish;
            //        vm.person.address.zipCode = person.HomeAddress.AreaCode;
            //        vm.person.address.state = person.HomeAddress.EmirateDescriptionEnglish;
            //    }
            //    if (person.DateOfBirth)
            //        vm.person.dateOfBirth = moment(person.DateOfBirth, "DD/MM/YYYY");
            //    if (person.Passport) {
            //        vm.removeIndentityDocument(2);
            //        vm.person.identityDocuments.push(
            //            {
            //                documentNo: person.Passport.PassportNumber,
            //                identityDocumentType: 2,
            //                issuedBy: person.Passport.PassportCountry,
            //                issueDate: moment(person.Passport.PassportIssueDate, "DD/MM/YYYY"),
            //                expiryDate: moment(person.Passport.PassportExpiryDate, "DD/MM/YYYY")
            //            }
            //        );
            //    }

            //};


            vm.getTariffCards = function () {
                //vm.loading = true;
                tariffCardService.getActiveTariffCards().success(function (data) {
                    vm.tariffCards = data.items;
                    vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
                    if (vm.tariffCardForContact) {
                        vm.tariffCards.push(vm.tariffCardForContact);
                    }
                }).finally(function () {
                    //vm.loading = false;
                });
            };

            vm.getTariffCardForContact = function () {
                vm.loading = true;
                tariffCardService.getTariffCardById({ id: vm.person.tariffCardId }).success(function (data) {
                    vm.tariffCardForContact = data;
                    vm.isTariffCardAlreadyPresent = vm.tariffCards.some(a => a.id === vm.tariffCardForContact.id)
                    if (!vm.isTariffCardAlreadyPresent) {
                        vm.tariffCards.push(vm.tariffCardForContact);
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.isDocument = function (i) {
                return i && i.name &&
                    (['jpg', 'jpeg', 'png'].indexOf(i.name.split('.')[1].toLowerCase()) === -1);
            };

            vm.maskCreditCard = function (cardNo) {
                if (cardNo && cardNo.length >= 4) {
                    var maskedCardNo = '*'.repeat(cardNo.length - 4) + cardNo.slice(-4);
                    return maskedCardNo;
                } else {
                    return 'Invalid Card';
                }
            };


            vm.getAdvanceSettings = function () {
                personService.getAdvanceSettings().success(function (data) {
                    if (data.name) {
                        vm.indentityDocuments = data.documents;
                    }
                    else {
                        vm.indentityDocuments = utilities.advanceSettingEnumsIndCustomer();
                    }
                    if (vm.person && vm.indentityDocuments) {
                        showReqIdentityDocumentsRow();
                    }

                }).finally(function () {
                    //vm.loading = false;
                });
            };

            function showReqIdentityDocumentsRow() {
                angular.forEach(vm.indentityDocuments, function (row) {
                    if (row.isRequired) {
                        vm.addIndentityDocument(row);
                    }
                });
            }
            vm.getHighLightBlackListCountries = function () {
                personService.getHighLightBlackListCountry("AdvanceSettings.HighLightBlackListCountry").success(function (data) {
                    vm.searchCountriesFromSetting = data.formates;
                });
            }

            vm.getNationalIdFormates = function () {
                personService.getNationalIdFormate(vm.formateSettingName).success(function (data) {
                    vm.nationalIdFormates = data;
                });
            }

            vm.nationalIdFormate = function (countryId, docType) {
                if (docType == 3) {
                    vm.formate = vm.nationalIdFormates.formates.filter(x => x.countryId == countryId);
                    vm.formate = vm.formate.length > 0 ? vm.formate[0] : null;
                    return vm.formate;
                } else {
                    return null;
                }
            }

            vm.onOverRideChange = function () {
                if (!vm.person.overRideEmailNotificationSetting) {
                    if (vm.person.customerNotificationSettings.length > 0) {
                        vm.person.customerNotificationSettings.forEach(function (notification) {
                            notification.isSent = false;
                        });
                    }
                }
            }

            vm.resetDocumentNo = function (item) {
                if (item.includes('-')) {
                    item = item.replace(/-/g, '');

                }
                vm.oldValue = item;
                return item;
            }

            vm.nationIdMaskInput = function (item, docType) {
                if (docType != 3) {
                    return item;
                }
                let maskedInput = '';
                let inputIndex = 0;
                if (vm.oldValue == undefined) {
                    vm.oldValue = '';
                }
                let iDFormate = vm.formate != null ? vm.formate.formate : null;
                inputIndex = 0;
                if (iDFormate != null) {
                    if (vm.oldValue.length <= item.length) {
                        for (const char of item) {
                            if (inputIndex < vm.formate.formate.length) {
                                var fchar = vm.formate.formate[inputIndex];
                                if (fchar === 'x') {
                                    maskedInput += char;
                                    if (inputIndex < vm.formate.formate.length - 1) {
                                        var sChar = vm.formate.formate[inputIndex + 1];
                                        if (sChar != 'x') {
                                            maskedInput += sChar;
                                        }
                                    }
                                } else {
                                    if (char != '-') {
                                        maskedInput += char;
                                        inputIndex++;
                                    }
                                }
                                inputIndex++;
                            }
                        }
                        vm.oldValue = maskedInput;
                        return maskedInput;
                    } else {
                        vm.oldValue = item;
                        return item;
                    }
                } else {
                    vm.oldValue = item;
                    return item;
                }
            }
            vm.handleResidenceStatusChange = function () {
                if (vm.person.id < 1) {
                    vm.person.identityDocuments = [];
                    if (vm.person.residenceStatus == 1) {
                        vm.person.identityDocuments.push({
                            documentNo: "",
                            identityDocumentType: 3,
                            issuedBy: null,
                            issueDate: null,
                            expiryDate: null,
                            images: []
                        });
                        vm.person.identityDocuments.push({
                            documentNo: "",
                            identityDocumentType: 4,
                            issuedBy: null,
                            issueDate: null,
                            expiryDate: null,
                            images: []
                        });
                    } else if (vm.person.residenceStatus == 2) {
                        vm.person.identityDocuments.push({
                            documentNo: "",
                            identityDocumentType: 2,
                            issuedBy: null,
                            issueDate: null,
                            expiryDate: null,
                            images: []
                        });
                        vm.person.identityDocuments.push({
                            documentNo: "",
                            identityDocumentType: 4,
                            issuedBy: null,
                            issueDate: null,
                            expiryDate: null,
                            images: []
                        });
                    }
                }
            };
            function init() {
                vm.loading = true;
                getLocations();
                getAllChargesSettings();
                vm.searchUsersWithDesignation();
                vm.getAdvanceSettings();
                vm.getNationalIdFormates();
                vm.getHighLightBlackListCountries();

                if (vm.isTariffCardEnable)
                    vm.getTariffCards();
                personService.getPersonForEdit({
                    id: personId
                }).success(function (result) {
                    vm.person = result;
                    //if (!vm.person.trnLogsList) {
                    //    vm.person.trnLogsList = [];
                    //}
                    let tenantId = abp.session.tenantId;
                    if (vm.isMultipleSmtpEnabled) {
                        if (!(vm.person.customerNotificationSettings.length > 0)) {
                            vm.person.customerNotificationSettings = vm.emailTemplates.map(template => ({
                                ...template,
                                tenantId: tenantId,
                                isSent: false,
                                emailTemplateKey: template.key,
                                type: 1, //For Email
                            }));
                        }
                        else {
                            vm.person.customerNotificationSettings = vm.emailTemplates.map(template => {
                                const existingTemplate = vm.person.customerNotificationSettings.find(notification => notification.emailTemplateKey === template.key);

                                return {
                                    ...template,
                                    tenantId: tenantId,
                                    isSent: existingTemplate ? true : false,
                                    emailTemplateKey: template.key,
                                    type: 1, // For Email
                                };
                            });
                        }
                    }

                    vm.dbPicture = result.picture;
                    vm.person.contactCards = [];
                    getContactGroups();
                    getTaxCodes();
                    vm.getCustomLookups();

                    if (vm.person.chargesTypeMerging)
                        vm.filters.chargesTypeMerging = angular.fromJson(vm.person.chargesTypeMerging);

                    if (vm.percentageFuelSurchargeInvoiceClubWithFuelInvoice > 0 && vm.fuelSurchargeInvoiceClubWithFuelInvoice && vm.person.fuelSurcharge === null) {
                        vm.person.fuelSurcharge = vm.percentageFuelSurchargeInvoiceClubWithFuelInvoice;
                    }

                    if (vm.person.leaseInvoicingRule === null) {
                        vm.person.leaseInvoicingRule = vm.leaseInvoicingRule;
                    }

                    if (vm.person.leaseInvoicingType === null) {
                        vm.person.leaseInvoicingType = vm.leaseInvoicingType;
                    }

                    if (vm.person.invoicingRule === null) {
                        vm.person.invoicingRule = vm.invoicingRule;
                    }
                    if (vm.person.invoicingType === null) {
                        vm.person.invoicingType = vm.invoicingType;
                    }

                    if (vm.person.tariffCardId) {
                        vm.getTariffCardForContact();
                    }


                    if (vm.person.picture) {
                        var img = vm.person.picture;

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
                    if (vm.isMulticurrencyEnabled) {
                        getCurrencies();
                        if (vm.person.currencyId == null) {
                            getBaseCurrency();
                        }
                    }



                    if (vm.person.id < 1) {
                        vm.person.age = null;
                        vm.person.drivingExperience = null;
                        setRequiredExternalIds();
                    }
                    if (vm.person.id > 1) {
                        vm.externalIds = vm.person.externalIds;
                        if (vm.person.age === 0)
                            vm.person.age = null;
                        if (vm.person.drivingExperience === 0)
                            vm.person.drivingExperience = null;
                        if (vm.contactCardpermissions.view) {
                            personService.getContactCards({ id: vm.person.id }).success(function (result) {
                                vm.person.contactCards = result;
                            });
                        }
                    }

                    if (vm.person.chargesTypeMerging) {
                        getAllChargesSettings();
                    }

                    if (vm.person.address.country !== null) vm.selectedCountry = { name: vm.person.address.country };
                    if (vm.person.nationality !== null) {
                        if (!vm.isHighLightCountryEnabled) {
                            vm.selectedNationality = { name: vm.person.nationality };
                        }
                        else {
                            const isNationalHighlighted = vm.searchCountriesFromSetting.some(country => country.name === result.nationality);
                            vm.selectedNationality = {
                                name: vm.person.nationality,
                                isHighlighted: isNationalHighlighted
                            };
                            vm.checkHighlighted = vm.selectedNationality.isHighlighted;
                        }
                    }
                    angular.forEach(vm.person.identityDocuments, function (val, key) {
                        if (val.issuedBy != null) {
                            val.selectedIssuedBy = { name: val.issuedBy };
                        }
                    });

                    //add gallary images list with each document
                    for (var i = 0; i < vm.person.identityDocuments.length; i++) {
                        if (vm.person.identityDocuments[i].images === null)
                            vm.person.identityDocuments[i].images = [];

                        var gallaryImages = [];
                        var nonImgDocs = [];

                        for (var j = 0; j < vm.person.identityDocuments[i].images.length; j++) {
                            var img = vm.person.identityDocuments[i].images[j];

                            var imageDetail = imageGalleryObject();
                            imageDetail.thumb = img.url;
                            imageDetail.img = img.url;
                            imageDetail.description = vm.getIdentificationDocumentType(vm.person.identityDocuments[i].identityDocumentType);
                            imageDetail.name = img.name;
                            imageDetail.url = img.url;
                            imageDetail.guid = img.guid;

                            if (vm.isDocument(imageDetail)) {
                                imageDetail.identityDocumentId = img.identityDocumentId;
                                nonImgDocs.push(imageDetail);
                            }
                            else
                                gallaryImages.push(imageDetail);
                        }
                        vm.person.identityDocuments[i].gallaryImages = gallaryImages;
                        vm.person.identityDocuments[i].nonImgDocs = nonImgDocs;

                        var docs = $filter('filter')(vm.indentityDocuments, {
                            identityDocumentType: vm.person.identityDocuments[i].identityDocumentType,
                            isRequired: true
                        }, true);

                        vm.person.identityDocuments[i].isRequired = (docs.length > 0);

                    }

                    if (vm.person.id > 0) {
                        vm.isEditMod = true;
                        vm.isContactCardPermission = vm.isEditMod && abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards') && !abp.auth.hasPermission('Pages.Tenant.Contacts.Edit') && !abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit');
                    } else {
                        vm.isEditMod = false;
                        vm.person.gender = null;
                    }
                    if (vm.person.gender > 0)
                        getGender(vm.person.gender);

                    if (vm.person && vm.indentityDocuments) {
                        showReqIdentityDocumentsRow();
                    }
                    vm.isLimitPermissions = !abp.auth.hasPermission('Pages.Tenant.Contacts.Edit') && abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit') && vm.isEditMod;

                    //default customer verified true
                    if (!vm.isEnableVerifiedFeature) {
                        vm.person.verified = true;
                    } else if (!vm.permissions.isEnableVerified && vm.person.id <= 0) {
                        vm.person.verified = false;
                    }

                }).finally(function () {
                    vm.loading = false;
                    vm.isPersonVerifiedChange('contactCRSCreateOrEditForm');
                });

                commonLookupService.validateCreditLimit({
                    id: personId
                }).success(function (result) {
                    vm.isCreditLimitNotValid = result.isLimitCrossed;
                }).finally(function () {
                    //vm.loading = false;
                });


                vm.parkingInvoice = parseInt(abp.setting.get('App.General.ParkingInvoice'));
                vm.tollsInvoice = parseInt(abp.setting.get('App.General.TollsInvoice'));
                vm.darbInvoice = parseInt(abp.setting.get('App.General.DarbTollsInvoice'));
                vm.finesInvoice = parseInt(abp.setting.get('App.General.TrafficFineInvoice'));

                initDocumentReader();
            }

            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });

            init();
        }
    ]);
