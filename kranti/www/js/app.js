// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
	angular.module('chatApplication', ['ionic','chat.application.controllers','ngCookies','chat.application.services','chat.application.directives','ngRoute','ngResource'])
.run(function($ionicPlatform,$state,$rootScope, $location, Auth) {
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
    //watching the value of the currentUser variable.
    $rootScope.$watch('currentUser', function(currentUser) {
      // if no currentUser and on a page that requires authorization then try to update it
      // will trigger 401s if user does not have a valid session
      if (!currentUser && (['/', '/login', '/signup'].indexOf($location.path()) == -1 )) {
        Auth.currentUser();
      }
    });

    // On catching 401 errors, redirect to the login page.
    $rootScope.$on('event:auth-loginRequired', function() {
      $location.path('/login');
      return false;
    });
})
.config(['$stateProvider','$routeProvider',function($stateProvider, $routeProvider){
        $stateProvider.state('home',{
            url:'/',
            controller:'HomeController',
            templateUrl:'views/home.html'
        }).state('mainPage',{
            url:'mainPage',
            controller:'MainPageController',
            templateUrl:'views/main.html'
        }).state('chat',{
            url:'/chat/:chatId',
            controller:'ChatController',
            templateUrl:'views/chat.html'
        })
        .state('chatPage',{
            url:'/chatPage',
            controller:'ChatPageController',
            templateUrl:'views/chatPage.html'
        })
        .state('signUp',{
 		  		url:'/signup',
 		  		controller:'signUpController',
 		  		templateUrl:'views/signUp.html'	       	
        	})
        	.state('bloglist',{
        	  url:'/bloglist',
        	  controller:'BlogsCtrl',
        	  templateUrl: 'views/bloglist.html'
        	})
        	.state('blogs/create',{
        	   url:'/blogcreate',
        	  controller:'BlogsCtrl',
        	  templateUrl: 'views/blogcreate.html'
        		
        	})
        	.state('blogs/:blogId', {
        		url:'/blogs/:blogId',
        		controller:'BlogsCtrl',
        		templateUrl:'views/blogview.html'
        		
        	});
          
}]);