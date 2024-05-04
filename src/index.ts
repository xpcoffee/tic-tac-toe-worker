import {Board, BoardState, BoardStatus, Player, PlayerO} from "./types"

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // initialize a new game
        if(request.method === "GET") {
            const board = getBoard()
            return new Response(JSON.stringify(board));
        }

        // send a move; get the next state
        if(request.method === "POST") {
            const board = getBoard()
            return new Response(JSON.stringify(board));
        }

        return new Response("unkown operation", {status: 404})
	},
};

export function getBoard(state: BoardState | undefined = Array(3 * 3).fill(null), status: BoardStatus = "active"): Board {
    return  { size: 3, state, status }
}

export function playRandomMove({state}: Board): Board {
    const possibleMoves = state.map((value, index) => {
        return value === null ? index : undefined
    }).filter((indexValue): indexValue is number => indexValue !== undefined)

    const move = Math.floor(Math.random() * possibleMoves.length)
    const moveIndex = possibleMoves[move]
    const newState = [...state]
    newState[moveIndex] = PlayerO

    return getBoard(newState)
}

export function checkDrawCondition({state}: Board): boolean {
    const movesLeft = state.find(value => value == null)
    return movesLeft === undefined
}

// cloud replace by equality checks of known board wins; would bloat program for larger boards, though
export function checkWinCondition(board: Board): Player | undefined {
    // important to use ?? here to differentiate between 0 and undefined
    return checkRowWinCondition(board) ?? checkColumnWinCondition(board) ?? checkDiagonalWinCondition(board)
}

function checkRowWinCondition({state: data, size}: Board): Player | undefined {
    for(let row = 0; row < size; row++) {
        let player = data[row*size]
        if(player === null) {
            continue
        }

        for(let column = 1; column < size; column++) {
            if(data[row*size + column] !== player) {
                break;
            }

            if(column === size - 1) {
                return player
            }
        }
    }
}

function checkColumnWinCondition({state: data, size}: Board): Player | undefined {
    for(let column = 0; column < size; column++) {
        let player = data[column]
        if(player === null) {
            continue
        }

        for(let row = 1; row < size; row++) {
            console.log({column, row, value: data[row*size + column]})
            if(data[row*size + column] !== player) {
                break;
            }

            if(row === size - 1) {
                return player
            }
        }
    }
}

function checkDiagonalWinCondition({state: data, size}: Board): Player | undefined {
    const middleIndex = (Math.floor(size / 2) * size) + (Math.floor(size / 2) + 1) - 1
    const middle = data[middleIndex]

    if(middle === null) {
        return undefined
    }

    let leftDiagonalValid = true;
    let rightDiagonalValid = true;
    for(let i = 0; (i < size) && (leftDiagonalValid || rightDiagonalValid); i++) {
        const leftDiagonalValue = data[(size * i) + i]
        const rightDiagonalValue = data[(size * i) + (size - i) - 1]
        if(leftDiagonalValue !== middle) {
            leftDiagonalValid = false
        }
        if(rightDiagonalValue !== middle) {
            rightDiagonalValid = false
        }
    }
    return (leftDiagonalValid || rightDiagonalValid) ? middle : undefined
}