// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:414593-415765
appModule.controller('tenant.views.externalLogin.limoBookings.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.vehicle', 'abp.services.app.externalLimoTrip', 'appSession', 'utilities', 'abp.services.app.commonLookup', 'FileUploader', 'abp.services.app.invoice',
        "abp.services.app.externalLimoTripSearch", "abp.services.app.externalLimoTripExport",
        function ($scope, $uibModal, uiGridConstants, directoryService, vehicleService, externalLimoTripsService, appSession, utilities, commonLookupService, fileUploader, invoiceService, externalLimoTripSearchService, externalLimoTripExportService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.locale.format = vm.dateFormat;
            vm.dateRangeOptions.timePicker = true;
            vm.dateRangeOptions.timePicker24Hour = true;
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.customers = null;
            vm.contactId = appSession.user.contactId;
            vm.contact = null;
            vm.isCustomerLogin = false;
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.customField1Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.customField2Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.customField3Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
            vm.locations = [];
            vm.tripTypes = [];
            //eastcoast
            vm.importPermission = abp.auth.hasPermission('Pages.Tenant.Limousine.Import') && appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.isPaymentProcessorFeatureEnabled = abp.features.isEnabled("Core.PaymentProcessor");

            vm.tripsInvoiced = [{ id: 1, name: 'Invoiced' }, { id: 2, name: 'UnInvoiced' }]
            vm.prepaymentStatuses = [{ id: 1, name: app.localize("Paid") }, { id: 0, name: app.localize("Unpaid") }];

            vm.date1 = moment().utc();
            vm.date2 = moment().endOf('day').utc();
            vm.filters = {
                enableDateRange: false,
                tripNo: null,
                vehicleId: null,
                customerId: null,
                driverId: null,
                supplierId: null,
                fromDate: moment().startOf('day').utc(),
                toDate: moment().endOf('day').utc(),
                locationId: null,
                tripTypeId: null,
                tripsWithWaitingTime: false,
                waitingMinutesThreshold: 60,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                tripStatusesArray: [],
                tripStatusesArray: [{ "id": 1, "name": app.localize("New") }, { "id": 2, "name": app.localize("Dispatched") }, { "id": 2, "name": app.localize("Started") }]
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
            vm.permissions = {
                create: abp.auth.hasPermission('Page.ExternaLogin.LimoBookings.Add'),
                view: abp.auth.hasPermission('Page.ExternaLogin.LimoBookings'),
                edit: abp.auth.hasPermission('Page.ExternaLogin.LimoBookings.Edit'),
                //editFinishTrip: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.EditFinishTrip'),
                //editInvoicedTrip: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.EditInvoicedTrip'),
                //dispatch: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Dispatch'),
                //start: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Start'),
                //finish: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Finish'),
                //cancel: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Cancel'),
                'delete': abp.auth.hasPermission('Page.ExternaLogin.LimoBookings.Delete'),
                //customerWebApp: abp.auth.hasPermission('Pages.Tenant.Limousine.CustomerWebApp'),
                //changeCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ChangeCharges'),
                //canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                //viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ViewOtherBranchTrips'),
                //allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.AllActionsOnOtherBranchTrips'),
                //canMakePayment: abp.auth.hasPermission('Pages.Tenant.Limousine.Process_CreditCard.Payment')
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

            vm.dateRangeModelChanged = function () {
                //vm.filters.fromDate = vm.dateRangeModel.startDate;
                //vm.filters.toDate = vm.dateRangeModel.endDate;

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                } else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
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
            };


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
                    //    externalLimoTripsService.importFromExcel(fileName)
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
                commonLookupService.getLocations({}).success(function (data) {
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
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
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
                            return '~/App/tenant/views/externalLogin/limoBookings/report.cshtml';
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
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MM HH:mm');
                }
                else {
                    return "";
                }
            };
            vm.getTrips = function () {
                vm.loading = true;

                vm.filters.tripStatus = [];
                if (vm.filters.tripStatusesArray.length > 0) {
                    angular.forEach(vm.filters.tripStatusesArray, function (value, key) {
                        vm.filters.tripStatus.push(value.id);
                    });
                }

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //vm.filters.fromDate = moment(vm.filters.fromDate).startOf('minute');
                //vm.filters.toDate = moment(vm.filters.toDate).endOf('minute');


                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}

                vm.dateRangeModelChanged();

                externalLimoTripSearchService.getTrips(vm.filters).success(function (data) {
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

                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i>  <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewTrip(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 1 ) && row.entity.invoiceId == null" ng-click="grid.appScope.editTrip(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.editFinishTrip &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 4) && row.entity.invoiceId == null" ng-click="grid.appScope.editTrip(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.editInvoicedTrip &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 4) && row.entity.invoiceId != null" ng-click="grid.appScope.editTrip(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.TripPrintModal(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.dispatch && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 1 || row.entity.tripStatus == 8) " ng-click="grid.appScope.dispatchTrip(row.entity)">' + app.localize('Dispatch') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.start && grid.appScope.isPrepaymentRequired(row.entity) && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 2 || row.entity.tripStatus == 7) " ng-click="grid.appScope.startTrip(row.entity)">' + app.localize('Start') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.finish && row.entity.tripStatus == 3 && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.finishTrip(row.entity)">' + app.localize('Finish') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.delete && row.entity.tripStatus == 2 && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.noShowTrip(row.entity)">' + app.localize('NoShow') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.cancel && row.entity.tripStatus != 4 && row.entity.tripStatus != 5 && row.entity.tripStatus != 6 &&row.entity.tripStatus != 3 && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.cancelTrip(row.entity)">' + app.localize('Cancel') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 1 || row.entity.tripStatus == 8) " ng-click="grid.appScope.deleteTrip(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity) && !grid.appScope.isCustomerLogin" ng-click="grid.appScope.logTrip(row.entity)">' + app.localize('Log') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.changeCharges && grid.appScope.updateChargesPermission(row.entity) && grid.appScope.locationPermission(row.entity) && row.entity.invoiceId==null" ng-click="grid.appScope.updateCharges(row.entity)">' + app.localize('UpdateCharges') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        // name: app.localize('TripNo'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('TripNo') + '</div>' +
                            '</div>',
                        type: 'number',
                        width: 50,
                        field: 'tripNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.tripNo}}</div>' +
                            '</div>'
                    },
                    {
                        // name: app.localize('Customer'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Customer') + '</div>' +
                            '</div>',
                        field: 'customer.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.customer.name}}</div>' +
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
                    //        '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{grid.appScope.getlocalDateTime(row.entity.pickupDateTime)}}</div>' +
                    //        '</div>'
                    //},


                    {
                        // name: app.localize('Customer'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Guest') + '</div>' +
                            '</div>',
                        field: 'customer.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.guestName}}</div>' +
                            '</div>'
                    },

                    {
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('PickUp') + '</div>' +
                            '</div>',
                        width: 65,
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{grid.appScope.getlocalDateTimeNoYear(row.entity.pickupDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('DropOff') + '</div>' +
                            '</div>',
                        width: 65,
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{grid.appScope.getlocalDateTimeNoYear(row.entity.dropOffDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        // name: app.localize('PickupLocation'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('From') + '</div>' +
                            '</div>',
                        field: 'pickupLocation.title',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.pickupLocation.title}}</div>' +
                            '</div>'
                    },
                    {
                        //name: app.localize('DropOffLocation'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('To') + '</div>' +
                            '</div>',
                        field: 'dropOffLocation.title',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.dropOffLocation.title}}</div>' +
                            '</div>'
                    },
                    {
                        //name: app.localize('Agent'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('TripCustomField1') + '</div>' +
                            '</div>',
                        field: 'customField1',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.customField1}}</div>' +
                            '</div>',
                        visible: vm.customField1Enabled
                    },
                    {
                        //name: app.localize('Vessel'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('TripCustomField2') + '</div>' +
                            '</div>',
                        field: 'customField2',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.customField2}}</div>' +
                            '</div>',
                        visible: vm.customField2Enabled
                    },
                    {
                        //name: app.localize('VehicleType'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('VehicleType') + '</div>' +
                            '</div>',
                        field: 'tariffGroup.title',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.tariffGroup.title}}</div>' +
                            '</div>'
                    },
                    {
                        //name: app.localize('Vehicle'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Vehicle') + '</div>' +
                            '</div>',
                        field: 'vehicle.plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.vehicle.plateNo}}</div>' +
                            '</div>'
                    },
                    {
                        // name: app.localize('Driver'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Driver') + '</div>' +
                            '</div>',
                        field: 'driver.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.driver.name}}</div>' +
                            '</div>'
                    },
                    {
                        //  name: app.localize('Notes'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Notes') + '</div>' +
                            '</div>',
                        field: 'notes',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.notes}}</div>' +
                            '</div>'
                    },
                    {
                        //name: app.localize('TS No'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Reference No') + '</div>' +
                            '</div>',
                        field: 'manualTripNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.manualTripNo}}</div>' +
                            '</div>',
                        visible: vm.manualTripNoEnabled
                    },

                    {

                        //name: app.localize('Status'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Status') + '</div>' +
                            '</div>',
                        field: 'tripStatus',
                        width: 90,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            //'<div class=\"ui-grid-cell-contents\">{{grid.appScope.getTripStatus(row.entity.tripStatus)}}</div>' +
                            ' <span class="label label-success" style="font-size:8px;background-color:#44B6AE;margin-left:25px;padding:0;" ng-show="row.entity.tripStatus==1 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color:#44B6AE;padding:0;" ng-show="row.entity.tripStatus==1 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.tripStatus==1 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#5C9BD1;margin-left:15px;" ng-show="row.entity.tripStatus==2 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#5C9BD1" ng-show="row.entity.tripStatus==2 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.tripStatus==2 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#26C281;margin-left:15px;" ng-show="row.entity.tripStatus==3 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#26C281" ng-show="row.entity.tripStatus==3 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.tripStatus==3 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color:#F4D03F;padding:0;margin-left:15px;" ng-show="row.entity.tripStatus==4 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color:#F4D03F;padding:0;" ng-show="row.entity.tripStatus==4 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.tripStatus==4 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#E43A45;margin-left:15px;" ng-show="row.entity.tripStatus==5 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#E43A45" ng-show="row.entity.tripStatus==5 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.tripStatus==5 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#ACB5C3;margin-left:15px;" ng-show="row.entity.tripStatus==6 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#ACB5C3" ng-show="row.entity.tripStatus==6 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.tripStatus==6 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#907fca;margin-left:15px;" ng-show="row.entity.tripStatus==7 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;padding:0;background-color:#907fca" ng-show="row.entity.tripStatus==7 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.tripStatus==7 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-success" style="font-size:9px;padding:0;background-color:#777;margin-left:15px;" ng-show="row.entity.tripStatus==8 && row.entity.invoiceId == null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus,row.entity.invoiceId)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:9px;padding:0;background-color:#777" ng-show="row.entity.tripStatus==8 && row.entity.invoiceId != null">' + '{{grid.appScope.getTripStatus(row.entity.tripStatus,row.entity.invoiceId)}}' + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.tripStatus==8 && row.entity.invoiceId != null">' + 'Invoiced' + '</span>' +
                            ' <span class="label label-danger" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.isPrepaymentRequired && !row.entity.isPaid">' + app.localize('Unpaid') + '</span>' +
                            ' <span class="label label-success" style="font-size:8px;background-color#21201d;padding:0;" ng-show="row.entity.isPrepaymentRequired && row.entity.isPaid">' + app.localize('Paid') + '</span>' +



                            '</div>'
                    },
                    {
                        //name: app.localize('Amount'),
                        headerCellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:12px">' + app.localize('Amount') + '</div>' +
                            '</div>',
                        field: 'charges',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{grid.appScope.CurrencyFormate(row.entity.charges)}}</div>' +
                            '</div>',
                        visible: vm.permissions.canViewCharges
                    }

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

            //vm.processPayment = function () {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/limousine/trips/processPaymentModal.cshtml',
            //        controller: 'tenant.views.crs.limousine.trips.processPaymentModal as vm',
            //        backdrop: 'static',
            //        size: 'xl',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    contactId: vm.contactId,
            //                    isCustomerLogin: vm.isCustomerLogin
            //                }
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //    }, function () {
            //        vm.getTrips();
            //        });
            //};

            vm.TripPrintModal = function (filters) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/limoBookings/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.externalLogin.limoBookings.printtemplates.printPreview as vmMain',
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

                externalLimoTripExportService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditTripModal(tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/limoBookings/createOrEditModal.cshtml',
                    controller: 'tenant.views.externalLogin.limoBookings.createOrEditModal as vm',
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

            //function openDispatchTripModal(tripId) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/limousine/trips/dispatchTripModal.cshtml',
            //        controller: 'tenant.views.crs.limousine.trips.dispatchTripModal as vm',
            //        backdrop: 'static',
            //        size: 'md',
            //        resolve: {
            //            tripId: function () {
            //                return tripId;
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //        vm.getTrips();
            //    });
            //}

            function openViewTripModal(tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/limoBookings/viewTripModal.cshtml',
                    controller: 'tenant.views.externalLogin.limoBookings.viewTripModal as vm',
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

            //function openStartTripModal(tripId) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/limousine/trips/startTripModal.cshtml',
            //        controller: 'tenant.views.crs.limousine.trips.startTripModal as vm',
            //        backdrop: 'static',
            //        size: 'md',
            //        resolve: {
            //            tripId: function () {
            //                return tripId;
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //        vm.getTrips();
            //    });
            //}

            //function openFinishTripModal(tripId) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/limousine/trips/finishTripModal.cshtml',
            //        controller: 'tenant.views.crs.limousine.trips.finishTripModal as vm',
            //        backdrop: 'static',
            //        size: 'md',
            //        resolve: {
            //            tripId: function () {
            //                return tripId;
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //        vm.getTrips();
            //    });
            //}

            //function openLogTripModal(trip) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/limousine/trips/logTripModal.cshtml',
            //        controller: 'tenant.views.crs.limousine.trips.logTripModal as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    tripId: trip.id,
            //                    tripNo: trip.tripNo
            //                };
            //            }
            //        }
            //    });

            //}

            //function openUpdateChargesModal(trip) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/limousine/trips/updateChargesModal.cshtml',
            //        controller: 'tenant.views.crs.limousine.trips.updateChargesModal as vm',
            //        backdrop: 'static',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    tripId: trip.id
            //                };
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function () {
            //        vm.getTrips();
            //    });
            //};

            //function openUploadTripModal(fileName) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/limousine/trips/uploadTripModal.cshtml',
            //        controller: 'tenant.views.crs.limousine.trips.uploadTripModal as vm',
            //        backdrop: 'static',
            //        size: 'xl',
            //        resolve: {
            //            fileName: function () {
            //                return fileName;
            //            },

            //        }
            //    });
            //    modalInstance.result.then(function () {

            //        vm.importing = false;
            //    });
            //};

            vm.createTrip = function () {
                openCreateOrEditTripModal(null);
            };

            //vm.dispatchTrip = function (trip) {
            //    openDispatchTripModal(trip.id);
            //};
            vm.viewTrip = function (trip) {
                openViewTripModal(trip.id);
            };
            vm.editTrip = function (trip) {
                openCreateOrEditTripModal(trip.id);
            };
            //vm.startTrip = function (trip) {
            //    openStartTripModal(trip.id);
            //};
            //vm.finishTrip = function (trip) {
            //    openFinishTripModal(trip.id);
            //};
            //vm.logTrip = function (trip) {
            //    openLogTripModal(trip);
            //};

            //vm.updateCharges = function (trip) {
            //    openUpdateChargesModal(trip);
            //};
            //vm.cancelTrip = function (trip) {
            //    abp.message.confirm(
            //        app.localize('CancelWarningMessage'),
            //        function (isConfirmed) {
            //            if (isConfirmed) {
            //                externalLimoTripsService.cancelTrip({
            //                    id: trip.id
            //                }).success(function () {
            //                    vm.getTrips();
            //                    abp.notify.success(app.localize('SuccessfullyCanceled'));
            //                });
            //            }
            //        }
            //    );
            //};
            //vm.noShowTrip = function (trip) {
            //    abp.message.confirm(
            //        app.localize('NoShowWarningMessage'),
            //        function (isConfirmed) {
            //            if (isConfirmed) {
            //                externalLimoTripsService.noShowTrip({
            //                    id: trip.id
            //                }).success(function () {
            //                    vm.getTrips();
            //                    abp.notify.success(app.localize('SuccessfullyCanceled'));
            //                });
            //            }
            //        }
            //    );
            //};
            vm.deleteTrip = function (trip) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            externalLimoTripsService.deleteTrip({
                                id: trip.id
                            }).success(function () {
                                vm.getTrips();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            //vm.generateInvoice = function (trip1) {
            //    vm.loading = true;
            //    var invoicesToGenerate = [];
            //    trip1.airline = "some";
            //    trip1.tripType = "Tour";
            //    //invoicesToGenerate.push(trip1);
            //    externalLimoTripsService.getTripForEdit({ id: trip1.id }).success(function (data) {
            //        invoicesToGenerate.push({
            //            id: data.id,
            //            tripNo: data.tripNo,
            //            customerId: data.customerId,
            //            pickupDateTime: data.pickupDateTime,
            //            driverId: data.driverId,
            //            vehicleId: data.vehicleId,
            //            charges: data.charges,
            //            taxPercent: data.taxPercent,
            //            tax: data.tax,
            //            locationId: data.locationId,
            //            notes: data.notes,
            //            tripCharges: data.tripCharges
            //        });
            //        invoiceService.generateLimoInvoices({ asOfDate: vm.filters.fromDate, trips: invoicesToGenerate }).success(function (result) {
            //            vm.generatedInvoices = result;
            //            vm.loading = false;
            //            var modalInstance = $uibModal.open({
            //                templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml',
            //                controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
            //                backdrop: 'static',
            //                size: 'xl',
            //                resolve: {
            //                    invoiceId: function () {
            //                        return vm.generatedInvoices[0].invoiceId;
            //                    }
            //                }
            //            });
            //            modalInstance.result.then(function (result) {
            //                vm.getTrips();
            //            });

            //        }).finally(function () {
            //            vm.saving = false;
            //        });

            //    })
            //    //invoiceService.generateLimoInvoices({ asOfDate: vm.filters.fromDate, trips: invoicesToGenerate }).success(function (data) {
            //    //    vm.generatedInvoices = data;
            //    //    vm.loading = false;
            //    //    //var modalInstance = $uibModal.open({
            //    //    //    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml',
            //    //    //    controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
            //    //    //    backdrop: 'static',
            //    //    //    size: 'xl',
            //    //    //    resolve: {
            //    //    //        invoiceId: function () {
            //    //    //            return vm.generatedInvoices[0].invoiceId;
            //    //    //        }
            //    //    //    }
            //    //    //});
            //    //}).finally(function () {
            //    //    vm.saving = false;
            //    //});
            //};

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
                        if (vm.filters.enableDateRange) {
                            vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                            vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                        } else {
                            vm.filters.fromDate = null;
                            vm.filters.toDate = null;
                        }
                        vm.loading = false;
                    });
                }

                getLocations();
                getTripTypes();
                getStatuses();
                vm.dateRangeModelChanged();
                vm.getTrips();
            }

            init();
        }
    ]);
