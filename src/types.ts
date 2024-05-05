export type Board = {
    // the dimension of the board
    // currently always 3, but could be extendended
    // boards are square, and have odd dimension (otherwise diagonals won't work)
    size: 3,
    /**
     * data is a single-dimenional array where rows "wrap" after size.
     * note: could probably optimize using binary (though would need to consider how to represent "empty" state")
     * e.g. if size is 3
     * [
     *  0, 1 ,2
     *  3, 4, 5,
     *  6, 7, 8
     * ]
     */ 
    state: BoardState,
    status: BoardStatus
}
export type BoardState = (Player | null)[]
export type BoardStatus = "active"| "winner X"| "winner O"| "draw"

// x = 1, o = 0, undefined = empty
export type Player = typeof PlayerX | typeof PlayerO;
export const PlayerX = 1;
export const PlayerO = 0;
