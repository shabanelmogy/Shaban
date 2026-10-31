// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:165503-166062
appModule.controller('tenant.views.crs.banking.chequesPayables.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.chequesPayables', 'abp.services.app.billingMethod', 'appSession', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $uibModal, uiGridConstants, directoryService, chequesPayablesService, billingMethodService, appSession, commonLookupService, utilities) {
            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isPdcPayableEnabled = abp.features.isEnabled("CRS.CustomFeatures.PdcPayableWithoutFinancialEffect");
            vm.isBulkConvertPdcToCdc = abp.features.isEnabled("CRS.CustomFeatures.BulkConvertPdcToCdc");
            vm.isImportPDCPayableEnabled = abp.features.isEnabled("CRS.CustomFeatures.ImportPDCPayable");
            vm.isAllowPDCPrintingBeforeClearanceEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowPDCPrintingBeforeClearance"));
            vm.isChequeBatchEnabled = abp.features.isEnabled("CRS.Vouchers.ChequeBatch");
            vm.mandatoryBatchNoCP = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MandatoryBatchNoCP"));
            vm.additionalBatchNoCP = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AdditionalBatchNoCP"));
            vm.permissions = {
                editPDC: abp.auth.hasPermission('Pages.Tenant.Banking.ChequesPayables.EditNonFinancialPDC'),
                deletePDC: abp.auth.hasPermission('Pages.Tenant.Banking.ChequesPayables.DeleteNonFinancialPDC'),
                bulkConvertPdcToCdc: abp.auth.hasPermission('Pages.Tenant.Banking.ChequesPayables.BulkConvertPdcToCdc')
            };

            vm.chequeStatus =
                [{ status: "Pending", id: 1 },
                //{ status: "Deposited", id: 2 },
                { status: "Cleared", id: 3 },
                { status: "Cancelled", id: 4 }
                ];
            vm.billingMethods = [];

            vm.filters = {
                enableDateRange: true,
                chequeNo: null,
                contactId: null,
                fromDate: null,
                toDate: null,
                amount: null,
                dateTimeType: 4,
                skipCount: 0,
                status: null,
                voucherNo: null,
                maxResultCount: app.consts.grid.defaultPageSize,
                billingMethodId: null,
                batchNo: null,
                refNo:null
            };

            vm.ids = [];
            vm.printAll = function (id) {
                vm.ids = [];
                if (id) {
                    vm.ids.push(id);
                }
                else {
                    angular.forEach(vm.gridOptions.data, function (chequesPayables) {
                        vm.ids.push(chequesPayables.id);
                    });
                    vm.printIds = {
                        ids: vm.ids,
                    };
                }
            };


            vm.locations = [];

            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({
                }).success(function (data) {
                    vm.locations = data.items;
                });
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };


            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId !== appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.searchCustomers = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, activeOnly: true }).then(function (response) {
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
                    if (customer !== null) {
                        vm.filters.customer = customer;
                        vm.filters.contactId = customer.id;
                    }
                });
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getChequeStatus = function (status) {
                if (status === 1)
                    return 'Pending';
                else if (status === 2)
                    return 'Deposited';
                else if (status === 3)
                    return 'Cleared';
                else if (status === 4)
                    return 'Cancelled';

            }
            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            vm.getChequesPayables = function () {

                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                chequesPayablesService.getChequesPayables(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    vm.gridOptions.data.forEach(function (value) {
                        value.printObj = {
                            id: value.id,
                            voucherNo: value.voucherNo
                        };
                    });
                    vm.printAll(null);
                }).finally(function () {
                    vm.loading = false;
                });

            };

            function openMatureChequeModal(receipt) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesPayables/matureChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesPayables.matureChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return receipt;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesPayables();
                });
            }

            vm.getReportUrl = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.encodedFilters = encodeURIComponent(JSON.stringify(vm.filters).replace(/\//g, ''));
                return "/Report#/tenant/chequePayablesReport/" + vm.encodedFilters;
            };

            function openCancelChequeModal(receipt) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesPayables/cancelChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesPayables.cancelChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return receipt;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesPayables();
                });
            }

            vm.matureCheque = function (receipt) {

                openMatureChequeModal(receipt);
            };

            vm.cancelCheque = function (receipt) {

                openCancelChequeModal(receipt);
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getChequesPayables();
                    eventOnKeyPress.preventDefault();
                }
            };

            vm.getMaturePendingPayableCheques = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesPayables/maturePendingPayableCheque.cshtml',
                    controller: 'tenant.views.crs.banking.chequesPayables.maturePendingPayableCheque as vm',
                    backdrop: 'static',
                    size: 'lg',

                });

                modalInstance.result.then(function (result) {
                    vm.getChequesPayables();
                });
            };

            vm.bulkConvertPdcToCdc = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/bulkConvertPdcToCdc.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.bulkConvertPdcToCdc as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        chequeService: function () { return chequesPayablesService; },
                        isReceivable: function () { return false; }
                    }
                }).result.then(function () { vm.getChequesPayables(); }, function () { vm.getChequesPayables(); });
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
                            '      <li><a ng-if="row.entity.billingDetail.cheque.status!=3 && row.entity.billingDetail.cheque.status!=4 && row.entity.type!=33" ng-click="grid.appScope.matureCheque(row.entity)">' + app.localize('Mature') + '</a></li>' +
                            '      <li><a ng-if="row.entity.billingDetail.cheque.status!=3 && row.entity.billingDetail.cheque.status!=4 && row.entity.type==33  && (row.entity.isSystemGenerated==null ||row.entity.isSystemGenerated==false)" ng-click="grid.appScope.convertToCdc(row.entity)">' + app.localize('ConvertToCDC') + '</a></li>' +
                            '      <li><a ng-if="row.entity.billingDetail.cheque.status!=3 && row.entity.billingDetail.cheque.status!=4  && (row.entity.isSystemGenerated==null ||row.entity.isSystemGenerated==false)" ng-click="grid.appScope.cancelCheque(row.entity)">' + app.localize('CancelCheque') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.editPDC && row.entity.type==33  && (row.entity.isSystemGenerated==null ||row.entity.isSystemGenerated==false)" ng-click="grid.appScope.addPdcPayable(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.deletePDC && row.entity.type==33" ng-click="grid.appScope.deletePdcPayable(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isAllowPDCPrintingBeforeClearanceEnabled" ng-click="grid.appScope.printCheque(row.entity.printObj)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="!grid.appScope.isAllowPDCPrintingBeforeClearanceEnabled && row.entity.billingDetail.cheque.status==3" ng-click="grid.appScope.printCheque(row.entity.printObj)">' + app.localize('Print') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PaymentNo'),
                        //type: 'number',
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-if="row.entity.type!=33" class=\"ui-grid-cell-contents\">{{row.entity.voucherNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ChequeNo'),
                        //type: 'number',
                        field: 'billingDetail.cheque.chequeNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div  class=\"ui-grid-cell-contents\">{{row.entity.billingDetail.cheque.chequeNo}} <span  ng-if="row.entity.type==33" class="label label-danger">PDC</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ChequeDate'),
                        field: 'billingDetail.cheque.chequeDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.billingDetail.cheque.chequeDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('BatchNo'),
                        visible: vm.additionalBatchNoCP || vm.mandatoryBatchNoCP || vm.isChequeBatchEnabled,
                        field: 'billingDetail.cheque.batchNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div  class=\"ui-grid-cell-contents\">{{row.entity.billingDetail.cheque.batchNo}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('RefNo'),
                        field: 'billingDetail.cheque.chequesBatch.refNo',
                        visible: vm.isChequeBatchEnabled,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.billingDetail.cheque.chequesBatch.refNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Bank'),
                        field: 'billingDetail.cheque.bankAccount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.billingDetail.cheque.bankAccount.bankName}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Contact'),
                        field: 'contact.name'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount'
                    },
                    {
                        name: app.localize('status'),
                        field: 'billingDetail.cheque.status)',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getChequeStatus(row.entity.billingDetail.cheque.status)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Notes'),
                        field: 'notes'
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

                        vm.getChequesPayables();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getChequesPayables();
                    });
                },
                data: []
            };

            vm.getBankName = function (row) {
                return row.billingDetail.cheque.bankAccount.accountNo + " " + row.billingDetail.cheque.bankAccount.bankName;
            };



            vm.printCheque = function (filters) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesPayables/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.banking.chequesPayables.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return filters;
                        }
                    }
                });
            };

            vm.addPdcPayable = function (chequeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesPayables/pdcPayableModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesPayables.pdcPayableModal as vm',
                    backdrop: 'static',
                    resolve: {
                        chequeId: function () {
                            return chequeId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesPayables();
                });
            };
            vm.addPdcPayableBulk = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesPayables/addBulkCheckPayable.cshtml',
                    controller: 'tenant.views.crs.banking.chequesPayables.addBulkCheckPayable as vm',
                    backdrop: 'static',
                    size: 'xl'
                    //resolve: {
                    //    chequeId: function () {
                    //        return chequeId;
                    //    }
                    //}
                });


            };

            vm.deletePdcPayable = function (cheque) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            chequesPayablesService.deletePdcPayable({
                                id: cheque.id
                            }).success(function () {
                                vm.getChequesPayables();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.convertToCdc = function (row) {
                if (utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowDateSelectionOnPdcToCdcConversion"))) {
                    $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/convertToCdcModal.cshtml',
                        controller: 'tenant.views.crs.banking.chequesReceivables.convertToCdcModal as vm',
                        backdrop: 'static',
                        resolve: { row: function () { return row; } }
                    }).result.then(function (result) {
                        chequesPayablesService.convertToCdc({ id: row.id, date: result.date }).success(function () {
                            vm.getChequesPayables();
                            abp.notify.success(app.localize('SuccessfullyConvertToCDC'));
                        });
                    });
                    return;
                }
                abp.message.confirm(
                    app.localize(''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            chequesPayablesService.convertToCdc({
                                id: row.id
                            }).success(function () {
                                //vm.getBookings();
                                vm.getChequesPayables();
                                abp.notify.success(app.localize('SuccessfullyConvertToCDC'));
                            });
                        }
                    }
                );
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                //vm.dateRangeCheck();
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                chequesPayablesService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
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
                            return '~/App/tenant/views/crs/banking/chequesPayables/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.addChequeBatch = function (chequeBatchId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesPayables/createOrEditChequeBatchModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesPayables.createOrEditChequeBatchModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        chequeBatchId: function () {
                            return chequeBatchId;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    vm.getChequesPayables();
                });
            };
            function init() {
                initDate();
                getLocations();
                getBillingMethods();
                vm.getChequesPayables();
            }
            init();

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 2, type: 4 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
        }]);
