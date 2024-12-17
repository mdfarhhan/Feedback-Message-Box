import dbConnect from "@/lib/connectDB";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const {username, code} = await req.json();
        const decodedusername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedusername});
        if(!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 400 });
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifycodeExpiry) > new Date();
        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({ success: true, message: "User verified successfully" }, { status: 200 });
        }
        else if(!isCodeNotExpired){
            return Response.json({ success: false, message: "Verification code has expired" }, { status: 400 });
        }
        else{
            return Response.json({ success: false, message: "Invalid verification code" }, { status: 400 });
        }


        
    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json({ success: false, message: "Error verifying user" }, { status: 500 });
    }
}