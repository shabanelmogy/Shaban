// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:487438-488034
appModule.controller('tenant.views.vmiWorkshop.movements.viewModal', [
        '$scope', '$filter', '$uibModalInstance', '$uibModal', 'uiGridConstants', 'abp.services.app.garage', 'abp.services.app.checkList', 'movementId', 'checklist', 'utilities', 
        function ($scope, $filter, $uibModalInstance, $uibModal, uiGridConstants, garageService, checkListService, movementId, checklist, utilities) {

            var vm = this;
            vm.loading = false;
            vm.checklist = null; //checklist;
            vm.activeTabIndex = 1;

            vm.passportImages = [];
            vm.nationalIdImages = [];
            vm.drivingLicenseImages = [];
            vm.exteriorMarksImages = [];
            vm.interiorMarksImages = [];
            vm.selectedExteriorMark = null;
            vm.selectedInteriorMark = null;
            vm.movementSubType = '';
            vm.refNoLabel = app.localize('RefNo');
            vm.contactLabel = app.localize('Driver');
            vm.showFuelInPercentage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowFuelInPercentage"));
            vm.vmiWorkShopVehicleImagesEnable = abp.features.isEnabled("VMIWorkshop.VehicleImages");
            vm.checkinVehicleImages = [];
            vm.checkoutVehicleImages = [];
            vm.mccVehicleImagesEnable = abp.features.isEnabled("MCC.VehicleImages");
            vm.vehicleTypeWiseChecklistEnable = abp.features.isEnabled("Core.VehicleTypeWiseChecklist");
            vm.isLeftHandDriving = utilities.parseBoolean(abp.setting.get("App.General.IsLeftHandDriving"));
            vm.carInteriorImage = 'car_interior.jpg';
            

            if (vm.isLeftHandDriving)
                vm.carInteriorImage = 'car_interior_lefthand.jpg';

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

            vm.geoLocationMap = function (lat, lng) {
                var url = "https://maps.google.com/?q=" + lat + "," + lng;
                window.open(url);
            };

            vm.supportingDocuments = [];

            vm.getLocalize = function (value) {
                return app.localize(value);
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.setActiveTabIndex = function (index) {
                vm.activeTabIndex = index;
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.checklistGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('ChecklistItemName'),
                        field: 'name'
                    },
                    {
                        name: app.localize('In'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents align-center\">' +
                            '  <img ng-if="row.entity.tickedOnCheckin" src= "common/images/tick.png" width="22" height="22" />' +
                            '</div>'
                    },
                    {
                        name: app.localize('Out'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents align-center\">' +
                            '  <img ng-if="row.entity.tickedOnCheckout" src= "common/images/tick.png" width="22" height="22"/>' +
                            '</div>'
                    }
                ],
                data: []
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
                if (markDetail == null)
                    return;

                if (markDetail.surfaceType == "exterior") {
                    vm.exteriorMarksImages.length = 0;
                    vm.selectedExteriorMark = markDetail;
                }
                else if (markDetail.surfaceType == "interior") {
                    vm.interiorMarksImages.length = 0;
                    vm.selectedInteriorMark = markDetail;
                }
                else
                    return;

                if (markDetail.mark.images == null)
                    return;

                $scope.$apply(function () {
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

                    case 7:     //interior crack (interior)
                        return app.localize('Crack');

                    case 8:     //stain (interior)
                        return app.localize('Stain');
                }
            }
            function drawOutMarks() {
                var exterior = d3.select("#exteriorOutMarksContainer");
                var interior = d3.select("#interiorOutMarksContainer");

                for (var i = 0; i < vm.movement.outMarks.length; i++) {
                    var markDetail = markDetailObject();
                    markDetail.mark = vm.movement.outMarks[i];
                    markDetail.checkType = "checkout";

                    drawMark(exterior, interior, markDetail);
                }
            }

            function drawInMarks() {
                var exterior = d3.select("#exteriorInMarksContainer");
                var interior = d3.select("#interiorInMarksContainer");

                for (var i = 0; i < vm.movement.inMarks.length; i++) {

                    var markDetail = markDetailObject();
                    markDetail.mark = vm.movement.inMarks[i];
                    markDetail.checkType = "checkin";

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
                markDetail.x = vector.X;
                markDetail.y = vector.Y;

                markDetail.container.append("circle")
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
                        //getGalleryImages(markDetail);
                        //angular.element('ng-gallery img')[0].triggerHandler('click');
                        markSelected(markDetail);
                    });
            }

            function isTickedOnCheckout(checklistItem) {
                if (vm.movement != null) {
                    if (vm.movement.outCheckList != null) {
                        var found = $filter("filter")(vm.movement.outCheckList, { id: checklistItem.id }, true);
                        if (found.length > 0) {
                            return true;
                        }
                    }
                }

                return false;
            };

            function isTickedOnCheckin(checklistItem) {
                if (vm.movement != null) {
                    if (vm.movement.inCheckList != null) {
                        var found = $filter("filter")(vm.movement.inCheckList, { id: checklistItem.id }, true);
                        if (found.length > 0) {
                            return true;
                        }
                    }
                }

                return false;
            };

            vm.getChecklist = function () {
                var checklistOutIn = [];

                for (var i = 0; i < vm.checklist.length; i++) {
                    var data = { name: vm.checklist[i].name, tickedOnCheckout: isTickedOnCheckout(vm.checklist[i]), tickedOnCheckin: isTickedOnCheckin(vm.checklist[i]) };
                    checklistOutIn.push(data);
                }

                vm.checklistGridOptions.data = checklistOutIn;
            };
            
            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/movements/uploadDocument.cshtml',
                    controller: 'tenant.views.movements.uploadDocument as vm',
                    backdrop: 'static',
                    resolve: {
                        movementId: function () {
                            return movementId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    getSupportingDocuments();
                });
            }

            function getSupportingDocuments() {
                vm.loading = true;
                garageService.getSupportingDocuments({
                    id: movementId
                }).success(function (data) {
                    vm.supportingDocuments = data.items;
                }).finally(function () {
                    vm.loading = false;
                })
            };

            function intiDocuments() {
                vm.passportImages.length = 0;
                vm.nationalIdImages.length = 0;
                vm.drivingLicenseImages.length = 0;
                vm.supportingDocuments.length = 0;

                for (var i = 0; i < vm.movement.documents.length; i++) {

                    switch (vm.movement.documents[i].documentType) {
                        case 2:
                            var imageDetail = imageGalleryObject();
                            imageDetail.thumb = vm.movement.documents[i].url;
                            imageDetail.img = vm.movement.documents[i].url;

                            imageDetail.description = "Passport";
                            vm.passportImages.push(imageDetail);
                            break;
                        case 3:
                            var imageDetail = imageGalleryObject();
                            imageDetail.thumb = vm.movement.documents[i].url;
                            imageDetail.img = vm.movement.documents[i].url;

                            imageDetail.description = "National ID";
                            vm.nationalIdImages.push(imageDetail);
                            break;
                        case 4:
                            var imageDetail = imageGalleryObject();
                            imageDetail.thumb = vm.movement.documents[i].url;
                            imageDetail.img = vm.movement.documents[i].url;

                            imageDetail.description = "Driving License";
                            vm.drivingLicenseImages.push(imageDetail);
                            break;
                        case 5: //supporing documents
                            vm.supportingDocuments.push(vm.movement.documents[i]);
                            break;
                    }
                }
            }

            function getChecklist() {
                //checkListService.getCheckList({}).success(function (data) {
                //    vm.checklist = data.items;
                //});

                if (vm.vehicleTypeWiseChecklistEnable == true) {
                    checkListService.getVehicleTypeWiseCheckList({ vehicleTypeId: vm.movement.vehicle.tariffGroupId }).success(function (data) {
                        vm.checklist = data.items;
                        if (vm.checklist.length == 0) {
                            checkListService.getCheckList({}).success(function (data) {
                                vm.checklist = data.items;
                                vm.getChecklist();
                            });
                        }
                        else {
                            vm.getChecklist();
                        }
                    });
                }
                else {
                    checkListService.getCheckList({}).success(function (data) {
                        vm.checklist = data.items;
                        vm.getChecklist();
                    });
                }
            };
            function getLabelNames() {
                if (vm.movement.movementType.id == 1) {
                    vm.refNoLabel = app.localize('RefNo') + ' (' + app.localize('AgreementNo') + ')';
                    vm.contactLabel = app.localize('Customer');
                }
                else if (vm.movement.movementType.id == 3) {
                    vm.refNoLabel = app.localize('RefNo') + ' (' + app.localize('PONo') + ')';
                    vm.contactLabel = app.localize('Workshop');
                }
                else if (vm.movement.movementTypeId == 8 && vm.movement.contact) {
                    vm.refNoLabel = app.localize('RefNo');
                    vm.contactLabel = app.localize('InspectorName');
                }

                else {
                    vm.refNoLabel = app.localize('RefNo');
                    vm.contactLabel = app.localize('Driver');
                }
            }
            function init() {
                vm.loading = true;

                garageService.getMovement({
                    id: movementId
                }).success(function (result) {
                    vm.movement = result;
                    getLabelNames();

                    //if checklist (all items list) is not passed from parent then load
                    getChecklist();

                    intiDocuments();
                    drawOutMarks();
                    drawInMarks();
                    getSupportingDocuments();

                    if (vm.movement.movementSubType != null) {
                        vm.movementSubType = getMovementSubType(vm.movement.movementSubType);
                    }
                    if (vm.vmiWorkShopVehicleImagesEnable || vm.mccVehicleImagesEnable) {
                        for (i = 0; i < vm.movement.movementVehicleImages.length; i++) {
                            var img = vm.movement.movementVehicleImages[i];
                            if (img.checkType == 1) {
                                var imageDetail = imageGalleryObject();
                                imageDetail.thumb = img.imageURL;
                                imageDetail.img = img.imageURL;
                                imageDetail.description = '';

                                vm.checkoutVehicleImages.push(imageDetail);
                            }
                            else {
                                if (img.checkType == 2) {
                                    var imageDetail1 = imageGalleryObject();
                                    imageDetail1.thumb = img.imageURL;
                                    imageDetail1.img = img.imageURL;
                                    imageDetail1.description = '';

                                    vm.checkinVehicleImages.push(imageDetail1);
                                }
                            }
                        }
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
