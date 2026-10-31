// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3220
$stateProvider.state('tenant.mcc_movements', {
                url: '/mcc/movements/:plateNo',
                templateUrl: '~/App/tenant/views/mcc/movements/index.cshtml',
                menu: 'MCC.Movements.Tenant'
            });
