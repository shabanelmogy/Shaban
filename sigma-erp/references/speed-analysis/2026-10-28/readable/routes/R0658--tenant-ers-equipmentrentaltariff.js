// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6494
$stateProvider.state('tenant.ers_equipmentRentalTariff', {
                url: '/ers/equipmentRentalTariff',
                templateUrl: '~/App/tenant/views/crs/tariffGroups/index.cshtml',
                params: { type: 7 },
                menu: 'CRS.TariffGroups.Tenant'
            });
