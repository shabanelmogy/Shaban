// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:64966-65334
appModule.controller('host.views.crm.traffic.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.user', 'abp.services.app.inquiry', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'abp.services.app.hostProduct', 'abp.services.app.country',
        function ($scope, $uibModal, uiGridConstants, userService, inquiryService, commonLookupService, directoryService, productService, countryService) {

            var vm = this;
            vm.saving = false;
            vm.allowDateRange = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.statuses = [
                { name: 'Yes', 'value': true },
                { name: 'No', 'value': false }

            ];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.loading = false;

            vm.filters = {

                isProcessed: false,
                status: null,
                productId: null,
                companyId: null,
                country: null,

            };

            var todayAsString = moment(moment().format('YYYY-MM-DD')).utc()
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };
            vm.clearCompany = function () {
                vm.filters.companyId = null;
                vm.filters.company = null;
            };

            vm.searchCountries = function (filter) {
                var country = {
                    name: ''
                };
                country.name = filter;
                if (country.name === '')
                    country.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(country).then(function (response) {
                    vm.countries = response.data.items;
                });

            };

            vm.clearCountry = function () {
                vm.filters.countryObj = null;
                vm.filters.country = null;
            };


            vm.tenantSignupSources = [
                { type: "Unknown", id: 0 },
                { type: "Web App", id: 1 },
                { type: "Mobile App", id: 2 },
                { type: "Manual", id: 3 },
                { type: "Android", id: 4 },
                { type: "IOS", id: 5 }
            ];
            vm.inquiryTypes = [
                {id:1,type:"Lead"},
                {id:2,type:"Deal"},
                {id:3,type:"Noisy"}
            ]
            function getEditions() {
                vm.loading = true;
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                }).finally(function () {
                    vm.loading = false;
                });

            }


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();

                    return moment(localTime).format(vm.dateTimeFormat);

                }
                else {
                    return "";
                }
            };

            function openCreateOrEditLeadModal(stage, row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/marketing/leads/createOrEditModal.cshtml',
                    controller: 'host.views.marketing.leads.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        leadId: function () {
                            return null;
                        },
                        stage: function () {
                            return stage;
                        },
                        inquiry: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getInquiry();
                });
            }

            vm.createLead = function (stage, row) {
                openCreateOrEditLeadModal(stage, row);
            };

            function openCreateOrEditMarketingAndSalesTrafficModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/marketingAndSalesTraffic/createOrEditMarketingAndSalesTrafficModal.cshtml',
                    controller: 'host.views.crm.marketingAndSalesTraffic.createOrEditMarketingAndSalesTrafficModal as vm',
                    backdrop: 'static'
                    //resolve: {
                    //    : function () {
                    //        return inquiry;
                    //    }
                    //}
                });

                modalInstance.result.then(function (result) {
                    vm.getInquiry();
                });
            }
            vm.createInquiry = function () {
                openCreateOrEditMarketingAndSalesTrafficModal(null);
            };

            vm.editInquiry = function () {
                openCreateOrEditMarketingAndSalesTrafficModal(null);
            };

            vm.inquiryLog = function (inquiryId) {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/marketingAndSalesTraffic/inquiryLog.cshtml',
                    controller: 'host.views.crm.marketingAndSalesTraffic.inquiryLog as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        inquiryId: function () {
                            return inquiryId;
                        }

                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInquiry();
                });
            };
            vm.inquiryNoise = function (inquiryId,statusNotes) {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/marketingAndSalesTraffic/createOrEditNoiseModal.cshtml',
                    controller: 'host.views.crm.marketingAndSalesTraffic.createOrEditNoiseModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        inquiryId: function () {
                            return inquiryId;
                        },
                        statusNotes: function () {
                            return statusNotes;
                        }

                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInquiry();
                });
            };
            vm.getSignupSource = function (signupSource) {
                if (signupSource === 0)
                    return "Unknown";
                else if (signupSource === 1)
                    return "WebApp";
                else if (signupSource === 2)
                    return "MobileApp";
                else if (signupSource === 3)
                    return "Manual";
                else if (signupSource === 4)
                    return "Android";
                else if (signupSource === 5)
                    return "IOS";
            };
            vm.getInquiryType = function (inquiryType) {
                if (inquiryType === 1)
                    return "Lead";
                else if (inquiryType === 2)
                    return "Deal";
                else if (inquiryType === 3)
                    return "Noisy";
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
                        name: 'CreationDate',
                        field: 'creationTime',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.creationTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Tenant',
                        field: 'tenant.tenancyName',
                        width: 150
                    },
                    {
                        name: 'Company',
                        field: 'companyName',
                        width: 150
                    },
                    {
                        name: 'Country',
                        field: 'country',
                        width: 100

                    },
                    {
                        name: 'Contact',
                        field: 'contactNo',
                        width: 100
                    },
                    {
                        name: 'Email',
                        field: 'companyEmail',
                        width: 200
                    },
                    {
                        name: 'Person Name',
                        field: 'personName',
                        width: 100
                    },
                    {
                        name: 'Mobile',
                        field: 'mobileNo',
                        width: 100


                    },
                    {
                        name: 'Person Email',
                        field: 'personEmail',
                        width: 200
                    },
                    {
                        name: 'Channel',
                        field: 'channel',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getSignupSource(row.entity.channel)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Product',
                        field: 'product.displayName',
                        width: 100

                    },
                    {
                        field: 'isProcessed',
                        displayName: 'Processed',
                        width: 100,
                        cellTemplate: '<div  ng-show="row.entity.saving"> <img style="width:25px" src="/Content/loader.gif"> </div><input type="checkbox" ng-if="!row.entity.saving" ng-model="row.entity.isProcessed"  ng-change="grid.appScope.checkIsprocessedUpdate(row.entity)" >'

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

                        vm.getInquiry();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getInquiry();
                    });
                },
                data: []
            };
            vm.checkIsprocessedUpdate = function (row) {
                // vm.loading = true;
                row.saving = true;
                inquiryService.updateInquiryIsProcessed({ key: row.id, value: row.isProcessed })
                    .success(function () {

                    })
                    .finally(function () {
                        row.saving = false;
                        // vm.loading = false;
                    });
            }

            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };

            vm.getInquiry = function () {
                vm.loading = true;
                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                debugger;
                inquiryService.getInquiries(vm.filters).success(function (data) {
                    vm.inquiry = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            function init() {
                vm.getInquiry();
                // getProducts();
                getEditions();

            }
            init();
        }
    ]);
