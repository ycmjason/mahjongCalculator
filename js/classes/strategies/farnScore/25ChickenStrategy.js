function _25ChickenStrategy(){
  var BASESCORE = 0.25;
  var basicStrategy = new BasicStrategy(BASESCORE);
  this.getWuScore = basicStrategy.getWuScore;
}
