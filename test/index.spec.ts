import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { PlayerX, PlayerO, Player } from "../src/types"
import { getBoard, checkDrawCondition, checkWinCondition } from '../src/rulesLogic';
import { MoveRequest, playRandomMove } from '../src/playerLogic';

describe('tic-tac-toe worker', () => {
    it('can play a game', async () => {
        let player: Player = PlayerX
        let gameState: any = getBoard();

        for (let move = 0; move < 9; move++) {
            if (gameState.status !== "active") {
                break
            }
            const moveRequest: MoveRequest = {
                board: gameState,
                playerToMove: player
            }
            const response = await SELF.fetch('https://worker.com', { method: "POST", body: JSON.stringify(moveRequest), headers: { ["content-type"]: "application/json" } })
            gameState = await (response).json();

            // alternate between players
            player = player === PlayerX ? PlayerO : PlayerX
        }

        expect(gameState.status).not.toEqual("active");
    });

    it("returns a win condition without playing an extra move", async () => {
        const boardWithWinner = getBoard([1, null, null, 1, null, null, 1, 0, 0])
        const moveRequest: MoveRequest = {
            board: boardWithWinner,
            playerToMove: PlayerO,
        }

        const response = await SELF.fetch('https://worker.com', { method: "POST", body: JSON.stringify(moveRequest), headers: { ["content-type"]: "application/json" } })
        const result: any = await (response).json();

        expect(result).toEqual({ ...boardWithWinner, status: "winner X" })
    })

    describe("playing moves", () => {
        it("will play random moves", () => {
            const player = PlayerX
            const otherPlayer = PlayerO
            const moves = 3
            let board = getBoard();
            for (let i = 0; i < moves; i++) {
                board = playRandomMove({ board, playerToMove: player })
            }

            const movesPlayed = board.state.filter(value => value === player)
            const movesThatShouldNotBePlayed = board.state.filter(value => value === otherPlayer)

            expect(movesPlayed.length).toEqual(moves)
            expect(movesThatShouldNotBePlayed.length).toEqual(0)
        })
    })

    it("can check draw conditions", () => {
        expect(checkDrawCondition(getBoard(
            [
                null, null, null,
                null, null, null,
                PlayerX, PlayerX, null
            ]
        ))
        ).toEqual(false)

        expect(checkDrawCondition(getBoard(
            [
                PlayerO, PlayerO, PlayerX,
                PlayerX, null, PlayerO,
                PlayerX, PlayerX, PlayerO
            ]
        ))
        ).toEqual(false)

        expect(checkDrawCondition(getBoard(
            [
                PlayerO, PlayerO, PlayerX,
                PlayerX, PlayerO, PlayerO,
                PlayerX, PlayerX, PlayerO
            ]
        ))
        ).toEqual(true)
    })

    describe("win condition checking", () => {
        it("returns the winning player for a row win", () => {
            const board = getBoard(
                [
                    null, null, null,
                    null, null, null,
                    PlayerX, PlayerX, PlayerX
                ]
            )
            expect(checkWinCondition(board)).toEqual(PlayerX)
        })

        it("returns the winning player for a column win", () => {
            const board = getBoard(
                [
                    null, null, PlayerO,
                    null, null, PlayerO,
                    null, null, PlayerO
                ]
            )
            expect(checkWinCondition(board)).toEqual(PlayerO)

        })

        it("returns the winning player for a left diagonal win", () => {
            const board = getBoard(
                [
                    PlayerX, null, null,
                    null, PlayerX, null,
                    null, null, PlayerX
                ]
            )
            expect(checkWinCondition(board)).toEqual(PlayerX)
        })

        it("returns the winning player for a right diagonal win", () => {
            const board = getBoard(
                [
                    null, null, PlayerO,
                    null, PlayerO, null,
                    PlayerO, null, null
                ]
            )
            expect(checkWinCondition(board)).toEqual(PlayerO)
        })
    })
});

