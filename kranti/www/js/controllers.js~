
angular.module('chat.application.controllers',[]).controller('HomeController',['$scope','USER','$state','$location','$rootScope','Auth',function($scope,USER,$state,$location,$rootScope,Auth){
   $scope.user={};

    
    $scope.next=function(){
    	USER.name=$scope.user.email;
       Auth.login('password', {
          'email': $scope.user.email,
          'password': $scope.user.password
        },
        function(err) {
          //$scope.errors = {};

          if (!err) {
            //$location.path('/bloglist');
            $state.go('mainPage');
            console.log('success');
          } else {
           
			           console.log('error');
            /*angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
            $scope.error.other = err.message;*/
          }
      });
       
    };
    $scope.signup = function(){
     
			$state.go('signUp');
	};
  
}]).controller('ChatPageController',['$scope','USER','$rootScope','SOCKET_URL',function($scope,USER,$rootScope,SOCKET_URL){

    
    /*$scope.msgs=[];
    
   var socket = io(SOCKET_URL);
    
   $scope.sender = USER.name;
	$scope.post=function(){
 		 console.log($scope.sender);
		 //socket.emit('user name', $scope.sender);
	 	 socket.emit('send message',{message:$scope.chatData,user:$scope.sender});
	    $scope.chatData='';
	}

   socket.on('get message', function(data){
 		console.log(data);
   	$scope.msgs.push(data);
   	$scope.$digest();
  });
  socket.on('load old messages',function(docs){
		
		for(var i=0; i<docs.length; i++){
			$scope.msgs.push(docs[i]);
			$scope.$digest();
		}
  	
  	});*/
  
}]).controller('signUpController', function ($scope, Auth, $location) {
    $scope.register = function(form) {
      Auth.createUser({
          email: $scope.user.email,
          username: $scope.user.username,
          password: $scope.user.password
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            $location.path('/');
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
          }
        }
      );
    };
  }).controller('BlogsCtrl', function ($scope, Blogs, $location, $rootScope, $cookieStore,$stateParams, Chat, Chat2) {

    $scope.create = function() {
      var blog = new Blogs({
        title: this.title,
        content: this.content,
        creator:$rootScope.currentUser._id
      });
      blog.$save(function(response) {
       // $location.path("blogs/" + response._id);
       $location.path('/bloglist');
      });

      this.title = "";
      this.content = "";
    };

    $scope.remove = function(blog) {
      blog.$remove();

      for (var i in $scope.blogs) {
        if ($scope.blogs[i] == blog) {
          $scope.blogs.splice(i, 1);
        }
      }
    };

    $scope.update = function() {
      var blog = $scope.blog;
      blog.$update(function() {
        $location.path('blogs/' + blog._id);
      });
    };

    $scope.find = function() {
      Blogs.query(function(blogs) {
        $scope.blogs = blogs;
      });
    };
    
	$scope.chatTransfer = function(){
		var userId = $rootScope.currentUser._id; 
		 
		Chat2.get({userId: $rootScope.currentUser._id, blogId:$stateParams.blogId},function(chatt){
		console.log(chatt[0]);
		if(chatt[0] == 'n' && chatt[1] == 'u' && chatt[2] == 'l' && chatt[3] == 'l' ){
		
			console.log('chat is not there');
			 var chat = new Chat({
       	 creator: $rootScope.currentUser,
          blogId: $stateParams.blogId
     		 });
     		 
      	chat.$save(function(response) {
      	console.log('chat Save');
      	
        	$location.path("chat/"  +response._id);
      	});
			
			}else{
				$location.path("chat/"  +chatt._id);
			}
		});		 

	};
	
    $scope.findOne = function() {
    	
      Blogs.get({
        blogId: $stateParams.blogId
      }, function(blog) {
      	console.log(blog);
        $scope.blog = blog;
      });
    };
  }).controller('ChatController', function($scope, $rootScope, SOCKET_URL, $stateParams, Chat){
  	 
  	 $scope.msgs=[];
    
   var socket = io(SOCKET_URL);
   
	$scope.loadMessages = function(){
		   Chat.query({chatId: $stateParams.chatId},function(mess) {
      	console.log('The message load method is working');
      	console.log(mess);
      	for(var i =0; i< mess.length; i++){
      		console.log(mess[i].mess);
      		console.log(mess[i].name);
      		$scope.msgs.push({message:mess[i].mess,username:mess[i].name});
      	}
      	//$scope.chatBlogs = chat;
       // $scope.chatBlogs.push(chat);
	
      });
		
	
	};   
   
  	$scope.post=function(){
 		 console.log($scope.chatData);
		 //socket.emit('user name', $scope.sender);
	 	 socket.emit('chatMessage',{message:$scope.chatData,username:$rootScope.currentUser.username,chatId:$stateParams.chatId, userId:$rootScope.currentUser._id });
	    $scope.chatData='';
	}
  	socket.on('privateMessage', function(data){
 		console.log(data);
 		
   	$scope.msgs.push(data);
   	$scope.$digest();
  });
  	
  }).controller('MainPageController', function($scope, $rootScope, SOCKET_URL,$stateParams,Chat,$location, Chat2){
  //$scope.chatBlogs=[];
  var socket = io(SOCKET_URL);
  	$scope.findChat = function() {
  		socket.emit('newUser',{username:$rootScope.currentUser.username});
      Chat.query({userId:$rootScope.currentUser._id},function(chat) {
        console.log(chat);
        $scope.chats = chat;
      });
    };
  	
  	$scope.allBlogs = function(){
  		$location.path('/bloglist');
  		};
  		
  		$scope.findBlog = function() {
  		
      Chat2.query({usrId:$rootScope.currentUser._id},function(chat) {
      	console.log('Its on BTW AHHAHAHAHA');
      	console.log(chat);
      	 $scope.chatBlogs = chat;
       // $scope.chatBlogs.push(chat);
	
      });
    };
  		
  	});
  	