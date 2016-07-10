var mjCal = angular.module('mjCal', ['chart.js', 'btford.socket-io']);

mjCal.constant('socketURL', '//socket.mahjongcalculator.ycmjason.com');

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
