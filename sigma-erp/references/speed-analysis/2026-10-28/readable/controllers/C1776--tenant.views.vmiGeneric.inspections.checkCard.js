// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:484381-484796
appModule.controller('tenant.views.vmiGeneric.inspections.checkCard', [
        '$scope', '$stateParams', 'appSession', '$filter', 'utilities', 'abp.services.app.checkList', 'abp.services.app.vmiGenericInspection',
        function ($scope, $stateParams, appSession, $filter, utilities, checkListService, inspectionService) {

            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            var markingScale = 150 / 335;
            vm.marksImages = [];
            vm.marksImages = [];
            vm.selectedMark = null;
            vm.selectedMark = null;
            vm.isLeftHandDriving = utilities.parseBoolean(abp.setting.get("App.General.IsLeftHandDriving"));
            vm.carInteriorImage = 'car_interior.jpg';
            if (vm.isLeftHandDriving)
                vm.carInteriorImage = 'car_interior_lefthand.jpg';

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

            var inspectionId = 0;
            
            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    inspectionId = $scope.$parent.vmMain.filters.inspectionId;
            }

            if (inspectionId == 0) {
                if (!isNaN($stateParams.query))
                    inspectionId = $stateParams.query;
            }

            vm.loading = false;

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

                    case 7:     //interior crack (interior)
                        return app.localize('Crack');

                    case 8:     //stain (interior)
                        return app.localize('Stain');
                }
            }

            function markSelected(markDetail) {
                if (markDetail == null)
                    return;

                vm.marksImages.length = 0;
                vm.selectedMark = markDetail;

                if (markDetail.mark.images == null)
                    return;

                $scope.$apply(function () {
                    for (var i = 0; i < markDetail.mark.images.length; i++) {
                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = markDetail.mark.images[i].imageURL;
                        imageDetail.img = markDetail.mark.images[i].imageURL;
                        imageDetail.description = markDetail.markType + " " + markDetail.mark.description;

                        vm.marksImages.push(imageDetail);
                    }
                });

            }

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            function getChecklist() {
                checkListService.getCheckList({}).success(function (data) {
                    vm.checklist = data.items;
                });
            };

            vm.checklist1 = [];
            vm.checklist2 = [];
            vm.getChecklist = function () {
                var halfSize = Math.round(vm.checklist.length / 2);
                for (var i = 0; i < halfSize; i++) {
                    var data = { name: vm.checklist[i].name, ticked: isTickedOn(vm.checklist[i]) };
                    vm.checklist1.push(data);
                }
                for (var i = halfSize; i < vm.checklist.length; i++) {
                    var data = { name: vm.checklist[i].name, ticked: isTickedOn(vm.checklist[i]) };
                    vm.checklist2.push(data);
                }
            };

            function isTickedOn(checklistItem) {
                if (vm.inspection != null) {
                    if (vm.inspection.checkList != null) {
                        var found = $filter("filter")(vm.inspection.checkList, { id: checklistItem.id }, true);
                        if (found.length > 0) {
                            return true;
                        }
                    }
                }
                return false;
            };

            function drawMarks() {
                debugger;
                var exterior = d3.select("#exteriorMarksContainer");
                var interior = d3.select("#interiorMarksContainer");

                for (var i = 0; i < vm.inspection.marks.length; i++) {
                    var markDetail = markDetailObject();
                    markDetail.mark = vm.inspection.marks[i];

                    drawMark(exterior, interior, markDetail);
                }
            }

            function drawMark(exterior, interior, markDetail) {
                markDetail.markType = getMarkType(markDetail.mark.markTypeId);

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
                        markDetail.surfaceType = "interior";;
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

                vector.X = Math.round(vector.X * markingScale);
                vector.Y = Math.round(vector.Y * markingScale);

                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("circle")
                    .attr("cx", vector.X)
                    .attr("cy", vector.Y)
                    .attr("r", 4)
                    .style("stroke", (markDetail.isNew ? "red" : "blue"))
                    .style("stroke-width", "2")
                    .style("fill", "white")
                    .on('click', function (d, i) {
                        //getGalleryImages(markDetail);
                        //angular.element('#hidGallery').triggerHandler('click');
                        markSelected(markDetail);
                    });
            }

            function drawBigDent(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);

                vector.X = Math.round(vector.X * markingScale);
                vector.Y = Math.round(vector.Y * markingScale);

                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("circle")
                    .attr("cx", vector.X)
                    .attr("cy", vector.Y)
                    .attr("r", 8)
                    .style("fill", (markDetail.isNew ? "red" : "blue"))
                    .on('click', function (d, i) {
                        //getGalleryImages(markDetail);
                        //angular.element('ng-gallery img')[0].triggerHandler('click');
                        markSelected(markDetail);
                    });
            }

            function drawSmallScratch(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);

                vector.From.X = Math.round(vector.From.X * markingScale);
                vector.From.Y = Math.round(vector.From.Y * markingScale);

                vector.To.X = Math.round(vector.To.X * markingScale);
                vector.To.Y = Math.round(vector.To.Y * markingScale);

                markDetail.x = vector.To.X;
                markDetail.y = vector.To.Y;

                markDetail.container.append("line")
                    .attr("x1", vector.From.X)
                    .attr("y1", vector.From.Y)
                    .attr("x2", vector.To.X)
                    .attr("y2", vector.To.Y)
                    .style("stroke", (markDetail.isNew ? "red" : "blue"))
                    .style("stroke-width", "2")
                    .on('click', function (d, i) {
                        //getGalleryImages(markDetail);
                        //angular.element('ng-gallery img')[0].triggerHandler('click');
                        markSelected(markDetail);
                    });
            }

            function drawBigScratch(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);

                vector.From.X = Math.round(vector.From.X * markingScale);
                vector.From.Y = Math.round(vector.From.Y * markingScale);

                vector.To.X = Math.round(vector.To.X * markingScale);
                vector.To.Y = Math.round(vector.To.Y * markingScale);

                markDetail.x = vector.To.X;
                markDetail.y = vector.To.Y;

                markDetail.container.append("line")
                    .attr("x1", vector.From.X)
                    .attr("y1", vector.From.Y)
                    .attr("x2", vector.To.X)
                    .attr("y2", vector.To.Y)
                    .style("stroke", (markDetail.isNew ? "red" : "blue"))
                    .style("stroke-width", "4")
                    .on('click', function (d, i) {
                        //getGalleryImages(markDetail);
                        //angular.element('ng-gallery img')[0].triggerHandler('click');
                        markSelected(markDetail);
                    });
            }

            function drawCrack(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);
                var crackSize = 12;

                vector.X = Math.round(vector.X * markingScale);
                vector.Y = Math.round(vector.Y * markingScale);

                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("line")
                    .attr("x1", vector.X - (crackSize / 2))
                    .attr("y1", vector.Y - (crackSize / 2))
                    .attr("x2", vector.X + (crackSize / 2))
                    .attr("y2", vector.Y + (crackSize / 2))
                    .style("stroke", (markDetail.isNew ? "red" : "blue"))
                    .style("stroke-width", "3")
                    .on('click', function (d, i) {
                        //getGalleryImages(markDetail);
                        //angular.element('ng-gallery img')[0].triggerHandler('click');
                        markSelected(markDetail);
                    });

                markDetail.container.append("line")
                    .attr("x1", vector.X - (crackSize / 2))
                    .attr("y1", vector.Y + (crackSize / 2))
                    .attr("x2", vector.X + (crackSize / 2))
                    .attr("y2", vector.Y - (crackSize / 2))
                    .style("stroke", (markDetail.isNew ? "red" : "blue"))
                    .style("stroke-width", "3")
                    .on('click', function (d, i) {
                        //getGalleryImages(markDetail);
                        //angular.element('ng-gallery img')[0].triggerHandler('click');
                        markSelected(markDetail);
                    });
            }

            //interior damage
            function drawDamage(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);

                vector.X = Math.round(vector.X * markingScale);
                vector.Y = Math.round(vector.Y * markingScale);

                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("circle")
                    .attr("cx", vector.X)
                    .attr("cy", vector.Y)
                    .attr("r", 8)
                    .style("fill", (markDetail.isNew ? "red" : "blue"))
                    .on('click', function (d, i) {
                        //getGalleryImages(markDetail);
                        //angular.element('ng-gallery img')[0].triggerHandler('click');
                        markSelected(markDetail);
                    });
            }

            function drawStain(markDetail) {
                var vector = JSON.parse(markDetail.mark.vector);

                vector.X = Math.round(vector.X * markingScale);
                vector.Y = Math.round(vector.Y * markingScale);

                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("circle")
                    .attr("cx", vector.X)
                    .attr("cy", vector.Y)
                    .attr("r", 8)
                    .style("stroke", (markDetail.isNew ? "red" : "blue"))
                    .style("stroke-width", "2")
                    .style("fill", "white")
                    .on('click', function (d, i) {
                        //getGalleryImages(markDetail);
                        //angular.element('ng-gallery img')[0].triggerHandler('click');
                        markSelected(markDetail);
                    });
            }


            function init() {
                vm.loading = true;
                if (vm.checkList == null) {
                    getChecklist();
                }
                if (inspectionId > 0) {
                    inspectionService.getInspectionForView({
                        id: inspectionId
                    }).success(function (result) {
                        vm.inspection = result;
                        vm.getChecklist();
                        drawMarks();
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            init();
        }
    ]);
