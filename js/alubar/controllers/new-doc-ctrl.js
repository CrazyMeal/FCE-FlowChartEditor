var app = angular.module('alubar-app');

app.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}]);

app.controller('NewDocCtrl', function($scope){
    $scope.documentName = "Nouveau Document";
    $scope.documentSaved = true;
    $scope.states = [];
    $scope.documentSaveState = "btn-success";

    setStateCss = function(state, e){
        state.container.css({
            'top': e.pageY- $('#plumbing-zone').offset().top,
            'left': e.pageX - $('#plumbing-zone').offset().left
        });
    };

    $scope.saveDocument = function(){
        $scope.documentSaved = true;
        $scope.documentName = $scope.documentName.substring(0, $scope.documentName.length - 1);;
        $scope.documentSaveState = "btn-success";
    };

    $scope.createNewState = function(){
        var mainContainer = $('<div>').attr('id', 'state' + $scope.states.length).addClass('state');
        
        var connectInDiv = $('<div>').addClass('connectIn');
        var connectOutDiv = $('<div>').addClass('connectOut');
        mainContainer.append(connectInDiv);
        mainContainer.append(connectOutDiv);
        
        var state = {
            container: mainContainer,
            input: connectInDiv,
            output: connectOutDiv
        };

        $scope.states.push(state);
        return state;
    };
    $scope.makeTarget = function(input){
        jsPlumb.makeTarget(input, {
            anchor: ['Continuous',{ faces:[ "left","top","bottom" ] }],
            endpoint:"Dot",
            paintStyle:{ 
                strokeStyle:"#7AB02C",
                fillStyle:"transparent",
                radius:7,
                lineWidth:3 
            },              
            isSource:true,
            connector:[ "Flowchart", { stub:[20, 40], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],                                              
            dragOptions:{}
        });
    };

    $scope.makeSource = function(output){
        jsPlumb.makeSource(output, {
            anchor: ['Continuous',{ faces:[ "right" ] }],
            endpoint:"Dot",                 
            paintStyle:{ fillStyle:"#7AB02C",radius:11 },
            maxConnections:-1,
            connector:[ "Flowchart", { stub:[20, 40], gap:10, midpoint: 0.7, cornerRadius:5, alwaysRespectStubs:true } ],
            dropOptions:{ hoverClass:"hover", activeClass:"active" },
            isTarget:true,
            connectorOverlays:[ [ "Arrow", { width:20, length:30, location:1, id:"arrow" } ] ]
        });
    };
    
    $scope.deleteAll = function(){
        angular.forEach($scope.states, function(state, index){
            jsPlumb.detachAllConnections(state.container);

            angular.forEach(state.container.children(), function(child){
                jsPlumb.detachAllConnections(child);
                child.remove();
            });

            state.container.remove();
            delete $scope.states[index];
        });
    };

    $scope.init = function() {
        jsPlumb.ready(function() {
            jsPlumb.setContainer($('#plumbing-zone'));
            
            jsPlumb.importDefaults({
                Endpoints : [ [ "Dot", { radius:1 } ], [ "Dot", { radius:1 } ] ],
            });
            
            $('#plumbing-zone').dblclick(function(e) {
                jsPlumb.setSuspendDrawing(true);

                if($scope.documentSaved){
                    $scope.documentSaved = false;
                    $scope.documentName = $scope.documentName + "*";
                    $scope.documentSaveState = "btn-warning";
                    console.log($scope.documentName);
                }
                var newState = $scope.createNewState();
                
                jsPlumb.draggable(newState.container, {
                    containment: $('#plumbing-zone'),
                });
                
                setStateCss(newState, e);

                newState.container.dblclick(function(e) {
                    jsPlumb.detachAllConnections($(this));

                    angular.forEach($(this).children(), function(child){
                        jsPlumb.detachAllConnections(child);
                        child.remove();
                    });

                    $(this).remove();
                    e.stopPropagation();
                });
                
                
                $scope.makeTarget(newState.input);
                $scope.makeSource(newState.output);

                $('#plumbing-zone').append(newState.container);
                jsPlumb.setSuspendDrawing(false, true);
                $scope.$apply();
            });  
        });
    };
});