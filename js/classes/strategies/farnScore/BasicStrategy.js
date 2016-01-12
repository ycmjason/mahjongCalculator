function BasicStrategy(basescore){
  this.getWuScore = function(settings, farn){
    var halfSpicyFrom = settings.halfSpicyFrom;
    var wuScore = basescore;
    var halfSpicy = false;
    for(var i = 0 ; i < farn; i++){
      if(i<halfSpicyFrom){
        wuScore *= 2;
      } else{
        if(halfSpicy ^= true){ // this toggles halfSpicy
          wuScore *= 1.5;
        }else{
          wuScore = (wuScore/1.5)*2;
        }
      }
    }
    return wuScore;
  };
}
