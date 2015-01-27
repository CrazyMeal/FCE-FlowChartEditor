var app = angular.module('alubar-app');

app.factory('StateFactory', function(){
	var stateContent = [];
	var interactions = [];

	return {
		getStateContent : function(){
			return stateContent
		},
		setStateContent : function(newStateContent){
			stateContent = newStateContent;
		},
		clearStateContent : function(){
			stateContent = [];
		},
		removeContent : function(uuid){
			angular.forEach(stateContent, function(content, index){
				if(content.uuid == uuid){
					stateContent.splice(index, 1);
					return true;
				}
			});
			return false;
		},


		getInteractions : function(){
			return interactions;
		},
		setInteractions : function(newInteractions){
			interactions = newInteractions;
		},
		clearInteractions : function(){
			interactions = [];
		},
		removeInteraction : function(uuid){
			angular.forEach(interactions, function(interaction, index){
				if(interaction.uuid == uuid){
					interactions.splice(index, 1);
					return true;
				}
			});
			return false;
		}

		
	};
});