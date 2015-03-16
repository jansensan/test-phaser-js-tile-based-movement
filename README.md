# PhaserJS - Tile-Based Movement Prototype

## About

Implementing a tile based movement game prototype. Based on [PhaserJS's Coding Tip #5](http://www.photonstorm.com/phaser/phaser-coding-tips-5).

[See the demo](https://rawgit.com/jansensan/test-phaser-js-tile-based-movement/master/src/index.html).

## Known Issues

### Phaser's Arcade Physics vs. collision detection

For some reason, Phaser's Arcade Physics engine didn't handle collision detection. In its stead, I implemented my own tile-based collision system and movement.

### NPC collision detection

The player and NPCs set collisions on the tile they occupy. They also clear the collision on the tile they left.

In the case where an NPC moves in a corridor (one tile width only), and where the player tries to corner the moving NPC, there may be a moment where the collision fails and the NPC walks over the player as if there was no collision there. Maybe adding a small timer for the NPC to choose in which direction to go would cover this possible race condition.

## TODOs

- NPCs and player
  - See if possible to create a super class that encompasses common behavior. ES6 or LoDash?
- Test A* algorithm on clicking a valid tile