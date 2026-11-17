// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:416086-416285
appModule.controller('tenant.views.externalLogin.limoBookings.viewTripModal', [
        '$scope', '$uibModal', '$uibModalInstance', '$sce', 'tripId', 'utilities', 'appSession', 'abp.services.app.externalLimoTripSearch', 'abp.services.app.directory',
        function ($scope, $uibModal, $uibModalInstance, $sce, tripId, utilities, appSession, externalLimoTripSearchService, directoryService) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
        vm.customers = [];
        vm.trip = null;
        vm.isCustomerLogin = false; //
        vm.contactId = appSession.user.contactId;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.trip_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
        vm.trip_EnableCustomField2 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
        vm.trip_EnableCustomField3 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
        vm.trip_CustomField1Type = parseInt(abp.setting.get("App.General.Trip_CustomField1Type"));
        vm.trip_CustomField2Type = abp.setting.get("App.General.Trip_CustomField2Type");
        vm.trip_CustomField3Type = abp.setting.get("App.General.Trip_CustomField3Type");
        vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
        vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
        vm.noOfPersonsEnabled = utilities.parseBoolean(abp.setting.get("App.General.NoOfPersonsEnabled"));
        vm.trackMileage = utilities.parseBoolean(abp.setting.get("App.General.Trip_TrackMileage"));
        vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
        vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.AllActionsOnOtherBranchTrips'),
        vm.dispatchPermission = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Dispatch');
        vm.enableDriverCommision = utilities.parseBoolean(abp.setting.get("App.General.Limo.EnableDriverCommissionForTrips"));
        vm.showDispatch = false;
        vm.isDispatched = false;
        vm.locationPermission = function (row) {
            if (row.locationId) {
                if (!vm.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                    return false;
            }
            return true;
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
                resolve: {
                    options: function () {
                        return {
                            trip: vm.limo,
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
            externalLimoTripSearchService.getTripForView({ id: tripId }).success(function (data) {
                vm.limo = data;
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
