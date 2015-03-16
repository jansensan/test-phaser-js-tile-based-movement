function Player(game, map) {
  // constants
  var SPRITE_NAME = 'player',
      SPRITESHEET_PATH = 'assets/images/sprites/ff4-remake-chocobo.png',
      ANIM_FPS = SpriteConstants.AnimFPS.NORMAL,
      WALKING_SPEED = SpriteConstants.WalkingSpeed.NORMAL;


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
      SpriteConstants.SIZE,
      SpriteConstants.SIZE
    );
  }

  function init(tile) {
    _initialTile = tile;
    _walkingDirection = SpriteConstants.Direction.DOWN;

    _sprite = _game.add.sprite(
      getTileX(_initialTile.x),
      getTileY(_initialTile.y),
      SPRITE_NAME
    );

    // add anims
    _sprite.animations.add(SpriteConstants.Animation.STILL_DOWN, [0]);
    _sprite.animations.add(SpriteConstants.Animation.STILL_UP, [2]);
    _sprite.animations.add(SpriteConstants.Animation.STILL_SIDE, [4]);
    _sprite.animations.add(SpriteConstants.Animation.WALKING_DOWN, [0, 1], ANIM_FPS, true);
    _sprite.animations.add(SpriteConstants.Animation.WALKING_UP, [2, 3], ANIM_FPS, true);
    _sprite.animations.add(SpriteConstants.Animation.WALKING_SIDE, [4, 5], ANIM_FPS, true);

    // set anchor
    _sprite.anchor.setTo(SpriteConstants.Anchor.X, SpriteConstants.Anchor.Y);
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
        _walkingDirection = SpriteConstants.Direction.UP;
        if(!_surroundingCollisions.up) {
          _isWalking = true;
          _isSpriteMoving = true;
        } else {
          _isWalking = false;
          _isSpriteMoving = false;
        }

      } else if(isRightPressed) {
        _walkingDirection = SpriteConstants.Direction.RIGHT;
        if(!_surroundingCollisions.right) {
          _isWalking = true;
          _isSpriteMoving = true;
        } else {
          _isWalking = false;
          _isSpriteMoving = false;
        }

      } else if(isDownPressed) {
        _walkingDirection = SpriteConstants.Direction.DOWN;
        if(!_surroundingCollisions.down) {
          _isWalking = true;
          _isSpriteMoving = true;
        } else {
          _isWalking = false;
          _isSpriteMoving = false;
        }

      } else if(isLeftPressed) {
        _walkingDirection = SpriteConstants.Direction.LEFT;
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
        case SpriteConstants.Direction.UP:
          _sprite.animations.play(SpriteConstants.Animation.WALKING_UP);
          break;

        case SpriteConstants.Direction.RIGHT:
          _sprite.scale.x = -1;
          _sprite.animations.play(SpriteConstants.Animation.WALKING_SIDE);
          break;

        case SpriteConstants.Direction.DOWN:
          _sprite.animations.play(SpriteConstants.Animation.WALKING_DOWN);
          break;

        case SpriteConstants.Direction.LEFT:
          _sprite.scale.x = 1;
          _sprite.animations.play(SpriteConstants.Animation.WALKING_SIDE);
          break;
      }

    // still/idle animations
    } else {
      switch(_walkingDirection) {
        case SpriteConstants.Direction.UP:
          _sprite.animations.play(SpriteConstants.Animation.STILL_UP);
          break;

        case SpriteConstants.Direction.RIGHT:
          _sprite.scale.x = -1;
          _sprite.animations.play(SpriteConstants.Animation.STILL_SIDE);
          break;

        case SpriteConstants.Direction.DOWN:
          _sprite.animations.play(SpriteConstants.Animation.STILL_DOWN);
          break;

        case SpriteConstants.Direction.LEFT:
          _sprite.scale.x = 1;
          _sprite.animations.play(SpriteConstants.Animation.STILL_SIDE);
          break;
      }
      _sprite.animations.stop();
    }
  }

  function move() {
    if(_isSpriteMoving) {
      switch(_walkingDirection) {
        case SpriteConstants.Direction.UP:
          _sprite.y -= WALKING_SPEED;
          break;

        case SpriteConstants.Direction.RIGHT:
          _sprite.x += WALKING_SPEED;
          break;

        case SpriteConstants.Direction.DOWN:
          _sprite.y += WALKING_SPEED;
          break;

        case SpriteConstants.Direction.LEFT:
          _sprite.x -= WALKING_SPEED;
          break;
      }
    }
  }

  function isOnTile() {
    var spriteX = _sprite.x + (SpriteConstants.Anchor.X * SpriteConstants.SIZE),
        spriteY = _sprite.y,
        isOn = (spriteX % SpriteConstants.SIZE === 0) && (spriteY % SpriteConstants.SIZE === 0);
    return isOn;
  }

  function getTileFromCurrentPosition() {
    var spriteX = _sprite.x - (SpriteConstants.Anchor.X * SpriteConstants.SIZE),
        spriteY = _sprite.y - SpriteConstants.SIZE;
        tile = {x: spriteX / SpriteConstants.SIZE, y: spriteY / SpriteConstants.SIZE};
    return tile;
  }

  function setNextTileFromCurrentDirection() {
    switch(_walkingDirection) {
      case SpriteConstants.Direction.UP:
        _nextTile = {x: _currentTile.x, y: _currentTile.y - 1};
        break;

      case SpriteConstants.Direction.RIGHT:
        _nextTile = {x: _currentTile.x + 1, y: _currentTile.y};
        break;

      case SpriteConstants.Direction.DOWN:
        _nextTile = {x: _currentTile.x, y: _currentTile.y + 1};
        break;

      case SpriteConstants.Direction.LEFT:
        _nextTile = {x: _currentTile.x - 1, y: _currentTile.y};
        break;
    }
  }

  function getTileX(tileXId) {
    return (SpriteConstants.Anchor.X * SpriteConstants.SIZE) + (tileXId * SpriteConstants.SIZE);
  }

  function getTileY(tileYId) {
    return (SpriteConstants.Anchor.Y * SpriteConstants.SIZE) + (tileYId * SpriteConstants.SIZE);
  }


  // getters
  function getSprite() {
    return _sprite;
  }


  return _class;
}