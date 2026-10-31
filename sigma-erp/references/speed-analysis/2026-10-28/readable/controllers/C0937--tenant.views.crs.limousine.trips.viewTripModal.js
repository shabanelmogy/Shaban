// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:254646-255027
appModule.controller('tenant.views.crs.limousine.trips.viewTripModal', [
        '$scope', '$uibModal', '$filter', '$uibModalInstance', '$sce', 'tripId', 'utilities', 'appSession', 'abp.services.app.limoTripSearch', 'abp.services.app.directory', 'abp.services.app.limoTrip',
        function ($scope, $uibModal, $filter, $uibModalInstance, $sce, tripId, utilities, appSession, limoTripSearchService, directoryService, tripService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.customers = [];
            vm.trip = null;
            vm.checklist = null;
            vm.isCustomerLogin = false; //
            vm.contactId = appSession.user.contactId;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isLimoDiscountEnabled = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoDiscount"));
            vm.limoCustomField = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField"));
            vm.limoCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField1"));
            vm.limoPickUpAddress = utilities.parseBoolean(abp.setting.get("App.General.Limo.PickUpAddress"));
            vm.limoDropOffAddress = utilities.parseBoolean(abp.setting.get("App.General.Limo.DropOffAddress"));
            vm.isOutOfCityPickUpLocation = utilities.parseBoolean(abp.setting.get("App.General.Limo.IsOutOfCityPickUpLocation"));
            vm.isOutOfCityDropOffLocation = utilities.parseBoolean(abp.setting.get("App.General.Limo.IsOutOfCityDropOffLocation"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.taxCategoryChangeableInTrip = abp.features.isEnabled('CRS.TaxCategoryChangeableInTrip');
            vm.trip_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.trip_EnableCustomField2 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.trip_EnableCustomField3 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
            vm.trip_CustomField1Type = parseInt(abp.setting.get("App.General.Trip_CustomField1Type"));
            vm.trip_CustomField2Type = abp.setting.get("App.General.Trip_CustomField2Type");
            vm.trip_CustomField3Type = abp.setting.get("App.General.Trip_CustomField3Type");
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.additionalDriverWithTrip = utilities.parseBoolean(abp.setting.get("App.General.AdditionalDriverWithTrip"));
            vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
            vm.noOfPersonsEnabled = utilities.parseBoolean(abp.setting.get("App.General.NoOfPersonsEnabled"));
            vm.trackMileage = utilities.parseBoolean(abp.setting.get("App.General.Trip_TrackMileage"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.documentsForLimousine = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForLimousine");
            vm.isShowTripSafetyCheckList = abp.features.isEnabled("CRS.LimoSafetyChecks");
            vm.isInvoiceToEnabled = abp.features.isEnabled('CRS.Limousine.InvoiceTo');
            vm.isLimoDriverNotesEnabled = abp.features.isEnabled('CRS.LimoDriverNotes');
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.AllActionsOnOtherBranchTrips'),
                vm.dispatchPermission = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Dispatch');
            vm.enableDriverCommision = utilities.parseBoolean(abp.setting.get("App.General.Limo.EnableDriverCommissionForTrips"));
            vm.separateDateAndTime = utilities.parseBoolean(abp.setting.get("App.General.Limo.SeparateDateAndTime"));
            vm.sendEmailToContactPersonOnTripCreation = utilities.parseBoolean(abp.setting.get("App.General.Limo.SendEmailToContactPersonOnTripCreation"));
            vm.dontRecalculateChargesOnTripFinish = utilities.parseBoolean(abp.setting.get("App.General.DontRecalculateChargesOnTripFinish"));
            vm.showDispatch = false;
            vm.isDispatched = false;
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };
            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: [],
                //status: options.limousineStatus,
                startDate: null,
                vehicleOwnership: [],
                //vehicleOwnership: options.vehicleOwnership,
                vehicleType: [],
                //vehicleType: options.vehicleType,
                endDate: null,
                customerId: null,
                InvoiceToId: null,
                agreementCategory: 2,
                plateNo: '',
                locationId: [],
                //locationId: options.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.showDispatchButton = function () {
                vm.showDispatch = vm.dispatchPermission && vm.locationPermission(vm.limo) && (vm.limo.tripStatus == 1 || vm.limo.tripStatus == 8)
            };
            vm.dispatchTrip = function () {
                openDispatchTripModal(vm.limo.id);
            };
            function openDispatchTripModal(tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/dispatchTripModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.dispatchTripModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tripId: function () {
                            return tripId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.limo.tripStatus = 2;
                    vm.isDispatched = true;
                    vm.showDispatchButton();
                });
            }

            vm.permissions = {
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                customerWebApp: abp.auth.hasPermission('Pages.Tenant.Limousine.CustomerWebApp'),
            };

            vm.getTripStatus = function (status) {
                if (status == 1)
                    return app.localize("New");
                if (status == 2)
                    return app.localize("Dispatched");
                if (status == 3)
                    return app.localize("Started");
                if (status == 4)
                    return app.localize("Finished");
                if (status == 5)
                    return app.localize("Canceled");
                if (status == 6)
                    return app.localize("NoShow");
                if (status == 7)
                    return app.localize("DriverAccepted");
                return '';
            };

            vm.getTaxCategory = function (id) {
                if (id == 1) {
                    return "Standard";
                }
                else if (id == 2) {
                    return "Tax Exempted";
                }
                else if (id == 3) {
                    return "Zero Rated";
                }
                else {
                    return " ";
                }
            }
            vm.trustSrc = function (src) {
                if (src) return $sce.trustAsResourceUrl(src);
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                }
                else {
                    return "";
                }
            };
            vm.cancel = function () {
                if (vm.isDispatched)
                    $uibModalInstance.close();
                else
                    $uibModalInstance.dismiss();
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            var getLocationDetail = function (locationObj) {
                return locationObj.detail ? locationObj.detail : locationObj.title;
            }

            vm.openMapUrl = function () {
                var url = null;

                if (vm.limo.pickupLocation && vm.limo.dropOffLocation)
                    url = "https://www.google.com/maps/dir/?api=1&origin=" + getLocationDetail(vm.limo.pickupLocation) + '&destination=' + getLocationDetail(vm.limo.dropOffLocation);
                else if (vm.limo.pickupLocation || vm.limo.dropOffLocation) {
                    var location = vm.limo.pickupLocation ? vm.limo.pickupLocation : vm.limo.dropOffLocation;
                    url = url = "https://maps.google.com/?q=" + getLocationDetail(location);
                }

                if (url)
                    window.open(url);

            };



            vm.viewCharges = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/changeChargesModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.changeChargesModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                trip: angular.copy(vm.limo),
                                viewMode: true
                            };
                        }
                    }
                });
            };

            function openViewLimoInvoiceModal(invoiceId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/viewLimoModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditLimoModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                });
            }

            vm.viewLimoInvoice = function (invoiceId) {
                openViewLimoInvoiceModal(invoiceId, null);
            };

            vm.getChecklist = function () {
                var checklistStatus = [];

                for (var i = 0; i < vm.checklist.length; i++) {
                    var data = { name: vm.checklist[i].name, tickedOnCheckList: isTickedOnCheckListItem(vm.checklist[i]) };
                    checklistStatus.push(data);
                }
                vm.checkListData = checklistStatus;
            };

            function isTickedOnCheckListItem(checklistItem) {
                if (vm.limo != null) {
                    if (vm.limo.safetyCheck != null) {
                        var found = $filter("filter")(vm.limo.safetyCheck.safetyCheckList, { name: checklistItem.name }, true);
                        if (found.length > 0) {
                            return true;
                        }
                    }
                }

                return false;
            };

            function getChecklist() {

                if (vm.isShowTripSafetyCheckList == true) {
                    limoTripSearchService.getCheckList({}).success(function (data) {
                        vm.checklist = data.items;
                        vm.getChecklist();
                    });
                }
            };
            vm.loadContactPersonForEdit = function (companyId) {
                tripService.getContactPersonsByCustomer(companyId).then(function (response) {
                    vm.contactPersons = response.data.items;
                    var contactMap = {};
                    for (var i = 0; i < vm.contactPersons.length; i++) {
                        contactMap[vm.contactPersons[i].id] = vm.contactPersons[i];
                    }
                    if (Array.isArray(vm.contactPersonName)) {
                        vm.contactPersonName = vm.contactPersonName
                            .map(contactId => contactMap[contactId] || null)  // Map contactId to contact object
                            .filter(contact => contact !== null);  // Remove null values
                    }
                });
            };
            function init() {
                vm.loading = true;
                if (vm.contactId && vm.permissions.customerWebApp) {
                    directoryService.getContactInfo({
                        id: vm.contactId
                    }).success(function (result) {
                        vm.contact = result;
                    }).finally(function () {
                        if (vm.contact) {
                            if (vm.contact.contactType == 2 && vm.contact.contactCategory == 2) //if customer & company
                                vm.isCustomerLogin = true;
                        }
                    });
                }

                //getTripTypes();
                limoTripSearchService.getTripForView({ id: tripId }).success(function (data) {
                    vm.limo = data;
                    vm.documents = vm.limo.documents;
                    if (vm.sendEmailToContactPersonOnTripCreation) {
                        vm.loadContactPersonForEdit(vm.limo.customerId);
                        if (vm.limo.emailToContactPerson) {
                            vm.contactPersonName = angular.copy(vm.limo.emailToContactPerson);
                            vm.contactPersonName = angular.fromJson(vm.contactPersonName);

                        }
                        else {
                            vm.contactPersonName = "";
                        }
                    }
                    if (vm.isLimoDiscountEnabled) {
                        if (vm.limo.tripCharges && vm.limo.tripCharges.length > 0) {

                            var totalCharges = 0;
                            var totalDiscount = 0;
                            var totalTax = 0;

                            angular.forEach(vm.limo.tripCharges, function (charge) {

                                var amount = parseFloat(charge.charges) || 0;
                                var tax = parseFloat(charge.tax) || 0;

                                if (charge.chargesTypeId == 22) {
                                    // Discount hamesha negative honi chahiye, chahe DB me kaise bhi stored ho
                                    amount = -Math.abs(amount);
                                    tax = -Math.abs(tax);
                                    charge.charges = amount;
                                    charge.tax = tax;

                                    totalDiscount += amount;
                                    totalTax += tax;

                                    if (charge.chargesType) {
                                        charge.chargesType.name = '(' + charge.chargesType.name + ')';
                                    }
                                }
                                else {
                                    totalCharges += amount;
                                    totalTax += tax;
                                }
                            });

                            vm.limo.charges = totalCharges + totalDiscount;
                            vm.limo.discount = totalDiscount;
                            vm.limo.chargesWithDiscount = totalCharges;
                            vm.limo.tax = totalTax;
                        }
                    }
                    if (vm.separateDateAndTime) {
                        if (vm.limo.pickupDateTime) {
                            const pickupDateObj = moment(vm.limo.pickupDateTime, 'YYYY-MM-DD HH:mm:ss');
                            vm.limo.pickupDate = pickupDateObj;
                            if (vm.limo.tripStatus == 10) {
                                vm.limo.pickupTime = '--:--';
                            }
                            else {
                                vm.limo.pickupTime = pickupDateObj;
                            }
                        }

                        if (vm.limo.dropOffDateTime) {
                            const dropOffDateObj = moment(vm.limo.dropOffDateTime, 'YYYY-MM-DD HH:mm:ss');
                            vm.limo.dropOffDate = dropOffDateObj;
                            if (vm.limo.tripStatus == 10) {
                                vm.limo.dropOffTime = '--:--';
                            }
                            else {
                                vm.limo.dropOffTime = dropOffDateObj;  // Format the time part as 'HH:mm'
                            }

                        }
                    }
                    if (vm.isShowTripSafetyCheckList) {
                        getChecklist();
                    }
                    vm.showDispatchButton();
                    //if (vm.limo.dropOffLocation != null && vm.limo.dropOffLocation.webID)
                    //    drawMap();
                    //else
                    //    drawLocation(vm.limo.pickupLocation);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
