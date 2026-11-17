// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:61327-61752
appModule.controller('host.views.companies.index', [
        '$scope', '$http', '$uibModal', 'uiGridConstants', 'abp.services.app.companyHost', 'abp.services.app.user', 'abp.services.app.country', 'abp.services.app.industry', 'abp.services.app.company', 'FileUploader',
        function ($scope, $http, $uibModal, uiGridConstants, companyHostService, userService, countryService, industryService, companyService, fileUploader) {

            var vm = this;
            vm.countries = [];
            vm.pageName = "Company"
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.activelist = [{ id: 0, name: "Active" }, { id: 1, name: "In Active" }];
            vm.disableDate = false;
            vm.showFilter = false;
            var todayAsString = moment(moment().format('YYYY-MM-DD')).utc()
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.companySegment = [{ id: 1, name: 'Small' }, { id: 2, name: 'Medium' }, { id: 3, name: 'Large' }];
            vm.verifiedList = [{ id: true, name: 'Verified' }, { id: false, name: 'Not Verified' }];
            vm.suitableList = [{ id: 1, name: 'Suitable' }, { id: 2, name: 'Not Suitable' }];
            vm.typeList = [{ id: 1, name: 'Dormant' }, { id: 2, name: 'Active' }, { id: 3, name: 'Customer' }];
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };
            vm.searchUsers = function ($select) {
                return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            vm.searchCountries = function (filter) {
                vm.filters.name = filter;
                if (vm.filters.name == '')
                    vm.filters.name = "~";
                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });

            };
            vm.toggleInput = function () {
                vm.showFilter = vm.showFilter == false ? true : false;
            }
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Companies.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Companies.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.Companies.Delete'),
                editContactCards: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards'),
                approve: abp.auth.hasPermission('Pages.Tenant.Companies.CustomerApproval'),
                changeRequest: abp.auth.hasPermission('Pages.Tenant.Companies.ChangeRequest')

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
                        width: 175,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewCompany(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.approve"><a ng-show="!row.entity.verified" ng-click="grid.appScope.approveCompany(row.entity)">' + app.localize('Aapprove Company') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.edit"><a  ng-click="grid.appScope.editCompany(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ><a ng-show="row.entity.verified" ng-click="grid.appScope.changeRequest(row.entity)">' + app.localize('Change Request') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.contactLog(row.entity.id)">' + app.localize('Log') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.delete"><a ng-click="grid.appScope.deleteCompany(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            ' <span  ng-show="row.entity.verified" class="label label-success">' + app.localize('Approved') + '</span>' +

                            '</div>'
                    },
                    {
                        name: app.localize('CompanyName'),
                        field: 'companyName'
                    },
                    {
                        name: app.localize('ContactNo'),
                        field: 'contactNo'
                    },
                    {
                        name: app.localize('Website'),
                        field: 'domain'
                    },
                    {
                        name: app.localize('Email'),
                        field: 'email'
                    },

                    {
                        name: app.localize('Country'),
                        field: 'address.country'
                    },

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getCompanies();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getCompanies();
                    });
                },
                data: []
            };
            vm.clearUser = function () {
                vm.filters.user = null;
                vm.filters.CreatedBy = null;
            }
            vm.clearCountry = function () {
                vm.filters.nationality = null;
                vm.filters.country = null;
            }
            vm.getCompanies = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.user != null)
                    vm.filters.CreatedBy = vm.filters.user.id;
                if (vm.filters.nationality != null)
                    vm.filters.country = vm.filters.nationality.name;
                if (!vm.disableDate) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                if (vm.selectedCountries)
                    vm.filters.countries = vm.selectedCountries.map(x => x.name);
                companyHostService.getCompaniesHost(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getIndustries = function () {
                industryService.getIndustries().success(function (result) {
                    vm.industries = result.items;
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.user != null)
                    vm.filters.CreatedBy = vm.filters.user.id;
                if (vm.filters.nationality != null)
                    vm.filters.country = vm.filters.nationality.name;
                if (!vm.disableDate) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                companyHostService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });
            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    companyHostService.importFromExcel(fileName)
                        .success(function (result) {
                            abp.message.success(app.localize('ImportedSuccessfully'));
                            init();
                        })
                        .error(function (response) {
                            abp.message.error(response.error);
                        })
                        .finally(function () {
                            vm.importing = false;
                        });
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.importToExcel = function () {
                companyHostService.importFromExcel().success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.report = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.user != null)
                    vm.filters.CreatedBy = vm.filters.user.id;
                if (vm.filters.nationality != null)
                    vm.filters.country = vm.filters.nationality.name;
                if (!vm.disableDate) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                $uibModal.open({
                    templateUrl: '~/App/host/views/companies/report.cshtml',
                    controller: 'host.views.companies.report as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            }
            function openCreateOrEditCompanyModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/createOrEditModal.cshtml',
                    controller: 'host.views.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        },
                        isChangeRequest: function () {
                            return false;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCompanies();
                });
            }
            function viewChangeRequest(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/viewChangeRequest.cshtml',
                    controller: 'host.views.companies.viewChangeRequest as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        lookupOptions: function () {
                            return companyId;
                        },
                        pageName: function () {
                            return vm.pageName;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCompanies();
                });
            }
            function openViewCompanyModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/viewModal.cshtml',
                    controller: 'host.views.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        }, isChangeRequest: function () {
                            return false;
                        },
                    }
                });
            }
            vm.contactLog = function (contactId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/companies/contactLog.cshtml',
                    controller: 'host.views.companies.contactLog as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        contactId: function () {
                            return contactId;
                        }
                    }
                });
            };
            vm.createCompany = function () {
                openCreateOrEditCompanyModal(null);
            };
            vm.openRequests = function () {
                viewChangeRequest(null);
            };
            vm.editCompany = function (company) {
                openCreateOrEditCompanyModal(company.id);
            };
            vm.changeRequest = function (company) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/createOrEditModal.cshtml',
                    controller: 'host.views.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return company.id;
                        },
                        isChangeRequest: function () {
                            return true;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCompanies();
                });
            };
            vm.viewCompany = function (person) {
                openViewCompanyModal(person.id);
            };
            vm.viewContactBranch = function (Company) {
                openViewContactBranchModal(Company);
            };
            function openViewContactBranchModal(Company) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/ContactBranch.cshtml',
                    controller: 'host.views.companies.ContactBranch as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        ContactId: function () {
                            return Company.id;
                        },
                        CompanyName: function () {
                            return Company.companyName;
                        }
                    }
                });
            }
            vm.deleteCompany = function (company) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            companyHostService.deleteCompany({
                                id: company.id
                            }).success(function () {
                                vm.getCompanies();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            function openEditContactGroupModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/editContactGroupModal.cshtml',
                    controller: 'tenant.views.crs.companies.editContactGroupModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCompanies();
                });
            }
            vm.editContactGroup = function (company) {
                openEditContactGroupModal(company.id);
            };
            vm.approveCompany = function (company) {
                abp.message.confirm(
                    app.localize(''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            companyService.approveCompany({
                                id: company.id
                            }).success(function () {
                                vm.getCompanies();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            });
                        }
                    }
                );
            };
            function init() {
                vm.getCompanies();
                vm.getIndustries();
            }
            init();
        }
    ]);
