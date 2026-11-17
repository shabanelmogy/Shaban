// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3699
$stateProvider.state('tenant.bookingsReport', {
            url: '/bookingsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/bookings/report.cshtml',
        });
