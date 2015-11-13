#!/usr/bin/php
<html ng-app="ssas">
  <head>
    <title>Adding People</title>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
  </head>
  <body ng-controller="adderController">
    <form>
      <input placeholder="Name" type="text" ng-model="name">
      www.facebook.com/<input placeholder="Facebook user id" type="text" ng-model="facebook">
      <input placeholder="Image Url" type="text" ng-model="image">
      <button ng-click="add()">Add</button>
    </form>
    <section style="white-space: pre;">{{people | json:6}}</section>
<script>
var ssas = angular.module('ssas', []);

var api = function(action){
  return './api.php?action='+action;
};

ssas.controller('adderController', function ($scope, $http) {
  function updatePeople(){
    $http.get(api('getPeople')).success(function(people){
      $scope.people = people;
    });
  }
  updatePeople();
  $scope.add=function(){
    var name=$scope.name;
    var facebook=$scope.facebook;
    var image=$scope.image;
    if(!name || !facebook || !image){
      return;
    }
    $http.post(api('addPerson'), {'name':name, 'facebook': facebook, 'image': image}).success(function(res){
      $scope.name='';
      $scope.facebook='';
      $scope.image='';
      updatePeople();
    });
  }
});
</script>
  </body>
</html>
