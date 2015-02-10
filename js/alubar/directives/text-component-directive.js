var app = angular.module('alubar-app');

app.directive('textcomponent', function($compile){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            text: '='
        },
        template: '<div class="dropped-component text-zone-dropped"><p ng-show="!editingText">{{text}}</p><textarea ng-show="editingText" ng-model="text"></textarea></div>',
        link: function(scope, element, attrs){
            scope.editingText = false;
            $(element).dblclick(function(event){
                console.log("double click on text component");
                scope.editingText = !scope.editingText;
                scope.$apply();
            });
        }
    };
});