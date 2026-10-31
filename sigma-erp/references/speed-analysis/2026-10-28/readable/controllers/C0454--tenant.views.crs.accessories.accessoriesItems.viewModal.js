// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:116655-116754
appModule.controller('tenant.views.crs.accessories.accessoriesItems.viewModal', [
        '$uibModalInstance', '$uibModal', 'abp.services.app.accessory', 'abp.services.app.vehicleModel',
        'vehicleId', 'abp.services.app.commonLookup', 'utilities', 'appSession',
        function ($uibModalInstance, $uibModal, accessoriesService, vehicleModelService, vehicleId, lookupService, utilities, appSession) {
            var vm = this;
            vm.saving = false;
            vm.states = null;
            vm.models = null;
            vm.locations = null;
            vm.tenantName = appSession.tenant.name;
            vm.selectedModel = null;
            vm.modelSearchText = null;
            vm.locations = [];
            vm.allactionsonotherbranch = abp.auth.hasPermission('Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles');
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.filters = {
                name: '',
                makeId: null
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            };


            vm.openPrintModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/printDocumentModel.cshtml',
                    controller: 'tenant.views.crs.vehicles.printDocumentModel as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            };


            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };
 

            function getLocations() {

                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;


                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                getLocations();

                accessoriesService.getAccessoryForEdit({
                    id: vehicleId
                }).success(function (result) {
                    
                    vm.vehicle = result;
                    //getMovements(vehicleId);
                    //load document images gallery
                    //vm.documentImages = [];

                    //for (var i = 0; i < vm.vehicle.documentImages.length; i++) {
                    //    var img = vm.vehicle.documentImages[i];

                    //    var imageDetail = imageGalleryObject();
                    //    imageDetail.thumb = img.imageURL;
                    //    imageDetail.img = img.imageURL;
                    //    imageDetail.description = '';
                    //    vm.documentImages.push(imageDetail);
                    //}

                    vm.loading = false;
                });
            }

            init();
        }
    ]);
