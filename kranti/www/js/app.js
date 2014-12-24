// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
	angular.module('chatApplication', ['ionic','chat.application.controllers','ngCookies','chat.application.services','chat.application.directives','ngRoute','ngResource'])
.run(function($ionicPlatform,$state) {
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