# Memory, Matching, Sequencing Game
A timed matching, sequencing, pattern-recognition game.

### Rules

 - Don't click the same cell twice.
 - Click all cells of one type before clicking a cell with different type.
 - The goal is to match similar cells on a grid.
 - Click all cells of the same type to win. Without clicking the same cell twice.
 - After clicking all cells of the same type: Begin a new type.

### How to Win

 - Click the cells in the correct order; Don't click the same cell twice.
 - Click every cell of the same type. Without clicking the same cell twice.
 - After clicking every cell of the same type, click a different type and continue

...After clicking every cell in the game-area, clicking all similar cells sequentially, without clicking the same cell twice: You Win!

 - **Try again with more cells**

### Author's Notes

Designed to be a dynamic, multi-purpose dialogue.

The goals of this project are:

1. To be accessible, the cards/cell-variants in this game are all uniquely identifiable. And (I'm hoping) color-blindness proof.
2. To help people exercise their brains.

The game.js file takes 4 arguments: cells wide, cells high, number of cell types, number of each cell type.

The game.js file includes logic for diverting unsolvable game configurations. (not applicable when all 4 game arguments are equal)

Each element the grid includes semantic css classes.
