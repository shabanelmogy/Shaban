// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:67166-67307
appModule.controller('host.views.crm.proposal.printModal', ['$stateParams', '$sce', 'appSession', 'abp.services.app.proposal', 'abp.services.app.commonLookup', 'utilities',
        function ($stateParams, sce, appSession, proposalService, commonLookupService, utilities) {
            var vm = this;
            var proposalId = 0;
           

            //no Qatar police
            var featureKeys = ['CRS.Rental', 'CRS.Lease', 'CRS.Accounts', 'MCC', 'CRS.Tolls.Salik', 'CRS.Fines.AbuDhabiPolice', 'CRS.Fines.DubaiPolice','CRS.Fines.Qatar', 'CRS.Transportation','CRS.Limo'];
            vm.proposalPrintFeatureData = null;
            vm.inScopeTrueValue = [];
            if (!isNaN($stateParams.query)) {
                proposalId = $stateParams.query;
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

            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };


            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name;
                });
            };

            vm.featureDataForViewOnly = function () {
                var featureValues = [];
                var features = [];
                featureValues = vm.proposal.proposalDetail.featureData.featureValues.filter(e => e.value == 'true')
                featureValues.forEach(function (value) {
                    features.push(vm.proposal.proposalDetail.featureData.features.filter(r => r.name == value.name)[0]);
                });
                vm.proposalPrintFeatureData = {
                    features: features,
                    featureValues: featureValues
                };
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



            vm.licenceName = function (id) {
                var licenceArr = [
                    { id: 1, name: 'Perpetual' },
                    { id: 2, name: 'Monthly Subscription' }
                ];

                var result = licenceArr.filter(r => r.id == id);

                if (result.length == 0) {
                    return null;
                }
                else {
                    return result[0].name;
                }
            };


            vm.getTrueInScopeValues = function () {

                featureKeys.forEach(function (value) {
                    var matchedValues = vm.proposal.proposalDetail.featureData.featureValues.filter(e => e.name == value && e.value == 'true');
                   
                    if (matchedValues.length > 0) {
                        vm.inScopeTrueValue.push(matchedValues[0]);
                    }
                   
                });
                //only once data must be there about below three
               // 'CRS.Fines.AbuDhabiPolice', 'CRS.Fines.DubaiPolice', 'CRS.Fines.Qatar'

                var isDubaiPoliceExist = vm.inScopeTrueValue.filter(r => r.name == "CRS.Fines.DubaiPolice");
                var isAbuDhabiPoliceExist = vm.inScopeTrueValue.filter(r => r.name == "CRS.Fines.AbuDhabiPolice");
                var isQatarExist = vm.inScopeTrueValue.filter(r => r.name == "CRS.Fines.Qatar");
                if (isDubaiPoliceExist.length > 0) {
                    vm.inScopeTrueValue = vm.inScopeTrueValue.filter(r => r.name != 'CRS.Fines.AbuDhabiPolice');
                    vm.inScopeTrueValue = vm.inScopeTrueValue.filter(r => r.name != 'CRS.Fines.Qatar');
                }
                else if (isAbuDhabiPoliceExist.length > 0) {
                    vm.inScopeTrueValue = vm.inScopeTrueValue.filter(r => r.name != 'CRS.Fines.Qatar');
                    vm.inScopeTrueValue = vm.inScopeTrueValue.filter(r => r.name != 'CRS.Fines.DubaiPolice');
                }
                else if (isQatarExist.length > 0) {
                    vm.inScopeTrueValue = vm.inScopeTrueValue.filter(r => r.name != 'CRS.Fines.AbuDhabiPolice');
                    vm.inScopeTrueValue = vm.inScopeTrueValue.filter(r => r.name != 'CRS.Fines.DubaiPolice');
                }

            };


            function init() {
                {
                    debugger;
                    vm.loading = true;
                    proposalService.getProposalForPrint({
                        id: proposalId
                    }).success(function (result) {
                        vm.proposal = result;
                        vm.getTrueInScopeValues();
                        vm.featureDataForViewOnly();
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
            init();
        }
    ]);
