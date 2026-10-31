// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:158041-158186
appModule.controller('tenant.views.crs.agreementsDashboard2.viewFinesDetails', [
        '$scope', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.uaeFine', 'fines', 'dateTimeIn', 'agreementId', 'abp.services.app.commonAgreement',
        function ($scope, $uibModalInstance, uiGridConstants, fineService, fines, dateTimeIn, agreementId, commonAgreementService) {
            /*
            *if agreement is being closed then fines and dateTimeIn will be passed
            *if agreement is closed already and fines are supposed to be viewed through agreement view screen then only agreementId will be passed and fines be taken from server
            */
            var vm = this;
            vm.loading = false;
            vm.agreementId = agreementId;
            vm.agreement = null;
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

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: false,
                appScopeProvider: vm,
                columnDefs: [
                    
                    {
                        name: app.localize('FineNo'),
                        width: 130,
                        field: 'fineNo'
                    },
                    {
                        name: app.localize('DateAndTime'),
                        field: 'fineDateTime',
                        width: 140,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.fineDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Detail'),
                        field: 'fineDescription',
                        width: 200
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount'
                    },
                    {
                        name: app.localize('Knw'),
                        field: 'acknowledgment'
                    },
                    {
                        name: app.localize('Srchg'),
                        field: 'surcharge'
                    },
                    {
                        name: app.localize('Total'),
                        field: 'amountWithSurcharge'
                    }
                ],
                data: []
            };

            vm.ignoreFine = function (fine) {
                abp.message.okConfirm(
                    app.localize('IgnoreFineMessage'), app.localize('PressOkToIgnoreFine'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;

                            fineService.ignoreFine({
                                id: fine.id
                            }).success(function (result) {
                                fine.included = false;
                                fine.ignored = true;
                                $uibModalInstance.close();
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };


            function showFines() {
                if (agreementId == null) {
                    vm.loading = true;
                    var finesCopy = [];
                    for (var k = 0; k < fines.length; k++) {

                        var fineDateTime = moment(fines[k].fineDateTime);

                        if (fineDateTime <= dateTimeIn && fines[k].ignored == false) {
                            finesCopy.push(fines[k]);
                        }
                    }
                    vm.gridOptions.data = finesCopy;

                    vm.loading = false;

                } else {
                    vm.loading = true;

                    fineService.getFines({
                        agreementId: agreementId, downloadPendingfines: false
                    }).success(function (result) {
                        vm.gridOptions.data = result.fines;
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
                        showFines();
                    }).finally(function (data) {
                        vm.loading = false;
                    });
                }
                else {
                    showFines();
                }

            }

            init();
        }
    ]);
