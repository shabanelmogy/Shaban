// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:488120-488252
appModule.controller('tenant.views.workshop.jobCategories.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.jobCategory','utilities',
        function ($scope, $uibModal, uiGridConstants, jobCategoryService, utilities) {

            var vm = this;
            vm.isCrsEnabled = abp.features.isEnabled("WorkShop");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


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
                            '      <li><a ng-click="grid.appScope.viewJobCategories(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.editJobCategories(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteJobCategories(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('JobCategoryName'),
                        field: 'name'
                    }
                ],
                data: []
            };

            vm.getJobCategory = function () {
                vm.loading = true;

                jobCategoryService.getJobCategory().success(function (data) {
                    vm.gridOptions.data = data.items;
                    var test = data.items;
                    console.log(test);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditJobCategoryModal(Id) {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobCategories/createOrEditModal.cshtml',
                    controller: 'tenant.views.workshop.jobCategories.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        jobCategoryId: function () {
                            return Id;
                        },
                        jobCategoryService: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getJobCategory();
                });
            }

            vm.createJobCategory = function () {
                
                openCreateOrEditJobCategoryModal(null);
            };


            vm.editJobCategories = function (JobCategory) {
                
                openCreateOrEditJobCategoryModal(JobCategory.id);
            };

            vm.viewJobCategories = function (JobCategory) {
                
                openViewModal(JobCategory.id);
            };

            function openViewModal(id) {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobCategories/viewModal.cshtml',
                    controller: 'tenant.views.workshop.jobCategories.createOrEditModal as vm',
                      backdrop: 'static',
                    size: 'md',
                    resolve: {
                        jobCategoryId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getJobCategory();
                });
            }
            vm.deleteJobCategories = function (JobCategory) {
                
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', JobCategory.Id),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            jobCategoryService.deleteJobCategory({
                                Id: JobCategory.id
                            }).success(function () {
                                vm.getJobCategory();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.getJobCategory();
            
        }
    ]);
