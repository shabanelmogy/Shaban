// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:179083-180471
appModule.controller('tenant.views.crs.companies.createOrEditModal', [
        '$scope', 'appSession', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.company', 'abp.services.app.taxCode', 'companyId', 'utilities', '$filter',
        '$uibModal', 'abp.services.app.contactGroup', 'abp.services.app.chargesSetting', 'abp.services.app.directory', 'abp.services.app.tariffCard', 'abp.services.app.commonLookup', 'abp.services.app.tenantSettings', 'abp.services.app.industry', 'abp.services.app.designation', 'abp.services.app.currency',
        function ($scope, appSession, $uibModalInstance, countryService, companyService, taxCodeService, companyId, utilities, $filter,
            $uibModal, contactGroupService, chargesSettingService, directoryService, tariffCardService, commonLookupService, tenantSettingsService, industryService, designationService, currencyService) {

            var vm = this;
            vm.isCreditLimitNotValid = false;
            vm.saving = false;
            vm.isEditMod = false;
            vm.checkHighlighted = false;
            vm.selectedCountry = null;
            vm.isMultipleSmtpEnabled = abp.features.isEnabled("CRS.CustomFeatures.MultipleEmailSmtp");
            vm.emailTemplates = utilities.getEmailTemplates();
            vm.fuelSurchargeType = '';
            vm.fuelSurchargeType =
                [{ id: 1, name: app.localize('Percentage') }, { id: 2, name: app.localize('Amount') }];
            vm.taxPercentage = abp.setting.get("App.General.TaxPercentage");
            vm.isCustomerProjectEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerProject");
            vm.isCustomerWiseSettingEnabled = utilities.parseBoolean(abp.setting.get("App.General.AllowCustomerWiseSetting"));
            vm.companyCustomerCustomField4 = utilities.parseBoolean(abp.setting.get("App.General.CompanyCustomerCustomField4"));
            vm.tollSurcharge = parseFloat(abp.setting.get("App.General.TollsSurCharge"));
            vm.trafficFineSurCharge = parseFloat(abp.setting.get("App.General.TrafficFineSurCharge"));
            vm.parkingTicketSurCharge = parseFloat(abp.setting.get("App.General.ParkingSurCharge"));
            vm.parkingTicketSurChargeType = getParkingSurChargeType(parseFloat(abp.setting.get("App.General.ParkingSurchargeType")));
            vm.isSalesPersonRequired = utilities.parseBoolean(abp.setting.get("App.General.CompanyCustomerSalesPerson"));
            vm.isTRNRequired = utilities.parseBoolean(abp.setting.get("App.General.CompanyCustomerTRN"));
            vm.isTradeLicenseRequired = utilities.parseBoolean(abp.setting.get("App.General.IsTradeLicenseRequired"));
            vm.allowSavingExpiryDocument = utilities.parseBoolean(abp.setting.get("App.General.AllowTOSaveContactWithExpiryDoucment"));
            vm.invoicingRule = parseFloat(abp.setting.get("App.General.InvoicingRuleCorporate"));
            vm.invoicingType = parseFloat(abp.setting.get("App.General.InvoicingTypeCorporate"));
            vm.leaseInvoicingRule = parseFloat(abp.setting.get("App.General.LeaseInvoicingRuleCorporate"));
            vm.leaseInvoicingType = parseFloat(abp.setting.get("App.General.LeaseInvoicingTypeCorporate"));
            vm.isTariffCardEnable = abp.auth.hasPermission("Pages.Tenant.TariffCards");
            vm.isCreditPeriodEnabled = abp.auth.hasPermission("Pages.Tenant.Customers.EnableCreditPeriod");
            vm.isCreditLimitEnabled = abp.auth.hasPermission("Pages.Tenant.Customers.EnableCreditLimit");
            vm.isCustomerWiseDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseDiscount");
            vm.isChargesTypeMergingInInvoiceCustomerWise = abp.features.isEnabled("CRS.CustomFeatures.ChargesTypeMergingInInvoiceCustomerWise");
            vm.isERSenabled = abp.features.isEnabled("ERS");
            vm.isSagX3Enabled = abp.features.isEnabled("Core.SagX3Integration");
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.isReferralsFieldEnabled = utilities.parseBoolean(abp.setting.get("App.General.IsReferralRequired"));
            vm.isReferralNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReferralNameRequired"));
            vm.isReferralContactNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReferralContactNoRequired"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.isMulticurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isEnableVerifiedFeature = abp.features.isEnabled("CRS.Vouchers.Approval.CustomerApproval");
            vm.isBrokerEnable = abp.features.isEnabled("Core.Companies.BrokerModule");
            vm.isCRSVouchersInvoicesEnabled = abp.features.isEnabled("CRS.Vouchers.Invoices");
            vm.isCRSTollsEnabled = abp.features.isEnabled("CRS.Tolls");
            vm.isCRSFinesEnabled = abp.features.isEnabled("CRS.Fines");
            vm.isCRSParkingsEnabled = abp.features.isEnabled("CRS.Parking");
            vm.brokerContactGroup = abp.features.isEnabled("CRS.CustomFeatures.BrokerContactGroup");
            vm.invoicingOptions = [{ id: 1, name: app.localize('ClubWithRental') }, { id: 2, name: app.localize('Separate') }];
            vm.tollsSurChargeType = gettollsSurChargeType(parseFloat(abp.setting.get("App.General.TollsSurChargeType")));
            vm.darbTollsSurChargeType = getDarbtollsSurChargeType(parseFloat(abp.setting.get("App.General.DarbTollsSurChargeType")));
            vm.trafficFineSurChargeType = gettrafficFineSurChargeType(parseFloat(abp.setting.get("App.General.FineSurchargeType")));
            vm.isManualCode = utilities.parseBoolean(abp.setting.get("App.DocumentNos.ManualCustomerCode"));
            vm.tollsSurchargeTypes = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.darbTollsSurchargeTypes = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.trafficFineSurchargeTypes = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.parkingSurchargeTypes = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.isfinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar"); //added by arslan for Qatar fines
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isParkingModuleEnabled = abp.features.isEnabled("CRS.Parking");
            vm.darbSurCharge = parseFloat(abp.setting.get("App.General.DarbTollsSurCharge"));
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isLimitPermissions = !abp.auth.hasPermission('Pages.Tenant.Companies.Edit') && abp.auth.hasPermission('Pages.Tenant.Companies.LimitedEdit') && vm.isEditMod;
            vm.hasLimitedEditPermission = abp.auth.hasPermission('Pages.Tenant.Companies.LimitedEdit'),
                vm.hasEditPermission = abp.auth.hasPermission('Pages.Tenant.Companies.Edit'),
                vm.isFinancialLeaseEnabled = abp.features.isEnabled("CRS.LeaseFinancial");
            vm.isDebtCollectionEnabled = abp.features.isEnabled("Core.DebtCollection");
            vm.allowOnlyNumericNumberInContactNumber = utilities.parseBoolean(abp.setting.get("App.Common.AllowOnlyNumericNumberInContactNumber"));
            vm.contactPersons = [];
            vm.allowFusionMapping = abp.auth.hasPermission('Pages.Administration.Tenant.Integration.Fusion.Mappings');
            vm.fuelSurchargeInvoiceClubWithFuelInvoice = utilities.parseBoolean(abp.setting.get("App.Speed.Common.FuelSurchargeInvoiceClubWithFuelInvoice"));
            vm.percentageFuelSurchargeInvoiceClubWithFuelInvoice = parseFloat(abp.setting.get("App.General.PercentageFuelSurchargeInvoiceClubWithFuelInvoice"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.enabledInvoicingUAE = abp.auth.hasPermission('Pages.Integration.EInvoicingUAE');
            vm.externalIds = [];
            vm.isHighLightCountryEnabled = abp.features.isEnabled("CRS.CustomFeatures.HighLightBlackListCountry");
            vm.isEInvoicingUAEEnabled = abp.features.isEnabled("Core.Integration.EInvoicingUAE");
            vm.isCustomerCutoffDateForInvoicePrint = abp.features.isEnabled("Core.Integration.EInvoicingUAE.CustomerCutoffDateForInvoicePrint");
            var isValid = true;
            vm.showCreationDate = utilities.parseBoolean(abp.setting.get("App.General.ShowCreationDateForCompanyCustomer"));
            //vm.customerWiseTrnBasedOnPeriod = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseTrnBasedOnPeriod");
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
            vm.eInvoiceCustomerClassifications = [
                { id: 1, name: app.localize('FreeTradeZone') }
            ];
            vm.eInvoicingCutOffDates = [
                { value: '2027-01-01', name: app.localize('1-Jan-2027') },
                { value: '2027-07-01', name: app.localize('1-July-2027') },
                { value: '2027-10-01', name: app.localize('1-Oct-2027') }
            ];
            vm.contactCardpermissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards'),
                add: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Add'),
                edit: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Delete'),
                viewCreditCardWithLastFourDigit: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.ViewCreditCardWithLastFourDigit'),
                viewFullCreditCard: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.ViewFullCreditCardDetails'),
                createDriver: abp.auth.hasPermission('Pages.Tenant.Contacts.Addnew'),

            };
            vm.permissions = {
                isEnableVerified: abp.auth.hasPermission('Pages.Tenant.Companies.CustomerApproval'),
            };
            vm.options = {
                format: vm.dateFormat,
                maxDate: moment().endOf('day')
            };
            vm.invoiceGenerationMethodTypes = [
                //{ name: "Agreement Wise", value: 0 },
                { name: "Merge By Project", value: 1 },
                //    { name: "Merge By PO", value: 2 },
                //    { name: "Merge All", value: 3 }
            ];
            vm.company = {
                emailInvoices: true,
                contactPersons: new Array(),
                verified: true
            //    trnLogsList: []
            };
            vm.additionalDriver = [];
            vm.locations = [];
            var imageDocs = [];
            vm.taxRules = utilities.getTaxRules();
            vm.getCardType = function (type) {
                if (type == 1)
                    return 'MasterCard';
                else if (type == 2)
                    return 'Visa';
                else if (type == 3)
                    return 'AmericanExpress';
            };

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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };
            function gettrafficFineSurChargeType(id) {
                if (id == 1)
                    return "Fixed";
                else if (id == 2)
                    return "Percentage";
                else return '';
            }
            function getTaxCodes() {
                taxCodeService.getTaxCodes().success(function (result) {
                    vm.taxCodes = result.items;
                }).finally(function () {
                    vm.loading = false;
                })
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

            vm.industries = [];
            vm.tariffCards = [];
            vm.tariffCard = null;
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM');
                }
                else {
                    return "";
                }
            };

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

            //    vm.company = vm.company || {};

            //    if (!vm.company.trnLogsList) {
            //        vm.company.trnLogsList = [];
            //    }

            //    vm.company.trnLogsList.push(trnLogsListObject());
            //};

            //vm.removeTRNRow = function (obj) {
            //    var index = vm.company.trnLogsList.indexOf(obj);
            //    vm.company.trnLogsList.splice(index, 1);
            //};
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
                    vm.company.contactCards.push(result);
                });
            };
            vm.addDriverRow = function (driver) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/createOrUpdateDriverModal.cshtml',
                    controller: 'tenant.views.crs.companies.createOrUpdateDriverModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        driver: function () {
                            return driver;
                        },
                        companyId: function () {
                            return vm.company.id;
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    if (result) {
                        if (!driver)
                            vm.additionalDriver.push(result);
                        else
                            //driver = result;
                            var index = vm.additionalDriver.findIndex(e => e.id === driver.id);
                        if (index !== -1) {
                            vm.additionalDriver[index] = angular.copy(result);
                        }
                        //var contct = vm.additionalDriver.find(e => e.id === result.id);
                        //if (contct === null || contct === undefined) {
                        //    vm.additionalDriver.push(result);
                        //} else {
                        //    abp.notify.warn(app.localize('Exist'));
                        //}
                    }
                });
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            function getAllLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locationsAll = data.items;
                });
            }

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
            vm.removeRow = function (row) {
                var index = vm.company.contactCards.indexOf(row);
                vm.company.contactCards.splice(index, 1);
            };
            vm.filters = {
                name: ''
            };
            vm.driverFilters = {
                keyword: '',
                contactType: 2,
                activeOnly: true,
                contactCategory: 1,
                skipCount: 0,
                //maxResultCount: app.consts.grid.defaultPageSize,
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
                }]
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
                }]

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
                }]
            vm.invoicingTypes = [
                {
                    id: 1,
                    name: app.localize('Advance')
                },
                {
                    id: 2,
                    name: app.localize('Post')
                }]
            function checkingIssueAndExpiryDate() {
                isValid = true;
                errorMessage = 'Contact Can Not Be Saved Due To Following Issues: \n';
                if (vm.allowSavingExpiryDocument) {

                    if (vm.company.identityDocuments !== null) {
                        var identityDocuments = vm.company.identityDocuments;
                        if (identityDocuments.length > 0) {
                            identityDocuments.forEach(doc => {
                                if (doc.expiryDate <= moment().startOf('day')) {
                                    isValid = false;
                                    errorMessage = errorMessage + '\n Expiry Date can  not less than Current Date';
                                }
                            });
                        }
                        angular.forEach(vm.company.identityDocuments, function (value, key) {
                            if (value.issueDate == false) value.issueDate = null; //due to picker issue if date is made empty then in model it sets false, so in that case set to null
                            if (value.expiryDate == false) value.expiryDate = null; //due to picker issue if date is made empty then in model it sets false, so in that case set to null

                            if (value.expiryDate != null && value.issueDate != null) {
                                if (value.issueDate > value.expiryDate) {
                                    isValid = false;
                                    errorMessage = errorMessage + '\n Expiry Date is less than the Issue Date';
                                }
                            }
                        });
                    }
                }
            }
            vm.searchContacts = function (id) {
                vm.isContactLoading = true;
                directoryService.getDriverForCompany(id)
                    .then(function (response) {
                        vm.additionalDriver = response.data;
                    })
                    .finally(function () {
                        vm.isContactLoading = false;
                    });
            };
            vm.showAddContact = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        category: function () {
                            return 1;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result) {
                        var contct = vm.additionalDriver.find(e => e.id === result.id);
                        if (contct === null || contct === undefined) {
                            vm.additionalDriver.push(result);
                        } else {
                            abp.notify.warn(app.localize('Exist'));
                        }
                    }
                });
            };
            //Remove row Contact Row
            //vm.removeRowContact = function (obj) {
            //    var index = vm.additionalDriver.indexOf(obj);
            //    vm.additionalDriver.splice(index, 1);
            //};
            vm.removeRowContact = function (obj) {
                companyService.deleteCompanyDriver(obj.id)
                    .success(function (result) {
                        abp.notify.info(app.localize('SuccessfullyDeleted'));
                    }).finally(function () {
                        var index = vm.additionalDriver.indexOf(obj);
                        if (index !== -1) {
                            vm.additionalDriver.splice(index, 1); // Remove the item from the list
                        }
                    });
            }


            vm.save = function () {

                let isDisabledVerified = !vm.isEnableVerifiedFeature || vm.company.verified;
                isDisabledVerified && checkingIssueAndExpiryDate();
                vm.company.externalIds = vm.externalIds;
                let requiredDesignationNames = [];
                let reqContactPersonsLength = 0;
                if (vm.mandatoryDesignations && vm.mandatoryDesignations.length > 0 && isDisabledVerified) {
                    requiredDesignationNames = vm.mandatoryDesignations.filter(e => e.isRequired).map(e => e.name);
                    var reqContactPersons = [...new Set(vm.contactPersons.map(e => e.designation.name))].filter(e => requiredDesignationNames.includes(e));
                    if (reqContactPersons)
                        reqContactPersonsLength = reqContactPersons.length;

                }
                if (requiredDesignationNames.length > reqContactPersonsLength) {
                    abp.message.error(requiredDesignationNames, app.localize("RequiredContactPersons"));
                    return;
                }
                vm.saving = true;
                if (vm.isTradeLicenseRequired) {
                    if (!(vm.company.identityDocuments.length > 0 && vm.company.identityDocuments.some(e => e.identityDocumentType === 1))) {
                        abp.message.info("Trade License Is Required");
                        vm.saving = false;
                        return;
                    }
                }
                if (isValid) {
                    if (vm.filters.chargesTypeMerging)
                        vm.company.chargesTypeMerging = angular.toJson(vm.filters.chargesTypeMerging);
                    else
                        vm.company.chargesTypeMerging = "";

                    if (vm.selectedCountry != null) {
                        if (vm.isEInvoicingUAEEnabled)
                            vm.company.address.country = vm.selectedCountry.code;
                        else
                            vm.company.address.country = vm.selectedCountry.name;
                    }

                    vm.drivers = [];
                    angular.forEach(vm.additionalDriver, function (value) {
                        vm.drivers.push(value.id);
                    });

                    let contactPersons = new Array();

                    vm.company.contactPersons = vm.contactPersons;

                    vm.company.contactPersons.forEach(function (contactPerson) {
                        if (contactPerson.firstName != "" &&
                            contactPerson.firstName != null &&
                            contactPerson.firstName != undefined) {
                            contactPersons.push(contactPerson);
                        }
                    });

                    vm.company.contactPersons = contactPersons;
                    companyService.createOrUpdateCompany({
                        company: vm.company,
                        contactCards: vm.company.contactCards,
                        //trnLogsList: vm.company.trnLogsList,
                        //drivers: vm.drivers
                        driversList: vm.additionalDriver
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
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
                $uibModalInstance.dismiss();
            };

            function designationObject() {
                let designation = new Object();
                designation.designationId = null;
                designation.firstName = null;
                designation.lastName = null;
                designation.contactNo = null;
                designation.email = null;
                return designation;
            }

            vm.addContactPersonsRow = function () {
                vm.contactPersons.push(designationObject());
            };

            vm.changeDesignation = function (row) {
                row.designation = vm.designations.filter(e => e.id === row.designationId)[0];
            };



            vm.removeContactPersonsRow = function (obj) {
                var index = vm.contactPersons.indexOf(obj);
                vm.contactPersons.splice(index, 1);
            };

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
                    if (result != null) {
                        vm.company.salesPerson = result;
                        vm.salesPersonSelected();
                    }
                });
            };

            vm.salesPersonSelected = function () {
                vm.company.salesPersonId = vm.company.salesPerson.id;
            };

            vm.searchDebtCollectorPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result !== null) {
                        vm.company.debtCollector = result;
                        vm.company.debtCollectorId = result.id;
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

            vm.doesIdentityDoucmentExist = function (documentType) {

                if (!vm.company) return false;
                if (!vm.company.identityDocuments) return false;

                var docs = $filter('filter')(vm.company.identityDocuments, {
                    identityDocumentType: documentType
                }, true);

                return (docs.length > 0);
            };


            function uploadReceivedImage(base64data) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/uploadDocumentModal.cshtml',
                    controller: 'tenant.views.crs.companies.uploadDocumentModal as vm',
                    backdrop: 'static',
                    resolve: {
                        base64data: function () {
                            return base64data;
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    vm.addIndentityDocument(result.identityDocumentType); //add if not already added.

                    var docs = $filter('filter')(vm.company.identityDocuments, {
                        identityDocumentType: result.identityDocumentType
                    }, true);

                    if (docs.length > 0) {
                        var img = {
                            guid: result.guid,
                            url: result.url,
                            path: '',
                            name: result.name
                        };

                        docs[0].images.push(img);

                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = result.urlWithToken;
                        imageDetail.img = result.urlWithToken;
                        imageDetail.description = vm.getIdentificationDocumentType(result.identityDocumentType);

                        if (docs[0].gallaryImages == undefined)
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
                        options: function () {
                            return {
                                identityDocument: identityDocument,
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    var img = {
                        guid: result.guid,
                        url: result.url,
                        path: '',
                        name: result.name
                    };

                    identityDocument.images.push(img);

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = vm.getIdentificationDocumentType(identityDocument.identityDocumentType);
                    imageDetail.name = result.name;
                    imageDetail.url = result.url;

                    if (identityDocument.gallaryImages == undefined)
                        identityDocument.gallaryImages = [];

                    if (vm.isDocument(imageDetail)) {
                        imageDetail.identityDocumentId = identityDocument.id;

                        if (!identityDocument.nonImgDocs)
                            identityDocument.nonImgDocs = [];
                        identityDocument.nonImgDocs.push(imageDetail);
                    }
                    else
                        identityDocument.gallaryImages.push(imageDetail);

                });
            };

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }



            vm.addIndentityDocument = function (row) {
                let isDisabledVerified = !vm.isEnableVerifiedFeature || vm.company.verified;
                if (!vm.company.identityDocuments) return;
                let prevfound = vm.company.identityDocuments.filter(e => e.identityDocumentType === row.identityDocumentType)[0];
                if (prevfound) {
                    //if (vm.isEditMod) {
                    prevfound.identityDocumentType = row.identityDocumentType;
                    prevfound.isRequired = row.isRequired;
                    prevfound.verifiedRequired = isDisabledVerified && row.isRequired;
                    //}
                } else {
                    if (vm.doesIdentityDoucmentExist(row.identityDocumentType)) return;
                    vm.company.identityDocuments.push(
                        {
                            documentNo: "",
                            identityDocumentType: row.identityDocumentType,
                            issuedBy: "",
                            issueDate: null,
                            expiryDate: null,
                            isRequired: row.isRequired,
                            verifiedRequired: isDisabledVerified && row.isRequired,
                            images: []
                        }
                    );
                }
            };

            vm.addMandatoryDesignations = function (row) {
                let isDisabledVerified = !vm.isEnableVerifiedFeature || vm.company.verified;
                if (!vm.designations) return;
                let designation = vm.designations.filter(e => e.name === row.name)[0];

                let prevfound = vm.contactPersons.filter(e => e.designation.name === row.name)[0];
                if (prevfound) {
                    //if (vm.isEditMod) {
                    prevfound.designationId = designation.id;
                    prevfound.isRequired = row.isRequired;
                    prevfound.verifiedRequired = isDisabledVerified && row.isRequired;
                    //}
                } else {
                    vm.contactPersons.push(
                        {
                            designationId: designation.id,
                            designation: designation,
                            firstName: "",
                            lastName: "",
                            contactNo: null,
                            email: null,
                            isRequired: row.isRequired,
                            verifiedRequired: isDisabledVerified && row.isRequired
                        }
                    );
                }
            };

            vm.isCompanyVerifiedChange = function () {
                showReqIdentityDocumentsRow();
                showReqMandatoryDesignationsRow();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            };

            vm.removeIndentityDocument = function (documentType) {
                for (var i = 0; i < vm.company.identityDocuments.length; i++) {
                    if (vm.company.identityDocuments[i].identityDocumentType === documentType) {
                        vm.company.identityDocuments.splice(i, 1);
                        return;
                    }
                }
            };

            vm.maskCreditCard = function (cardNo) {
                if (cardNo && cardNo.length >= 4) {
                    var maskedCardNo = '*'.repeat(cardNo.length - 4) + cardNo.slice(-4);
                    return maskedCardNo;
                } else {
                    return 'Invalid Card';
                }
            };

            vm.removeDoc = function (identityDoc, doc) {
                identityDoc.nonImgDocs = identityDoc.nonImgDocs.filter(x => x.url !== doc.url);
                identityDoc.images = identityDoc.images.filter(e => e.url != doc.url);
            };

            vm.getIdentificationDocumentType = function (id) {
                if (id == 1)
                    return app.localize('TradeLicense');
                else if (id == 2)
                    return app.localize('Passport');
                else if (id == 3)
                    return app.localize('NationalId');
                else if (id == 4)
                    return app.localize('DrivingLicense');
                else if (id == 5)
                    return app.localize('OtherDocument');
                else if (id == 8)
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

            vm.searchCountries = function ($select) {
                if (!vm.isHighLightCountryEnabled) {
                    vm.filters.name = $select.search;
                    if (vm.filters.name == '')
                        vm.filters.name = "~";  //to avoid default suggestions 

                    return countryService.searchCountries(vm.filters).then(function (response) {
                        vm.countries = response.data.items;
                    });
                }
                else {
                    vm.filters.name = $select.search;
                    if (vm.filters.name === '') {
                        vm.filters.name = "~";  // to avoid default suggestions 
                    }

                    return countryService.searchCountries(vm.filters).then(function (response) {
                        if (response && response.data && response.data.items) {
                            vm.countries = response.data.items.map(country => {
                                // Check if the country is in the settings (blacklisted)
                                const isBlacklisted = vm.searchCountriesFromSetting.some(e => e.id === country.id);
                                return {
                                    id: country.id,
                                    code: country.code,
                                    name: country.name,
                                    isHighlighted: isBlacklisted // Blacklisted countries are highlighted
                                };
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
            function getCurrencies() {
                currencyService.getCurrencies().success(function (result) {
                    vm.currencies = result.items;
                }).finally(function () { vm.loading = false; });
            }
            function getBaseCurrency() {
                currencyService.getCurrencies().success(function (result) {
                    vm.company.currencyId = result.items.filter(p => p.isBase)[0].id;
                }).finally(function () { vm.loading = false; });
            }

            vm.getTariffCards = function () {
                vm.loading = true;
                tariffCardService.getActiveTariffCards().success(function (data) {
                    vm.tariffCards = data.items;
                    vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
                    if (vm.tariffCardForCompany) {
                        vm.tariffCards.push(vm.tariffCardForCompany);
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getTariffCardForCompany = function () {
                vm.loading = true;
                tariffCardService.getTariffCardById({ id: vm.company.tariffCardId }).success(function (data) {
                    vm.tariffCardForCompany = data;
                    vm.isTariffCardAlreadyPresent = vm.tariffCards.some(a => a.id === vm.tariffCardForCompany.id)
                    if (!vm.isTariffCardAlreadyPresent) {
                        vm.tariffCards.push(vm.tariffCardForCompany);
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.isDocument = function (i) {
                return i && i.name &&
                    (['jpg', 'jpeg', 'png'].indexOf(i.name.split('.')[1].toLowerCase()) === -1);
            };

            vm.getDesignations = function () {
                designationService.getDesignations().success(function (result) {
                    vm.designations = result.items;
                });
            };

            function init() {
                getLocations();
                getAllLocations();
                getAllChargesSettings();
                vm.getHighLightBlackListCountries();
                vm.getAdvanceSettings();
                vm.searchUsersWithDesignation();
                vm.getDesignations();
                vm.loading = true;
                if (vm.isTariffCardEnable)
                    vm.getTariffCards();
                companyService.getCompanyForEdit({
                    id: companyId
                }).success(function (result) {
                    vm.company = result;
                    //if (!vm.company.trnLogsList) {
                    //    vm.company.trnLogsList = [];
                    //}
                    let tenantId = abp.session.tenantId;
                    if (vm.isMultipleSmtpEnabled) {
                        if (!(vm.company.customerNotificationSettings.length > 0)) {
                            vm.company.customerNotificationSettings = vm.emailTemplates.map(template => ({
                                ...template,
                                tenantId: tenantId,
                                isSent: false,
                                emailTemplateKey: template.key,
                                type: 1, //For Email
                            }));
                        }
                        else {
                            vm.company.customerNotificationSettings = vm.emailTemplates.map(template => {
                                const existingTemplate = vm.company.customerNotificationSettings.find(notification => notification.emailTemplateKey === template.key);

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
                    vm.company.contactCards = [];
                    if (vm.company.contactPersons)
                        vm.contactPersons = vm.company.contactPersons;
                    getContactGroups();
                    getTaxCodes();

                    if (vm.company.chargesTypeMerging)
                        vm.filters.chargesTypeMerging = angular.fromJson(vm.company.chargesTypeMerging);

                    if (vm.percentageFuelSurchargeInvoiceClubWithFuelInvoice > 0 && vm.fuelSurchargeInvoiceClubWithFuelInvoice && vm.company.fuelSurcharge === null) {
                        vm.company.fuelSurcharge = vm.percentageFuelSurchargeInvoiceClubWithFuelInvoice;
                    }
                    if (vm.company.leaseInvoicingRule === null) {
                        vm.company.leaseInvoicingRule = vm.leaseInvoicingRule;
                    }

                    if (vm.company.leaseInvoicingType === null) {
                        vm.company.leaseInvoicingType = vm.leaseInvoicingType;
                    }

                    if (vm.company.invoicingRule === null) {
                        vm.company.invoicingRule = vm.invoicingRule;
                    }
                    if (vm.company.invoicingType === null) {
                        vm.company.invoicingType = vm.invoicingType;
                    }

                    if (vm.company.tariffCardId) {
                        vm.getTariffCardForCompany();
                    }

                    if (vm.isMulticurrencyEnabled) {
                        getCurrencies();
                        if (vm.company.currencyId == null) {
                            getBaseCurrency();
                        }
                    }
                    if (vm.company.id < 1) {
                        vm.company.age = null;
                        vm.company.drivingExperience = null;
                        setRequiredExternalIds();
                    }
                    if (vm.company.id > 1) {
                        vm.externalIds = vm.company.externalIds;
                        if (vm.company.age == 0)
                            vm.company.age = null;
                        if (vm.company.drivingExperience == 0)
                            vm.company.drivingExperience = null;
                        if (vm.contactCardpermissions.view) {
                            companyService.getContactCards({ id: vm.company.id }).success(function (result) {
                                vm.company.contactCards = result;
                            });
                        }

                    }

                    if (vm.company.chargesTypeMerging) {
                        getAllChargesSettings();
                    }

                    if (vm.company.address.country != null) {
                        if (!vm.isHighLightCountryEnabled) {
                            if (vm.isEInvoicingUAEEnabled)
                                vm.selectedCountry = { name: vm.company.address.country, code: vm.company.address.country };
                            else
                                 vm.selectedCountry = { name: vm.company.address.country };
                        } else {
                            const isNationalHighlighted = vm.searchCountriesFromSetting.some(country => country.name === vm.company.address.country || country.code === vm.company.address.country);
                            if (vm.isEInvoicingUAEEnabled)
                                vm.selectedCountry = {
                                    code: vm.company.address.country,
                                    isHighlighted: isNationalHighlighted
                                };
                            else
                             vm.selectedCountry = {
                                name: vm.company.address.country,
                                isHighlighted: isNationalHighlighted
                            };
                            vm.checkHighlighted = vm.selectedCountry.isHighlighted;
                        }
                    }
                    if (vm.company.eInvoicingCutOffDate) {
                        vm.company.eInvoicingCutOffDate = vm.company.eInvoicingCutOffDate.substring(0, 10);
                    }
                    if (vm.company.nationality != null) vm.selectedNationality = { name: vm.company.nationality };

                    angular.forEach(vm.company.identityDocuments, function (val, key) {
                        if (val.issuedBy != null) {
                            val.selectedIssuedBy = { name: val.issuedBy };
                        }
                    });

                    //add gallary images list with each document
                    for (var i = 0; i < vm.company.identityDocuments.length; i++) {
                        if (vm.company.identityDocuments[i].images == null)
                            vm.company.identityDocuments[i].images = [];

                        var gallaryImages = [];
                        var nonImgDocs = [];

                        for (var j = 0; j < vm.company.identityDocuments[i].images.length; j++) {
                            var img = vm.company.identityDocuments[i].images[j];

                            var imageDetail = imageGalleryObject();
                            imageDetail.thumb = img.url;
                            imageDetail.img = img.url;
                            imageDetail.description = vm.getIdentificationDocumentType(vm.company.identityDocuments[i].identityDocumentType);
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
                        vm.company.identityDocuments[i].gallaryImages = gallaryImages;
                        vm.company.identityDocuments[i].nonImgDocs = nonImgDocs;

                        var docs = $filter('filter')(vm.indentityDocuments, {
                            identityDocumentType: vm.company.identityDocuments[i].identityDocumentType,
                            isRequired: true
                        }, true);

                        vm.company.identityDocuments[i].isRequired = (docs.length > 0);
                    }

                    vm.parkingInvoice = parseInt(abp.setting.get('App.General.ParkingInvoice'));
                    vm.tollsInvoice = parseInt(abp.setting.get('App.General.TollsInvoice'));
                    vm.finesInvoice = parseInt(abp.setting.get('App.General.TrafficFineInvoice'));
                    vm.darbInvoice = parseInt(abp.setting.get('App.General.DarbTollsInvoice'));

                    if (vm.company.id > 0) {
                        vm.isEditMod = true;
                        vm.isContactCardPermission = vm.isEditMod && abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards') && !abp.auth.hasPermission('Pages.Tenant.Companies.Edit') && !abp.auth.hasPermission('Pages.Tenant.Companies.LimitedEdit');
                        vm.contactPersons.forEach(function (contactPerson) {
                            if (contactPerson.designationId == null) {
                                contactPerson.isDisabledDesignation = false;
                            } else {
                                contactPerson.isDisabledDesignation = true;
                            }
                        });
                    } else {
                        vm.isEditMod = false;
                    }
                    if (vm.company.gender > 0) {
                        getGender(vm.company.gender);
                    }

                    //if (vm.company.address.country != null) { Duplicate Code

                    //    if (!vm.isHighLightCountryEnabled) {
                    //        vm.selectedCountry = { name: vm.company.address.country };
                    //    } else {
                    //        const isNationalHighlighted = vm.searchCountriesFromSetting.some(country => country.name === vm.company.address.country);
                    //        vm.selectedCountry = {
                    //            name: vm.company.address.country,
                    //            isHighlighted: isNationalHighlighted
                    //        };
                    //        vm.checkHighlighted = vm.selectedCountry.isHighlighted;
                    //    }
                    //}
                    ////vm.selectedCountry = { name: vm.company.address.country };

                    if (vm.company.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }

                    if (vm.company && vm.indentityDocuments) {
                        showReqIdentityDocumentsRow();
                    }
                    if (vm.company && vm.mandatoryDesignations) {
                        showReqMandatoryDesignationsRow();
                    }
                    vm.isLimitPermissions = !abp.auth.hasPermission('Pages.Tenant.Companies.Edit') && abp.auth.hasPermission('Pages.Tenant.Companies.LimitedEdit') && vm.isEditMod;

                    if (!vm.isEnableVerifiedFeature) {
                        vm.company.verified = true;
                    } else if (!vm.permissions.isEnableVerified && vm.company.id <= 0) {
                        vm.company.verified = false;
                    }

                }).finally(function () {
                    vm.loading = false;
                    if (vm.company.id > 0) {
                        vm.searchContacts(vm.company.id);
                    }
                    vm.isCompanyVerifiedChange('companyCRSCreateOrEditForm');
                });
                commonLookupService.validateCreditLimit({
                    id: companyId
                }).success(function (result) {
                    vm.isCreditLimitNotValid = result.isLimitCrossed;
                }).finally(function () {
                    vm.loading = false;
                });

            }
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
            vm.isFieldMondatoryForSalesPerson = function (name) {
                if (name === "SalesPerson")
                    return vm.isSalesPersonRequired;
            }

            vm.isFieldMondatory = function (feild) {
                if (!vm.isEnableVerifiedFeature || vm.company.verified) {
                    if (!vm.mondatoryFields || vm.mondatoryFields.length < 1) return false;
                    var row = vm.mondatoryFields.filter(e => e.name === feild)[0];
                    if (row) {
                        //if setting is saved
                        return row.isRequired;
                    } else {
                        //else default setting will be loaded from utilities
                        row = utilities.advanceSettingMondatoryFieldscompanyCustomer().filter(e => e.name === feild)[0];
                        return row && row.isRequired;
                    }
                } else {
                    var notVerifiedFeildsArr = ["CompanyName"];//mondatory feilds for in valid company in array
                    return [...notVerifiedFeildsArr].indexOf(feild) > -1;
                }
            };

            vm.isAdditionalFieldsEnabled = function (field) {
                if (!vm.additionalFields || vm.additionalFields.length < 1) return false;
                var row = vm.additionalFields.filter(e => e.name === field)[0];
                return row && row.isEnabled;
            };

            vm.typeOfFeild = function (field) {
                if (!vm.additionalFields || vm.additionalFields.length < 1) return false;
                var row = vm.additionalFields.filter(e => e.name === field)[0];
                return row.value;
            };

            vm.onOverRideChange = function () {
                if (!vm.company.overRideEmailNotificationSetting) {
                    if (vm.company.customerNotificationSettings.length > 0) {
                        vm.company.customerNotificationSettings.forEach(function (notification) {
                            notification.isSent = false;
                        });
                    }
                }
            }

            vm.getAdvanceSettings = function () {
                companyService.getAdvanceSettings().success(function (data) {
                    if (data.name) {
                        vm.indentityDocuments = data.documents;
                        vm.mondatoryFields = data.mondatoryFields;
                        vm.additionalFields = data.additionalFields;
                        vm.mandatoryDesignations = data.mandatoryDesignations;
                    }
                    else {
                        vm.mondatoryFields = utilities.advanceSettingMondatoryFieldscompanyCustomer();
                        vm.indentityDocuments = utilities.advanceSettingEnumscompanyCustomer();
                    }
                    if (vm.company && vm.indentityDocuments) {
                        showReqIdentityDocumentsRow();
                    }
                    if (vm.company && vm.mandatoryDesignations) {
                        showReqMandatoryDesignationsRow();
                    }

                }).finally(function () {
                    //vm.loading = false;
                });
            };

            vm.getIndustries = function () {
                industryService.getIndustries()
                    .success(function (result) {
                        vm.industries = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getCompanyCustomField1 = function () {
                companyService.getCompanyCustomField1()
                    .success(function (result) {
                        vm.companyCustomField1 = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getCompanyCustomField2 = function () {
                companyService.getCompanyCustomField2()
                    .success(function (result) {
                        vm.companyCustomField2 = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.getHighLightBlackListCountries = function () {
                companyService.getHighLightBlackListCountry("AdvanceSettings.HighLightBlackListCountry").success(function (data) {
                    vm.searchCountriesFromSetting = data.formates;
                });
            }
            vm.getCompanyCustomField3 = function () {
                companyService.getCompanyCustomField3()
                    .success(function (result) {
                        vm.companyCustomField3 = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function showReqIdentityDocumentsRow() {
                angular.forEach(vm.indentityDocuments, function (row) {
                    if (row.isRequired) {
                        vm.addIndentityDocument(row);
                    }
                });
            }

            function showReqMandatoryDesignationsRow() {
                angular.forEach(vm.contactPersons, function (value) {
                    if (!value.designation)
                        value.designation = vm.designations.filter(e => e.id === value.designationId)[0];
                });
                angular.forEach(vm.mandatoryDesignations, function (row) {
                    if (row.isRequired) {
                        vm.addMandatoryDesignations(row);
                    }
                });
            }

            init();
        }
    ]);
