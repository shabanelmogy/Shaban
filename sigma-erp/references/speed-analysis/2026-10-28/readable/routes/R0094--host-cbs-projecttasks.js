// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:2081
$stateProvider.state('host.cbs_projectTasks', {
                url: '/projectTasks/{filters:json}',
                templateUrl: '~/App/host/views/cbs/tasks/index.cshtml',
                //menu: 'CBS.ProjectTasks.Host'
            });
