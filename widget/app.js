(function (angular, buildfire) {
    'use strict';
    //created mediaCenterWidget module
    angular
        .module('mediaCenterWidget', [
            'mediaCenterEnums',
            'mediaCenterServices',
            'mediaCenterFilters',
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'infinite-scroll'
        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        //ngClipboard to provide copytoclipboard feature
        .config(['$routeProvider', function ($routeProvider) {

            /**
             * Disable the pull down refresh
             */
                //buildfire.datastore.disableRefresh();

            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetHome',
                    controller: 'WidgetHomeCtrl',
                    resolve: {
                        MediaCenterInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location',
                            function ($q, DB, COLLECTIONS, Orders, Location) {
                                var deferred = $q.defer();
                                var MediaCenter = new DB(COLLECTIONS.MediaCenter);
                                var _bootstrap = function () {
                                    MediaCenter.save({
                                        content: {
                                            images: [],
                                            descriptionHTML: '',
                                            description: '',
                                            sortBy: Orders.ordersMap.Newest,
                                            rankOfLastItem: 0
                                        },
                                        design: {
                                            listLayout: "list-1",
                                            itemLayout: "item-1",
                                            backgroundImage: ""
                                        }
                                    }).then(function success() {
                                        Location.goToHome();
                                    }, function fail(error) {
                                        throw (error);
                                    })
                                }
                                MediaCenter.get().then(function success(result) {
                                        if (result && result.data) {
                                            deferred.resolve(result);
                                        }
                                        else {
                                            //error in bootstrapping
                                            _bootstrap(); //bootstrap again  _bootstrap();
                                        }
                                    },
                                    function fail(error) {
                                        throw (error);
                                    }
                                );
                                return deferred.promise;
                            }]
                    }
                })
                .when('/media/:mediaId', {
                    templateUrl: 'templates/media.html',
                    controllerAs: 'WidgetMedia',
                    controller: 'WidgetMediaCtrl',
                    resolve: {
                        media: ['$q', 'DB', 'COLLECTIONS', 'Location', '$route', function ($q, DB, COLLECTIONS, Location, $route) {
                            var deferred = $q.defer();
                            var MediaContent = new DB(COLLECTIONS.MediaContent);
                            if ($route.current.params.mediaId) {
                                MediaContent.getById($route.current.params.mediaId).then(function success(result) {
                                        if (result && result.data) {
                                            deferred.resolve(result);
                                        }
                                        else {
                                            Location.goToHome();
                                        }
                                    },
                                    function fail() {
                                        Location.goToHome();
                                    }
                                );
                            }
                            else {
                                Location.goToHome();
                            }
                            return deferred.promise;
                        }]
                    }
                })
                .when('/media', {
                    templateUrl: 'templates/media.html',
                    controllerAs: 'WidgetMedia',
                    controller: 'WidgetMediaCtrl',
                    resolve: {
                        media: function () {
                            return null;
                        }
                    }
                })
                .otherwise('/');
        }])


})(window.angular, window.buildfire);