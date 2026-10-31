// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:478201-478316
appModule.controller('tenant.views.tms.e-darb.downloadingStatus.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.tenantSettings', 'abp.services.app.salikAccount',
        function ($scope, $uibModal, uiGridConstants, tenantSettingsService, salikAccountService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isEnableCRS = abp.features.isEnabled("CRS");
            vm.isEnableTMS = abp.features.isEnabled("TMS");

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' HH:mm';
            vm.selectedVehicle = null;


            vm.getlocalDateTime = function (date) {
                if (date !== null) {
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
                useExternalPagination: true,
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
                        name: app.localize('UserName'),
                        field: 'userName',

                    },
                    {
                        name: app.localize('lastDownloadDate'),
                        field: 'lastDownloadDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.lastDownloadDate)}}</div>' +
                            '</div>'
                    },

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
            };

            // Viewing Salik Accounts

            vm.viewSalikAccount = function (salikAccount) {
                salikAccount.showMode = true;
                openCreateOrEditSalikAccountModal(salikAccount);
            }
            // Create AndEdit Model For SalikAccount
            function openCreateOrEditSalikAccountModal(salikAccount) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/settings/createOrEditSalikAccountModal.cshtml',
                    controller: 'tenant.views.locations.createOrEditSalikAccountModal as vm',
                    backdrop: 'static',
                    resolve: {
                        salikAccount: function () {
                            return salikAccount;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSalikAccounts();
                });
            };


            function init() {
                vm.loading = true;
                salikAccountService.getSalikAccounts({id: 2}).success(function (data) {
                    vm.salikAccounts = data;
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            init();
        }
    ]);
