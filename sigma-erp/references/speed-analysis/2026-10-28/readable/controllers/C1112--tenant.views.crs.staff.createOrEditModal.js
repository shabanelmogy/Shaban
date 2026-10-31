// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:292818-293450
appModule.controller('tenant.views.crs.staff.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.country', 'abp.services.app.staff', 'staffId', '$uibModal', 'utilities', 'appSession', 'abp.services.app.designation', 'abp.services.app.commonLookup', 'abp.services.app.payStructureSetting', 'abp.services.app.staffRole', 'abp.services.app.department', 'abp.services.app.shift', 'abp.services.app.salaryItemsSetting', 'abp.services.app.leaveType', 'abp.services.app.businessUnit', 'abp.services.app.sponsorship', 'abp.services.app.division',
        function ($scope, $uibModalInstance, directoryService, countryService, staffService, staffId, $uibModal, utilities, appSession, designationService, commonLookupService, payStructureSetting, staffRoleService, departmentService, shiftService, salaryItemsSettingService, leaveTypeService, businessUnitService, sponsorshipService, divisionService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.selectedCountry = null;
            vm.selectedNationality = null;
            vm.isEmiratesIDCardReaderEnable = abp.features.isEnabled("CRS.CustomFeatures.EmiratesIDCardReader");
            vm.isDesignationFeatureEnabled = abp.features.isEnabled("Core.Staff.Designations");
            vm.driverTimeSheetForAgreement = abp.features.isEnabled("CRS.DriverTimeSheetForAgreement");
            vm.isHrmEnabled = abp.features.isEnabled("HRM");
            vm.isAllowSalaryPackageEdit = abp.auth.isGranted("Pages.Tenant.Staff.SalaryPackage.Edit");
            vm.isAllowSalaryPackageView = abp.auth.isGranted("Pages.Tenant.Staff.SalaryPackage.View");
            vm.gender = '';
            vm.genders = [{ id: 1, name: app.localize('Male') }, { id: 2, name: app.localize('Female') }];
            vm.isManualStaffCode = utilities.parseBoolean(abp.setting.get("App.DocumentNos.ManualStaffCode"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isBusinessUnitEnabled = abp.features.isEnabled("HRM.Business.Unit");
            vm.isBusinessUnitWisePayrollProcess = abp.setting.getBoolean("App.Speed.Hrm.IsBusinessUnitsWisePayrollProcess");
            vm.isSponsorshipEnabled = abp.features.isEnabled("HRM.StaffSponsorships");
            vm.isDepartmentEnabled = abp.features.isEnabled("HRM.Departments");
            vm.isDivisionsEnabled = abp.features.isEnabled("Core.Divisions");

            vm.dateTimeFormat = vm.dateFormat;
            var isValid = true;
            var errorMessage = '';
            var imageDocs = [];
            vm.locations = [];
            vm.shifts = [];
            vm.staffs = [];
            vm.sponsorships = [];
            vm.contactBankAccounts = [];
            vm.filters = {
                name: '',
                staffId: null,
            };
            vm.staff = {
                staffWiseEligibilities: [],
            };
            vm.paymentModes = [
                { name: "Cash", id: 1 },
                { name: "WPS", id: 2 }
            ];
            vm.getPaymentModeName = function (id) {
                var mode = vm.paymentModes.find(x => x.id === id);
                return mode ? mode.name : '';
            };
            vm.salaryTypeInString = (value) => {
                if (value === 1)
                    return "Incentive";
                if (value === 2)
                    return "Deduction";
                return "None";
            }
            vm.addContactBankAccountRow = function () {
                vm.contactBankAccounts.push(contactBankAccountObject());
            };
            vm.removeContactBankAccountRow = function (obj) {
                var index = vm.contactBankAccounts.indexOf(obj);
                vm.contactBankAccounts.splice(index, 1);
            };
            function contactBankAccountObject() {
                let contactBA = new Object();
                contactBA.name = null;
                contactBA.routingCode = null;
                contactBA.branch = null;
                contactBA.accountNo = null;
                contactBA.iban = null;
                return contactBA;
            }
            vm.clearStaff = function () {
                vm.filters.staff = null;
                vm.filters.staffId = null;
            };
            
            vm.salaryType = function (value) {
                var matchingObjects = vm.salaryTypes.filter(function (obj) {
                    return obj.id === value;
                });
                if (matchingObjects)
                    return abp.localization.localize(matchingObjects[0].type);

            };
            vm.searchStaff = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                    vm.staffs = response.data.items;
                });
            };

            vm.searchStaffPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 1;
                        }
                    }
                }).result.then(function (staff) {
                    if (staff != null) {
                        vm.filters.staff = staff;
                    }
                });
            };

            vm.openPrintModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/staff/printDocumenetModel.cshtml',
                    controller: 'tenant.views.crs.staff.printDocumenetModel as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        staffId: function () {
                            return staffId;
                        }
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.doesIdentityDoucmentExist = function (documentType) {
                if (!vm.staff ) return false;
                if (!vm.staff.identityDocuments) return false;

                for (var i = 0; i < vm.staff.identityDocuments.length; i++) {
                    if (vm.staff.identityDocuments[i].identityDocumentType == documentType) return true;
                }

                return false;
            };
            vm.getAllDivisions = () => {
                vm.loading = true;
                return divisionService.getDivisions({})
                    .then(function (response) {
                        vm.divisions = response.data.items;

                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };
            vm.addIndentityDocument = function (documentType) {
                if (vm.doesIdentityDoucmentExist(documentType)) return;
                vm.staff.identityDocuments.push(
                    {
                        documentNo: "",
                        identityDocumentType: documentType,
                        issuedBy: "",
                        issueDate: null,
                        expiryDate: null
                    }
                );
            };
            vm.openUploadDocument = function (identityDocument) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadDocumentModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                identityDocument: identityDocument
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

                    if (identityDocument.images == undefined)
                        identityDocument.images = [];
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
                        imageDocs.push(imageDetail);
                    }
                    else
                    identityDocument.gallaryImages.push(imageDetail);

                });
            };
            function getLocations() {

                commonLookupService.getLocations({
                }).success(function (data) {
                    vm.locations = data.items;
                });
            };

            vm.getAllBusinessUnits = () => {
                businessUnitService.getBusinessUnits({}).success(function (data) {
                    vm.businessUnits = data;
                });
            }

            vm.getAllSponsorships = () => {
                sponsorshipService.getAllActiveSponsorships({}).success(function (data) {
                    vm.sponsorships = data;
                });
            }

            function getShifts() {
                shiftService.getShifts({
                }).success(function (data) {
                    vm.shifts = data.items;
                });
            };
            function getDepartments() {
                departmentService.getDepartment({}).success(function (data) {
                    vm.departments = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getReportingStaff(reportingStaffId) {
                vm.loading = true;
                directoryService.getContactInfo({ Id: reportingStaffId }).success(function (result) {
                    vm.filters.staff = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getStaffRoles() {
                staffRoleService.getStaffRole({}).success(function (data) {
                    vm.staffRoles = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getLeaveTypes() {
                leaveTypeService.getLeaveType({}).success(function (data) {
                    vm.leaveTypes = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.addRow = function () {
                var row = new Object();
                //row.fromValue = null;
                //row.toValue = null;
                //row.levelName = "";
                //row.userId = null;
                //row.user = null;
                row.enumApproverType = 1;
                row.order = vm.staff.staffWiseEligibilities.length < 1 ? 1 : vm.staff.staffWiseEligibilities[vm.staff.staffWiseEligibilities.length - 1].order + 1;
                vm.staff.staffWiseEligibilities.push(row);
            };
            vm.removeRow = function (leaveTypeApprovalSetting) {
                var index = vm.staff.staffWiseEligibilities.indexOf(leaveTypeApprovalSetting);
                vm.staff.staffWiseEligibilities.splice(index, 1);
            };
            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }

            vm.removeIndentityDocument = function (documentType) {
                for (var i = 0; i < vm.staff.identityDocuments.length; i++) {
                    if (vm.staff.identityDocuments[i].identityDocumentType == documentType) {
                        vm.staff.identityDocuments.splice(i, 1);
                        return;
                    }
                }
            };


            function getGender(id) {
                if (id == 1)
                    vm.gender = "Male";
                if (id == 2)
                    vm.gender = "Female";

            };
            vm.getIdentificationDocumentType = function (id) {
                //if (id == 1)
                //    return "TradeLicense";
                //else 

                if (id == 2)
                    return app.localize('Passport');
                else if (id == 3)
                    return app.localize('NationalId');
                else if (id == 4)
                    return app.localize('DrivingLicense');
                else if (id == 5)
                    return app.localize('OtherDocument');
                else if (id == 6)
                    return app.localize('StaffDocument1');
                else if (id == 7)
                    return app.localize('HealthCard');
                else
                    return "";
            };

            //  Expiry And IssueDate Check Function

            function checkingIssueAndExpiryDate() {
                isValid = true;
                errorMessage = 'Contact Can Not Be Saved Due To Following Issues: \n';

                if (vm.staff.identityDocuments != null) {
                    angular.forEach(vm.staff.identityDocuments, function (value, key) {
                        if (value.issueDate == false) value.issueDate = null; //due to picker issue if date is made empty then in model it sets false, so in that case set to null
                        if (value.expiryDate == false) value.expiryDate = null; //due to picker issue if date is made empty then in model it sets false, so in that case set to null

                        if (value.expiryDate != null && value.issueDate != null) {
                            if (value.issueDate > value.expiryDate) {
                                isValid = false;
                                errorMessage = errorMessage + '\n Expiry Date is less than the Issue Date';
                            }

                            if (value.expiryDate < moment().toDate()) {
                                isValid = false;
                                var string = '\n Expiry Date is less than Current Date';
                                if (!errorMessage.includes(string))
                                    errorMessage = errorMessage + string;
                            }
                        }
                    });
                }
            }

            vm.save = function () {
                checkingIssueAndExpiryDate();
                if (vm.filters.staff) {
                    vm.staff.reportingToId = vm.filters.staff.id
                }
                //vm.staff.staffWiseEligibilities = [vm.staff.staffWiseEligibilities]
                vm.saving = true;
                if (isValid) {
                    if (vm.selectedCountry != null) vm.staff.address.country = vm.selectedCountry.name;
                    if (vm.selectedNationality != null) vm.staff.nationality = vm.selectedNationality.name;

                    if (vm.contactBankAccounts != null && vm.contactBankAccounts.length > 0) {
                        vm.staff.contactBankAccounts = vm.contactBankAccounts;
                    }
                    staffService.createOrUpdateStaff({
                        staff: vm.staff,
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            };
            vm.payCalculate = function (spp) {
                if ( spp.amount != undefined && !spp.hasFormula) {

                    vm.loading = true;

                    staffService.getPayCalculate({
                        staff: vm.staff
                    }).success(function (result) {
                        vm.staff.staffPayPackages = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };
            vm.searchCountries = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });

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
                        if (result != null) {
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

            vm.getDocsByContactId = function (identityDocumentId) {
                return imageDocs.filter(x => x.identityDocumentId === identityDocumentId);
            };


            vm.emiratesDataFieldManager = function (person) {

                var fullName = person.FullName.split(" ");
                if (fullName[0] != null) {
                    vm.staff.firstName = "";
                    vm.staff.firstName = fullName[0];
                }
                if (fullName[1] != null) {
                    vm.staff.middleName = "";
                    vm.staff.middleName = fullName[1];
                }
                if (fullName[2] != null) {
                    vm.staff.lastName = "";
                    for (var i = 2; i <= fullName.length - 1; i++) {
                        vm.staff.lastName += fullName[i] + " ";
                    }
                }


                vm.staff.gender = "";
                if (person.Sex == "Male") {
                    vm.staff.gender = 1;
                }
                else if (person.Sex == "Female") {
                    vm.staff.gender = 2;
                }

                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


                vm.staff.dateOfBirth = null;
                vm.staff.dateOfBirth = moment(person.DateOfBirth, vm.dateFormat);

                vm.removeIndentityDocument(3);
                vm.staff.identityDocuments.push(
                    {
                        documentNo: person.IdNumber,
                        identityDocumentType: 3,
                        issuedBy: "UAE",
                        issueDate: moment(person.IssueDate, vm.dateFormat),
                        expiryDate: moment(person.ExpiryDate, vm.dateFormat)
                    }
                );

                vm.selectedNationality = "";
                vm.filters.name = person.Nationality;
                countryService.searchCountries(vm.filters).then(function (response) {
                    vm.selectedNationality = response.data.items[0];
                });

                //additional feilds
                vm.staff.address = {};
                vm.staff.address.addressLine1 = person.PlaceOfBirthEnglish + (person.ResidencyNumber !== null ? " (" + person.ResidencyNumber + ") " : "");
                if (person.HomeAddress) {
                    vm.staff.email = person.HomeAddress.Email;
                    vm.staff.mobileNo = person.HomeAddress.MobilePhoneNumber;
                    vm.staff.contactNo = person.HomeAddress.ResidentPhoneNumber;
                    vm.staff.dateOfBirth = moment(person.DateOfBirth, "DD/MM/YYYY");

                    vm.staff.address.city = person.HomeAddress.CityDescriptionEnglish;
                    vm.staff.address.zipCode = person.HomeAddress.AreaCode;
                    vm.staff.address.state = person.HomeAddress.EmirateDescriptionEnglish;
                }

                if (person.Passport) {
                    vm.removeIndentityDocument(2);
                    vm.staff.identityDocuments.push(
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

            vm.isDocument = function (i) {
                return i && i.name &&
                    (['jpg', 'jpeg', 'png'].indexOf(i.name.split('.')[1].toLowerCase()) === -1);
            };

            vm.salaryCalculation = () => {
                vm.staff.grossPay = 0;
                vm.staff.netPay = 0;

                vm.staff.staffPayPackages.forEach(spp => {
                    if (spp.type === 1) {
                        vm.staff.grossPay += +spp.amount || 0;
                        vm.staff.netPay += +spp.amount || 0;
                    }
                    else {
                        vm.staff.netPay -= +spp.amount || 0;
                    }
                });
            }
            var designationDetails = function () {
                designationService.getDesignations().success(function (result) {
                    vm.designationDetails = result.items;
                    //console.log(test);
                });
            };


            function init() {
                vm.loading = true;
                
                getLocations();
                if (vm.isHrmEnabled) {
                    getShifts();
                }

                //Get business unit for hrm
                if (vm.isBusinessUnitWisePayrollProcess && vm.isBusinessUnitEnabled)
                    vm.getAllBusinessUnits();

                //Get Sponsorships for hrm
                if (vm.isSponsorshipEnabled)
                {
                    vm.getAllSponsorships();
                }

                if (vm.isDivisionsEnabled) {
                    vm.getAllDivisions();
                }    
                getDepartments();
                getStaffRoles();
                getLeaveTypes();
                if (vm.isDesignationFeatureEnabled)
                    designationDetails();
                staffService.getStaffForEdit({
                    id: staffId
                }).success(function (result) {
                    vm.staff = result;
                    getReportingStaff(vm.staff.reportingToId);
                    //vm.staff.dateOfConfirmation = vm.getlocalDateTime(vm.staff.dateOfConfirmation)
                    //vm.staff.dateOfJoining = vm.getlocalDateTime(vm.staff.dateOfJoining)
                    //vm.staff.dateOfBirth = vm.getlocalDateTime(vm.staff.dateOfBirth)
                    if (vm.staff.address.country != null) vm.selectedCountry = { name: vm.staff.address.country };
                    if (vm.staff.nationality != null) vm.selectedNationality = { name: vm.staff.nationality };
                    angular.forEach(vm.staff.identityDocuments, function (val, key) {
                        if (val.issuedBy != null) {
                            val.selectedIssuedBy = { name: val.issuedBy };
                        }
                    });
                    if (vm.staff.id > 0) {
                        vm.salaryCalculation();
                        vm.isEditMod = true;
                    } else {
                        vm.staff.grossPay = 0;
                        vm.staff.netPay = 0;
                        vm.isEditMod = false;
                    }
                    if (vm.staff && vm.staff.contactBankAccounts != null) {
                        vm.contactBankAccounts = vm.staff.contactBankAccounts;
                    }
                    //add gallary images list with each document
                    for (var i = 0; i < vm.staff.identityDocuments.length; i++) {
                        if (vm.staff.identityDocuments[i].images == null)
                            vm.staff.identityDocuments[i].images = [];

                        var gallaryImages = [];
                        for (var j = 0; j < vm.staff.identityDocuments[i].images.length; j++) {
                            var img = vm.staff.identityDocuments[i].images[j];

                            var imageDetail = imageGalleryObject();
                            imageDetail.name = img.name;
                            imageDetail.thumb = img.url;
                            imageDetail.img = img.url;
                            imageDetail.description = vm.getIdentificationDocumentType(vm.staff.identityDocuments[i].identityDocumentType);
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
                        vm.staff.identityDocuments[i].gallaryImages = gallaryImages;
                    }
                    if (vm.staff.gender > 0)
                        getGender(vm.staff.gender);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
            salaryItemsSettingService.getSalaryItemTypes().success(function (data) {
                vm.salaryTypes = data;
                init();

            });
        }
    ]);
