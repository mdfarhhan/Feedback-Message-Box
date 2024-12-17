import dbConnect from "@/lib/connectDB";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(req: Request) {
    await dbConnect();
    const {username, content} = await req.json();
    try {
        const findUser = await UserModel.findOne({username});
        if(!findUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 400 });
        }
        if(!findUser.isAcceptingMessage) {
            return Response.json({ success: false, message: "User is not accepting messages" }, { status: 400 });
        }
        const newMessage = {content,createdAt:new Date()};
        findUser.messages.push(newMessage as Message);
        await findUser.save();
        return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });

    } catch (error) {
        console.log("failed to send message.");
        return Response.json({success:false, message:"Failed to send message."},{status:500})
    }
}