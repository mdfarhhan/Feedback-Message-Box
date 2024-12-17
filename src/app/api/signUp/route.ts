import dbConnect from "@/lib/connectDB";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import { string } from "zod";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true })
        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, message: "User already exists" }, { status: 400 });
        }
        const existingUserVerifiedByemail = await UserModel.findOne({ email })
        const sdn = Math.floor(100000 + Math.random() * 900000);
        if (existingUserVerifiedByemail) {
            if (existingUserVerifiedByemail.isVerified) {
                return Response.json({ success: false, message: "User already exists" }, { status: 400 });
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByemail.password = hashedPassword;
                existingUserVerifiedByemail.verifyCode = sdn.toString();
                existingUserVerifiedByemail.verifycodeExpiry = new Date(Date.now()+3600000);
                await existingUserVerifiedByemail.save();
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1);
            const user = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: sdn.toString(),
                verifycodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            await user.save();

        }
        //send verification email
        const emailResponse = await sendVerificationEmail(email, username, sdn.toString());
        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 });
        }

        return Response.json({ success: true, message: "User registered successfully.Please Verify your email" }, { status: 200 });

    }
    catch (error) {
        console.error("Error Registering user:", error);
        return Response.json({ success: false, message: "Failed to register user" }, { status: 500 });
    }
}
