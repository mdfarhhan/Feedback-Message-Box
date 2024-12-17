import dbConnect from "@/lib/connectDB";
import UserModel from "@/model/User";
import {z} from "zod";
import { userNameValidation } from "@/Schemas/signUpSchema";

const checkUsernameUniqueSchema = z.object({
    username: userNameValidation
})

export async function GET(req: Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(req.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = checkUsernameUniqueSchema.safeParse(queryParam);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return Response.json({ success: false, message: usernameError }, { status: 400 });
        }
        else{
            const {username} = result.data;
            const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
            if (existingUserVerifiedByUsername) {
                return Response.json({ success: false, message: "User already exists" }, { status: 400 });
            }
            else {
                return Response.json({ success: true, message: "Username is unique" }, { status: 200 });
            }
        }
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({ success: false, message: "Error checking username" }, { status: 500 });
    }
}