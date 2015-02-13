var app = angular.module('alubar-app');

app.directive('pathedcomponent', function($compile){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            path: '='
        },
        template: '<div class="dropped-component"><div class="custom" collapse="!inputVisible"><input ng-model="path" ></input></div></div>',
        link: function(scope, element, attrs){
            scope.inputVisible = false;
            
            $(element).dblclick(function(event){
                console.log("Collapsing");
                scope.inputVisible = !scope.inputVisible;
                scope.$apply();
            });
        }
    };
});