import dbConnect from "@/lib/connectDB";
import UserModel, { User } from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  await dbConnect();
  const messageid = params.messageid;
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Aunthenticated" },
      { status: 400 }
    );
  }
 
  try {
    const updatedresult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );
    if(updatedresult.modifiedCount === 0) {
        return Response.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Message deleted successfully" }, { status: 200 });

  } catch (error) {
    console.log("Error in deleting message", error);
    return Response.json({ success: false, message: "Error deleting message" }, { status: 500 });
  }
}
