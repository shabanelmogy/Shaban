// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:150797-151090
appModule.controller('tenant.views.agreements.printTemplates.printReplacement', [
        '$stateParams', '$filter', 'appSession', 'utilities' ,'abp.services.app.agreementPrint',
        function ($stateParams, $filter, appSession, utilities, agreementPrintService) {

            var vm = this;
            vm.tenantName = appSession.tenant.name;
            var markingScale = 150 / 335;
            var movementId = 0;
            var movementIdStr = '';
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            if (!isNaN($stateParams.query))
                movementId = $stateParams.query;
            vm.loading = false;
            vm.checklist = null;
            vm.checklistOutIn = [];

            // Getting Fuel Level 
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
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

            function isNewMarkIn(mark) {
                var found = $filter("filter")(vm.movement.outMarks, { id: mark.id }, true);
                if (found.length > 0)
                    return false;
                else
                    return true;
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
                    markDetail.isNew = isNewMarkIn(vm.movement.inMarks[i]);

                    drawMark(exterior, interior, markDetail);
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
                    .style("fill", "white");
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
                    .style("fill", (markDetail.isNew ? "red" : "blue"));
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
                    .style("stroke-width", "2");
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
                    .style("stroke-width", "4");
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
                    .style("stroke-width", "3");

                markDetail.container.append("line")
                    .attr("x1", vector.X - (crackSize / 2))
                    .attr("y1", vector.Y + (crackSize / 2))
                    .attr("x2", vector.X + (crackSize / 2))
                    .attr("y2", vector.Y - (crackSize / 2))
                    .style("stroke", (markDetail.isNew ? "red" : "blue"))
                    .style("stroke-width", "3");
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
                    .style("fill", (markDetail.isNew ? "red" : "blue"));
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

            function init() {
                vm.loading = true;
                agreementPrintService.printReplacement({
                    id: movementId
                }).success(function (result) {
                    vm.printReplacementData = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
