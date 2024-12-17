
import { NextResponse , NextRequest} from "next/server";
// import type { NextRequest } from "next/server";
export {default} from "next-auth/middleware"
import {getToken} from "next-auth/jwt"
import { get } from "http";

export async function middleware(req: NextRequest) {
    const token = await getToken({req:req});
    const url = req.nextUrl;
    if(token && 
        (url.pathname === "/login"
        || url.pathname === "/signUp"
        ||url.pathname === "/verify"
        ||url.pathname === "/"
        )
    ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
}

if(!token && url.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/login", req.url));
}
}
export const config = {
    matcher: [
        "/",
        "/login",
        "/signUp",
        "/dashboard/:path*",
        '/verify/:path*',
    ]
}


