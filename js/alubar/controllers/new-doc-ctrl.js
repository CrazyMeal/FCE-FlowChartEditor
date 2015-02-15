var app = angular.module('alubar-app');

app.controller('NewDocCtrl', function($scope,$compile,$timeout, $rootScope, uuid, localStorageService, libraryService, tabService, StateFactory){
	$scope.ids = 0;
	$scope.stateEditionMode = true;
	$scope.connectionEditionMode = false;
	$scope.documentName = "New Document";
	$scope.documentSaved = true;
	$scope.states = [];
	$scope.connections = [];
	$scope.documentSaveState = "btn-success";
	$scope.inStateEditionMode = false;
	$scope.labelInEdition = {};
	$scope.workingConnection = {};

	setStateCss = function(state, e){
		state.container.css({
			'top': e.pageY- $('#plumbing-zone').offset().top,
			'left': e.pageX - $('#plumbing-zone').offset().left
		});
	};
	$scope.saveDocument = function(){
		if(!$scope.documentSaved){
			if($scope.inStateEditionMode == true)
				$scope.finishEdition();
			if($scope.stateEditionMode == false)
				$scope.stateEditionMode = true;


			$timeout(function(){
				$scope.documentSaved = true;
				$scope.documentName = $scope.documentName.substring(0, $scope.documentName.length - 1);
				$scope.documentSaveState = "btn-success";
				var lightStates = [];
				angular.forEach(jsPlumb.getSelector(".state"), function(stateDiv){
					var tmpState = {};
					tmpState.id = $(stateDiv).attr('id');
					tmpState.top = $(stateDiv).position().top;
					tmpState.left = $(stateDiv).position().left;
					tmpState.name = $(stateDiv).text();
					angular.forEach($scope.states, function(state){
						if(state != undefined && state.id == tmpState.id){
							tmpState.content = state.content;
							tmpState.interactions = state.interactions;
						}
					});

					lightStates.push(tmpState);
				});
				console.log("Saving connections");
				console.log($scope.connections);
				libraryService.saveScenario($scope.documentName, angular.copy(lightStates), angular.copy($scope.connections));
			}, 1);
		}
	};

	$scope.$on('load', function(){
		var scenario = libraryService.scenario;
		$timeout(function(){$scope.loadDocument(scenario.name, scenario.state, scenario.transition)}, 1);
	});

	$scope.loadDocument = function(name, states, connections){
		jsPlumb.setSuspendDrawing(true);
		$scope.deleteAll();
		if($scope.inStateEditionMode == true)
			$rootScope.$broadcast('finishEdition');

		$scope.documentName = name;
		$scope.documentSaved = true;
		$scope.documentSaveState = "btn-success";
		$scope.stateEditionMode = true;
		// On importe tous les state
		angular.forEach(states, function(state, index){
			var newIndex = $scope.states.length;
			var mainContainer = $($compile('<etape test="states['+newIndex+'].name" id="'+state.id+'">')($scope));
			var connectInDiv = $('<div>').addClass('connectIn').attr('id', 'connectIn-' + state.id);
			var connectOutDiv = $('<div>').addClass('connectOut').attr('id', 'connectOut-' + state.id);
			mainContainer.append(connectInDiv);
			mainContainer.append(connectOutDiv);
			mainContainer.css({
				'top': state.top,
				'left': state.left
			});
			$scope.makeTarget(connectInDiv);
			$scope.makeSource(connectOutDiv);
			
			mainContainer.dblclick(function(e) {
				if(!mainContainer.hasClass('stateSelected')){			
					angular.forEach($('.state'), function(state){
						if($(state).hasClass('stateSelected'))
							$(state).removeClass('stateSelected');
					});
					mainContainer.addClass('stateSelected');
				}
				$scope.editState($(this));
				e.stopPropagation();
			});
			
			var newstate = {
					container: mainContainer,
					input: connectInDiv,
					output: connectOutDiv,
					id: state.id,
					name : state.name,
					content : state.content,
					interactions : state.interactions
			};
			$scope.states.push(newstate);
			$('#plumbing-zone').append(mainContainer);
		});

		// On relis tous les states entre eux selon les connections
		angular.forEach(connections, function(connection, index){
			console.log(connection.label);
			var theNewConnection = jsPlumb.connect({source:connection.from, target:connection.to});
			theNewConnection.getOverlay("label").setLabel(connection.label);
		});

		jsPlumb.setSuspendDrawing(false, true);
	};
	$scope.saveDocumentToLocalStorage = function(){
		if(!$scope.documentSaved){
			$scope.documentSaved = true;
			$scope.documentName = $scope.documentName.substring(0, $scope.documentName.length - 1);
			$scope.documentSaveState = "btn-success";

			localStorageService.clearAll();
			var lightStates = [];
			angular.forEach(jsPlumb.getSelector(".state"), function(stateDiv){
				var tmpState = {};
				tmpState.id = $(stateDiv).attr('id');
				tmpState.top = $(stateDiv).position().top;
				tmpState.left = $(stateDiv).position().left;
				tmpState.name = $(stateDiv).text();

				lightStates.push(tmpState);
			});
			localStorageService.set('savedStates', angular.copy(lightStates));
			localStorageService.set('savedConnections', angular.copy($scope.connections));
		}
	};

	$scope.importLastDocumentFromLocalStorage = function(){
		jsPlumb.setSuspendDrawing(true);
		$scope.deleteAll();
		var states = localStorageService.get('savedStates');
		var connections = localStorageService.get('savedConnections');

		// On importe tous les state
		angular.forEach(states, function(state, index){
			var newIndex = $scope.states.length;

			var mainContainer = $($compile('<etape test="states['+newIndex+'].name" id="'+state.id+'">')($scope));
			var connectInDiv = $('<div>').addClass('connectIn').attr('id', 'connectIn-' + state.id);
			var connectOutDiv = $('<div>').addClass('connectOut').attr('id', 'connectOut-' + state.id);

			mainContainer.append(connectInDiv);
			mainContainer.append(connectOutDiv);

			mainContainer.css({
				'top': state.top,
				'left': state.left
			});
			$scope.makeTarget(connectInDiv);
			$scope.makeSource(connectOutDiv);
			mainContainer.dblclick(function(e) {
				$scope.editState($(this));
				e.stopPropagation();
			});

			var newstate = {
					container: mainContainer,
					input: connectInDiv,
					output: connectOutDiv,
					id: state.id,
					name : state.name
			};
			$scope.states.push(newstate);
			$('#plumbing-zone').append(mainContainer);
		});

		// On relis tous les states entre eux selon les connections
		angular.forEach(connections, function(connection, index){
			jsPlumb.connect({source:connection.from, target:connection.to});
		});
		jsPlumb.setSuspendDrawing(false, true);
	};

	$scope.validateNameEdition = function(){
		$scope.nameInEdition = {};
		stateEditionMode = true;
		//jsPlumb.recalculateOffsets(".connectOut");
		//jsPlumb.repaintEverything();
		//jsPlumb.setSuspendDrawing(false, true);
	};
	$scope.editState = function(stateDiv){
		//jsPlumb.setSuspendDrawing(true);
		if($scope.documentSaved){
			$scope.documentSaved = false;
			$scope.documentName = $scope.documentName + "*";
			$scope.documentSaveState = "btn-warning";
		}

		var stateId = stateDiv.attr('id');
		$scope.idInEdition = stateId;

		angular.forEach($scope.states, function(state, index){
			if(state != undefined){
				if(state.id == stateId){
					$scope.nameInEdition = state;
					$scope.stateEditionMode = false;
					$scope.$apply();
				}
			}
		});
	};

	$scope.createNewState = function(){
		var newIndex = $scope.states.length;	
		var id = uuid.new();

		var mainContainer = $($compile('<etape test="states['+newIndex+'].name" id="'+id+'">')($scope));
		var connectInDiv = $('<div>').addClass('connectIn').attr('id', 'connectIn-' + id);
		var connectOutDiv = $('<div>').addClass('connectOut').attr('id', 'connectOut-' + id);
		mainContainer.append(connectInDiv);
		mainContainer.append(connectOutDiv);

		
		mainContainer.dblclick(function(e){
			if(!mainContainer.hasClass('stateSelected')){			
				angular.forEach($('.state'), function(state){
					if($(state).hasClass('stateSelected'))
						$(state).removeClass('stateSelected');
				});
				mainContainer.addClass('stateSelected');
			}
		});
		
		var state = {
				container: mainContainer,
				input: connectInDiv,
				output: connectOutDiv,
				id: id,
				name : 'Default'
		};
		$scope.states.push(state);
		$scope.$apply();
		return state;
	};
	$scope.makeTarget = function(input){
		jsPlumb.makeTarget(input, {
			anchor: ['Continuous',{ faces:[ "left","top","bottom" ] }],           
			isSource:true,
			connector:[ "Flowchart", { stub:[20, 30], cornerRadius:5, alwaysRespectStubs:true } ],                                              
			dragOptions:{}
		});
	};

	$scope.makeSource = function(output){
		jsPlumb.makeSource(output, {
			anchor: ['Continuous',{ faces:[ "right" ] }],                
			maxConnections:-1,
			connector:[ "Flowchart", { stub:[20, 30], midpoint: 0.7, cornerRadius:5, alwaysRespectStubs:true } ],
			connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
			dropOptions:{ hoverClass:"hover", activeClass:"active" },
			isTarget:true
		});
	};

	$scope.deleteAll = function(){
		if($scope.documentSaved){
			$scope.documentSaved = false;
			$scope.documentName = $scope.documentName + "*";
			$scope.documentSaveState = "btn-warning";
		}

		angular.forEach($scope.states, function(state, index){
			if(state != undefined){
				jsPlumb.detachAllConnections(state.container);

				angular.forEach(state.container.children(), function(child){
					jsPlumb.detachAllConnections(child);
					child.remove();
				});

				state.container.remove();
				delete $scope.states[index];
			}
		});
		jsPlumb.deleteEveryEndpoint();
		jsPlumb.detachEveryConnection();
		jsPlumb.repaintEverything();
		$scope.states = [];
		$scope.connections = [];
		$scope.ids = 0;
	};
	
	$scope.removeSelectedState = function(){
		angular.forEach($('.stateSelected'), function(divElement, index){
	    	var idToDelete = $(divElement).attr('id');
	    
	    	angular.forEach($scope.states, function(state, indexOfState){
	    		if(state != undefined && state.id == idToDelete){
	    			var source = $('connectOut-'+idToDelete);
	    			console.log("Source element is");
	    			console.log(source);

	    			console.log("Connection to this source are");
	    			var connectionsFromSource = jsPlumb.getConnections({ source:'connectOut-'+idToDelete });
	    			console.log(connectionsFromSource);

	    			console.log("Connections to this target are");
	    			var connectionsFromTarget = jsPlumb.getConnections({ target:'connectIn-'+idToDelete });
	    			console.log(connectionsFromTarget);

	    			jsPlumb.detachAllConnections('connectOut-'+idToDelete);
	    			jsPlumb.detachAllConnections('connectIn-'+idToDelete);

	    			angular.forEach(connectionsFromSource, function(connectionToRemove){
	    				angular.forEach($scope.connections, function(connectionInModel, index){
	    					if(connectionToRemove.uuid == connectionInModel.uuid){
	    						$scope.connections.splice(index, 1);
	    					}
	    				});
	    			});

	    			angular.forEach(connectionsFromTarget, function(connectionToRemove){
	    				angular.forEach($scope.connections, function(connectionInModel, index){
	    					if(connectionToRemove.uuid == connectionInModel.uuid){
	    						$scope.connections.splice(index, 1);
	    					}
	    				});
	    			});
	    			delete $scope.states[indexOfState];
	    		}
	    	});
		$(divElement).remove();
	    });
	$scope.stateEditionMode = true;
	$scope.idInEdition = -1;
	$scope.$apply();
	};
	
	$scope.validateConnectionEdition = function(){
		console.log("Validating connection edition");
		//var label = { label:"Label", id:"label", cssClass:"aLabel" };
		var t = $scope.workingConnection.getOverlay("label");
		t.setLabel($scope.labelInEdition.label);
		$scope.connectionEditionMode = false;
	};

	$scope.init = function() {

		Mousetrap.bind(['ctrl+del', 'ctrl+backspace'], function(){
	    	$scope.removeSelectedState();
	    });

		jsPlumb.ready(function() {
			jsPlumb.setContainer($('#plumbing-zone'));

			jsPlumb.bind('beforeDrop', function(info) {
				console.log(info);
				
				if($('#'+info.targetId).hasClass('connectIn')){
					if($scope.documentSaved){
						$scope.documentSaved = false;
						$scope.documentName = $scope.documentName + "*";
						$scope.documentSaveState = "btn-warning";
						$scope.$apply();
					}
					return true;
				}
				else
					return false;
			});

			jsPlumb.bind('connection', function(info) {
				var label = { label:"Co-Label", id:"label", cssClass:"aLabel" };
				var newId = uuid.new();
				var id;
				angular.forEach($scope.connections, function(connection, index){
					if(info.connection.uuid == connection.uuid){
						id = index;
					}
				});
				if(id != undefined){
					$scope.connections[id].from = info.sourceId;
					$scope.connections[id].to = info.targetId;
					$scope.connections[id].uuid = newId; 
				} else {
					info.connection.uuid = newId;
					info.connection.addOverlay([ "Label", label]);
					console.log(info);
					$scope.connections.push({ 
						from: info.sourceId, 
						to: info.targetId,
						uuid: newId,
						label: label.label
					});
				};
			});

			jsPlumb.bind('dblclick', function(conn, originalEvent){
				console.log("jsPlumb event: double clicked on label");
				originalEvent.stopPropagation();
				angular.forEach($scope.connections, function(e, idx){
					if(e.uuid === conn.uuid){
						$scope.labelInEdition = e;
						$scope.connectionEditionMode = true;
					}
				});
				$scope.workingConnection = conn;
				$scope.$apply();
			});
			
			jsPlumb.importDefaults({
				Endpoint : ["Dot", {radius:3}],
				HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:2 },
				ReattachConnections:true,
				ConnectionOverlays : [
					[ "Arrow", {
				    	location:1,
				        id:"arrow",
				        length:14,
				        foldback:0.8
				    }]
				]
			});
			$('#plumbing-zone').click(function(e){
				$scope.unselectState();
				e.stopPropagation();
			});
			$('#plumbing-zone').dblclick(function(e) {
				
				if($(e.target).hasClass("aLabel")){
					console.log("Double click on a label");
					return;
				}
				jsPlumb.setSuspendDrawing(true);

				if($scope.documentSaved){
					$scope.documentSaved = false;
					$scope.documentName = $scope.documentName + "*";
					$scope.documentSaveState = "btn-warning";
				}
				var newState = $scope.createNewState();

				setStateCss(newState, e);

				newState.container.dblclick(function(e) {
					$scope.editState($(this));
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
	$scope.unselectState =function(){
		angular.forEach($('.stateSelected'), function(divElement){
			$(divElement).removeClass('stateSelected');
		});
		$scope.stateEditionMode = true;
		$scope.$apply();
	};

	$scope.$on('tabChangeRequested', function(){
		if(tabService.getRequestedTab() !== undefined && tabService.getRequestedTab() !== 1 && $scope.documentSaved)
			tabService.accept();
		else if(tabService.getRequestedTab() === 1)
			return;
		else if(window.confirm('Quit without saving?')){
			tabService.accept();
		}
		else{
			$scope.saveDocument();
			tabService.accept();
		}

	});

	$scope.editContent = function(){
		StateFactory.reset();
		console.log("will edit> " + $scope.idInEdition);
		StateFactory.setWorkingStateId($scope.idInEdition);

		angular.forEach($scope.states, function(state, index){
			if(state != undefined && state.id == $scope.idInEdition){
				if(state.content != undefined)
					StateFactory.setStateContent(state.content);
				if(state.interactions != undefined)
					StateFactory.setInteractions(state.interactions);
			}
		});
		$rootScope.$broadcast('beginEdition');
		$scope.stateEditionMode = true;
		$scope.inStateEditionMode = true;
	};

	$scope.$on('finishEdition', function(){$scope.finishEdition()});

	$scope.finishEdition = function(){
		var editedId = StateFactory.getWorkingStateId();
		console.log("Edited content of id> " + editedId);
		console.log(StateFactory.getStateContent());
		
		angular.forEach($scope.states, function(state, index){
			if(state != undefined && state.id == editedId){
				state.content = angular.copy(StateFactory.getStateContent());
				state.interactions = angular.copy(StateFactory.getInteractions());
			}
		});

	    angular.forEach($(".dropped-component"), function(divElement, index){
	      divElement.remove();
	    });

		$scope.inStateEditionMode = false;
	};
});
