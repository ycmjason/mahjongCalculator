function combination(xs, n){
  if(!xs) console.error("Given null arr.");
  if(n==0) return [[]];
  if(xs.length==0) return [];
  return combination(xs.slice(1, xs.length), n-1).map(function(c){
    var ret = [xs[0]];
    return ret.concat(c);
  }).concat(combination(xs.slice(1, xs.length), n));
};

function isCleanFactory(){
  var valueOf = function(obj, fieldPath){
    var firstPart = fieldPath.split('.')[0];
    var restPath = fieldPath.substring(firstPart.length+1);
    return fieldPath.length==0? obj: valueOf(obj[firstPart], restPath);
  }
  var args = arguments;
  return function(json){
    if(json == undefined) return false;

    var isDefined = function(value){
      return value != undefined;
    };
    var isString = function(s){
      return typeof s == 'string' || s instanceof String;
    };

    for(var i=0; i<args.length; i++){
      var path = isString(args[i])? args[i]: args[i][0];
      var method = isString(args[i])? isDefined: args[i][1];
      if(!method(valueOf(json, path))){
        console.log(path+" is either not defiend or does not pass test as stated.");
        return false;
        break;
      }
    }
    return true;
  };
}
