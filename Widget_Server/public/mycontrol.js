/*
    mycontrol.js ==> This file is statically served by the express server.
    Third party websites should link to this Angular code for embedding the Chat Widget into their website.
 */

(function(window, angular, undefined){
    angular.module('chatApp',[])
        .controller("chatCtrl",['$scope','$http', function($scope,$http){

            /*
            Sending an HTTP Get request to the server for the widget markup
            code(widget.ejs).

            Response html is stored inside $scope.html variable.
             */

            $http({
                method: 'GET',
                url: 'ServerAddress:port/'  // Address of the server that renders the EJS template.
            }).then(function successCallback(response) {
                $scope.html = response.data;
            }, function errorCallback(response) {
                console.log(response);
            });



            /*
                Variable initialization and methods.
            */


            $scope.newMessage=undefined;
            $scope.messages=[];
            $scope.date = new Date();
            $scope.state = false;
            $scope.user = undefined;
            $scope.askuser = true;
            $scope.username = "yelp";
            $scope.createUser = function(username){
                console.log("user created", username);

            };
            $scope.hideThis = function(){
                $scope.askuser = false;
            };

            $scope.getName = function (message) {
                if(message.username=='Admin')
                    return "messages2";
                return "messages";
            };
            $scope.toggleState = function() {

                $scope.state = !$scope.state;
                console.log("togglestate",$scope.state);
            };



            /*
                Client side code for sending messages to the socket.io server.
            */


            var socket = window.io("http//SocketServerAddress:port/");
           // var socket = window.io("http://localhost:3000/");
            $scope.sendMessage= function () {
                console.log("This is the id:",socket.id);
                var newMessage = {
                    username: $scope.user,
                    message: $scope.newMessage,
                    id : socket.id,
                    response: undefined,
                    code: 0
                }
                socket.emit("new-message",newMessage);
                $scope.newMessage=undefined;
                $scope.messages.push(newMessage);
            };


            socket.on("receive-message",function (msg) {
                console.log(msg.username);
                $scope.$apply(function () {
                    $scope.messages.push(msg);
                });


            });



        }])  // End of controller.



        /*
            Directive for compiling dynamically added HTML.
        */


        .directive('dynamic', function ($compile) {
            return {
                restrict: 'A',
                replace: true,
                link: function (scope, ele, attrs) {
                    scope.$watch(attrs.dynamic, function(html) {
                        ele.html(html);
                        $compile(ele.contents())(scope);
                    });
                }
            };
        }) // End of directive.



        /*
            Directive for DOM manipulation.
         */


        .directive('sidebarDirective', function() {
            return {
                link : function(scope, element, attr) {
                    scope.$watch(attr.sidebarDirective, function(newVal) {
                        if(newVal)
                        {
                            element.addClass('show');
                            return;
                        }
                        element.removeClass('show');
                    });
                }
            };
        }); //End of directive.

        /*
           Manually bootstrapping the angular application after page load.
        */

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['chatApp']);
        });

})(window, window.angular);
