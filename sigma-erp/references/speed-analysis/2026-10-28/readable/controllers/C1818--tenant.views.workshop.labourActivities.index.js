// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:496155-496304
appModule.controller('tenant.views.workshop.labourActivities.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.labourActivity','utilities',
        function ($scope, $uibModal, uiGridConstants, labourActivityService, utilities) {

            var vm = this;
            vm.isCrsEnabled = abp.features.isEnabled("WorkShop");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            var jobType = abp.setting.get("App.Speed.Common.ShowSelectedJobTypes");
            vm.jobTypes = jobType ? angular.fromJson(jobType) : new Array();
            if (!vm.jobTypes || vm.jobTypes.length <= 0)
                vm.jobTypes = utilities.getJobTypes();

            vm.showJobType = (jobType) => {
                let jt = vm.jobTypes.filter(jt => jt.id === jobType);
                return jt && jt.length > 0 ? jt[0].name : '';
            }

            vm.loading = false;

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
                            '      <li><a ng-click="grid.appScope.viewLabourActivity(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.editLabourActivity(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteLabourActivity(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('LabourActivityName'),
                        field: 'name'
                    },
                    {
                        name: app.localize('JobType'),
                        field: 'jobType',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{grid.appScope.showJobType(row.entity.jobType)}}' + '</span>' +
                            '</div>'
                    }
                ],
                data: []
            };

            vm.getLabourActivities = function () {
                vm.loading = true;

                labourActivityService.getLabourActivities({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                    var test = data.items;
                    console.log(test);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditLabourActivityModal(Id) {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/labourActivities/createOrEditModal.cshtml',
                    controller: 'tenant.views.workshop.labourActivities.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        labourActivityId: function () {
                            return Id;
                        },
                        labourActivityService: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getLabourActivities();
                });
            }

            vm.createLabourActivity = function () {
                
                openCreateOrEditLabourActivityModal(null); 
            };


            vm.editLabourActivity = function (LabourActivity) {
                
                openCreateOrEditLabourActivityModal(LabourActivity.id);
            };

            vm.viewLabourActivity = function (LabourActivity) {
                
                openViewModal(LabourActivity.id);
            };

            function openViewModal(id) {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/labourActivities/viewModal.cshtml',
                    controller: 'tenant.views.workshop.labourActivities.createOrEditModal as vm',
                      backdrop: 'static',
                    size: 'md',
                    resolve: {
                        labourActivityId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getLabourActivities();
                });
            }
            vm.deleteLabourActivity= function (LabourActivity) {
                
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', LabourActivity.Id),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            labourActivityService.deleteLabourActivity({
                                Id: LabourActivity.id
                            }).success(function () {
                                vm.getLabourActivities();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.getLabourActivities();
            
        }
    ]);
