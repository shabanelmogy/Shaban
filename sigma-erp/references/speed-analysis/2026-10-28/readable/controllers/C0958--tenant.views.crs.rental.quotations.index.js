// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:258524-259316
appModule.controller('tenant.views.crs.rental.quotations.index', ['$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.rentalQuotation', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, rentalQuotationService, commonLookupService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.paymentAndAddCardInQuotation = abp.features.isEnabled('OnlinePayments.Quotation.PaymentAndAddCardInQuotation');
            vm.isRentalMasterAgreementEnabled = abp.features.isEnabled('CRS.Rental.Agreements.MasterAgreement');

            vm.vehicles = [];
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
                view: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations'),
                create: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.Delete'),
                revise: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.Revise'),
                createSaleOrder: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.CreateSaleOrder'),
                approval: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.Approval'),
                createMasterAgreement: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.CreateMasterAgreement'),
                customerApproval: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.CustomerApproval'),
                paymentAndAddCardInQuotation: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.PaymentAndAddCardInQuotation')
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

            vm.canCreateMasterAgreement = function (entity) {
                if (entity.status == quotationStatuses.Approved && entity.customerStatus == quotationStatuses.Approved)
                    return true;

                return false;
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
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            vm.getRentalQuotations = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                rentalQuotationService.getQuotations(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
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
                rentalQuotationService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.canCreateLPO = function (entity) {
                // var status = false;
                if (vm.permissions.createSaleOrder
                    && entity.status == quotationStatuses.Approved
                    && entity.customerStatus == quotationStatuses.Approved
                    && entity.customer.contactCategory == 2)
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewRentalQuotation(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.approval && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.approveQuotation(row.entity)">' + app.localize('InternallyApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.approval && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.rejectQuotation(row.entity)">' + app.localize('InternallyReject') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.customerApproval && row.entity.status == 2 && row.entity.customerStatus == 1" ng-click="grid.appScope.approveQuotationByCustomer(row.entity)">' + app.localize('ApproveByCustomer') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.customerApproval && row.entity.status == 2 && row.entity.customerStatus == 1" ng-click="grid.appScope.rejectQuotationByCustomer(row.entity)">' + app.localize('RejectByCustomer') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.quotationPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-click="grid.appScope.leaseQuotationPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a target="_blank" ng-href="/Report#/tenant/printLeaseQuotation/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            //'      <li><a ng-if="row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.editLeaseQuotation(row.entity,false)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.editNewLeaseQuotation(row.entity,false)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canRevise(row.entity)" ng-click="grid.appScope.editNewLeaseQuotation(row.entity,true)">' + app.localize('Revise') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.paymentAndAddCardInQuotation && grid.appScope.paymentAndAddCardInQuotation && !(row.entity.advanceAmount> 0) && !row.entity.customer.hasCard && row.entity.customerStatus === 2"><a ng-click="grid.appScope.paymentAndAddCardInQuotation(row.entity)">' + app.localize('SendPaymentAndAddCardLink') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canCreateLPO(row.entity) && !row.entity.purchaseOrdersCreated" ng-click="grid.appScope.createLPOonQuotation(row.entity.id)">' + app.localize('CreateSaleOrder') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canCreateMasterAgreement(row.entity) && grid.appScope.permissions.createMasterAgreement && grid.appScope.isRentalMasterAgreementEnabled && !row.entity.masterAgreementCreated" ng-click="grid.appScope.createMasterAgreement(row.entity)">' + app.localize('CreateMasterAgreement') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.paymentAndAddCardInQuotation && grid.appScope.paymentAndAddCardInQuotation && !(row.entity.advanceAmount> 0) && row.entity.customer.hasCard && row.entity.customerStatus === 2"><a ng-click="grid.appScope.openSilentPaymentModal(row.entity)">' + app.localize('ChargeCard') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status !== 2 && row.entity.status !== 3" ng-click="grid.appScope.deleteLeaseQuotation(row.entity)">' + app.localize('Delete') + '</a></li>' +
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
                        field: 'customer.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span>{{row.entity.customer.name}} <span ng-if="row.entity.customer.hasCard" class="label label-warning" style="margin-left:3px;">CC</span></span> </div>' +
                            '</div>'
                    },
                    {
                        name: 'CustomerCode',
                        field: 'customer.code',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"> {{row.entity.customer.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Amount',
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"> {{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
                            '</div>'
                    },
/*                    {
                        name: app.localize('Name'),
                        field: 'firstName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isAddCardEnabled && row.entity.hasCard" class="label label-warning">CC</span><span>{{row.entity.nameToShow}}</span></div>' +
                            '</div>'
                    },*/

               /*     {
                        name: 'Amount',
                        field: 'amount',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.amount)}}</div>' +
                        '</div>'
                    },*/
                    //{
                    //    name: 'Status',
                    //    field: 'status',
                    //    cellTemplate:
                    //    '<div class=\"ui-grid-cell\">' +
                    //    '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatus(row.entity.status)}}</div>' +
                    //    '</div>'
                    //},
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


                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getRentalQuotations();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getRentalQuotations();
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

            vm.createMasterAgreement = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/masterAgreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.rental.masterAgreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                quotationId: quotation.id,
                                quotationNo: quotation.quotationNo,
                                customer: quotation.customer,
                                date: quotation.date
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getRentalQuotations();
                });
            };

            vm.paymentAndAddCardInQuotation = (entity) => {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/quotationalPayment.cshtml',
                    controller: 'tenant.views.common.payments.quotationalPayment as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        data: () => {
                            return {
                                source: 'addCard',
                                quotationNo: entity.quotationNo,
                                quotationId: entity.id,
                                customerId: entity.customerId,
                                customerName: entity.customer.name,
                                customerEmail: entity.customer.email,
                                amount: entity.amount,
                                hasCard: entity.hasCard
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getRentalQuotations();
                });
            }
            vm.openSilentPaymentModal = (entity) => {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/silentPayment.cshtml',
                    controller: 'tenant.views.common.payments.silentPayment as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        data: () => {
                            return {
                                quotationId: entity.id,
                                customerId: entity.customerId,
                               /* amount: quotation.advanceAmount,*/
                                dueAmount: entity.dueAmount,
                                source: 'quotation'
                            }
                        }
                    }
                });
                modalInstance.result.then(result => {

                });
            }

            openCreateOrEditLeaseQuotation = function (quotationId, isRevised) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        leaseQuotationId: function () {
                            return quotationId;
                        },
                        isRevised: isRevised

                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getRentalQuotations();
                });
            }

            openCreateOrEditQuotationModal = function (quotationId, isRevised) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/quotations/createOrEditQuotationModal.cshtml',
                    controller: 'tenant.views.crs.rental.quotations.createOrEditQuotationModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        quotationId: function () {
                            return quotationId;
                        },
                        isRevised: isRevised,
                        inquiryId: null
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getRentalQuotations();
                });
            }

            //vm.createMasterAgreement = function (quotation) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/lease/masterAgreements/createOrEditModal.cshtml',
            //        controller: 'tenant.views.crs.lease.masterAgreements.createOrEditModal as vm',
            //        backdrop: 'static',
            //        size: 'md',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    quotationId: quotation.id,
            //                    quotationNo: quotation.quotationNo,
            //                    date: quotation.date
            //                };
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //        vm.getRentalQuotations();
            //    });
            //};



            vm.quotationPrintModal = function (quotationId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/quotations/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.rental.quotations.printtemplates.printPreview as vmMain',
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
                                type:'rental'
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getRentalQuotations();
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

            openViewRentalQuotationModal = function (quotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/quotations/viewModal.cshtml',
                    controller: 'tenant.views.crs.rental.quotations.viewModal as vm',
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

            openProcessQuotationModal = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/processQuotationModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.processQuotationModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        leaseQuotation: function () {
                            return quotation;
                        }
                    }
                });

            }
            openlogLeaseQuotationModal = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/logLeaseQuotationModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.logLeaseQuotationModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaseQuotation: function () {
                            return quotation;
                        }
                    }
                });

            }

            vm.createNewQuotation = function () {
                openCreateOrEditQuotationModal(null, false);
            };

            vm.editNewLeaseQuotation = function (quotation, isRevised) {
                openCreateOrEditQuotationModal(quotation.id, isRevised);
            };

            vm.createLeaseQuotation = function () {
                openCreateOrEditLeaseQuotation(null, false);
            };

            vm.editLeaseQuotation = function (quotation, isRevised) {
                openCreateOrEditLeaseQuotation(quotation.id, isRevised);
            };

            vm.viewRentalQuotation = function (quotation) {
                openViewRentalQuotationModal(quotation.id);
            };

            vm.processLeaseQuotation = function (quotation) {
                openProcessQuotationModal(quotation);
            };
            vm.logLeaseQuotation = function (quotation) {
                openlogLeaseQuotationModal(quotation);
            };

            vm.deleteLeaseQuotation = function (quotation) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            rentalQuotationService.deleteQuotation({
                                id: quotation.id
                            }).success(function () {
                                vm.getRentalQuotations();
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
                            rentalQuotationService.approveQuotation({
                                id: quotation.id
                            }).success(function () {
                                vm.getRentalQuotations();
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
                rentalQuotationService.rejectQuotation(input)
                    .success(function () {
                        vm.getRentalQuotations();
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
                    rejectRentalQuotationByCustomer(quotation);
                });

            };

            function rejectRentalQuotationByCustomer(quotation) {
                var input = {};
                input.id = quotation.id

                input.rejectionReason = quotation.rejectionReason;
                rentalQuotationService.rejectQuotationByCustomer(input)
                    .success(function () {
                        vm.getRentalQuotations();
                        abp.notify.success(app.localize('SuccessfullyRejected'));
                    });


            }

            vm.approveQuotationByCustomer = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            rentalQuotationService.approveQuotationByCustomer({
                                id: quotation.id
                            }).success(function () {
                                vm.getRentalQuotations();
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
                    vm.getRentalQuotations();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            function init() {
                vm.getRentalQuotations();
                getLocationsActiveAndInActive();
                getStatuses();
            }
            init();
        }]);
