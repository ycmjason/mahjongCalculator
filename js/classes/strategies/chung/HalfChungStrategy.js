function HalfChungStrategy(isSelfTouched){
  var selfTouchFactor = 6;
  var normalFactor = 4;
  var computeWuScore = function(wuBaseScore){
    return wuBaseScore*(isSelfTouched?selfTouchFactor:normalFactor);
  }
  this.getWinnerScore = function(wuBaseScore){
    return computeWuScore(wuBaseScore);
  }
  this.getLoserScore = function(wuBaseScore, numberOfLoser, didOutChung){
    var wuScore = computeWuScore(wuBaseScore);
    if(isSelfTouched){
      return -wuScore/numberOfLoser;
    }else if(didOutChung){
      return -wuBaseScore*2;
    }else{
      return -wuBaseScore;
    }
  }
}
