var Player = (function () {
  
  'use strict';
  
  
  function Class(game, map) {
    // extend abstract's properties
    _.extend(this, new AbstractSprite(game, map));

    // set properties
    this.className = 'Player';
    this.spriteName = 'player';
    this.spritesheetPath = 'assets/images/sprites/ff4-remake-chocobo.png';
  }


  // public api
  Class.prototype = {
    preload: preload,
    init: init,
    update: update
  }
  // add the abstract's api
  _.extend(Class.prototype, AbstractSprite.prototype);

  return Class;


  // private methods
  function preload() {
    this.gameReference.load.spritesheet(
      this.spriteName,
      this.spritesheetPath,
      SpriteConstants.SIZE,
      SpriteConstants.SIZE
    );
  }

  function init(tile) {
    // set position vars
    this.initialTile = tile;

    // add sprite
    this.sprite = this.gameReference.add.sprite(
      this.getTileX(this.initialTile.x),
      this.getTileY(this.initialTile.y),
      this.spriteName
    );

    // set anchor
    this.sprite.anchor.setTo(
      SpriteConstants.Anchor.X,
      SpriteConstants.Anchor.Y
    );

    // set movement vars
    this.walkingSpeed = SpriteConstants.WalkingSpeed.NORMAL;
    this.walkingDirection = SpriteConstants.Direction.DOWN;

    // set anim vars
    this.animSpeed = SpriteConstants.AnimFPS.NORMAL,

    // add anims
    this.addBasicAnimation();
  }

  function update(isUpPressed, isRightPressed, isDownPressed, isLeftPressed) {
    if(this.isOnTile()) {
      // clear previous position's collision
      if(this.currentTile) {
        this.mapReference.setCollisionAt(this.currentTile, false);
      }

      // get current tile
      this.currentTile = this.getTileFromCurrentPosition();
      this.mapReference.setCollisionAt(this.currentTile, true);
      
      // check surrounding collisions
      this.surroundingCollisions = this.mapReference.getSurroundingCollisionsAt(this.currentTile, true);

      if(isUpPressed) {
        this.walkingDirection = SpriteConstants.Direction.UP;
        if(!this.surroundingCollisions.up) {
          this.isWalkingAnim = true;
          this.isMoving = true;
        } else {
          this.isWalkingAnim = false;
          this.isMoving = false;
        }

      } else if(isRightPressed) {
        this.walkingDirection = SpriteConstants.Direction.RIGHT;
        if(!this.surroundingCollisions.right) {
          this.isWalkingAnim = true;
          this.isMoving = true;
        } else {
          this.isWalkingAnim = false;
          this.isMoving = false;
        }

      } else if(isDownPressed) {
        this.walkingDirection = SpriteConstants.Direction.DOWN;
        if(!this.surroundingCollisions.down) {
          this.isWalkingAnim = true;
          this.isMoving = true;
        } else {
          this.isWalkingAnim = false;
          this.isMoving = false;
        }

      } else if(isLeftPressed) {
        this.walkingDirection = SpriteConstants.Direction.LEFT;
        if(!this.surroundingCollisions.left) {
          this.isWalkingAnim = true;
          this.isMoving = true;
        } else {
          this.isWalkingAnim = false;
          this.isMoving = false;
        }

      } else {
        this.isWalkingAnim = false;
        this.isMoving = false;
      }

    // is not on tile (is moving)
    } else {
      // get next tile
      this.setNextTileFromCurrentDirection();
      this.mapReference.setCollisionAt(this.nextTile, true);

      this.surroundingCollisions = this.mapReference.getSurroundingCollisionsAt(this.nextTile, true);
    }

    this.setAnim();
    this.move();
  }
  
})();
