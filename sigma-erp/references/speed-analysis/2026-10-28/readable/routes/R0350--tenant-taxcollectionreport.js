// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4046
$stateProvider.state('tenant.taxCollectionReport', {
            url: '/taxCollectionReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/reports/taxCollections/report.cshtml',
        });
