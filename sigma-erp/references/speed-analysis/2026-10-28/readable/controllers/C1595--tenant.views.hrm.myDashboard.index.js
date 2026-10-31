// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:440019-440289
appModule.controller('tenant.views.hrm.myDashboard.index', [
        '$scope', '$state', '$uibModal', 'appSession', 'abp.services.app.directory', 'abp.services.app.leaveDashboard', 'abp.services.app.leaveType',
        function ($scope, $state, $uibModal, appSession, directoryService, leaveDashboardService, leaveTypeService) {
            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.loading = false;
            vm.leaveTypes = [];
            vm.staffs = [];
            vm.overallUsedPercentage = 0;

            vm.dashboard = {
                overall: {},
                leaveTypes: [],
                monthlyTrend: [],
                recentRequests: [],
                upcomingLeaves: [],
                pendingRejoiningCount: 0
            };

            vm.filters = {
                staff: null,
                leaveTypeId: null,
                // Left off on the first load so the service resolves the staff record of the
                // logged in user; turned on when the staff selection is cleared by hand.
                allStaff: false
            };

            vm.enumStatus = [
                { name: "NotApproved", id: 1 },
                { name: "Approved", id: 2 },
                { name: "Rejected", id: 3 }
            ];

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            // charts ------------------------------------------------------------------

            vm.statusPieChart = {
                type: "PieChart",
                data: {
                    cols: [
                        { id: "s", label: app.localize('Status'), type: "string" },
                        { id: "d", label: app.localize('Days'), type: "number" }
                    ],
                    rows: []
                },
                options: {
                    legend: { position: 'none' },
                    width: 140,
                    height: 140,
                    chartArea: { left: 10, top: 10, bottom: 10, right: 10, height: "100%" },
                    colors: ['#f1c40f', '#26c281', '#ed6b75']
                }
            };

            vm.monthlyChart = {
                type: "ColumnChart",
                data: {
                    cols: [
                        { id: "m", label: app.localize('Month'), type: "string" },
                        { id: "p", label: app.localize('Pending'), type: "number" },
                        { id: "a", label: app.localize('Approved'), type: "number" },
                        { id: "r", label: app.localize('Rejected'), type: "number" }
                    ],
                    rows: []
                },
                options: {
                    isStacked: true,
                    legend: { position: 'top', alignment: 'end' },
                    height: 280,
                    chartArea: { left: 40, top: 40, bottom: 40, right: 20 },
                    vAxis: { minValue: 0 },
                    colors: ['#f1c40f', '#26c281', '#ed6b75']
                }
            };

            // helpers -----------------------------------------------------------------

            vm.getLocalDate = function (date) {
                if (date == null) {
                    return "";
                }
                return moment(moment.utc(date).toDate()).format(vm.dateFormat);
            };

            vm.statusName = function (status) {
                var match = vm.enumStatus.filter(function (item) { return item.id === status; })[0];
                if (!match) {
                    return "";
                }
                return match.id === 1 ? app.localize('Pending') : app.localize(match.name);
            };

            vm.statusBadgeClass = function (status) {
                if (status === 2) {
                    return 'badge-success';
                }
                if (status === 3) {
                    return 'badge-danger';
                }
                return 'badge-warning';
            };

            vm.progressClass = function (type) {
                if (!type || type.usedPercentage < 60) {
                    return 'green-haze';
                }
                return type.usedPercentage < 85 ? 'yellow-casablanca' : 'red-haze';
            };

            vm.balanceFontClass = function (type) {
                if (!type || type.remainingLeaves > 0) {
                    return 'font-green-haze';
                }
                return 'font-red-haze';
            };

            // Share of a status in the total applied days, used to size the tile bars.
            vm.sharePercentage = function (days) {
                var applied = vm.dashboard.overall.appliedDays;
                if (!applied || !days) {
                    return 0;
                }
                return Math.round(days / applied * 100);
            };

            // filters -----------------------------------------------------------------

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('year'),
                    endDate: moment().endOf('year')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.search();
            };

            vm.clearStaff = function () {
                vm.filters.staff = null;
                vm.filters.allStaff = true;
                vm.search();
            };

            vm.staffSelected = function () {
                vm.filters.allStaff = false;
                vm.search();
            };

            vm.searchStaff = function ($select) {
                //contactType: 1 (staff)
                return directoryService.search({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                    vm.staffs = response.data.items;
                });
            };

            vm.searchStaffPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 1;
                        }
                    }
                }).result.then(function (staff) {
                    if (staff != null) {
                        vm.filters.staff = staff;
                        vm.filters.allStaff = false;
                        vm.search();
                    }
                });
            };

            vm.goToLeaves = function () {
                /*$state.go('tenant.hrm_leaves');*/
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/leaves/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.leaves.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaveId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.search();
                });
            };

            // data --------------------------------------------------------------------

            function getLeaveTypes() {
                leaveTypeService.getLeaveType({}).success(function (data) {
                    vm.leaveTypes = data.items;
                });
            }

            function fillCharts() {
                var overall = vm.dashboard.overall;

                vm.statusPieChart.data.rows.length = 0;
                vm.statusPieChart.data.rows.push({ c: [{ v: app.localize('Pending') }, { v: overall.pendingDays }] });
                vm.statusPieChart.data.rows.push({ c: [{ v: app.localize('Approved') }, { v: overall.approvedDays }] });
                vm.statusPieChart.data.rows.push({ c: [{ v: app.localize('Rejected') }, { v: overall.rejectedDays }] });

                vm.monthlyChart.data.rows.length = 0;
                angular.forEach(vm.dashboard.monthlyTrend, function (month) {
                    vm.monthlyChart.data.rows.push({
                        c: [
                            { v: month.monthName },
                            { v: month.pendingDays },
                            { v: month.approvedDays },
                            { v: month.rejectedDays }
                        ]
                    });
                });
            }

            vm.search = function () {
                vm.loading = true;
                var staffId = appSession.user.contactId;

                var input = {
                    staffId: staffId,
                    leaveTypeId: vm.filters.leaveTypeId != null ? vm.filters.leaveTypeId : 0,
                    // Sent as plain dates so the period is not shifted by the UTC conversion.
                    startDate: moment(vm.dateRangeModel.startDate).format('YYYY-MM-DD'),
                    endDate: moment(vm.dateRangeModel.endDate).format('YYYY-MM-DD'),
                    recentRequestCount: 10
                };

                leaveDashboardService.getLeaveDashboard(input).then(function (response) {
                    vm.dashboard = response.data;
                    vm.overallUsedPercentage = vm.dashboard.overall.totalLeaves > 0
                        ? Math.round(Math.min(vm.dashboard.overall.bookedLeaves / vm.dashboard.overall.totalLeaves * 100, 100))
                        : 0;

                    // Reflect the staff the service resolved (the logged in user on first load).
                    if (staffId === 0 && vm.dashboard.staffId) {
                        vm.filters.staff = { id: vm.dashboard.staffId, name: vm.dashboard.staffName };
                    }

                    fillCharts();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                initDate();
                getLeaveTypes();
                vm.search();
            }

            init();
        }
    ]);
