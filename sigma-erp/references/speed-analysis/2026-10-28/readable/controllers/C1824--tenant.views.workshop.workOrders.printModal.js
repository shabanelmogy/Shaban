// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:497777-497872
appModule.controller('tenant.views.workshop.workOrders.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.workOrder', '$sce', 'utilities', 'abp.services.app.commonLookup',
        function ($scope, appSession, $stateParams, workOrderService, sce, utilities, commonLookupService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.locationId = appSession.user.locationId;
            vm.loading = false;
            var recordsPerPage = 10;
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.workOrderId))
                    workOrderId = $scope.$parent.vmMain.workOrderId;
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };


            //if through url print
            if (workOrderId == 0 && !isNaN($stateParams.query)) {
                workOrderId = $stateParams.query;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
          
            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateTimeFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };

            vm.getDate = function (date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };


            function customizePagesData() {
                var customArray = [];
                customArray = vm.workOrder.voucherLines.filter(v => !v.hidden);
                var arrayLength = customArray.length;
                var noOfPages = arrayLength / recordsPerPage;
                vm.pagesData = [];
                for (var i = 0; i < noOfPages; i++) {
                    var subArray = [];
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;
                    subArray = customArray.slice(start, end);
                    vm.pagesData.push({
                        pageNo: i + 1,
                        voucherLinesdataToIterate: subArray
                    })
                }
            }
            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };
            vm.getAuthorizeName = function (authorizeId) {
                commonLookupService.getUser({
                    id: authorizeId
                }).success(function (result) {
                    vm.authorizeName = result.name + ' ' + result.surname;
                });
            };
            function init() {
                vm.loading = true;
                workOrderService.getWorkOrderForEdit({ id: workOrderId })
                    .success(function (result) {
                        vm.workOrder = result;
                        customizePagesData();
                        vm.getUserName(vm.workOrder.creatorUserId);
                        vm.getAuthorizeName(vm.workOrder.authorizedByUserId);
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            init();
        }
    ]);
