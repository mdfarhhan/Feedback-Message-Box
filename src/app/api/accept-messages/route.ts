import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/connectDB";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { Session } from "inspector/promises";



export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user
    if(!session || !session.user){
        return Response.json({ success: false, message: "User not found" }, { status: 400 });
    }
    const userId = user._id;
    const {acceptMeassage} = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMeassage }, { new: true });
        if (!updatedUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 400 });
        }
        return Response.json({ success: true, message: "User status updated successfully" }, { status: 200 });

    } catch (error) {
        console.log("failed to update user status to accept messages.")
        return Response.json({success:false, message:"Failed to update user status to accept messages."},{status:500})
    }
}

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user
    if(!session || !session.user){
        return Response.json({ success: false, message: "User Not Aunthenticated" }, { status: 401 });
    }
    const userId = user._id;
    const foundUser = await UserModel.findById(userId);
    if(!foundUser){
        return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return Response.json({ success: true, isAcceptingMessage: foundUser.isAcceptingMessage }, { status: 200 });
}