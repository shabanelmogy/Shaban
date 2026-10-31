// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3903
$stateProvider.state('tenant.crs_invoicesAgreementDashboard', {
                url: '/crs/invoices/{filters:json}',
                templateUrl: '~/App/tenant/views/crs/vouchers/invoices/index.cshtml',
                menu: 'CRS.Invoices.Tenant'
            });
