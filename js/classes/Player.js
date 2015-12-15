var Player = function(name){
  this.id = Player.idCount++;
  this.name = name;
};
Player.idCount = 0;
