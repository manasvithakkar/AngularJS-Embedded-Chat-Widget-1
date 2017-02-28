(function(window, angular, undefined){
    angular.module('chatAdmin',[])
        .controller("adminController",['$scope', function($scope){


            $scope.disvar=undefined;
            $scope.newMessage=undefined;
            $scope.messages=[];
            $scope.clients = [];
            $scope.response = undefined;
            $scope.heading = undefined;
            var socket = window.io("serverAddr:port/admin");
            $scope.notEmptyOrNull = function(item){
                return !(item === null || item.length === 0)
            }
            socket.on("receive-message",function (msg) {
                console.log("received at admin",msg);
                $scope.$apply(function () {
                    if(!$scope.messages[parseInt(msg.code)])
                        $scope.messages[parseInt(msg.code)] = [];
                    $scope.messages[parseInt(msg.code)].push(msg);
                    $scope.clients.push(msg.id);
                });


            });

            socket.on("user-disconnected",function (code) {
                console.log("disconnected ",code);
                $scope.$apply(function () {
                    $scope.messages[code]=null;
                });


            });
            $scope.getMsg = function() {
                return $scope.messages[$scope.disvar];
            }

            $scope.getName = function (message) {

                if(message.username=='Admin')
                    return "messages2";
                return "messages";
            };
            $scope.sendRes= function (res) {
                var replyMessage = { username: "Admin",
                                     message: res,
                                     client: $scope.messages[$scope.disvar][0].id
                                    };
                $scope.messages[$scope.disvar].push({username: "Admin", message: res});

                socket.emit("reply-from-admin",replyMessage);


            };
            $scope.displayChat = function(code){
                $scope.disvar = code;
                $scope.heading = $scope.messages[$scope.disvar].username;

            };

        }])

})(window, window.angular);

