// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:450724-451139
appModule.controller('tenant.views.repairedMarks.index', [
        '$scope', 'abp.services.app.vehicle', 'abp.services.app.movement', "$timeout", 'utilities',
        function ($scope, vehicleService, movementService, $timeout, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.isLeftHandDriving = utilities.parseBoolean(abp.setting.get("App.General.IsLeftHandDriving"));
            vm.carInteriorImage = 'car_interior.jpg';
            if (vm.isLeftHandDriving)
                vm.carInteriorImage = 'car_interior_lefthand.jpg';

            vm.dateRangeModel = {
                startDate: '', // todayAsString,
                endDate: ''
            };

            function resetData() {

                //vm.loading = false;
                vm.marks = null;
                vm.currentVehicle = null;

                vm.exteriorMarksImages = [];
                vm.interiorMarksImages = [];
                vm.selectedExteriorMark = null;
                vm.selectedInteriorMark = null;

            }
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.filters = {
                plateNo: null,
                enableDateRange: false
            };

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format("DD-MM-YYYY HH:mm");
                }
                else {
                    return "";
                }
            };

            resetData();
            
            vm.getMarks = function () {
                vm.loading = true;
                resetData();

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                vehicleService.getVehicleRepairedMarks(vm.filters).success(function (data) {
                    vm.currentVehicle = data;
                    vm.marks = data.marks;
                    $timeout(function() {
                        // anything you want can go here and will safely be run on the next digest.
                        drawMarks();
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };


            function drawMarks() {
                //
                var exterior = d3.select("#exteriorInMarksContainer");
                var interior = d3.select("#interiorInMarksContainer");

                for (var i = 0; i < vm.marks.length; i++) {
                    var markDetail = markDetailObject();
                    markDetail.mark = vm.marks[i];
                    markDetail.checkType = "checkin";
                    debugger;
                    drawMark(exterior, interior, markDetail);
                }
            }

            //mark reparired and remove symbol
            vm.rapairMark = function (mark) {
                //
                abp.message.confirm(
                    app.localize('AreYouSureToRepairThisMark'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.processingMark = true;
                            abp.ui.setBusy();
                            movementService.repairMark({
                                markId: mark.mark.id,
                                checkType: mark.checkType,
                            }).success(function () {
                                
                                abp.notify.info(app.localize('SavedSuccessfully'));
                                $('[data-mark-id=' + mark.mark.id + ']').remove();
                                vm.selectedExteriorMark = null;
                                vm.selectedInteriorMark = null;
                            }).finally(function () {
                                vm.processingMark = false;
                                abp.ui.clearBusy();
                            });
                        }
                    }
                );

            };

            function markDetailObject() {
                var detail = new Object();
                detail.x = 0;
                detail.y = 0;
                detail.mark = null;
                detail.markType = "";
                detail.checkType = "";
                detail.surfaceType = "";
                detail.container = null;

                return detail;
            }

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";

                return detail;

            }

            function markSelected(markDetail) {
                //
                debugger;
                if (markDetail == null)
                    return;

                if (markDetail.surfaceType == "exterior") {
                    vm.exteriorMarksImages.length = 0;
                    vm.selectedExteriorMark = markDetail;
                    vm.selectedInteriorMark = null;
                }
                else if (markDetail.surfaceType == "interior") {
                    vm.interiorMarksImages.length = 0;
                    vm.selectedInteriorMark = markDetail;
                    vm.selectedExteriorMark = null;
                }
                else
                    return;

                if (markDetail.mark.images == null)
                    return;

                $scope.$apply(function () {
                    //debugger
                    for (var i = 0; i < markDetail.mark.images.length; i++) {

                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = markDetail.mark.images[i].imageURL;
                        imageDetail.img = markDetail.mark.images[i].imageURL;
                        imageDetail.description = markDetail.markType + " " + markDetail.mark.description;

                        if (markDetail.surfaceType == "exterior")
                            vm.exteriorMarksImages.push(imageDetail);
                        else
                            vm.interiorMarksImages.push(imageDetail);
                    }
                });
            }

            function getMarkType(markTypeId) {
                switch (markTypeId) {
                    case 1:     //small dent (exterior)
                        return app.localize('SmallDent');

                    case 2:     //big dent (exterior)
                        return app.localize('BigDent');

                    case 3:     //small scratch (exterior)
                        return app.localize('SmallScratch');

                    case 4:     //big scratch (exterior)
                        return app.localize('BigScratch');

                    case 5:     //damage (interior)
                        return app.localize('InteriorDamage');

                    case 6:     //crack (exterior)
                        return app.localize('Crack');

                    case 7:     //crack (interior)
                        return app.localize('Crack');

                    case 8:     //stain (interior)
                        return app.localize('Stain');
                }
            }

            function drawMark(exterior, interior, markDetail) {
                markDetail.markType = getMarkType(markDetail.mark.markTypeId);
                //
                switch (markDetail.mark.markTypeId) {
                    case 1:     //small dent (exterior)
                        markDetail.surfaceType = "exterior";
                        markDetail.container = exterior;
                        drawSmallDent(markDetail);
                        break;
                    case 2:     //big dent (exterior)
                        markDetail.surfaceType = "exterior";
                        markDetail.container = exterior;
                        drawBigDent(markDetail);
                        break;
                    case 3:     //small scratch (exterior)
                        markDetail.surfaceType = "exterior";
                        markDetail.container = exterior;
                        drawSmallScratch(markDetail);
                        break;
                    case 4:     //big scratch (exterior)
                        markDetail.surfaceType = "exterior";
                        markDetail.container = exterior;
                        drawBigScratch(markDetail);
                        break;
                    case 5:     //damage (interior)
                        markDetail.surfaceType = "interior";
                        markDetail.container = interior;
                        drawDamage(markDetail);
                        break;
                    case 6:     //crack (exterior)
                        markDetail.surfaceType = "exterior";
                        markDetail.container = exterior;
                        drawCrack(markDetail);
                        break;
                    case 7:     //crack (interior)
                        markDetail.surfaceType = "interior";
                        markDetail.container = interior;
                        drawCrack(markDetail);
                        break;
                    case 8:     //stain (interior)
                        markDetail.surfaceType = "interior";
                        markDetail.container = interior;
                        drawStain(markDetail);
                        break;
                    
                }
            }


            function drawSmallDent(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);
                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("circle")
                .attr("data-mark-id", markDetail.mark.id).attr("data-check-type", markDetail.checkType)
                .attr("cx", vector.X)
                .attr("cy", vector.Y)
                .attr("r", 6)
                .style("stroke", "red")
                .style("stroke-width", "3")
                .style("fill", "white")
                .on('click', function (d, i) {
                    markSelected(markDetail);
                });
            }

            function drawBigDent(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);
                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("circle")
                .attr("data-mark-id", markDetail.mark.id).attr("data-check-type", markDetail.checkType)
                .attr("cx", vector.X)
                .attr("cy", vector.Y)
                .attr("r", 12)
                .style("stroke", "white")
                .style("stroke-width", "1")
                .style("fill", "red")
                .on('click', function (d, i) {
                    markSelected(markDetail);
                });
            }

            function drawSmallScratch(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);
                markDetail.x = vector.To.X;
                markDetail.y = vector.To.Y;

                markDetail.container.append("line")
               .attr("data-mark-id", markDetail.mark.id).attr("data-check-type", markDetail.checkType)
               .attr("x1", vector.From.X)
               .attr("y1", vector.From.Y)
               .attr("x2", vector.To.X)
               .attr("y2", vector.To.Y)
               .style("stroke", "red")
               .style("stroke-width", "4")
               .on('click', function (d, i) {
                   markSelected(markDetail);
               });
            }

            function drawBigScratch(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);
                markDetail.x = vector.To.X;
                markDetail.y = vector.To.Y;

                markDetail.container.append("line")
               .attr("data-mark-id", markDetail.mark.id).attr("data-check-type", markDetail.checkType)
               .attr("x1", vector.From.X)
               .attr("y1", vector.From.Y)
                .attr("x2", vector.To.X)
                .attr("y2", vector.To.Y)
               .style("stroke", "red")
               .style("stroke-width", "8")
               .on('click', function (d, i) {
                   markSelected(markDetail);
               });
            }

            function drawCrack(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);
                var crackSize = 24;
                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("line")
                   .attr("data-mark-id", markDetail.mark.id).attr("data-check-type", markDetail.checkType)
                   .attr("x1", vector.X - (crackSize / 2))
                   .attr("y1", vector.Y - (crackSize / 2))
                   .attr("x2", vector.X + (crackSize / 2))
                   .attr("y2", vector.Y + (crackSize / 2))
                   .style("stroke", "red")
                   .style("stroke-width", "6")
                   .on('click', function (d, i) {
                       markSelected(markDetail);
                   });

                markDetail.container.append("line")
                   .attr("data-mark-id", markDetail.mark.id).attr("data-check-type", markDetail.checkType)
                   .attr("x1", vector.X - (crackSize / 2))
                   .attr("y1", vector.Y + (crackSize / 2))
                   .attr("x2", vector.X + (crackSize / 2))
                   .attr("y2", vector.Y - (crackSize / 2))
                   .style("stroke", "red")
                   .style("stroke-width", "6")
                   .on('click', function (d, i) {
                       markSelected(markDetail);
                   });
            }

            //interior damage
            function drawDamage(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);

                markDetail.container.append("circle")
                .attr("data-mark-id", markDetail.mark.id).attr("data-check-type", markDetail.checkType)
                .attr("cx", vector.X)
                .attr("cy", vector.Y)
                .attr("r", 12)
                .style("stroke", "white")
                .style("stroke-width", "3")
                .style("fill", "red")
                .on('click', function (d, i) {
                    markSelected(markDetail);
                });
            }

            function drawStain(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);

                vector.X = Math.round(vector.X);
                vector.Y = Math.round(vector.Y);

                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("circle")
                    .attr("cx", vector.X)
                    .attr("cy", vector.Y)
                    .attr("r", 8)
                    .style("stroke", "red")
                    .style("stroke-width", "2")
                    .style("fill", "white")
                    .on('click', function (d, i) {
                        markSelected(markDetail);
                    });
            }


        }

    ]);
