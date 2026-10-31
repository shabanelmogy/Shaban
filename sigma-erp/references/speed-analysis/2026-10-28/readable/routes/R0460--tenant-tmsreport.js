// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4929
$stateProvider.state('tenant.tmsReport', {
            url: '/tmsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/reports/tollReport/report.cshtml',
        });
