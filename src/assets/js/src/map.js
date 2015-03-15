function Map(game) {
  // constants
  var MAP_NAME = 'Map',
      TILE_SIZE = 16,
      NUM_COLUMNS = 15,
      NUM_ROWS = 10,
      Tilesets = {
        TILES: 'FF4 Basic Tileset',
        COLLISION: 'Collision Tileset'
      },
      AssetsPaths = {
        TILEMAP: 'assets/tilemaps/map.json',
        TILES: 'assets/images/tilesets/tileset.png',
        COLLISION: 'assets/images/tilesets/collision.png'
      };
      Colors = {
        RED: 'rgba(240, 0, 0, 0.333)',
        GREEN: 'rgba(0, 240, 0, 0.333)',
        BLUE: 'rgba(0, 0, 240, 0.333)'
      };


  // vars
  var _game = game, // game reference
      _map = null, // map object

      // tilesets
      _mainTileset = null,
      _collisionTileset = null,

      // layers
      _tilesLayer = null,
      _collisionLayer = null,

      // 
      _surroundingsToDraw = [];


  // public api
  var _class = {};
      // methods
      _class.preload = preload;
      _class.init = init;
      _class.drawRectAt = drawRectAt;
      _class.drawRedRectAt = drawRedRectAt;
      _class.drawGreenRectAt = drawGreenRectAt;
      _class.drawBlueRectAt = drawBlueRectAt;
      _class.drawSurroundingCollisions = drawSurroundingCollisions;
      // getters
      _class.getTilesLayer = getTilesLayer;
      _class.getCollisionAt = getCollisionAt;
      _class.setCollisionAt = setCollisionAt;
      _class.getSurroundingCollisionsAt = getSurroundingCollisionsAt;
      // properties
      _class.collisionTiles = [];


  // private methods
  function preload() {
    _game.load.tilemap(
      MAP_NAME,
      AssetsPaths.TILEMAP,
      null,
      Phaser.Tilemap.TILED_JSON
    );
    _game.load.image(Tilesets.TILES, AssetsPaths.TILES);
    _game.load.image(Tilesets.COLLISION, AssetsPaths.COLLISION);
  }

  function init() {
    // create a map with the map name given in tile editor
    _map = _game.add.tilemap(MAP_NAME);

    // add tileset image with name given in tile editor 
    _map.addTilesetImage(Tilesets.TILES);
    _map.addTilesetImage(Tilesets.COLLISION);

    // create layers, assign them an index
    _tilesLayer = _map.createLayer(0);
    _collisionLayer = _map.createLayer(1);
    _collisionLayer.alpha = 0;

    // manually set directional collision
    var i = 0, j = 0,
        collisionTile,
        targetTile,
        hasCollision,
        collisionLog = '';
    for(i = 0; i < NUM_ROWS; i++) {
      for(j = 0; j < NUM_COLUMNS; j++) {
        // get collision data from collision layer
        collisionTile = _collisionLayer.layer.data[i][j];
        hasCollision = (collisionTile.index > 4); // TODO: figure how to make dynamic?

        // set collision uniformely
        // (no cloud tile for now)
        targetTile = _tilesLayer.layer.data[i][j];
        targetTile.collideDown = hasCollision;
        targetTile.collideLeft = hasCollision;
        targetTile.collideRight = hasCollision;
        targetTile.collideUp = hasCollision;

        collisionLog += hasCollision ? '×' : ' ';
      }
      collisionLog += '\n';
    }
    // console.log(collisionLog);

    _tilesLayer.resizeWorld();
    _collisionLayer.resizeWorld();
  }

  function getTilesLayer() {
    return _tilesLayer;
  }

  function getCollisionLayer() {
    return _collisionLayer;
  }

  function getCollisionAt(tile) {
    var tileData = _tilesLayer.layer.data[tile.y][tile.x];
    var hasCollision = (tileData.collideUp && tileData.collideRight && tileData.collideDown && tileData.collideLeft);
    // console.log('hasCollision: ', hasCollision);
    return hasCollision;
  }

  function setCollisionAt(tile, hasCollision) {
    var tileData = _tilesLayer.layer.data[tile.y][tile.x];
    tileData.collideUp = hasCollision;
    tileData.collideRight = hasCollision;
    tileData.collideDown = hasCollision;
    tileData.collideLeft = hasCollision;
  }

  function resetSurroundingsToDraw() {
    _surroundingsToDraw.length = 0;
    _surroundingsToDraw = [];
  }

  function getSurroundingCollisionsAt(tile, setsSurroundingsToDraw) {
    if(setsSurroundingsToDraw) {
      resetSurroundingsToDraw();
    }

    var surroundings = {
      up: false,
      right: false,
      down: false,
      left: false
    };

    // check tile up
    var tileUp = {
      x: tile.x,
      y: tile.y - 1
    };
    if(tileUp.y < 0) {
      surroundings.up = true;
    } else {
      surroundings.up = getCollisionAt(tileUp);
      if(setsSurroundingsToDraw) {
        _surroundingsToDraw.push({tile: tileUp, collision: surroundings.up});
      }
    }

    // check tile right
    var tileRight = {
      x: tile.x + 1,
      y: tile.y
    };
    if(tileRight.x >= NUM_COLUMNS) {
      surroundings.right = true;
    } else {
      surroundings.right = getCollisionAt(tileRight);
      if(setsSurroundingsToDraw) {
        _surroundingsToDraw.push({tile: tileRight, collision: surroundings.right});
      }
    }

    // check tile down
    var tileDown = {
      x: tile.x,
      y: tile.y + 1
    };
    if(tileDown.y >= NUM_ROWS) {
      surroundings.down = true;
    } else {
      surroundings.down = getCollisionAt(tileDown);
      if(setsSurroundingsToDraw) {
        _surroundingsToDraw.push({tile: tileDown, collision: surroundings.down});
      }
    }

    // check tile left
    var tileLeft = {
      x: tile.x - 1,
      y: tile.y
    };
    if(tileLeft.x < 0) {
      surroundings.left = true;
    } else {
      surroundings.left = getCollisionAt(tileLeft);
      if(setsSurroundingsToDraw) {
        _surroundingsToDraw.push({tile: tileLeft, collision: surroundings.left});
      }
    }

    return surroundings;
  }

  function drawRectAt(tile, color) {
    if(!tile) {
      tile = {x: 0, y: 0};
    }
    var rect = new Phaser.Rectangle(
      tile.x * TILE_SIZE,
      tile.y * TILE_SIZE,
      TILE_SIZE, TILE_SIZE
    );
    _game.debug.geom(rect, color, true);
  }

  function drawRedRectAt(tile) {
    drawRectAt(tile, Colors.RED);
  }

  function drawGreenRectAt(tile) {
    drawRectAt(tile, Colors.GREEN);
  }

  function drawBlueRectAt(tile) {
    drawRectAt(tile, Colors.BLUE);
  }

  function drawSurroundingCollisions() {
    var i = 0,
        numLoops = _surroundingsToDraw.length,
        tile, collision;
    for(i; i < numLoops; i++) {
      tile = _surroundingsToDraw[i].tile;
      collision = _surroundingsToDraw[i].collision;
      if(collision) {
        drawRedRectAt(tile);
      } else {
        drawGreenRectAt(tile);
      }
    }
  }


  return _class;
}