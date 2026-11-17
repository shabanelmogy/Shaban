// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:46940-47034
appModule.controller('host.views.cbs.releasenotes.index',[
        '$scope', '$stateParams', '$uibModal', 'abp.services.app.release', 'abp.services.app.taskDetail', 'appSession', 'utilities',
        function ($scope, $stateParams, $uibModal, releaseService, taskDetailService, appSession, utilities) {
                var vm = this;
                vm.release = { releaseTasks: [] };
                vm.releaseId = 0;
                vm.released = false;
                vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
                if ($stateParams.query !="")
                {
                    vm.releaseId = parseInt($stateParams.query)
                }
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.exportReleaseNotes = function () {
                    var tab_text = "<table border='1px'><tr>";
                    var textRange;
                    var j = 0;
                    var tab1 = document.getElementById("tblSubsReport").cloneNode(true); // id of table
                    // Getting the rows in table.
                    var row = tab1.rows;

                    // Removing the column at index(1).  
                    var i = 4;
                   
                    for (j = 0; j < tab1.rows.length; j++) {

                        tab_text = tab_text;
                        tab_text = tab_text + tab1.rows[j].innerHTML + "</tr>";
                        console.log(tab1.rows[j].innerHTML);

                    }
                    tab_text = tab_text + "</table>";


                    var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                    var blobUrl = URL.createObjectURL(blob);


                    var a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = 'ReleaseNotes.xls';
                    a.click();

                };
                function b64toBlob(b64Data, contentType, sliceSize) {
                    contentType = contentType || '';
                    sliceSize = sliceSize || 512;

                    var byteCharacters = atob(b64Data);
                    var byteArrays = [];

                    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        var slice = byteCharacters.slice(offset, offset + sliceSize);

                        var byteNumbers = new Array(slice.length);
                        for (var i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        var byteArray = new Uint8Array(byteNumbers);

                        byteArrays.push(byteArray);
                    }

                    var blob = new Blob(byteArrays, { type: contentType });
                    return blob;
                }

               
                //vm.addEditRelease = function (status, taskId) {
                //    taskDetailService.addRemoveRelease(taskId, vm.releaseId, status);
                //};
                //vm.save = function () {
                //    vm.loading = true;
                //    releaseService.editRelease(vm.release).success(function (result) {

                //        $uibModalInstance.close();
                //        abp.notify.info(app.localize('SavedSuccessfully'));
                //        vm.loading = false;
                //    });
                //};



                function init() {
                    taskDetailService.getReleaseTasks(vm.releaseId).success(function (data) {
                        vm.release = data;
                        vm.released = vm.release.isReleased;
                        vm.Count = data.releaseTasks.length;
                    });
                }
                init();
            }
        ]);
