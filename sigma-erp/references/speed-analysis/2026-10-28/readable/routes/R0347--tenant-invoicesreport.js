// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4033
$stateProvider.state('tenant.invoicesReport', {
            url: '/invoicesReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/vouchers/invoices/report.cshtml',
        });
