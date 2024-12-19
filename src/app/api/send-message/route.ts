import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { IMessage } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    messages: "User not found",
                },
                {
                    status: 404
                }
            )
        }
        //is user accepting messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    messages: "User is not accepting messages",
                },
                {
                    status: 403
                }
            )
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as IMessage);
        await user.save();
        return Response.json(
            {
                success: true,
                messages: "Message sent successfully",
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error adding messages: ",error)
        return Response.json(
            {
                success: false,
                messages: "Internal server error",
            },
            {
                status: 500
            }
        )
    }
}

