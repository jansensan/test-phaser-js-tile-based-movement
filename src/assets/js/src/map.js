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


  // vars
  var _game = game, // game reference

      // map objects
      _map = null,
      _mainTileset = null,
      _collisionTileset = null,
      _tilesLayer = null,
      _collisionLayer = null;


  // public api
  var _class = {};
  _class.preload = preload;
  _class.init = init;
  _class.getTilesLayer = getTilesLayer;
  _class.getCollisionAt = getCollisionAt;
  _class.getSurroundingCollisionsAt = getSurroundingCollisionsAt;


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
        hasCollision;
    for(i = 0; i < NUM_COLUMNS; i++) {
      for(j = 0; j < NUM_ROWS; j++) {
        // get collision data from collision layer
        collisionTile = _collisionLayer.layer.data[j][i];
        hasCollision = (collisionTile.index > -1);

        // set collision uniformely
        // (no cloud tile for now)
        targetTile = _tilesLayer.layer.data[j][i];
        targetTile.collideDown = hasCollision;
        targetTile.collideLeft = hasCollision;
        targetTile.collideRight = hasCollision;
        targetTile.collideUp = hasCollision;
      }
    }

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

  function getSurroundingCollisionsAt(tile) {
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
    }

    return surroundings;
  }




  return _class;
}