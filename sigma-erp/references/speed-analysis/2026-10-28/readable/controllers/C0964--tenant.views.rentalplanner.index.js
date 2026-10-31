// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:260623-261690
appModule.controller('tenant.views.rentalplanner.index', [
        '$scope', '$uibModal', 'abp.services.app.rentalPlanner', 'abp.services.app.chargesSetting', 'abp.services.app.make',
        function ($scope, $uibModal, rentalPlannerService, chargesSettingService, vehicleMakeService) {
            var vm = this;
            vm.sectionRows = [];
            vm.Periods = [];
            vm.tableHeaderRows = [];
            vm.rentalPlannerService = rentalPlannerService;
            vm.widthSecond = 20;
            vm.minutesPerPixel = 3;
            vm.chargesSettings = [];
            vm.dateRangeModel = {};
            vm.zoomLevelIndex = 0;
            $scope.zoom = vm.zoomLevel;



            vm.getzoomLevel = function () {
                return vm.zoomLevel;
            };

            function getMakes() {
                vehicleMakeService.getMakes()
                    .success(function (r) {
                        vm.makes = r.items;
                    });
            }

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
            var endDateModel = moment(startDateModel.format('YYYY-MM-DD')).add(2, 'days').endOf("day");
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

            function setScrollBar() {
                var target1 = $("#timeBar");
                var target2 = $("#carDiv");
                var target3 = $("#bookingSection");
                //var target4 = $("#outerDiv");
                target3.mCustomScrollbar({
                    snapAmount: 100,
                    keyboard: { scrollAmount: 20 },
                    //mouseWheel: { deltaFactor: 20 },
                    scrollInertia: 100,
                    scrollButtons: {
                        enable: true,
                        scrollType: "stepped"
                    },
                    theme: "inset-dark",
                    axis: "yx",
                    scrollbarPosition: "outside",


                    callbacks: {
                        whileScrolling: function () {

                            target1.prop("scrollLeft", Math.abs(this.mcs.left));
                            target2.prop("scrollTop", Math.abs(this.mcs.top));
                            target3.attr("data-scroll", Math.abs(this.mcs.top));


                        }
                    }
                });
            }



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
            function openCreateOrEditBookingModal(bookingId, chargesSettings, selectedDate, car) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rentalPlanner/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.rentalPlanner.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        bookingId: function () {
                            return bookingId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        },
                        selectedCar: function () {
                            return car;
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
            vm.addBooking = function (e, index) {

                var minutes = e.offsetX * vm.zoomLevel.minutesPerPixel;
                var selectedDate = moment(vm.Start).tsAdd('minutes', minutes);
                var car = vm.Cars[index];
                openCreateOrEditBookingModal(null, vm.chargesSettings, selectedDate, car);
            };
            vm.editBooking = function (e, index) {


                openCreateOrEditBookingModal(index, vm.chargesSettings, null, null);
            };
            vm.getFormatedDate = function (date) {
                if (date !== null) {
                    return moment(date).format("YYYY-MM-DD HH:mm");
                }
                else {
                    return "";
                }
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
            vm.update = function () {
                vm.MinRowHeight = 40;
                vm.loading = true;
                vm.Cars = [];
                vm.sectionRows = [];
                var arr = [];
                rentalPlannerService.getVehicleWithAgreements().success(function (data) {

                    //vm.Cars = data;
                    var arr = [];
                    data.forEach(function (item, index) {
                        debugger;
                        const filteredData = item.cars.filter(x => (vm.make ? x.vehicleMake == vm.make : true) && (vm.plateNo ? x.vehicleNumber.contains(vm.plateNo) : true));
                        if (filteredData.length > 0) {
                            arr.push({ vehicleId: null, vehicleNumber: '', agreements: item.agreements, vehicleType: '', vehicleMake: '', vehicalModel: '', isGroup: true, title: item.title, vehicle: null, tariffGroup: item.tariffGroup, status: "tariff", subStatus: "" });
                            filteredData.forEach(function (subItem, subIndex) {
                                arr.push({ vehicleId: subItem.vehicleId, vehicleNumber: subItem.vehicleNumber, agreements: subItem.agreements, vehicleType: subItem.vehicleType, vehicleMake: subItem.vehicleMake, vehicalModel: subItem.vehicalModel, isGroup: false, title: '', vehicle: subItem.vehicle, tariffGroup: item.tariffGroup, status: subItem.status, movements: subItem.movements, subStatus: subItem.subStatus });

                            });
                        }
                    });
                    vm.Cars = arr;
                    vm.Cars.push({ vehicleNumber: '', agreements: [], vehicleType: '', vehicleMake: '', vehicalModel: '', status: "dummy", subStatus: "dummy" });
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
            vm.FillSchedule = function (cars) {
                vm.Bookings = [];
                var items = vm.Items;
                var item, event, section, itemElem, eventElem, itemContent, itemName, itemIcon;
                var minuteDiff, splits, itemDiff, itemSelfDiff, eventDiff, calcTop, calcLeft, calcWidth, foundStart, foundEnd;
                var inSection = {},
                    foundPos, elem, prevElem, needsNewRow;
                var end, i;


                end = vm.GetEndOfPeriod();

                minuteDiff = Math.abs(vm.Start.diff(end, 'minutes'));

                for (var index = 0; index < cars.length; index++) {

                    SelectedCar = cars[index];

                    for (var bookingIndex = 0; bookingIndex < SelectedCar.agreements.length; bookingIndex++) {

                        SelectedBooking = SelectedCar.agreements[bookingIndex];
                        SelectedBooking.startDate = vm.getlocalDate(SelectedBooking.startDate);
                        if (SelectedBooking.endDate == null) {
                            continue;
                        }
                        else {
                            SelectedBooking.endDate = vm.getlocalDate(SelectedBooking.endDate);
                        }


                        if (SelectedBooking.startDate <= end && SelectedBooking.endDate >= vm.Start) {
                            foundPos = null;






                            foundStart = moment(Math.max(SelectedBooking.startDate, vm.Start));
                            foundEnd = moment(Math.min(SelectedBooking.endDate, end));
                            itemDiff = foundStart.diff(vm.Start, 'minutes');
                            itemSelfDiff = Math.abs(foundStart.diff(foundEnd, 'minutes'));

                            calcTop = 0;
                            calcLeft = (itemDiff / vm.zoomLevel.timeframePeriod) * vm.widthSecond;
                            calcWidth = Math.round(((itemSelfDiff / vm.zoomLevel.timeframePeriod) * vm.widthSecond) + 2);



                            var data = {
                                id: SelectedBooking.agreementId,
                                name: SelectedBooking.agreementNumber,
                                start: SelectedBooking.startDate,
                                end: SelectedBooking.endDate,
                                sectionID: index,
                                classes: 'item-status-none',
                                status: SelectedBooking.status,

                                zoom: vm.zoomLevel,
                                dateRange: { start: startDateModel, end: endDateModel, test: 5 }
                            };

                            var color = "#36c6d3";

                            var bookingNode = {
                                id: SelectedBooking.agreementId,
                                allData: data,
                                sectionId: index,
                                classes: "time-sch-item ",
                                css: {
                                    top: calcTop,
                                    left: calcLeft + 'px',
                                    width: calcWidth + 'px',

                                },
                                childClass: "time-sch-item-content",
                                secondChildData: SelectedBooking.agreementNumber,
                                thirdChildData: SelectedBooking.agreementNumber,
                                Start: false,
                                End: false,
                                dummy: false,
                                status: SelectedBooking.status,
                                color: color,
                                category: SelectedBooking.category
                            };
                            if (SelectedBooking.startDate >= vm.Start) {
                                bookingNode.Start = true;
                            }
                            if (SelectedBooking.endDate <= end) {
                                bookingNode.End = true;
                            }
                            vm.Bookings.push(bookingNode);
                        }



                    }
                    if (SelectedCar.movements == undefined) {
                        continue;
                    }
                    for (var bookingIndex = 0; bookingIndex < SelectedCar.movements.length; bookingIndex++) {



                        SelectedBooking = SelectedCar.movements[bookingIndex];

                        if (SelectedBooking.startDate == null) {
                            continue;
                        }
                        SelectedBooking.startDate = vm.getlocalDate(SelectedBooking.startDate);
                        if (SelectedBooking.startDate == undefined) {
                            continue;
                        }

                        SelectedBooking.endDate = moment(SelectedBooking.startDate).add(1, 'd');


                        if (SelectedBooking.startDate <= end && SelectedBooking.endDate >= vm.Start) {
                            foundPos = null;

                            SelectedBooking.name = SelectedBooking.name.replace("_", " ");



                            foundStart = moment(Math.max(SelectedBooking.startDate, vm.Start));
                            foundEnd = moment(Math.min(SelectedBooking.endDate, end));
                            itemDiff = foundStart.diff(vm.Start, 'minutes');
                            itemSelfDiff = Math.abs(foundStart.diff(foundEnd, 'minutes'));

                            calcTop = 0;
                            calcLeft = (itemDiff / vm.zoomLevel.timeframePeriod) * vm.widthSecond;
                            calcWidth = (itemSelfDiff / vm.zoomLevel.timeframePeriod) * vm.widthSecond;

                            var type = 0;
                            if (SelectedBooking.type == 1 || SelectedBooking.type == 2 || SelectedBooking.type == 3 || SelectedBooking.type == 10) {
                                type = 100;
                            }
                            else {
                                type = 101;
                            }

                            var data = {
                                id: SelectedBooking.id,
                                name: SelectedBooking.name,
                                start: SelectedBooking.startDate,
                                end: SelectedBooking.endDate,
                                sectionID: index,
                                classes: 'item-status-none',
                                status: type,
                                zoom: vm.zoomLevel,
                                dateRange: { start: startDateModel, end: endDateModel, test: 5 }
                            };

                            var color = "blue";
                            if (type === 100) {
                                color = '#ed6b75';
                            }
                            else {
                                color = '#F1C40F';
                            }
                            var bookingNode = {
                                id: SelectedBooking.id,
                                allData: data,
                                sectionId: index,
                                classes: "time-sch-item ",
                                css: {
                                    top: calcTop,
                                    left: calcLeft + 'px',
                                    width: calcWidth + 'px',

                                },
                                childClass: "time-sch-item-content",
                                secondChildData: SelectedBooking.name,
                                thirdChildData: SelectedBooking.name,
                                Start: false,
                                End: false,
                                dummy: false,
                                status: type,
                                color: color
                            };
                            if (SelectedBooking.startDate >= vm.Start) {
                                bookingNode.Start = true;
                            }
                            if (SelectedBooking.endDate <= end) {
                                bookingNode.End = true;
                            }
                            vm.Bookings.push(bookingNode);
                        }



                    }




                }
                end = vm.GetEndOfPeriod();
                var dataDummy = {
                    id: -1,
                    name: "",
                    start: vm.Start,
                    end: end,
                    sectionID: vm.Cars.length - 1,
                    classes: 'item-status-none',
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
                    sectionId: vm.Cars.length - 1,
                    classes: "time-sch-item ",
                    css: {
                        top: calcTop,
                        left: calcLeft + 'px',
                        width: calcWidth + 'px',

                    },
                    childClass: "time-sch-item-content",
                    secondChildData: "",
                    thirdChildData: "",
                    Start: false,
                    End: false,
                    dummy: true,
                    status: 0
                };

                vm.Bookings.push(bookingNodeDummy);
                //Items are the bookings
                //for (i = 0; i < items.length; i++) {
                //    item = items[i]; //Item is the booking.
                //    section = vm.Cars[item.sectionID]; // Here section is the car assosiated with the booking

                //    if (section) {
                //        if (!inSection[item.sectionID]) {
                //            inSection[item.sectionID] = [];
                //        }

                //        if (item.start <= end && item.end >= vm.Start) {
                //            foundPos = null;


                //            foundStart = moment(Math.max(item.start, vm.Start));
                //            foundEnd = moment(Math.min(item.end, end));

                //            itemDiff = foundStart.diff(vm.Start, 'minutes');
                //            itemSelfDiff = Math.abs(foundStart.diff(foundEnd, 'minutes'));

                //            calcTop = 0;
                //            calcLeft = (itemDiff / 60) * 50;
                //            calcWidth = (itemSelfDiff / 60) * 50;

                //            var bookingNode = {
                //                id: item.id,
                //                sectionId: item.sectionID,
                //                classes: "time-sch-item " + (item.classes ? item.classes : ''),
                //                css: {
                //                    top: calcTop,
                //                    left: calcLeft + 'px',
                //                    width: calcWidth + 'px',

                //                },
                //                childClass: "time-sch-item-content",
                //                secondChildData: item.name,
                //                thirdChildData: item.name,
                //                Start: false,
                //                End: false
                //            };
                //            if (item.start >= vm.Start) {
                //                bookingNode.Start = true;
                //            }
                //            if (item.end <= end) {
                //                bookingNode.End = true;
                //            }
                //            vm.Bookings.push(bookingNode);


                //        }
                //    }
                //}
                // // Sort out layout issues so no elements overlap
                // for (var prop in inSection) {
                //     section = TimeScheduler.Sections[prop];

                //     for (i = 0; i < inSection[prop].length; i++) {
                //         var elemTop, elemBottom;
                //         elem = inSection[prop][i];

                //         // If we're passed the first item in the row
                //         for (var prev = 0; prev < i; prev++) {
                //             var prevElemTop, prevElemBottom;
                //             prevElem = inSection[prop][prev];

                //             prevElemTop = prevElem.Element.position().top;
                //             prevElemBottom = prevElemTop + prevElem.Element.outerHeight();

                //             elemTop = elem.Element.position().top;
                //             elemBottom = elemTop + elem.Element.outerHeight();

                //             // (elem.start must be between prevElem.start and prevElem.end OR
                //             //  elem.end must be between prevElem.start and prevElem.end) AND
                //             // (elem.top must be between prevElem.top and prevElem.bottom OR
                //             //  elem.bottom must be between prevElem.top and prevElem.bottom)
                //             needsNewRow =
                //                 (
                //                     (prevElem.start <= elem.start && elem.start <= prevElem.end) ||
                //                     (prevElem.start <= elem.end && elem.end <= prevElem.end)
                //                 ) && (
                //                     (prevElemTop <= elemTop && elemTop <= prevElemBottom) ||
                //                     (prevElemTop <= elemBottom && elemBottom <= prevElemBottom)
                //                 );

                //             if (needsNewRow) {
                //                 elem.Element.css('top', prevElemBottom + 1);
                //             }
                //         }

                //         elemBottom = elem.Element.position().top + elem.Element.outerHeight() + 1;

                //         if (elemBottom > section.container.height()) {
                //             section.container.css('height', elemBottom);
                //             section.row.css('height', elemBottom);
                //         }
                //     }
                // }
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

                for (i = 0; i < sections.length; i++) {
                    var evenClass = (i % 2 === 0 ? 'time-sch-section-even' : 'time-sch-section-odd');
                    var sectionclass = "time-sch-section-container";
                    //if (sections[i].status === "WRK" || sections[i].status === "NRM") {
                    //    sectionclass = "time-sch-section-container-no-drop";
                    //}
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
                    vm.minuteDiff = Math.abs(vm.Start.diff(vm.end, 'minutes'));

                    vm.splits = (vm.minuteDiff / vm.zoomLevel.timeframePeriod);
                    node.width = vm.splits * vm.widthSecond;




                    vm.sectionRows.push(node);
                }
                return;

            };
            vm.FillSections = function () {
                vm.CreateSections(vm.Cars);
                vm.FillSchedule();
            };
            vm.createOrUpdateResourceTimeline = function () {

                vm.tableHeaderRows = [];
                vm.colspan = 0;

                vm.end = vm.GetEndOfPeriod();
                vm.minuteDiff = Math.abs(vm.Start.diff(vm.end, 'minutes'));

                vm.splits = (vm.minuteDiff / vm.zoomLevel.timeframePeriod);
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
                vm.CreateSections(vm.Cars);
                vm.FillSchedule(vm.Cars);
                vm.loading = false;
            };
            vm.init = function () {
                vm.MinRowHeight = 40;
                vm.Cars = [];
                vm.loading = true;
                vm.SelectedPeriod = '1 week';
                vm.HeaderFormat = 'Do MMM YYYY';
                var today = moment().startOf('day');
                vm.Start = vm.dateRangeModel.startDate;

                rentalPlannerService.getVehicleWithAgreements().success(function (data) {

                    //vm.Cars = data;
                    var arr = [];
                    data.forEach(function (item, index) {
                        arr.push({ vehicleId: null, vehicleNumber: '', agreements: item.agreements, vehicleType: '', vehicleMake: '', vehicalModel: '', isGroup: true, title: item.title, vehicle: null, tariffGroup: item.tariffGroup, status: "tariff", subStatus: "" });
                        item.cars.forEach(function (subItem, subIndex) {
                            arr.push({ vehicleId: subItem.vehicleId, vehicleNumber: subItem.vehicleNumber, agreements: subItem.agreements, vehicleType: subItem.vehicleType, vehicleMake: subItem.vehicleMake, vehicalModel: subItem.vehicalModel, isGroup: false, title: '', vehicle: subItem.vehicle, tariffGroup: item.tariffGroup, status: subItem.status, movements: subItem.movements, subStatus: subItem.subStatus });

                        });
                    });
                    vm.Cars = arr;
                    vm.Cars.push({ vehicleNumber: '', agreements: [], vehicleType: '', vehicleMake: '', vehicalModel: '', status: "dummy", subStatus: "" });
                    vm.initalize();
                }).finally(function () {
                });



                vm.SelectedPeriod = '1 week';
                vm.HeaderFormat = 'Do MMM YYYY';
                var today = moment().startOf('day');
                vm.Start = vm.dateRangeModel.startDate;
            };
            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                    vm.dateRangeModel = {
                        startDate: moment(moment().format('YYYY-MM-DD')).startOf("day"),
                        endDate: moment(moment().format('YYYY-MM-DD')).add(2, 'days').add(-1, 'milliseconds').endOf("day"),
                    };
                    vm.init();
                });
            };
            getChargesSettings();
            getMakes();
        }
    ]);
