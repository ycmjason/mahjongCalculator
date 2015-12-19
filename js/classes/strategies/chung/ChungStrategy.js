var ChungStrategy = {};
ChungStrategy.validNames = ["FullChungStrategy",
                           "HalfChungStrategy"]
ChungStrategy.isValidName = function(strategyName){
  return ChungStrategy.validNames.indexOf(strategyName) > -1;
}
ChungStrategy.parseStrategy = function(strategyName){
  if(!ChungStrategy.isValidName(strategyName))
    console.error("No strategy named, "+strategyName+", found.");
  return window[strategyName];
}
