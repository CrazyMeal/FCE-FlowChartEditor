var app = angular.module('alubar-app', ['ui.bootstrap']);

app.controller('MainCtrl', function ($scope) {
    this.tab = 1;

    this.selectTab = function(setTab) {
        this.tab = setTab;
    };

    this.isSelected = function(checkTab) {
        return this.tab === checkTab;
    };
});

app.controller('NewDocCtrl', function($scope){
    $scope.init = function() {
        jsPlumb.bind("ready", function() {
            console.log("Set up jsPlumb listeners (should be only done once)");
            jsPlumb.bind("connection", function (info) {
                $scope.$apply(function () {
                    console.log("Possibility to push connection into array");
                });
            });
        });
    };
});


app.controller('AdminCtrl', function($scope) {
    $scope.addUserCollapse = true;

    this.possibleRoles = [
        "admin",
        "createur",
        "traducteur"
    ];
    this.tmpUser = {
        id: 0,
        username: "",
        roles: [],
        newRole: "Ajouter un role"
    };
    this.tmpUserOrigin = {
        id: 0,
        username: "",
        roles: [],
        newRole: "Ajouter un role"
    };

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
    this.selectRole = function(user, role){
        user.newRole = role;
    };

    this.addNewRole = function(user){
        if($.inArray(user.newRole, user.roles) == -1)
            user.roles.push(user.newRole);
    };
    this.addNewUser = function(){
        this.users.push(angular.copy(this.tmpUser));
        this.tmpUser = angular.copy(this.tmpUserOrigin);
    };

    this.hasRole = function(user, role) {
        var hasRole = false;
        console.log('Htest');
        if($.inArray(role, user.roles) != -1)
            hasRole = true;
        return hasRole;
    };
});
