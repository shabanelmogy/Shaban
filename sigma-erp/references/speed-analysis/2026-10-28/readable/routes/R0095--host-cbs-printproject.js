// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:2089
$stateProvider.state('host.cbs_printProject', {
                url: '/printProject/{filters:json}',
                templateUrl: '~/App/host/views/cbs/projects/printProject.cshtml',
                //menu: 'CBS.ProjectTasks.Host'
            });
