// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:193527-194382
appModule.controller('tenant.views.crs.crm.sales.deals.index', [
        '$scope', 'utilities', '$uibModal', 'uiGridConstants', 'abp.services.app.person', 'abp.services.app.searchUser', 'abp.services.app.country', 'abp.services.app.cRMDeal', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'abp.services.app.cRMProduct', 'abp.services.app.businessDivision',
        function ($scope, utilities, $uibModal, uiGridConstants, personService, userService, countryService, dealService, commonLookupService, directoryService, productService, businessDivisionService) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.stages = [{ id: 1, name: 'Prospect' },
            { id: 2, name: 'Lead' },
            { id: 3, name: 'Deal' }];
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.businessName = utilities.divisionName();
            vm.getStageName = function (stage) {


                if (stage === 1) {
                    return 'Prospect';
                }
                else if (stage === 2) {
                    return 'Lead';
                }
                else if (stage === 3) {
                    return 'Deal';
                }
                else {
                    return '';
                }
            };

            vm.getBusinessName = function (id) {
                return vm.businessDivisions.find(x => x.id === id).code;
            }

            vm.loading = false;
            vm.allowDateRange = true;

            vm.permissions = {
                add: abp.auth.hasPermission('Pages.Marketing.Leads.AddNew'),
                edit: abp.auth.hasPermission('Pages.Marketing.Leads.Edit'),
                delete: abp.auth.hasPermission('Pages.Marketing.Leads.Delete'),
                verify: abp.auth.hasPermission('Pages.Marketing.Leads.Verify')
            };

            vm.getDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('MMMM Do YYYY');
                }
                else {
                    return "";
                }
            };
            vm.allStatuses = [{ id: 1, name: 'Due' },
            { id: 2, name: 'Processed' },
            { id: 3, name: 'Converted' },
            { id: 4, name: 'Not Suitable' },
            { id: 10, name: 'New' },
            { id: 11, name: 'Suitable' },
            { id: 12, name: 'Not Suitable' },
            { id: 20, name: 'New' },
            { id: 21, name: 'Dull' },
            { id: 22, name: 'Rejected' },
            { id: 23, name: 'Not Suitable' },
            //{ id: 30, name: 'New' },
            { id: 31, name: 'Active' },
            { id: 32, name: 'Hot' },
            { id: 33, name: 'Final' },
            { id: 34, name: 'Closed' }];
            vm.statuses = [];
            vm.getStatuses = function () {
                var stage = vm.filters.stage;

                if (stage === 0 || stage === null || stage === undefined) {
                    vm.statuses = null;
                }
                else if (stage === 1) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 10 && f.id < 20);//prospect
                }
                else if (stage === 2) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 20 && f.id < 30);//Lead
                }
                else if (stage === 3) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 30 && f.id < 40);//Deal
                }
            }
            vm.stageChange = function (row) {
                getStatusesReport(row);
            };

            function getStatusesReport(row) {
                var stage = row.stage;

                if (stage === 0 || stage === null || stage === undefined) {
                    row.statuses = null;
                }
                else if (stage === 1) {
                    row.statuses = vm.allStatuses.filter(f => f.id >= 10 && f.id < 20);//prospect
                }
                else if (stage === 2) {
                    row.statuses = vm.allStatuses.filter(f => f.id >= 20 && f.id < 30);//Lead
                }
                else if (stage === 3) {
                    row.statuses = vm.allStatuses.filter(f => f.id >= 30 && f.id < 40);//Deal
                }
            }
            vm.focusStage = function (task) {

                setTimeout(function () {
                    $("#uiSelectStage_" + task.id).focus().click();
                }, 100);
            }
            vm.focusDivision = function (row) {

                setTimeout(function () {
                    $("#uiSelectDivision_" + row.id).focus().click();
                }, 100);
            }


            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment().startOf('day'),
                endDate: moment().endOf('day')
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.filters = {
                fromDate: vm.dateRangeModel.startDate,
                toDate: vm.dateRangeModel.endDate,
                stage: 3,
                dealDateFilter: 1
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

            vm.searchUsers = function ($select) {
                if ($select.search === "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
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
                            '      <li><a  ng-click="grid.appScope.viewLead(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.edit"><a  ng-click="grid.appScope.editLead(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.delete"><a  ng-click="grid.appScope.deleteLead(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit || grid.appScope.permissions.create" ng-click="grid.appScope.leadLog(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        field: 'id'
                    },

                    {
                        name: app.localize('Date'),
                        field: 'creationTime',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDate(row.entity.creationTime)}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Title'),
                        width: 150,
                        field: 'title'
                    },
                    {
                        name: app.localize('Company'),
                        width: 150,
                        field: 'company'
                    },
                    {
                        name: app.localize('SetupCharges'),
                        field: 'setupCharges'
                    },
                    {
                        name: app.localize('Subscription'),
                        field: 'subscriptionCharges',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.subscriptionCharges + " / " + grid.appScope.getSubscriptionType(row.entity.subscriptionType)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TotalValue'),
                        field: 'totalValue'
                    },
                    {
                        name: app.localize('SalesPerson'),
                        field: 'salesPerson'
                    },
                    {
                        name: 'Stage',
                        field: 'stage',
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span>{{grid.appScope.getStageName(row.entity.stage)}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatusName(row.entity.status)}}</div>' +
                            '</div>'
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

                        vm.getPerson();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getLeads();
                    });
                },
                data: []
            };

            vm.clearCountry = function () {
                vm.filters.countryObj = null;
                vm.filters.country = null;
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPersonUser = null;
                vm.filters.salesPersonUserId = null;
            };




            vm.getStatusName = function (id) {
                if (id === 1) {
                    return "Due";
                }
                else if (id === 2) {
                    return "Processed";
                }
                else if (id === 3) {
                    return "Converted";
                }
                else if (id === 4) {
                    return "Not Suitable";
                }
                else if (id === 10) {
                    return "New";
                }
                else if (id === 11) {
                    return "Suitable";
                }
                else if (id === 12) {
                    return "Not Suitable";
                }
                else if (id === 20) {
                    return "New";
                }
                else if (id === 21) {
                    return "Dull";
                }
                else if (id === 22) {
                    return "Rejected";
                }
                else if (id === 23) {
                    return "Not Suitable";
                }
                else if (id === 30) {
                    return "New";
                }
                else if (id === 31) {
                    return "Active";
                }
                else if (id === 32) {
                    return "Hot";
                }
                else if (id === 33) {
                    return "Final";
                }
                else if (id === 34) {
                    return "Closed";
                }

            };

            vm.totalPerStatusValue = function (List) {
                var totalPerStatusValue = 0;
                for (var i in List) {
                    totalPerStatusValue += List[i].totalValue;
                }
                return totalPerStatusValue;
            }

            vm.isVerifyStatuses = [
                {
                    id: 0,
                    name: 'No'
                },
                {
                    id: 1,
                    name: 'Yes'
                }
            ];
            vm.tenantSignupSources = [
                { type: "Unknown", id: 0 },
                { type: "Web App", id: 1 },
                { type: "Mobile App", id: 2 },
                { type: "Manual", id: 3 }
            ];

            vm.getVerifyStatusesName = function (value) {
                if (value === false) {
                    return "No";
                }
                else if (value === true) {
                    return "Yes";
                } else {
                    return null;
                }
            };

            vm.getSubscriptionType = function (type) {
                if (!type)
                    return '';

                else if (type == 1)
                    return 'Year';

                else if (type == 2)
                    return 'Month';
            };

            vm.getLeads = function () {
                vm.loading = true;

                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                dealService.getDeals(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            // Export To Excel
            vm.exportToExcel = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.user !== null)
                    vm.filters.CreatedBy = vm.filters.user.id;
                if (vm.filters.nationality !== null)
                    vm.filters.country = vm.filters.nationality.name;
                if (vm.filters.company !== null && vm.filters.company.nationality !== null)
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
            function openCreateOrEditLeadModal(leadId, stage) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/sales/deals/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.crm.sales.deals.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        leadId: function () {
                            return leadId;
                        },
                        stage: function () {
                            return stage;
                        },
                        inquiry: function () {
                            return null;
                        }

                    }
                });

                modalInstance.result.then(function (result) {
                    //vm.getLeads();
                    vm.getDealForReport();
                });
            }

            vm.createLead = function (stage) {

                openCreateOrEditLeadModal(null, stage);
            };

            vm.editLead = function (lead) {
                openCreateOrEditLeadModal(lead.id, lead.stage);
            };
            vm.viewLead = function (lead) {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/sales/deals/viewDeal.cshtml',
                    controller: 'tenant.views.crs.crm.sales.deals.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        leadId: function () {
                            return lead.id;
                        },
                        stage: function () {
                            return lead.stage;
                        },
                        inquiry: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getLeads();
                });
            };

            vm.deleteLead = function (row) {
                abp.message.confirm(
                    'Are you sure you want to remove Lead?', //app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            dealService.deleteDeal({
                                id: row.id
                            }).success(function () {
                                //vm.getLeads();
                                vm.getDealForReport();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.verifyLead = function (row) {
                abp.message.confirm(
                    'Are you sure you want to verify Lead?', //app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            dealService.verifyDeal(row.id).success(function () {
                                vm.getLeads();
                                abp.notify.success(app.localize('SuccessfullyVerify'));
                            });
                        }
                    }
                );
            };

            vm.leadLog = function (lead) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/marketing/leads/leadLog.cshtml',
                    controller: 'tenant.views.crs.crm.marketing.leads.leadLog as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        lead: function () {
                            return lead;
                        }

                    }
                });
                modalInstance.result.then(function (result) {
                    //vm.getLeads();
                    vm.getDealForReport();
                });
            };


            function openCreateFarmModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/marketing/leads/createFarmModal.cshtml',
                    controller: 'host.views.marketing.leads.createFarmModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    //resolve: {
                    //    : function () {
                    //        return inquiry;
                    //    }
                    //}
                });

                modalInstance.result.then(function (result) {
                    vm.getLeads();
                });
            }
            vm.createFarm = function () {
                openCreateFarmModal(null);
            };

            vm.report = function () {


                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/host/views/marketing/leads/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            function getProducts() {
                vm.loading = true;
                productService.getCRMProducts({}).success(function (data) {

                    vm.products = data.items;
                    vm.loading = false;
                });
            };

            vm.getStageNameForGroupBy = function (stage) {
                if (stage === 3) {
                    return 'Deals';
                }
                else if (stage === 2) {
                    return 'Leads';
                }
                else if (stage === 1) {
                    return 'Prospects';
                }
                else {
                    return '';
                }
            };

            vm.getDealForReport = function () {
                //debugger
                vm.loading = true;
                vm.saving = true;
                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.filters.salesPersonUserIds = [];
                if (vm.filters.salesPersonUser != null && vm.filters.salesPersonUser.length > 0) {
                    angular.forEach(vm.filters.salesPersonUser, function (value) {
                        vm.filters.salesPersonUserIds.push(value.id);
                    });
                }
                dealService.getDealsForReport(vm.filters).success(function (result) {
                    vm.leads = result;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                    vm.saving = false;
                });
            };
            vm.inputFocus = function (row) {
                setTimeout(function () {
                    $("#followUp_" + row.id).focus();
                }, 100);
            }

            vm.saveFollowUp = function (row) {

                setTimeout(function () {
                    if (!row.nextFollowupDate._i) {
                        row.nextFollowupDate = moment(row.nextFollowupDate).startOf('day').utc();
                        vm.rowSaved(row, undefined, true);
                    }
                    else {
                        row.enableFollowUp = false;
                        $scope.$apply();
                    }
                }, 100);


            }

            vm.rowSaved = function (row, list, flag) {
                if (row.salesPersonUser)
                    row.salesPersonUserId = row.salesPersonUser.id;
                const input = {
                    lead: row,
                    flag: flag
                };
                row.enableFollowUp = false;
                dealService.updateCRMDealInline(input).success(function (result) {
                    vm.getDealForReport();
                    if (row.status != 0 && list != undefined) {
                        var index = list.statusList.findIndex(function (obj) {
                            return obj.id === row.id;
                        });

                        // If the object is found, remove it from the array
                        if (index !== -1) {
                            list.statusList.splice(index, 1);
                        }
                        var specificStage = vm.leads.find(function (obj) {
                            return obj.stage === row.stage;
                        });
                        if (specificStage == undefined) {
                            vm.leads.push({ stage: row.stage, stageList: [{ status: row.status, statusList: [row], totalSetupCharges: row.setupCharges, totalSubscriptionCharges: row.subscriptionCharges, subscriptionType: row.subscriptionType }] });
                        }
                        else {

                            var specificStatus = specificStage.stageList.find(function (obj) {
                                return obj.status === row.status;
                            });
                            if (specificStatus == undefined) {
                                specificStage.stageList.push({ status: row.status, statusList: [row], totalSetupCharges: row.setupCharges, totalSubscriptionCharges: row.subscriptionCharges, subscriptionType: row.subscriptionType });
                            }
                            else {

                                specificStatus.statusList.push(row);
                                vm.totalSetupPerStatusValue(specificStatus);
                                vm.totalSubscriptionPerStatusValue(specificStatus);
                            }
                        }
                        vm.totalSetupPerStatusValue(list);
                        vm.totalSubscriptionPerStatusValue(list);
                        row.isEnabledStatus = false;
                    }

                });
            };

            vm.saveAssigned = function (task) {
                clearInterval(myInterval);
                task.salesPerson = task.salesPersonUser.name;
                task.isEnabled = false;
                vm.rowSaved(task, undefined, false);

            };

            var myInterval = null;

            var tempRow = {};
            vm.assignUser = function (task) {

                task.isEnabled = true;
                setTimeout(function () {
                    $("#uiSelect_" + task.id + " span")[0].click();
                    tempRow = task;
                }, 100);
                myInterval = setInterval(vm.focsOut, 1);
            }

            vm.focsOut = function () {
                // Focus logic here
                $("#uiSelect_" + tempRow.id).focusout(function () {
                    clearInterval(myInterval);
                    setTimeout(function () {
                        tempRow.isEnabled = false;
                    }, 225);

                });
            };

            vm.focusStatus = function (task) {

                setTimeout(function () {
                    $("#uiSelectStatus_" + task.id).focus().click();
                }, 100);
            }

            vm.totalSetupPerStatusValue = function (List) {
                var totalSetupPerStatusValue = 0;
                for (var i in List.statusList) {
                    totalSetupPerStatusValue += parseFloat(List.statusList[i].setupCharges);
                }
                List.totalSetupCharges = parseFloat(totalSetupPerStatusValue);
                //$scope.$apply();
            }
            vm.totalSubscriptionPerStatusValue = function (List) {
                var totalSubscriptionPerStatusValue = 0;
                for (var i in List.statusList) {
                    totalSubscriptionPerStatusValue += parseFloat(List.statusList[i].subscriptionCharges);
                }
                List.totalSubscriptionCharges = parseFloat(totalSubscriptionPerStatusValue);
            }

            vm.totalValueChange = function (row) {
                row.totalValue = (parseFloat(vm.calculatedValue(row)) * 12) + parseFloat(row.setupCharges);
            };


            vm.calculatedValue = function (row) {
                if (row.subscriptionType == 2) {
                    return row.subscriptionCharges;
                }
                else {
                    return 0;
                }
            };

            vm.totalSetupCharges = function (List) {
                var totalSetupCharges = 0;
                for (var i in List) {
                    totalSetupCharges += List[i].totalSetupCharges;
                }
                return totalSetupCharges;
            }

            vm.totalSubscriptionCharges = function (List) {
                var totalSubscriptionCharges = 0;
                for (var i in List) {
                    totalSubscriptionCharges += List[i].totalSubscriptionCharges;
                }
                return totalSubscriptionCharges;
            }

            vm.totalValue = function (List) {
                var totalValue = 0;
                for (var i in List) {
                    for (var j in List[i].statusList) {
                        totalValue += List[i].statusList[j].totalValue;
                    }
                }
                return totalValue;
            }

            vm.totalStatusCount = function (List) {
                var totalCount = 0;
                for (var i in List) {
                    totalCount += List[i].statusList.length;
                }
                return totalCount;
            }

            function init() {
                vm.getbusinessDivisions();
                initDate();
                vm.getStatuses();
                getProducts();
                //vm.getLeads();
                vm.getDealForReport();
            }
            init();
        }
    ]);
