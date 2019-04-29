# js-amazons
A Javascript implementation of the Game of the Amazons.

## How to play Amazons ?

You can learn how to play the Game of Amazons by watching this (awesome) video :

[![A final game with Elwyn Berlekamp (Amazons) - Numberphile](https://img.youtube.com/vi/kjSOSeRZVNg/0.jpg)](https://www.youtube.com/watch?v=kjSOSeRZVNg)

## Example code

```js
// Create a new game
let amazons = new Amazons();

console.log(`Board state :\n${amazons.ascii()}`);

// Keep the game going until someone won
while (!amazons.gameOver()) {
    // Get all possible moves
    let moves = amazons.moves();
    console.log(`${amazons.turn() === Amazons.STATE_WHITE ? 'White' : 'Black'} plays : ${moves.length} possible moves.`);
    // Select a random move
    let move = moves[Math.floor(Math.random() * moves.length)];
    console.log(`Chosen move : ${move}`);
    // Use the selected move
    amazons.move(move);
    console.log(`Board state :\n${amazons.ascii()}`);
}
// Someone won
if (amazons.state() === Amazons.STATE_WHITE_WON) {
    console.log(`White player won.`);
} else {
    console.log(`Black player won.`);
}
// Print game history
console.log(`History : ${amazons.history()}`);
```

## API

### Cell notation

There are two ways to specify a board cell :
```js
    let cell = 'C8'; // Column C, Row 8 (just like in chess : the most bottom-left cell is "A1")
    let cell = [2, 0]; // Column 2, Row 0 (!! arrays start at 0 !!)
```

### Constructor: Amazons([ history ], [ config ])
The Chess() constructor takes two optional parameters :

- history: a string or array that contains a list of moves.
- config: an object that contains configuration parameters.


```js
// Default behaviour
let amazons = new Amazons();

// Pass in a game that has already started
let amazons = new Amazons('A4:A3:A2,D10:D5:D8,J4:H2:A9,A7:A6:F6,D1:C1:C8,J7:I6:D1');
let amazons = new Amazons(['A4:A3:A2','D10:D5:D8','J4:H2:A9','A7:A6:F6','D1:C1:C8','J7:I6:D1']);

// Change the default configuration
let amazons = new Amazons(null, {
    // Width of the board
    boardWidth: 6,
    // Height of the board
    boardHeight: 6,
    // Placement of the white pieces
    whitePieces: [
        [2, 0], [3, 5]
    ],
    // Placement of the black pieces
    blackPieces: [
        [0, 3], [5, 2]
    ]
});
```

### .clear()
Clears the board and restarts the game.

```js
amazons.clear();
amazons.history();
// -> []
```

### .load(history)
The board is cleared, and the moves are played.

```js
let amazons = new Amazons();
amazons.load(['A4:A3:A2', 'D10:D5:D8', 'J4:H2:A9']);
amazons.history();
// -> ['A4:A3:A2', 'D10:D5:D8', 'J4:H2:A9']

amazons.clear();
amazons.history();
// -> []

amazons.load('A4:A3:A2,D10:D5:D8,J4:H2:A9');
amazons.history();
// -> ['A4:A3:A2', 'D10:D5:D8', 'J4:H2:A9']
```

### .board()
Returns an 2D array representation of the current position.

```js
let amazons = new Amazons();

amazons.board();
// => [
//     [0,0,0,2,0,0,2,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [2,0,0,0,0,0,0,0,0,2],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [1,0,0,0,0,0,0,0,0,1],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,1,0,0,1,0,0,0]
//   ]
```

### .ascii()
Returns a string containing an ASCII diagram of the current position.

```js
let amazons = new Amazons();

// make some moves
amazons.move('A4:A3:A2');
amazons.move('D10:D5:D8');
amazons.move('J4:H2:A9');

amazons.ascii();
// +---------------------+
// | . . . . . . B . . . |
// | O . . . . . . . . . |
// | . . . O . . . . . . |
// | B . . . . . . . . B |
// | . . . . . . . . . . |
// | . . . B . . . . . . |
// | . . . . . . . . . . |
// | W . . . . . . . . . |
// | O . . . . . . W . . |
// | . . . W . . W . . . |
// +---------------------+
```

### .state()
Returns the current state of the game.
State can either be :
- Amazons.STATE_WHITE (white player's turn to move)
- Amazons.STATE_BLACK (black player's turn to move)
- Amazons.STATE_WHITE_WON (white player won)
- Amazons.STATE_BLACK_WON (black player won).

```js
let amazons = new Amazons();
amazons.state();
// -> 0 -> STATE_WHITE

amazons.move('A4:A3:A2');
amazons.state();
// -> 1 -> STATE_BLACK
```

### .game_over()
Returns true if the game has ended, false otherwise.

```js
let amazons = new Amazons();
amazons.game_over();
// -> false
```

### .turn()
Returns which player's turn it is.
Turn can either be :
- Amazons.STATE_WHITE (white player's turn to move)
- Amazons.STATE_BLACK (black player's turn to move)
- null (the game has ended)

```js
let amazons = new Amazons();
amazons.turn();
// -> 0 -> STATE_WHITE

amazons.move('A4:A3:A2');
amazons.turn();
// -> 1 -> STATE_BLACK
```

### .history()
Returns a list containing the moves of the current game.

```js
let amazons = new Amazons();

// make some moves
amazons.move('A4:A3:A2');
amazons.move('D10:D5:D8');
amazons.move('J4:H2:A9');

amazons.history();
// -> ['A4:A3:A2', 'D10:D5:D8', 'J4:H2:A9']
```

### .moves(), .movesIndex()
Returns a list of possible moves (respectively using cell names and cell [column, row] indexes).

### .get(cell), .getFromIndex(col, row)
Returns the content of the cell (respectively using cell names and cell [column, row] indexes).
Content can either be :
- Amazons.CELL_EMPTY (empty cell)
- Amazons.CELL_WHITE (white piece)
- Amazons.CELL_BLACK (black piece)
- Amazons.CELL_ARROW (arrow).

```js
let amazons = new Amazons();

amazons.get('C6');
// -> 1 -> CELL_WHITE
amazons.getFromIndex(5, 2);
// -> 2 -> CELL_BLACK
```

### .isPlayingPiece(col, row)
Returns true id the cell contains a piece that belongs to the player who has to play, false otherwise.

```js
let amazons = new Amazons();

amazons.isPlayingPiece(2, 0);
// -> true
amazons.getFromIndex(0, 3);
// -> false
```

### .isEmpty(col, row)
Returns true if the cell is empty, false otherwise.

```js
let amazons = new Amazons();

amazons.isEmpty(2, 0);
// -> false
amazons.isEmpty(4, 3);
// -> true
```
