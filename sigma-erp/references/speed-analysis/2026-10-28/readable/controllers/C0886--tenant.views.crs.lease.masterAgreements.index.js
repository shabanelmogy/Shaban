// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:241003-241393
appModule.controller('tenant.views.crs.lease.masterAgreements.index', [
        '$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.leaseMasterAgreement',
        function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, masterAgreementService) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.extendLeaseAgreement = abp.features.isEnabled("CRS.Lease.Agreements.ExtendMasterLeaseAgreements");
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];

            vm.vehicles = [];
            vm.customers = [];
            vm.statuses = [];

            vm.filters = {
                voucherNo: null,
                vehicleId: null,
                fromDate: null,
                toDate: null,
                customerId: null,
                approvedTypes: null,
                inquiryReferenceNo: null,
                status: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            }
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.masterAgreements.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.masterAgreements.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.masterAgreements.Delete'),
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: "Open" }, { id: 2, name: "Closed" }];
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            // extended search using search contact popup
            vm.searchContactPopoup = function () {
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
                    }
                });
            };

            vm.searchVehiclePopup = function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffGroup: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.filters.vehicle = result;

                    }
                });
            }

            vm.getmasterAgreements = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                
                if (vm.filters.customer != null)
                    vm.filters.customerId = vm.filters.customer.id;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;

                masterAgreementService.getMasterLeaseAgreements(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.customer != null)
                    vm.filters.contact = vm.filters.customer.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                masterAgreementService.exportToExcel(vm.filters)
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
                enableColumnResizing: true,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                        '<div class=\"ui-grid-cell-contents\">' +
                        '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                        '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                        '    <ul uib-dropdown-menu>' +
                        //'      <li><a ng-click="grid.appScope.viewMasterAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                        //'      <li><a ng-click="grid.appScope.editMasterAgreement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a ng-click="grid.appScope.printMasterAgreement(row.entity)">' + app.localize('Print') + '</a></li>' +
                        '      <li><a ng-click="grid.appScope.masterAgreementModal(row.entity)">' + app.localize('Detail') + '</a></li>' +
                        '      <li ng-if="grid.appScope.extendLeaseAgreement && row.entity.isApproved"><a ng-click="grid.appScope.extendAgreements(row.entity)">' + app.localize('ExtendAgreements') + '</a></li>' +
                        '      <li><a ng-if="!row.entity.isApproved" ng-click="grid.appScope.approveMasterAgreement(row.entity)">' + app.localize('Approve') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                    },

                    {
                        name: app.localize('MasterAgreementNo'),
                        field: 'agreementNo',
                        width: 215,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.agreementNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="!row.entity.isApproved" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="row.entity.isApproved" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.date)}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'quotation.customer.name'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'quotation.customer.name',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.quotation.customer.name}} </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Code'),
                        field: 'quotation.customer.code'
                    },
                    {
                        name: app.localize('QuotationNo'),
                        field: 'quotation.quotationNo'
                    },
                    {
                        name: app.localize('PO'),
                        field: 'poNo',
                        width: 100
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

                        vm.getmasterAgreements();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getmasterAgreements();
                    });
                },
                data: []
            };

            vm.createmasterAgreement = function () {

                openCreateOrEditMasterAgreement(null);
            };

            vm.editMasterAgreement = function (masterAgreement) {
                openCreateOrEditMasterAgreement(masterAgreement.id);
            };


            openCreateOrEditMasterAgreement = function (expenseId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/masterAgreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.masterAgreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',

                });
                modalInstance.result.then(function (result) {
                    vm.getmasterAgreements();
                });
            }

            vm.viewMasterAgreement = function (masterAgreement) {
                openViewMasterAgreementModal(masterAgreement.id);
            };

            openViewMasterAgreementModal = function (expenseId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/masterAgreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.masterAgreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',

                });

            }

            vm.masterAgreementModal = function (agreement) {
                openMasterAgreementModal(agreement);
            };

            openMasterAgreementModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/masterAgreements/masterAgreementModal.cshtml',
                    controller: 'tenant.views.crs.lease.masterAgreements.masterAgreementModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                    }
                });
            };

            vm.extendAgreements = function (masterAgreement) {
                extendMasterAgreement(masterAgreement.id);
            };

            extendMasterAgreement = function (masterAgreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/masterAgreements/extendAgreements.cshtml',
                    controller: 'tenant.views.crs.lease.masterAgreements.extendAgreements as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return masterAgreement;
                        },
                    }
                });
            };

            
            vm.printMasterAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };

            function openPrintAgreementModal(masterAgreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/masterAgreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.lease.masterAgreements.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        masterAgreementId: function () {
                            return masterAgreementId;
                        }
                    }
                });
            }

            vm.approveMasterAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Master Agreement', agreement.agreementNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            masterAgreementService.approveMasterAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getmasterAgreements();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getmasterAgreements();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            function init() {
                vm.getmasterAgreements();
                getStatuses();
            }
            init();
        }]);
