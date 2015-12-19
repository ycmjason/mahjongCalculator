function _51Strategy(){
  var BASESCORE = 0.5;
  var basicStrategy = new BasicStrategy(BASESCORE);
  this.getWuScore = basicStrategy.getWuScore;
}
