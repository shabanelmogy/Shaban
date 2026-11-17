// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:62295-62654
appModule.controller('host.views.contacts.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.personHost', 'abp.services.app.user', 'abp.services.app.country', 'abp.services.app.industry', 'FileUploader', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, personHostService, userService, countryService, industryService, fileUploader, directoryService) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.disableDate = false;
            vm.showFilter = false;
            var todayAsString = moment(moment().format('YYYY-MM-DD')).utc()
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.companySegment = [{ id: 1, name: 'Small' }, { id: 2, name: 'Medium' }, { id: 3, name: 'Large' }];
            vm.verification = [{ id: 0, name: 'Not-Verified' }, { id: 1, name: 'Verified' }];


            vm.filters = {
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                verified:'',
            };
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
                    vm.filters.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });

            };

            vm.searchCompanies = function ($select) {
                if ($select == "")
                    vm.companies = null;
                directoryService.search({ keyword: $select, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            }

            vm.toggleInput = function () {
                vm.showFilter = vm.showFilter == false ? true : false;
            }

            //vm.permissions = {
            //    create: abp.auth.hasPermission('Pages.Tenant.Contacts.Addnew'),
            //    edit: abp.auth.hasPermission('Pages.Tenant.Contacts.Edit'),
            //    'delete': abp.auth.hasPermission('Pages.Tenant.Contacts.Delete')
            //};

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
                            '      <li><a  ng-click="grid.appScope.viewPerson(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.editPerson(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deletePerson(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Name'),
                        field: 'firstName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MobileNo'),
                        field: 'mobileNo'
                    },
                    {
                        name: app.localize('ContactNo'),
                        field: 'contactNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getContactsList(row.entity)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Email'),
                        field: 'email'
                    },
                    {
                        name: app.localize('Country'),
                        field: 'address.country'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getPerson();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getPerson();
                    });
                },
                data: []
            };

            vm.getContactsList = function (contact) {
                var contactList = '';
                if (contact != null) {

                    if (contact.contactNo != null)
                        contactList = contact.contactNo

                    if (contact.contactNo2 != null)
                        contactList = contactList + ', ' + contact.contactNo2;
                    return contactList;
                }
                else {
                    return "";
                }
            };
            vm.clearUser = function () {
                vm.filters.user = null;
                vm.filters.CreatedBy = null;
            }

            vm.clearCountry = function () {
                vm.filters.nationality = null;
                vm.filters.country = null;
            };
            vm.clearCompanyCountry = function () {
                vm.filters.company.nationality = null;
                vm.filters.company.country = null;
            };

            vm.clearCompanyName = function () {
                vm.filters.company.name = null;
                vm.filters.company.id = null;
            }

            vm.getPerson = function () {

                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.user != null)
                    vm.filters.CreatedBy = vm.filters.user.id;
                if (vm.filters.nationality != null)
                    vm.filters.country = vm.filters.nationality.name;

                if (vm.filters.company != null && vm.filters.company.name != null)
                    vm.filters.company.id = vm.filters.company.name.id;

                if (vm.filters.company != null && vm.filters.company.nationality != null)
                    vm.filters.company.country = vm.filters.company.nationality.name;


                if (!vm.disableDate) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                personHostService.getAllContacts(vm.filters).success(function (data) {
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

            // Export To Excel
            vm.exportToExcel = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.user != null)
                    vm.filters.CreatedBy = vm.filters.user.id;
                if (vm.filters.nationality != null)
                    vm.filters.country = vm.filters.nationality.name;
                if (vm.filters.company != null && vm.filters.company.nationality != null)
                    vm.filters.company.country = vm.filters.company.nationality.name;
                if (!vm.disableDate) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                personService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function openCreateOrEditPersonModal(personId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/contacts/createOrEditModal.cshtml',
                    controller: 'host.views.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return personId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getPerson();
                });
            }
            function openViewPersonModal(personId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/contacts/viewModal.cshtml',
                    controller: 'host.views.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return personId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

            }

            vm.createPerson = function () {
                openCreateOrEditPersonModal(null);
            };

            vm.editPerson = function (person) {
                openCreateOrEditPersonModal(person.id);
            };
            vm.viewPerson = function (person) {
                openViewPersonModal(person.id);
            };
            vm.deletePerson = function (person) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            personService.deletePerson({
                                id: person.id
                            }).success(function () {
                                vm.getPerson();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
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
                    //abp.message.warn(app.localize('ImportingFile'));

                    personService.importFromExcel(fileName)
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

            function init() {
                vm.getIndustries();
                vm.getPerson();
            }
            init();
        }
    ]);
