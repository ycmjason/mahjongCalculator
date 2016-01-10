var combination = function(xs, n){
  if(!xs) console.error("Given null arr.");
  if(n==0) return [[]];
  if(xs.length==0) return [];
  return combination(xs.slice(1, xs.length), n-1).map(function(c){
    var ret = [xs[0]];
    return ret.concat(c);
  }).concat(combination(xs.slice(1, xs.length), n));
};

var isCorruptedFactory = function(){
  var valueOf = function(obj, fieldPath){
    var firstPart = fieldPath.split('.')[0];
    var restPath = fieldPath.substring(firstPart.length+1);
    return fieldPath.length==0? obj: valueOf(obj[firstPart], restPath);
  }
  var args = arguments;
  return function(json){
    var i;
    var isCorrupted = json==undefined;
    for(i=0; i<args.length; i++){
      if(typeof args[i] == 'string' || args[i] instanceof String){
        var path = args[i];
        isCorrupted = isCorrupted || valueOf(json, path)==undefined;
      }else{
        var path = args[i][0];
        var method = args[i][1];
        isCorrupted = isCorrupted || method(valueOf(json, path));
      }
    }
    return isCorrupted;
  };
}
