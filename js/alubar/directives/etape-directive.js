var app = angular.module('alubar-app');

app.directive('etape', function($compile){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            test: '='
        },
        template: '<div class="state">{{test}}</div>',
        link: function(scope, element, attrs){
            jsPlumb.draggable(element, {
                containment: $('#plumbing-zone'),
                stop: function(event) {
                    if(scope.$parent.documentSaved){
                        scope.$parent.documentSaved = false;
                        scope.$parent.documentName = scope.$parent.documentName + "*";
                        scope.$parent.documentSaveState = "btn-warning";
                        scope.$parent.$apply();
                    }
                    
                }
            });
        }
    };
});