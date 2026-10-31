// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:399674-399770
appModule.controller('tenant.views.crs.workshopMovements.viewModal', ['workshopMovementId', '$uibModalInstance','utilities', 'abp.services.app.workshopMovement', 'abp.services.app.job', '$uibModal',
        function (workshopMovementId, $uibModalInstance, utilities, workshopMovementService, jobService, $uibModal) {

            var vm = this;
            vm.loading = false;
            vm.isVehicleRepairHistoryInCrsEnabled = abp.features.isEnabled("CRS.CustomFeatures.LinkCrsToWorkShop.VehicleRepairHistoryInCRSBasedOnJobs");
            vm.documents = [];
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForWorkshopMovements");

           // vm.documentImages = [];
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

            vm.workshopMovementTypes = [
                { id: 1, name: 'Maintenance' }, { id: 2, name: 'Repair' }, { id: 3, name: 'Accident Repair' }, { id: 10, name: 'Inspection' }, { id: 14, name: 'Breakdown' }
            ];

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            function getJobsForRentalTenant() {
                vm.loading = true;
                jobService.getWorkoderAndJobsForRentalTenant({
                    vehicleId: vm.workshopMovement.vehicleId,
                    startDate: vm.workshopMovement.outDetail.dateTime
                    //status: 2 //closed jobs
                }).success(function (result) {
                    if (result) {
                        vm.isWorkOrderRejected = result.isWorkOrderRejected;
                        vm.jobsOnMovement = result.jobs;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.openJobViewModel = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/viewModal.cshtml',
                    controller: 'tenant.views.workshop.jobs.viewModalRental as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        jobId: function () {
                            return id;
                        }
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            //function imageGalleryObject() {
            //    var detail = new Object();
            //    detail.thumb = "";
            //    detail.img = "";
            //    detail.description = "";
            //    return detail;
            //}
            function init() {
                vm.loading = true;
                workshopMovementService.getWorkshopMovementForEdit({ id: workshopMovementId }
                ).success(function (result) {
                    vm.workshopMovement = result;
                    vm.documents = vm.workshopMovement.documents;
                    //vm.workshopMovement.documents = vm.workshopMovement.documents ? vm.workshopMovement.documents : [];
                    //vm.workshopMovement.documents.forEach(function (value) {
                    //    var imageDetail = imageGalleryObject();
                    //    imageDetail.thumb = value.url;
                    //    imageDetail.img = value.url;
                    //    imageDetail.description = '';
                    //    vm.documentImages.push(imageDetail);
                    //});
                    getJobsForRentalTenant();

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
