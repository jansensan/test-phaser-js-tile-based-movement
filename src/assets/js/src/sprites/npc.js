function NPC(game, map) {
  // constants
  var SPRITE_NAME = 'npc',
      SPRITESHEET_PATH = 'assets/images/sprites/tonberry.png',
      ANIM_FPS = SpriteConstants.AnimFPS.SLOWEST,
      WALKING_SPEED = SpriteConstants.WalkingSpeed.SLOWEST;


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

    // move sprite on init
    _isSpriteMoving = true;
    _isWalking = true;
  }

  function update() {
    if(isOnTile()) {
      // clear previous position's collision
      if(_currentTile) {
        _map.setCollisionAt(_currentTile, false);
      }
      
      // get current tile
      _currentTile = getTileFromCurrentPosition();
      _map.setCollisionAt(_currentTile, true);

      // check surrounding collisions
      _surroundingCollisions = _map.getSurroundingCollisionsAt(_currentTile);

      // movement behavior
      // reverseDirectionOnCollision();
      // randomDirectionOnCollision();
      randomDirectionOnTile();

    // is not on tile (is moving)
    } else {
      // get next tile
      setNextTileFromCurrentDirection();
      _map.setCollisionAt(_nextTile, true);

      // check surrounding collisions
      _surroundingCollisions = _map.getSurroundingCollisionsAt(_nextTile);
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

  // movement
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

  // movement behaviors
  function reverseDirectionOnCollision() {
    switch(_walkingDirection) {
      case SpriteConstants.Direction.UP:
        if(_surroundingCollisions.up) {
          _walkingDirection = SpriteConstants.Direction.DOWN;
        }
        break;

      case SpriteConstants.Direction.RIGHT:
        if(_surroundingCollisions.right) {
          _walkingDirection = SpriteConstants.Direction.LEFT;
        }
        break;

      case SpriteConstants.Direction.DOWN:
        if(_surroundingCollisions.down) {
          _walkingDirection = SpriteConstants.Direction.UP;
        }
        break;

      case SpriteConstants.Direction.LEFT:
        if(_surroundingCollisions.left) {
          _walkingDirection = SpriteConstants.Direction.RIGHT;
        }
        break;
    }
  }

  function randomDirectionOnCollision() {
    switch(_walkingDirection) {
      case SpriteConstants.Direction.UP:
        if(_surroundingCollisions.up) {
          setRandomDirection();
        }
        break;

      case SpriteConstants.Direction.RIGHT:
        if(_surroundingCollisions.right) {
          setRandomDirection();
        }
        break;

      case SpriteConstants.Direction.DOWN:
        if(_surroundingCollisions.down) {
          setRandomDirection();
        }
        break;

      case SpriteConstants.Direction.LEFT:
        if(_surroundingCollisions.left) {
          setRandomDirection();
        }
        break;
    }
  }

  function randomDirectionOnTile() {
    setRandomDirection();
  }

  function getAvailableDirections() {
    var availableDirections = [];
    if(!_surroundingCollisions.up) {
      availableDirections.push(SpriteConstants.Direction.UP);
    }
    if(!_surroundingCollisions.right) {
      availableDirections.push(SpriteConstants.Direction.RIGHT);
    }
    if(!_surroundingCollisions.down) {
      availableDirections.push(SpriteConstants.Direction.DOWN);
    }
    if(!_surroundingCollisions.left) {
      availableDirections.push(SpriteConstants.Direction.LEFT);
    }
    return availableDirections;
  }

  function getRandomDirection() {
    // temp direction array
    var directions = getAvailableDirections();

    // get random direction
    var random = Math.floor(Math.random() * directions.length);
    return directions[random];
  }

  function setRandomDirection() {
    _walkingDirection = getRandomDirection();
  }

  // map handlers
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


  return _class;
}