var ssas = angular.module('ssas', []);

var api = function(action){
  return './api.php?action='+action;
};

ssas.controller('indexController', function ($scope, $http, $location) {
  $scope.stat = {};
  $http.get(api('getPeople')).success(function(res){
    $scope.people = res;
    $scope.stat.numberOfPeople = res.length;
  });
  $http.get(api('getNumberOfPeopleLoggedIn')).success(function(n){
    $scope.stat.numberOfPeopleLoggedIn=n;
  });
  if($location.search().id!==undefined){
    $http.post(api('getPerson'), {'id': $location.search().id}).success(function(person){
      console.log(person);
      $scope.target = person;
    });
  }
  $scope.login = function(){
    var id = $scope.id.id;
    var password = $scope.password;
    var confirm = $scope.confirm;
    $http.post(api('setPassword'), {'id': id, 'password': password}).success(function(r){
      $http.post(api('allocate'), {'id': id, 'password': password}).success(function(res){
        console.log({'id': id, 'password': password, 'confirm': confirm});
        $http.post(api('getTarget'), {'id': id, 'password': password, 'confirm': confirm}).success(function(target){
          if(typeof(target)=="string"){
            $scope.errormsg = target;
          }else{
            $scope.target = target;
          }
        });
      });
    });
  };
});
