jQuery.event.props.push('dataTransfer');

var app = angular.module('alubar-app', ['ui.bootstrap','LocalStorageModule', 'lvl.directives.dragdrop']);

app.controller('MainCtrl', function ($scope) {
    this.tab = 1;

    this.selectTab = function(setTab) {
        this.tab = setTab;
    };

    this.isSelected = function(checkTab) {
        return this.tab === checkTab;
    };
});


