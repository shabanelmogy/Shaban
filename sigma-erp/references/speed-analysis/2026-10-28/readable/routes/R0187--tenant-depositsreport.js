// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:2858
$stateProvider.state('tenant.depositsReport', {
            url: '/depositsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/vouchers/deposits/report.cshtml',
        });
