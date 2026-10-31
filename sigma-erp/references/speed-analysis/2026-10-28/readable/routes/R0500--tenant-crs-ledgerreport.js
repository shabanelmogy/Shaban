// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:5243
$stateProvider.state('tenant.crs_ledgerReport', {
                url: '/crs/ledgerReport/{filters:json}',
                templateUrl: '~/App/tenant/views/crs/accounting/ledger/index.cshtml',
                menu: 'CRS.Accounts.Ledger.Tenant'
            });
