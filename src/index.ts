/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        if(request.method === "GET") {
            const board = getNewBoard()
            return new Response(JSON.stringify(board));
        }

        if(request.method === "POST") {
            const board = getNewBoard()
            return new Response(JSON.stringify(board));
        }

        return new Response("unkown operation", {status: 404})
	},
};

export type Board = {
    // the dimension of the board
    // currently always 3, but could be extendended
    // boards are square, and have odd dimension (otherwise diagonals won't work)
    size: 3,
    /**
     * data is a single-dimenional array where rows "wrap" after size.
     * note: could optimize using binary
     * e.g. if size is 3
     * [
     *  0, 1 ,2
     *  3, 4, 5,
     *  6, 7, 8
     * ]
     */ 
    state: BoardState
}
type BoardState = (Player | null)[]

// x = 1, o = 0, undefined = empty
export type Player = typeof PlayerX | typeof PlayerO;
export const PlayerX = 1;
export const PlayerO = 0;

export function getNewBoard(state: BoardState | undefined = Array(3 * 3).fill(null)): Board {
    return  { size: 3, state }
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