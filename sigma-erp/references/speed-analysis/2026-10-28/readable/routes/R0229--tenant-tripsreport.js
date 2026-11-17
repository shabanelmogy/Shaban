// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3145
$stateProvider.state('tenant.tripsReport', {
            url: '/tripsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/limousine/trips/report.cshtml',
        });
