// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:250623-252118
appModule.controller('tenant.views.crs.limousine.trips.index', [
        '$scope', 'abp.services.app.tenantSettings', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.vehicle', 'abp.services.app.limoTrip', 'appSession', 'utilities', 'abp.services.app.commonLookup', 'FileUploader', 'abp.services.app.invoice',
        "abp.services.app.limoTripSearch", "abp.services.app.limoTripExport",
        function ($scope, tenantSettingsService, $uibModal, uiGridConstants, directoryService, vehicleService, limoTripsService, appSession, utilities, commonLookupService, fileUploader, invoiceService, limoTripSearchService, limoTripExportService) {

            var vm = this;
            vm.getGridSettings = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.showAdditionalFilters = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.locale.format = 'YYYY-MM-DD HH:mm';
            vm.dateRangeOptions.timePicker = true;
            vm.dateRangeOptions.timePicker24Hour = true;
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.customers = null;
            vm.contactId = appSession.user.contactId;
            vm.contact = null;
            vm.isCustomerLogin = false;
            vm.limoPickUpAddress = utilities.parseBoolean(abp.setting.get("App.General.Limo.PickUpAddress"));
            vm.limoDropOffAddress = utilities.parseBoolean(abp.setting.get("App.General.Limo.DropOffAddress"));
            vm.limoCustomField = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField"));
            vm.limoCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField1"));
            vm.allowTripDispatchSubstatus = utilities.parseBoolean(abp.setting.get("App.General.Limo.AllowTripDispatchSubstatus"));
            vm.trip_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.customField1Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.customField2Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.customField3Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
            vm.isAssigningStepForLimoTripBeforeDispatch = utilities.parseBoolean(abp.setting.get("App.General.Limo.AssigningStepForLimoTripBeforeDispatch"));
            //vm.isTentativeStepForLimoTripBeforeDispatch = utilities.parseBoolean(abp.setting.get("App.General.Limo.TentativeStepForLimoTripBeforeDispatch"));
            vm.isLimoDriverNotesEnabled = abp.features.isEnabled('CRS.LimoDriverNotes');
            vm.holidayTaxiIntegration = abp.features.isEnabled('CRS.Limousine.HolidayTaxiIntegration');
            vm.isOutOfCityPickUpLocation = utilities.parseBoolean(abp.setting.get("App.General.Limo.IsOutOfCityPickUpLocation"));
            vm.isOutOfCityDropOffLocation = utilities.parseBoolean(abp.setting.get("App.General.Limo.IsOutOfCityDropOffLocation"));
            vm.locations = [];
            vm.tripTypes = [];
            //eastcoast
            vm.importPermission = abp.auth.hasPermission('Pages.Tenant.Limousine.Import')/* && appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';*/
            vm.isPaymentProcessorFeatureEnabled = abp.features.isEnabled("Core.PaymentProcessor");
            vm.separateDateAndTime = utilities.parseBoolean(abp.setting.get("App.General.Limo.SeparateDateAndTime"));

            vm.tripsInvoiced = [{ id: 1, name: 'Invoiced' }, { id: 2, name: 'UnInvoiced' }]
            vm.prepaymentStatuses = [{ id: 1, name: app.localize("Paid") }, { id: 0, name: app.localize("Unpaid") }];

            vm.date1 = moment().utc();
            vm.date2 = moment().endOf('day').utc();
            vm.filters = {
                enableDateRange: true,
                tripNo: null,
                vehicleId: null,
                customerId: null,
                driverId: null,
                supplierId: null,
                fromDate: moment().startOf('day').utc(),
                toDate: moment().endOf('day').utc(),
                locationId: null,
                tripTypeId: null,
                customField1: null,
                limoCustomField: null,
                limoCustomField1: null,
                tripsWithWaitingTime: false,
                waitingMinutesThreshold: 60,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                tripStatusesArray: [],
                tripSubStatus: null,
                tripsWithZeroTime: false
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.applyChange = function (row) {
                if (row.selected)
                    vm.filters.tripStatusesArray.push(row);
                else {
                    var index = vm.filters.tripStatusesArray.indexOf(row);
                    vm.filters.tripStatusesArray.splice(index, 1);
                }
                vm.getTrips();
            };
            //vm.applySubStatusChange = function (row) {
            //    if (row.selected)
            //        vm.filters.tripSubStatusesArray.push(row);
            //    else {
            //        var index = vm.filters.tripSubStatusesArray.indexOf(row);
            //        vm.filters.tripSubStatusesArray.splice(index, 1);
            //    }
            //    vm.getTrips();
            //};
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Addnew'),
                tentative: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Tentative'),
                view: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips'),
                edit: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Edit'),
                editFinishTrip: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.EditFinishTrip'),
                editInvoicedTrip: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.EditInvoicedTrip'),
                dispatch: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Dispatch'),
                start: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Start'),
                finish: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Finish'),
                cancel: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Cancel'),
                viewTripLog: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ViewTripLogs'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Delete'),
                customerWebApp: abp.auth.hasPermission('Pages.Tenant.Limousine.CustomerWebApp'),
                changeCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ChangeCharges'),
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ViewOtherBranchTrips'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.AllActionsOnOtherBranchTrips'),
                canMakePayment: abp.auth.hasPermission('Pages.Tenant.Limousine.Process_CreditCard.Payment')
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.isPrepaymentRequired = function (row) {
                if (row.isPrepaymentRequired && !row.isPaid)
                    return false;
                return true;
            };

            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };

            function getTariffGroups() {
                //vm.loading = true;
                commonLookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };
            function getStatuses() {
                vm.tripStatus = [
                    { id: 1, name: app.localize("New") },
                    { id: 2, name: app.localize("Dispatched") },
                    //{ id: 7, name: app.localize("DriverAccepted") },
                    //{ id: 8, name: app.localize("DriverRejected") },
                    { id: 3, name: app.localize("Started") },
                    { id: 4, name: app.localize("Finished") },
                    { id: 5, name: app.localize("Canceled") },
                    { id: 6, name: app.localize("NoShow") },

                ];
                if (parseInt(abp.setting.get("App.General.Trip_DriverMobileAppAcceptOrReject")) == 1)
                    vm.tripStatus.push({ id: 7, name: app.localize("DriverAccepted") });
                else if (parseInt(abp.setting.get("App.General.Trip_DriverMobileAppAcceptOrReject")) == 2)
                    vm.tripStatus.push({ id: 8, name: app.localize("DriverRejected") });
                if (vm.isAssigningStepForLimoTripBeforeDispatch)
                    vm.tripStatus.push({ id: 9, name: app.localize("Assigned") });
                //if (vm.isTentativeStepForLimoTripBeforeDispatch)
                //    vm.tripStatus.push({ id: 10, name: app.localize("Tentative") });
                if (vm.separateDateAndTime)
                    vm.tripStatus.push({ id: 10, name: app.localize("Tentative") });


            };

            function getSubStatuses() {
                vm.tripSubStatus = [
                    { id: 1, name: app.localize("DriverReady") },
                    { id: 2, name: app.localize("DriverMovedForPickup") },
                ]
            };

            vm.changeVehicle = (entity) => {
                openUpdateVehicleModal(entity);
            }

            vm.getTripStatus = function (status) {
                if (status == '')
                    return '';
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
                if (status == 8)
                    return app.localize("DriverRejected");
                if (status == 9)
                    return app.localize("Assigned");
                if (status == 10)
                    return app.localize("Tentative");
            };

            vm.getTripSubStatus = function (status) {

                if (status == 1)
                    return app.localize("DriverReady");
                else if (status == 2)
                    return app.localize("DriverMovedForPickup");
                else
                    return '';
            };

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {

                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    //abp.message.warn(app.localize('ImportingFile'));
                    vm.importing = false;
                    openUploadTripModal(fileName);
                    // vm.uploader.queue = [];
                    //    limoTripsService.importFromExcel(fileName)
                    //.success(function (result) {
                    //    abp.message.success(app.localize('ImportedSuccessfully'));
                    //    init();
                    //})
                    //.error(function (response) {
                    //    abp.message.error(response.error);
                    //})
                    //.finally(function () {
                    //    vm.importing = false;
                    //});

                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {

                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };


            function getTripTypes() {
                commonLookupService.getTripTypes({}).success(function (data) {
                    vm.tripTypes = data.items;
                });
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchVehiclesWithTariffGroup = function ($select, tariffGroupId) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, tariffGroupId: tariffGroupId }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({
                    keyword: $select.search, contactType: 2, activeOnly: true
                }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.searchDriverForLimoGrid({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };


            vm.searchSuppliers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };




            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                        vm.filters.customerId = customer.id;
                        vm.getTrips();
                    }
                });
            };
            vm.searchDriverPopoup = function () {
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
                }).result.then(function (driver) {
                    if (driver != null) {
                        vm.filters.driver = driver;
                        vm.filters.driverId = driver.id;
                        vm.getTrips();
                    }
                });
            };


            vm.searchSupplierPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.supplier = supplier;
                        vm.filters.supplierId = supplier.id;
                        vm.getTrips();
                    }
                });
            };


            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/limousine/trips/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.searchVehiclePopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                selectable: true
                            };
                        }
                    }
                }).result.then(function (vehicle) {
                    if (vehicle != null) {
                        vm.filters.vehicle = vehicle;
                        vm.filters.vehicleId = vehicle.id;
                        vm.getTrips();
                    }
                });
            };
            vm.clearCustomer = function () {
                vm.filters.customerId = null;
                vm.filters.customer = null;
            };
            vm.clearDriver = function () {
                vm.filters.driverId = null;
                vm.filters.driver = null;
            };
            vm.clearVehicle = function () {
                vm.filters.vehicleId = null;
                vm.filters.vehicle = null;
            };

            vm.clearSupplier = function () {
                vm.filters.supplierId = null;
                vm.filters.supplier = null;
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
            vm.getlocalDateTimeNoYear = function (date) {
                if (vm.separateDateAndTime) {
                    if (date != null) {
                        var localTime = moment.utc(date);
                        var localDateTime = localTime.local(); 
                        return localDateTime.format('DD-MM HH:mm');
                    } else {
                        return "";
                    }
                } else {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('DD-MM HH:mm');
                    }
                    else {
                        return "";
                    }
                }
            };
            vm.getTrips = function () {
                vm.loading = true;

                vm.filters.tripStatus = [];
                //vm.filters.tripSubStatus = [];
                if (vm.filters.tripStatusesArray.length > 0) {
                    angular.forEach(vm.filters.tripStatusesArray, function (value, key) {
                        vm.filters.tripStatus.push(value.id);
                    });
                }
                //if (vm.filters.tripSubStatusesArray.length > 0) {
                //    angular.forEach(vm.filters.tripSubStatusesArray, function (value, key) {
                //        vm.filters.tripSubStatus.push(value.id);
                //    });
                //}

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //vm.filters.fromDate = moment(vm.filters.fromDate).startOf('minute');
                //vm.filters.toDate = moment(vm.filters.toDate).endOf('minute');


                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}

                limoTripSearchService.getTrips(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

                    vm.printAll(null);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.updateChargesPermission = function (trip) {
                if (trip.customer.contactType == 2 && trip.customer.contactCategory == 2)
                    return !trip.invoiceId && (trip.tripStatus == 4 || trip.tripStatus == 6);
                else if (trip.customer.contactType == 2 && trip.customer.contactCategory == 1)
                    return trip.tripStatus == 4 || trip.tripStatus == 6;
                return false;
            };

            vm.ids = [];
            vm.printAll = function (id) {
                vm.ids = [];
                if (id) {
                    vm.ids.push(id);
                }
                else {
                    angular.forEach(vm.gridOptions.data, function (trip) {
                        vm.ids.push(trip.id);
                    });
                    vm.printIds = {
                        ids: vm.ids,
                    };
                }
            };




            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {

                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 55,
                        field: 'actions',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i>  <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view " ng-click="grid.appScope.viewTrip(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewTrip(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus != 4 ) && row.entity.invoiceId == null" ng-click="grid.appScope.editTrip(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.editFinishTrip &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 4) && row.entity.invoiceId == null" ng-click="grid.appScope.editTrip(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.editInvoicedTrip &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 4) && row.entity.invoiceId != null" ng-click="grid.appScope.editTrip(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.TripPrintModal(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" ng-href="/Report#/tenant/printModalTrip/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.tentative && grid.appScope.locationPermission(row.entity) && row.entity.tripStatus == 1" ng-click="grid.appScope.assigningTrip(row.entity)">' + app.localize('Tentative') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.dispatch && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 1 || row.entity.tripStatus == 8 || row.entity.tripStatus == 10) && grid.appScope.isAssigningStepForLimoTripBeforeDispatch" ng-click="grid.appScope.assigningTrip(row.entity)">' + app.localize('Assign') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.dispatch && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 8 || row.entity.tripStatus == 9 || row.entity.tripStatus == 10 || row.entity.tripStatus == 1) " ng-click="grid.appScope.dispatchTrip(row.entity)">' + app.localize('Dispatch') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.start && grid.appScope.isPrepaymentRequired(row.entity) && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 2 || row.entity.tripStatus == 7) && grid.appScope.allowTripDispatchSubstatus && row.entity.tripSubStatus == 2" ng-click="grid.appScope.startTrip(row.entity)">' + app.localize('Start') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.start && grid.appScope.isPrepaymentRequired(row.entity) && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 2 || row.entity.tripStatus == 7) && !(grid.appScope.allowTripDispatchSubstatus)" ng-click="grid.appScope.startTrip(row.entity)">' + app.localize('Start') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.start && grid.appScope.isPrepaymentRequired(row.entity) && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 2 || row.entity.tripStatus == 7) && row.entity.tripSubStatus != 1 && row.entity.tripSubStatus != 2 && grid.appScope.allowTripDispatchSubstatus" ng-click="grid.appScope.driverReady(row.entity)">' + app.localize('DriverReady') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.start && grid.appScope.isPrepaymentRequired(row.entity) && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 2 || row.entity.tripStatus == 7) && row.entity.tripSubStatus == 1  && grid.appScope.allowTripDispatchSubstatus" ng-click="grid.appScope.driverMoved(row.entity)">' + app.localize('DriverMovedForPickup') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.finish && row.entity.tripStatus == 3 && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.finishTrip(row.entity)">' + app.localize('Finish') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.tripStatus == 2 && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.noShowTrip(row.entity)">' + app.localize('NoShow') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.cancel && row.entity.tripStatus != 4 && row.entity.tripStatus != 5 && row.entity.tripStatus != 6 &&row.entity.tripStatus != 3 && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.cancelTrip(row.entity)">' + app.localize('Cancel') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 1 || row.entity.tripStatus == 8 || row.entity.tripStatus == 10) " ng-click="grid.appScope.deleteTrip(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.viewTripLog && grid.appScope.locationPermission(row.entity) && !grid.appScope.isCustomerLogin" ng-click="grid.appScope.logTrip(row.entity)">' + app.localize('Log') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.changeCharges && !row.entity.invoiceId && ( row.entity.tripStatus == 4 || row.entity.tripStatus == 6)" ng-click="grid.appScope.updateCharges(row.entity)">' + app.localize('UpdateCharges') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.changeCharges && grid.appScope.updateChargesPermission(row.entity) && grid.appScope.locationPermission(row.entity) && row.entity.invoiceId==null" ng-click="grid.appScope.updateCharges(row.entity)">' + app.localize('UpdateCharges') + '</a></li>' +
                            //'      <li><a ng-if="row.entity.invoiceId==null && row.entity.tripStatus==4" ng-click="grid.appScope.generateInvoice(row.entity)">' + app.localize('GenerateInvoice') + '</a></li>' +

                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('TripNo'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('TripNo') + '</div>' +
                        //    '</div>',
                        type: 'number',
                        width: 100,
                        field: 'tripNo',

                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                            '<span>{{row.entity.tripNo}}</span>' +
                            '&nbsp;' +
                            '<span ng-if="row.entity.isCorporateUser" class="label label-success">' + app.localize('CP') + '</span>' +
                            '</div>'
                    },

                    {
                        name: app.localize('TripType'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('TripType') + '</div>' +
                        //    '</div>',
                        width: 80,
                        field: 'tripType.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.tripType.name}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Customer'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Customer') + '</div>' +
                        //    '</div>',
                        width: 150,
                        field: 'customer.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.customer.name}}</div>' +
                            '</div>'
                    },
                    //{
                    //    headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('DateTime') + '</div>' +
                    //        '</div>',
                    //    width: 90,
                    //    field: 'date',
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getlocalDateTime(row.entity.pickupDateTime)}}</div>' +
                    //        '</div>'
                    //},


                    {
                        name: app.localize('Guest'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Guest') + '</div>' +
                        //    '</div>',
                        field: 'guestName',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.guestName}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('PickUp'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('PickUp') + '</div>' +
                        //    '</div>',
                        width: 100,
                        field: 'pickupDateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getlocalDateTimeNoYear(row.entity.pickupDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DropOff'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('DropOff') + '</div>' +
                        //    '</div>',
                        width: 100,
                        field: 'dropOffDateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getlocalDateTimeNoYear(row.entity.dropOffDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('From'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('From') + '</div>' +
                        //    '</div>',
                        width: 200,
                        field: 'pickupLocation.title',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.pickupLocation.title}} ' +
                            '</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('To'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('To') + '</div>' +
                        //    '</div>',
                        width: 200,
                        field: 'dropOffLocation.title',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.dropOffLocation.title}} ' +
                            '</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TripCustomField1'),
                        width: 150,
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('TripCustomField1') + '</div>' +
                        //    '</div>',
                        field: 'customField1',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.customField1}}</div>' +
                            '</div>',
                        visible: vm.customField1Enabled
                    },
                    {
                        name: app.localize('TripCustomField2'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('TripCustomField2') + '</div>' +
                        //    '</div>',
                        field: 'customField2',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.customField2}}</div>' +
                            '</div>',
                        visible: vm.customField2Enabled
                    },
                    {
                        name: app.localize('VehicleType'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('VehicleType') + '</div>' +
                        //    '</div>',
                        field: 'tariffGroup.title',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.tariffGroup.title}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Vehicle') + '</div>' +
                        //    '</div>',
                        width: 100,
                        field: 'vehicle.plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="text-align: center;" ng-click="grid.appScope.changeVehicle(row.entity)">' +
                            '{{row.entity.vehicle.plateNo || ".........."}}' +
                            '</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Driver'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Driver') + '</div>' +
                        //    '</div>',
                        width: 100,
                        field: 'driver.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.driver.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Notes'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Notes') + '</div>' +
                        //    '</div>',
                        field: 'notes',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.notes}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Reference No'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Reference No') + '</div>' +
                        //    '</div>',
                        field: 'manualTripNo',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.manualTripNo}}</div>' +
                            '</div>',
                        visible: vm.manualTripNoEnabled
                    },

                    {

                        name: app.localize('Status'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Status') + '</div>' +
                        //    '</div>',
                        field: 'tripStatus',
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            //'<div class=\"ui-grid-cell-contents\">{{grid.appScope.getTripStatus(row.entity.tripStatus)}}</div>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color:#44B6AE;margin-left:25px;padding:2;" ng-show="row.entity.tripStatus==1 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color:#44B6AE;padding:2;" ng-show="row.entity.tripStatus==1 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.tripStatus==1 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#5C9BD1;margin-left:25px;" ng-show="row.entity.tripStatus==2 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#5C9BD1" ng-show="row.entity.tripStatus==2 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color:#21201d;padding:2;" ng-show="row.entity.tripStatus==2 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="badge badge-inverse" style="font-size:10px;text-align: center;background-color:#64CF00" ng-show="row.entity.tripStatus==2 && row.entity.tripSubStatus == 1 && grid.appScope.allowTripDispatchSubstatus">' + 'R' + '</span>' +
                            ' <span class="badge badge-inverse" style="font-size:10px;text-align: center;background-color:#001FFF" ng-show="row.entity.tripStatus==2 && row.entity.tripSubStatus == 2 && grid.appScope.allowTripDispatchSubstatus">' + 'M' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#26C281;margin-left:25px;" ng-show="row.entity.tripStatus==3 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#26C281" ng-show="row.entity.tripStatus==3 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.tripStatus==3 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color:#F4D03F;padding:2;margin-left:25px;" ng-show="row.entity.tripStatus==4 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color:#F4D03F;padding:2;" ng-show="row.entity.tripStatus==4 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.tripStatus==4 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#E43A45;margin-left:25px;" ng-show="row.entity.tripStatus==5 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#E43A45" ng-show="row.entity.tripStatus==5 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.tripStatus==5 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#ACB5C3;margin-left:25px;" ng-show="row.entity.tripStatus==6 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#ACB5C3" ng-show="row.entity.tripStatus==6 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.tripStatus==6 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#907fca;margin-left:25px;" ng-show="row.entity.tripStatus==7 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#907fca" ng-show="row.entity.tripStatus==7 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.tripStatus==7 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#777;margin-left:25px;" ng-show="row.entity.tripStatus==8 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus,row.entity.invoiceId)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#777" ng-show="row.entity.tripStatus==8 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus,row.entity.invoiceId)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.tripStatus==8 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#79d15c;margin-left:25px;" ng-show="row.entity.tripStatus==9 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#79d15c" ng-show="row.entity.tripStatus==9 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.tripStatus==9 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#16889C; margin-left:25px;" ng-show="row.entity.tripStatus==10 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;padding:2;background-color:#16889C;" ng-show="row.entity.tripStatus==10 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.tripStatus==10 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-danger" style=" font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.isPrepaymentRequired && !row.entity.isPaid">' + app.localize('Unpaid') + '</span>' +
                            ' <span class="label label-success" style="font-size:10px;text-align: center;background-color#21201d;padding:2;" ng-show="row.entity.isPrepaymentRequired && row.entity.isPaid">' + app.localize('Paid') + '</span>' +



                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Amount') + '</div>' +
                        //    '</div>',
                        type: 'number',
                        width: 80,
                        field: 'charges',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"  >{{grid.appScope.CurrencyFormate(row.entity.charges)}}</div>' +
                            '</div>',
                        visible: vm.permissions.canViewCharges
                    },
                    {
                        name: app.localize('DriverNotes'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Notes') + '</div>' +
                        //    '</div>',
                        field: 'driverNotes',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.driverNotes}}</div>' +
                            '</div>',
                        visible: vm.isLimoDriverNotesEnabled
                    },
                    {
                        name: app.localize('FromAddress'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('From') + '</div>' +
                        //    '</div>',
                        width: 200,
                        field: 'fromAddress',
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '  <div class="ui-grid-cell-contents" ' +
                            '       style="color: {{row.entity.isOutOfCityPickUpLocation ? \'red\' : \'inherit\'}};">' +
                            '    {{row.entity.pickUpAddress}} ' +
                            '  </div>' +
                            '</div>',
                        visible: vm.limoPickUpAddress
                    },
                    {
                        name: app.localize('ToAddress'),
                        //headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('From') + '</div>' +
                        //    '</div>',
                        width: 200,
                        field: 'toAddress',
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '  <div class="ui-grid-cell-contents" ' +
                            '       style="color: {{row.entity.isOutOfCityDropOffLocation ? \'red\' : \'inherit\'}};">' +
                            '    {{row.entity.dropOffAddress}} ' +
                            '  </div>' +
                            '</div>',
                        visible: vm.limoDropAddress
                    },
                    //{
                    //  name: app.localize('Amount'),
                    //  field: 'tripAmount',
                    //    cellTemplate:
                    //  '<div class=\"ui-grid-cell\">' +
                    // ' <span  style="margin:4px">' + '{{row.entity.charges}}' + '</span>' +
                    //'</div>'
                    // }
                    //      if (vm.options.selectable) {
                    //        vm.gridOptions.columnDefs.splice(0, 0, {
                    //        name: app.localize('Select'),
                    //        width: 100,
                    //        cellTemplate:
                    //            '<div class=\"ui-grid-cell-contents\">' +
                    //            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                    //            '    <button class="btn btn-xs btn-primary blue" aria-haspopup="true" ng-disabled="row.entity.statusIdInPeriod != \'IDL\'" ng-click="grid.appScope.vehicleSelected(row.entity)" ><i class="fa fa-check"></i> ' + app.localize('Select') + ' </button>' +
                    //            '  </div>' +
                    //            '</div>'
                    //    });
                    //}
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getTrips();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTrips();
                    });
                },
                data: []
            };

            vm.changeColumnOrdering = function (newOrder) {
                vm.notInNewOrder = vm.gridOptions.columnDefs.filter(gridObj =>
                    !newOrder.some(newOrder => newOrder.field === gridObj.field)
                );

                var existingColumnsMap = {};
                vm.gridOptions.columnDefs.forEach(function (columnDef) {
                    existingColumnsMap[columnDef.field] = columnDef;
                });

                // Update the order for columns present in newOrder
                vm.gridOptions.columnDefs = newOrder.map(function (col) {
                    var existingColumn = existingColumnsMap[col.field];
                    if (existingColumn) {
                        switch (existingColumn.field) {
                            case 'charges':
                                existingColumn.visible = (!col.visible && vm.permissions.canViewCharges) ? true : false;
                                break;
                            case 'manualTripNo':
                                existingColumn.visible = (!col.visible && vm.manualTripNoEnabled) ? true : false;
                                break;
                            case 'customField2':
                                existingColumn.visible = (!col.visible && vm.customField2Enabled) ? true : false;
                                break;
                            case 'customField1':
                                existingColumn.visible = (!col.visible && vm.customField1Enabled) ? true : false;
                                break;
                            default:
                                existingColumn.visible = !col.visible;
                                break;

                        }
                        // Update both order and visibility
                        //existingColumn.visible = !col.visible; // or set it to col.visible based on your logic
                        return existingColumn;
                    }

                });
                vm.gridOptions.columnDefs = vm.gridOptions.columnDefs.filter(function (item) {
                    return item !== undefined;
                });
                if (vm.notInNewOrder) {
                    vm.notInNewOrder.forEach((obj) => {
                        vm.gridOptions.columnDefs.push(obj);
                    });
                }



                //if (newOrder && newOrder.length === vm.gridOptions.columnDefs.length) {

                //    vm.gridOptions.columnDefs = newOrder.map(function (col) {
                //        var existingColumn = vm.gridOptions.columnDefs.find(function (columnDef) {
                //            return columnDef.field === col.field;
                //        });
                //        if (existingColumn) {
                //            // Update both order and visibility
                //            existingColumn.visible = !col.visible;
                //            return existingColumn;
                //        } else {
                //            return col; // Handle the case when a column is not found in the existing columns
                //        }
                //    });

                //} else {
                //    console.error('Invalid column order array');
                //}
            };

            vm.processPayment = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/processPaymentModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.processPaymentModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                contactId: vm.contactId,
                                isCustomerLogin: vm.isCustomerLogin
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                }, function () {
                    vm.getTrips();
                });
            };

            vm.TripPrintModal = function (filters) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return filters;
                        }
                    }
                });
            };

            //
            //if (vm.permissions.canViewCharges) {
            //    vm.gridOptions.columnDefs.splice(vm.gridOptions.columnDefs.length, 0, {
            //        name: app.localize('Amount'),
            //        width: 100,
            //        cellTemplate:
            //      '<div class=\"ui-grid-cell\">' +
            //     ' <span  style="margin:8px">' + '{{row.entity.charges}}' + '</span>' +
            //    '</div>'
            //    });
            //}

            vm.exportToExcel = function () {

                vm.loading = true;
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                limoTripExportService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditTripModal(tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tripId: function () {
                            return tripId;
                        },
                        options: function () {
                            return {
                                contact: vm.contact,
                                isCustomerLogin: vm.isCustomerLogin
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTrips();
                });
            }

            function openUpdateVehicleModal(trip) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/updateVehicleModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.updateVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        trip: function () {
                            return trip;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result.tripId && result.vehicle) {
                        trip.vehicle = result.vehicle;
                        trip.vehicleId = result.vehicle.id;
                    }
                });
            }

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
                    vm.getTrips();
                });
            }

            function openAssigningTripModal(tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/assigningTripModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.assigningTripModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tripId: function () {
                            return tripId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTrips();
                });
            }

            function openViewTripModal(tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/viewTripModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.viewTripModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tripId: function () {
                            return tripId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTrips();
                });

            }

            function openStartTripModal(tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/startTripModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.startTripModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tripId: function () {
                            return tripId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTrips();
                });
            }

            function openFinishTripModal(tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/finishTripModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.finishTripModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tripId: function () {
                            return tripId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTrips();
                });
            }

            function openLogTripModal(trip) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/logTripModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.logTripModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                tripId: trip.id,
                                tripNo: trip.tripNo
                            };
                        }
                    }
                });

            }

            function openUpdateChargesModal(trip) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/updateChargesModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.updateChargesModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                tripId: trip.id
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.getTrips();
                });
            };

            function openUploadTripModal(fileName) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/uploadTripModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.uploadTripModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },

                    }
                });
                modalInstance.result.then(function () {

                    vm.importing = false;
                });
            };

            vm.createTrip = function () {
                openCreateOrEditTripModal(null);
            };

            vm.dispatchTrip = function (trip) {
                openDispatchTripModal(trip.id);
            };
            vm.assigningTrip = function (trip) {
                openAssigningTripModal(trip.id);
            };
            vm.viewTrip = function (trip) {
                openViewTripModal(trip.id);
            };
            vm.editTrip = function (trip) {
                openCreateOrEditTripModal(trip.id);
            };
            vm.startTrip = function (trip) {
                openStartTripModal(trip.id);
            };
            vm.finishTrip = function (trip) {
                openFinishTripModal(trip.id);
            };
            vm.logTrip = function (trip) {
                openLogTripModal(trip);
            };

            vm.updateCharges = function (trip) {
                openUpdateChargesModal(trip);
            };
            vm.cancelTrip = function (trip) {
                abp.message.confirm(
                    app.localize('CancelWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            limoTripsService.cancelTrip({
                                id: trip.id
                            }).success(function () {
                                vm.getTrips();
                                abp.notify.success(app.localize('SuccessfullyCanceled'));
                            });
                        }
                    }
                );
            };
            vm.noShowTrip = function (trip) {
                abp.message.confirm(
                    app.localize('NoShowWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            limoTripsService.noShowTrip({
                                id: trip.id
                            }).success(function () {
                                vm.getTrips();
                                abp.notify.success(app.localize('SuccessfullyCanceled'));
                            });
                        }
                    }
                );
            };
            vm.driverReady = function (trip) {
                abp.message.confirm(
                    app.localize('DriverReadyMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            limoTripsService.driverReady({
                                id: trip.id
                            }).success(function () {
                                vm.getTrips();
                                abp.notify.success(app.localize('DriverReadySuccess'));
                            });
                        }
                    }
                );
            };
            vm.driverMoved = function (trip) {
                abp.message.confirm(
                    app.localize('DriverMovedMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            limoTripsService.driverMoved({
                                id: trip.id
                            }).success(function () {
                                vm.getTrips();
                                abp.notify.success(app.localize('DriverMovedSuccess'));
                            });
                        }
                    }
                );
            };
            vm.deleteTrip = function (trip) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            limoTripsService.deleteTrip({
                                id: trip.id
                            }).success(function () {
                                vm.getTrips();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.generateInvoice = function (trip1) {
                vm.loading = true;
                var invoicesToGenerate = [];
                trip1.airline = "some";
                trip1.tripType = "Tour";
                //invoicesToGenerate.push(trip1);
                limoTripsService.getTripForEdit({ id: trip1.id }).success(function (data) {
                    invoicesToGenerate.push({
                        id: data.id,
                        tripNo: data.tripNo,
                        customerId: data.customerId,
                        pickupDateTime: data.pickupDateTime,
                        driverId: data.driverId,
                        vehicleId: data.vehicleId,
                        charges: data.charges,
                        taxPercent: data.taxPercent,
                        tax: data.tax,
                        locationId: data.locationId,
                        notes: data.notes,
                        tripCharges: data.tripCharges
                    });
                    invoiceService.generateLimoInvoices({ asOfDate: vm.filters.fromDate, trips: invoicesToGenerate }).success(function (result) {
                        vm.generatedInvoices = result;
                        vm.loading = false;
                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml',
                            controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
                            backdrop: 'static',
                            size: 'xl',
                            resolve: {
                                invoiceId: function () {
                                    return vm.generatedInvoices[0].invoiceId;
                                },
                                voucherSubtypeId: function () {
                                    return null;
                                }
                            }
                        });
                        modalInstance.result.then(function (result) {
                            vm.getTrips();
                        });

                    }).finally(function () {
                        vm.saving = false;
                    });

                })
                //invoiceService.generateLimoInvoices({ asOfDate: vm.filters.fromDate, trips: invoicesToGenerate }).success(function (data) {
                //    vm.generatedInvoices = data;
                //    vm.loading = false;
                //    //var modalInstance = $uibModal.open({
                //    //    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml',
                //    //    controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
                //    //    backdrop: 'static',
                //    //    size: 'xl',
                //    //    resolve: {
                //    //        invoiceId: function () {
                //    //            return vm.generatedInvoices[0].invoiceId;
                //    //        }
                //    //    }
                //    //});
                //}).finally(function () {
                //    vm.saving = false;
                //});
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getTrips();
                    eventOnKeyPress.preventDefault();
                }
            };

            vm.mRefNoEnterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getTrips();
                    eventOnKeyPress.preventDefault();
                }
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
                        vm.loading = false;
                    });
                }
                getTariffGroups();
                getLocations();
                getTripTypes();
                getStatuses();
                getSubStatuses();
                vm.getTrips();
            }

            function getGridSettings() {

                //if (angular.isUndefined(vm.agreementType)) return;
                tenantSettingsService.getGridOptionsAdvanceSetting().success(function (data) {
                    vm.getGridSettings = data;
                    if (vm.getGridSettings)
                        vm.changeColumnOrdering(vm.getGridSettings);
                });
            };
            //vm.changeColumnOrdering(vm.gridSettings);
            getGridSettings();

            init();
        }
    ]);
