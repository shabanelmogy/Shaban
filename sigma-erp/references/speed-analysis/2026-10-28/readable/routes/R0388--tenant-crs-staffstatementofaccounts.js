// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4341
$stateProvider.state('tenant.crs_staffStatementOfAccounts', {
                url: '/crs/staffStatementOfAccounts',
                templateUrl: '~/App/tenant/views/crs/reports/statementOfAccounts/index.cshtml',
                params: {
                    contactType: 1
                },
                menu: 'CRS.StatementOfAccounts.Tenant'
            });
