import { NextAuthOptions } from 'next-auth';
import CredentialSProvider from 'next-auth/providers/credentials';
import bcrypt from "bcrypt";
import dbConnect from '@/lib/connectDB';
import UserModel from '@/model/User';
import { promises } from 'dns';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialSProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({ $or: [{ username: credentials.username }, { email: credentials.username }] });

                    if (!user) {
                        throw new Error("User not found");
                    }
                    if (!user.isVerified) {
                        throw new Error("User is not verified.please verify your account before login");
                    }
                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!passwordMatch) {
                        throw new Error("Invalid password");
                    }
                    else {
                        return user
                    }
                } catch (error) {
                    throw new Error()
                }
            }
        })

    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",

    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET

}