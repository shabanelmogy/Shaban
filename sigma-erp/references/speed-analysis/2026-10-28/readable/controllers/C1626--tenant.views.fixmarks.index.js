// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:445916-446356
appModule.controller('tenant.views.fixmarks.index', [
        '$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.movement', "$timeout", 'utilities', '$stateParams',
        function ($scope, $uibModal, vehicleService, movementService, $timeout, utilities, $stateParams) {

            var vm = this;
            vm.removeAllDamages = abp.auth.hasPermission('Pages.Tenant.Vehicles.FixMarks.FixAllDamages');
            vm.exteriorMarks = [];
            vm.interiorMarks = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isLeftHandDriving = utilities.parseBoolean(abp.setting.get("App.General.IsLeftHandDriving"));
            vm.carInteriorImage = 'car_interior.jpg';
            if (vm.isLeftHandDriving)
                vm.carInteriorImage = 'car_interior_lefthand.jpg';

            function resetData() {

                //vm.loading = false;
                vm.marks = null;
                vm.currentVehicle = null;
                vm.exteriorMarks = [];
                vm.interiorMarks = [];
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
                plateNo: null
            };

            resetData();

            vm.getMarks = function () {
                vm.loading = true;
                resetData();
                vehicleService.getVehicleMarks(vm.filters).success(function (data) {
                    vm.currentVehicle = data;
                    vm.marks = data.marks;
                    vm.marksCopy = angular.copy(vm.marks);
                    if (vm.marksCopy.length > 0) {

                        vm.exteriorMarks = vm.marksCopy.filter(x => x.markType.surfaceTypeId == 1);
                        vm.interiorMarks = vm.marksCopy.filter(x => x.markType.surfaceTypeId == 2);

                    }
                    $timeout(function () {
                        // anything you want can go here and will safely be run on the next digest.
                        drawMarks();
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };




            function drawMarks() {
                //
                var exterior = d3.select("#exteriorInMarksContainer");
                var interior = d3.select("#interiorInMarksContainer");

                for (var i = 0; i < vm.marks.length; i++) {
                    var markDetail = markDetailObject();
                    markDetail.mark = vm.marks[i];
                    markDetail.checkType = "checkin";

                    drawMark(exterior, interior, markDetail);
                }
            }

            vm.fixAllExteriorMarks = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/fixMarks/confirmationRepairedMarkWithNotes.cshtml',
                    controller: 'tenant.views.mcc.fixMarks.confirmationRepairedMarkWithNotes as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        mark: function () {
                            return vm.exteriorMarks;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    debugger;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    for (var i = 0; i < vm.exteriorMarks.length; i++) {
                        $('[data-mark-id=' + vm.exteriorMarks[i].id + ']').remove();
                    }
                    vm.exteriorMarks = [];
                    vm.selectedExteriorMark = null;
                    vm.selectedInteriorMark = null;
                    vm.getMarks();
                });
            }
            vm.fixAllInteriorMarks = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/fixMarks/confirmationRepairedMarkWithNotes.cshtml',
                    controller: 'tenant.views.mcc.fixMarks.confirmationRepairedMarkWithNotes as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        mark: function () {
                            return vm.interiorMarks;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    debugger;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    for (var i = 0; i < vm.interiorMarks.length; i++) {
                        $('[data-mark-id=' + vm.interiorMarks[i].id + ']').remove();
                    }
                    vm.interiorMarks = [];
                    vm.selectedExteriorMark = null;
                    vm.selectedInteriorMark = null;
                    vm.getMarks();

                });
            }

            //mark reparired and remove symbol
            vm.rapairMark = function (mark) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/fixMarks/confirmationRepairedMarkWithNotes.cshtml',
                    controller: 'tenant.views.mcc.fixMarks.confirmationRepairedMarkWithNotes as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        mark: function () {
                            return mark;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    debugger;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $('[data-mark-id=' + mark.mark.id + ']').remove();
                    vm.selectedExteriorMark = null;
                    vm.selectedInteriorMark = null;
                    vm.getMarks();
                });
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

            //interior stain
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
