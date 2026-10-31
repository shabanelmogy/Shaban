// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:223974-224374
appModule.controller('tenant.views.integrations.eInvoicing.index', [
        '$scope', '$http', '$uibModal', 'uiGridConstants', 'utilities', 'appSession', 'abp.services.app.eInvoicingUAE',
        function ($scope, $http, $uibModal, uiGridConstants, utilities, appSession, eInvoicingUAEAppService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');

            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                type: null,
                status: null,
                fromDate: null,
                dateTimeType: 6,
                toDate: null,
                skipCount: 0
            };
            vm.statuses = [
                { name: app.localize("Pending"), id: 0 },
                { name: app.localize("Wait"), id: 3 },
                { name: app.localize("Exception"), id: 4 },
                { name: app.localize("Failed"), id: 9 },
                { name: app.localize("SubmittedToExchangeNetwork"), id: 10 },
                { name: app.localize("DeliveredToBuyerNetwork"), id: 11 },
                { name: app.localize("DeliveredToBuyer"), id: 12 },
                { name: app.localize("Received"), id: 13 }
            ];
            vm.getStatusById = function (id) {
                var statusName = "";
                var statuses = vm.statuses.filter(x => x.id == id);
                if (statuses.length > 0) {
                    statusName = statuses[0].name;
                }
                return statusName;
            }
            vm.getVoucherSubTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 1) return app.localize("RentalInvoice");
                else if (voucherSubTypeId == 8) return app.localize("SalikInvoice");
                else if (voucherSubTypeId == 7) return app.localize("FineInvoice");
                else if (voucherSubTypeId == 2) return app.localize("LimousineInvoice");
                else if (voucherSubTypeId == 14) return app.localize("LeaseInvoice");
                else if (voucherSubTypeId == 16) return app.localize('TransportationInvoice');
                else if (voucherSubTypeId == 17) return app.localize("AssetSaleInvoice");
                else if (voucherSubTypeId == 9) return app.localize("MiscellaneousInvoice");
                else if (voucherSubTypeId == 24) return app.localize("AdditionalChargesInvoice");
                else if (voucherSubTypeId == 29) return app.localize("FuelInvoice");
                else if (voucherSubTypeId == 30) return app.localize("DamageInvoice");
                else if (voucherSubTypeId == 33) return app.localize("FleetAssignmentInvoice");
                else if (voucherSubTypeId == 34) return app.localize("ChauffeurInvoice");
                else if (voucherSubTypeId == 37) return app.localize("WorkshopInvoice");
                else if (voucherSubTypeId == 46) return app.localize("EquipmentInvoice");
                else if (voucherSubTypeId == 55) return app.localize("AccessoriesInvoice");
                else if (voucherSubTypeId == 57) return app.localize("ExcessChargesInvoice");
                else if (voucherSubTypeId == 60) return app.localize("ExcessKMsInvoice");
                else if (voucherSubTypeId == 63) return app.localize('DarbTollInvoice');
                else if (voucherSubTypeId == 65) return app.localize('AdvanceTaxInvoice');
                else if (voucherSubTypeId == 22) return app.localize("CounterReceiveable");
                else if (voucherSubTypeId == 23) return app.localize("OnAccount");
                else if (voucherSubTypeId == 56) return app.localize("CreditNoteDelivery");
                else if (voucherSubTypeId == 31) return app.localize("CounterPayable");
                else if (voucherSubTypeId == 32) return app.localize("OnAccount");
                else if (voucherSubTypeId == 45) return app.localize("AssetSale");
                // else if (voucherSubTypeId == 47) return app.localize("EquipmentLeaseInvoice");
                else return "";
            };
            vm.voucherTypes = [
                { id: 1, name: app.localize("Invoice") },
                { id: 8, name: app.localize("CreditNote") },
                /*{ id: 9, name: app.localize("DebitNote") }*/
            ];
            vm.getVoucherTypeById = function (id) {
                var voucherTypeName = "";
                var voucherTypes = vm.voucherTypes.filter(x => x.id == id);
                if (voucherTypes.length > 0) {
                    voucherTypeName = voucherTypes[0].name;
                }
                return voucherTypeName;
            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }
            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getInvoices();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                enableColumnResizing: true,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useCustomPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: ' ',
                        width: 50,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i><span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="row.entity.status == 4 || row.entity.status == 9" ng-click="grid.appScope.retryPosting(row.entity)">' + app.localize('Retry') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openEInvoicePostingLogModal(row.entity)">' + app.localize('Logs') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.viewInvoiceJsonModal(row.entity)">' + app.localize('Json') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherNo'),
                        width: 180,
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span>{{row.entity.voucherNo}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherType'),
                        feild: 'voucherType',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getVoucherTypeById(row.entity.voucherType)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherSubType'),
                        feild: 'voucherSubTypeId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getVoucherSubTypeById(row.entity.voucherSubTypeId)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherDate'),
                        width: 150,
                        field: 'voucherDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.voucherDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ApprovalDate'),
                        width: 150,
                        field: 'voucherApprovalDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.voucherApprovalDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PostingDate'),
                        width: 150,
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        width: 100,
                        field: 'voucherAmount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell pull-right\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.currencyFormate(grid.appScope.rounding(row.entity.voucherAmount))}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        width: 120,
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatusById(row.entity.status)}}</div>' +
                            '</div>'
                    }
                ],

                data: []
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(vm.dateFormat)).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(vm.dateFormat)).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };
            vm.openEInvoicePostingLogModal = function (input) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/integrations/eInvoicing/viewLogModal.cshtml',
                    controller: 'tenant.views.crs.integrations.eInvoicing.viewLogModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                voucherId: input.id,
                                voucherNo: input.voucherNo,
                                documentId: input.documentId,
                            };
                        }
                    }
                });
            };
            vm.viewInvoiceJsonModal = function (input) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/integrations/eInvoicing/viewInvoiceJsonModal.cshtml',
                    controller: 'tenant.views.crs.integrations.eInvoicing.viewInvoiceJsonModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                eInvoicePosting: input
                            };
                        }
                    }
                });
            };
            vm.retryPosting = function (input) {
                abp.message.confirm(
                    app.localize('YouWantToRepost'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            eInvoicingUAEAppService.eInvoiceRePosting({
                                id: input.id
                            }).success(function () {
                                abp.notify.success(app.localize('VoucherSuccessFullyAddedInQueue'));
                                vm.getEInvoicePostings();
                            });
                        }
                    }
                );
            };
            vm.exportGridToExcel = function () {
                vm.loading = true;

                var uri = 'data:application/vnd.ms-excel;base64,';
                var template =
                    '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
                    'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
                    'xmlns="http://www.w3.org/TR/REC-html40">' +
                    '<head><meta charset="UTF-8"></head>' +
                    '<body><table border="1">{table}</table></body></html>';

                function base64(s) {
                    return btoa(unescape(encodeURIComponent(s)));
                }

                function format(s, c) {
                    return s.replace(/{(\w+)}/g, function (m, p) {
                        return c[p];
                    });
                }

                var html = '';

                /* ================= HEADER ================= */
                html += '<tr>';
                for (var i = 0; i < vm.gridOptions.columnDefs.length; i++) {
                    var col = vm.gridOptions.columnDefs[i];
                    if (!col.name || col.name === ' ') continue; // skip action column
                    html += '<th>' + col.name + '</th>';
                }
                html += '</tr>';

                /* ================= ROWS ================= */
                for (var r = 0; r < vm.gridOptions.data.length; r++) {
                    var row = vm.gridOptions.data[r];
                    html += '<tr>';

                    for (var c = 0; c < vm.gridOptions.columnDefs.length; c++) {
                        var column = vm.gridOptions.columnDefs[c];
                        if (!column.name || column.name === ' ') continue;

                        var value = '';

                        /* ===== Mapping by localized column name ===== */

                        if (column.name === app.localize('VoucherNo')) {
                            value = row.voucherNo;
                        }
                        else if (column.name === app.localize('VoucherType')) {
                            value = vm.getVoucherTypeById(row.voucherType);
                        }
                        else if (column.name === app.localize('VoucherSubType')) {
                            value = vm.getVoucherSubTypeById(row.voucherSubTypeId);
                        }
                        else if (column.name === app.localize('VoucherDate')) {
                            value = vm.getlocalDateTime(row.voucherDate);
                        }
                        else if (column.name === app.localize('ApprovalDate')) {
                            value = vm.getlocalDateTime(row.voucherApprovalDate);
                        }
                        else if (column.name === app.localize('PostingDate')) {
                            value = vm.getlocalDateTime(row.date);
                        }
                        else if (column.name === app.localize('Amount')) {
                            value = vm.CurrencyFormate(vm.rounding(row.voucherAmount));
                        }
                        else if (column.name === app.localize('Status')) {
                            value = vm.getStatusById(row.status);
                        }

                        html += '<td>' + (value !== null && value !== undefined ? value : '') + '</td>';
                    }

                    html += '</tr>';
                }

                var ctx = {
                    worksheet: 'EInvoiceReport',
                    table: html
                };

                var a = document.createElement('a');
                a.href = uri + base64(format(template, ctx));
                a.download = 'EInvoiceReport.xls';
                a.click();

                vm.loading = false;
            };

            vm.getEInvoicePostings = function () {
                vm.loading = true;
                vm.dateRangeCheck();
                eInvoicingUAEAppService.getEInvoicePostings(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-1, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            };
            function init() {
                initDate();
                vm.getEInvoicePostings();
            }

            init();
        }
    ]);
