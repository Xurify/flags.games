import { NextRequest, NextResponse, userAgent } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const config = {
    // matcher tells Next.js which routes to run the middleware on.
    // This runs the middleware on all routes except for static assets.
    /*
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    matcher: ["/((?!_next/static|_next/image|favicon.ico|next-assets).*)"],
};

const middleware = async (req: NextRequest): Promise<NextResponse> => {
    const { device } = userAgent(req);

    const res = NextResponse.next();

    const deviceType = device.type === "mobile" ? "mobile" : "desktop";
    res.cookies.set("device_type", deviceType, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 24 * 365,
        path: "/",
    });

    let sessionToken = req.cookies.get("session_token")?.value;

    if (!sessionToken) {
        sessionToken = uuidv4();
        res.cookies.set("session_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600 * 24 * 365,
            path: "/",
            ...(process.env.NODE_ENV === "production" ? { domain: ".flags.games" } : {}),
        });
        return res;
    }

    return res;
};

export default middleware;