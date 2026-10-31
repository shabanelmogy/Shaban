// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4022
$stateProvider.state('tenant.vehiclesReport', {
            url: '/vehiclesReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/vehicles/report.cshtml',
        });
