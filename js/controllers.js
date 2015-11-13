var ssas = angular.module('ssas', []);

var api = function(action){
  return './api.php?action='+action;
};

ssas.controller('indexController', function ($scope, $http, $location) {
  $http.get(api('getPeople')).success(function(res){
    $scope.people = res;
  });
  if($location.search().id!==undefined){
    $http.post(api('getPerson'), {'id': $location.search().id}).success(function(person){
      console.log(person);
      $scope.target = person;
    });
  }
  $scope.login = function(){
    var id = $scope.id;
    var password = $scope.password;
    var confirm = $scope.confirm;
    $http.post(api('setPassword'), {'id': id, 'password': password}).success(function(){
      $http.post(api('allocate'), {'id': id}).success(function(res){
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
