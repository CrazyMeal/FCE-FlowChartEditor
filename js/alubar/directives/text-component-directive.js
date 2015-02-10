var app = angular.module('alubar-app');

app.directive('textcomponent', function($compile){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            text: '='
        },
        template: '<div class="dropped-component">{{text}}</div>',
        link: function(scope, element, attrs){
            
        }
    };
});