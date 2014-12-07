// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('chatApplication', ['ionic','chat.application.controllers','openfb','chat.application.services','chat.application.directives'])

/*.run(function($ionicPlatform,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $state.go('home');
  });
})*/
.run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {

       OpenFB.init('322553731283560','http://localhost:8100/oauthcallback.html', window.localStorage);

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
          if (toState.name !== "home" && toState.name !== "logout" && !$window.sessionStorage['fbtoken']) {
                $state.go('app.login');
                event.preventDefault();
            }
        });

        $rootScope.$on('OAuthException', function() {
           $state.go('home');
        });
       $state.go('home');
    })

.config(['$stateProvider',function($stateProvider){
        $stateProvider.state('home',{
            url:'/home',
            controller:'HomeController',
            templateUrl:'views/home.html'
        }).state('chat',{
            url:'/chat',
            controller:'ChatController',
            templateUrl:'views/chat.html'
        })
        .state('chatPage',{
            url:'/chatPage',
            controller:'ChatPageController',
            templateUrl:'views/chatPage.html'
        });
}]);