// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3750
$stateProvider.state('tenant.purchaseOrderReport', {
            url: '/purchaseOrderReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrder/report.cshtml',
        });
