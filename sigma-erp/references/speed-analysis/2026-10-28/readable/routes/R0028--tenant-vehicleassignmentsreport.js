// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:1591
$stateProvider.state('tenant.vehicleAssignmentsReport', {
            url: '/vehicleAssignmentsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/fms/vehicleAssignments/report.cshtml',
            menu: 'fms.VehicleAssignment'
        });
