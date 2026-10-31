// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6155
$stateProvider.state('tenant.TMS_shareParkingTicketsLogs', {
                    url: '/parking/sharingLog',
                    templateUrl: '~/App/tenant/views/tms/e-parking/dataSharingLog/sharingLog.cshtml',
                    params: {
                        dataToShare: 8
                    },
                    menu: 'TMS.Tolls.DataSharingParkingLogs.Tenant'
                });
