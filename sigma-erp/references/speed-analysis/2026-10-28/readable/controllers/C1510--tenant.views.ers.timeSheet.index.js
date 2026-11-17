// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:411974-412501
appModule.controller('tenant.views.ers.timeSheet.index', [
        '$scope', 'utilities', 'appSession', '$stateParams', '$uibModal', 'abp.services.app.equipmentTimeSheet', 'abp.services.app.directory', 'uiGridConstants',
        function ($scope, utilities, appSession, $stateParams, $uibModal, timeSheetService, directoryService, uiGridConstants) {
            var vm = this;
            vm.invalidForm = false;

            //vm.filters = {
            //    agreement: null
            //}
            //vm.agreements = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.filters = {
                enableDateRange: true,
                agreementId: null,
                agreement: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
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

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            // search from dropdown
            vm.searchAgreements = function ($select) {
                return timeSheetService.searchAgreements({ keyword: $select.search }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            };


            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };



            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };
            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.getAgreementType = function (type) {
                if (type == 1) {
                    return app.localize('Daily');
                }
                else if (type == 2) {
                    return app.localize('Weekly');
                }
                else if (type == 3) {
                    return app.localize('Monthly');
                }
                else if (type == 4) {
                    return app.localize('Lease');
                }
                else if (type == 5) {
                    return app.localize('LeaseToOwn');
                }
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDayNo = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format("D");
                }
                else {
                    return "";
                }
            };

            vm.showAgreementNo = function (agreement) {
                if (agreement) {
                    return agreement.agreementNo + " (" + vm.getAgreementType(agreement.agreementType) + ")";
                }
                else {
                    return {};
                }
            }

            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                }
                else {
                    return "";
                }
            };

            vm.startOrEndHoursChanged = function (row) {
                if (!(row.startHours && row.endHours))
                    return;
                if (row.startHours > row.endHours)
                    return;

                var index = vm.timeSheet.indexOf(row);

                for (var i = index + 1; i < vm.timeSheet.length; i++) {
                    var hours = vm.timeSheet[i].hours ? vm.timeSheet[i].hours : vm.timeSheet[i - 1].hours;
                    vm.timeSheet[i].startHours = vm.timeSheet[i - 1].endHours;
                    vm.timeSheet[i].endHours = parseFloat(vm.timeSheet[i].startHours) + parseFloat(hours);
                    vm.timeSheet[i].hours = hours;
                }

            };

            vm.startTimeChanged = function (row) {
                var index = vm.timeSheet.indexOf(row);

                if (index > 0)
                    return;
                for (var i = index + 1; i < vm.timeSheet.length; i++) {
                    if (!vm.timeSheet[i].startDateTime)
                        vm.timeSheet[i].startDateTime = moment(row.startDateTime).utc();
                }

            };

            vm.endTimeChanged = function (row) {
                var index = vm.timeSheet.indexOf(row);

                if (index > 0)
                    return;
                for (var i = index + 1; i < vm.timeSheet.length; i++) {
                    if (!vm.timeSheet[i].endDateTime)
                        vm.timeSheet[i].endDateTime = moment(row.endDateTime).utc();
                }

            };

            $scope.onFocusChange = function ($event) {
                setTimeout(function () {
                    $event.target.select();
                }, 200);
            };

            vm.calculateTotalBreakDowns = function () {
                var DownSum = 0.0;
                angular.forEach(vm.timeSheet, function (row) {
                    if (row.breakdownHours) {
                        DownSum += parseFloat(row.breakdownHours);
                    }
                });

                return utilities.round(DownSum, 2);
            };

            vm.calculateTotalHours = function () {
                var HourSum = 0.0;
                angular.forEach(vm.timeSheet, function (row) {
                    if (row.hours) {
                        HourSum += parseFloat(row.hours);
                    }
                });

                return utilities.round(HourSum, 2);
            };

            vm.changeEmptyToNull = function () {
                angular.forEach(vm.timeSheet, function (elem, index) {
                    if (elem.startDateTime == '') {
                        elem.startDateTime = null;
                    }
                    if (elem.startHours == '') {
                        elem.startHours = null;
                    }
                    if (elem.endDateTime == '') {
                        elem.endDateTime = null;
                    }
                    if (elem.endHours == '') {
                        elem.endHours = null;
                    }
                    if (elem.breakdownHours == '') {
                        elem.breakdownHours = null;
                    }
                });
            };

            vm.calculateHours = function (row) {
                if (row.endHours && row.startHours) {
                    row.hours = (parseFloat(row.endHours) - parseFloat(row.startHours));
                }
                else {
                    row.hours = 0;
                }
                vm.calculateTotalBreakDowns();
                vm.calculateTotalHours();
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
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.editTimeSheet(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteTimeSheet(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'Date',
                        field: 'date',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Delivery Note',
                        field: 'agreement.agreementNo',
                        width: 250,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreement.agreementNo}} ({{row.entity.agreement.vehicle.plateNo}})</div>' +
                            '</div>'
                    },
                    {
                        name: 'Date',
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Start HM',
                        field: 'startHours',
                        width: 110,

                    },
                    {
                        name: 'Ending HM',
                        field: 'endHours',
                        width: 120,
                    },
                    {
                        name: 'Hours',
                        field: 'hours',
                        width: 80
                    },
                    //{
                    //    name: 'Breakdown Hours',
                    //    field: 'breakdownHours'
                    //},
                    {
                        name: 'Document',
                        field: 'document',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><a ng-if="row.entity.document.url" href="{{row.entity.document.url}}" target="_blank">{{grid.appScope.getOriginalName(row.entity.document)}}</a></div>' +
                            '<div class=\"ui-grid-cell-contents\"><a ng-if="!row.entity.document.url && row.entity.document" href="{{row.entity.document.url}}" target="_blank">{{grid.appScope.getOriginalName(row.entity.document)}}</a></div>' +
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

                        vm.getTimeSheets();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getTimeSheets();
                    });
                },
                data: []
            };

            vm.save = function () {
                vm.loading = true;
                vm.changeEmptyToNull();
                timeSheetService.saveOrUpdateTimeSheet({ timeSheetLines: vm.timeSheet }).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.getTimeSheet();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.createTimeSheet = function () {
                openCreateOrEditTimeSheetModal(null);
            };

            vm.editTimeSheet = function (entity) {
                openCreateOrEditTimeSheetModal(entity.id);
            };
            function openCreateOrEditTimeSheetModal(timeSheetId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/timeSheet/createOrEditModal.cshtml',
                    controller: 'tenant.views.ers.timeSheet.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                timeSheetId: timeSheetId,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTimeSheets();
                });
            }

            vm.createTimeSheetCharges = function (timeSheetId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/timeSheet/createOrEditChargesModal.cshtml',
                    controller: 'tenant.views.ers.timeSheet.createOrEditChargesModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                timeSheetId: timeSheetId,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTimeSheets();
                });
            }

            vm.deleteTimeSheet = function (timeSheet) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            timeSheetService.deleteTimeSheet({ id: timeSheet.id })
                                .success(function (result) {
                                    abp.notify.info(app.localize('DeletedSuccessfully'));
                                    vm.getTimeSheets();
                                }).error(function (result) {
                                    abp.notify.error(app.localize('Error'));
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }
                    }
                );
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/ers/timeSheet/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                timeSheetService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            //vm.getTimeSheet = function () {
            //    vm.loading = true;
            //    vm.filters.agreementId = vm.filters.agreement.id;

            //    var monthStartDate = moment(vm.filters.monthYear).startOf('month');
            //    var agreementStartDate = moment(vm.filters.agreement.startDate);

            //    if (agreementStartDate > monthStartDate) {
            //        monthStartDate = agreementStartDate;
            //    }
            //    vm.filters.startDate = monthStartDate;
            //    vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day');

            //    if (vm.filters.startDate > vm.filters.endDate) {
            //        vm.loading = false;
            //        abp.message.info("<h1>Agreement is started After this month</h1>", "", true)
            //        return;
            //    }


            //    timeSheetService.getTimeSheetForEdit(vm.filters).success(function (data) {
            //        vm.timeSheet = data;
            //        //vm.changeTime();
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};
            vm.clearAgreement = function () {
                vm.filters.agreement = null;
                vm.filters.agreementId = null;
            };
            vm.getTimeSheets = function () {
                vm.loading = true;

                //vm.filters.startDate = monthStartDate;
                //vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day');

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                timeSheetService.getTimeSheets(vm.filters).success(function (data) {
                    //vm.timeSheets = data.items;

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getTimeSheets();
        }
    ]);
