import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import {PlayerX, checkWinCondition, getNewBoard, Board, PlayerO} from "../src"

describe('tic-tac-toe worker', () => {
	it('responds with an empty game state on fetch', async () => {
        const expected = JSON.stringify(getNewBoard())

		const response = await SELF.fetch('https://haha.com');
		expect(await response.text()).toEqual(expected);
	});

    describe("win condition checking", () => {
        it("returns the winning player for a row win", () => {
            const board = getNewBoard(
                [
                    null , null, null,
                    null, null , null,
                    PlayerX, PlayerX, PlayerX
                ]
            )
            expect(checkWinCondition(board)).toEqual(PlayerX)
        })

        it("returns the winning player for a column win", () => {
            const board = getNewBoard(
                [
                    null , null, PlayerO,
                    null, null , PlayerO,
                    null, null, PlayerO
                ]
            )
            expect(checkWinCondition(board)).toEqual(PlayerO)
        })

        it("returns the winning player for a left diagonal win", () => {
            const board = getNewBoard(
                [
                    PlayerX, null, null,
                    null, PlayerX, null,
                    null, null, PlayerX
                ]
            )
            expect(checkWinCondition(board)).toEqual(PlayerX)
        })

        it("returns the winning player for a right diagonal win", () => {
            const board = getNewBoard(
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

