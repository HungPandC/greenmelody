import type { AccessTokenPayload } from "./typeAuth";

declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}

export {};