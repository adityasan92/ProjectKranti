angular.module('chat.application.directives',[]).directive('browseFile',['$rootScope','USER',function($rootScope,USER){
    return {
        scope:{

        },
        replace:true,
        restrict:'AE',
        link:function(scope,elem,attrs){

            scope.browseFile=function(){
                document.getElementById('browseBtn').click();
            }

            angular.element(document.getElementById('browseBtn')).on('change',function(e){

               var file=e.target.files[0];

               angular.element(document.getElementById('browseBtn')).val('');

               var fileReader=new FileReader();

               fileReader.onload=function(event){
                   $rootScope.$broadcast('event:file:selected',{image:event.target.result,sender:USER.name});
               }

               fileReader.readAsDataURL(file);
            });

        },
        templateUrl:'views/browse-file.html'
    }
}]).directive('chatList',['$rootScope','SOCKET_URL',function($rootScope,SOCKET_URL){
    return{
        replace:true,
        restrict:'AE',
        scope:{

        },
        link:function(scope,elem,attrs){

            var socket=io(SOCKET_URL);

            scope.messages=[];
            
            scope.post=function(){
                document.getElementById('message').click();
            }

            angular.element(document.getElementById('message')).on('change',function(e){

               var file=e.target.files[0];
               $rootScope.$broadcast('chat message',{image:event.target.result,sender:USER.name});
               angular.element(document.getElementById('message')).val('');

               var fileReader=new FileReader();

               fileReader.onload=function(event){
                   $rootScope.$broadcast('event:file:selected',{image:event.target.result,sender:USER.name});
               }

               fileReader.readAsDataURL(file);
            });

            $rootScope.$on('event:file:selected',function(event,data){

                socket.emit('event:new:image',data);

                scope.$apply(function(){
                    scope.messages.unshift(data);
                });

            });
            $rootScope.$on('chat message',function(event,data){

                socket.emit('chat message',data);

                scope.$apply(function(){
                    scope.messages.unshift(data);
                });

            });

            socket.on('event:incoming:image',function(data){

                scope.$apply(function(){
                    scope.messages.unshift(data);
                });

            });

        },
        templateUrl:'views/chat-list.html'
    }
}]);