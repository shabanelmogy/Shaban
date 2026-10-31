// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:485424-485505
appModule.controller('tenant.views.vmiWorkshop.agreements.createOrUpdateVmiAgreementModal', [
        '$scope','utilities' ,'$uibModalInstance', 'abp.services.app.vmiAgreement', 'agreementId', 'abp.services.app.directory', 'abp.services.app.vehicle',
        'abp.services.app.location',
        function ($scope, utilities,$uibModalInstance, vmiAgreementService, agreementId, directoryService, vehicleService, locationService) {

            var vm = this;
            vm.agreement = {
                vehicle: {},
                customerName: '',
                mobileNo: ''
            };
            vm.drivers = [];
            vm.staffList = [];
            vm.vehicles = [];
            vm.locations = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };
            vm.searchStaff = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.staffList = response.data.items;
                });
            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, source: 'openagreement'}).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.save = function () {
                vm.loading = true;
                vmiAgreementService.createVmiAgreement(vm.agreement)
                    .success(function () {
                        vm.loading = false;
                        $uibModalInstance.close();
                    });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.nameEmailValueChanged = function () {
                vmiAgreementService.getExsistingCustomer(vm.agreement.email)
                    .success(function (data) {
                        
                        if (data != null) {
                            vm.agreement.customerName = data.name;
                            vm.agreement.mobileNo = data.mobileNo;
                        }
                    });
                
            };
            function init() {
                locationService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {
                    vm.loading = false;

                });
                //if (agreementId > 0) {
                //    vm.loading = true;
                //    vmiAgreementService.getAgreementForEdit(agreementId)
                //        .success(function () {
                //            vm.loading = false;
                            
                //        });
                //}

            }
            init();
        }
    ]);
