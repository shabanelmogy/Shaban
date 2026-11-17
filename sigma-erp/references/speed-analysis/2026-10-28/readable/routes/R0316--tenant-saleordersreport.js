// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3798
$stateProvider.state('tenant.saleOrdersReport', {
            url: '/saleOrdersReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/vouchers/saleOrders/report.cshtml',
        });
