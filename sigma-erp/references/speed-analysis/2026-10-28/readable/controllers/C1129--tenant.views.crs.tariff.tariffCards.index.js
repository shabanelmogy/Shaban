// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:297592-297744
appModule.controller('tenant.views.crs.tariff.tariffCards.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.tariffCard','utilities',
        function ($scope, $uibModal, uiGridConstants, tariffCardService, utilities) {
            var vm = this;
            vm.filter = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.loading = false;
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
            //vm.permissions = {
            //    create: abp.auth.hasPermission('Pages.Tenant.costingParameterss.Addnew'),
            //    edit: abp.auth.hasPermission('Pages.Tenant.costingParameterss.Edit'),
            //    'delete': abp.auth.hasPermission('Pages.Tenant.costingParameterss.Delete')
            //};

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.editTariffCard(row.entity)">' + app.localize('Edit') + '</a></li>' +
                           // '      <li><a  ng-click="grid.appScope.createcostingParameter(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteTariffCard(row.entity.id)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('TariffCardName'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Discount'),
                        field: 'discountPercentage',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.discountPercentage)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('FromDate'),
                        field: 'fromDate',
                      
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.fromDate)}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('ToDate'),
                        field: 'toDate',
                      
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.toDate)}}</div>' +
                        '</div>'
                    },

                ],
                data: []
            };

            vm.getTariffCards = function () {
                vm.loading = true;
                tariffCardService.getTariffCards({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditTariffCardModal(tariffCard) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/tariffCards/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.tariffCards.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffCard: function () {
                            return tariffCard;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTariffCards();
                });
            }


            vm.createTariffCard = function () {
                openCreateOrEditTariffCardModal(null);
            };

            vm.editTariffCard = function (tariffCard) {
                openCreateOrEditTariffCardModal(tariffCard);
            };

            vm.deleteTariffCard = function (tariffCardId) {
                abp.message.confirm(
                   app.localize('DeleteWarningMessage', location.name),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           tariffCardService.deleteTariffCard({
                               id: tariffCardId
                           }).
                           success(function () {
                               vm.getTariffCards();
                               abp.notify.success(app.localize('SuccessfullyDeleted'));
                           });
                       }
                   }
               );
            };

            vm.getTariffCards();
        }
    ]);
