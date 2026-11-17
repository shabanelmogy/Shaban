// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:246228-246745
appModule.controller('tenant.views.crs.limousine.quotations.index', ['$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.limoQuotation', 'utilities',
        function ($scope, $uibModal, directoryService, uiGridConstants, limoQuotationService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isNoOfTripsInLimoEnabled = utilities.parseBoolean(abp.setting.get("App.General.Limo.NoOfTripsInLimo"));

            vm.customers = [];
            vm.statuses = [];
            vm.filters = {
                customerId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Limousine.Quotations'),
                create: abp.auth.hasPermission('Pages.Tenant.Limousine.Quotations.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Limousine.Quotations.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.Limousine.Quotations.Delete'),
                revise: abp.auth.hasPermission('Pages.Tenant.Limousine.Quotations.Revise'),
                createLimoTrip: abp.auth.hasPermission('Pages.Tenant.Limousine.Quotations.CreateLimoTrip'),
                approval: abp.auth.hasPermission('Pages.Tenant.Limousine.Quotations.Approval'),
                customerApproval: abp.auth.hasPermission('Pages.Tenant.Limousine.Quotations.CustomerApproval')
            };



            vm.getStatus = function (code) {
                if (code === 1)
                    return "Pending";
                else if (code === 2)
                    return "Approved";
                else if (code === 3)
                    return "Rejected";
                else if (code === 4)
                    return "Revised";
                else
                    return "Pending";
            };
            vm.getTripsStatus = function (code) {
                if (code === true)
                    return "Close";
                else if (code == false)
                    return "Open";
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: "Pending" }, { id: 2, name: "Approved" }, { id: 3, name: "Rejected" }];
                vm.customerApprovalStatuses = [{ id: 1, name: "Pending" }, { id: 2, name: "Approved" }, { id: 3, name: "Rejected" }, { id: 4, name: "Revised" }];
            };


            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeUnApproved: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            var quotationStatuses = {
                Pending: 1,
                Approved: 2,
                Rejected: 3,
                Revised: 4
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
                        debugger;
                        vm.filters.customer = customer;
                        vm.filters.customerId = customer.id;
                    }
                });
            };



            vm.getLimoQuotations = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                limoQuotationService.getQuotations(vm.filters).success(function (data) {
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
                //if (vm.filters.customer != null)
                //    vm.filters.contact = vm.filters.customer.name;
                //if (vm.filters.vehicle != null)
                //    vm.filters.vehicleId = vm.filters.vehicle.id;
                limoQuotationService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.canCreateLimoTripForNoOfTrips = function (entity) {
                if (vm.permissions.createLimoTrip
                    && entity.status == quotationStatuses.Approved
                    && entity.customerStatus == quotationStatuses.Approved
                    && vm.isNoOfTripsInLimoEnabled
                    && !entity.quantityCheckStatus) { // Show when status is Open (true)
                    return true;
                }
                return false;
            };


            vm.canCreateLimoTrip = function (entity) {
                // var status = false;
                if (vm.permissions.createLimoTrip
                    && entity.status == quotationStatuses.Approved
                    && entity.customerStatus == quotationStatuses.Approved
                    && !entity.isTripCreated)
                    return true;

                return false;
            }

            vm.canRevise = function (entity) {

                if (vm.permissions.revise
                    && entity.status == quotationStatuses.Approved
                    && entity.customerStatus == quotationStatuses.Pending)
                    return true;

                return false;
            }

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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewLimoQuotation(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.approval && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.approveQuotation(row.entity)">' + app.localize('InternallyApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.approval && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.rejectQuotation(row.entity)">' + app.localize('InternallyReject') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.customerApproval && row.entity.status == 2 && row.entity.customerStatus == 1" ng-click="grid.appScope.approveQuotationByCustomer(row.entity)">' + app.localize('ApproveByCustomer') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.customerApproval && row.entity.status == 2 && row.entity.customerStatus == 1" ng-click="grid.appScope.rejectQuotationByCustomer(row.entity)">' + app.localize('RejectByCustomer') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.quotationPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +

                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.editNewLeaseQuotation(row.entity,false)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canRevise(row.entity)" ng-click="grid.appScope.editNewLeaseQuotation(row.entity,true)">' + app.localize('Revise') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canCreateLimoTripForNoOfTrips(row.entity)" ng-click="grid.appScope.createLimoTrip(row.entity.id)">' + app.localize('CreateLimoTrip') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.deleteLimoQuotation(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'No',
                        field: 'quotationNo'
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
                        field: 'customer.name'
                    },
                    {
                        name: 'Internal Approval',
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span class="pull-right label label-success" style="background-color:#A9A9A9;font-size:11px;margin:7px" ng-show="row.entity.status === 1">{{ grid.appScope.getStatus(row.entity.status) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#26C281;font-size:11px;margin:7px" ng-show="row.entity.status === 2">{{ grid.appScope.getStatus(row.entity.status) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#E43A45;font-size:11px;margin:7px" ng-show="row.entity.status === 3">{{ grid.appScope.getStatus(row.entity.status) }}</span>' +
                            '</div>'
                    },
                    {
                        name: 'Customer Approval',
                        field: 'customerStatus',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span class="pull-right label label-success" style="background-color:#A9A9A9;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 1">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#26C281;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 2">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#E43A45;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 3">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#FFD433;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 4">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '</div>'
                    },
                    {
                        name: 'Status(NoOfTrips)',
                        field: 'quantityCheckStatus',
                        visible: vm.isNoOfTripsInLimoEnabled,
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<span class="pull-right label label-success" style="background-color:#E43A45;font-size:11px;margin:7px" ng-show="row.entity.quantityCheckStatus === true">{{ grid.appScope.getTripsStatus(row.entity.quantityCheckStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#26C281;font-size:11px;margin:7px" ng-show="row.entity.quantityCheckStatus === false">{{ grid.appScope.getTripsStatus(row.entity.quantityCheckStatus) }}</span>' +
                            '</div>'
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

                        vm.getLimoQuotations();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getLimoQuotations();
                    });
                },
                data: []
            };

            vm.quotationPrintModal = function (quotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/quotations/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.limousine.quotations.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        quotationId: function () {
                            return quotationId;
                        }
                    }
                });
            };


            vm.createLimoTrip = function (quotationId) {
                var tripId = null;
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
                                contact: null,
                                isCustomerLogin: null,
                                quotationId: quotationId,
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLimoQuotations();
                });
            };

            vm.viewLimoQuotation = function (quotation) {
                openViewLimoQuotationModal(quotation.id);
            };

            openViewLimoQuotationModal = function (quotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/quotations/viewModal.cshtml',
                    controller: 'tenant.views.crs.limousine.quotations.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        quotationId: function () {
                            return quotationId;
                        },
                        isRevised: function () {
                            return false;
                        },
                    }

                });
            };



            vm.createNewQuotation = function () {
                openCreateOrEditQuotationModal(null, false);
            };

            vm.editNewLeaseQuotation = function (quotation, isRevised) {
                openCreateOrEditQuotationModal(quotation.id, isRevised);
            };

            openCreateOrEditQuotationModal = function (quotationId, isRevised) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/quotations/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.limousine.quotations.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        quotationId: function () {
                            return quotationId;
                        },
                        isRevised: isRevised,
                        inquiryId: null
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getLimoQuotations();
                });
            }


            vm.deleteLimoQuotation = function (quotation) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            limoQuotationService.deleteQuotation({
                                id: quotation.id
                            }).success(function () {
                                vm.getLimoQuotations();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.approveQuotation = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            limoQuotationService.approveQuotation({
                                id: quotation.id
                            }).success(function () {
                                vm.getLimoQuotations();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };
            vm.rejectQuotation = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Rental Quotation?");
                        },
                        title: function () {
                            return app.localize('RentalQuotation');
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    quotation.rejectionReason = result;
                    rejectRentalQuotationRequest(quotation);
                });

            };

            function rejectRentalQuotationRequest(quotation) {
                var input = {};
                input.id = quotation.id

                input.rejectionReason = quotation.rejectionReason;
                limoQuotationService.rejectQuotation(input)
                    .success(function () {
                        vm.getLimoQuotations();
                        abp.notify.success(app.localize('SuccessfullyRejected'));
                    });
            }
            vm.rejectQuotationByCustomer = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Rental Quotation?");
                        },
                        title: function () {
                            return app.localize('RentalQuotation');
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    quotation.rejectionReason = result;
                    rejectLimoQuotationByCustomer(quotation);
                });

            };

            function rejectLimoQuotationByCustomer(quotation) {
                var input = {};
                input.id = quotation.id

                input.rejectionReason = quotation.rejectionReason;
                limoQuotationService.rejectQuotationByCustomer(input)
                    .success(function () {
                        vm.getLimoQuotations();
                        abp.notify.success(app.localize('SuccessfullyRejected'));
                    });


            }

            vm.approveQuotationByCustomer = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            limoQuotationService.approveQuotationByCustomer({
                                id: quotation.id
                            }).success(function () {
                                vm.getLimoQuotations();
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
                    vm.getLimoQuotations();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            function init() {
                vm.getLimoQuotations();
                getStatuses();
            }
            init();
        }]);
