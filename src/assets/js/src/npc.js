function NPC(game, map) {
  // constants
  var SPRITE_NAME = 'npc',
      SPRITESHEET_PATH = 'assets/images/sprites/tonberry.png',
      TILE_SIZE = 16,
      ANIM_FPS = 2,
      WALKING_SPEED = 0.25;
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
  var DIRECTIONS = [
    Direction.UP,
    Direction.RIGHT,
    Direction.DOWN,
    Direction.LEFT
  ]


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

  // movement
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

  // movement behaviors
  function reverseDirectionOnCollision() {
    switch(_walkingDirection) {
      case Direction.UP:
        if(_surroundingCollisions.up) {
          _walkingDirection = Direction.DOWN;
        }
        break;

      case Direction.RIGHT:
        if(_surroundingCollisions.right) {
          _walkingDirection = Direction.LEFT;
        }
        break;

      case Direction.DOWN:
        if(_surroundingCollisions.down) {
          _walkingDirection = Direction.UP;
        }
        break;

      case Direction.LEFT:
        if(_surroundingCollisions.left) {
          _walkingDirection = Direction.RIGHT;
        }
        break;
    }
  }

  function randomDirectionOnCollision() {
    switch(_walkingDirection) {
      case Direction.UP:
        if(_surroundingCollisions.up) {
          setRandomDirection();
        }
        break;

      case Direction.RIGHT:
        if(_surroundingCollisions.right) {
          setRandomDirection();
        }
        break;

      case Direction.DOWN:
        if(_surroundingCollisions.down) {
          setRandomDirection();
        }
        break;

      case Direction.LEFT:
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
      availableDirections.push(Direction.UP);
    }
    if(!_surroundingCollisions.right) {
      availableDirections.push(Direction.RIGHT);
    }
    if(!_surroundingCollisions.down) {
      availableDirections.push(Direction.DOWN);
    }
    if(!_surroundingCollisions.left) {
      availableDirections.push(Direction.LEFT);
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


  return _class;
}