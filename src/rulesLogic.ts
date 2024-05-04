import { Board, BoardState, BoardStatus, Player, PlayerO, PlayerX } from "./types"


/**
 * This file holds logic used to understand, validate and work with tic-tac-toe board state (game rules).
 * 
 * TODO
 *  - validation of valid board states (make sure a board state has correct number of moves of each player)
 *  - check for a draw earlier (might notice draws a few moves before the board is full)
 */

export function getBoard(state: BoardState | undefined = Array(3 * 3).fill(null), status: BoardStatus = "active"): Board {
    return { size: 3, state, status }
}

export function determineBoardStatus(board: Board) {
    const winner = checkWinCondition(board)
    if (winner == PlayerO) {
        return "winner O"
    } else if (winner == PlayerX) {
        return "winner X"
    } else if (checkDrawCondition(board)) {
        return "draw"
    }
    return "active"
}

export function checkDrawCondition({ state }: Board): boolean {
    const movesLeft = state.find(value => value == null)
    return movesLeft === undefined
}

// cloud replace by equality checks of known board wins; would bloat program for larger boards, though
export function checkWinCondition(board: Board): Player | undefined {
    // important to use ?? here to differentiate between 0 and undefined
    return checkRowWinCondition(board) ?? checkColumnWinCondition(board) ?? checkDiagonalWinCondition(board)
}

export function checkRowWinCondition({ state: data, size }: Board): Player | undefined {
    for (let row = 0; row < size; row++) {
        let player = data[row * size]
        if (player === null) {
            continue
        }

        for (let column = 1; column < size; column++) {
            if (data[row * size + column] !== player) {
                break;
            }

            if (column === size - 1) {
                return player
            }
        }
    }
}

export function checkColumnWinCondition({ state: data, size }: Board): Player | undefined {
    for (let column = 0; column < size; column++) {
        let player = data[column]
        if (player === null) {
            continue
        }

        for (let row = 1; row < size; row++) {
            if (data[row * size + column] !== player) {
                break;
            }

            if (row === size - 1) {
                return player
            }
        }
    }
}

export function checkDiagonalWinCondition({ state: data, size }: Board): Player | undefined {
    const middleIndex = (Math.floor(size / 2) * size) + (Math.floor(size / 2) + 1) - 1
    const middle = data[middleIndex]

    if (middle === null) {
        return undefined
    }

    let leftDiagonalValid = true;
    let rightDiagonalValid = true;
    for (let i = 0; (i < size) && (leftDiagonalValid || rightDiagonalValid); i++) {
        const leftDiagonalValue = data[(size * i) + i]
        const rightDiagonalValue = data[(size * i) + (size - i) - 1]
        if (leftDiagonalValue !== middle) {
            leftDiagonalValid = false
        }
        if (rightDiagonalValue !== middle) {
            rightDiagonalValid = false
        }
    }
    return (leftDiagonalValid || rightDiagonalValid) ? middle : undefined
}