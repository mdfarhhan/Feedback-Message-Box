import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";

const handler = NextAuth({
    providers: [],
    callbacks: {},
    secret: process.env.NEXTAUTH_SECRET,
} as AuthOptions);

export { handler as GET, handler as POST };