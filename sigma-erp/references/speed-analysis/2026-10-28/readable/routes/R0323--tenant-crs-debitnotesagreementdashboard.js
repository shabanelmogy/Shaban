// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3850
$stateProvider.state('tenant.crs_debitNotesAgreementDashboard', {
                url: '/crs/debitNotes/{filters:json}',
                templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/index.cshtml',
                menu: 'CRS.DebitNotes.Tenant'
            });
