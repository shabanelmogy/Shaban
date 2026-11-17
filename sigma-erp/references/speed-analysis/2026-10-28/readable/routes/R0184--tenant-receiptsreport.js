// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:2843
$stateProvider.state('tenant.receiptsReport', {
            url: '/receiptsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/vouchers/receipts/report.cshtml',
        });
