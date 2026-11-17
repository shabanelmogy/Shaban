// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4331
$stateProvider.state('tenant.crs_supplierStatementOfAccounts', {
                url: '/crs/supplierStatementOfAccounts',
                templateUrl: '~/App/tenant/views/crs/reports/statementOfAccounts/index.cshtml',
                params: {
                    contactType: 3
                },
                menu: 'CRS.StatementOfAccounts.Tenant'
            });
