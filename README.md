# tic-tac-toe worker

A Cloudflare worker which serves as the backend for a tic-tac-toe game.

### `GET` - Start a new game

**Request**
Parameters: none

**Response**
```typescript
{
    board: {
        size: 3, // the size (dimension) of the board
        state: (0|1|null)[], // the state of the board
        status: "active" // the status of the board
    }
}
```

### `POST`- Ask the server to play the next move

**Request** 
Header: `content-type: application/json`
Body: JSON payload of the game state and the player that the server needs make the next move for.

```typescript
{
    playerToMove: 0 | 1, // the player which needs to take the next
    board: {
        size: 3, // the size (dimension) of the board
        state: (0|1|null)[], // the state of the board
        status: "active" // the status of the board
    }
}
```

**Response** 
Header: `content-type: application/json`
Body: JSON payload.

```typescript
{
    playerToMove: 0 | 1, // the player which needs to take the next
    board: {
        size: 3, // the size (dimension) of the board
        state: (0|1|null)[], // the state of the board
        status: "active" // the status of the board
    }
}
```