// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:313372-313510
appModule.controller('tenant.views.crs.vehicles.serviceBook', [
        '$scope', '$uibModal', 'uiGridConstants',
        function ($scope, $uibModal, uiGridConstants) {
            var vm = this;
            vm.loading = false;

            vm.servicesBookList = [
            {
                date: moment(),
                plateNo: 'Les-2011',
                kms: 7600,
                detail: [
                    {
                        name: 'Engine Oil Change',

                    },
                    {
                        name: 'Engine Oil Filter Change',

                    },
                    {
                        name: 'Air Filter Change',
                    }

                ],

            },
            {
                date: moment().add(10, 'days'),
                plateNo: 'Les-2014',
                kms: 7800,
                detail: [
                    {
                        name: 'Engine Oil Change'
                    }
                ],
            },
            {
                date: moment().add(20, 'days'),
                plateNo: 'Les-2015',
                kms: 8000,
                detail: [
                    {
                        name: 'Engine Oil Change'
                    }
                ],
            }
            ];

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
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
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.viewVehicle(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.editVehicle(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteVehicle(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                   {
                       name: app.localize('Date'),
                       field: 'date',
                       cellTemplate:
                           '<div class=\"ui-grid-cell\">' +
                           '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                           '</div>'
                   },
                    {
                        name: app.localize('Vehicle'),
                        field: 'plateNo'
                    },
                    {
                        name: app.localize('Kms'),
                        field: 'kms'
                    },
                    {
                        name: app.localize('Detail'),
                        field: 'kms',
                        width:450,
                        cellTemplate:
                       '<div class=\"ui-grid-cell-contents\">' +
                      ' <span  style="margin-left:5px" ng-repeat="data in row.entity.detail" class="label label-success">' + '&nbsp' + '{{data.name}}' + '&nbsp' + '</span>' +
                       '</div>'
                    },

                ],
                data: []
            };
            function OpenCreateOrEditServiceBookModal(servicesBookList) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/createOrEditServiceBookModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.createOrEditServiceBookModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        servicesBookList: function () {
                            return servicesBookList;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.gridOptions.data = vm.servicesBookList;
                });
            }
            vm.createServiceBook = function () {
                OpenCreateOrEditServiceBookModal(vm.servicesBookList);
            };
            function init() {
                vm.gridOptions.data = vm.servicesBookList;
            }

            init();


        }
    ]);
