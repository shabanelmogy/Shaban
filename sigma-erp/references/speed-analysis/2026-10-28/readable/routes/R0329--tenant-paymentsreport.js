// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3890
$stateProvider.state('tenant.paymentsReport', {
            url: '/paymentsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/vouchers/payments/report.cshtml',
        });
