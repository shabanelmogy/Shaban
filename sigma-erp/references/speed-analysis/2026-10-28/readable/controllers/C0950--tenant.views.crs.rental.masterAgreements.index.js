// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:256632-257056
appModule.controller('tenant.views.crs.rental.masterAgreements.index', [
        '$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.rentalMasterAgreement',
        function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, masterAgreementService) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.isDetailMasterAgreement = abp.auth.hasPermission('Pages.Tenant.Rental.MasterAgreement.Detail');
            vm.isApproveMasterAgreement = abp.auth.hasPermission('Pages.Tenant.Rental.MasterAgreement.Approve');
            vm.isPrintMasterAgreement = abp.auth.hasPermission('Pages.Tenant.Rental.MasterAgreement.Print');

            vm.vehicles = [];
            vm.customers = [];
            vm.statuses = [];

            vm.filters = {
                voucherNo: null,
                vehicleId: null,
                fromDate: null,
                toDate: null,
                customerId: null,
                inquiryReferenceNo: null,
                approvedTypes: null,
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

            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];

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

                masterAgreementService.getMasterRentalAgreements(vm.filters).success(function (data) {

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
            //vm.viewApprovals = function (row) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/common/approval/approvalViewModal.cshtml',
            //        controller: 'tenant.views.common.approval.approvalViewModal as vm',
            //        backdrop: 'static',
            //        size: 'xl',
            //        resolve: {
            //            approvalId: function () {
            //                return row.approvalId;
            //            },
            //            form: function () {
            //                return 6;
            //            },
            //            recordId: function () {
            //                return row.id;
            //            },
            //            formValue: function () {
            //                return row;
            //            }
            //        }
            //    })
            //    modalInstance.result.then(function (result) {
            //        vm.getCompanies();
            //    });
            //};
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
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.isPrintMasterAgreement" ng-click="grid.appScope.printMasterAgreement(row.entity)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isPrintMasterAgreement" ng-click="grid.appScope.returnVoucherMasterAgreement(row.entity)">' + app.localize('Print(Return)') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isPrintMasterAgreement" ng-click="grid.appScope.deliveryNoteMasterAgreement(row.entity)">' + app.localize('Print(DeliveryNote)') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isDetailMasterAgreement" ng-click="grid.appScope.masterAgreementModal(row.entity)">' + app.localize('Detail') + '</a></li>' +
                            '       <li><a ng-if=" !row.entity.isApproved && grid.appScope.isApproveMasterAgreement" ng-click="grid.appScope.approveMasterAgreement(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: 'Master Agreement No',
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
                        name: 'Date',
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Customer',
                        field: 'quotation.customer.name'
                    },
                    {
                        name: 'CustomerCode',
                        field: 'quotation.customer.code'
                    },
                    {
                        name: 'Quotation No',
                        field: 'quotation.quotationNo'
                    },
                    {
                        name: 'PO',
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

            openCreateOrEditMasterAgreement = function (expenseId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/masterAgreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.rental.masterAgreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',

                });
                modalInstance.result.then(function (result) {
                    vm.getmasterAgreements();
                });
            }

            openViewMasterAgreementModal = function (expenseId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/masterAgreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.rental.masterAgreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',

                });

            }
            openMasterAgreementModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/masterAgreements/masterAgreementModal.cshtml',
                    controller: 'tenant.views.crs.rental.masterAgreements.masterAgreementModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                    }
                });
            };

            vm.createmasterAgreement = function () {

                openCreateOrEditMasterAgreement(null);
            };

            vm.editMasterAgreement = function (masterAgreement) {
                openCreateOrEditMasterAgreement(masterAgreement.id);
            };



            vm.printMasterAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };

            vm.returnVoucherMasterAgreement = function (agreement) {
                openReturnVoucherModal(agreement.id);
            };
            vm.deliveryNoteMasterAgreement = function (agreement) {
                openDeliveryNoteModal(agreement.id);
            };

            function openReturnVoucherModal(masterAgreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/masterAgreements/printtemplates/print.cshtml',
                    controller: 'tenant.views.crs.rental.masterAgreements.printtemplates.print as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        masterAgreementId: function () {
                            return masterAgreementId;
                        }
                    }
                });

            }
            function openDeliveryNoteModal(masterAgreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/masterAgreements/printtemplates/printDeliveryNote.cshtml',
                    controller: 'tenant.views.crs.rental.masterAgreements.printtemplates.printDeliveryNote as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        masterAgreementId: function () {
                            return masterAgreementId;
                        }
                    }
                });

            }
            function openPrintAgreementModal(masterAgreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/masterAgreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.rental.masterAgreements.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        masterAgreementId: function () {
                            return masterAgreementId;
                        }
                    }
                });
            }

            vm.viewMasterAgreement = function (masterAgreement) {
                openViewMasterAgreementModal(masterAgreement.id);
            };
            vm.masterAgreementModal = function (agreement) {
                openMasterAgreementModal(agreement);
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
