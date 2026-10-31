// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6413
$stateProvider.state('tenant.POS_customerStatementOfAccounts', {
                url: '/pos/customerStatementOfAccounts',
                templateUrl: '~/App/tenant/views/crs/reports/statementOfAccounts/index.cshtml',
                params: {
                    contactType: 2
                },
                menu: 'POS.StatementOfAccounts.Tenant'
            });
