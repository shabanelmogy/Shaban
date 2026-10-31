// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:187233-187347
appModule.controller('tenant.views.crs.coupons.printTemplates.printPreview', [
        '$scope', 'appSession', 'filters', '$uibModalInstance', 'abp.services.app.coupon',
        function ($scope, appSession, filters, $uibModalInstance, couponAppService) {

            var vm = this;
            vm.filters = filters;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.couponIds = [];
            vm.ids = [];

            if (vm.filters) {
                if (!isNaN(vm.filters.id)) {
                    vm.couponIds.push({ id: vm.filters.id, printHeader: vm.filters.printHeader });
                    vm.ids.push(vm.filters.id);
                } else {
                    var printHeader = vm.filters.printHeader;
                    var couponIds = vm.filters.ids;
                    vm.ids = vm.filters.ids;
                    couponIds.forEach(function (value) {
                        vm.couponIds.push({ id: value, printHeader: printHeader });
                    });
                    //in case of only one id
                    if (vm.couponIds.length == 2) {
                        if (vm.couponIds[1] == "") { vm.couponIds.splice(1, 1); vm.ids.splice(1, 1); }
                    }

                }
            }


            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.close(vm.ids);
            };

            vm.getTemplateUrl = function () {

                var template = abp.features.getValue('CRS.Coupons.PrintTemplate');//.toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template.toLowerCase() == 'custom')
                    return '~/App/tenant/views/crs/coupons/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template.toLowerCase() == 'englisharabic')
                    return '~/App/tenant/views/crs/coupons/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/coupons/printTemplates/' + template + '.cshtml';
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };
            function customizeCopuponForPrint() {
                var customArray = [];
                customArray = vm.coupons;
                var arrayLength = customArray.length;
                recordsPerPage = 4;
                var noOfPages = arrayLength / recordsPerPage;
                vm.pagesData = [];
                for (var i = 0; i < noOfPages; i++) {
                    var subArray = [];
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;
                    subArray = customArray.slice(start, end);
                    vm.pagesData.push({
                        pageNo: i + 1,
                        coupondataToIterate: subArray
                    })
                }
            }
            vm.print = function () {
                debugger;
                abp.message.confirm(
                    app.localize('PrintWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            debugger;
                            couponAppService.markCouponsPrinted(vm.ids).success(function () {
                                abp.notify.success("Coupons marked as printed successfully");
                            });
                        }
                        setTimeout(function () {
                            window.print()
                        }, 1000);
                    }
                );
            }

            vm.init = function () {
                couponAppService.getCouponsForPrint(
                    vm.ids
                ).success(function (result) {
                    vm.coupons = result;
                    customizeCopuponForPrint();
                }).finally(function () {
                    vm.loading = false;
                    //vm.getLabels();
                });
            }
            vm.init();

        }
    ]);
