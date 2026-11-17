// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:471464-471566
appModule.controller('tenant.views.tfms.downloadingStatus.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.trafficFile',
        function ($scope, $uibModal, uiGridConstants, trafficFileService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isEnableCRS = abp.features.isEnabled("CRS");
            vm.isEnableTMS = abp.features.isEnabled("TFMS");

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.selectedVehicle = null;
           
            
           var dateTimeFormat = abp.setting.get("App.General.DateFormat") + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(dateTimeFormat);
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
                        name: app.localize('FileId'),
                        type: 'number',
                        field: 'fileId',
                        width: 200

                    },
                    {
                        name: app.localize('State'),
                        field: 'state',
                        width: 200

                    },
                    {
                        name: app.localize('LastDownloadDate'),
                        field: 'lastDownloadDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.lastDownloadDate)}}</div>' +
                            '</div>'
                    }

                ],

                data: []
            };
            // Viewing Traffic File

            vm.viewTrafficFile = function (trafficFile) {
                trafficFile.showModeTraffic = true;
                openCreateOrEditTrafficFileModal(trafficFile);
            };
            // Create And Edit Model For Traffic Files
            function openCreateOrEditTrafficFileModal(trafficFile) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/settings/createOrEditTrafficFileModal.cshtml',
                    controller: 'tenant.views.common.settings.createOrEditTrafficFileModal as vm',
                    backdrop: 'static',
                    resolve: {
                        trafficFile: function () {
                            return trafficFile;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTrafficFiles();
                });
            }


            function init() {
                vm.loading = true;
                trafficFileService.getTrafficFiles().success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            init();
        }
    ]);
