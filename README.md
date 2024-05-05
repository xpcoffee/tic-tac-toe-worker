# tic-tac-toe worker

A Cloudflare worker which serves as the backend for a tic-tac-toe game.

**Note: this worker is currently stateless.** 
It takes in state and a request and provides the resulting state.

## Development

Install dependencies
```
npm install
```

Run the worker locally
```
npm run start
```

Deploy the worker
```
npx wrangler deploy
```

## API

### `POST`- Ask the server to play the next move

**Request** 

 - Header: `content-type: application/json`
 - Body: JSON payload of the game state and the player that the server needs make the next move for.

```typescript
{
    playerToMove: 0 | 1, // the player which needs to take the next
    board: {
        state: (0|1|null)[], // the state of the board
    }
}
```

**Response** 

 - Header: `content-type: application/json`
 - Body: JSON payload.

```typescript
{
    board: {
        size: 3, // the size (dimension) of the board
        state: (0|1|null)[], // the state of the board
        status: "active" | "draw" | "winner X" | "winner O" // the status of the board
    }
}
```
