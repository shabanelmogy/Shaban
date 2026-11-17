// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3466
$stateProvider.state('tenant.crs_leaseTariff', {
                url: '/crs/leaseTariff',
                templateUrl: '~/App/tenant/views/crs/tariffGroups/index.cshtml',
                params: { type: 2 },
                menu: 'CRS.TariffCards.Tenant'
            });
