import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import {checkWinCondition, getBoard, playRandomMove} from "../src"
import {PlayerX,PlayerO} from "../src/types"

describe('tic-tac-toe worker', () => {
	it('responds with an empty game state on fetch', async () => {
        const expected = JSON.stringify(getBoard())

		const response = await SELF.fetch('https://haha.com');
		expect(await response.text()).toEqual(expected);
	});

    describe("playing moves", () => {
        it("will play random moves", () => {
            const moves = 3
            let board = getBoard();
            for(let i = 0; i < moves; i++) {
                board = playRandomMove(board)
            }

            const movesPlayed = board.state.filter(value => value === PlayerO)
            const movesThatShouldNotBePlayed = board.state.filter(value => value === PlayerX)

            expect(movesPlayed.length).toEqual(moves)
            expect(movesThatShouldNotBePlayed.length).toEqual(0)
        })
    })

    describe("win condition checking", () => {
        it("returns the winning player for a row win", () => {
            const board = getBoard(
                [
                    null , null, null,
                    null, null , null,
                    PlayerX, PlayerX, PlayerX
                ]
            )
            expect(checkWinCondition(board)).toEqual(PlayerX)
        })

        it("returns the winning player for a column win", () => {
            const board = getBoard(
                [
                    null , null, PlayerO,
                    null, null , PlayerO,
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

