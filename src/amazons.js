class Amazons {

    static get CELL_EMPTY() {
        return 0;
    }
    static get CELL_WHITE() {
        return 1;
    }
    static get CELL_BLACK() {
        return 2;
    }
    static get CELL_ARROW() {
        return 4;
    }

    static get STATE_WHITE() {
        return 0;
    }
    static get STATE_BLACK() {
        return 1;
    }
    static get STATE_WHITE_WON() {
        return 2;
    }
    static get STATE_BLACK_WON() {
        return 4;
    }

    static get DIRECTIONS() {
        return [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1]
        ];
    }

    // Initialization

    constructor(history = null, config = {}) {

        // Load configuration
        this.config = {
            boardWidth: 10,
            boardHeight: 10,
            whitePieces: [
                [0, 6],
                [3, 9],
                [6, 9],
                [9, 6]
            ],
            blackPieces: [
                [0, 3],
                [3, 0],
                [6, 0],
                [9, 3]
            ]
        };
        Object.assign(this.config, config);

        // Create notation map
        this.notation = {};
        this.rowNotation = [];
        this.colNotation = [];
        for (let row = this.config.boardHeight, rowNot = 1; --row >= 0; ++rowNot) {
            this.notation[rowNot] = row;
            this.rowNotation[row] = rowNot;
        }
        for (let col = 0; col <= this.config.boardWidth; ++col) {
            let colNot = '';
            let tmpCol = col;

            do {
                colNot = String.fromCharCode('A'.charCodeAt(0) + (tmpCol % 26)) + colNot;
                tmpCol = (tmpCol - (tmpCol % 26)) / 26;
                --tmpCol;
            } while (tmpCol >= 0);
            this.notation[colNot] = col;
            this.colNotation[col] = colNot;
        }

        // Cleanup config
        this.config.whitePieces = this.config.whitePieces.map(x => (typeof x == 'string' || x instanceof String) ? this.cellToIndex(x) : x);
        this.config.blackPieces = this.config.blackPieces.map(x => (typeof x == 'string' || x instanceof String) ? this.cellToIndex(x) : x);

        // Initialize board
        if (history !== null) {
            this.load(history);
        } else {
            this.clear();
        }
    }

    clear() {
        // Create board
        this._board = Array(this.config.boardHeight).fill(0).map(x => Array(this.config.boardWidth).fill(Amazons.CELL_EMPTY));

        // Put pieces
        this.whitePieces = this.config.whitePieces;
        for (let p of this.whitePieces) {
            this.putFromIndex(Amazons.CELL_WHITE, ...p.flat(1));
        }
        this.blackPieces = this.config.blackPieces;
        for (let p of this.blackPieces) {
            this.putFromIndex(Amazons.CELL_BLACK, ...p.flat(1));
        }

        // Moves hostory
        this._history = [];

        // White turn
        this.status = Amazons.STATE_WHITE;
    }

    load(history) {
        this.clear();

        if (typeof history == 'string' || history instanceof String) {
            history = history.split(',');
        }

        history.forEach(move => this.move(move));
    }

    put(piece, cell) {
        return this.putFromIndex(piece, ...this.cellToIndex(cell));
    }

    putFromIndex(piece, col, row) {
        this._board[row][col] = piece;
    }

    remove(cell) {
        return this.put(Amazons.CELL_EMPTY, cell);
    }

    removeFromIndex(col, row) {
        return this.putFromIndex(Amazons.CELL_EMPTY, col, row);
    }

    // Actions

    move(move) {
        return this.moveFromIndex(...this.getMoveIndex(move));
    }

    moveFromIndex(fromCol, fromRow, toCol, toRow, atkCol, atkRow) {
        // No player's piece at "from" cordinates
        if (!this.isPlayingPiece(fromCol, fromRow)) {
            throw `Cell ${this.indexToCell(fromCol, fromRow)} (${fromCol},${fromRow}) does not contain a player's piece.`;
        }

        // Invalid move (either the piece can't move or can't fire)
        if (!this.isValidMoveFromIndex(fromCol, fromRow, toCol, toRow, atkCol, atkRow)) {
            throw `Invalid move.`;
        }

        let whitePlaying = this.turn() === Amazons.STATE_WHITE;

        // Update board
        this.putFromIndex(whitePlaying ? Amazons.CELL_WHITE : Amazons.CELL_BLACK, toCol, toRow);
        this.removeFromIndex(fromCol, fromRow);
        this.putFromIndex(Amazons.CELL_ARROW, atkCol, atkRow);

        // Update pieces list
        let pieces = [];
        for (let piece of whitePlaying ? this.whitePieces : this.blackPieces) {
            pieces.push(piece[0] === fromCol && piece[1] === fromRow ? [toCol, toRow] : piece);
        }
        if (whitePlaying) {
            this.whitePieces = pieces;
        } else {
            this.blackPieces = pieces;
        }

        // Update game status
        let gameOver = true;
        for (let piece of whitePlaying ? this.blackPieces : this.whitePieces) {
            if (!this.isSurrounded(...piece)) {
                gameOver = false;
            }
        }
        this.status = whitePlaying ?
            (gameOver ? Amazons.STATE_WHITE_WON : Amazons.STATE_BLACK) :
            (gameOver ? Amazons.STATE_BLACK_WON : Amazons.STATE_WHITE);

        // Update history
        this._history.push(`${this.indexToCell(fromCol, fromRow)}:${this.indexToCell(toCol, toRow)}:${this.indexToCell(atkCol, atkRow)}`);
    }

    // Game state

    board() {
        return this._board;
    }

    ascii() {
        let bar = '+-' + Array(this._board.length).fill('-').join('-') + '-+';
        return bar + "\n" + this._board.map(x => {
            return `| ${x.map(y => {
                switch (y) {
                    case Amazons.CELL_EMPTY:
                        return '.';
                        break;
                    case Amazons.CELL_WHITE:
                        return 'W';
                        break;
                    case Amazons.CELL_BLACK:
                        return 'B';
                        break;
                    case Amazons.CELL_ARROW:
                        return 'O';
                        break;
                }
            }).join(' ')} |`;
        }).join("\n") + "\n" + bar;
    }

    state() {
        return this.status;
    }

    gameOver() {
        return this.status === Amazons.STATE_WHITE_WON || this.status === Amazons.STATE_BLACK_WON;
    }

    turn() {
        return this.status !== Amazons.STATE_WHITE_WON && this.status !== Amazons.STATE_BLACK_WON ? this.status : null;
    }

    history() {
        return this._history;
    }

    // Strategy

    moves() {
        return this.movesIndex().map(x => this.indexToCell(x[0], x[1]) + ':' + this.indexToCell(x[2], x[3]) + ':' + this.indexToCell(x[4], x[5]));
    }

    movesIndex() {
        if (this.gameOver()) {
            return null;
        }

        let moves = [];

        let pieces = this.status === Amazons.STATE_WHITE ? this.whitePieces : this.blackPieces;

        moves = pieces.map(piece => {
            return this.getLineOfSight(...piece).map(los => {
                return this.getLineOfSight(...los, ...piece).map(x => [...piece, ...los, ...x]);
            }).flat(1);
        }).flat(1);

        return moves;
    }

    get(cell) {
        return this.getFromIndex(this.cellToIndex(cell));
    }

    getFromIndex(col, row) {
        return this._board[row] !== undefined ? this._board[row][col] : null;
    }

    isPlayingPiece(col, row) {
        return this.getFromIndex(col, row) === (this.status === Amazons.STATE_WHITE ? Amazons.CELL_WHITE : Amazons.CELL_BLACK);
    }

    isEmpty(col, row) {
        return this.getFromIndex(col, row) === Amazons.CELL_EMPTY;
    }

    isValidMove(move) {
        return this.isValidMoveFromIndex(...this.getMoveIndex(move));
    }

    isValidMoveFromIndex(fromCol, fromRow, toCol, toRow, atkCol, atkRow) {
        return this.hasLineOfSight(fromCol, fromRow, toCol, toRow) &&
            this.hasLineOfSight(toCol, toRow, atkCol, atkRow, fromCol, fromRow);
    }

    isSurrounded(col, row) {
        for (let dir of Amazons.DIRECTIONS) {
            if (this.isEmpty(col + dir[0], row + dir[1])) {
                return false;
            }
        }

        return true;
    }

    getLineOfSight(col, row, ignoreCol = null, ignoreRow = null) {
        let los = [];

        for (let dir of Amazons.DIRECTIONS) {
            for (let dist = 1, x = col + dir[0], y = row + dir[1];
                (x === ignoreCol && y === ignoreRow) || this.isEmpty(x, y); x += dir[0], y += dir[1]) {
                los.push([x, y]);
            }
        }

        return los;
    }

    hasLineOfSight(fromCol, fromRow, toCol, toRow, ignoreCol = null, ignoreRow = null) {
        let dirCol = fromCol == toCol ? 0 :
            (fromCol > toCol ? -1 : 1);
        let dirRow = fromRow == toRow ? 0 :
            (fromRow > toRow ? -1 : 1);

        // Move is not in a straight line
        if (dirCol !== 0 && dirRow !== 0 && Math.abs(dirCol) !== Math.abs(dirRow)) {
            return false;
        }

        // (Because you're mine)
        // I walk the line
        for (let x = fromCol + dirCol, y = fromRow + dirRow;
            (x === ignoreCol && y === ignoreRow) || this.isEmpty(x, y); x += dirCol, y += dirRow) {
            // Desired point reached
            if (x === toCol && y === toRow) {
                return true;
            }
        }

        return false;
    }

    // Other stuff

    cellToIndex(cell) {
        let matches = cell.match(/([A-Z]+)(\d+)/);

        // Wrong cordinates format
        if (matches.length !== 3) {
            throw `Cordinates ${cell} cannot be resolved to a board cell.`;
        }

        return matches.slice(1).map(x => this.notation[x]);
    }

    indexToCell(col, row) {
        return `${this.colNotation[col]}${this.rowNotation[row]}`;
    }

    getMoveCells(move) {
        let moveCells = move.split(':');

        // Wrong move format
        if (moveCells.length !== 3) {
            throw `Move ${move} cannot be resolved to a valid move.`;
        }

        return moveCells;
    }

    getMoveIndex(move) {
        return this.getMoveCells(move).map(cord => this.cellToIndex(cord)).flat(1);
    }
}

/* istanbul ignore next */
if (typeof exports !== 'undefined') {
    exports.Amazons = Amazons;
}
/* istanbul ignore next */
if (typeof define !== 'undefined') {
    define(function() {
        return Amazons;
    });
}
