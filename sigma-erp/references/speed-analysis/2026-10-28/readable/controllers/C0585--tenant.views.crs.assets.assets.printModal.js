// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:161269-161349
appModule.controller('tenant.views.crs.assets.assets.printModal', ['$scope', '$stateParams', '$sce', 'appSession', 'abp.services.app.asset', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, sce, appSession, assetService, commonLookupService, utilities) {
            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            var assetId = 0;
            // vm.userName = appSession.user.name;
            vm.userName = '';
            vm.amount = 0;
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.currencyName = abp.setting.get("App.General.CurrencyName");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.tollLenth = 0;
            vm.trn = '';

            //if pop-up print
            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.assetId)
                    assetId = $scope.$parent.vmMain.assetId;
            }

            //if through url print
            if (assetId == 0 && !isNaN($stateParams.query)) {
                assetId = $stateParams.query;
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            vm.getlocalDateTimeForEngAr = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };

            function init() {
                {
                    vm.loading = true;
                    assetService.getAssetForEdit({
                        id: assetId
                    }).success(function (result) {
                        vm.asset = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            init();

        }
    ]);
