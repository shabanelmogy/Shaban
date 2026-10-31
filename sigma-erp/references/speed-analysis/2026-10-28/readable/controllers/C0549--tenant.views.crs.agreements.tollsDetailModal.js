// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:148483-148617
appModule.controller('tenant.views.crs.agreements.tollsDetailModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.toll', 'tolls', 'dateTimeIn', 'agreementId', 'abp.services.app.commonAgreement',
        function ($scope, $uibModalInstance, uiGridConstants, tollService, tolls, dateTimeIn, agreementId, commonAgreementService) {
            /*
            *if agreement is being closed then tolls and dateTimeIn will be passed
            *if agreement is closed already and tolls are supposed to be viewed through agreement view screen then only agreementId will be passed and tolls be taken from server
            */
            var vm = this;
            vm.loading = false;
            vm.agreementId = agreementId;
            vm.agreement = null;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

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
                        width: 140,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.tripDateTime)}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('TollLocation'),
                        field: 'tollGateLocationEN'
                    },
                    {
                        name: app.localize('PlateNo'),
                        field: 'plateNo'
                    },
                    {
                        name: app.localize('Direction'),
                        field: 'tollGateDirectionEN'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount'
                    },
                    {
                        name: app.localize('Surcharge'),
                        field: 'surcharge'
                    },
                    {
                        name: app.localize('Total'),
                        field: 'amountWithSurcharge'
                    }
                ],
                data: []
            };

            vm.getServerName = function (server) {
                if (server == 1) {
                    return app.localize('Dubai');
                }
                else if (server == 2) {
                    return app.localize('AbuDhabi');
                }
            }

            function showTolls() {
                if (agreementId == null) {
                    vm.loading = true;
                    
                    var tollsCopy = [];
                    for (var k = 0; k < tolls.length; k++) {
                        if (moment(tolls[k].tripDateTime, 'YYYY-MM-DD HH:mm:ss') <= dateTimeIn) {
                            tollsCopy.push(tolls[k]);
                        }
                    }
                    vm.gridOptions.data = tollsCopy;
                    
                    vm.loading = false;
                    
                } else {
                    vm.loading = true;
                    
                    tollService.getTolls({
                        agreementId: agreementId, downloadPendingTolls: false
                    }).success(function (result) {
                        vm.gridOptions.data = result.tolls;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                if (agreementId) {
                    commonAgreementService.getAgreement({ id: agreementId, isMobile: false }).success(function (result) {
                        vm.agreement = result;
                        showTolls();
                    }).finally(function (data) {
                        vm.loading = false;
                    });
                }
                else {
                    showTolls();
                }
            }

            init();
        }
    ]);
