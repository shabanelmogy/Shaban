// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:1722
$stateProvider.state('tenant.crs_customerStatementOfAccountConsolidated', {
                url: '/crs/customerStatementOfAccountConsolidated',
                templateUrl: '~/App/tenant/views/crs/reports/statementOfAccountConsolidated/index.cshtml',
                params: {
                    contactType: 2
                },
                menu: 'CRS.StatementOfAccountConsolidated.Tenant'
            });
