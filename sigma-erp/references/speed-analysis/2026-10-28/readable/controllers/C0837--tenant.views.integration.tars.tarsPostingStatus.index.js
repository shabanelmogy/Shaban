// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:224619-225190
appModule.controller('tenant.views.integration.tars.tarsPostingStatus.index', [
        '$scope', '$http', '$uibModal', 'uiGridConstants', 'abp.services.app.tarsPostingStatus', 'abp.services.app.tarsPosting',
        'abp.services.app.azureJobForTars', 'appSession',
        function ($scope, $http, $uibModal, uiGridConstants, tarsPostingStatusService, tarsPostingService, azureJobService, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            //vm.statuses = [
            //    { type: "Pending", id: 0 },
            //    { type: "Created", id: 1 },
            //    { type: "Picked", id: 2 },
            //    { type: "Wait", id: 3 },
            //    { type: "Error", id: 4 },
            //    { type: "Success", id: 5 },
            //    { type: "Expired", id: 6 },
            //    { type: "Ignored", id: 7 },
            //    { type: "Grace Period Expired", id: 8 }
            //];

            vm.statuses = [
                { type: "Pending", id: 0 },
                { type: "Success", id: 5 },
                { type: "Ignored", id: 7 }
                
            ];
            vm.getStatusName = function (id) {
                if (id == 0)
                    return "Pending"
                else if (id == 1)
                    return "Queued"
                else if (id == 2)
                    return "Picked"
                else if (id == 3)
                    return "Wait"
                else if (id == 4)
                    return "Error"
                else if (id == 5)
                    return "Success"
                else if (id == 6)
                    return "Expired"
                else if (id == 7)
                    return "Ignored"
                else if (id == 8)
                    return "Grace Period Expired"
                else if (id == 9)
                    return "Pending"
            }
            
            vm.speedOperations = [
                { name: "Rental Agreement Opening", id: 1 },
                { name: "Rental Agreement Editing", id: 2 },
                { name: "Rental Agreement CutShort", id: 3 },
                { name: "Replacement", id: 4 },
                { name: "Rental Agreement Closing", id: 5 },
                { name: "Lease Agreement Opening", id: 6 },
                { name: "Lease Agreement Editing", id: 7 },
                { name: "Lease Agreement Closing", id: 8 },
                { name: "NRM Opening", id: 9 },
                { name: "NRM Editing", id: 10 },
                { name: "NRM Closing", id: 11 },
                { name: "Workshop Opening", id: 12 },
                { name: "Workshop Closing", id: 13 },
                { name: "Workshop Editing", id: 14 },
                { name: "Delivery Opening", id: 15 },
                { name: "Delivery Closing", id: 16 },
                { name: "Delivery Editing", id: 17 },
                { name: "Collection Opening", id: 18 },
                { name: "Collection Closing", id: 19 },
                { name: "Collection Editing", id: 20 }
            ];

            vm.getSpeedOperationName = function (id) {
                if (id == 1)
                    return "Rental Agreement Opening"
                else if (id == 2)
                    return "Rental Agreement Editing"
                else if (id == 3)
                    return "Rental Agreement CutShort"
                else if (id == 4)
                    return "Replacement"
                else if (id == 5)
                    return "Rental Agreement Closing"
                else if (id == 6)
                    return "Lease Agreement Opening"
                else if (id == 7)
                    return "Lease Agreement Editing"
                else if (id == 8)
                    return "Lease Agreement Closing"
                else if (id == 9)
                    return "NRM Opening"
                else if (id == 10)
                    return "NRM Editing"
                else if (id == 11)
                    return "NRM Closing"
                else if (id == 12)
                    return "Workshop Opening"
                else if (id == 13)
                    return "Workshop Closing"
                else if (id == 14)
                    return "Workshop Editing"
                else if (id == 15)
                    return "Delivery Opening"
                else if (id == 16)
                    return "Delivery Closing"
                else if (id == 17)
                    return "Delivery Editing"
                else if (id == 18)
                    return "Collection Opening"
                else if (id == 19)
                    return "Collection Closing"
                else if (id == 20)
                    return "Collection Editing"
            }

            vm.tarsOperations = [
                { name: "Agreement Opening", id: 1 },
                { name: "Agreement Modification", id: 2 },
                { name: "Replacement", id: 3 },
                { name: "Agreement Closing", id: 4 },
                { name: "NRM Opening", id: 5 },
                { name: "NRM Closing", id: 6 },
                { name: "Workshop Opening", id: 7 },
                { name: "Workshop Closing", id: 8 },
                { name: "NRM Modification", id: 9 },
                { name: "Workshop Modification", id: 10 },
                { name: "Delivery Opening", id: 11 },
                { name: "Delivery Closing", id: 12 },
                { name: "Delivery Modification", id: 13 },
                { name: "Collection Opening", id: 14 },
                { name: "Collection Closing", id: 15 },
                { name: "Collection Modification", id: 16 }
            ];

            vm.disableDate = false;

            vm.filters = {
                enableDateRange: false,
                agreementNo: null,
                //status: 4,
                statusesArray:
                    [
                        { id: 0, type: 'Pending' },
                        { id: 4, type: 'Error' },
                        { id: 6, type: 'Expired' },
                        { id: 8, type: 'Grace Period Expired' }
                    ],
                statuses: [0, 4, 6, 8],
                speedOperation: '',
                tarsOperation: '',
                startDate: null,
                endDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: null,
                    endDate: null
                };
            }

            vm.permissions = {
                view: abp.auth.hasPermission('Page.TARS.TARSPostingStatus.View'),
                retry: abp.auth.hasPermission('Page.TARS.TARSPostingStatus.Retry')
            };

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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
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
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewTarsPostingStatus(row.entity)">' + app.localize('View') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.retry && ((row.entity.status == 0 && (row.entity.errorType==1 || row.entity.errorType==3)) || ((row.entity.status==1 || row.entity.status==2 || row.entity.status==3) && row.entity.errorType==3) || ((row.entity.status==4 || row.entity.status==6) && row.entity.errorType==4))" ng-click="grid.appScope.retryTarsPosting(row.entity)">' + app.localize('Retry') + '</a></li>' +
                            '      <li ng-if="(row.entity.error!=\'Attachment\' && row.entity.status != 0) || row.entity.status == 8 || row.entity.status == 4 || row.entity.status == 6 || (row.entity.errorType != null && row.entity.error!=\'Attachment\')"><a ng-click="grid.appScope.tryPosting(row.entity)">Try Posting</a></li>' +
                            '      <li ng-if="row.entity.status == 0 || row.entity.status == 4 || row.entity.status == 6"><a ng-click="grid.appScope.openIgnoredReasonModal(row.entity)">Mark as Ignored</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Operation'),
                        field: 'speedOperation',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getSpeedOperationName(row.entity.speedOperation)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('AgreementNo'),
                        field: 'agreementNo',

                    },
                    {
                        name: app.localize('MovementNo'),
                        field: 'movementNo',

                    },
                    {
                        name: app.localize('DateTime'),
                        field: 'movementDateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.movementDateTime)}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Status'),
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getStatusName(row.entity.status)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Error',
                        field: 'error'
                    },
                    {
                        name: app.localize('NoOfTries'),
                        field: 'noOfTries'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "refNo desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getTarsPostingStatus();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTarsPostingStatus();
                    });
                },
                data: []
            };


            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            //vm.changeStatusFilter = function () {
            //    debugger;
            //    vm.filters.statuses = [];
            //    if (vm.filters.statusesArray.length > 0) {
            //        angular.forEach(vm.filters.statusesArray, function (value) {
            //            debugger;
            //            vm.filters.statuses.push(value.id);
            //        });
            //    }
            //}
            vm.changeStatusFilter = function () {
                vm.filters.statuses = [];
                if (vm.filters.status != null) {
                    if (vm.filters.status === 0) {
                        vm.filters.statuses =  [0, 4, 6, 8]
                    }
                    if (vm.filters.status === 5) {
                        vm.filters.statuses = [5]
                    }
                    if (vm.filters.status === 7) {
                        vm.filters.statuses = [7]
                    }
                }
            }

            vm.viewTarsPostingStatus = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/integrations/tars/tarsPostingStatus/viewModal.cshtml',
                    controller: 'tenant.views.crs.integrations.tars.tarsPostingStatus.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tarsPostingId: function () {
                            return row.id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result == "saved") {
                        vm.getTarsPostingStatus();
                    }
                });
            }

            vm.openIgnoredReasonModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/integrations/tars/tarsPostingStatus/tarsPostingIgnoredReasonModal.cshtml',
                    controller: 'tenant.views.crs.integrations.tars.tarsPostingStatus.tarsPostingIgnoredReasonModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tarsPosting: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTarsPostingStatus();
                });
            }

            vm.tryPosting = function (row) {
                debugger
                if (row.movementDateTime != null)
                {
                    var UtcNow = moment().utc();
                    var hoursPassed = UtcNow.diff(row.movementDateTime, 'hours');
                    if (hoursPassed>=3) {
                        abp.message.confirm(
                            app.localize('TarsGracePeriodExpired'),
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    var tenantId = appSession.tenant.id;
                                    $http.get("https://speedserviceapp.azurewebsites.net/api/UpdatePosting?code=Js4wsXSqX6KLsIH0GdnpLXlVcs7Glhall2wD0q4/mmScYRIyTVtWAA==&id=" + row.id + "&tenantId=" + tenantId).then(function (response) {
                                        abp.notify.success(response.data);
                                        vm.getTarsPostingStatus();
                                    });
                                }
                            }
                        );
                    }

                    else {
                        var tenantId = appSession.tenant.id;
                        $http.get("https://speedserviceapp.azurewebsites.net/api/UpdatePosting?code=Js4wsXSqX6KLsIH0GdnpLXlVcs7Glhall2wD0q4/mmScYRIyTVtWAA==&id=" + row.id + "&tenantId=" + tenantId).then(function (response) {
                            abp.notify.success(response.data);
                            vm.getTarsPostingStatus();
                        });
                    }

                }
                else
                {
                    abp.notify.error("No MovementDateTime found!");
                }

                //$http({
                //    method: 'GET',
                //    url: 'https://speedserviceapp.azurewebsites.net/api/UpdatePosting?code=Js4wsXSqX6KLsIH0GdnpLXlVcs7Glhall2wD0q4/mmScYRIyTVtWAA==',
                //    headers: {
                //        'Content-Type': 'application/json'
                //    }
                //}).then(function (response) {
                //        alert(JSON.stringify(response));
                //        vm.getTarsPostingStatus();
                //    });
            }

            vm.retryTarsPosting = function (row) {
                if (row.speedOperation == 1 && row.tarsOperation == 1) {
                    createAgreementForTars(row);
                }
                else if (row.speedOperation == 2 && row.tarsOperation == 2) {
                    updateAgreementForTars(row);
                }
                else if (row.speedOperation == 5 && row.tarsOperation == 4) {
                    createCloseAgreementInputForTars(row);
                }
                else if (row.speedOperation == 4 && row.tarsOperation == 3) {
                    createReplacementAgreementInputForTars(row);
                }
            }

            function createAgreementForTars(row) {
                vm.loading = true;
                tarsPostingService.createOrUpdateAgreementInputForTars({
                    agreementId: row.agreementId,
                    speedOperation: row.speedOperation,
                    tarsOperation: row.tarsOperation,
                    tarsBatchId: row.tarsBatchId,
                    tarsPostingId: row.id
                }).success(function (data) {
                    if (data.isError == true)
                        abp.message.error(data.errorMsg, 'Error');
                }).finally(function () {
                    vm.loading = false;
                    vm.getTarsPostingStatus();
                });
            }

            function updateAgreementForTars(row) {
                vm.loading = true;
                tarsPostingService.createOrUpdateAgreementInputForTars({
                    agreementId: row.agreementId,
                    speedOperation: row.speedOperation,
                    tarsOperation: row.tarsOperation,
                    tarsBatchId: row.tarsBatchId,
                    tarsPostingId: row.id
                }).success(function (data) {
                    if (data.isError == true)
                        abp.message.error(data.errorMsg, 'Error');
                }).finally(function () {
                    vm.loading = false;
                    vm.getTarsPostingStatus();
                });
            }

            function createCloseAgreementInputForTars(row) {
                vm.loading = true;
                tarsPostingService.createCloseAgreementInputForTars({
                    agreementId: row.agreementId,
                    speedOperation: row.speedOperation,
                    tarsOperation: row.tarsOperation,
                    tarsBatchId: row.tarsBatchId,
                    tarsPostingId: row.id
                }).success(function (data) {
                    if (data.isError == true)
                        abp.message.error(data.errorMsg, 'Error');
                }).finally(function () {
                    vm.loading = false;
                    vm.getTarsPostingStatus();
                });
            }

            function createReplacementAgreementInputForTars(row) {
                vm.loading = true;
                tarsPostingService.createReplacementAgreementInputForTars({
                    agreementId: row.agreementId,
                    speedOperation: row.speedOperation,
                    tarsOperation: row.tarsOperation,
                    tarsBatchId: row.tarsBatchId,
                    tarsPostingId: row.id
                }).success(function (data) {
                    if (data.isError == true)
                        abp.message.error(data.errorMsg, 'Error');
                }).finally(function () {
                    vm.loading = false;
                    vm.getTarsPostingStatus();
                });
            }

            var queueItems = [];
            function updateTarsPostingStatus() {
                //vm.loading = true;
                azureJobService.getTarsPostingsForAzureJob().success(function (data) {
                    for (var i = 0; i < data.items.length; i++) {
                        var obj = queueItems.find(x => x == data.items[i]);
                        if (!obj)
                            queueItems.push(data.items[i]);
                    };

                    angular.forEach(queueItems, function (val, key) {
                        azureJobService.updateTarsPostingStatuses({
                            id: val
                        }).success(function (data) {

                        }).finally(function () {
                            var index = queueItems.indexOf(val);
                            queueItems.splice(index, 1);
                            vm.getTarsPostingStatus(false);
                        });
                    })

                }).finally(function () {
                    //setTimeout(function () {
                    //    updateTarsPostingStatus();
                    //}, 10000);
                });
            }

            vm.getTarsPostingStatus = function (isLoading) {
                if (isLoading==true)
                    vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                tarsPostingStatusService.getTarsPostingStatus(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                   
                }).finally(function () {
                    if (isLoading == true)
                        vm.loading = false;
                    //updateTarsPostingStatus();
                    setTimeout(function () {
                        vm.getTarsPostingStatus(false);
                    }, 20000);
                });
            };

            function init() {
                initDate();
                vm.filters.status = 0;
                vm.filters.statuses = [0, 4, 6, 8]
                vm.getTarsPostingStatus(true);
                //updateTarsPostingStatus();
            }

            init();
        }
    ]);
