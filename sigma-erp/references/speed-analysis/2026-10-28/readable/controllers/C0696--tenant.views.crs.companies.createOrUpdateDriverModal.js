// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:180475-181432
appModule.controller('tenant.views.crs.companies.createOrUpdateDriverModal', [
        '$scope', '$filter', '$uibModal', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.person', 'mrzParser', 'utilities',
        'abp.services.app.contactGroup', 'abp.services.app.directory', 'abp.services.app.tariffCard', 'abp.services.app.commonLookup', 'abp.services.app.tenantSettings', 'driver', 'companyId', 'abp.services.app.company',
        function ($scope, $filter, $uibModal, $uibModalInstance, countryService, personService, mrzParser, utilities,
            contactGroupService, directoryService, tariffCardService, commonLookupService, tenantSettingsService, driver, companyId, companyService
        ) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.selectedCountry = null;
            vm.selectedNationality = null;
            vm.gender = '';
            vm.genders = [{ id: 1, name: app.localize('Male') }, { id: 2, name: app.localize('Female') }];
            vm.MissingTypes = [2, 3, 4];
            vm.taxPercentage = abp.setting.get("App.General.TaxPercentage");
            vm.isBusinessSourceBroker_CustomFieldType = parseInt(abp.setting.get("App.General.IsBusinessSourceBroker_CustomFieldType"));
            vm.tollSurcharge = parseFloat(abp.setting.get("App.General.TollsSurCharge"));
            vm.trafficFineSurCharge = parseFloat(abp.setting.get("App.General.TrafficFineSurCharge"));
            vm.invoicingRule = parseFloat(abp.setting.get("App.General.InvoicingRuleIndividual"));
            vm.invoicingType = parseFloat(abp.setting.get("App.General.InvoicingTypeIndividual"));
            vm.isTariffCardEnable = abp.auth.hasPermission("Pages.Tenant.TariffCards");
            vm.isCustomerWiseDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseDiscount");
            vm.isERSenabled = abp.features.isEnabled("ERS");
            vm.isCreditPeriodEnabled = abp.auth.hasPermission("Pages.Tenant.Customers.EnableCreditPeriod");
            vm.isCreditLimitEnabled = abp.auth.hasPermission("Pages.Tenant.Customers.EnableCreditLimit");
            vm.showAdvancePhoneNumberInputInContacts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAdvancePhoneNumberInputInContacts"));
            vm.isCRSVouchersInvoicesEnabled = abp.features.isEnabled("CRS.Vouchers.Invoices");
            vm.isCRSTollsEnabled = abp.features.isEnabled("CRS.Tolls");
            vm.isCRSFinesEnabled = abp.features.isEnabled("CRS.Fines");

            vm.invoicingOptions = [{ id: 1, name: app.localize('ClubWithRental') }, { id: 2, name: app.localize('Separate') }];

            vm.isEmiratesIDCardReaderEnable = abp.features.isEnabled("CRS.CustomFeatures.EmiratesIDCardReader");
            vm.leaseInvoicingRule = parseFloat(abp.setting.get("App.General.LeaseInvoicingRuleIndividual"));
            vm.leaseInvoicingType = parseFloat(abp.setting.get("App.General.LeaseInvoicingTypeIndividual"));
            vm.isfinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar"); //added by arslan for Qatar fines
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isCustomerWiseSettingEnabled = utilities.parseBoolean(abp.setting.get("App.General.AllowCustomerWiseSetting"));
            vm.trafficFineSurChargeType = gettrafficFineSurChargeType(parseFloat(abp.setting.get("App.General.FineSurchargeType")));
            vm.isFirstNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsFirstNameRequired"));
            vm.isMiddleNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsMiddleNameRequired"));
            vm.isLastNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsLastNameRequired"));
            vm.isGenderRequired = utilities.parseBoolean(abp.setting.get("App.General.IsGenderRequired"));
            vm.isEmailRequired = utilities.parseBoolean(abp.setting.get("App.General.IsEmailRequired"));
            vm.isNationalityRequired = utilities.parseBoolean(abp.setting.get("App.General.IsNationalityRequired"));
            vm.isCompanyRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCompanyRequired"));
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
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isReferralNameRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReferralNameRequired"));
            vm.isReferralContactNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReferralContactNoRequired"));
            vm.isReferralRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReferralRequired"));
            vm.isDateOfBirthFeildRequired = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsDateOfBirthFeildRequired"));

            vm.isBusinessSourceBroker = utilities.parseBoolean(abp.setting.get("App.General.IsBusinessSourceBroker"));
            vm.isLoyalityNumber = utilities.parseBoolean(abp.setting.get("App.General.IsLoyalityNumber"));
            vm.isCodeRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCodeRequired"));
            vm.isDriverLicenseRequired = utilities.parseBoolean(abp.setting.get("App.General.IsDriverLicenseRequired"));
            vm.trafficFineSurchargeTypes = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.contactCardpermissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards'),
                add: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Add'),
                edit: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Delete'),
            };
            vm.isLimitPermissions = !abp.auth.hasPermission('Pages.Tenant.Contacts.Edit') && abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit') && vm.isEditMod;
            vm.locations = [];
            var imageDocs = [];

            vm.taxRules = utilities.getTaxRules();

            vm.tariffCards = [];
            vm.tariffCard = null;
            function gettrafficFineSurChargeType(id) {
                if (id === 1)
                    return "Fixed";
                else if (id === 2)
                    return "Percentage";
                else return '';
            }

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM');
                }
                else {
                    return "";
                }
            };
            vm.filters = {
                name: ''
            };
            vm.options = {
                format: vm.dateFormat,
                maxDate: moment().endOf('day')
            };
            vm.driver = {
                dateOfBirth: null
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
                var index = vm.driver.contactCards.indexOf(row);
                vm.driver.contactCards.splice(index, 1);
            };

            vm.searchSalesPersons = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.salesPersons = response.data.items;
                });
            };

            vm.searchSalesPersonPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result !== null) {
                        vm.driver.salesPerson = result;
                        vm.salesPersonSelected();
                    }
                });
            };

            vm.salesPersonSelected = function () {
                vm.driver.salesPersonId = vm.driver.salesPerson.id;
            };

            vm.getDocsByContactId = function (identityDocumentId) {
                return imageDocs.filter(x => x.identityDocumentId === identityDocumentId);
            };

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

                var docs = $filter('filter')(vm.driver.identityDocuments, {
                    identityDocumentType: docMrz.identityDocumentType
                }, true);

                $scope.$apply(function () {
                    if (vm.driver.firstName === null || vm.driver.firstName === '') {
                        vm.driver.firstName = docMrz.names.firstName;
                        vm.driver.middleName = docMrz.names.middleName;
                        vm.driver.lastName = docMrz.names.lastName;
                    }


                    if (vm.driver.referralName === null || vm.driver.referrallName === '')
                        vm.driver.referralName = docMrz.refferalName;

                    if (vm.driver.referralContactNo === null || vm.driver.referralContactNo === '')
                        vm.driver.referrallContactNo = docMrz.referralContactNo;

                    if (vm.driver.referral === null || vm.driver.referral <= 0)
                        vm.driver.referral = docMrz.referral;

                    if (vm.driver.gender === null || vm.driver.gender <= 0)
                        vm.driver.gender = docMrz.gender;

                    if (vm.driver.dateOfBirth === null)
                        vm.driver.dateOfBirth = docMrz.dateOfBirth;

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
                        vm.driver.identityDocuments.push(
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

                    var docs = $filter('filter')(vm.driver.identityDocuments, {
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
                    //var docs = $filter('filter')(vm.driver.identityDocuments, {
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
                        imageDocs.push(imageDetail);
                    }
                    else
                        identityDocument.gallaryImages.push(imageDetail);
                    //}
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
                    vm.driver.contactCards.push(result);
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

                if (vm.driver.identityDocuments !== null) {

                    var drivingLisense = vm.driver.identityDocuments.filter(doc => doc.identityDocumentType === 4);
                    if (drivingLisense.length > 0) {
                        if (drivingLisense[0].expiryDate <= moment().startOf('day')) {
                            isValid = false;
                            errorMessage = errorMessage + '\n Expiry Date can  not less than Current Date';
                        }
                    }
                    angular.forEach(vm.driver.identityDocuments, function (value, key) {
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
            vm.save = function () {

                checkingIssueAndExpiryDate();

                vm.saving = true;
                if (vm.isDriverLicenseRequired) {
                    if (!(vm.driver.identityDocuments.length > 0 && vm.driver.identityDocuments.some(e => e.identityDocumentType === 4))) {
                        abp.message.info("Driving License Is Required");
                        vm.saving = false;
                        return;
                    }
                }
                if (vm.driver.dateOfBirth > moment()) {
                    abp.message.info("DOB Should not be Future Date");
                    vm.saving = false;
                    return;
                }
                if (isValid) {
                    if (vm.selectedCountry !== null) {
                        vm.driver.address.country = vm.selectedCountry.name;
                    }

                    if (vm.selectedNationality !== null) {
                        vm.driver.nationality = vm.selectedNationality.name;
                    }
                    if (companyId > 0) {
                        vm.driver.companyId = companyId;
                        companyService.createOrUpdateCopmanyDriver({
                            copmanyDriver: vm.driver,
                            contactCards: vm.driver.contactCards,
                        }).success(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            vm.driver.id = result;
                        }).finally(function () {
                            vm.saving = false;
                            stopDocumentReader();
                            $uibModalInstance.close(vm.driver);
                        });
                    }
                    else {
                        vm.saving = false;
                        stopDocumentReader();
                        $uibModalInstance.close(vm.driver);
                    }
                    
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }

            };

            vm.cancel = function () {
                stopDocumentReader();
                $uibModalInstance.dismiss();
            };

            vm.doesIdentityDoucmentExist = function (documentType) {
                if (!vm.driver) return false;
                if (!vm.driver.identityDocuments) return false;

                var docs = $filter('filter')(vm.driver.identityDocuments, {
                    identityDocumentType: documentType
                }, true);

                return (docs.length > 0);
            };



            vm.addIndentityDocument = function (row) {
                if (vm.doesIdentityDoucmentExist(row.identityDocumentType)) return;

                vm.driver.identityDocuments.push(
                    {
                        documentNo: "",
                        identityDocumentType: row.identityDocumentType,
                        isRequired: row.isRequired,
                        issuedBy: "",
                        issueDate: null,
                        expiryDate: null,
                        images: []
                    }
                );
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
                else if (id === 15)
                    return app.localize('OtherDocument2');
                else if (id === 16)
                    return app.localize('OtherDocument3');
                else if (id === 17)
                    return app.localize('OtherDocument4');
                else
                    return "";
            };

            vm.removeIndentityDocument = function (documentType) {
                for (var i = 0; i < vm.driver.identityDocuments.length; i++) {
                    if (vm.driver.identityDocuments[i].identityDocumentType === documentType) {
                        vm.driver.identityDocuments.splice(i, 1);
                        return;
                    }
                }
            };

            vm.searchCountries = function (filter) {

                vm.filters.name = filter;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });

            };

            function getContactGroups() {
                contactGroupService.getContactGroupsOnContactType({ contactType: 2 }).success(function (result) {
                    vm.contactGroups = $filter('filter')(result.items, {
                        isDefault: false
                    }, true);

                }).finally(function () { vm.loading = false; });
            }
            vm.searchCompany = function ($select) {
                return directoryService.search({ keyword: $select.search, contactCategory: 2 }).then(function (response) {
                    vm.company = response.data.items;

                });
            };
            function getGender(id) {
                if (id === 1)
                    vm.gender = "Male";
                if (id === 2)
                    vm.gender = "Female";

            };

            vm.emiratesDataReader = function () {
                $.ajax({
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    type: "POST", //GET , POST
                    url: "https://localhost:44333/api/SECardReader/Get",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        //console.log(result);
                        if (result !== null) {
                            vm.emiratesDataFieldManager(result);
                        } else {
                            abp.notify.warn('Device or Card not found', 'Not Found');
                        }
                    },
                    error: function (error) {
                        abp.notify.error('Please start service', 'Service Error');
                    }
                });
            };

            vm.emiratesDataFieldManager = function (person) {

                var fullName = person.FullName.split(" ");
                if (fullName[0] !== null) {
                    vm.driver.firstName = "";
                    vm.driver.firstName = fullName[0];
                }
                if (fullName[1] !== null) {
                    vm.driver.middleName = "";
                    vm.driver.middleName = fullName[1];
                }
                if (fullName[2] !== null) {
                    vm.driver.lastName = "";
                    for (var i = 2; i <= fullName.length - 1; i++) {
                        vm.driver.lastName += fullName[i] + " ";
                    }
                }

                vm.driver.gender = "";
                if (person.Sex === "Male") {
                    vm.driver.gender = 1;
                }
                else if (person.Sex === "Female") {
                    vm.driver.gender = 2;
                }


                vm.driver.age = "";
                vm.driver.age = Math.abs(new Date().getFullYear() - new Date(moment(person.DateOfBirth, "DD/MM/YYYY")).getFullYear());

                vm.removeIndentityDocument(3);
                vm.driver.identityDocuments.push(
                    {
                        documentNo: person.IdNumber,
                        identityDocumentType: 3,
                        issuedBy: "UAE",
                        issueDate: moment(person.IssueDate, "DD/MM/YYYY"),
                        expiryDate: moment(person.ExpiryDate, "DD/MM/YYYY")
                    }
                );

                vm.selectedNationality = "";
                vm.filters.name = person.Nationality;
                countryService.searchCountries(vm.filters).then(function (response) {
                    vm.selectedNationality = response.data.items[0];
                });

                //additional feilds
                vm.driver.address = {};
                vm.driver.address.addressLine1 = person.PlaceOfBirthEnglish + (person.ResidencyNumber !== null ? " (" + person.ResidencyNumber + ") " : "");
                if (person.HomeAddress) {
                    vm.driver.email = person.HomeAddress.Email;
                    vm.driver.mobileNo = person.HomeAddress.MobilePhoneNumber;
                    vm.driver.contactNo = person.HomeAddress.ResidentPhoneNumber;
                    vm.driver.dateOfBirth = moment(person.DateOfBirth, "DD/MM/YYYY");

                    vm.driver.address.city = person.HomeAddress.CityDescriptionEnglish;
                    vm.driver.address.zipCode = person.HomeAddress.AreaCode;
                    vm.driver.address.state = person.HomeAddress.EmirateDescriptionEnglish;
                }

                if (person.Passport) {
                    vm.removeIndentityDocument(2);
                    vm.driver.identityDocuments.push(
                        {
                            documentNo: person.Passport.PassportNumber,
                            identityDocumentType: 2,
                            issuedBy: person.Passport.PassportCountry,
                            issueDate: moment(person.Passport.PassportIssueDate, "DD/MM/YYYY"),
                            expiryDate: moment(person.Passport.PassportExpiryDate, "DD/MM/YYYY")
                        }
                    );
                }

            };


            vm.getTariffCards = function () {
                vm.loading = true;
                tariffCardService.getTariffCards().success(function (data) {
                    vm.tariffCards = data.items;
                    vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.isDocument = function (i) {
                return i && i.name &&
                    (['jpg', 'jpeg', 'png'].indexOf(i.name.split('.')[1].toLowerCase()) === -1);
            };


            vm.isFieldMondatory = function (field) {
                if (!vm.mondatoryFields || vm.mondatoryFields.length < 1) return false;
                var row = vm.mondatoryFields.filter(e => e.name === field)[0];
                if (row) if (row.isRequired) return true; else return false; else {
                    row = utilities.advanceSettingMondatoryFieldscompanyDriver().filter(e => e.name === field)[0];
                    if (row) if (row.isRequired) return true; else return false; else return false;
                }
            };

            vm.isAdditionalFieldsEnabled = function (field) {
                if (!vm.additionalFields || vm.additionalFields.length < 1) return false;
                var row = vm.additionalFields.filter(e => e.name === field)[0];
                if (row) if (row.isEnabled) return true; else return false; else return false;
            };

            vm.typeOfFeild = function (field) {
                if (!vm.additionalFields || vm.additionalFields.length < 1) return false;
                var row = vm.additionalFields.filter(e => e.name === field)[0];
                return row.value;
            };

            vm.getAdvanceSettings = function () {
                companyService.getAdvanceSettingsForDriver().success(function (data) {
                    //if (data.name) {
                    //    vm.indentityDocuments = data.documents;
                    //}
                    //else {
                    //    vm.indentityDocuments = utilities.advanceSettingEnumsDriverCustomer();
                    //}
                    //if (vm.driver && vm.indentityDocuments) {
                    //    showReqIdentityDocumentsRow();
                    //}
                    if (data.name) {
                        vm.indentityDocuments = data.documents;
                        vm.mondatoryFields = data.mondatoryFields;
                        vm.additionalFields = data.additionalFields;
                    }
                    else {
                        vm.indentityDocuments = utilities.advanceSettingEnumsDriverCustomer();
                    }
                    if (vm.company && vm.indentityDocuments) {
                        showReqIdentityDocumentsRow();
                    }
                    init();
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
            vm.getAdvanceSettings();
            function init() {
                vm.loading = true;
                getLocations();

            if(true)
            {
                var driverIdToGet = null;
                if (driver)
                    driverIdToGet = driver.id;
                    personService.getDriverForEdit({
                        id: driverIdToGet
                    }).success(function (result) {
                        vm.driver = result;
                        vm.driver.contactCards = [];
                        getContactGroups();

                        if (vm.driver.id < 1) {
                            vm.driver.age = null;
                            vm.driver.drivingExperience = null;
                        }
                        if (vm.driver.id > 1) {
                            if (vm.driver.age === 0)
                                vm.driver.age = null;
                            if (vm.driver.drivingExperience === 0)
                                vm.driver.drivingExperience = null;
                            if (vm.contactCardpermissions.view) {
                                personService.getContactCards({ id: vm.driver.id }).success(function (result) {
                                    vm.driver.contactCards = result;
                                });
                            }
                        }

                        if (vm.driver.address.country !== null) vm.selectedCountry = { name: vm.driver.address.country };
                        if (vm.driver.nationality !== null) vm.selectedNationality = { name: vm.driver.nationality };

                        angular.forEach(vm.driver.identityDocuments, function (val, key) {
                            if (val.issuedBy != null) {
                                val.selectedIssuedBy = { name: val.issuedBy };
                            }
                        });


                        //add gallary images list with each document
                        for (var i = 0; i < vm.driver.identityDocuments.length; i++) {
                            if (vm.driver.identityDocuments[i].images === null)
                                vm.driver.identityDocuments[i].images = [];

                            var gallaryImages = [];
                            for (var j = 0; j < vm.driver.identityDocuments[i].images.length; j++) {
                                var img = vm.driver.identityDocuments[i].images[j];

                                var imageDetail = imageGalleryObject();
                                imageDetail.thumb = img.url;
                                imageDetail.img = img.url;
                                imageDetail.description = vm.getIdentificationDocumentType(vm.driver.identityDocuments[i].identityDocumentType);
                                imageDetail.name = img.name;
                                imageDetail.url = img.url;
                                imageDetail.guid = img.guid;

                                if (vm.isDocument(imageDetail)) {
                                    imageDetail.identityDocumentId = img.identityDocumentId;
                                    imageDocs.push(imageDetail);
                                }
                                else
                                    gallaryImages.push(imageDetail);
                            }
                            vm.driver.identityDocuments[i].gallaryImages = gallaryImages;

                            var docs = $filter('filter')(vm.indentityDocuments, {
                                identityDocumentType: vm.driver.identityDocuments[i].identityDocumentType,
                                isRequired: true
                            }, true);

                            vm.driver.identityDocuments[i].isRequired = (docs.length > 0);

                        }

                        if (vm.driver.id > 0) {
                            vm.isEditMod = true;
                        } else {
                            vm.isEditMod = false;
                            vm.driver.gender = null;
                        }
                        if (vm.driver.gender > 0)
                            getGender(vm.driver.gender);

                        if (vm.driver && vm.indentityDocuments) {
                            showReqIdentityDocumentsRow();
                        }
                        vm.isLimitPermissions = !abp.auth.hasPermission('Pages.Tenant.Contacts.Edit') && abp.auth.hasPermission('Pages.Tenant.Contacts.LimitedEdit') && vm.isEditMod;

                    }).finally(function () {
                        vm.loading = false;
                    });

                } else {
                    vm.driver = driver;
                }
                vm.driver = driver;
                if (!vm.driver) vm.driver = {};
                

                vm.tollsInvoice = parseInt(abp.setting.get('App.General.TollsInvoice'));
                vm.finesInvoice = parseInt(abp.setting.get('App.General.TrafficFineInvoice'));

                initDocumentReader();
                vm.loading = false;
            }

            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });

            //init();
        }
    ]);
