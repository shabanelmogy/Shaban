// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3871
$stateProvider.state('tenant.assetsReport', {
            url: '/assetsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/assets/assets/report.cshtml',
        });
