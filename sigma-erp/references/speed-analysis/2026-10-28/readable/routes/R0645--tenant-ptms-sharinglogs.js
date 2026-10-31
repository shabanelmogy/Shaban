// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6381
$stateProvider.state('tenant.PTMS__SharingLogs', {
                    url: '/ptms/parkInSharingLogs',
                    templateUrl: '~/App/tenant/views/ptms/dataSharingLogs/sharingLog.cshtml',
                    params: {
                        dataToShare: 2
                    },
                    menu: 'PTMS.SharingLogs.Tenant'
                });
