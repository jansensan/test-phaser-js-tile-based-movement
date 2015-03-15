(function () {
  
  'use strict';
  
  
  // constants
  var TILE_SIZE = 16,
      NUM_COLUMNS = 15,
      NUM_ROWS = 10,
      GAME_WIDTH = NUM_COLUMNS * TILE_SIZE, // 240
      GAME_HEIGHT = NUM_ROWS * TILE_SIZE, // 160
      DEBUG = true;

  // vars
  var _game = null,
      _map = null,
      _player = null,
      _tonberry = null,

      // reference for code reduction
      _keyboardInput = null;


  // auto initialization
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
        update: update,
        render: render
      }
    );

    // create map
    _map = new Map(_game);

    // create player
    _player = new Player(_game, _map);
    _tonberry = new NPC(_game, _map);
  }

  function preload() {
    _map.preload();
    _player.preload();
    _tonberry.preload();
  }

  function create() {
    // set references
    _keyboardInput = _game.input.keyboard;

    // init game objects
    _map.init();
    _player.init({x: 1, y: 1})
    _tonberry.init({x: 7, y: 1});
  }

  function update() {
    _player.update(
      _keyboardInput.isDown(Phaser.Keyboard.UP),
      _keyboardInput.isDown(Phaser.Keyboard.RIGHT),
      _keyboardInput.isDown(Phaser.Keyboard.DOWN),
      _keyboardInput.isDown(Phaser.Keyboard.LEFT)
    );
    _tonberry.update();
  }

  function render() {
    if(DEBUG) {
      _map.drawSurroundingCollisions();
    }
  }
  
})();