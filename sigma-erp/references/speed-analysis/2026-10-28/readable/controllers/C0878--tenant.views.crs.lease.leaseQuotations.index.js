// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:239928-240563
appModule.controller('tenant.views.crs.lease.leaseQuotations.index', ['$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.leaseQuotation',
        function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, leaseQuotationService) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.vehicles = [];
            vm.customers = [];
            vm.statuses = [];
            vm.filters = {
                customerId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations'),
                create: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.Delete'),
                revise: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.Revise'),
                createPOOption: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.CreatePOOption'),
                createMasterAgreement:true, //abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.CreateMasterAgreement'),this line should uncomment after 7/72023 
                // createSaleOrder: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.CreateSaleOrder'),
                approval: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.Approval'),
                customerApproval: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.CustomerApproval')
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
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

            function getStatuses() {
                vm.statuses = [{ id: 1, name: "Pending" }, { id: 2, name: "Approved" }, { id: 3, name: "Rejected" }];
                vm.customerApprovalStatuses = [{ id: 1, name: "Pending" }, { id: 2, name: "Approved" }, { id: 3, name: "Rejected" }, { id: 4, name: "Revised" }];
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
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
                        vm.filters.customer = customer;
                        vm.filters.customer = customer.id;
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

            vm.getLeaseQuotations = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                leaseQuotationService.getLeaseQuotations(vm.filters).success(function (data) {
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
                leaseQuotationService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.canCreateMasterAgreementAndPO = function (entity) {
                // var status = false;
                if (entity.status == quotationStatuses.Approved && entity.customerStatus == quotationStatuses.Approved)
                    return true;

                return false;
            };

            vm.canRevise = function (entity) {

                if (vm.permissions.revise && entity.status == quotationStatuses.Approved && entity.customerStatus == quotationStatuses.Pending)
                    return true;

                return false;
            };

            vm.createLPOonQuotation = function (quotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/saleOrders/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.saleOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                saleOrderId: null,
                                quotationId: quotationId,
                                type: 'lease'
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseQuotations();
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
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewLeaseQuotation(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.approval && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.approveLeaseQuotation(row.entity)">' + app.localize('InternallyApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.approval && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.rejectLeaseQuotation(row.entity)">' + app.localize('InternallyReject') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.customerApproval && row.entity.status == 2 && row.entity.customerStatus == 1" ng-click="grid.appScope.approveLeaseQuotationByCustomer(row.entity)">' + app.localize('ApproveByCustomer') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.customerApproval && row.entity.status == 2 && row.entity.customerStatus == 1" ng-click="grid.appScope.rejectLeaseQuotationByCustomer(row.entity)">' + app.localize('RejectByCustomer') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.leaseQuotationPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.createSaleOrder && !row.entity.purchaseOrdersCreated" ng-click="grid.appScope.createLPOonQuotation(row.entity.id)">' + app.localize('CreateSaleOrder') + '</a></li>' +
                            //'      <li><a target="_blank" ng-href="/Report#/tenant/printLeaseQuotation/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            //'      <li><a ng-if="row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.editLeaseQuotation(row.entity,false)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.editNewLeaseQuotation(row.entity,false)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canRevise(row.entity)" ng-click="grid.appScope.editNewLeaseQuotation(row.entity,true)">' + app.localize('Revise') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canCreateMasterAgreementAndPO(row.entity) && grid.appScope.permissions.createPOOption && !row.entity.purchaseOrdersCreated" ng-click="grid.appScope.createPOLeaseQuotation(row.entity)">' + app.localize('CreatePO') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canCreateMasterAgreementAndPO(row.entity) && grid.appScope.permissions.createMasterAgreement && !row.entity.masterAgreementCreated" ng-click="grid.appScope.createMasterAgreement(row.entity)">' + app.localize('CreateMasterAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.deleteLeaseQuotation(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        field: 'quotationNo'
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
                        field: 'customer.name',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.customer.name}} </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerCode'),
                        field: 'customer.code',
                        width: 150,
                        
                    },
                    //{
                    //    name: 'Amount',
                    //    field: 'amount',
                    //    cellTemplate:
                    //    '<div class=\"ui-grid-cell\">' +
                    //    '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.amount)}}</div>' +
                    //    '</div>'
                    //},
                    //{
                    //    name: 'Status',
                    //    field: 'status',
                    //    cellTemplate:
                    //    '<div class=\"ui-grid-cell\">' +
                    //    '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatus(row.entity.status)}}</div>' +
                    //    '</div>'
                    //},
                    {
                        name: app.localize('InternalApproval'),
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span class="pull-right label label-success" style="background-color:#A9A9A9;font-size:11px;margin:7px" ng-show="row.entity.status === 1">{{ grid.appScope.getStatus(row.entity.status) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#26C281;font-size:11px;margin:7px" ng-show="row.entity.status === 2">{{ grid.appScope.getStatus(row.entity.status) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#E43A45;font-size:11px;margin:7px" ng-show="row.entity.status === 3">{{ grid.appScope.getStatus(row.entity.status) }}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerApproval'),
                        field: 'customerStatus',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span class="pull-right label label-success" style="background-color:#A9A9A9;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 1">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#26C281;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 2">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#E43A45;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 3">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#FFD433;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 4">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
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

                        vm.getLeaseQuotations();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getLeaseQuotations();
                    });
                },
                data: []
            };

            vm.leaseQuotationPrintModal = function (leaseQuotationId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        leaseQuotationId: function () {
                            return leaseQuotationId;
                        }
                    }
                });
            };

            openCreateOrEditLeaseQuotation = function (leaseQuotationId, isRevised) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        leaseQuotationId: function () {
                            return leaseQuotationId;
                        },
                        isRevised: isRevised

                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseQuotations();
                });
            };

            openCreateOrEditQuotationModal = function (leaseQuotationId, isRevised) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/createOrEditQuotationModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        leaseQuotationId: function () {
                            return leaseQuotationId;
                        },
                        isRevised: isRevised,
                        inquiryId: null
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseQuotations();
                });
            };

            vm.createMasterAgreement = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/masterAgreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.masterAgreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                quotationId: quotation.id,
                                quotationNo: quotation.quotationNo,
                                date: quotation.date
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseQuotations();
                });
            };

            vm.createPOLeaseQuotation = function (leaseQuotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    //resolve: {
                    //    purchaseOrderId: function () {
                    //        return purchaseOrderId;
                    //    }
                    //}
                    resolve: {
                        options: function () {
                            return {
                                leaseQuotationId: leaseQuotationId.id
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseQuotations();
                });
            };

            //openViewLeaseQuotationModal = function (leaseQuotationId) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/viewModal.cshtml',
            //        controller: 'tenant.views.crs.lease.leaseQuotations.createOrEditModal as vm',
            //        backdrop: 'static',
            //        size: 'full',
            //        resolve: {
            //            leaseQuotationId: function () {
            //                return leaseQuotationId;
            //            },
            //            isRevised: function () {
            //                return false;
            //            },

            //        }

            //    });
            //};

            openViewLeaseQuotationModal = function (leaseQuotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/viewQuotationModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        leaseQuotationId: function () {
                            return leaseQuotationId;
                        },
                        isRevised: function () {
                            return false;
                        },
                        inquiryId: null
                    }

                });
            };

            openProcessQuotationModal = function (leaseQuotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/processQuotationModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.processQuotationModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        leaseQuotation: function () {
                            return leaseQuotation;
                        }
                    }
                });

            };
            openlogLeaseQuotationModal = function (leaseQuotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/logLeaseQuotationModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.logLeaseQuotationModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaseQuotation: function () {
                            return leaseQuotation;
                        }
                    }
                });

            };

            vm.createNewLeaseQuotation = function () {
                openCreateOrEditQuotationModal(null, false);
            };

            vm.editNewLeaseQuotation = function (LeaseQuotation, isRevised) {
                openCreateOrEditQuotationModal(LeaseQuotation.id, isRevised);
            };

            vm.createLeaseQuotation = function () {
                openCreateOrEditLeaseQuotation(null, false);
            };

            vm.editLeaseQuotation = function (LeaseQuotation, isRevised) {
                openCreateOrEditLeaseQuotation(LeaseQuotation.id, isRevised);
            };

            vm.viewLeaseQuotation = function (LeaseQuotation) {
                openViewLeaseQuotationModal(LeaseQuotation.id);
            };

            vm.processLeaseQuotation = function (leaseQuotation) {
                openProcessQuotationModal(leaseQuotation);
            };
            vm.logLeaseQuotation = function (leaseQuotation) {
                openlogLeaseQuotationModal(leaseQuotation);
            };

            vm.deleteLeaseQuotation = function (leaseQuotation) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', leaseQuotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            leaseQuotationService.deleteLeaseQuotation({
                                id: leaseQuotation.id
                            }).success(function () {
                                vm.getLeaseQuotations();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.approveLeaseQuotation = function (leaseQuotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', leaseQuotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            leaseQuotationService.approveLeaseQuotation({
                                id: leaseQuotation.id
                            }).success(function () {
                                vm.getLeaseQuotations();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            vm.rejectLeaseQuotation = function (leaseQuotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Reject Quotation', leaseQuotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            leaseQuotationService.rejectLeaseQuotation({
                                id: leaseQuotation.id
                            }).success(function () {
                                vm.getLeaseQuotations();
                                abp.notify.success(app.localize('SuccessfullyRejected'));
                            });
                        }
                    }
                );
            };


            vm.approveLeaseQuotationByCustomer = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            leaseQuotationService.approveQuotationByCustomer({
                                id: quotation.id
                            }).success(function () {
                                vm.getLeaseQuotations();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            vm.rejectLeaseQuotationByCustomer = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Reject Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            leaseQuotationService.rejectQuotationByCustomer({
                                id: quotation.id
                            }).success(function () {
                                vm.getLeaseQuotations();
                                abp.notify.success(app.localize('SuccessfullyRejected'));
                            });
                        }
                    }
                );
            };


            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getLeaseQuotations();
                    eventOnKeyPress.preventDefault();
                }
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            function init() {
                vm.getLeaseQuotations();
                getStatuses();
            }
            init();
        }]);
