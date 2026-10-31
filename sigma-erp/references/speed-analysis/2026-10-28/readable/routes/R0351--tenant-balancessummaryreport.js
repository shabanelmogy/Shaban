// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4051
$stateProvider.state('tenant.balancesSummaryReport', {
            url: '/balancesSummaryReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/reports/outStandingReport/report.cshtml',
        });
