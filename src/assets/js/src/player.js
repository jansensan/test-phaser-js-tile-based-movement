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
      _nextTile = null,

      // animation vars
      _walkingDirection = null,
      _isIdle = false,
      _isWalking = false,

      // movement vars
      _surroundingCollisions = null,
      _isSpriteMoving = false;


  // public api
  var _class = {};
      // methods
      _class.preload = preload;
      _class.init = init;
      _class.update = update;
      // getters
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

  function update(isUpPressed, isRightPressed, isDownPressed, isLeftPressed) {
    if(isOnTile()) {
      // clear previous position's collision
      if(_currentTile) {
        _map.setCollisionAt(_currentTile, false);
      }

      // get current tile
      _currentTile = getTileFromCurrentPosition();
      _map.setCollisionAt(_currentTile, true);
      
      // check surrounding collisions
      _surroundingCollisions = _map.getSurroundingCollisionsAt(_currentTile, true);

      if(isUpPressed) {
        _walkingDirection = Direction.UP;
        if(!_surroundingCollisions.up) {
          _isWalking = true;
          _isSpriteMoving = true;
        } else {
          _isWalking = false;
          _isSpriteMoving = false;
        }

      } else if(isRightPressed) {
        _walkingDirection = Direction.RIGHT;
        if(!_surroundingCollisions.right) {
          _isWalking = true;
          _isSpriteMoving = true;
        } else {
          _isWalking = false;
          _isSpriteMoving = false;
        }

      } else if(isDownPressed) {
        _walkingDirection = Direction.DOWN;
        if(!_surroundingCollisions.down) {
          _isWalking = true;
          _isSpriteMoving = true;
        } else {
          _isWalking = false;
          _isSpriteMoving = false;
        }

      } else if(isLeftPressed) {
        _walkingDirection = Direction.LEFT;
        if(!_surroundingCollisions.left) {
          _isWalking = true;
          _isSpriteMoving = true;
        } else {
          _isWalking = false;
          _isSpriteMoving = false;
        }

      } else {
        _isWalking = false;
        _isSpriteMoving = false;
      }

    // is not on tile (is moving)
    } else {
      // get next tile
      setNextTileFromCurrentDirection();
      _map.setCollisionAt(_nextTile, true);

      _surroundingCollisions = _map.getSurroundingCollisionsAt(_nextTile, true);
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
          _sprite.y -= WALKING_SPEED;
          break;

        case Direction.RIGHT:
          _sprite.x += WALKING_SPEED;
          break;

        case Direction.DOWN:
          _sprite.y += WALKING_SPEED;
          break;

        case Direction.LEFT:
          _sprite.x -= WALKING_SPEED;
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

  function setNextTileFromCurrentDirection() {
    switch(_walkingDirection) {
      case Direction.UP:
        _nextTile = {x: _currentTile.x, y: _currentTile.y - 1};
        break;

      case Direction.RIGHT:
        _nextTile = {x: _currentTile.x + 1, y: _currentTile.y};
        break;

      case Direction.DOWN:
        _nextTile = {x: _currentTile.x, y: _currentTile.y + 1};
        break;

      case Direction.LEFT:
        _nextTile = {x: _currentTile.x - 1, y: _currentTile.y};
        break;
    }
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