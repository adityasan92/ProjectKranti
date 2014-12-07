
angular.module('chat.application.controllers',[]).controller('HomeController',['$scope','USER','$state','$location','OpenFB',function($scope,USER,$state,$location, OpenFB){
    $scope.user={};
    $scope.next=function(){
    	 if($scope.user.name == "aditya" && $scope.user.password == "kranti"||$scope.user.name == "sugata" && $scope.user.password == "kranti"){
        USER.name=$scope.user.name;
        $state.go('chatPage');
     }
    };
    $scope.fbLogin=function(){
    	 OpenFB.login('email,read_stream,publish_actions').then(
                function () {
                   $location.path('/chatPage');
                   $state.go('chatPage');
                },
                function () {
                    alert('OpenFB login failed');
                });
    };
     $scope.logout = function () {
            OpenFB.logout();
            $state.go('home');
     };
}]).controller('ChatPageController',['$scope','USER','$rootScope','SOCKET_URL',function($scope,USER,$rootScope,SOCKET_URL){

    
    $scope.msgs=[];
    
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
  	
  	});
  
}]);