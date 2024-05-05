import { determineBoardStatus } from "./rulesLogic";
import { isMoveRequest, playRandomMove } from "./playerLogic";

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const contentType = request.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
            return new Response("Bad request. Expecting 'application/json'.", { status: 400 })
        }

        const requestPayload = await request.json()
        if (!(requestPayload !== null && typeof requestPayload === "object" && isMoveRequest(requestPayload))) {
            return new Response("Bad request. Board not valid.", { status: 400 })
        }

        // check end condition before playing
        const currentStatus = determineBoardStatus(requestPayload.board)
        if (currentStatus !== "active") {
            return new Response(JSON.stringify({
                ...requestPayload.board,
                status: currentStatus
            }));
        }

        // play move
        let board = playRandomMove(requestPayload)
        board.status = determineBoardStatus(board)
        return new Response(JSON.stringify(board));
    },
};
