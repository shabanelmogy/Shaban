// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:447455-447540
appModule.controller('tenant.views.mcc.movements.damageDetailCheckCardModal', [
        '$scope', '$uibModalInstance', 'markDetail',
        function ($scope, $uibModalInstance, markDetail) {

            var vm = this;
            vm.loading = false;

            vm.exteriorMarksImages = [];
            vm.interiorMarksImages = [];
            vm.selectedExteriorMark = {};
            vm.selectedInteriorMark = {};

            console.log(markDetail);

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

            vm.getMarkType = function(markTypeId) {
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

                    case 8:     //Medium Dent (exterior)
                        return app.localize('MediumDent');

                    case 9:     //Medium Scratch (exterior)
                        return app.localize('MediumScratch');
                }
            }

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";

                return detail;

            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

           
        }
    ]);
