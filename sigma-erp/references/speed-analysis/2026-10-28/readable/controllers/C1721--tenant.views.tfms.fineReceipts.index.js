// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:472878-473274
appModule.controller('tenant.views.tfms.fineReceipts.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.fineReceipts',
        function ($scope, $uibModal, uiGridConstants, fineReceiptsService) {

            var vm = this;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isFineReceiptsReportEnabled = abp.features.isEnabled("TFMS.Fines.Receipts.Report2");
            vm.FineReceiptDownloadEnabled = abp.features.isEnabled("TFMS.Fines.Receipts.DownloadFineReceipts");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.filters = {
                receiptNo: null,
                receiptRefNo: null,
                receiptAmount: null,
                enableDateRange: true,
                status: 1,
                fromDate: moment(moment().format('YYYY-MM-DD')).utc(),
                toDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
                sharingStatus: null,
                emailSentOn: null,
                downloadingAuthority: null,
                durationType: 1,

            };

            vm.permissions = {
                view: true, //abp.auth.hasPermission(''),
                edit: true,
                delete: true,
                create: true, //abp.auth.hasPermission(''),
                'return': true, //abp.auth.hasPermission(''),
                close: true //abp.auth.hasPermission(''),
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.localize = function (agreementStatus) {
                return app.localize(agreementStatus);
            };
            vm.authorityTypes = [
                { type: app.localize("Dubai RTA"), id: 1 },
                { type: app.localize("TAMM"), id: 2 },
                { type: app.localize("Abu Dhabi Police"), id: 3 }
            ];
            vm.downloadAuthority=  function (id) {
                var t = vm.authorityTypes.find(x => x.id)
                return t.type;
            };

            vm.importFineEmailDetail = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tfms/fineReceipts/importFineEmailDetailModal.cshtml',
                    controller: 'tenant.views.tfms.fineReceipts.importFineEmailDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        
                    }
                });

                modalInstance.result.then(function (result) {
                    
                });
            };

            vm.getFineReceipts = function () {
                vm.loading = true;
                // set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                // if null then get as following
                //  fromDate: get local date with time 00:00:00 and then convert to utc
                //  toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel !== '' && vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel !== '' && vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    if (vm.filters.fromDate === undefined || vm.filters.fromDate === null) {
                        vm.filters.fromDate = moment(moment().format('YYYY-MM-DD')).utc();
                    }
                    if (vm.filters.toDate === undefined || vm.filters.toDate === null) {
                        vm.filters.toDate = moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    }
                }

                if (vm.filters.status != 2)
                    vm.filters.exportedBatchNo = 0;

                fineReceiptsService.getFineReceipts(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.fineReceiptsList;
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
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewFineReceipts(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editFineReceipts(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteFineReceipts(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.customReport(row.entity)">' + app.localize('CustomReport') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        field: 'receiptNo'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'receiptDate',
                        cellFilter: "momentFormat: grid.appScope.dateFormat"
                    },
                    {
                        name: app.localize('FinesAmount'),
                        field: 'finesAmount'
                    },
                    {
                        name: app.localize('Knw'),
                        field: 'acknowledgmentAmount'
                    },
                    {
                        name: app.localize('ReceiptAmount'),
                        field: 'receiptAmount'
                    },
                    {
                        name: app.localize('BatchNo'),
                        field: 'exportedBatchNo',
                        cellTemplate: '<div ng-if="row.entity.exportedBatchNo == 0"></div><div ng-if="row.entity.exportedBatchNo > 0">{{row.entity.exportedBatchNo}}</div>'
                    },
                    {
                        name: app.localize('Authority'),
                        field: 'downloadedFrom',
                        cellTemplate:

                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.downloadAuthority(row.entity.downloadedFrom)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('EmailSent'),
                        field: 'isEmailSent',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.isEmailSent == 1? "Yes":"No"}}</div>' +
                            '</div>'
                    },
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "agreementNo desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getFineReceipts();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getFineReceipts();
                    });
                },
                data: []
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            //vm.exportToExcel = function () {
            //    vm.loading = true;
            //    if (vm.filters.enableDateRange) {
            //        vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //        vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //    }
            //    fineReceiptsService.exportToExcel(vm.filters)
            //        .success(function (result) {
            //            app.downloadTempFile(result);
            //        }).finally(function () {
            //            vm.loading = false;
            //        });
            //};

            function openCreateOrEditFineReceiptsModal(receiptId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tfms/fineReceipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.tfms.fineReceipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        ReceiptId: function () {
                            return receiptId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getFineReceipts();
                });
            }

            vm.report = function () {

                if (vm.filters.status != 2)
                    vm.filters.exportedBatchNo = 0;

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/tfms/fineReceipts/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };


            vm.report2 = function () {

                if (vm.filters.status != 2)
                    vm.filters.exportedBatchNo = 0;

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel !== '' && vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel !== '' && vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    if (vm.filters.fromDate === undefined || vm.filters.fromDate === null) {
                        vm.filters.fromDate = moment(moment().format('YYYY-MM-DD')).utc();
                    }
                    if (vm.filters.toDate === undefined || vm.filters.toDate === null) {
                        vm.filters.toDate = moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    }
                }
                                
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/tfms/fineReceipts/report2.cshtml',
                    controller: 'tenant.views.tfms.fineReceipts.report2 as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.customReport = function (fineReceipt) {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/tfms/customReports/fineReceiptsAlTayerReport.cshtml';
                        },
                        filters: function () {
                            return fineReceipt ;
                        }
                    }
                });
            };

            vm.deleteFineReceipts = function (receiptId) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            fineReceiptsService.deleteFineReceipts({
                                id: receiptId.id
                            }).success(function () {
                                vm.getFineReceipts();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function openViewFineReceiptsModal(receiptId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tfms/fineReceipts/viewModal.cshtml',
                    controller: 'tenant.views.tfms.fineReceipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        ReceiptId: function () {
                            return receiptId;
                        }
                    }

                });

            }

            vm.createFineReceipts = function () {
                openCreateOrEditFineReceiptsModal(null);
            };

            vm.editFineReceipts = function (receiptId) {
                openCreateOrEditFineReceiptsModal(receiptId.id);
            };

            vm.viewFineReceipts = function (fineReceipt) {
                openViewFineReceiptsModal(fineReceipt.id);
            };

            vm.isEmailingThroughFinesReceipt = () => abp.features.isEnabled('TFMS.Fines.EmailingThroughFinesReceipt');

            function initializeFilters() {
                vm.dateRangeCheck();
                vm.getFineReceipts();
            }
            initializeFilters();

        }
    ]);
