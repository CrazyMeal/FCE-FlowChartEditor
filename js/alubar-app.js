var app = angular.module('alubar-app', ['ui.bootstrap']);

app.controller('MainCtrl', function ($scope) {
    this.tab = 3;

    this.selectTab = function(setTab) {
        this.tab = setTab;
    };

    this.isSelected = function(checkTab) {
        return this.tab === checkTab;
    };


});

app.controller('AdminCtrl', function($scope) {
    $scope.isCollapsed = false;

    $scope.selectRole = function(user, role){
        user.newRole = role;
    };

    this.addNewRole = function(user){
        user.roles.push(user.newRole);
    };

    this.possibleRoles = [
        "admin",
        "createur",
        "traducteur"
    ];

    this.users = [
        {
            id: 1,
            username: "Alice",
            roles: ["admin", "createur"],
            newRole: "Ajouter un role"
        },
        {
            id: 2,
            username: "Bob",
            roles: ["admin", "traducteur"],
            newRole: "Ajouter un role"
        }
    ];
    this.hasRole = function(user, role) {
        var hasRole = false;
        console.log('Htest');
        //console.log(element.attributes['hasRole'].value);
        if($.inArray(role, user.roles) != -1)
            hasRole = true;
        return hasRole;
    };
});
