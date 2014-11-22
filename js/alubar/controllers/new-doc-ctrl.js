var app = angular.module('alubar-app');
app.controller('NewDocCtrl', function($scope){
    $scope.init = function() {
        jsPlumb.bind("ready", function() {
            console.log("Set up jsPlumb listeners (should be only done once)");
            jsPlumb.bind("connection", function (info) {
                $scope.$apply(function () {
                    console.log("Possibility to push connection into array");
                });
            });
        });
    };
});