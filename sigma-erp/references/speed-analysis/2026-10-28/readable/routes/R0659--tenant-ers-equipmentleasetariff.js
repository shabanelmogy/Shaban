// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6511
$stateProvider.state('tenant.ers_equipmentLeaseTariff', {
                url: '/ers/equipmentLeaseTariff',
                templateUrl: '~/App/tenant/views/crs/tariffGroups/index.cshtml',
                params: { type: 8 },
                menu: 'CRS.TariffGroups.Tenant'
            });
