// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4351
$stateProvider.state('tenant.crs_sprintStatementOfAccount', {
            url: '/printStatementOfAccount/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/reports/statementOfAccounts/printTemplates/print.cshtml',
            //menu: 'CBS.ProjectTasks.Host'
        });
