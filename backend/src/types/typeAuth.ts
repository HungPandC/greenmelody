import { JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
    userId: string;
    type: "access";
}
export interface RefreshTokenPayload extends JwtPayload {
    userId: string;
    type: "refresh";
}