import { getBoard } from "./rulesLogic"
import { Board, Player } from "./types"

/**
 * This file holds logic used to decide on and play moves on a board.
 */

export function playRandomMove({ board: { state }, playerToMove: player }: MoveRequest): Board {
    const possibleMoves = state.map((value, index) => {
        return value === null ? index : undefined
    }).filter((indexValue): indexValue is number => indexValue !== undefined)
    const move = Math.floor(Math.random() * possibleMoves.length)

    const moveBoardIndex = possibleMoves[move]
    const newState = [...state]
    newState[moveBoardIndex] = player

    return getBoard(newState)
}

export type MoveRequest = {
    playerToMove: Player,
    board: Board,
}
// TODO actually do validation
export function isMoveRequest(obj: unknown): obj is MoveRequest {
    return true
}
