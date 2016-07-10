var mjCal = angular.module('mjCal', ['chart.js', 'btford.socket-io']);

if(window.location.protocol == "http:"){
  mjCal.constant('socketURL', 'http://socket.mahjongcalculator.ycmjason.com');
}else{
  mjCal.constant('socketURL', 'https://mahjongcalculatorsocket.herokuapp.com');
}

mjCal.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data):/);
}]);

/* create socket instance for instant update */
mjCal.factory('socket', function(socketFactory, socketURL){
  return socketFactory({
    ioSocket: io.connect(socketURL)
  });
});

mjCal.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsText(changeEvent.target.files[0]);
            });
        }
    }
}]);
