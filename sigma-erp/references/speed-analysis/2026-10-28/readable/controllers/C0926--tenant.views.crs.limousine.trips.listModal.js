// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:252121-252972
appModule.controller('tenant.views.crs.limousine.trips.listModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', '$uibModal', 'abp.services.app.limoTrip', 'abp.services.app.limoTripExport', 'abp.services.app.leaseAgreementSearch', 'options', 'abp.services.app.limoTripSearch', 'appSession', 'utilities',
        function ($scope, $uibModalInstance, uiGridConstants, $uibModal, limoTripsService, limoTripExportService, leaseAgreementSearchService, options, limoTripSearchService, appSession, utilities) {

            var vm = this;
            vm.date = moment();
            vm.isDashboard2Enabled = abp.features.isEnabled("CRS.AgreementsDashboard2");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
         

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
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.customField1Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.customField2Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.customField3Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
            vm.locations = [];
            vm.tripTypes = [];

            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: options.LimousineStatus,
                startDate: null,
                vehicleOwnership: options.vehicleOwnership,
                vehicleType: options.vehicleType,
                endDate: null,
                customerId: null,
           /*     agreementCategory: 2,*/
                plateNo: '',
                locationId: options.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                tripStatusesArray: [],
            };

            vm.subTitle = function () {
                var result = "";
                if (options.LimousineStatus == 'New') { result = "New"; }
                else if (options.LimousineStatus == 'Dispatched') { result = "Dispatched"; }
                else if (options.LimousineStatus == 'Started') { result = "Started"; }
                else if (options.LimousineStatus == 'FinishedToday') { result = "FinishedToday"; }
                else if (options.LimousineStatus == 'Canceled') { result = "Canceled"; }
                else if (options.LimousineStatus == 'NoShow') { result = "NoShow"; }
                else result = options.LimousineStatus;
                return app.localize(result);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
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
                create: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.Addnew'),
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

            vm.exportToNew = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.tripStatus = 'New';
                limoTripExportService.exportToExcelNew(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.dispatchedExportToExcel = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.status = 'Dispatched';
                limoTripExportService.exportToExcelDispatch(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcelStarted = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.status = 'Started';
                limoTripExportService.exportToExcelStart(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.finishedexportToExcel = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.status = 'Finished';
                vm.filters.todayFromTime = moment().startOf('day');
                vm.filters.todayToTime = moment().endOf('day');
                limoTripExportService.exportToExcelFinish(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.canceledexportToExcel = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.status = 'Canceled';
                limoTripExportService.exportToExcelCanceled(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.exportToExcelNoShow = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.status = 'NoShow';
                limoTripExportService.exportToExcelNoShow(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
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
                        '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                        '<a class="btn btn-xs btn-primary blue fa fa-cog" href="" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> ' +
                        ' <i class="fa fa-angle-down"></i></a>' +
                        '    <ul class="dropdown-menu">' +
                        '<li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewTrip(row.entity)">' + app.localize('View') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.edit &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus != 4 ) && row.entity.invoiceId == null" ng-click="grid.appScope.editTrip(row.entity)">' + app.localize('Edit') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.editFinishTrip &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 4) && row.entity.invoiceId == null" ng-click="grid.appScope.editTrip(row.entity)">' + app.localize('Edit') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.editInvoicedTrip &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 4) && row.entity.invoiceId != null" ng-click="grid.appScope.editTrip(row.entity)">' + app.localize('Edit') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.TripPrintModal(row.entity)">' + app.localize('Print') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.dispatch && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 1 || row.entity.tripStatus == 8) " ng-click="grid.appScope.dispatchTrip(row.entity)">' + app.localize('Dispatch') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.start && grid.appScope.isPrepaymentRequired(row.entity) && grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 2 || row.entity.tripStatus == 7) " ng-click="grid.appScope.startTrip(row.entity)">' + app.localize('Start') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.finish && row.entity.tripStatus == 3 && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.finishTrip(row.entity)">' + app.localize('Finish') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.tripStatus == 2 && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.noShowTrip(row.entity)">' + app.localize('NoShow') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.cancel && row.entity.tripStatus != 4 && row.entity.tripStatus != 5 && row.entity.tripStatus != 6 &&row.entity.tripStatus != 3 && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.cancelTrip(row.entity)">' + app.localize('Cancel') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.delete &&  grid.appScope.locationPermission(row.entity) && (row.entity.tripStatus == 1 || row.entity.tripStatus == 8) " ng-click="grid.appScope.deleteTrip(row.entity)">' + app.localize('Delete') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity) && !grid.appScope.isCustomerLogin" ng-click="grid.appScope.logTrip(row.entity)">' + app.localize('Log') + '</a></li>' +
                '      <li><a ng-if="grid.appScope.permissions.changeCharges && grid.appScope.updateChargesPermission(row.entity) && grid.appScope.locationPermission(row.entity) && row.entity.invoiceId==null" ng-click="grid.appScope.updateCharges(row.entity)">' + app.localize('UpdateCharges') + '</a></li>' +

                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('TripNo'),
                        type: 'number',
                        width: 100,
                        field: 'tripNo',

                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.tripNo}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('TripType'),
                        width: 80,
                        field: 'tripType.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.tripType.name}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Customer'),
                        width: 150,
                        field: 'customer.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.customer.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Guest'),
                        field: 'guestName',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.guestName}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('PickUp'),
                        width: 100,
                        field: 'pickupDateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{grid.appScope.getlocalDateTimeNoYear(row.entity.pickupDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DropOff'),
                        width: 100,
                        field: 'dropOffDateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{grid.appScope.getlocalDateTimeNoYear(row.entity.dropOffDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('From'),
                        width: 150,
                        field: 'pickupLocation.title',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.pickupLocation.title}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('To'),
                        width: 150,
                        field: 'dropOffLocation.title',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.dropOffLocation.title}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TripCustomField1'),
                        width: 150,
                        field: 'customField1',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.customField1}}</div>' +
                            '</div>',
                        visible: vm.customField1Enabled
                    },
                    {
                        name: app.localize('TripCustomField2'),
                        field: 'customField2',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.customField2}}</div>' +
                            '</div>',
                        visible: vm.customField2Enabled
                    },
                    {
                        name: app.localize('VehicleType'),
                        field: 'tariffGroup.title',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.tariffGroup.title}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        width: 100,
                        field: 'vehicle.plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px; text-align: center;" ng-click="grid.appScope.changeVehicle(row.entity)">' +
                            '{{row.entity.vehicle.plateNo || ".........."}}' +
                            '</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Driver'),
                        width: 100,
                        field: 'driver.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.driver.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Notes'),
                        field: 'notes',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.notes}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Reference No'),
                        field: 'manualTripNo',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{row.entity.manualTripNo}}</div>' +
                            '</div>',
                        visible: vm.manualTripNoEnabled
                    },

                    {

                        name: app.localize('Status'),
                        field: 'tripStatus',
                        width: 90,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
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
                        name: app.localize('Amount'),
              
                        type: 'number',
                        width: 80,
                        field: 'charges',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="font-size:10px">{{grid.appScope.CurrencyFormate(row.entity.charges)}}</div>' +
                            '</div>',
                        visible: vm.permissions.canViewCharges
                    }
            
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
            vm.isPrepaymentRequired = function (row) {
                if (row.isPrepaymentRequired && !row.isPaid)
                    return false;
                return true;
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
            };
          
            vm.updateChargesPermission = function (trip) {
                if (trip.customer.contactType == 2 && trip.customer.contactCategory == 2)
                    return !trip.invoiceId && (trip.tripStatus == 4 || trip.tripStatus == 6);
                else if (trip.customer.contactType == 2 && trip.customer.contactCategory == 1)
                    return trip.tripStatus == 4 || trip.tripStatus == 6;
                return false;
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };
            vm.getTrips = function () {
                vm.loading = true;
                vm.filters.startDate = moment().startOf('day');
                vm.filters.endDate = moment().endOf('day');

                if (options.LimousineStatus == 'New') {
                    vm.filters.tripStatus = 'New';
                    limoTripSearchService.getTripsOnDashBoard(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (options.LimousineStatus == 'Dispatched') {
                    vm.filters.tripStatus = 'Dispatched';
                    limoTripSearchService.getTripsOnDashBoard(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (options.LimousineStatus == 'Started') {
                    vm.filters.tripStatus = 'Started';
                    limoTripSearchService.getTripsOnDashBoard(vm.filters).success(function (data) {

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (options.LimousineStatus == 'Canceled') {
                    vm.filters.tripStatus = 'Canceled';
                    limoTripSearchService.getTripsOnDashBoard(vm.filters).success(function (data) {

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (options.LimousineStatus == 'FinishedToday') {
                    vm.filters.tripStatus = 'Finished';
                    vm.filters.todayFromTime =moment().startOf('day');
                    vm.filters.todayToTime = moment().endOf('day');
                    limoTripSearchService.getTripsOnDashBoard(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                } else if (options.LimousineStatus == 'NoShow') {
                    vm.filters.tripStatus = 'NoShow';
                    limoTripSearchService.getTripsOnDashBoard(vm.filters).success(function (data) {

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                    limoTripSearchService.getTripsOnDashBoard(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();
                    });
                }
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
            vm.createTrip = function () {
                openCreateOrEditTripModal(null);
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

            vm.dispatchTrip = function (trip) {
                openDispatchTripModal(trip.id);
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
                    vm.getTrips();
                });
            }
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
            function getStatuses() {
                vm.tripStatus = [
                    { id: 1, name: app.localize("New") },
                    { id: 2, name: app.localize("Dispatched") },
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
            vm.applyChange = function (row) {
                if (row.selected)
                    vm.filters.tripStatusesArray.push(row);
                else {
                    var index = vm.filters.tripStatusesArray.indexOf(row);
                    vm.filters.tripStatusesArray.splice(index, 1);
                }
              vm.getTrips();
            };
            

            function init() {
               //initDate();
                getStatuses();
                vm.getTrips();
            }

            init();
        }
    ]);
