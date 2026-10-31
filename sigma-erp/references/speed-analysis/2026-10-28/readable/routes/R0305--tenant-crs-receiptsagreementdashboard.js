// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3713
$stateProvider.state('tenant.crs_receiptsAgreementDashboard', {
                url: '/crs/receipts/{filters:json}',
                templateUrl: '~/App/tenant/views/crs/vouchers/receipts/index.cshtml',
                menu: 'CRS.Receipts.Tenant'
            });
