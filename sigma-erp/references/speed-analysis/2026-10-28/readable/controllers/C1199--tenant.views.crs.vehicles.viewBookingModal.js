// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:315372-316200
appModule.controller('tenant.views.crs.vehicles.viewBookingModal', [
        '$scope', '$state', '$uibModal', '$uibModalInstance', '$window', 'uiGridConstants', 'abp.services.app.booking', 'abp.services.app.bookingSearch', 'abp.services.app.bookingExport',
        'abp.services.app.chargesSetting', 'abp.services.app.vehicle', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'vehiclePlateNo',
        function ($scope, $state, $uibModal, $uibModalInstance, $window, uiGridConstants, bookingService, bookingSearchService, bookingExportService, chargesSettingService, vehicleService, directoryService, appSession, commonLookupService, utilities, vehiclePlateNo) {

            var vm = this;
            var errorMessage = {};
            var isValid = true;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isSixt = appSession.tenant.tenancyName.toLowerCase() == 'sixtqatar';
            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.enableManualBookingNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualBookingNo"));

            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.isChargeCardEnabled = abp.features.isEnabled("OnlinePayments.Customer.ChargeCard");
            vm.isRequestPaymentAfterCreationEnabled = abp.features.isEnabled("OnlinePayments.Booking.RequestPaymentAfterCreation");

            vm.isEmailLinkToCharge = abp.auth.hasPermission('Pages.Tenant.Bookings.EmailLinkToCharge');
            vm.isChargeCard = abp.auth.hasPermission('Pages.Tenant.Bookings.ChargeCard');


            vm.agreementTypes = null;
            vm.locations = [];
            vm.statuses = [{ id: 1, name: app.localize("New") }, { id: 2, name: app.localize("Confirmed") }, { id: 3, name: app.localize("Cancelled") },
            { id: 5, name: app.localize("NoShow") }, { id: 4, name: app.localize("Closed") }];
            vm.chargesSettings = [];
            agreement = null;

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            vm.filters = {
                enableDateRange: true,
                bookingNo: null,
                plateNo: '',
                bookingStatus: null,
                agreementType: null,
                startDate: null,
                endDate: null,
                customerId: null,
                locationId: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                durationType: 1,
                manualBookingNo: null,
            };

            vm.dateRangeModel = {
                startDate: todayAsString,
                endDate: todayAsString
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            };
            vm.isEnabled = (feature) => {
                return abp.features.isEnabled(feature);
            }
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Bookings'),
                create: abp.auth.hasPermission('Pages.Tenant.Bookings.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Bookings.Edit'),
                print: abp.auth.hasPermission('Pages.Tenant.Bookings.Addnew'),
                close: abp.auth.hasPermission('Pages.Tenant.Bookings.Edit'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Bookings.ExportToExcel'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Bookings.Delete'),
                openagreement: abp.auth.hasPermission('Pages.Tenant.Bookings.OpenAgreement'),
                cancel: abp.auth.hasPermission('Pages.Tenant.Bookings.Cancel'),
                confirmBooking: abp.auth.hasPermission('Pages.Tenant.Bookings.ConfirmBooking'),
                markClosed: abp.auth.hasPermission('Pages.Tenant.Bookings.MarkClosed'),
                noShow: abp.auth.hasPermission('Pages.Tenant.Bookings.NoShow'),


                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Bookings.AllActionsOnOtherBranchBookings'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Bookings.ViewOtherBranchBookings'),
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            function getLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    //return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.clearCustomer = function () {
                vm.filters.customerId = null;
                vm.filters.customer = null;
            };

            vm.openSilentPaymentModal = (booking) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/silentPayment.cshtml',
                    controller: 'tenant.views.common.payments.silentPayment as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        data: () => {
                            return {
                                agreementId: booking.id,
                                customerId: booking.customerId,
                                source: 'booking'
                            }
                        }
                    }
                });
                modalInstance.result.then(result => {

                });
            }

            vm.getlocalizedString = function (bookingStatus) {
                return app.localize(bookingStatus);
            };
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableColumnResizing: true,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                enableColumnResizing: true,
                appScopeProvider: vm,
                enableSorting: true,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 70,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu style="position: absolute; z-index: 9999; top: 100%; left: 0;">' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewBooking(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="(grid.appScope.permissions.edit &&  grid.appScope.locationPermission(row.entity)) && (row.entity.bookingStatus == \'New\' || row.entity.bookingStatus == \'Confirmed\')" ng-click="grid.appScope.editBooking(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.confirmBooking && grid.appScope.locationPermission(row.entity) &&  row.entity.bookingStatus == \'New\'" ng-click="grid.appScope.confirmBooking(row.entity)">' + app.localize('Confirm') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) &&  row.entity.bookingStatus == \'New\'" ng-click="grid.appScope.convertToAgreement(row.entity)">' + app.localize('ConvertToAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.print" ng-click="grid.appScope.printBooking(row.entity)">' + app.localize('Print') + '</a></li>' +
                            // '      <li><a target="_blank" ng-href="/Report#/tenant/printModalBooking/{{row.entity.id}}">' + app.localize('Print (Old)') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.markClosed && grid.appScope.locationPermission(row.entity) && row.entity.bookingStatus == \'Confirmed\'" ng-click="grid.appScope.markCloseBooking(row.entity)">' + app.localize('MarkClosed') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.cancel && grid.appScope.locationPermission(row.entity) &&  (row.entity.bookingStatus == \'New\' || row.entity.bookingStatus == \'Confirmed\')" ng-click="grid.appScope.cancelBooking(row.entity)">' + app.localize('Cancel') + '</a></li>' +
                            '      <li><a ng-if="row.entity.bookingStatus == \'Confirmed\'" ng-click="grid.appScope.addReceipt(row.entity)">' + app.localize('AddReceipt') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.noShow && grid.appScope.locationPermission(row.entity) &&  (row.entity.bookingStatus == \'New\' || row.entity.bookingStatus == \'Confirmed\')" ng-click="grid.appScope.noShowBooking(row.entity)">' + app.localize('NoShow') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.openagreement && grid.appScope.locationPermission(row.entity) && row.entity.bookingStatus == \'Confirmed\'" ng-click="grid.appScope.openAgreement(row.entity) ">' + app.localize('OpenAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete  && grid.appScope.locationPermission(row.entity) && row.entity.bookingStatus == \'New\'" ng-click="grid.appScope.deleteBooking(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li ng-if="grid.appScope.isOnlinePaymentsEnabled && grid.appScope.isRequestPaymentAfterCreationEnabled && grid.appScope.isEmailLinkToCharge && !row.entity.customer.hasCard && (row.entity.bookingStatus != \'Closed\' && row.entity.bookingStatus != \'Cancelled\' && row.entity.bookingStatus != \'NoShow\')"><a ng-click="grid.appScope.emailLinkToCharge(row.entity)">' + app.localize('EmailLinkToCharge') + '</a></li>' +
                            '      <li ng-if="grid.appScope.isOnlinePaymentsEnabled && grid.appScope.isRequestPaymentAfterCreationEnabled && grid.appScope.isChargeCardEnabled && grid.appScope.isChargeCard && row.entity.customer.hasCard && (row.entity.bookingStatus != \'Closed\' && row.entity.bookingStatus != \'Cancelled\' && row.entity.bookingStatus != \'NoShow\')"><a ng-click="grid.appScope.openSilentPaymentModal(row.entity)">' + app.localize('ChargeCard') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('BookingNo'),
                        type: 'number',
                        field: 'agreementNo',
                        width: 150
                    },
                    {
                        name: app.localize('ManualBookingNo'),
                        type: 'number',
                        field: 'manualAgreementNo',
                        visible: vm.enableManualBookingNo,
                        width: 170

                    },
                    {
                        name: app.localize('PlateNo'),
                        type: 'number',
                        field: 'vehicle.plateNo',
                        width: 110
                    },
                    {
                        name: app.localize('VehicleType'),
                        field: 'vehicleType',
                        width: 120
                    },
                    {
                        name: app.localize('PickupDate'),
                        field: 'startDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                            '</div>',
                        width: 125
                    },
                    {
                        name: app.localize('PickupLocation'),
                        field: 'location.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-if="row.entity.pickupLocationId" class=\"ui-grid-cell-contents\">{{row.entity.pickupLocation}}</div>' +
                            '<div ng-if="!row.entity.pickupLocationId" class=\"ui-grid-cell-contents\">{{row.entity.location}}</div>' +
                            '</div>',
                        width: 150
                    },

                    {
                        name: app.localize('MakeAndModel'),
                        type: 'number',
                        field: 'vehicle.makeAndModel',
                        width: 110
                    },
                    //{
                    //    name: app.localize('Card'),
                    //    field: 'customer.hasCard',
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-success">CC</span><span ng-if="!row.entity.customer.hasCard" class="label label-danger">No CC</span></div>' +
                    //        '</div>',
                    //    width: 100
                    //},
                    {
                        name: app.localize('Customer'),
                        field: 'customer.firstName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" ng-style="{color: row.entity.customer.isBlackListed ? \'red\' : \'inherit\'}">' +
                            '<span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.customer.hasCard" class="label label-warning">CC</span> {{row.entity.customer.name}}</div>' +
                            '</div>',
                        width: 300
                    },

                    {
                        name: app.localize('CustomerCode'),
                        field: 'customer.code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customer.code}}</div>' +
                            '</div>',
                        width: 150
                    },
                    {
                        name: app.localize('Status'),
                        width: 80,
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getlocalizedString(row.entity.bookingStatus)}}</div>',
                        //field: 'bookingStatus'
                        //cellTemplate: '<div style="text-align:right;margin-right:5px">{{row.entity.getProfitLoss()}}</div>',

                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "agreementNo desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getBookings();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getBookings();
                    });
                },
                data: []
            };

            vm.emailLinkToCharge = (entity) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/emailLinkToCharge.cshtml',
                    controller: 'tenant.views.common.payments.emailLinkToCharge as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        data: () => {
                            return {
                                source: 'booking',
                                agreementId: entity.id,
                                agreementNo: entity.agreementNo,
                                customerId: entity.customerId,
                                customerName: entity.customer.name,
                                customerEmail: entity.customer.email
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                });
            }

            vm.addReceipt = function (agreement) {
                openCreateOrEditReceiptModal(null, agreement);
            };

            function openCreateOrEditReceiptModal(receiptId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },

                        agreement: function () {
                            return agreement;
                        },

                        quotationId: function () {
                            return null;
                        },
                        customer: function () {
                            return null;
                        },

                        downPayment: function () {
                            return null;
                        },

                        invoice: null
                    }
                });
                modalInstance.result.then(function (result) {

                });
            }

            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //vm.filters.fromDate = null;
                //vm.filters.toDate = null;
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                bookingExportService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function isContractClosed(agreement) {

                if (agreement.status == 1) return true;
                else return false;
            }

            //function getStatuses() {

            //    vm.statuses = [{ id: 1, name: "New" }, { id: 2, name: "Confirmed" }, { id: 3, name: "Cancelled" }, { id: 4, name: "Closed" }];
            //};





            // Opening CreateAndEditBooking Modal
            function openCreateOrEditBookingModal(bookingId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/bookings/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.bookings.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        bookingId: function () {
                            return bookingId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getBookings();
                });

            }
            // Opening ViewBookingModal

            function openViewBookingModal(bookingId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/bookings/viewModal.cshtml',
                    controller: 'tenant.views.crs.bookings.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        bookingId: function () {
                            return bookingId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        }
                    }
                });



            }


            // Opening ConfirmBookingModel

            function openConfirmBookingModal(bookingId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/bookings/confirmBooking.cshtml',
                    controller: 'tenant.views.crs.bookings.confirmBooking as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        bookingId: function () {
                            return bookingId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getBookings();
                });

            }

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/bookings/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            // Opening ConvertToAgreement
            //function openCreateOrUpdateAgreementModal(agreementId, bookingId, chargesSettings) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/agreements/createOrEditModal.cshtml',
            //        controller: 'tenant.views.crs.agreements.createOrEditModal as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            agreementId: function () {
            //                return agreementId;
            //            },
            //            bookingId: function () {
            //                return bookingId;
            //            },
            //            chargesSettings: function () {
            //                return chargesSettings;
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //        vm.getBookings();
            //    });

            //}

            // Create Booking
            vm.createBooking = function () {
                openCreateOrEditBookingModal(null, vm.chargesSettings);
            };

            // View Booking
            vm.viewBooking = function (booking) {
                openViewBookingModal(booking.id, vm.chargesSettings);
            };

            // Edit Booking
            vm.editBooking = function (booking) {
                openCreateOrEditBookingModal(booking.id, vm.chargesSettings);
            };

            // Confirm Booking
            vm.confirmBooking = function (booking) {
                openConfirmBookingModal(booking.id, vm.chargesSettings);
            }

            // Close view Booking modal

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            // Confirm Booking
            //vm.convertToAgreement = function (booking) {
            //    openCreateOrUpdateAgreementModal(agreement, booking.id, vm.chargesSettings);
            //};

            // Searching Customer
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
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
                    }
                });
            };

            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            // Getting All The Bookings
            vm.getBookings = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }

                vm.filters.bookingStatus = 2;
                vm.filters.plateNo = vehiclePlateNo;
                vm.filters.enableDateRange = false;
                vm.filters.fromDate = false;
                vm.filters.toDate = false;
                bookingSearchService.getBookings(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            //  Getting Booking For Edit
            vm.getBookingForEdit = function (bookingId) {
                vm.loading = true;
                bookingService.getBookingForEdit({
                    id: bookingId
                }).success(function (result) {
                    vm.agreement = result;

                    //vm.agreement.movements[0].outDetail.km = 2;

                }).finally(function () {
                    vm.loading = false;
                });
            }
            // Canceling Booking

            vm.cancelBooking = function (booking) {
                abp.message.confirm(
                    app.localize('CancelBookingWarningMessage', booking.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            bookingService.cancelBooking({
                                bookingId: booking.id
                            }).success(function () {
                                vm.getBookings();
                                abp.notify.success(app.localize('SuccessfullyCancelledBooking'));
                            });
                        }
                    }
                );
            };

            vm.noShowBooking = function (booking) {
                abp.message.confirm(
                    app.localize('NoShowBookingWarningMessage', booking.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            bookingService.noShowBooking({
                                bookingId: booking.id
                            }).success(function () {
                                vm.getBookings();
                                abp.notify.success(app.localize('SavedSuccessfully'));
                            });
                        }
                    }
                );
            };

            // Checking Availibility Of Vehicle

            function validatingOpenAgreementOnBooking(statusId) {
                errorMessage = '';
                errorMessage = 'Can Not Convert To Agreement: \n';
                if (isValid == false) {
                    isValid = true;
                }

                if (statusId != 'IDL') {

                    isValid = false;
                    errorMessage = errorMessage + '\n Vehicle Is Not Available';
                }


            }

            // Open Agreement On Booking

            vm.openAgreement = function (booking) {
                debugger;
                //  abp.message.okConfirm(
                //   app.localize('OpenAgreementForBookingMessage'), app.localize('Press Ok To Open Agreement'),
                //    function (isConfirmed) {
                //        if (isConfirmed) {

                //            bookingService.convertBookingToAgreement({
                //                bookingId: booking.id,

                //            }).success(function () {
                //                vm.getBookings();
                //                abp.notify.success(app.localize('SuccessfullyConvertedAgreement'));
                //            });
                //        }
                //    }
                //);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return booking.id;
                        },
                        chargesSettings: function () {
                            return vm.chargesSettings;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getBookings();
                });

            };

            // Delete Booking

            vm.deleteBooking = function (booking) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', booking.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            bookingService.deleteBooking({
                                id: booking.id
                            }).success(function () {
                                vm.getBookings();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            // Delete Booking

            vm.markCloseBooking = function (booking) {
                abp.message.confirm(
                    app.localize('CloseWarningMessage', booking.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            bookingService.markCloseBooking({
                                id: booking.id
                            }).success(function () {
                                vm.getBookings();
                                abp.notify.success(app.localize('SuccessfullyClosed'));
                            });
                        }
                    }
                );
            };

            //vm.replaceVehicle = function (agreement) {
            //    openReplaceVehicleModal(agreement.id);
            //}

            //vm.sendBookingEmail = function (booking) {
            //    abp.message.okConfirm(
            //    app.localize(''), app.localize('Press Ok To Send Email'),
            //     function (isConfirmed) {
            //         if (isConfirmed) {
            //             bookingService.sendBookingEmail({
            //                 id: booking.id,
            //             }).success(function () {
            //                 abp.notify.success(app.localize('SuccessfullySendEmail'));
            //             });
            //         }
            //     }
            // );
            //};

            function initializeFilters() {
                //cashe charges settings once to be used while agreement opening/editing
                getChargesSettings();
                vm.getBookings();
                getLocations();
            }

            //vm.checkingPressedKey = function (keyEvent) {
            //    
            //    if (keyEvent.which == 13) {
            //        keyPress = false;
            //        vm.getBookings();
            //    }

            //}

            vm.statusChanged = function () {
                if (vm.filters.bookingStatus == 1 || vm.filters.bookingStatus == 2)
                    vm.filters.enableDateRange = false;
                else
                    vm.filters.enableDateRange = true;
            };

            vm.getReportUrl = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.encodedFilters = encodeURIComponent(JSON.stringify(vm.filters).replace(/\//g, ''));
                return "/Report#/tenant/bookingsReport/" + vm.encodedFilters;
            };

            //new print methods
            function openPrintBookingModal(bookingId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/bookings/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.bookings.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        bookingId: function () {
                            return bookingId;
                        }
                    }
                });
            }
            vm.printBooking = function (booking) {
                openPrintBookingModal(booking.id);
            };

            initializeFilters();
        }
    ]);
