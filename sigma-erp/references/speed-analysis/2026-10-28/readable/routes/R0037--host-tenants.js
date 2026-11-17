// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:1650
$stateProvider.state('host.tenants', {
                url: '/tenants?filterText',
                templateUrl: '~/App/host/views/tenants/index.cshtml',
                menu: 'Tenants'
            });
