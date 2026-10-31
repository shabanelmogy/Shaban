// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:368501-368656
appModule.controller('tenant.views.crs.vouchers.jvs.tollsDetailModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.toll', 'JV', 'utilities',
        function ($scope, $uibModalInstance, uiGridConstants, tollService, JV, utilities) {

            var vm = this;
            vm.loading = false;
            vm.jvDetail = JV;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getRoundFigure = function (val) {
                if (val != null) {
                    return utilities.round(val, 2);
                }
                else {
                    return 0;
                }
            }
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: false,
                appScopeProvider: vm,
                columnDefs: [

                    {
                        name: app.localize('Authority'),
                        field: 'server',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getServerName(row.entity.server)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DateAndTime'),
                        field: 'tripDateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.tripDateTime)}}</div>' +
                            '</div>'
                        //cellTemplate:
                        //    '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\">{{grid.appScope.dateFormat(row.entity.tripDateTime)}}</div>' +
                        //    '</div>'
                    },
                    {
                        name: app.localize('PlateNo'),
                        field: 'plateNo'
                    },
                    {
                        name: app.localize('TagNo'),
                        field: 'plateTagNo'
                    },
                    {
                        name: 'Location',
                        field: 'tollGateLocationEN'
                    },
                    {
                        name: app.localize('Direction'),
                        field: 'tollGateDirectionEN'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount'
                    }
                ],

                data: []
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                tollService.tollDetailsExportToExcel({
                    jVId: vm.jvDetail.id
                })
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getServerName = function (server) {
                if (server == 1) {
                    return app.localize('Dubai');
                }
                else if (server == 2) {
                    return app.localize('AbuDhabi');
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.printTolls = function () {
                vm.loading = true;
                if (vm.jvDetail.id) {
                    tollService.getTollsForDetails({
                        jVId: vm.jvDetail.id
                    }).success(function (result) {
                        vm.totalAmount = 0.0;
                        vm.printData = result.items;
                        vm.printData.forEach(e => {
                            vm.totalAmount += e.amount;
                        });
                        setTimeout(() => window.print(), 500
                        );
                        
                        
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };

            function init() {
                vm.loading = true;
                if (vm.jvDetail.id) {
                    tollService.getTollsForDetails({
                        jVId: vm.jvDetail.id
                    }).success(function (result) {
                        vm.gridOptions.data = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            init();
        }
    ]);
