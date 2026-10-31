// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:110763-111008
appModule.controller('tenant.views.common.signaturePads.wacom.signatureModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.document','agreement',
        function ($scope, $uibModal, $uibModalInstance, documentService, agreement) {
            var vm = this;
            var signatureReason = app.localize('AgreementNo') + ': ' + agreement.agreementNo;
            vm.base64SignatureImage = null;
            var wgssSignatureSDK = null;
            function printDetail(txt) {

                var ul = document.getElementById("txtDisplay");
                var li = document.createElement("li");

                var txtDisplay = document.getElementById("txtDisplay");
                if ("CLEAR" == txt) {
                    txtDisplay.value = "";
                }
                else {
                    li.appendChild(document.createTextNode(txt));
                    if (ul)
                        ul.appendChild(li);

                }
            }
            function OnLoad(callback) {

                restartSession(callback);
            }
            function restartSession(callback) {

                wgssSignatureSDK = null;
                sigObj = null;
                sigCtl = null;
                dynCapt = null;
                var imageBox = document.getElementById("imageBox");
                if (imageBox && null != imageBox.firstChild) {
                    imageBox.removeChild(imageBox.firstChild);
                }
                var timeout = setTimeout(timedDetect, 1500);
                // pass the starting service port  number as configured in the registry

                wgssSignatureSDK = new WacomGSS_SignatureSDK(onDetectRunning, 8000);

                function timedDetect() {
                    if (wgssSignatureSDK.running) {
                        printDetail("Signature SDK Service detected.");
                        start();
                    }
                    else {
                        printDetail("Signature SDK Service not detected.");
                    }
                }


                function onDetectRunning() {
                    if (wgssSignatureSDK.running) {
                        printDetail("Signature SDK Service detected.");
                        clearTimeout(timeout);
                        start();
                    }
                    else {
                        printDetail("Signature SDK Service not detected.");
                    }
                }

                function start() {
                    if (wgssSignatureSDK.running) {
                        sigCtl = new wgssSignatureSDK.SigCtl(onSigCtlConstructor);
                    }
                }

                function onSigCtlConstructor(sigCtlV, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        // For production code remove dynCapt creation
                        // Enable PutLicence call and replace 'licence_string' with your licence string
                        //dynCapt = new wgssSignatureSDK.DynamicCapture(onDynCaptConstructor);
                        sigCtl.PutLicence("AgAkAMlv5nGdAQVXYWNvbQ1TaWduYXR1cmUgU0RLAgOBAgJkAACIAwEDZQA", onSigCtlPutLicence);
                    }
                    else {
                        printDetail("SigCtl constructor error: " + status);
                    }
                }

                function onSigCtlPutLicence(sigCtlV, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        dynCapt = new wgssSignatureSDK.DynamicCapture(onDynCaptConstructor);
                    }
                    else {
                        printDetail("SigCtl constructor error: " + status);
                    }
                }

                function onDynCaptConstructor(dynCaptV, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        sigCtl.GetSignature(onGetSignature);
                    }
                    else {
                        printDetail("DynCapt constructor error: " + status);
                    }
                }

                function onGetSignature(sigCtlV, sigObjV, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        sigObj = sigObjV;
                        sigCtl.GetProperty("Component_FileVersion", onSigCtlGetProperty);
                    }
                    else {
                        printDetail("SigCapt GetSignature error: " + status);
                    }
                }

                function onSigCtlGetProperty(sigCtlV, property, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        printDetail("DLL: flSigCOM.dll  v" + property.text);
                        dynCapt.GetProperty("Component_FileVersion", onDynCaptGetProperty);
                    }
                    else {
                        printDetail("SigCtl GetProperty error: " + status);
                    }
                }

                function onDynCaptGetProperty(dynCaptV, property, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        printDetail("DLL: flSigCapt.dll v" + property.text);
                        printDetail("Test application ready.");
                        printDetail("Press 'Capture' to get a signature.");
                        if ('function' === typeof callback) {
                            callback();
                        }
                    }
                    else {
                        printDetail("DynCapt GetProperty error: " + status);
                    }
                }
            }
            function Capture() {

                if (!wgssSignatureSDK.running || null == dynCapt) {
                    printDetail("Session error. Restarting the session.");
                    restartSession(window.Capture);
                    return;
                }
                dynCapt.Capture(sigCtl, agreement.customer.name, signatureReason, null, null, onDynCaptCapture);

                function onDynCaptCapture(dynCaptV, SigObjV, status) {
                    if (wgssSignatureSDK.ResponseStatus.INVALID_SESSION == status) {
                        printDetail("Error: invalid session. Restarting the session.");
                        restartSession(window.Capture);
                    }
                    else {
                        if (wgssSignatureSDK.DynamicCaptureResult.DynCaptOK != status) {
                            printDetail("Capture returned: " + status);
                        }
                        switch (status) {
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptOK:
                                sigObj = SigObjV;
                                printDetail("Signature captured successfully");
                                var flags = wgssSignatureSDK.RBFlags.RenderOutputBase64 |
                                            wgssSignatureSDK.RBFlags.RenderColor32BPP | wgssSignatureSDK.RBFlags.RenderBackgroundTransparent;
                                var imageBox = document.getElementById("imageBox");
                                sigObj.RenderBitmap("png", imageBox.clientWidth, imageBox.clientHeight, 0.7, 0x00000000, 0x00FFFFFF, flags, 0, 0, onRenderBitmapBase64);
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptCancel:
                                printDetail("Signature capture cancelled");
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptPadError:
                                printDetail("No capture service available");
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptError:
                                printDetail("Tablet Error");
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptIntegrityKeyInvalid:
                                printDetail("The integrity key parameter is invalid (obsolete)");
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptNotLicensed:
                                printDetail("No valid Signature Capture licence found");
                                break;
                            case wgssSignatureSDK.DynamicCaptureResult.DynCaptAbort:
                                printDetail("Error - unable to parse document contents");
                                break;
                            default:
                                printDetail("Capture Error " + status);
                                break;
                        }
                    }
                }

                function onRenderBitmapBase64(sigObjV, bmpObj, status) {
                    if (wgssSignatureSDK.ResponseStatus.OK == status) {
                        printDetail("base64_image:>" + bmpObj + "<");
                        img = new Image();
                        img.src = "data:image/png;base64," + bmpObj;
                        vm.base64SignatureImage = bmpObj;
                        if (null == imageBox.firstChild) {
                            imageBox.appendChild(img);
                        }
                        else {
                            imageBox.replaceChild(img, imageBox.firstChild);
                        }
                    }
                    else {
                        printDetail("Signature Render Bitmap error: " + status);
                    }
                }

            }

            vm.capture = function () {
                Capture();
            };
            vm.saveImage = function () {

                vm.saving = true;

                if (vm.base64SignatureImage) {
                    documentService.uploadDocumentImage({
                        imageBase64String: vm.base64SignatureImage,
                    }).success(function (result) {
                        $uibModalInstance.close({ guid: result.guid, url: result.url, urlWithToken: result.urlWithToken, documentType: 6 });
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    vm.saving = false;
                }
            };

            OnLoad();
            vm.showDetail = function () {
                vm.logDetailShow = false;
                vm.logDetailHide = true;
                vm.showLogData = true;

            }
            vm.hideDetail = function () {
                vm.logDetailShow = true;
                vm.logDetailHide = false;
                vm.showLogData = false;

            }
            vm.hideDetail();
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
