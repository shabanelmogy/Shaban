// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6041
$stateProvider.state('tenant.printDashbordFines', {
                url: '/printDashbordFines/{filters:json}',
                templateUrl: '~/App/tenant/views/tms/dashboard/printFines.cshtml',
            });
