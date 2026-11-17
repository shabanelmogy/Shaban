// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:145456-145592
appModule.controller('tenant.views.crs.agreements.parkingDetailModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.parkingTicket', 'parkingTickets', 'dateTimeIn', 'agreementId', 'abp.services.app.commonAgreement',
        function ($scope, $uibModalInstance, uiGridConstants, parkingTicketService, parkingTickets, dateTimeIn, agreementId, commonAgreementService) {
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
                        name: app.localize('EntryDate'),
                        field: 'entryDateTime',
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.entryDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ExitDate'),
                        field: 'exitDateTime',
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.exitDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'location'
                    },
                    {
                        name: app.localize('PlateNo'),
                        field: 'plateNo'
                    },
                    {
                        name: app.localize('TaxableAmount'),
                        field: 'taxableAmount'
                    },
                    {
                        name: app.localize('VatAmount'),
                        field: 'vatAmount'
                    },

                    {
                        name: app.localize('Total'),
                        field: 'totalAmount'
                    },
                    {
                        name: app.localize('Surcharge'),
                        field: 'surcharge'
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
                    for (var k = 0; k < parkingTickets.length; k++) {
                        if (moment(parkingTickets[k].entryDateTime, 'YYYY-MM-DD HH:mm:ss') <= dateTimeIn) {
                            tollsCopy.push(parkingTickets[k]);
                        }
                    }
                    vm.gridOptions.data = tollsCopy;

                    vm.loading = false;

                } else {
                    vm.loading = true;

                    parkingTicketService.getParkingTicket({
                        agreementId: agreementId, downloadPendingTolls: false
                    }).success(function (result) {
                        vm.gridOptions.data = result.parkingTicket;
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
