const assert = require('chai').assert;
const expect = require('chai').expect;

const Amazons = require('../src/amazons').Amazons;

let emptyBoard = [
	[0,0,0,2,0,0,2,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[2,0,0,0,0,0,0,0,0,2],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[1,0,0,0,0,0,0,0,0,1],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,1,0,0,1,0,0,0]
];
let boardWithHistory = [
	[0,0,0,0,0,0,2,0,0,0],
	[4,0,0,0,0,0,0,0,0,0],
	[0,0,4,4,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[2,0,0,0,0,4,0,0,2,0],
	[0,0,0,2,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[1,0,0,0,0,0,0,0,0,0],
	[4,0,0,0,0,0,0,1,0,0],
	[0,0,1,4,0,0,1,0,0,0]
];

let emptySmallBoard = [
	[0,0,0,1,0,0],
	[0,0,0,0,0,0],
	[2,0,0,0,0,0],
	[0,0,0,0,0,2],
	[0,0,0,0,0,0],
	[0,0,1,0,0,0]
];
let smallBoardWithHistory = [
	[0,0,0,4,0,0],
	[0,0,1,2,0,0],
	[0,0,0,2,0,0],
	[0,0,0,0,0,4],
	[0,0,0,0,0,0],
	[4,0,0,4,0,1]
];


describe('Basic constructor', function () {
	it('constructor : basic', function() {
		let az = new Amazons();
		expect(az.board()).to.eql(emptyBoard);
	});
	it('constructor : with flat history', function() {
		let az = new Amazons('A4:A3:A2,D10:D5:D8,J4:H2:A9,A7:A6:F6,D1:C1:C8,J7:I6:D1');
		expect(az.board()).to.eql(boardWithHistory);
	});
	it('constructor : with array history', function() {
		let az = new Amazons(['A4:A3:A2','D10:D5:D8','J4:H2:A9','A7:A6:F6','D1:C1:C8','J7:I6:D1']);
		expect(az.board()).to.eql(boardWithHistory);
	});
});

describe('Constructor with custom board', function () {
	it('constructor : basic', function() {
		let az = new Amazons(null, {
            boardWidth: 6,
            boardHeight: 6,
            whitePieces: [
                [3, 0],
                [2, 5]
            ],
            blackPieces: [
                [0, 2],
                [5, 3]
            ]
		});
		expect(az.board()).to.eql(emptySmallBoard);
	});
	it('constructor : small board with pieces cordinates', function() {
		let az = new Amazons(null, {
            boardWidth: 6,
            boardHeight: 6,
            whitePieces: [
                'C1',
                'D6'
            ],
            blackPieces: [
                'A4',
                'F3'
            ]
		});
		expect(emptySmallBoard).to.eql(az.board());
	});
	it('constructor : with flat history', function() {
		let az = new Amazons('C1:F1:A1,F3:D5:F3,D6:C5:D6,A4:D4:D1', {
            boardWidth: 6,
            boardHeight: 6,
            whitePieces: [
                'C1',
                'D6'
            ],
            blackPieces: [
                'A4',
                'F3'
            ]
		});
		expect(az.board()).to.eql(smallBoardWithHistory);
	});
	it('constructor : with array history', function() {
		let az = new Amazons(['C1:F1:A1','F3:D5:F3','D6:C5:D6','A4:D4:D1'], {
            boardWidth: 6,
            boardHeight: 6,
            whitePieces: [
                'C1',
                'D6'
            ],
            blackPieces: [
                'A4',
                'F3'
            ]
		});
		expect(az.board()).to.eql(smallBoardWithHistory);
	});
});

describe('Load and clear', function() {
	let az = new Amazons();
	it('load flat', function() {
		az.load('A4:A3:A2,D10:D5:D8,J4:H2:A9,A7:A6:F6,D1:C1:C8,J7:I6:D1');
		expect(az.board()).to.eql(boardWithHistory);
	});
	it('clear1', function() {
		az.clear();
		expect(az.board()).to.eql(emptyBoard);
	});
	it('load array', function() {
		let az = new Amazons();
		az.load(['A4:A3:A2','D10:D5:D8','J4:H2:A9','A7:A6:F6','D1:C1:C8','J7:I6:D1']);
		expect(az.board()).to.eql(boardWithHistory);
	});
	it('clear2', function() {
		az.clear();
		expect(az.board()).to.eql(emptyBoard);
	});
});

describe('Load and clear with custom board', function() {
	let az = new Amazons(null, {
        boardWidth: 6,
        boardHeight: 6,
        whitePieces: [
            [3, 0],
            [2, 5]
        ],
        blackPieces: [
            [0, 2],
            [5, 3]
        ]
	});
	it('load flat', function() {
		az.load('C1:F1:A1,F3:D5:F3,D6:C5:D6,A4:D4:D1');
		expect(az.board()).to.eql(smallBoardWithHistory);
	});
	it('clear1', function() {
		az.clear();
		expect(az.board()).to.eql(emptySmallBoard);
	});
	it('load array', function() {
		az.load(['C1:F1:A1','F3:D5:F3','D6:C5:D6','A4:D4:D1']);
		expect(az.board()).to.eql(smallBoardWithHistory);
	});
	it('clear2', function() {
		az.clear();
		expect(az.board()).to.eql(emptySmallBoard);
	});
});
