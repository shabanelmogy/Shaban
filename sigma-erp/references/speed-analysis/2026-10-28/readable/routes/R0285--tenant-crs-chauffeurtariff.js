// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3577
$stateProvider.state('tenant.crs_chauffeurTariff', {
                    url: '/crs/chauffeurTariff',
                    templateUrl: '~/App/tenant/views/crs/chauffeur/tariffs/index.cshtml',
                    //templateUrl: '~/App/tenant/views/crs/tariffGroups/index.cshtml',
                    //params: { type: 4 },
                    menu: 'CRS.TariffGroups.Tenant'
                });
