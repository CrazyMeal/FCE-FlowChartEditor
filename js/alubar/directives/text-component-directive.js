var app = angular.module('alubar-app');

app.directive('textcomponent', function($compile, $sanitize){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            text: '='
        },
        template: '<div class="dropped-component text-zone-dropped"><div ng-show="!editingText" ng-bind-html="text">{{text}}</div><textarea ng-show="editingText" ng-model="text"></textarea></div>',
        link: function(scope, element, attrs){
            scope.editingText = false;
            console.log($sanitize(scope.text));
            //element.html($sanitize(scope.text));

            $(element).dblclick(function(event){
                console.log("double click on text component");
                scope.editingText = !scope.editingText;
                if(scope.editingText){
                    scope.text = scope.text.replace(/<br \/>/g, '\n');
                } else {
                    scope.text = scope.text.replace(/\n/g, '<br />');
                }
                
                scope.$apply();
            });
        }
    };
});

app.filter('breakFilter', function () {
    return function (text) {
        if (text !== undefined) return text.replace(/\n/g, '<br />');
    };
});