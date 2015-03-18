var AbstractNPC = (function () {
  
  'use strict';
  
  
  function Class(game, map) {
    // extend abstract's properties
    _.extend(this, new AbstractSprite(game, map));

    // set properties
    this.className = 'AbstractNPC';
  }


  // public api
  Class.prototype = {
    // movement behavior methods
    reverseDirectionOnCollision: reverseDirectionOnCollision,
    randomDirectionOnCollision: randomDirectionOnCollision,
    randomDirectionOnTile: randomDirectionOnTile,

    // these should be private methods. thanks obama.
    getAvailableDirections: getAvailableDirections,
    getRandomDirection: getRandomDirection,
    setRandomDirection: setRandomDirection
  };
  // add the abstract's api
  _.extend(Class.prototype, AbstractSprite.prototype);

  return Class;


  // private methods
  function reverseDirectionOnCollision() {
    switch(this.walkingDirection) {
      case SpriteConstants.Direction.UP:
        if(this.surroundingCollisions.up) {
          this.walkingDirection = SpriteConstants.Direction.DOWN;
        }
        break;

      case SpriteConstants.Direction.RIGHT:
        if(this.surroundingCollisions.right) {
          this.walkingDirection = SpriteConstants.Direction.LEFT;
        }
        break;

      case SpriteConstants.Direction.DOWN:
        if(this.surroundingCollisions.down) {
          this.walkingDirection = SpriteConstants.Direction.UP;
        }
        break;

      case SpriteConstants.Direction.LEFT:
        if(this.surroundingCollisions.left) {
          this.walkingDirection = SpriteConstants.Direction.RIGHT;
        }
        break;
    }
  }

  function randomDirectionOnCollision() {
    switch(this.walkingDirection) {
      case SpriteConstants.Direction.UP:
        if(this.surroundingCollisions.up) {
          this.setRandomDirection();
        }
        break;

      case SpriteConstants.Direction.RIGHT:
        if(this.surroundingCollisions.right) {
          this.setRandomDirection();
        }
        break;

      case SpriteConstants.Direction.DOWN:
        if(this.surroundingCollisions.down) {
          this.setRandomDirection();
        }
        break;

      case SpriteConstants.Direction.LEFT:
        if(this.surroundingCollisions.left) {
          this.setRandomDirection();
        }
        break;
    }
  }

  function randomDirectionOnTile() {
    this.setRandomDirection();
  }

  function getAvailableDirections() {
    var availableDirections = [];

    if(!this.surroundingCollisions.up) {
      availableDirections.push(SpriteConstants.Direction.UP);
    }
    if(!this.surroundingCollisions.right) {
      availableDirections.push(SpriteConstants.Direction.RIGHT);
    }
    if(!this.surroundingCollisions.down) {
      availableDirections.push(SpriteConstants.Direction.DOWN);
    }
    if(!this.surroundingCollisions.left) {
      availableDirections.push(SpriteConstants.Direction.LEFT);
    }

    return availableDirections;
  }

  function getRandomDirection() {
    // temp direction array
    var directions = this.getAvailableDirections();

    // get random direction
    var random = Math.floor(Math.random() * directions.length);
    return directions[random];
  }

  function setRandomDirection() {
    this.walkingDirection = this.getRandomDirection();
  }
  
})();
