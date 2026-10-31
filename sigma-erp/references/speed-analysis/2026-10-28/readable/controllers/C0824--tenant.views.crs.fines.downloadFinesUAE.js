// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:222490-222622
appModule.controller('tenant.views.crs.fines.downloadFinesUAE', ['$uibModal', '$scope', '$http', 'abp.services.app.trafficFile','fineDownloader',
    function ($uibModal, $scope, $http, trafficFileAppService, fineDownloader) {
        var vm = this;
        vm.permissions = {
            create: abp.auth.hasPermission('Pages.Tenant.TrafficFines.Addnew'),
            edit: abp.auth.hasPermission('Pages.Tenant.TrafficFines.Edit'),
            'delete': abp.auth.hasPermission('Pages.Tenant.TrafficFines.Delete'),
            //'view': abp.auth.hasPermission('Pages.Tenant.Receipts.View'),

        };

        vm.enableDownloadBtn = false;
        vm.processing = false;
        vm.downloading = false;

        vm.localize = function (input) {
            if (input == null)
                return "";
            return app.localize(input);
        };

        vm.getTrafficFiles = function () {

            vm.loading = true;
            trafficFileAppService.getTrafficFiles({}).success(function (data) {
                
                vm.trafficFiles = data.items;
            }).finally(function () {
                vm.loading = false;
            });
        };
        function openCreateOrEditTrafficFineModal(trafficFineId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/fines/createOrEditModal.cshtml',
                controller: 'tenant.views.crs.fines.createOrEditModal as vm',
                //backdrop: 'static',
                size: 'lg',
                resolve: {
                    trafficFineId: function () {
                        return trafficFineId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                vm.getTrafficFines();
            });
        }

        function openChargeTrafficFineModal(trafficFine) {

            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vouchers/receipts/chargeTrafficFineModal.cshtml',
                controller: 'tenant.views.crs.receipts.vouchers.chargeTrafficFineModal as vm',
                //backdrop: 'static',
                size: 'lg',
                resolve: {
                    fine: function () {
                        return trafficFine;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                vm.getTrafficFines();
            });
        }

        vm.downloadButtonSatateChange = function () {
            angular.forEach(vm.trafficFiles, function (i, v) {
                if (v.isSelected) {
                    vm.enableDownloadBtn = true;
                    return;
                }
                else
                    vm.enableDownloadBtn = false;
            });
        };

        //vm.downloadFines = function () {
        //    vm.processing = true;

        //};

        vm.test = function () {
            
            vm.downloading = true;
            fineDownloader.downloadFines();
            vm.downloading = false;

            //var azureGetCaptchaUrl = "https://speedcloudlivefinesdownloadingfunctionsapp.azurewebsites.net/api/GetCaptcha";
            //$http({
            //    method: 'Post',
            //    url: azureGetCaptchaUrl,
            //    data: {}
            //}).then(
            //    function success(response) {
            //        vm.processing = true;
            //        
            //        vm.captchaObject = response.data;
            //        //For Testing
            //        vm.captchaObject.fileIds = ['1980335360'];
            //        vm.captchaObject.state = 'Abu Dhabi';
            //        vm.captchaObject.tenantId = 40;
            //        var modalInstance = $uibModal.open({
            //            templateUrl: '~/App/tenant/views/crs/fines/inputCaptchaModal.cshtml',
            //            controller: 'tenant.views.crs.fines.inputCaptchaModal as vm',
            //            backdrop: 'static',
            //            size: 'sm',
            //            resolve: {
            //                captchaModel: function () {
            //                    return vm.captchaObject;
            //                }
            //            }
            //        });

            //        modalInstance.result.then(function (result) {
            //            //To Do:
            //            vm.processing = false;

            //        });
            //    },
            //function error(reason) {
            //    console.log(reason);
            //    vm.processing = false;
            //});


        };

        function init() {
            vm.getTrafficFiles();
        }
        init();
    }]);
