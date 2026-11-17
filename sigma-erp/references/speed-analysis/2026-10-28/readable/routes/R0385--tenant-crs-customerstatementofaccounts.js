// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4311
$stateProvider.state('tenant.crs_customerStatementOfAccounts', {
                url: '/crs/customerStatementOfAccounts',
                templateUrl: '~/App/tenant/views/crs/reports/statementOfAccounts/index.cshtml',
                params: {
                    contactType: 2
                },
                menu: 'CRS.StatementOfAccounts.Tenant'
            });
