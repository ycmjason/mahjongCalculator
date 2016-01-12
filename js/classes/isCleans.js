function isAllCleanFactory(isClean){
  return function(objects){
    return objects.map(isClean).reduce(function(a, b){
      return a && b;
    }, true);
  };
}

MJData.isCleanSettings = isCleanFactory('chungStrategy',
                                        'farnScoreStrategy',
                                        'halfSpicyFrom',
                                        ['chungStrategy', ChungStrategy.isValidName],
                                        ['farnScoreStrategy',
                                          FarnScoreStrategy.isValidName]);

Round.Wu.isClean = isCleanFactory('playerId', 'farn');

Round.isClean = isCleanFactory('wus', 'losers', 'isSelfTouched',
                              ['wus', isAllCleanFactory(Round.Wu.isClean)]);

MJData.isClean = isCleanFactory('settings',
                                'players',
                                'rounds',
                                ['settings', MJData.isCleanSettings],
                                ['players', function(players){
                                  return players.length >= 4;
                                }],
                                ['rounds', isAllCleanFactory(Round.isClean)]);
