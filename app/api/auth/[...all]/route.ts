import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

export async function POST(request: Request) {
    // TODO: Add rate limiting here (like arcjet)
    return authHandlers.POST(request);
}