var AbstractSprite = (function () {
  
  'use strict';


  function Class(game, map) {
    // references
    this.gameReference = game;
    this.mapReference = map;

    this.className = 'AbstractSprite';

    // properties
    this.sprite = null;
    this.spriteName = null;
    this.spritesheetPath = null;

    // positions vars
    this.initialTile = null;
    this.currentTile = null;
    this.nextTile = null;

    // animation vars
    this.animSpeed = 0;
    this.isAnimWalking = false;

    // movement vars
    this.surroundingCollisions = null;
    this.walkingDirection = null;
    this.walkingSpeed = 0;
    this.isMoving = false;
  }


  // public api
  Class.prototype = {
    // anim methods
    addBasicAnimation: addBasicAnimation,
    setAnim: setAnim,
    // movement methods
    move: move,
    // tile management methods
    isOnTile: isOnTile,
    getTileFromCurrentPosition: getTileFromCurrentPosition,
    setNextTileFromCurrentDirection: setNextTileFromCurrentDirection,
    getTileX: getTileX,
    getTileY: getTileY
  };

  return Class;


  // private methods
  function addBasicAnimation() {
    this.sprite.animations.add(SpriteConstants.Animation.STILL_DOWN, [0]);
    this.sprite.animations.add(SpriteConstants.Animation.STILL_UP, [2]);
    this.sprite.animations.add(SpriteConstants.Animation.STILL_SIDE, [4]);
    this.sprite.animations.add(SpriteConstants.Animation.WALKING_DOWN, [0, 1], this.animSpeed, true);
    this.sprite.animations.add(SpriteConstants.Animation.WALKING_UP, [2, 3], this.animSpeed, true);
    this.sprite.animations.add(SpriteConstants.Animation.WALKING_SIDE, [4, 5], this.animSpeed, true);
  }

  function setAnim() {
    // walking animations
    if(this.isAnimWalking) {
      switch(this.walkingDirection) {
        case SpriteConstants.Direction.UP:
          this.sprite.animations.play(SpriteConstants.Animation.WALKING_UP);
          break;

        case SpriteConstants.Direction.RIGHT:
          this.sprite.scale.x = -1;
          this.sprite.animations.play(SpriteConstants.Animation.WALKING_SIDE);
          break;

        case SpriteConstants.Direction.DOWN:
          this.sprite.animations.play(SpriteConstants.Animation.WALKING_DOWN);
          break;

        case SpriteConstants.Direction.LEFT:
          this.sprite.scale.x = 1;
          this.sprite.animations.play(SpriteConstants.Animation.WALKING_SIDE);
          break;
      }

    // still/idle animations
    } else {
      switch(this.walkingDirection) {
        case SpriteConstants.Direction.UP:
          this.sprite.animations.play(SpriteConstants.Animation.STILL_UP);
          break;

        case SpriteConstants.Direction.RIGHT:
          this.sprite.scale.x = -1;
          this.sprite.animations.play(SpriteConstants.Animation.STILL_SIDE);
          break;

        case SpriteConstants.Direction.DOWN:
          this.sprite.animations.play(SpriteConstants.Animation.STILL_DOWN);
          break;

        case SpriteConstants.Direction.LEFT:
          this.sprite.scale.x = 1;
          this.sprite.animations.play(SpriteConstants.Animation.STILL_SIDE);
          break;
      }
      this.sprite.animations.stop();
    }
  }

  function move() {
    if(this.isMoving) {
      switch(this.walkingDirection) {
        case SpriteConstants.Direction.UP:
          this.sprite.y -= this.walkingSpeed;
          break;

        case SpriteConstants.Direction.RIGHT:
          this.sprite.x += this.walkingSpeed;
          break;

        case SpriteConstants.Direction.DOWN:
          this.sprite.y += this.walkingSpeed;
          break;

        case SpriteConstants.Direction.LEFT:
          this.sprite.x -= this.walkingSpeed;
          break;
      }
    }
  }

  function isOnTile() {
    var spriteX = this.sprite.x + (SpriteConstants.Anchor.X * SpriteConstants.SIZE),
        spriteY = this.sprite.y,
        isOn = (spriteX % SpriteConstants.SIZE === 0) && (spriteY % SpriteConstants.SIZE === 0);
    return isOn;
  }

  function getTileFromCurrentPosition() {
    var spriteX = this.sprite.x - (SpriteConstants.Anchor.X * SpriteConstants.SIZE),
        spriteY = this.sprite.y - SpriteConstants.SIZE,
        tile = {x: spriteX / SpriteConstants.SIZE, y: spriteY / SpriteConstants.SIZE};
    return tile;
  }

  function setNextTileFromCurrentDirection() {
    switch(this.walkingDirection) {
      case SpriteConstants.Direction.UP:
        this.nextTile = {x: this.currentTile.x, y: this.currentTile.y - 1};
        break;

      case SpriteConstants.Direction.RIGHT:
        this.nextTile = {x: this.currentTile.x + 1, y: this.currentTile.y};
        break;

      case SpriteConstants.Direction.DOWN:
        this.nextTile = {x: this.currentTile.x, y: this.currentTile.y + 1};
        break;

      case SpriteConstants.Direction.LEFT:
        this.nextTile = {x: this.currentTile.x - 1, y: this.currentTile.y};
        break;
    }
  }

  function getTileX(tileXId) {
    return (SpriteConstants.Anchor.X * SpriteConstants.SIZE) + (tileXId * SpriteConstants.SIZE);
  }

  function getTileY(tileYId) {
    return (SpriteConstants.Anchor.Y * SpriteConstants.SIZE) + (tileYId * SpriteConstants.SIZE);
  }
  
  
})();
