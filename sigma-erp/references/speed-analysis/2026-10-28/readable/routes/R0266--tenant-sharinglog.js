// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3424
$stateProvider.state('tenant.sharingLog', {
                    url: '/fuel/sharingLog',
                    templateUrl: '~/App/tenant/views/fuel/dataSharing/sharingLog.cshtml',
                    params: {
                        dataToShare: 5
                    },
                    menu: 'FuelDataMangement.sharingLog.Tenant'
                });
