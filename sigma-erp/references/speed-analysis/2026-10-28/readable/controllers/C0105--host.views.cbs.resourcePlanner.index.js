// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:47037-48328
appModule.controller('host.views.cbs.resourcePlanner.index', [
        '$scope', '$uibModal', 'abp.services.app.resourcePlanner', 'abp.services.app.chargesSetting',
        function ($scope, $uibModal, resourcePlannerService, chargesSettingService) {
            var vm = this;
            vm.sectionRows = [];
            vm.Periods = [];
            vm.tableHeaderRows = [];
            vm.resourcePlannerService = resourcePlannerService;
            vm.widthSecond = 20;
            vm.minutesPerPixel = 3;
            vm.chargesSettings = [];
            vm.dateRangeModel = {};
            vm.zoomLevelIndex = 0;
            $scope.zoom = vm.zoomLevel;
            vm.selectionId = 0;
            vm.Users = [];













            vm.filters = {
                organizationUnitId: vm.selectionId,
                StartDate: vm.Start,
                EndDate: vm.End,
            };

            // Organization Unit
            vm.selectionName = null;
            vm.selectionId = null;
            vm.showOrganization = true;
            vm.isOrganization = false;
            vm.searchOrganizationContactPopup = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/resourcePlanner/searchOrganizationUnitModal.cshtml',
                    controller: 'host.views.cbs.resourcePlanner.searchOrganizationUnitModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });
                modalInstance.result.then(function (result) {
                    if (result) {
                        vm.selectionId = result.id;
                        vm.filters.organizationUnitId = result.id;
                        vm.selectionName = result.name;
                        vm.isOrganization = result.isOrganization;
                        vm.update();
                        

                    }

                });
            };
            vm.clearSelection = function () {
                vm.selectionName = null;
                vm.selectionId = null;
                vm.showOrganization = false;
                vm.filters.organizationUnitId = 0;

                vm.isOrganization = false;
                vm.update();
            };


            vm.getzoomLevel = function () {
                return vm.zoomLevel;
            };



            //vm.zoomLevels = [
            //    {
            //        name: '1 hour',
            //        minutesPerPixel: 9,
            //        boxWidth: 20,
            //        timeFrameHeaders: [

            //            'Do MMM',
            //            'HH'
            //        ],
            //        timeframePeriod: 180,
            //        label: '1 hours',

            //        minInterval: 8

            //    },
            //{
            //    name: '2 hours',
            //    minutesPerPixel: 18,
            //    boxWidth: 20,
            //    timeFrameHeaders: [

            //        'Do MMM',
            //        'HH'
            //    ],
            //    timeframePeriod: 360,
            //    label: '2 hours',
            //    minInterval: 15

            //},
            //];
            vm.zoomLevels = [{
                name: 'per hour',
                minutesPerPixel: 3,
                boxWidth: 20,
                timeFrameHeaders: [

                    'Do MMM',
                    'HH'
                ],
                timeframePeriod: 60,
                label: '1 hour',
                minInterval: 2


            },
            {
                name: '2 hours',
                minutesPerPixel: 6,
                boxWidth: 20,
                timeFrameHeaders: [

                    'Do MMM',
                    'HH'
                ],
                timeframePeriod: 120,
                label: '2 hours',
                minInterval: 4

            },
            {
                name: '4 hours',
                minutesPerPixel: 12,
                boxWidth: 20,
                timeFrameHeaders: [

                    'Do MMM',
                    'HH'
                ],
                timeframePeriod: 240,
                label: '4 hours',
                minInterval: 8

            },
            {
                name: '8 hours',
                minutesPerPixel: 24,
                boxWidth: 20,
                timeFrameHeaders: [

                    'Do MMM',
                    'HH'
                ],
                timeframePeriod: 480,
                label: '8 hours',
                minInterval: 15

            }];
            vm.zoomLevel = vm.zoomLevels[vm.zoomLevelIndex];

            //vm.Periods = [{
            //    Name: '3 days',
            //    Label: '3 days',
            //    TimeframePeriod: (60 * 1),
            //    TimeframeOverall: (60 * 24 * 3),
            //    TimeframeHeaders: [

            //        'Do MMM',
            //        'HH'
            //    ],
            //    Classes: 'period-3day'
            //},
            //{
            //    Name: '1 week',
            //    Label: '1 week',
            //    TimeframePeriod: (60 * 1),
            //    TimeframeOverall: (60 * 24 * 7),
            //    TimeframeHeaders: [

            //        'Do MMM',
            //        'HH'
            //    ],
            //    Classes: 'period-1week'
            //},
            //{
            //    Name: '1 month',
            //    Label: '1 month',
            //    TimeframePeriod: (60 * 1),
            //    TimeframeOverall: (60 * 24 * 30),
            //    TimeframeHeaders: [

            //        'Do MMM',
            //        'HH'
            //    ],
            //    Classes: 'period-1month'
            //}
            //];
            vm.allowDateRange = false;
            // vm.filterText = $stateParams.filterText || null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));


            var startDateModel = moment().startOf('day');
            var endDateModel = moment(startDateModel.format('YYYY-MM-DD')).add(7, 'days').endOf("day");
            vm.dateRangeModel = {
                startDate: startDateModel,
                endDate: endDateModel
            };
            $("#bookingSection").css({
                left: $("#calendar").find(".time-sch-section").outerWidth()
            });
            $('[data-toggle="tooltip"]').tooltip();




            vm.zoomIn = function () {

                if (vm.zoomLevelIndex > 0) {
                    vm.zoomLevelIndex = vm.zoomLevelIndex - 1;
                    vm.zoomLevel = vm.zoomLevels[vm.zoomLevelIndex];

                    vm.update();
                }
            };
            vm.zoomOut = function () {
                if (vm.zoomLevelIndex < vm.zoomLevels.length - 1) {
                    vm.zoomLevelIndex = vm.zoomLevelIndex + 1;
                    vm.zoomLevel = vm.zoomLevels[vm.zoomLevelIndex];
                    $scope.zoom = vm.zoomLevel;
                    var diff = endDateModel.diff(startDateModel, 'days') + 1;
                    //alert(diff);
                    //alert(vm.zoomLevel.minInterval);
                    if (diff < vm.zoomLevel.minInterval) {
                        var days = vm.zoomLevel.minInterval - diff;
                        //alert(days);

                        endDateModel = moment(endDateModel.format('YYYY-MM-DD')).add(days, 'days').endOf("day");

                        vm.dateRangeModel.endDate = endDateModel;
                    }
                    vm.update();
                }
            };



            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                    vm.dateRangeModel = {
                        startDate: moment(moment().format('YYYY-MM-DD')).startOf("day"),
                        endDate: moment(moment().format('YYYY-MM-DD')).add(7, 'days').add(-1, 'milliseconds').endOf("day"),
                    };
                    vm.init();
                });
            };

            vm.FillSchedule = function (users) {
                vm.Tasks = [];
                var items = vm.Items;
                var item, event, section, itemElem, eventElem, itemContent, itemName, itemIcon;
                var minuteDiff, splits, itemDiff, itemSelfDiff, eventDiff, calcTop, calcLeft, calcWidth, foundStart, foundEnd;
                var inSection = {},
                    foundPos, elem, prevElem, needsNewRow;
                var end, i;
                end = vm.GetEndOfPeriod();
                minuteDiff = Math.abs(vm.Start.diff(end, 'minutes'));
                for (var index = 0; index < users.length; index++) {
                    SelectedUser = users[index];
                    if (SelectedUser.UserType != "OrganizationUnit")
                    {
                        for (var taskIndex = 0; taskIndex < SelectedUser.userTasks.length; taskIndex++)
                        {
                        SelectedTask = SelectedUser.userTasks[taskIndex];
                            SelectedTask.startDate = vm.getlocalDate(SelectedTask.startDate);
                            if (SelectedTask.endDate == null)
                              {
                            continue;
                              }
                            else
                            {
                            SelectedTask.endDate = vm.getlocalDate(SelectedTask.endDate);
                            }

                            var STime = parseInt(moment(SelectedTask.startDate).format('H'));
                            var ETime = parseInt(moment(SelectedTask.endDate).format('H'));
                            if (STime < 9) {
                                SelectedTask.startDate = moment(SelectedTask.startDate).set({ "hour": 09, "minute": 00 });
                            }
                            else if (STime > 19)
                            {
                                SelectedTask.startDate = moment(SelectedTask.startDate).set({ "hour": 19, "minute": 00 });
                            }
                            if (ETime > 18 || ETime < 9) {
                                SelectedTask.endDate = moment(SelectedTask.endDate).set({ "hour": 19, "minute": 00 });
                            }
                            else if (ETime < 9) {
                                SelectedTask.endDate = moment(SelectedTask.endDate).set({ "hour": 09, "minute": 00 });
                            }

                            vm.Start = moment(vm.Start).set({ "hour": 09, "minute": 00 });
                            end = moment(end).set({ "hour": 19, "minute": 00 });

                            if (SelectedTask.startDate <= end && SelectedTask.endDate >= vm.Start) {
                            foundPos = null;
                            foundStart = moment(Math.max(SelectedTask.startDate, vm.Start));
                            foundEnd = moment(Math.min(SelectedTask.endDate, end));

                                  //Calculate Length
                                itemDiff = foundStart.diff(vm.Start, 'minutes');
                                var Days = itemDiff / 1440;
                                var IntergerValue = parseInt(Days);
                                var DecimalValue = Days - Math.floor(Days);
                                itemDiff = (IntergerValue * 600) + (DecimalValue * 1440);
                                calcLeft = (itemDiff / vm.zoomLevel.timeframePeriod) * vm.widthSecond;


                                //Calculate Width
                                //Start Day
                                var completeStartDay = moment(foundStart).set({ "hour": 00, "minute": 00, "second": 00 });
                                var TotalHoursPerStartDay = Math.abs(completeStartDay.diff(foundStart, 'hours'))
                                var NonWorkinghoursPerStartDay = TotalHoursPerStartDay - 9;
                                //End Day
                                var completeEndDay = moment(moment(foundEnd)).set({ "hour": 00, "minute": 00, "second": 00 });
                                var TotalHoursPerEndDay = Math.abs(completeEndDay.diff(foundEnd, 'hours'));
                                var NonWorkinghoursPerEndDay = 19 - TotalHoursPerEndDay;
                                //Calculate working hours
                                //itemSelfDiff = Math.abs(foundStart.diff(foundEnd, 'days'));
                                itemSelfDiff = Math.abs(completeStartDay.diff(completeEndDay.add('days', 1), 'days'));
                                var Days  = itemSelfDiff * 10;
                                itemSelfDiff = (Days - NonWorkinghoursPerStartDay - NonWorkinghoursPerEndDay) * 60;
                                calcWidth = ((itemSelfDiff / vm.zoomLevel.timeframePeriod) * vm.widthSecond) + 2;

                                calcTop = 0;
                            var data = {
                                id:SelectedTask.id,
                                title: SelectedTask.title,
                                start: SelectedTask.startDate,
                                sectionID: index,
                                end: SelectedTask.endDate,
                                classes: 'item-status-none',
                                zoom: vm.zoomLevel,
                                dateRange: { start: startDateModel, end: endDateModel, test: 5 }
                            };
                            var color = "#36c6d3";
                            var taskNode = {
                                allData: data,
                                classes: "time-sch-item ",
                                sectionId: index,
                                css: {
                                    top: calcTop,
                                    left: calcLeft + 'px',
                                    width: calcWidth + 'px',

                                },
                                childClass: "time-sch-item-content",
                                Start: false,
                                End: false,
                                color: color,   
                            };
                            if (SelectedTask.startDate >= vm.Start) {
                                taskNode.Start = true;
                            }
                            if (SelectedTask.endDate <= end) {
                                taskNode.End = true;
                            }
                                vm.Tasks.push(taskNode);
                            
                        }
                    }
                    }
                }

                end = vm.GetEndOfPeriod();

                var dataDummy = {
                    id: -1,
                    name: "",
                    start: vm.Start,
                    end: end,
                    sectionID: vm.Users.length - 1,
                    classes: 'item-status-none hidden',
                    status: 0
                };

                foundStart = moment(Math.max(vm.Start, vm.Start));
                foundEnd = moment(Math.min(end, end));
                itemDiff = foundStart.diff(vm.Start, 'minutes');
                itemSelfDiff = Math.abs(foundStart.diff(foundEnd, 'minutes'));

                calcTop = 0;
                calcLeft = (itemDiff / vm.zoomLevel.timeframePeriod) * vm.widthSecond;
                calcWidth = (itemSelfDiff / vm.zoomLevel.timeframePeriod) * vm.widthSecond;
                calcWidth = calcWidth + 10;
                var bookingNodeDummy = {
                    id: -1,
                    allData: dataDummy,
                    sectionId: vm.Users.length - 1,
                    classes: "time-sch-item hidden",
                    css: {
                        top: calcTop,
                        left: calcLeft + 'px',
                        width: calcWidth + 'px',

                    },
                    childClass: "time-sch-item-content hidden",
                    secondChildData: "",
                    thirdChildData: "",
                    Start: vm.dateRangeModel.startDate,
                    End: vm.dateRangeModel.endDate,
                    dummy: true,
                    status: 0
                };

                vm.Tasks.push(bookingNodeDummy);
            };
            vm.CreateSections = function (sections) {
                var timeCount, tr, td, sectionContainer, headers, i;
                timeCount = 1;
                headers = vm.tableHeaderRows;
                for (i = 0; i < headers.length; i++) {
                    if (timeCount < headers[i].filter(i => { return i.classes.includes('time-sch-date-header'); }).length) {
                        timeCount = headers[i].filter(i => { return i.classes.includes('time-sch-date-header'); }).length;
                    }
                }
                for (i = 0; i < sections.length-1; i++) {
                    var evenClass = (i % 2 === 0 ? 'time-sch-section-even' : 'time-sch-section-odd');
                    var sectionclass = "time-sch-section-container";

                    if (sections[i].UserType === "OrganizationUnit")
                    {
                      sectionclass = "time-sch-section-container-no-drop";
                    }
                  
                    var node = {
                        trClass: "time-sch-section-row " + evenClass,
                        trHeight: vm.MinRowHeight,
                        sectionId: i,
                        sectionClass: sectionclass,
                        sectionHeight: vm.MinRowHeight,
                        sectionData: sections[i],
                        list: []
                    };
                    var firstNode = {
                        tdClass: 'time-sch-section time-sch-section-content',
                        tdData: sections[i],
                        width: 250, plate: true

                    };
                    node.list.push(firstNode);
                    vm.end = vm.GetEndOfPeriod();
                    var start = moment(vm.Start).set({ "hour": 00, "minute": 00 });
                    vm.minuteDiff = Math.abs(start.diff(vm.end, 'minutes'))+1;
                    vm.dayDiff = Math.abs(vm.Start.diff(vm.end, 'days'))+1;
                     var minutes = Math.round(vm.minuteDiff, 2) - (vm.dayDiff * 840);
                    vm.splits = Math.round((minutes / vm.zoomLevel.timeframePeriod), 2);
                    node.width = vm.splits * vm.widthSecond;

                    vm.sectionRows.push(node);
                }
                var dummynode = {
                    trClass: "hidden",
                    trHeight: vm.MinRowHeight,
                    sectionId: i,
                    sectionClass: sectionclass,
                    sectionHeight: vm.MinRowHeight,
                    sectionData: sections[i],
                    list: []
                };
                vm.sectionRows.push(dummynode);

                return;
            };
            vm.FillSections = function () {
                vm.CreateSections(vm.Users);
                vm.FillSchedule();
            };
            vm.SetupPrototypes = function () {
                moment.fn.tsAdd = function (input, val) {
                    var dur;
                    // switch args to support add('s', 1) and add(1, 's')
                    if (typeof input === 'string') {
                        dur = moment.duration(+val, input);
                    } else {
                        dur = moment.duration(input, val);
                    }
                    this.tsAddOrSubtractDurationFromMoment(this, dur, 1);
                    return this;
                }
                moment.fn.tsSubtract = function (input, val) {
                    var dur;
                    // switch args to support subtract('s', 1) and subtract(1, 's')
                    if (typeof input === 'string') {
                        dur = moment.duration(+val, input);
                    } else {
                        dur = moment.duration(input, val);
                    }
                    this.tsAddOrSubtractDurationFromMoment(this, dur, -1);
                    return this;
                }
                moment.fn.tsAddOrSubtractDurationFromMoment = function (mom, duration, isAdding) {
                    var ms = duration._milliseconds,
                        d = duration._days,
                        M = duration._months,
                        currentDate;

                    if (ms) {
                        mom.milliseconds(mom.milliseconds() + ms * isAdding);
                        //mom._d.setTime(+mom + ms * isAdding);
                    }
                    if (d) {
                        mom.date(mom.date() + d * isAdding);
                    }
                    if (M) {
                        currentDate = mom.date();
                        mom.date(1)
                            .month(mom.month() + M * isAdding)
                            .date(Math.min(currentDate, mom.daysInMonth()));
                    }
                };
            };
            function openViewWorkshopMovementModal(workshopMovementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/workshopMovements/viewModal.cshtml',
                    controller: 'tenant.views.crs.workshopMovements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        workshopMovementId: function () {
                            return workshopMovementId;
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getWorkshopMovements();
                });
            }
            function openViewtaffMovementModal(staffMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/staffMovements/viewModal.cshtml',
                    controller: 'tenant.views.crs.staffMovements.closeStaffMovement as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        staffMovementId: function () {
                            return staffMovementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStaffMovements();
                });
            }
            vm.openViewAgreementModal = function (e, agreementId, status, category) {

                if (status === 100) {
                    openViewWorkshopMovementModal(agreementId);
                }
                else if (status === 101) {
                    openViewtaffMovementModal(agreementId);
                }
                else if (status > 0 && status < 100) {
                    if (category === 1) {
                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/agreements/viewModal.cshtml',
                            controller: 'tenant.views.crs.agreements.viewModal as vm',
                            backdrop: 'static',
                            //windowClass: 'app-modal-window',
                            size: 'lg',
                            resolve: {
                                agreementId: function () {
                                    return agreementId;
                                }
                            }
                        });
                    }
                    else {
                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/lease/agreements/viewModal.cshtml',
                            controller: 'tenant.views.crs.lease.agreements.viewModal as vm',
                            backdrop: 'static',
                            size: 'lg',
                            resolve: {
                                agreementId: function () {
                                    return agreementId;
                                }
                            }
                        });
                    }
                }

            }
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime);
                } else {
                    return "";
                }
            };
            vm.GetEndOfPeriod = function () {
                return moment(vm.dateRangeModel.endDate);
            };
            vm.SelectPeriod = function () {

                vm.saving = true;
                vm.SelectedPeriod = '1 week';
                vm.HeaderFormat = 'Do MMM YYYY';
                var today = moment().startOf('day');
                vm.Start = vm.dateRangeModel.startDate;
                vm.update();
                $('#bookingSection').mCustomScrollbar("destroy");
                vm.saving = false;
            };
            vm.GotoTimeShift_Clicked = function () {
                $(document.createElement('input'))
                    .attr('type', 'text')
                    .css({
                        position: 'absolute',
                        left: 0,
                        bottom: 0
                    })
                    .appendTo($('#goto'))
                    .datepicker({
                        onClose: function () {
                            $(this).remove();
                        },
                        onSelect: function (date) {
                            vm.Start = moment(date);
                            vm.initalize();

                        },
                        defaultDate: vm.Start.toDate()
                    })
                    .datepicker('show')
                    .hide();
            };
            vm.GetSelectedPeriod = function () {
                var period;
                for (var i = 0; i < vm.Periods.length; i++) {
                    if (vm.Periods[i].Name === vm.SelectedPeriod) {
                        period = vm.Periods[i];
                        break;
                    }
                }
                if (!period) {
                    period = vm.Periods[0];
                    vm.SelectPeriod(period.Name);
                }
                return period;
            }
            vm.update = function () {
                vm.MinRowHeight = 40;

                vm.loading = true;
                vm.Users = [];
                vm.sectionRows = [];
                var arr = [];
                vm.filters.StartDate = moment(vm.dateRangeModel.startDate).set({ "hour": 09, "minute": 00 });
                vm.filters.EndDate = moment(vm.dateRangeModel.endDate).set({ "hour": 19, "minute": 00 });
                resourcePlannerService.getUsersWithTasks(vm.filters).success(function (data) {
                    var arr = [];
                    //data.forEach(function (item, index) {
                    //    arr.push({ organizationUnitId: item.organizationUnitId, organizationUnitName: item.displayName, UserType: "OrganizationUnit" });
                    //    item.usersList.forEach(function (subItem, subIndex) {
                    //        //arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: subItem.usersTask, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                    //         var userTasks = subItem.usersTask;
                    //        if (userTasks.length > 1) {
                    //            var Duplicate = [];
                    //            var NotDuplicate = [];


                    //            Duplicate = userTasks.reduce((unique, o) => {
                    //                if (!unique.some(obj => obj.startDate === o.startDate)) {
                    //                    unique.push(o);
                    //                }
                    //                return unique;
                    //            }, []);

                    //            NotDuplicate = userTasks.reduce((distinct, o) => {
                    //                if (!distinct.some(obj => obj.startDate != o.startDate)) {
                    //                    distinct.push(o);
                    //                }
                    //                return distinct;
                    //            }, []);

                    //            if (Duplicate.length != 0) {

                    //                NotDuplicate.push(Duplicate[0]);
                    //                NotDuplicate = userTasks.reduce((distinct, o) => {
                    //                    if (!distinct.some(obj => obj.id != o.id)) {
                    //                        distinct.push(o);
                    //                    }
                    //                    return distinct;
                    //                }, []);
                    //                arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: NotDuplicate, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                    //                NotDuplicate = [];
                    //                Duplicate.shift();
                    //                for (var i = 0; i < Duplicate.length; i++) {
                    //                    var ok = [];
                    //                    ok.push(Duplicate[i]);
                    //                    arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: ok, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                    //                    ok = [];
                    //                }
                    //                Duplicate = [];
                    //            }
                    //            else
                    //            {
                    //                arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: subItem.usersTask, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                    //            }
                                

                             
                    //        }
                    //        else
                    //        {
                    //            arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: subItem.usersTask, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                    //        }
                    //    });
                    //});
                    data.forEach(function (item, index) {
                        arr.push({ organizationUnitId: item.organizationUnitId, organizationUnitName: item.displayName, UserType: "OrganizationUnit", unplannedTasksCounter: item.unplannedTasksCounter });
                        //item.usersList.forEach(function (subItem, subIndex) {
                        //    var userTasks = subItem.usersTask;
                        //    if (userTasks.length > 1) {
                        //        var i = 0;
                        //        while (i < userTasks.length) {
                        //            var Unique = [];
                        //            var Duplicate = [];
                        //            Unique = userTasks.reduce((unique, o) => {
                        //                if (unique.some(obj => moment(obj.startDate).utc().format('YYYY-MM-DD HH:mm') <= moment(o.endDate).utc().format('YYYY-MM-DD HH:mm') && moment(obj.endDate).utc().format('YYYY-MM-DD HH:mm') >= moment(o.startDate).utc().format('YYYY-MM-DD HH:mm'))) {
                        //                    Duplicate.push(o);
                        //                }
                        //                else {
                        //                    unique.push(o);
                        //                }
                        //                return unique;
                        //            }, []);

                        //            if (Unique.length != 0) {
                        //                for (var i = userTasks.length - 1; i >= 0; i--) {
                        //                    for (var j = 0; j < Unique.length; j++) {
                        //                        if (userTasks[i] && (userTasks[i].id === Unique[j].id)) {
                        //                            userTasks.splice(i, 1);
                        //                        }
                        //                    }
                        //                }
                        //                var DuplicateUsers = [];

                        //                if (arr.length > 1) {
                        //                    var ok2 = arr.reduce((unique, o) => {
                        //                        if (o.UserType != "OrganizationUnit") {
                        //                            unique.push(o);
                        //                            if (unique.some(obj => obj.userName === o.userName)) {
                        //                                DuplicateUsers.push(o);
                        //                            }
                        //                        }
                        //                        return unique;

                        //                    }, []);
                        //                }

                        //                if (DuplicateUsers.length > 0) {
                        //                    arr.push({ userId: subItem.userId, userName: ' " ', userTasks: Unique, UserType: "User", Status: "Duplicate" });

                        //                }
                        //                else {
                        //                    arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: Unique, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                        //                }

                        //                Unique = [];
                        //                Duplicate = [];
                        //            }
                        //            i = 0;
                        //        }
                        //    }
                        //    //if (userTasks.length > 1) {
                        //    //    var i = 0;
                        //    //    while (i < userTasks.length) {
                        //    //        var Unique = [];
                        //    //        Unique = userTasks.reduce((unique, o) => {
                        //    //            if (!unique.some(obj => moment(obj.startDate).format('MM/DD/YYYY') === moment(o.startDate).format('MM/DD/YYYY') || moment(obj.EndDate).format('MM/DD/YYYY') >= moment(o.startDate).format('MM/DD/YYYY') || moment(obj.EndDate).format('MM/DD/YYYY') <= moment(o.startDate).format('MM/DD/YYYY'))) {
                        //    //                unique.push(o);
                        //    //            }
                        //    //            return unique;
                        //    //        }, []);
                        //    //        if (Unique.length != 0) {
                        //    //            for (var i = userTasks.length - 1; i >= 0; i--) {
                        //    //                for (var j = 0; j < Unique.length; j++) {
                        //    //                    if (userTasks[i] && (userTasks[i].id === Unique[j].id)) {
                        //    //                        userTasks.splice(i, 1);
                        //    //                    }
                        //    //                }
                        //    //            }
                        //    //            arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: Unique, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                        //    //            Unique = [];
                        //    //        }

                        //    //        i = 0;
                        //    //    }
                        //    //}
                        //    //if (userTasks.length > 1) {
                        //    //    var Unique = [];


                        //    //    Unique = userTasks.reduce((unique, o) => {
                        //    //        if (!unique.some(obj => moment(obj.startDate).format('MM/DD/YYYY') === moment(o.startDate).format('MM/DD/YYYY'))) {
                        //    //            unique.push(o);
                        //    //        }
                        //    //        return unique;
                        //    //    }, []);



                        //    //    if (Unique.length != 0) {
                        //    //        //Unique.reduce((overlapp, o) => {
                        //    //        //    userTasks.shift(o);
                        //    //        //}, []);
                        //    //        for (var i = userTasks.length - 1; i >= 0; i--) {
                        //    //            for (var j = 0; j < Unique.length; j++) {
                        //    //                if (userTasks[i] && (userTasks[i].id === Unique[j].id)) {
                        //    //                    userTasks.splice(i, 1);
                        //    //                }
                        //    //            }
                        //    //        }
                        //    //        arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: Unique, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                        //    //        Unique = [];
                        //    //    }
                        //    //    if (userTasks.length != 0) {
                        //    //        for (var i = 0; i < userTasks.length; i++) {
                        //    //            var ok = [];
                        //    //            ok.push(userTasks[i]);
                        //    //            arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: ok, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                        //    //            ok = [];
                        //    //        }
                        //    //    }



                        //    //}
                        //    else {
                        //        arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: subItem.usersTask, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                        //    }
                        //});
                        item.usersList.forEach(function (subItem, subIndex) {
                            var userTasks = subItem.usersTask;
                            var count = 0;
                            if (userTasks.length > 1) {
                                var i = 0;
                                while (i < userTasks.length) {
                                    var Unique = [];
                                    var Duplicate = [];
                                    Unique = userTasks.reduce((unique, o) => {
                                        if (unique.some(obj => moment(obj.startDate).utc().format('YYYY-MM-DD HH:mm') <= moment(o.endDate).utc().format('YYYY-MM-DD HH:mm') && moment(obj.endDate).utc().format('YYYY-MM-DD HH:mm') >= moment(o.startDate).utc().format('YYYY-MM-DD HH:mm'))) {
                                            Duplicate.push(o);
                                        }
                                        else {
                                            unique.push(o);
                                        }
                                        return unique;
                                    }, []);

                                    if (Unique.length != 0) {
                                        for (var i = userTasks.length - 1; i >= 0; i--) {
                                            for (var j = 0; j < Unique.length; j++) {
                                                if (userTasks[i] && (userTasks[i].id === Unique[j].id)) {
                                                    userTasks.splice(i, 1);
                                                }
                                            }
                                        }



                                        if (count == 0) {
                                            arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: Unique, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                                        }
                                        else {
                                            arr.push({ userId: subItem.userId, userName: ' " ', userTasks: Unique, UserType: "User", Status: "Duplicate" });
                                        }

                                        Unique = [];
                                        Duplicate = [];
                                        count++;
                                    }
                                    i = 0;
                                }
                            }
                            else {
                                arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: subItem.usersTask, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                            }
                        });
                    });
                    vm.Users = arr;
                    vm.Users.push({ userId: 0, userName: "", userTasks: [], UserType: "dummyUser" });
                    vm.initalize();
                    setScrollBar();
                }).finally(function () {
                    vm.loading = false;
                    vm.dateRangeModel = {
                        startDate: startDateModel,
                        endDate: endDateModel
                    };
                });


            };
            function setScrollBar() {
                var target1 = $("#timeBar");
                var target2 = $("#carDiv");
                var target3 = $("#bookingSection");
                var target4 = $("#outerDiv");
                target3.mCustomScrollbar({
                    snapAmount: 40,
                    scrollButtons: {
                        enable: true,
                        scrollType: "stepped"
                    },
                    keyboard: { scrollAmount: 10 },
                    mouseWheel: { deltaFactor: 10 },
                    scrollInertia: 10,
                    theme: "inset-dark",
                    axis: "yx",

                    callbacks: {
                        whileScrolling: function () {

                            target1.prop("scrollLeft", Math.abs(this.mcs.left));
                            target2.prop("scrollTop", Math.abs(this.mcs.top));
                            target3.attr("data-scroll", Math.abs(this.mcs.top));

                        }
                    }
                });
            }
            vm.init = function () {
                vm.MinRowHeight = 40;
                vm.Users = [];
                vm.loading = true;
                vm.SelectedPeriod = '1 week';
                vm.HeaderFormat = 'Do MMM YYYY';
                var today = moment().startOf('day');
                vm.filters.StartDate = moment(vm.dateRangeModel.startDate).set({ "hour": 09, "minute": 00 });
                vm.filters.EndDate = moment(vm.dateRangeModel.endDate).set({ "hour": 19, "minute": 00 });
                resourcePlannerService.getUsersWithTasks(vm.filters).success(function (data) {
                    var arr = [];
                    data.forEach(function (item, index) {
                        arr.push({ organizationUnitId: item.organizationUnitId, organizationUnitName: item.displayName, UserType: "OrganizationUnit", unplannedTasksCounter: item.unplannedTasksCounter });
                        item.usersList.forEach(function (subItem, subIndex) {
                            var userTasks = subItem.usersTask;
                            var count = 0;
                            if (userTasks.length > 1) {
                                var i = 0;
                                while (i < userTasks.length) {
                                    var Unique = [];
                                    var Duplicate = [];
                                    Unique = userTasks.reduce((unique, o) => {
                                        if (unique.some(obj => moment(obj.startDate).utc().format('YYYY-MM-DD HH:mm') <= moment(o.endDate).utc().format('YYYY-MM-DD HH:mm') && moment(obj.endDate).utc().format('YYYY-MM-DD HH:mm') >= moment(o.startDate).utc().format('YYYY-MM-DD HH:mm')))
                                        {
                                            Duplicate.push(o);
                                        }
                                        else
                                        {
                                            unique.push(o);
                                        }
                                        return unique;
                                    }, []);

                                    if (Unique.length != 0) {
                                        for (var i = userTasks.length - 1; i >= 0; i--) {
                                            for (var j = 0; j < Unique.length; j++) {
                                                if (userTasks[i] && (userTasks[i].id === Unique[j].id)) {
                                                    userTasks.splice(i, 1);
                                                }
                                            }
                                        }

                                        

                                        if (count == 0)
                                        {
                                            arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: Unique, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                                        }
                                        else
                                        {
                                            arr.push({ userId: subItem.userId, userName: ' " ', userTasks: Unique, UserType: "User", Status: "Duplicate" });
                                        }

                                        Unique = [];
                                        Duplicate = [];
                                        count++;
                                    } 
                                    i=0;
                                }
                            }
                            else
                            {
                                arr.push({ userId: subItem.userId, userName: subItem.userName, userTasks: subItem.usersTask, UserType: "User", unplannedTasksCounter: subItem.usersUnplannedTask });
                            }
                        });
                    });
                    vm.Users = arr;
                    vm.Users.push({ userId: 0, userName: "", userTasks: [], UserType: "dummyUser" });
                    vm.initalize();
                }).finally(function () {
                });



                vm.SelectedPeriod = '1 week';
                vm.HeaderFormat = 'Do MMM YYYY';
                var today = moment().startOf('day');
                vm.Start = vm.dateRangeModel.startDate;
            };
            vm.createOrUpdateResourceTimeline = function () {
                vm.tableHeaderRows = [];
                vm.colspan = 0;
                vm.end = vm.GetEndOfPeriod();
                vm.minuteDiff = Math.abs(vm.Start.diff(vm.end, 'minutes'));
                vm.splits = Math.round((vm.minuteDiff / vm.zoomLevel.timeframePeriod), 2);
                for (var headerCount = 0; headerCount < vm.zoomLevel.timeFrameHeaders.length; headerCount++) {
                    list = [];
                    prevDate = null;
                    fPrevDate = null;
                    isEven = true;
                    colspan = 0;
                    currentTimeIndex = 0;
                    header = vm.zoomLevel.timeFrameHeaders[headerCount];
                    var firstNode = { colspan: 0, classes: "time-sch-section time-sch-section-header", row: headerCount };
                    for (var i = 0; i < vm.splits; i++) {

                        thisTime = moment(vm.Start).tsAdd('minutes', (i * vm.zoomLevel.timeframePeriod));
                        fThisTime = thisTime.format(header);
                        hourp = parseInt(thisTime.format('HH'));
                        if (hourp < 9 || hourp > 18) {
                            continue;
                        }
                        //if (header ==="HH") {
                        //    if (fThisTime == "00") {
                        //        fThisTime = "09";
                        //    }
                        //    else if (fThisTime == "03") {
                        //        fThisTime = "10";
                        //    }
                        //    else if (fThisTime == "06") {
                        //        fThisTime = "11";
                        //    }
                        //    else if (fThisTime == "09") {
                        //        fThisTime = "12";
                        //    }
                        //    else if (fThisTime == "12") {
                        //        fThisTime = "02";
                        //    }
                        //    else if (fThisTime == "15") {
                        //        fThisTime = "03";
                        //    }
                        //    else if (fThisTime == "18") {
                        //        fThisTime = "04";
                        //    }
                        //    else if (fThisTime == "21") {
                        //        fThisTime = "05";
                        //    }
                        //}
                        if (fPrevDate !== fThisTime) {
                            if (prevDate) {

                                firstNode.colspan = colspan;
                                colspan = 0;
                                if (moment() >= prevDate && moment() < thisTime) {
                                    firstNode.classes += (' time-sch-header-' + headerCount + '-current-time');
                                }
                            }
                            prevDate = thisTime;
                            fPrevDate = fThisTime;
                            var node = {
                                row: headerCount,
                                headerRow: headerCount,
                                columnCount: i,
                                columnIsEven: isEven,
                                classes: "time-sch-date time-sch-date-header" +
                                    ' time-sch-header-' + headerCount + '-date-start' +
                                    ' time-sch-header-' + headerCount + '-date-end' +
                                    ' time-sch-header-' + headerCount + '-date-column-' + currentTimeIndex +
                                    ' time-sch-header-' + headerCount + '-date-' + ((currentTimeIndex % 2 === 0) ? 'even' : 'odd'),
                                data: fThisTime
                            };

                            node.colspan = colspan;
                            node.width = vm.widthSecond;
                            list.push(node);
                            // for (var prevHeader = 0; prevHeader < headerCount; prevHeader++) {
                            //     TimeScheduler.AddHeaderClasses(td, i, prevHeader);
                            // }
                            currentTimeIndex += 1;
                        } else {
                            if (list.length > 0) {
                                list[list.length - 1].colspan = colspan + 1;
                                list[list.length - 1].width = list[list.length - 1].width + vm.widthSecond;
                            }
                        }
                        colspan += 1;
                    }


                    vm.tableHeaderRows.push(list);
                }
                vm.tableHeaderRows[1][0].colspan = vm.tableHeaderRows[0][0].colspan;
                vm.title = vm.Start.format(vm.HeaderFormat) + ' - ' + vm.end.tsAdd('minutes', -1).format(vm.HeaderFormat);

            };
            vm.initalize = function () {
                vm.loading = true;
                vm.sectionRows = [];
                vm.tableHeaderRows = [];
                vm.createOrUpdateResourceTimeline();
                vm.CreateSections(vm.Users);
                vm.FillSchedule(vm.Users);
                vm.loading = false;
            };
            vm.dateRangeChange = function () {
                //alert("value changed");
                if (vm.dateRangeModel.startDate != undefined) {
                    startDateModel = vm.dateRangeModel.startDate;
                    endDateModel = vm.dateRangeModel.endDate;




                    var diff = endDateModel.diff(startDateModel, 'days') + 1;
                    if (diff < vm.zoomLevel.minInterval) {
                        var days = vm.zoomLevel.minInterval - diff;
                        alert(days);
                        endDateModel = moment(startDateModel.format('YYYY-MM-DD')).add(days, 'days').endOf("day");

                        vm.dateRangeModel.endDate = endDateModel;
                    }

                }
            };
            vm.reduceDay = function () {


                startDateModel = moment(vm.dateRangeModel.startDate.subtract(1, "days").format('YYYY-MM-DD')).startOf("day");
                endDateModel = moment(vm.dateRangeModel.endDate.subtract(1, "days").format('YYYY-MM-DD')).endOf("day");
                vm.dateRangeModel = {
                    startDate: startDateModel,
                    endDate: endDateModel
                };
                vm.saving = true;

                vm.SelectedPeriod = '1 week';
                vm.HeaderFormat = 'Do MMM YYYY';
                var today = moment().startOf('day');

                vm.Start = startDateModel;

                vm.update();
                $('#bookingSection').mCustomScrollbar("destroy");
                vm.saving = false;
                document.getElementById("datePicker").focus();
                ////document.getElementById("reduce").focus();
                $(".opensright").css("display", "none");
            };
            vm.addDay = function () {

                startDateModel = moment(vm.dateRangeModel.startDate.add(1, "days").format('YYYY-MM-DD')).startOf("day");
                endDateModel = moment(vm.dateRangeModel.endDate.add(1, "days").format('YYYY-MM-DD')).endOf("day");
                vm.dateRangeModel = {
                    startDate: startDateModel,
                    endDate: endDateModel
                };
                vm.saving = true;

                vm.SelectedPeriod = '1 week';
                vm.HeaderFormat = 'Do MMM YYYY';
                var today = moment().startOf('day');

                vm.Start = startDateModel;

                vm.update();
                $('#bookingSection').mCustomScrollbar("destroy");
                vm.saving = false;
                document.getElementById("datePicker").focus();
                ////document.getElementById("reduce").focus();
                $(".opensright").css("display", "none");
            };
            vm.SetupPrototypes();
            function openCreateOrEditTaskModal(TaskId, selectedDate, user) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/resourcePlanner/TasksList.cshtml',
                    controller: 'host.views.cbs.resourcePlanner.TasksList as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve:
                    {
                        selectedUser: function () {
                            return user;
                        },
                        selectedDate: function () {
                            return selectedDate;
                        }
                    }
                });
                modalInstance.result.then(function () {

                    vm.update();
                });

            }


            vm.UnplannedTasks = function (userId,organizationUnitId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/resourcePlanner/unplannedTasks.cshtml',
                    controller: 'host.views.cbs.resourcePlanner.unplannedTasks as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve:
                    {
                        userId: function () {
                            return userId;
                        },
                        organizationUnitId: function () {
                            return organizationUnitId;
                        }
                    }
                });
                modalInstance.result.then(function () {

                    vm.update();
                });
            };


            vm.addTask = function (e, index) {
                var minutes = e.offsetX * vm.zoomLevel.minutesPerPixel;
                var selectedDate = moment(vm.Start).tsAdd('minutes', minutes);
                var user = vm.Users[index];
                openCreateOrEditTaskModal(null, selectedDate, user);
            };


            vm.editTask = function (e, index) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/viewOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                taskId: index
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.update();
                });
            };

         

            vm.getFormatedDate = function (date) {
                if (date !== null) {
                    return moment(date).format("YYYY-MM-DD HH:mm");
                }
                else {
                    return "";
                }
            };
            getChargesSettings();


            // vm.FillSections();
        }
    ]);
