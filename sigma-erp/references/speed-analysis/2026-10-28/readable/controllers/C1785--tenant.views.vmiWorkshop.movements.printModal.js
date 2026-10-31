// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:486766-487329
appModule.controller('tenant.views.vmiWorkshop.movements.printModal', [
        '$scope', '$stateParams', '$filter', '$uibModal', 'appSession', 'abp.services.app.checkCardPrint', 'abp.services.app.checkList', 'utilities', 'abp.services.app.commonLookup',
        function ($scope, $stateParams, $filter, $uibModal, appSession, checkCardPrintService, checkListService, utilities, commonLookupService) {

            var vm = this;
            vm.tenantName = appSession.tenant.name;
            var markingScale = 150 / 335;
            var movementId = 0;

            vm.passportImages = [];
            vm.nationalIdImages = [];
            vm.drivingLicenseImages = [];

            vm.tenancyName = appSession.tenant.tenancyName;
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.contactLabel = app.localize('Driver');
            vm.isLeftHandDriving = utilities.parseBoolean(abp.setting.get("App.General.IsLeftHandDriving"));
            vm.showFuelInPercentage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowFuelInPercentage"));
            vm.isShowDamagesPicturesOnCheckCard = utilities.parseBoolean(abp.setting.get("App.General.ShowDamagesPicturesOnCheckCard"));
            vm.isShowDocumentImagesOnCheckcard = utilities.parseBoolean(abp.setting.get("App.General.ShowDocumentImagesOnCheckcard"));
            vm.vehicleTypeWiseChecklistEnable = abp.features.isEnabled("Core.VehicleTypeWiseChecklist");
            vm.isDamageVisible = false;
            vm.carInteriorImage = 'car_interior.jpg';
            if (vm.isLeftHandDriving)
                vm.carInteriorImage = 'car_interior_lefthand.jpg';
            debugger;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    movementId = $scope.$parent.vmMain.movementId;
            }

            if (movementId == 0) {
                if (!isNaN($stateParams.query))
                    movementId = $stateParams.query;
            }

            vm.loading = false;
            vm.checklist = null;
            vm.checklistOutIn = [];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.localize = function (input) {
                var localizeValue;
                if (input) {
                    localizeValue = app.localize(input);
                    return localizeValue;
                }
                return;
            };



            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
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
                detail.isNew = false;

                return detail;
            }

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";

                return detail;

            }

            function isNewMarkIn(mark) {
                var found = $filter("filter")(vm.movement.outMarks, { id: mark.id }, true);
                if (found.length > 0)
                    return false;
                else
                    return true;
            }



            vm.geoLocationMap = function (lat, lng) {
                var url = "https://maps.google.com/?q=" + lat + "," + lng;
                window.open(url);
            };

            function drawOutMarks() {
                var exterior = d3.select("#exteriorOutMarksContainer");
                var interior = d3.select("#interiorOutMarksContainer");

                for (var i = 0; i < vm.movement.outMarks.length; i++) {
                    var markDetail = markDetailObject();
                    markDetail.mark = vm.movement.outMarks[i];
                    markDetail.mark.images = vm.movement.outMarks[i].images;
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
                    markDetail.mark.images = vm.movement.inMarks[i].images;
                    markDetail.checkType = "checkin";
                    markDetail.isNew = isNewMarkIn(vm.movement.inMarks[i]);

                    drawMark(exterior, interior, markDetail);
                }
            }
            vm.getMarkType = function (markTypeId) {
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

            function drawMark(exterior, interior, markDetail) {
                //markDetail.markType = getMarkType(markDetail.mark.markTypeId);

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

            var getGalleryImages = function (markDetail) {
                console.log(markDetail);
                vm.damageImages = [];
                for (var i = 0; i < markDetail.mark.images.length; i++) {

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = markDetail.mark.images[i].imageURL;
                    imageDetail.img = markDetail.mark.images[i].imageURL;
                    imageDetail.description = markDetail.markType + " " + markDetail.mark.description;
                    vm.damageImages.push(imageDetail);
                }
            }

            var markSelected = function (markDetail) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/movements/damageDetailCheckCardModal.cshtml',
                    controller: 'tenant.views.mcc.movements.damageDetailCheckCardModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        markDetail: function () {
                            return markDetail;
                        }
                    }
                });
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
                vm.checklistOutIn.length = 0;

                for (var i = 0; i < vm.checklist.length; i++) {
                    var data = { name: vm.checklist[i].name, tickedOnCheckout: isTickedOnCheckout(vm.checklist[i]), tickedOnCheckin: isTickedOnCheckin(vm.checklist[i]) };
                    vm.checklistOutIn.push(data);
                }
            };
            
            function intiDocuments() {
                vm.passportImages = vm.movement.documents.filter(e => e.documentType == 2);
                vm.nationalIdImages = vm.movement.documents.filter(e => e.documentType == 3);
                vm.drivingLicenseImages = vm.movement.documents.filter(e => e.documentType == 4);
            }

            function getChecklist() {
                //checkListService.getCheckListForPrint({}).success(function (data) {
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
            

            function getStaffName() {
                commonLookupService.getUser({
                    id: vm.movement.creatorUserId
                }).success(function (result) {
                    vm.staffOutName = result.name;
                });

                if (vm.movement.lastModifierUserId && vm.movement.isComplete) {
                    commonLookupService.getUser({
                        id: vm.movement.lastModifierUserId
                    }).success(function (result) {
                        vm.staffInName = result.name;
                    });
                }

            }

            function init() {
                vm.loading = true;

                if (movementId > 0) {
                    checkCardPrintService.getCheckCardForWorkshop({
                        id: movementId
                    }).success(function (result) {
                        vm.checkCard = result;
                        vm.movement = result.movement;

                        //if checklist (all items list) is not passed from parent then load
                        getChecklist();

                        vm.signatoryDocumentsOut = vm.movement.documents.filter(e => e.name.startsWith('SignatoryID_Checkout'));
                        vm.signatoryDocumentsIn = vm.movement.documents.filter(e => e.name.startsWith('SignatoryID_Checkin'));
                        getStaffName();
                        if (vm.movement) {
                            if (vm.movement.outDetail.notes != null) {
                                vm.movement.outDetail.notes.replace(/\n/g, "<br/>")
                            }
                            if (vm.movement.outDetail_Location) {
                                vm.outLocationName = vm.movement.outDetail_Location.name;
                                vm.outLocationState = vm.movement.outDetail_Location.state;
                            }
                            if (vm.movement.inDetail_Location) {
                                vm.inLocationName = vm.movement.inDetail_Location.name
                                vm.inLocationState = vm.movement.inDetail_Location.state
                            }

                            vm.isDamageVisible = vm.movement.isComplete && vm.isShowDamagesPicturesOnCheckCard && vm.movement.movementTypeId == 1;
                            vm.damageMarks = angular.copy(vm.movement.inMarks);
                            // For CheckCard Image Damages Enable (difference in inMarks and OutMarks)
                            if (vm.isDamageVisible) {
                                if (vm.movement.outMarks.length > 0) {
                                    angular.forEach(vm.movement.outMarks, function (key) {
                                        vm.damageMarks = vm.damageMarks.filter(x => x.id != key.id);
                                    });
                                }
                            }
                            vm.isDocumentVisible = vm.isShowDocumentImagesOnCheckcard;
                            if (vm.isDocumentVisible == true && vm.movement.documents && vm.movement.documents.length > 0)
                                intiDocuments();
                        }

                        //vm.getChecklist();
                        drawOutMarks();
                        drawInMarks();


                    }).finally(function () {
                        vm.loading = false;
                    });

                }


            }

            init();
        }
    ]);
