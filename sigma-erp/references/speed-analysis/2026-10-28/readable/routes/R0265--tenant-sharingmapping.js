// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3414
$stateProvider.state('tenant.sharingMapping', {
                    url: '/fuel/sharingMapping',
                    templateUrl: '~/App/tenant/views/fuel/dataSharing/sharingMapping.cshtml',
                    menu: 'FuelDataMangement.sharingMapping.Tenant',
                    params: {
                        dataType: 5
                    }
                });
