function _12MosquitosStrategy(){
  var BASESCORE = 1;
  var basicStrategy = new BasicStrategy(BASESCORE);
  this.getWuScore = basicStrategy.getWuScore;
}
