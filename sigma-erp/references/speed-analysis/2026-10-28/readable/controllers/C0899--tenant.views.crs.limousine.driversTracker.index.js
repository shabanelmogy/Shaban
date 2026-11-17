// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:243867-244218
appModule.controller('tenant.views.crs.limousine.driversTracker.index', [
        '$scope', 'abp.services.app.firebaseAuth', 'abp.services.app.commonLookup', '$filter',
        function ($scope, firebaseAuthService, commonLookupService, $filter) {
            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            var markersArray = [];
            var selectedMarker = null;

            var onlineIcon = {
                url: "/App/images/online.png",
            };

            var busyIcon = {
                url: "/App/images/busy.png",
            };

            var onRideIcon = {
                url: "/App/images/onride.png",
            };

            var offLineIcon = {
                url: "/App/images/offline.png",
            };

            var locationIcon = {
                url: "/App/images/currentLocationIcon.png", // url
            };

            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                commonLookupService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };

            vm.getDriversSummary = function () {

                var online = 0, busy = 0, offline = 0, onRide = 0;
                if (markersArray.length > 0) {
                    markersArray.forEach(function (marker) {
                        if (marker.userData.status == 1)
                            online++;
                        else if (marker.userData.status == 2)
                            busy++;
                        else if (marker.userData.status == 3)
                            offline++;
                        else if (marker.userData.status == 4)
                            onRide++;
                    });
                }
                return { total: markersArray.length, online: online, busy: busy, offline: offline, onRide: onRide };
            };

            function getstatus(status) {

                if (status == 1)
                    return 'Online';
                else if (status == 2)
                    return 'Busy';
                else if (status == 3)
                    return 'Offline';
                else
                    return 'On Ride';
            };

            vm.userChanged = function () {

                markersArray.forEach(function (marker) {
                    if (vm.user.userName == marker.userKey) {
                        map.setCenter(marker.position);
                        infoWindow.setContent('<b>' + marker.userData.name + '</b> <br/>' + getstatus(marker.userData.status) + '<br/>' + vm.getlocalDateTime(marker.userData.dateTime));
                        infoWindow.open(map, marker);
                        selectedMarker = marker;
                    }
                });
            };

            function myMap() {

                infoWindow = new google.maps.InfoWindow;

                pos = {
                    lat: '',
                    lng: ''
                }
                //   Try HTML5 geolocation.
                if (navigator.geolocation) {

                    navigator.geolocation.getCurrentPosition(function (position) {
                        pos.lat = position.coords.latitude;
                        pos.lng = position.coords.longitude;
                        drawMap();
                    }, function (error) {
                        var latLong;
                        $.getJSON("https://ipinfo.io", function (ipinfo) {
                            console.log("Found location [" + ipinfo.loc + "] by ipinfo.io");
                            latLong = ipinfo.loc.split(",");
                            pos.lat = parseFloat(latLong[0]);
                            pos.lng = parseFloat(latLong[1]);
                            drawMap();
                        });
                    }, { timeOut: 5000 });
                }
            }

            function drawMap() {

                map = new google.maps.Map(document.getElementById('googleMap'), {
                    zoom: 13,
                    center: new google.maps.LatLng(pos.lat, pos.lng),
                    mapTypeId: 'roadmap',
                });
                map.setCenter(pos);
                addYourLocationButton(map);
                var marker = new google.maps.Marker({
                    position: pos,
                    icon: locationIcon,
                    map: map
                });
            }

            function initFireBase(config, tokenAndStartingNode) {
                if (!firebase.apps.length)
                {
                    firebase.initializeApp(config);
                    signInWithToken(tokenAndStartingNode);
                }
                else
                {
                    firebase.app().delete().then(function () {
                        firebase.initializeApp(config); 
                        signInWithToken(tokenAndStartingNode);
                    });
                }
                
            }

            function signInWithToken(tokenAndStartingNode) {

                firebase.auth().signInWithCustomToken(tokenAndStartingNode.token).then(function (data) {

                    var quicklimo = firebase.database().ref().child(tokenAndStartingNode.startingNode);
                    quicklimo.on('child_changed', valueChanged);
                    quicklimo.on('child_removed', valueRemoved);
                    quicklimo.on('child_added', valueAdded);
                    myMap();
                }).catch(function (error) {

                    // handle errors here.
                    var errorcode = error.code;
                    var errormessage = error.message;
                    // ...
                });

            }

            function valueAdded(snapshot) {

                var key = snapshot.key;
                var dataAdded = snapshot.val();
                var markerIcon = null;

                if (snapshot.val().status == 1)
                    markerIcon = onlineIcon;
                else if (snapshot.val().status == 2)
                    markerIcon = busyIcon;
                else if (snapshot.val().status == 3)
                    markerIcon = offLineIcon;
                else
                    markerIcon = onRideIcon;

                var markerAdded = new google.maps.Marker({
                    position: new google.maps.LatLng(snapshot.val().lat, snapshot.val().lon),
                    title: snapshot.val().name,
                    icon: markerIcon,
                    map: map,
                    userKey: key,
                    userData: snapshot.val()
                });

                google.maps.event.addListener(markerAdded, 'click', function () {
                    infoWindow.setContent('<b>' + snapshot.val().name + '</b> <br/>' + getstatus(snapshot.val().status) + '<br/>' + vm.getlocalDateTime(snapshot.val().dateTime));
                    infoWindow.open(map, this);
                    selectedMarker = markerAdded;
                });
                google.maps.event.addListener(infoWindow, 'closeclick', function () {

                    selectedMarker = null;
                });
                markersArray.push(markerAdded);
                $scope.$apply();
            }

            function valueChanged(snapshot) {

                var key = snapshot.key;
                var changedMarker = $filter('filter')(markersArray, {
                    userKey: key
                }, true);

                if (changedMarker.length == 1) {
                    var newLatLng = new google.maps.LatLng(snapshot.val().lat, snapshot.val().lon);

                    if (snapshot.val().status == 1)
                        changedMarker[0].icon = onlineIcon;
                    else if (snapshot.val().status == 2)
                        changedMarker[0].icon = busyIcon;
                    else if (snapshot.val().status == 3)
                        changedMarker[0].icon = offLineIcon;
                    else
                        changedMarker[0].icon = onRideIcon;

                    changedMarker[0].userData = snapshot.val();
                    changedMarker[0].title = changedMarker[0].userData.name;
                    changedMarker[0].setPosition(newLatLng);

                    google.maps.event.addListener(changedMarker[0], 'click', function () {
                        infoWindow.setContent('<b>' + changedMarker[0].userData.name + '</b> <br/>' + getstatus(changedMarker[0].userData.status) + '<br/>' + vm.getlocalDateTime(changedMarker[0].userData.dateTime));
                        infoWindow.open(map, this);
                    });

                    if (selectedMarker != null) {
                        if (selectedMarker.userKey == changedMarker[0].userKey) {
                            infoWindow.setContent('<b>' + changedMarker[0].userData.name + '</b> <br/>' + getstatus(changedMarker[0].userData.status) + '<br/>' + vm.getlocalDateTime(changedMarker[0].userData.dateTime));
                            map.setCenter(newLatLng);
                        }
                    }
                }

                $scope.$apply();
            }

            function valueRemoved(snapshot) {
                var key = snapshot.key;
                var indexOfRemovedMarker = null;

                for (i = 0; i < markersArray.length; i++) {
                    if (key == markersArray[i].userKey) {
                        markersArray[i].setMap(null);
                        indexOfRemovedMarker = i;
                        break;
                    }
                }
                markersArray.splice(indexOfRemovedMarker, 1)
                $scope.$apply();
            }

            function addYourLocationButton(map) {
                var controlDiv = document.createElement('div');

                var firstChild = document.createElement('button');
                firstChild.style.backgroundColor = '#fff';
                firstChild.style.border = 'none';
                firstChild.style.outline = 'none';
                firstChild.style.width = '28px';
                firstChild.style.height = '28px';
                firstChild.style.borderRadius = '2px';
                firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
                firstChild.style.cursor = 'pointer';
                firstChild.style.marginRight = '10px';
                firstChild.style.padding = '0';
                firstChild.title = 'Your Location';
                controlDiv.appendChild(firstChild);

                var secondChild = document.createElement('div');
                secondChild.style.margin = '5px';
                secondChild.style.width = '18px';
                secondChild.style.height = '18px';
                secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
                secondChild.style.backgroundSize = '180px 18px';
                secondChild.style.backgroundPosition = '0 0';
                secondChild.style.backgroundRepeat = 'no-repeat';
                firstChild.appendChild(secondChild);

                google.maps.event.addListener(map, 'center_changed', function () {
                    secondChild.style['background-position'] = '0 0';
                });

                firstChild.addEventListener('click', function () {
                    var imgX = 0,
                        animationInterval = setInterval(function () {
                            imgX = -imgX - 18;
                            secondChild.style['background-position'] = imgX + 'px 0';
                        }, 500);

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            map.setCenter(latlng);
                            clearInterval(animationInterval);
                            secondChild.style['background-position'] = '-144px 0';
                        }, function (error) {
                            var latLong;
                            $.getJSON("https://ipinfo.io", function (ipinfo) {
                                console.log("Found location [" + ipinfo.loc + "] by ipinfo.io");
                                latLong = ipinfo.loc.split(",");
                                var lat = parseFloat(latLong[0]);
                                var lng = parseFloat(latLong[1]);
                                var latlng2 = new google.maps.LatLng(lat, lng);
                                map.setCenter(latlng2);
                                clearInterval(animationInterval);
                                secondChild.style['background-position'] = '-144px 0';

                            });
                        }, { timeOut: 5000 });
                    } else {
                        clearInterval(animationInterval);
                        secondChild.style['background-position'] = '0 0';
                    }
                });

                controlDiv.index = 1;
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
            }

            function init() {
                vm.loading = true;
                firebaseAuthService.getToken().success(function (data) {
                    initFireBase({
                        apiKey: data.apiKey,
                        authDomain: data.authDomain,
                        databaseURL: data.databaseUrl,
                        projectId: data.projectId,
                        storageBucket: data.storageBucket
                    }, { token: data.token, startingNode: data.startingNode });

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
             //myMap();


        }
    ]);
