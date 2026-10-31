// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:26295-26921
appModule.controller('common.views.layout.header', [
        '$rootScope', '$scope', '$interval', '$uibModal', 'appSession', 'appUserNotificationHelper', 'abp.services.app.customerCareTenant', 'abp.services.app.notification', 'abp.services.app.userLink', 'abp.services.app.user', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.twilio',
        function ($rootScope, $scope, $interval, $uibModal, appSession, appUserNotificationHelper, customerCareTenantService, notificationService, userLinkService, userService, utilities, commonLookupService, twilioService) {
            var vm = this;
            vm.conHide = true;
            vm.token = '';
            vm.device = '';
            vm.loadLogo = false;
            var timeCounterCounting = false;
            var timeCounter = 0;
            vm.warningOnChangingBranch = utilities.parseBoolean(abp.setting.get("App.General.WarningOnChangingBranch"));
            vm.getUserTwilioNumber = appSession.user.twilioNumber;
            vm.permissions = {
                incoming: abp.auth.hasPermission('Pages.Twilio.Incoming'),
                outgoing: abp.auth.hasPermission('Pages.Twilio.Outgoing'),
            };
            function initDialPad() {
                if (vm.conHide) {
                    $("#divEndCall").hide();
                    $("#divIncomingCall").hide();
                    $("#acceptcall").hide();
                    $("#blink").hide();
                    $(".lnk").hide();
                    vm.conHide = false;
                }
            };
            //vm.isVisible = function () {
            //    // Use $timeout to delay the evaluation of the expression
            //    return $timeout(function () {
            //        // The expression to evaluate goes here
            //        return $scope.showContent;
            //    }, 100);
            //};



            vm.closeDial = function () {
                $("#modalTwilioDialer").modal('hide');
            };

            vm.dialPadModal = function () {
                initDialPad();
                $("#modalTwilioDialer").modal();
                $(".modal-backdrop.in").remove();
            };

            vm.appendNumber = function (digit) {
                if ($("#txtInsertNo").val().length < 15) {
                    $("#txtInsertNo").val($("#txtInsertNo").val() + digit);
                }
            };

            vm.backspace = function () {
                $("#txtInsertNo").val($("#txtInsertNo").val().substring(0, $("#txtInsertNo").val().length - 1));
            };

            vm.getToken = function () {
                twilioService.makeCall().success(function (result) {
                    vm.token = result;
                    if (result == "")
                        return;
                    vm.device = new Twilio.Device(vm.token, {
                        logLevel: 1,
                        codecPreferences: ["opus", "pcmu"],
                        maxCallSignalingTimeoutMs: 30000,
                        sounds: {
                            incoming: '/Content/Music/iphone-alarm.mp3'
                        }

                    });

                    vm.device.register();
                    if (vm.getUserTwilioNumber != null && vm.getUserTwilioNumber != '' && vm.permissions.incoming) {

                        vm.device.on("incoming", handleIncomingPhoneCall);
                    }
                    function handleIncomingPhoneCall(call) {
                        if (!vm.permissions.outgoing)
                            $("#onDialbtn").show();
                        if (vm.conHide) {
                            $("#divIncomingCall").hide();
                            $("#acceptcall").hide();
                            $("#blink").hide();
                            $(".lnk").hide();
                            vm.conHide = false;
                        }
                        timeCounter = 0;
                        timeCounterCounting = false;
                        $("#blink").show();
                        $("#modalTwilioDialer").modal();
                        $(".modal-backdrop.in").remove();
                        $("#divDialerDigits").hide();
                        $("#divEndCall").hide();
                        $('#divIncomingCall').show();
                        $('#acceptcall').show();
                        $("#txtInsertNo").prop("readonly", true);
                        $('#txtInsertNo').val(call.parameters.From);

                        //var mic = 1;
                        //vm.micMute = function () {
                        //    $("#unmute").toggleClass("fa-microphone-slash").toggleClass("fa-microphone");

                        //    if (mic == 1) {
                        //        call.mute(true);
                        //        mic = 0;
                        //    }
                        //    else {
                        //        call.mute(false);
                        //        mic = 1;
                        //    }
                        //};
                        vm.acceptCall = function () {
                            call.accept();
                            timeCounterCounting = true;
                            timeCounterLoop();
                            $("#blink").hide();
                            $(".lnk").show();
                            $('#divIncomingCall').hide();
                            $('#divEndCall').show();
                        };

                        vm.rejectCall = function () {

                            $("#onDialbtn").hide();
                            timeCounterCounting = false;
                            call.reject();
                            $("#blink").hide();
                            $("#txtInsertNo").val(null);
                            $("#divDialerDigits").show();
                            $('#divIncomingCall').hide();
                            $("#txtInsertNo").prop("readonly", false);
                            if (!vm.permissions.outgoing) {
                                $("#modalTwilioDialer").modal('hide');
                            }
                        };

                        call.on('cancel', () => {

                            $("#onDialbtn").hide();

                            timeCounterCounting = false;
                            $("#txtInsertNo").val(null);
                            $("#divDialerDigits").show();
                            $('#divIncomingCall').hide();
                            $("#txtInsertNo").prop("readonly", false);
                            $(".lnk").hide();
                            $("#blink").hide();
                            if (!vm.permissions.outgoing) {
                                $("#modalTwilioDialer").modal('hide');
                            }
                        });

                        vm.device.on("error", handleCancelPhoneCall);
                        function handleCancelPhoneCall() {

                            $("#onDialbtn").hide();
                            timeCounterCounting = false;
                            $("#txtInsertNo").val(null);
                            $("#divDialerDigits").show();
                            $('#divIncomingCall').hide();
                            $("#blink").hide();
                            $('.ca-status').hide();
                            $(".lnk").hide();
                            $("#txtInsertNo").prop("readonly", false);
                        }
                    }
                });
            };


            vm.endCall = function () {
                vm.device.disconnectAll();
                $("#onDialbtn").hide();

                timeCounterCounting = false;
                timeCounter = 0;
                $('.ca-status').hide();
                $(".lnk").hide();
                $("#blink").hide();
                $("#txtInsertNo").val(null);
                $("#divDialerDigits").show();
                $('#divEndCall').hide();
                $("#txtInsertNo").prop("readonly", false);
                if (!vm.permissions.outgoing) {
                    $("#modalTwilioDialer").modal('hide');
                }
            };

            vm.dialCall = function () {
                if (!(vm.getUserTwilioNumber != null && vm.getUserTwilioNumber != '' && vm.permissions.outgoing)) {
                    alert("You have not permission to outgoing call or you have not assigned the Twilio number.");
                    return;
                }
                var params = {
                    To: $("#txtInsertNo").val()
                };
                if ($("#txtInsertNo").val() != "" && $("#txtInsertNo").val() != null) {
                    timeCounter = 0;
                    $(".lnk").show();


                    const conn = vm.device.connect({ params });

                    //console.log("vm.device:" + vm.device.status());

                    //  var mic = 1;
                    //vm.micMute = function () {
                    //    $("#unmute").toggleClass("fa-microphone-slash").toggleClass("fa-microphone");

                    //    if (mic == 1) {
                    //        conn.mute(true);
                    //        mic = 0;
                    //    }
                    //    else {
                    //        conn.mute(false);txtInsertNo
                    //        mic = 1;
                    //    }
                    //};
                    $("#divDialerDigits").hide();
                    if (!($('#divDialerDigits').is(':visible'))) {

                        $("#blink").show();
                        setTimeout(function () {

                            timeCounterLoop();
                        }, 5000);
                    }

                    timeCounterCounting = true;
                    $("#txtInsertNo").prop("readonly", true);
                    $('#divEndCall').show();
                }
                else {
                    alert("Please dial number first!");
                }
            };

            var timeCounterLoop = function () {

                if (timeCounterCounting) {
                    setTimeout(function () {
                        $("#blink").hide();
                        $('.ca-status').show();
                        //var timeStringSeconds = '';
                        var hour = Math.floor(timeCounter / 3600);
                        var minute = Math.floor((timeCounter - hour * 3600) / 60);
                        var seconds = timeCounter - (hour * 3600 + minute * 60);
                        if (hour < 10)
                            hour = "0" + hour;
                        if (minute < 10)
                            minute = "0" + minute;
                        if (seconds < 10)
                            seconds = "0" + seconds;
                        $('.ca-status').text(hour + ':'+ minute + ':' + seconds);

                        timeCounter += 1;
                        if ($('#txtInsertNo').is('[readonly="false"]')) {
                            timeCounter = 0;
                            $('.ca-status').hide();
                            timeCounterCounting = false;
                        }
                        if ($('#divDialerDigits').is(':visible')) {
                            timeCounter = 0;
                            timeCounterCounting = false;
                            $('.ca-status').hide();
                        }
                        //if ($("#divEndCall").is(":hidden") && $("#divIncomingCall").is(":hidden")) {
                        //    timeCounterCounting = false;
                        //}
                        timeCounterLoop();
                    }, 1000);
                }
                else {
                    $('.ca-status').hide();
                }
            };

            if (appSession.tenant) {
                vm.message = appSession.tenant.message;
            } else {
                var fullUrl = window.location.host;
                //window.location.host is subdomain.domain.com
                var urlParts = fullUrl.split('.');
                var subDomainName = urlParts[1];

                if (subDomainName != null) {
                    if (subDomainName.toLowerCase() == 'carlet') {
                        vm.ImageSrcLogo = "/Common/Images/Carlet-system-logo.png";
                    }
                    else {
                        vm.ImageSrcLogo = "/Common/Images/Speed-system-logo.png";
                    }
                }
                else {
                    vm.ImageSrcLogo = "/Common/Images/Speed-system-logo.png";
                }

            }



            $scope.$on('$includeContentLoaded', function () {
                Layout.initHeader(); // init header
            });

            vm.languages = abp.localization.languages;
            vm.currentLanguage = abp.localization.currentLanguage;
            vm.isImpersonatedLogin = abp.session.impersonatorUserId;
            vm.notifications = [];
            vm.unreadNotificationCount = 0;
            vm.unreadChatMessageCount = 0;
            vm.recentlyUsedLinkedUsers = [];

            vm.tenant = appSession.tenant;
            vm.user = appSession.user;

            //vm.onImageError = function () {
            //    vm.imgError = true;
            //    vm.ImageSrcLogo = "/Common/Images/Speed-system-logo.png"
            //};
            vm.getShownUserName = function () {

                if (!abp.multiTenancy.isEnabled) {
                    return appSession.user.userName;
                } else {
                    if (appSession.tenant) {
                        return appSession.tenant.tenancyName + '\\' + appSession.user.userName;
                    } else {
                        return '.\\' + appSession.user.userName;
                    }
                }
            };

            vm.getShownLinkedUserName = function (linkedUser) {
                return app.getShownLinkedUserName(linkedUser);
            };

            vm.getLocation = function () {
                commonLookupService.getLocations().success(function (result) {
                    vm.locations = result.items;
                    vm.currentLocation = vm.locations.find(location => location.id === appSession.user.locationId);

                    if (appSession.user.branchAccess === 2) {
                        getSelectiveBranches();
                    }

                });
            };

            vm.changeLocation = function (updateLocationId) {
                if (vm.warningOnChangingBranch) {
                    abp.message.confirm(
                        app.localize('WarningMessageForBranchChange'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                userService.updateUserLocation(updateLocationId).success(function () {
                                    window.location.reload();
                                });
                            }
                        }
                    );
                }
                else {
                    userService.updateUserLocation(updateLocationId).success(function () {
                        window.location.reload();
                    });
                }

            };

            vm.editMySettings = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/profile/mySettingsModal.cshtml',
                    controller: 'common.views.profile.mySettingsModal as vm',
                    backdrop: 'static'
                });
            };

            vm.changePassword = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/profile/changePassword.cshtml',
                    controller: 'common.views.profile.changePassword as vm',
                    backdrop: 'static'
                });
            };

            vm.changePicture = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/profile/changePicture.cshtml',
                    controller: 'common.views.profile.changePicture as vm',
                    backdrop: 'static'
                });
            };

            vm.changeLanguage = function (languageName) {
                location.href = abp.appPath + 'CustomAbpLocalization/ChangeCulture?cultureName=' + languageName + '&returnUrl=' + window.location.href;
            };

            vm.backToMyAccount = function () {
                abp.ajax({
                    url: abp.appPath + 'Account/BackToImpersonator'
                });
            }

            vm.loadNotifications = function () {
                notificationService.getUserNotifications({
                    maxResultCount: 3
                }).success(function (result) {
                    vm.unreadNotificationCount = result.unreadCount;
                    vm.notifications = [];
                    $.each(result.items, function (index, item) {
                        vm.notifications.push(appUserNotificationHelper.format(item));
                    });
                });
            }

            vm.setAllNotificationsAsRead = function () {
                appUserNotificationHelper.setAllAsRead();
            };

            vm.setNotificationAsRead = function (userNotification) {
                appUserNotificationHelper.setAsRead(userNotification.userNotificationId);
            }

            vm.openNotificationSettingsModal = function () {
                appUserNotificationHelper.openSettingsModal();
            };

            vm.manageLinkedAccounts = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/common/views/profile/linkedAccountsModal.cshtml',
                    controller: 'common.views.profile.linkedAccountsModal as vm',
                    backdrop: 'static'
                });

                modalInstance.result.finally(function () {
                    vm.getRecentlyUsedLinkedUsers();
                });
            };

            vm.getRecentlyUsedLinkedUsers = function () {
                userLinkService.getRecentlyUsedLinkedUsers()
                    .success(function (result) {
                        vm.recentlyUsedLinkedUsers = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.checkIfImageExist = function () {
                //vm.ImageSrcLogo
                vm.tenancyName = appSession.tenant.tenancyName;
                vm.logoFileName = vm.tenancyName.toLowerCase() + '-' + 'logo.png';
                vm.filePath = "/App/images/tenantImages/" + vm.logoFileName;
                var fullUrl = window.location.host;
                //window.location.host is subdomain.domain.com
                var urlParts = fullUrl.split('.');
                var subDomainName = urlParts[1];
                if (subDomainName != null) {
                    if (subDomainName.toLowerCase() == 'carlet') {
                        vm.logoPath = "/Common/Images/Carlet-system-logo.png";
                    }
                    else {
                        vm.logoPath = "/Common/Images/Speed-system-logo.png";
                    }
                } else {
                    vm.logoPath = "/Common/Images/Speed-system-logo.png";
                }
                userLinkService.checkIfImageExist(vm.filePath.slice(1))
                    .success(function (result) {
                        vm.loadLogo = result ? true : false;

                        vm.ImageSrcLogo = vm.loadLogo ? vm.filePath : vm.logoPath;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.switchToUser = function (linkedUser) {
                abp.ajax({
                    url: abp.appPath + 'Account/SwitchToLinkedAccount',
                    data: JSON.stringify({
                        targetUserId: linkedUser.id,
                        targetTenantId: linkedUser.tenantId
                    })
                });
            };

            vm.showLoginAttempts = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/users/loginAttemptsModal.cshtml',
                    controller: 'common.views.users.loginAttemptsModal as vm',
                    backdrop: 'static'
                });
            };

            abp.event.on('abp.notifications.received', function (userNotification) {
                appUserNotificationHelper.show(userNotification);
                vm.loadNotifications();
            });

            abp.event.on('app.notifications.refresh', function () {
                vm.loadNotifications();
            });

            abp.event.on('app.notifications.read', function (userNotificationId) {
                for (var i = 0; i < vm.notifications.length; i++) {
                    if (vm.notifications[i].userNotificationId == userNotificationId) {
                        vm.notifications[i].state = 'READ';
                    }
                }

                vm.unreadNotificationCount -= 1;
            });
            ////Chat
            //abp.event.on('app.chat.unreadMessageCountChanged', function (messageCount) {
            //    vm.unreadChatMessageCount = messageCount;
            //});

            function updateLastLoginTime() {

                
                userService.updateLastLoginTime()
                    .success(function () {
                    });

                if (appSession.tenant) {

                    if ((!appSession.user.isActive || !appSession.tenant.isActive) && appSession.user.userName !="SpeedSupport") {

                        window.location.href = "/Account/Logout";
                    }

                }
                
            }

            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                });
            }
            vm.getLanguage = function () {
                vm.languages = abp.localization.languages;
                angular.forEach(vm.languages, function (value, key) {
                    value.displayName = value.displayName.replace("(Egypt)", "");

                });
                if (vm.currentLanguage.name == 'ar-EG') {
                    vm.currentLanguage.displayName = vm.currentLanguage.displayName.replace("(Egypt)", "");
                }
                var fullUrl = window.location.host;
                //window.location.host is subdomain.domain.com
                var urlParts = fullUrl.split('.');
                var subDomainName = urlParts[1];
                if (subDomainName != null) {
                    if (subDomainName.toLowerCase() == 'carlet') {
                        vm.languages = vm.languages.filter(lang => lang.name == 'en' || lang.name == 'ar-EG');


                    }
                }
            };

            function getServiceDelayType(type) {
                if (type == 1)
                    return "Warning";
                else if (type == 2)
                    return "Slow Down Service";
                else if (type == 3)
                    return "Stop Service";
            }

            vm.slaMessage = "";
            var slaIntervalPromise = null;

            function getSLAMessage() {
                if (appSession.tenant !== null) {
                    customerCareTenantService.getActiveSla()
                        .success(function (response) {
                            vm.slaMessage = "";
                            if (response.success) {
                                if (response.result && response.result.isPaymentDelay == true && response.result.paymentDelayType != 3) {
                                    vm.slaMessage = getServiceDelayType(response.result.paymentDelayType) + ": " + response.result.paymentDelayMessage;
                                }
                            }
                        }).error(function () {
                            vm.slaMessage = "";
                        });
                }
            }

            // start polling
            slaIntervalPromise = $interval(getSLAMessage, 21600000);

            $scope.$on('$destroy', function () {
                if (slaIntervalPromise) {
                    $interval.cancel(slaIntervalPromise);
                }
            });

            function init() {

                vm.loadNotifications();
                if (appSession.tenant !== null) {
                    vm.getLocation();
                }
                vm.getLanguage();

                if (!vm.tenant)
                    vm.getToken();

                vm.getRecentlyUsedLinkedUsers();
                if (appSession.tenant)
                    vm.checkIfImageExist();


            }

            init();
            updateLastLoginTime();
            getSLAMessage();

        }
    ]);
