function Player(game, map) {
  // constants
  var SPRITE_NAME = 'player',
      SPRITESHEET_PATH = 'assets/images/sprites/ff4-remake-chocobo.png',
      TILE_SIZE = 16,
      ANIM_FPS = 6,
      WALKING_SPEED = 1;
  var Animation = {
    STILL_UP: 'still-up',
    STILL_DOWN: 'still-down',
    STILL_SIDE: 'still-side',
    WALKING_UP: 'walking-up',
    WALKING_DOWN: 'walking-down',
    WALKING_SIDE: 'walking-side'
  };
  var Anchor = {
    X: 0.5,
    Y: 1
  };
  var Direction = {
    UP: 'up',
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left'
  };


  // vars
  var _game = game,
      _map = map,
      _sprite = null,

      // positions vars
      _initialTile = null,
      _currentTile = null,

      // animation vars
      _walkingDirection = null,
      _isIdle = false,
      _isWalking = false,

      // movement vars
      _surroundingCollisions = null,
      _isSpriteMoving = false;


  // public api
  var _class = {};
      _class.preload = preload;
      _class.init = init;
      _class.setPhysics = setPhysics;
      _class.update = update;
      _class.getSprite = getSprite;


  // private methods
  function preload() {
    _game.load.spritesheet(
      SPRITE_NAME,
      SPRITESHEET_PATH,
      TILE_SIZE,
      TILE_SIZE
    );
  }

  function init(tile) {
    _initialTile = tile;
    _walkingDirection = Direction.DOWN;

    _sprite = _game.add.sprite(
      getTileX(_initialTile.x),
      getTileY(_initialTile.y),
      SPRITE_NAME
    );

    // add anims
    _sprite.animations.add(Animation.STILL_DOWN, [0]);
    _sprite.animations.add(Animation.STILL_UP, [2]);
    _sprite.animations.add(Animation.STILL_SIDE, [4]);
    _sprite.animations.add(Animation.WALKING_DOWN, [0, 1], ANIM_FPS, true);
    _sprite.animations.add(Animation.WALKING_UP, [2, 3], ANIM_FPS, true);
    _sprite.animations.add(Animation.WALKING_SIDE, [4, 5], ANIM_FPS, true);

    // set anchor
    _sprite.anchor.setTo(Anchor.X, Anchor.Y);
  }

  function setPhysics() {
    _sprite.body.setSize(TILE_SIZE, TILE_SIZE, 0, 0);
  }

  function update(isUpPressed, isRightPressed, isDownPressed, isLeftPressed) {
    if(isOnTile()) {
      _currentTile = getTileFromCurrentPosition();

      // FIXME: if sprite moving, check next one
      _surroundingCollisions = _map.getSurroundingCollisionsAt(_currentTile);

      if(isUpPressed) {
        _walkingDirection = Direction.UP;
        if(!_surroundingCollisions.up) {
          _isWalking = true;
          _isSpriteMoving = true;
        }

      } else if(isRightPressed) {
        _walkingDirection = Direction.RIGHT;
        if(!_surroundingCollisions.right) {
          _isWalking = true;
          _isSpriteMoving = true;
        }

      } else if(isDownPressed) {
        _walkingDirection = Direction.DOWN;
        if(!_surroundingCollisions.down) {
          _isWalking = true;
          _isSpriteMoving = true;
        }

      } else if(isLeftPressed) {
        _walkingDirection = Direction.LEFT;
        if(!_surroundingCollisions.left) {
          _isWalking = true;
          _isSpriteMoving = true;
        }

      } else {
        _isWalking = false;
        _isSpriteMoving = false;
      }
    }

    setAnim();
    move();
  }

  function setAnim() {
    // walking animations
    if(_isWalking) {
      switch(_walkingDirection) {
        case Direction.UP:
          _sprite.animations.play(Animation.WALKING_UP);
          break;

        case Direction.RIGHT:
          _sprite.scale.x = -1;
          _sprite.animations.play(Animation.WALKING_SIDE);
          break;

        case Direction.DOWN:
          _sprite.animations.play(Animation.WALKING_DOWN);
          break;

        case Direction.LEFT:
          _sprite.scale.x = 1;
          _sprite.animations.play(Animation.WALKING_SIDE);
          break;
      }

    // still/idle animations
    } else {
      switch(_walkingDirection) {
        case Direction.UP:
          _sprite.animations.play(Animation.STILL_UP);
          break;

        case Direction.RIGHT:
          _sprite.scale.x = -1;
          _sprite.animations.play(Animation.STILL_SIDE);
          break;

        case Direction.DOWN:
          _sprite.animations.play(Animation.STILL_DOWN);
          break;

        case Direction.LEFT:
          _sprite.scale.x = 1;
          _sprite.animations.play(Animation.STILL_SIDE);
          break;
      }
      _sprite.animations.stop();
    }
  }

  function move() {
    if(_isSpriteMoving) {
      switch(_walkingDirection) {
        case Direction.UP:
          _sprite.body.y -= WALKING_SPEED;
          break;

        case Direction.RIGHT:
          _sprite.body.x += WALKING_SPEED;
          break;

        case Direction.DOWN:
          _sprite.body.y += WALKING_SPEED;
          break;

        case Direction.LEFT:
          _sprite.body.x -= WALKING_SPEED;
          break;
      }
    }
  }

  function isOnTile() {
    var spriteX = _sprite.x + (Anchor.X * TILE_SIZE),
        spriteY = _sprite.y,
        isOn = (spriteX % TILE_SIZE === 0) && (spriteY % TILE_SIZE === 0);
    return isOn;
  }

  function getTileFromCurrentPosition() {
    var spriteX = _sprite.x - (Anchor.X * TILE_SIZE),
        spriteY = _sprite.y - TILE_SIZE;
        tile = {x: spriteX / TILE_SIZE, y: spriteY / TILE_SIZE};
    return tile;
  }

  function getTileX(tileXId) {
    return (Anchor.X * TILE_SIZE) + (tileXId * TILE_SIZE);
  }

  function getTileY(tileYId) {
    return (Anchor.Y * TILE_SIZE) + (tileYId * TILE_SIZE);
  }


  // getters
  function getSprite() {
    return _sprite;
  }


  return _class;
}