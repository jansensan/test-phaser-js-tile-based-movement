var NPC = (function () {
  
  'use strict';
  
  
  function Class(game, map) {
    // extend abstract's properties
    _.extend(this, new AbstractNPC(game, map));

    // set properties
    this.className = 'NPC';
    this.spriteName = 'npc';
    this.spritesheetPath = 'assets/images/sprites/tonberry.png';
  }


  // public api
  Class.prototype = {
    preload: preload,
    init: init,
    update: update
  }
  // add the abstract's api
  _.extend(Class.prototype, AbstractNPC.prototype);

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
    this.sprite.anchor.setTo(SpriteConstants.Anchor.X, SpriteConstants.Anchor.Y);

    // set movement vars
    this.walkingSpeed = SpriteConstants.WalkingSpeed.SLOWEST;
    this.walkingDirection = SpriteConstants.Direction.DOWN;
    this.isMoving = true;

    // set anim vars
    this.animSpeed = SpriteConstants.AnimFPS.SLOWEST;
    this.isAnimWalking = true;

    // add anims
    this.addBasicAnimation();
  }

  function update() {
    if(this.isOnTile()) {
      // clear previous position's collision
      if(this.currentTile) {
        this.mapReference.setCollisionAt(this.currentTile, false);
      }
      
      // get current tile
      this.currentTile = this.getTileFromCurrentPosition();
      this.mapReference.setCollisionAt(this.currentTile, true);

      // check surrounding collisions
      this.surroundingCollisions = this.mapReference.getSurroundingCollisionsAt(this.currentTile);

      // movement behavior
      this.reverseDirectionOnCollision();
      // this.randomDirectionOnCollision();
      // this.randomDirectionOnTile();

    // is not on tile (is moving)
    } else {
      // get next tile
      this.setNextTileFromCurrentDirection();
      this.mapReference.setCollisionAt(this.nextTile, true);

      // check surrounding collisions
      this.surroundingCollisions = this.mapReference.getSurroundingCollisionsAt(this.nextTile);
    }

    this.setAnim();
    this.move();
  }
  
})();
