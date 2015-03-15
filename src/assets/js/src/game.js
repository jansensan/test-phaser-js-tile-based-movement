// constants
var TILE_SIZE = 16,
    NUM_COLUMNS = 15,
    NUM_ROWS = 10,
    GAME_WIDTH = NUM_COLUMNS * TILE_SIZE, // 240
    GAME_HEIGHT = NUM_ROWS * TILE_SIZE; // 160

// vars
var _game = null,

    // player class
    _player = null,

    // map class
    _map = null,

    // reference for code reduction
    _keyboardInput = null;


// init
init();


// methods
function init() {
  // add game
  _game = new Phaser.Game(
    GAME_WIDTH, GAME_HEIGHT,
    Phaser.CANVAS, 'phaser-js-test',
    {
      preload: preload,
      create: create,
      update: update
    }
  );

  // create map
  _map = new Map(_game);

  // create player
  _player = new Player(_game, _map);
}

function preload() {
  // preload tilemap and tileset
  _map.preload();

  // preload player
  _player.preload();
}

function create() {
  // set references
  _keyboardInput = _game.input.keyboard;

  // init map
  _map.init();

  // init player
  _player.init({x: 1, y: 1})

  // set physics engine
  _game.physics.startSystem(Phaser.Physics.ARCADE);
  _game.physics.enable(_player.getSprite(), Phaser.Physics.ARCADE);
  _player.setPhysics();
}

function update() {
  // collision detection
  _game.physics.arcade.collide(
    _player.getSprite(),
    _map.getTilesLayer()
  );

  // update player sprite
  _player.update(
    _keyboardInput.isDown(Phaser.Keyboard.UP),
    _keyboardInput.isDown(Phaser.Keyboard.RIGHT),
    _keyboardInput.isDown(Phaser.Keyboard.DOWN),
    _keyboardInput.isDown(Phaser.Keyboard.LEFT)
  );
}
