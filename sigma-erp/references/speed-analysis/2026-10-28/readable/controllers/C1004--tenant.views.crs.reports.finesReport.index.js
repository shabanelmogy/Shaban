// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:270663-271988
appModule.controller('tenant.views.crs.reports.finesReport.index', [
        '$scope', 'utilities', '$uibModal', 'uiGridConstants', 'abp.services.app.uaeFine', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.commonLookup',
        function ($scope, utilities,$uibModal, uiGridConstants, finesService, vehicleService, directoryService, lookupService)
        {
            var vm = this;
            vm.locations = [];
            $scope.$on('$viewContentLoaded', function ()
            {
                App.initAjax();
            });
            vm.culture = abp.localization.currentCulture.name;
            vm.isEnableTFMS = abp.features.isEnabled("TFMS");
            vm.isEnableFMS = abp.features.isEnabled("FMS");
            vm.isEnableCRS = abp.features.isEnabled("CRS");
            vm.isRentalAgreementModuleEnabled = abp.features.isEnabled("CRS.Rental.Agreements");
            vm.isLeaseAgreementModuleEnabled = abp.features.isEnabled("CRS.Lease.Agreements");
            vm.isDebitJVEnabled = abp.features.isEnabled("CRS.Tolls.SalikMonthEndPosting");
            vm.isEnableTMS = abp.features.isEnabled("TMS");
            vm.isEnableCoreBranches = abp.features.isEnabled("Core.Branches");
            vm.isEnableCRSVouchers = abp.features.isEnabled("CRS.Vouchers");
            vm.isInvoiceModuleEnabled = abp.features.isEnabled("CRS.Vouchers.Invoices");
            vm.isEnableShareFines = abp.features.isEnabled("TFMS.Fines.ShareFines");
            vm.isEnableShowCustomPlateNo = abp.features.isEnabled("TFMS.Fines.ShowCustomPlateNo");
            vm.isTripNoInFine = abp.features.isEnabled("Notifications.SendEmailToDriverOnFineProcessingOfTrip");
            vm.isWhatsAppSendCustomerSms = abp.features.isEnabled("Notifications.WhatsAppSendCustomerSmsOnFineProcessingManual");
            vm.isEmailSendCustomerSms = abp.features.isEnabled("Notifications.SendCustomerEmailOnFineProcessingManual");
            vm.isFineCompanyCodeEnabled = abp.setting.getBoolean("App.General.Fine.EnableCompanyCode");

            vm.shareFileFormat = abp.session.tenantId == 328 || abp.session.tenantId == 4392 ? 'N/A' : abp.features.getValue("TFMS.Fines.ShareFines.FileFormat");
            vm.isExternalVehicleEnable = abp.features.isEnabled("CRS_External.Vehicles.Fines");

            vm.isEnableOmanFines = abp.features.isEnabled("TFMS.Fines.Oman");

            var prm = abp.auth.hasPermission('Pages.TFMS.Fines.UpdateFineDescription');
            vm.printByAuthPermission = abp.auth.hasPermission('Pages.TFMS.Print.By.Authority');
            vm.hasPermissionTFMSFineReceipts = abp.auth.hasPermission('Pages.TFMS.Fines.FineReceipts');
            vm.printByDubaiAuthPermission = abp.auth.hasPermission('Pages.TFMS.Print.By.Dubai.Authority');
            vm.downloadConfiscationChargesAuthPermission = abp.auth.hasPermission('Pages.TFMS.DownloadConfiscationCharges');
           
            vm.lateChargesSetting = abp.setting.getBoolean("App.Speed.Common.ReDownloadLateChargesAbuDhabiFines");

            vm.canUpdateFineDescription = function (description)
            {
                return prm && description && description.endsWith('*');
            };

            vm.isAuthorityAbuDhabi = function (authority)
            {
                return authority && authority.toUpperCase() === "ABU DHABI" ? true : false;
            };

            vm.isAuthorityDubai = function (authority)
            {
                return authority && authority.toUpperCase() === "DUBAI" ? true : false;
            };


            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.customers = [];
            vm.selectedVehicle = null;
            vm.vehicleNo = [];
            vm.trafficFileId = [];
            vm.allTrafficFileIds = [];
            vm.server = [];
            vm.plateNos = null;


            vm.filters = {
                enableDateRange: true,
                name: "",
                agreementNo: null,
                vehicleId: null,
                plateTagNo: null,
                customerId: null,
                fromDate: null,
                fromTime: null,
                toDate: null,
                toTime: null,
                amount: null,
                trafficFileId: null,
                vehicleNo: null,
                enableWithAgreement: false,
                enableOthers: false,
                enableWithOutAgreement: false,
                enableInvoiced: false,
                enableIgnored: false,
                enableGenerated: false,
                enableUnIgnored: false,
                debitJvStatus: null,
                sharingStatus: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                finesWithFailedVehicleMappings: false,
                isPaid: null,
                isPayable: null,
                locationId: '',

                plateNo: [],
                durationType: 1,
                trafficFileIdEN: [],
                vehicleNoEN: [],
                server: null,
                vehicleNoArr: [],
                movementType: null,
                externalTollsOnly: null,
                hasBlackPoints: null,
                hasConfiscationCharges: null,
                hasLateCharges: null,
                isAddedManually: null
            };

            vm.resetFilters = function ()
            {
                vm.filters.fineNo = null;
                vm.filters.tfmsAgreementNo = null;
                vm.filters.server = null;
                vm.filters.fromDate = moment(moment().format('YYYY-MM-DD'));
                vm.filters.toDate = moment(moment().format('YYYY-MM-DD'));
                vm.filters.vehicleNoArr = [];
                vm.filters.trafficFileIdEN = "";
                vm.employee = null;
                vm.filters.sharingStatus = null;
                vm.filters.isPaid = null;
                vm.filters.isPayable = null;
                vm.filters.finesWithFailedVehicleMappings = null;
                vm.filters.movementType = null;
                vm.filters.fmsAgreementNo = null;
                vm.filters.fmsCustomer = null;
                vm.filters.fmsCode = null;
                vm.filters.fmsEmployee = null;
                vm.filters.customer = null;
                vm.filters.vehicleStatus = null;
                vm.filters.status = null;
                vm.filters.fineStatus = null;
                vm.filters.agreementNo = null;
                vm.filters.debitJvStatus = null;
                vm.filters.locationId = null;
                vm.filters.externalFinesOnly = null;
                vm.filters.hasBlackPoints = null;
                vm.filters.hasConfiscationCharges = null;
                vm.filters.hasLateCharges = null;
                vm.filters.companyCode = null;
            }

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')),
                endDate: moment(moment().format('YYYY-MM-DD'))
            };
            vm.dateRangeModelChanged = function ()
            {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.dateRangeCheck = function ()
            {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                    vm.filters.fromTime = moment(new Date()).startOf('day').utc();
                    vm.filters.toTime = moment(new Date()).endOf('day').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                    vm.filters.fromTime = null;
                    vm.filters.toTime = null;
                }
            };

            function getFiltersData()
            {
                finesService.getFiltersData().success(function (data)
                {
                    angular.forEach(data.trafficFileId, function (value, key)
                    {
                        vm.allTrafficFileIds.push({ name: value.name, id: value.id, state: value.state });
                    });
                    vm.trafficFileId = vm.allTrafficFileIds;
                    angular.forEach(data.server, function (value, key)
                    {
                        vm.server.push({ name: value.name, id: value.name });
                    });
                });
            }

            vm.serverChanged = function ()
            {
                vm.filters.vehicleNoArr = [];
                vm.filters.trafficFileIdEN = [];
                if (vm.filters.server)
                    vm.trafficFileId = vm.allTrafficFileIds.filter(value => value.state == vm.filters.server);
                else
                    vm.trafficFileId = vm.allTrafficFileIds;
            }

            function getLocations() {

                lookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.searchPlateNo = function ($select)
            {
                if ($select.search) {
                    let filter = {
                        key: $select.search,
                        value: vm.filters.server
                    }
                    return finesService.getSearchPlateNo(filter).then(function (response)
                    {
                        vm.plateNos = response.data.items;
                    });
                }
            };

            vm.searchCustomers = function ($select)
            {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                if (!$select.search) return null;
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response)
                {
                    vm.customers = response.data.items;
                });
            };

            vm.clearCustomer = function ()
            {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contactId = null;
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function ()
            {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function ()
                        {
                            return null;
                        },
                        type: function ()
                        {
                            return 2;
                        }
                    }
                }).result.then(function (customer)
                {
                    if (customer !== null) {
                        vm.filters.customer = customer;
                        vm.filters.contactId = customer.id;
                    }
                });
            };
            vm.CurrencyFormate = function (amount)
            {
                if (amount === null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.searchEmplyeePopoup = function ()
            {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactStaffModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactStaffModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function ()
                        {
                            return null;
                        },
                        type: function ()
                        {
                            return 1;
                        }
                    }
                }).result.then(function (employee)
                {
                    if (employee != null) {
                        vm.employee = employee;
                        vm.filters.employeeId = employee.id;
                    }
                });
            };

            vm.getFinesReport = function ()
            {
                vm.loading = true;

                if (vm.filters.skipCount < 0) vm.filters.skipCount = 0;

                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;

                vm.filters.trafficFileIdArr = [];
                vm.filters.serverArr = [];
                if (vm.employee)
                    vm.filters.employeeId = vm.employee.id;
                vm.filters.vehicleNo = vm.filters.plateNo;

                //if (vm.filters.vehicleNo.length > 0) {
                //    angular.forEach(vm.filters.vehicleNo, function (value) {
                //        vm.filters.vehicleNoArr.push(value.plateNo);
                //    });
                //}
                if (vm.filters.trafficFileIdEN.length > 0) {
                    angular.forEach(vm.filters.trafficFileIdEN, function (value)
                    {
                        vm.filters.trafficFileIdArr.push(value.name);
                    });
                }
                finesService.getFinesReport(vm.filters).success(function (data)
                {
                    vm.gridOptions.data = data.items;
                    vm.gridOptions.totalItems = data.totalCount;
                }).finally(function ()
                {
                    vm.loading = false;
                });
            };

            function getStatuses()
            {
                vm.statuses = [{ id: 1, name: app.localize('WithAgreement') }, { id: 2, name: app.localize('WithoutAgreement') }, { id: 3, name: app.localize('Others') }];
            }

            vm.movementType = [
                { type: "Agreement (Customer)", id: 1 },
                { type: "NRM (Staff)", id: 2 },
                { type: "Un-Identified", id: 3 },
                { type: "Collection Movement", id: 4 }

            ];

            vm.statusChanged = function ()
            {
                if (vm.filters.status === 1) {
                    vm.filters.enableWithAgreement = true;
                    vm.filters.enableWithOutAgreement = false;

                }
                else if (vm.filters.status === 2) {
                    vm.filters.enableWithOutAgreement = true;
                    vm.filters.enableWithAgreement = false;
                }
                else if (vm.filters.status === 3) {
                    vm.filters.enableOthers = true;
                    vm.filters.enableWithMovement = false;
                }
                else {
                    vm.filters.enableWithAgreement = false;
                    vm.filters.enableWithMovement = false;
                    vm.enableWithOutAgreement = false;
                    vm.filters.enableOthers = false;
                }
            };

            function getInvoiceStatuses()
            {
                vm.invoiceStatuses = [{ id: 1, name: 'Invoiced' }, { id: 2, name: 'Un-Invoiced' }];
            }

            vm.invoiceStatusChanged = function ()
            {

                if (vm.filters.vehicleStatus === 1) {
                    vm.filters.enableInvoiced = true;
                    vm.filters.enableUnInvoiced = false;

                }
                else if (vm.filters.vehicleStatus === 2) {
                    vm.filters.enableUnInvoiced = true;
                    vm.filters.enableInvoiced = false;
                }
                else {
                    vm.filters.enableUnInvoiced = false;
                    vm.filters.enableInvoiced = false;
                }
            };

            function getFineStatuses()
            {
                vm.fineStatuses = [{ id: 1, name: 'Ignored' }, { id: 2, name: 'Un-Ignored' }];
            }

            vm.fineStatusChanged = function ()
            {
                if (vm.filters.fineStatus === 1) {
                    vm.filters.enableIgnored = true;
                    vm.filters.enableUnIgnored = false;
                }
                else if (vm.filters.fineStatus === 2) {
                    vm.filters.enableUnIgnored = true;
                    vm.filters.enableIgnored = false;
                }
                else {
                    vm.filters.enableUnIgnored = false;
                    vm.filters.enableIgnored = false;
                }
            };

            vm.getlocalDateTime = function (date)
            {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date)
            {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.isIgnored = function (data)
            {
                if (data === true)
                    return "Yes";
                else
                    return "No";
            };

            vm.updateChargeAndCollection = function (fine)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tms/dashboard/updateChargesModal.cshtml',
                    controller: 'tenant.views.tms.dashboard.updateChargesModal as vm',
                    backdrop: 'static',
                    resolve: {
                        finesData: function ()
                        {
                            return fine;
                        }
                    }
                });
                modalInstance.result.then(function (result)
                {
                    vm.getFinesReport();
                });
            };
            vm.searchEmployees = function ($select)
            {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get staff
                return directoryService.searchStaff({ keyword: $select.search, contactType: 1 }).then(function (response)
                {
                    vm.staff = response.data.items;
                });
            };
            vm.ignoreFine = function (fine)
            {
                abp.message.confirm(
                    app.localize('IgnoreFineMessage'), app.localize('PressOkToIgnoreFine'),
                    function (isConfirmed)
                    {

                        if (isConfirmed) {
                            finesService.ignoreFine({
                                id: fine.id
                            }).success(function ()
                            {
                                vm.getFinesReport();
                            });
                        }
                    }
                );
            };

            vm.attachVehicle = function (fine)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/finesReport/attachVehicleModal.cshtml',
                    controller: 'tenant.views.crs.reports.finesReport.attachVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        finesData: function ()
                        {
                            return fine;
                        }
                    }
                });
                modalInstance.result.then(function (result)
                {
                    vm.getFinesReport();
                });
            };
            vm.viewFine = function (fine)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/finesReport/viewFine.cshtml',
                    controller: 'tenant.views.crs.reports.finesReport.viewFine as vm',
                    size: 'lg',
                    backdrop: 'static',

                    resolve: {
                        finesId: function ()
                        {
                            return fine.id;
                        }
                    }
                });

                modalInstance.result.then(function (result)
                {
                    vm.getFinesReport();
                });
            };

            vm.report = function ()
            {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function ()
                        {
                            return '~/App/tenant/views/crs/reports/finesReport/report.cshtml';
                        },
                        filters: function ()
                        {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.unIgnoreFine = function (fine)
            {
                abp.message.confirm(
                    app.localize('IgnoreFineMessage'), app.localize('PressOkToUnIgnoreFine'),
                    function (isConfirmed)
                    {
                        if (isConfirmed) {
                            finesService.unIgnoreFine({
                                id: fine.id
                            }).success(function ()
                            {
                                vm.getFinesReport();
                            });
                        }
                    }
                );
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
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewFine(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.fineReportPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="!row.entity.ignored && !row.entity.invoiceVoucherNo && grid.appScope.isEnableCRS" ng-click="grid.appScope.ignoreFine(row.entity)">' + app.localize('IgnoreFine') + '</a></li>' +
                            '      <li><a ng-if="(row.entity.vehicleId == 0 ||row.entity.vehicleId == null || row.entity.vehicleId == undefined) && grid.appScope.isEnableCRS" ng-click="grid.appScope.attachVehicle(row.entity)">' + app.localize('AttachVehicle') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openUpdateFineModal(row.entity)">' + app.localize('Update') + app.localize('Notes') + '/' + app.localize('Remarks') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isEnableTFMS" ng-click="grid.appScope.updateChargeAndCollection(row.entity)">' + app.localize('UpdateChargeAndCollection') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openFineLogsModal(row.entity)">' + app.localize('FineLogs') + '</a></li>' +
                            '      <li><a ng-if="row.entity.ignored == 1 && grid.appScope.isEnableCRS" ng-click="grid.appScope.unIgnoreFine(row.entity)">' + app.localize('UnIgnoreFine') + '</a></li>' +
                            '<li><a ng-if="grid.appScope.printByAuthPermission || grid.appScope.printByDubaiAuthPermission" ng-click="grid.appScope.openChooseAuthorityPrint(row.entity)">' + app.localize('PrintByAuthority') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.printByDubaiAuthPermission && grid.appScope.isAuthorityDubai(row.entity.server)" ng-click="grid.appScope.fineReportPrintByDubaiAuthorityModal(row.entity.id)">' + app.localize('PrintByDubaiAuthority') + '</a></li>' +
                            //'      <li><a target="_blank" ng-href="/Report#/tenant/printModalFineReport/{{row.entity.id}}">' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canUpdateFineDescription(row.entity.fineDescription)" ng-click="grid.appScope.openUpdateFineDescription(row.entity)">' + app.localize('Update Fine Description') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isWhatsAppSendCustomerSms" ng-click="grid.appScope.sendWhatsAppCustomerSms(row.entity)">' + app.localize('WhatsAppSMS') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isEmailSendCustomerSms" ng-click="grid.appScope.sendEmailCustomerSms(row.entity)">' + app.localize('Email') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('FineNo'),
                        width: 150,
                        field: 'fineNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.fineNo}}' +
                            ' <span  ng-if="row.entity.isAddedManually" class="label label-warning">' + app.localize('Manual') + '</span>' +

                            '</div>'
                    },
                    {
                        name: app.localize('PlateNo'),
                        width: 150,
                        field: 'plateNo',
                        visible: vm.isEnableTFMS,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.plateInfo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DateAndTime'),
                        field: 'fineDateTime',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.fineDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Authority'),
                        width: 125,
                        field: 'authority',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.authority}}</div>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('Staff'),
                    //    field: 'staff',
                    //    width: 150,

                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{row.entity.movementStaffName}}</div>' +
                    //        '</div>'
                    //},

                    {
                        name: app.localize('CustomPlateNo'),
                        width: 150,
                        field: 'customPlateNo',
                        visible: vm.isEnableShowCustomPlateNo,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customPlateNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Description'),
                        width: 200,
                        field: 'fineDescription',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.fineDescription}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DownloadDate'),
                        field: 'downloadDateTime',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.downloadDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ReceiptNo'),
                        field: 'receiptNo',
                        width: 150,
                        visible: vm.isEnableTFMS && vm.hasPermissionTFMSFineReceipts || vm.isEnableOmanFines,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.receiptNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ReceiptDateTime'),
                        field: 'receiptDateTime',
                        width: 150,
                        visible: vm.isEnableTFMS && vm.hasPermissionTFMSFineReceipts || vm.isEnableOmanFines,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.receiptDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        width: 80,
                        //field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: 'Knw',
                        width: 80,
                        field: 'acknowledgment',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.acknowledgment}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Surcharge'),
                        width: 100,
                        //field: 'surcharge',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.surcharge)}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('FineAmount'),
                        width: 80,
                        field: 'amountWithSurcharge',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amountWithSurcharge)}}</div>' +
                            '</div>',
                    },
                    {
                        name: app.localize('ChargedAmmount'),
                        width: 80,
                        field: 'chargedAmmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.chargedAmmount)}}</div>' +
                            '</div>',
                        visible: vm.isEnableTFMS
                    },
                    {
                        name: app.localize('CollectedAmount'),
                        width: 80,
                        field: 'collectedAmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.collectedAmount)}}</div>' +
                            '</div>',
                        visible: vm.isEnableTFMS
                    },
                    
                    {
                        name: app.localize('Payable'),
                        width: 80,
                        field: 'isPayable',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.isPayable == 1? "Yes":"No"}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Paid'),
                        width: 80,
                        field: 'isPaid',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.isPaid == 1? "Yes":"No"}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('BlackPoints'),
                        width: 80,
                        field: 'blackPoints',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.blackPoints}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('LateCharges'),
                        width: 80,
                        field: 'lateCharges',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.lateCharges)}}</div>' +
                            '</div>',
                       visible: vm.lateChargesSetting,

                    },
                    {
                        name: app.localize('Staff'),
                        width: 150,
                        field: 'notes',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreementNo? "" :row.entity.staffName}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('Notes'),
                        width: 240,
                        field: 'notes',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.notes}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('Remarks'),
                        width: 200,
                        field: 'notes',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.notes}}</div>' +
                            '</div>',
                        visible: vm.isEnableTFMS
                    },
                    {
                        name: app.localize('Vehicle'),
                        width: 150,
                        field: 'plateInfo',
                        visible: vm.isEnableCRS,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            //' <span >' + '{{row.entity.plateNo}}' + '&nbsp' + '</span>' +
                            ' <span >' + '{{row.entity.plateInfo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.vehicleId == 0 && vm.isEnableCRS" class="label label-danger">' + app.localize('UnMapped') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Ignored'),
                        field: 'ignored',
                        width: 80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.isIgnored(row.entity.ignored)}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: 'Location',
                        width: 140,
                        field: 'location',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.location}}</div>' +
                            '</div>'
                    },
                    //{
                    //    name: 'Code',
                    //    width: 100,
                    //    field: 'agreement.customer.code'
                    //},
                    {
                        //name: vm.isEnableFMS ? app.localize('InvoiceTo') : app.localize('Contacts'),
                        //width: 200,
                        //field: 'agreementCustomerName',
                        //cellTemplate:
                        //    '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                        //    '<div class=\"ui-grid-cell-contents\">{{row.entity.movementContact}}</div>' +
                        //    '</div>',
                        //visible: vm.isEnableCRS
                        name: app.localize('Contacts'),
                        width: 80,
                        field: 'contacts',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\" ng-if=\"!row.entity.agreementCustomerName\">{{row.entity.agreementNo? row.entity.movementContact.name: ""}}</div>' +
                            '<div class=\"ui-grid-cell-contents\" ng-if=\"row.entity.agreementCustomerName\">{{row.entity.agreementCustomerName}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        width: 140,
                        field: 'agreementNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreementNo}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('TripNo'),
                        width: 140,
                        field: 'tripNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.tripNo}}</div>' +
                            '</div>',
                        visible: vm.isTripNoInFine && vm.isEnableCRS
                    },
                    {
                        name: app.localize('MovementType'),
                        field: 'movementType',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.movementType}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: app.localize('Movement No'),
                        field: 'movementNo',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.movementId}}</div>' +
                            '</div>',
                   //     visible: !vm.isEnableShareFines
                    },
                    {
                        name: 'Agreement Number',
                        width: 165,
                        field: 'movementRefNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.movementRefNo}}</div>' +
                            '</div>',
                        visible: !vm.isEnableCRS && (vm.isEnableTFMS || vm.isEnableTMS)
                    },
                    //{
                    //    name: 'Invoice Amount',
                    //    width: 125,
                    //    field: 'invoice.amount'
                    //},
                    //{
                    //    name: app.localize('InvoiceNo'),
                    //    width: 125,
                    //    field: 'invoice.voucherNo'
                    //},
                    //{
                    //    name: 'Invoice Date',
                    //    width: 125,
                    //    field: 'invoice.date',
                    //    cellTemplate:
                    //    '<div class=\"ui-grid-cell\">' +
                    //       '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.invoice.date)}}</div>' +
                    //    '</div>'
                    //},
                    {
                        name: app.localize('TrafficFileId'),
                        width: 125,
                        field: 'trafficFileId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.trafficFileId}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CompanyCode'),
                        width: 100,
                        field: 'companyCode',
                        visible: vm.isFineCompanyCodeEnabled
                    },
                    {
                        name: app.localize('ConfiscationCharges'),
                        width: 125,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.confiscationCharges)}}</div>' +
                            '</div>',
                        visible: vm.downloadConfiscationChargesAuthPermission
                    },
                    {
                        name: app.localize('Due'),
                        width: 80,
                        field: 'due',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.due)}}</div>' +
                            '</div>',
                        visible: vm.isEnableTFMS
                    },
                    {
                        name: app.localize('InvoiceNo'),
                        width: 140,
                        field: 'invoiceVoucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.invoiceVoucherNo}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: 'InvoiceDate',
                        width: 125,
                        field: 'invoiceDate',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                           '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.invoiceDate)}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS

                    },
                    {
                        name: app.localize('BillNo'),
                        width: 140,
                        field: 'billNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.billNo}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS
                    },
                    {
                        name: 'BillDate',
                        width: 125,
                        field: 'billDate',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                           '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.billDate)}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS

                    },
                    {
                        name: app.localize('BillPaid'),
                        width: 80,
                        field: 'billPaid',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.billPaid == true ? "Yes":"No"}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS

                    },
                    {
                        name: app.localize('DueAmount'),
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.invoiceDueAmount)}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS && vm.isEnableCRSVouchers
                    },
                    {
                        name: app.localize('DebitJvNo'),
                        width: 140,
                        //field: 'debitJvVoucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" ng-class="{isPayable: !row.entity.isPayable}">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.debitJvVoucherNo}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS && vm.isEnableCRSVouchers
                    },
                    {
                        name: app.localize('TripDriverName'),
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.tripDriverName}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS && vm.isEnableCRSVouchers
                    },
                    {
                        name: app.localize('ContactNo'),
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.contactNo}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS && vm.isEnableCRSVouchers
                    },
                    {
                        name: app.localize('SalesPerson'),
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.salesPerson}}</div>' +
                            '</div>',
                        visible: vm.isEnableCRS && vm.isEnableCRSVouchers
                    },

                ],

                onRegisterApi: function (gridApi)
                {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns)
                    {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getFinesReport();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize)
                    {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getFinesReport();
                    });
                },
                data: []
            };
            vm.sendWhatsAppCustomerSms = function (fine) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            finesService.whatsAppFromFinesReport({
                                id: fine.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.sendEmailCustomerSms = function (fine) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            finesService.emailFines({
                                finesId: [fine.id],
                                customerEmail: fine.movementContact.email,
                                customerType: fine.movementContact.contactType
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("Email Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.openFineLogsModal = function (fine)
            {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/finesReport/createOrShowFineLogsModal.cshtml',
                    controller: 'tenant.views.crs.reports.finesReport.createOrShowFineLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        fine: function ()
                        {
                            return fine;
                        }
                    }
                });
            };
            vm.openUpdateFineModal = function (fine)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/finesReport/updateFineModel.cshtml',
                    controller: 'tenant.views.crs.reports.finesReport.updateFineModel as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        fine: function ()
                        {
                            return { id: fine.id, notes: fine.notes };
                        }
                    }
                });

                modalInstance.result.then(function (result)
                {
                    vm.getFinesReport();
                });
            };

            vm.openUpdateFineDescription = function (fine)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/finesReport/updateFineDescription.cshtml',
                    controller: 'tenant.views.crs.reports.finesReport.updateFineDescription as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        Fine: function ()
                        {
                            return fine;
                        }
                    }
                });

                modalInstance.result.then(function (result)
                {
                    vm.getFinesReport();
                });
            };

            vm.fineReportPrintModal = function (fineId)
            {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/finesReport/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.reports.finesReport.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        fineId: function ()
                        {
                            return fineId;
                        }
                    }
                });
            };

            vm.fineReportPrintByAuthorityModal = function (fineId)
            {
                let printFilter = fineId;
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        templateUrl: function ()
                        {
                            return '~/App/tenant/views/crs/reports/finesReport/printtemplates/emiratesCabPrint.cshtml';
                        },
                        filters: function ()
                        {
                            return printFilter;
                        }
                    }
                });
            };

            vm.openChooseAuthorityPrint = function (fine)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/finesReport/chooseAuthorityPrint.cshtml',
                    controller: 'tenant.views.crs.reports.finesReport.chooseAuthorityPrint as vm',
                    size: 'md',
                    backdrop: 'static',

                    resolve: {
                        fineId: function ()
                        {
                            return fine.id;
                        },
                        selectedAuthority: function ()
                        {
                            return fine.server;
                        }
                    }
                });

                modalInstance.result.then(function (result)
                {
                    vm.getFinesReport();
                });
            };

            vm.exportToExcel = function ()
            {
                vm.loading = true;
                vm.filters.skipCount = -1;
                finesService.exportToExcelView(vm.filters)
                    .success(function (result)
                    {
                        app.downloadTempFile(result);
                    }).finally(function ()
                    {
                        vm.loading = false;
                    });
            };

            vm.exportToCsv = function ()
            {
                vm.loading = true;
                finesService.exportToCsvCustom(vm.filters)
                    .success(function (result)
                    {
                        app.downloadTempFile(result);
                    }).finally(function ()
                    {
                        vm.loading = false;
                    });
            };

            vm.searchOrganizationContactPopup = function ()
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (result)
                {
                    vm.filters.contactId = result.id;
                    vm.filters.customer = result.name;
                });
            };

            vm.clearCustomer = function ()
            {
                vm.filters.customer = null;
                vm.filters.contactId = null;
            };
            vm.clearEmployee = function ()
            {
                vm.employee = null;
                vm.filters.employeeId = null;
            };

            vm.dateRangeCheck();
            vm.getFinesReport();
            getStatuses();
            getInvoiceStatuses();
            getFineStatuses();
            getFiltersData();
            getLocations();
            $('.date-picker').datetimepicker({ locale: vm.culture });
        }
    ]);
