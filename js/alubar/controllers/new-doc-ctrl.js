var app = angular.module('alubar-app');
app.controller('NewDocCtrl', function($scope){
    $scope.documentName = "Nouveau Document";
    $scope.states = [];

    setStateCss = function(state, e){
        state.container.css({
            'top': e.pageY- $('#plumbing-zone').offset().top,
            'left': e.pageX - $('#plumbing-zone').offset().left
        });
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

    $scope.init = function() {
        jsPlumb.ready(function() {
            jsPlumb.setContainer($('#plumbing-zone'));
            
            jsPlumb.importDefaults({
                Endpoints : [ [ "Dot", { radius:1 } ], [ "Dot", { radius:1 } ] ],
            });
            
            $('#plumbing-zone').dblclick(function(e) {
                jsPlumb.setSuspendDrawing(true);
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

                var exampleGreyEndpointOptions = {
                  endpoint:"Rectangle",
                  paintStyle:{ width:25, height:21, fillStyle:'#666' },
                  isSource:true,
                  connectorStyle : { strokeStyle:"#666" },
                  isTarget:true
                };

                
                jsPlumb.makeTarget(newState.input, {
                    anchor: ['Continuous',{ faces:[ "left" ] }],
                    endpoint:"Dot",
                    paintStyle:{ 
                        strokeStyle:"#7AB02C",
                        fillStyle:"transparent",
                        radius:7,
                        lineWidth:3 
                    },              
                    isSource:true,
                    connector:[ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],                                              
                    dragOptions:{}
                    });
                
                jsPlumb.makeSource(newState.output, {
                    anchor: ['Continuous',{ faces:[ "right" ] }],
                    endpoint:"Dot",                 
                    paintStyle:{ fillStyle:"#7AB02C",radius:11 },
                    maxConnections:-1,
                    connector:[ "Flowchart", { stub:[40, 60], gap:10, midpoint: 0.7, cornerRadius:5, alwaysRespectStubs:true } ],
                    dropOptions:{ hoverClass:"hover", activeClass:"active" },
                    isTarget:true
                });


                $('#plumbing-zone').append(newState.container);
                jsPlumb.setSuspendDrawing(false, true);  
            });  
        });
    };
});