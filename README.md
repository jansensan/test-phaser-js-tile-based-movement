# PhaserJS - Tile-Based Movement Prototype

## About

Implementing a tile based movement game prototype. Based on [PhaserJS's Coding Tip #5](http://www.photonstorm.com/phaser/phaser-coding-tips-5).

[See the demo](https://rawgit.com/jansensan/test-phaser-js-tile-based-movement/master/src/index.html).

## Known Issues

### NPC collision detection

For some reason, Phaser's Arcade Physics engine didn't handle collision detection. In its stead, I implemented my own tile-based collision system and movement.

The player and NPCs set collisions on the tile they occupy. They also clear the collision on the tile they left.

- [Issue with collision detection](https://github.com/jansensan/test-phaser-js-tile-based-movement/issues/2)

## TODOs

- [Test A* algorithm on clicking a valid tile](https://github.com/jansensan/test-phaser-js-tile-based-movement/issues/4)