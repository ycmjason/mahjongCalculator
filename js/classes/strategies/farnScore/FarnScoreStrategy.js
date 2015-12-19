var FarnScoreStrategy = {};
FarnScoreStrategy.validNames = ["_25ChickenStrategy",
                           "_51Strategy",
                           "_12MosquitosStrategy"]
FarnScoreStrategy.isValidName = function(strategyName){
  return FarnScoreStrategy.validNames.indexOf(strategyName) > -1;
}
FarnScoreStrategy.parseStrategy = function(strategyName){
  if(!FarnScoreStrategy.isValidName(strategyName))
    console.error("No strategy named, "+strategyName+", found.");
  return window[strategyName];
}
