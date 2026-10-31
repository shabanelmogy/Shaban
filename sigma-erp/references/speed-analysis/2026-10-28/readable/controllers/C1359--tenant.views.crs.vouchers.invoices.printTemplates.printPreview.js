// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:366072-366273
appModule.controller('tenant.views.crs.vouchers.invoices.printTemplates.printPreview', [
        '$scope', 'appSession', 'filters', 'previewVoucher', '$uibModalInstance', 'exportWord', 'isArabic', 'exportPrintToWord',
        function ($scope, appSession, filters, previewVoucher, $uibModalInstance, exportWord, isArabic, exportPrintToWord) {

            var vm = this;
            vm.filters = filters;
            vm.allowAgreementDocsPrintingWithInvoice = abp.features.isEnabled("CRS.CustomFeatures.PrintAgreementDocWithInvoice");
            vm.allowInvoiceDocsPrintingWithInvoice = abp.features.isEnabled("CRS.CustomFeatures.PrintInvoiceDocWithInvoice");
            vm.invoicePrintToWordExport = exportPrintToWord;
            vm.exportWord = exportWord;
            vm.previewVoucher = previewVoucher;
            vm.isArabic = isArabic;
            vm.invoiceIds = [];
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.logoUrl = window.location.origin + '/App/images/tenantImages/' + vm.fileName;
            if (previewVoucher) {
                vm.invoiceIds.push({ id: null, printHeader: true, printDetails: true });
            }
            if (vm.filters) {
                if (!isNaN(vm.filters.id)) {
                    vm.invoiceIds.push({ id: vm.filters.id, printHeader: vm.filters.printHeader, printDetails: vm.filters.printDetails });
                } else {
                    var printHeader = vm.filters.printHeader;
                    var printDetails = vm.filters.printDetails;
                    var invoiceIds = vm.filters.ids;
                    invoiceIds.forEach(function (value) {
                        vm.invoiceIds.push({ id: value, printHeader: printHeader, printDetails: printDetails });
                    });
                    //in case of only one id
                    if (vm.invoiceIds.length == 2) {
                        if (vm.invoiceIds[1] == "")
                            vm.invoiceIds.splice(1, 1);
                    }

                }
            }
            vm.exportToPDF = function () {
                // Temporarily change the page title
                var originalTitle = document.title;
                document.title = vm.filters.voucherNo || 'Document';

                // Trigger the print dialog
                window.print();

                // Restore the original page title after a short delay
                setTimeout(function () {
                    document.title = originalTitle;
                }, 1000); // Adjust the delay as needed
            };
            vm.exportToWord = function () {


                if (!window.Blob) {
                    alert('Your legacy browser does not support this action.');
                    return;
                }

                var html, link, blob, url, css;

                // EU A4 use: size: 841.95pt 595.35pt;
                // US Letter use: size:11.0in 8.5in;

                css = (
                    '<style>' +
                    'table{border-collapse:collapse;}td{border:1px solid;width:25em;padding:1px;}' +
                    '</style>'
                );

                html = window.docx.innerHTML;
                blob = new Blob(['\ufeff', css + html], {
                    type: 'application/msword'
                });
                url = URL.createObjectURL(blob);
                link = document.createElement('A');
                link.href = url;
                // Set default file name. 
                // Word will append file extension - do not add an extension here.
                link.download = 'Document';
                document.body.appendChild(link);
                if (navigator.msSaveOrOpenBlob) navigator.msSaveOrOpenBlob(blob, 'Document.doc'); // IE10-11
                else link.click();  // other browsers
                document.body.removeChild(link);


            };
            function convertImgToBase64(url, callback) {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function () {
                    var maxWidth = 600; // maximum width in pixels
                    var maxHeight = 90; // maximum height in pixels (matches your CSS)

                    var ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
                    var canvas = document.createElement('canvas');
                    canvas.width = img.width * ratio;
                    canvas.height = img.height * ratio;

                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    var dataURL = canvas.toDataURL('image/png');
                    callback(dataURL);
                };
                img.src = url;
            }

            vm.exportPrintToWord = function () {
                if (!window.Blob) {
                    alert('Your legacy browser does not support this action.');
                    return;
                }

                var element = document.querySelector('.portlet.light');
                var clonedElement = element.cloneNode(true);

                // Remove Angular attributes
                clonedElement.querySelectorAll('[ng-if], [ng-show], [ng-hide]').forEach(el => el.removeAttribute('ng-if'));

                // Convert logo to base64 first
                convertImgToBase64(vm.logoUrl, function (base64Logo) {
                    // Replace <img> src in cloned element
                    var imgTag = clonedElement.querySelector('img');
                    if (imgTag) {
                        imgTag.setAttribute('src', base64Logo);
                        imgTag.setAttribute('width', '600');  // matches canvas maxWidth
                        imgTag.setAttribute('height', '90');  // matches canvas maxHeight
                        imgTag.removeAttribute('ng-src');
                    }
                     

                    // Word HTML structure
                    var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                        "xmlns='http://www.w3.org/TR/REC-html40'>" +
                        "<head><meta charset='utf-8'><title>Invoice</title></head><body>";

                    var footer = "</body></html>";
                    var html = header + clonedElement.outerHTML + footer;

                    var blob = new Blob(['\ufeff', html], { type: 'application/msword' });
                    var url = URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = 'Invoice.doc';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            $scope.$on('nameChanged', function (event, value) {
                vm.printDocumentsWithInvoice = value;
            });
            $scope.$on('nameChanged', function (event, value) {
                vm.printInvoiceDocumentsWithInvoice = value;
            });
            $scope.$on('nameChanged', function (event, value) {
                vm.chargesTypeWiseSummary = value;
            });
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.ok = function () {
                $uibModalInstance.close(vm.previewVoucher);
            };

            vm.getTemplateUrl = function () {
                if (vm.exportWord) {

                    return '~/App/tenant/views/crs/vouchers/invoices/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + 'ExportWord.cshtml';
                }

                if (vm.invoicePrintToWordExport) {

                    return '~/App/tenant/views/crs/vouchers/invoices/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + 'ExportWord.cshtml';
                }

                if (vm.isArabic) {
                    return '~/App/tenant/views/crs/vouchers/invoices/printTemplates/tenants/almasoodArabic.cshtml';
                }

                var template = abp.features.getValue('CRS.Vouchers.Invoices.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/invoices/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/invoices/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/invoices/printTemplates/' + template + '.cshtml';

            };



        }
    ]);
