// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:167474-168073
appModule.controller('tenant.views.crs.banking.chequesReceivables.index', [
        'utilities', '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.chequesReceivables', 'appSession', 'abp.services.app.commonLookup',
        function (utilities, $scope, $uibModal, uiGridConstants, directoryService, chequesReceivablesService, appSession, commonLookupService) {
            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(300, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(300, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isPdcReceivableEnabled = abp.features.isEnabled("CRS.CustomFeatures.PdcReceivableWithoutFinancialEffect");
            vm.isBulkPdcReceivable = abp.features.isEnabled("CRS.CustomFeatures.CreateBulkPdcReceivable");
            vm.isBulkConvertPdcToCdc = abp.features.isEnabled("CRS.CustomFeatures.BulkConvertPdcToCdc");
            vm.isAllowedResubmitOnChequeReceivables = utilities.parseBoolean(abp.setting.get("App.General.AllowResubmitOnChequeReceivables"));
            vm.allowDateSelectionOnPdcToCdcConversion = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowDateSelectionOnPdcToCdcConversion"));
            vm.enablePostDatedChequeDirectlyToBank = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequeDirectlyToBank"));
            vm.mandatoryBatchNoCR = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MandatoryBatchNoCR"));
            vm.additionalBatchNoCR = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AdditionalBatchNoCR"));
            vm.isImportPDCReceivableEnabled = abp.features.isEnabled("CRS.CustomFeatures.ImportPDCReceivable");

            vm.chequeStatus =
                [
                    { status: "", id: null },
                    { status: "Pending", id: 1 },
                    //{ status: "Deposited", id: 2 },
                    { status: "Cleared", id: 3 },
                    { status: "Returned", id: 4 }
                ];

            vm.permissions = {
                editPDC: abp.auth.hasPermission('Pages.Tenant.Banking.ChequesReceivables.EditNonFinancialPDC'),
                deletePDC: abp.auth.hasPermission('Pages.Tenant.Banking.ChequesReceivables.DeleteNonFinancialPDC'),
                resubmitCheque: abp.auth.hasPermission('Pages.Tenant.Banking.ChequesReceivables.ResubmitCheque'),
                bulkConvertPdcToCdc: abp.auth.hasPermission('Pages.Tenant.Banking.ChequesReceivables.BulkConvertPdcToCdc')
            };

            vm.filters = {
                enableDateRange: true,
                chequeNo: null,
                batchNo: null,
                contactId: null,
                fromDate: null,
                toDate: null,
                amount: null,
                dateTimeType: 4,
                skipCount: 0,
                status: null,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.printAll = function (id) {
                vm.ids = [];

                if (id) {
                    vm.ids.push(id);
                } else {
                    angular.forEach(vm.gridOptions.data, function (chequesReceivable) {
                        // Only push the ID if cheque is not null and status is 3
                        if (chequesReceivable.cheque && chequesReceivable.cheque.status === 3) {
                            vm.ids.push(chequesReceivable.id);
                        }
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

            vm.addPdcReceivableBulk = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/addBulkCheckReceivable.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.addBulkCheckReceivable as vm',
                    backdrop: 'static',
                    size: 'xl'
                    //resolve: {
                    //    chequeId: function () {
                    //        return chequeId;
                    //    }
                    //}
                });


            };

            vm.chequeTypes = [
                {
                    id: 23,
                    name: app.localize('PdcReceivable')
                },
                {
                    id: 25,
                    name: app.localize('CDC')
                }];

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };


            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
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
                        vm.filters.contactId = customer.id;
                    }
                });
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function openMatureChequeModal(receipt) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/matureChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.matureChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return receipt;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesReceivables();
                });
            }

            function openReturnChequeModal(receipt) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/returnChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.returnChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return receipt;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesReceivables();
                });
            }

            function openBounceChequeModal(receipt) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/bounceChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.bounceChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return receipt;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesReceivables();
                });
            }

            vm.matureCheque = function (receipt) {
                openMatureChequeModal(receipt);
            };

            vm.returnCheque = function (receipt) {
                openReturnChequeModal(receipt);
            };

            vm.bounceCheque = function (receipt) {
                openBounceChequeModal(receipt);
            };

            vm.getChequeStatus = function (status) {
                if (status == 1)
                    return 'Pending';
                else if (status == 2)
                    return 'Deposited';
                if (status == 3)
                    return 'Cleared';
                if (status == 4)
                    return 'Returned';
                else
                    return "";
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            vm.getChequesReceivables = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                chequesReceivablesService.getChequesReceivables(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.totalCount = vm.gridOptions.totalItems;
                    vm.gridOptions.data = data.items;
                    vm.gridOptions.data.forEach(function (value) {
                        value.printObj = {
                            id: value.id,
                            voucherNo: value.voucherNo,
                            status: value.cheque ? value.cheque.status : null,
                        };
                    });
                    vm.printAll(null);
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getChequesReceivables();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.getReportUrl = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.encodedFilters = encodeURIComponent(JSON.stringify(vm.filters).replace(/\//g, ''));
                return "/Report#/tenant/chequeReceivables/" + vm.encodedFilters;
            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/banking/ChequesReceivables/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
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
                            '      <li><a ng-if="row.entity.cheque.status!=3 && row.entity.cheque.status!=4 && row.entity.type!=23" ng-click="grid.appScope.matureCheque(row.entity)">' + app.localize('ReceivableMature') + '</a></li>' +
                            '      <li><a ng-if="row.entity.cheque.status!=3 && row.entity.cheque.status!=4 && row.entity.type==23" ng-click="grid.appScope.convertToCdc(row.entity)">' + app.localize('ConvertToCDC') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.resubmitCheque && grid.appScope.isAllowedResubmitOnChequeReceivables && (row.entity.cheque.status==4 && row.entity.type!=23)" ng-click="grid.appScope.resubmitCheque(row.entity)">' + app.localize('ResubmitCheque') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.editPDC && row.entity.cheque.status!=3 && row.entity.cheque.status!=4 && row.entity.type==23" ng-click="grid.appScope.addOrEditPdcReceivable(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.deletePDC && row.entity.cheque.status!=3 && row.entity.cheque.status!=4 && row.entity.type==23" ng-click="grid.appScope.deletePdcReceivable(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="row.entity.cheque.status!=3 && row.entity.cheque.status!=4 && (grid.appScope.isPdcReceivableEnabled || row.entity.type!=23) && row.entity.type!=10" ng-click="grid.appScope.returnCheque(row.entity)">' + app.localize('ReturnCheque') + '</a></li>' +
                            '      <li><a ng-if="row.entity.canBounce && row.entity.type!=10" ng-click="grid.appScope.bounceCheque(row.entity)">' + app.localize('ReturnChequeBounce') + '</a></li>' +
                            '      <li><a ng-if="row.entity.cheque.status==3" ng-click="grid.appScope.ChequeReceivablePrintModal(row.entity.printObj)">' + app.localize('Print') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ReceiptNo'),
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-if="row.entity.type!=23" class=\"ui-grid-cell-contents\">{{row.entity.voucherNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ChequeNo'),
                        //type: 'number',
                        field: 'cheque.chequeNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div  class=\"ui-grid-cell-contents\">{{row.entity.cheque.chequeNo}} <span  ng-if="row.entity.type==23" class="label label-danger">PDC</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('ChequeDate'),
                        field: 'billingDetail.cheque.chequeDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.cheque.chequeDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('BatchNo'),
                        visible: vm.additionalBatchNoCR || vm.mandatoryBatchNoCR,
                        field: 'cheque.batchNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div  class=\"ui-grid-cell-contents\">{{row.entity.cheque.batchNo}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('ReceivableMatureDate'),
                        field: 'matureDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.matureDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Bank'),
                        field: 'cheque.bankName'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'contact.name'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        field: 'agreement.agreementNo',
                        width: 140,

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
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getChequeStatus(row.entity.cheque.status)}}</div>' +
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

                        vm.getChequesReceivables();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        

                        vm.getChequesReceivables();
                    });
                },
                data: []
            };

            vm.ChequeReceivablePrintModal = function (filters) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/ChequesReceivables/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.banking.ChequesReceivables.printtemplates.printPreview as vmMain',
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

            vm.getMaturePendingCheques = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/maturePendingCheque.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.maturePendingCheque as vm',
                    backdrop: 'static',
                    size: 'lg',

                });

                modalInstance.result.then(function (result) {
                    vm.getChequesReceivables();
                });
            };

            vm.bulkConvertPdcToCdc = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/bulkConvertPdcToCdc.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.bulkConvertPdcToCdc as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        chequeService: function () { return chequesReceivablesService; },
                        isReceivable: function () { return true; }
                    }
                }).result.then(function () { vm.getChequesReceivables(); }, function () { vm.getChequesReceivables(); });
            };

            vm.convertToCdc = function (row) {
                if (vm.allowDateSelectionOnPdcToCdcConversion) {
                    $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/convertToCdcModal.cshtml',
                        controller: 'tenant.views.crs.banking.chequesReceivables.convertToCdcModal as vm',
                        backdrop: 'static',
                        resolve: { row: function () { return row; } }
                    }).result.then(function (result) {
                        chequesReceivablesService.convertToCdc({ id: row.id, date: result.date }).success(function () {
                            vm.getChequesReceivables();
                            abp.notify.success(app.localize('SuccessfullyConvertToCDC'));
                        });
                    });
                    return;
                }
                abp.message.confirm(
                    app.localize(''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            chequesReceivablesService.convertToCdc({
                                id: row.id
                            }).success(function () {
                                //vm.getBookings();
                                vm.getChequesReceivables();
                                abp.notify.success(app.localize('SuccessfullyConvertToCDC'));
                            });
                        }
                    }
                );
            };
            vm.resubmitCheque = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/resubmitChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.resubmitChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesReceivables();
                });
            };
            vm.addOrEditPdcReceivable = function (chequeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/pdcReceivableModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.pdcReceivableModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        chequeId: function () {
                            return chequeId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesReceivables();
                });
            };

            vm.addOrEditBulkPdcReceivable = function (chequeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/bulkPdcReceivableModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.bulkPdcReceivableModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesReceivables();
                });
            };

            vm.deletePdcReceivable = function (cheque) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            chequesReceivablesService.deletePdcReceivable({
                                id: cheque.id
                            }).success(function () {
                                vm.getChequesReceivables();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
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

               
                chequesReceivablesService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            function init() {
                initDate();
                getLocations();
                vm.getChequesReceivables();
            }
            init();
        }]);
