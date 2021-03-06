function combination(xs, n){
  if(!xs) console.error("Given null arr.");
  if(n==0) return [[]];
  if(xs.length==0) return [];
  return combination(xs.slice(1, xs.length), n-1).map(function(c){
    var ret = [xs[0]];
    return ret.concat(c);
  }).concat(combination(xs.slice(1, xs.length), n));
};
function range(startNumber, endNumber){
  var arr = [];
  for(var i=0; i<endNumber - startNumber + 1; ++i){
    arr.push(startNumber+i);
  }
  return arr;
};
