// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4934
$stateProvider.state('tenant.tfmsReport', {
            url: '/tfmsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/reports/finesReport/report.cshtml',
        });
