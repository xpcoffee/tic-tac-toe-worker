import { determineBoardStatus, getBoard } from "./rulesLogic";
import { isMoveRequest, playRandomMove } from "./playerLogic";

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // initialize a new game
        if (request.method === "GET") {
            const board = getBoard()
            return new Response(JSON.stringify(board));
        }

        // send a move; get the next state
        if (request.method === "POST") {
            const contentType = request.headers.get("content-type");
            if (!contentType?.includes("application/json")) {
                return new Response("Bad request. Expecting 'application/json'.", { status: 400 })
            }

            const requestPayload = await request.json()
            if (!(requestPayload !== null && typeof requestPayload === "object" && isMoveRequest(requestPayload))) {
                return new Response("Bad request. Board not valid.", { status: 400 })
            }

            let board = playRandomMove(requestPayload)
            board.status = determineBoardStatus(board)

            return new Response(JSON.stringify(board));
        }

        return new Response("unkown operation", { status: 404 })
    },
};
