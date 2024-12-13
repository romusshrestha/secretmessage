import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not Found",
                },
                {
                    status: 500
                }
            )
        }

        const isCodeValid = user.verifyCode === code;
        const verifyCodeExpiryString = await user.verifyCodeExpiry;
        const verifyCodeExpiryDate = new Date(verifyCodeExpiryString);
        const isCodeNotExpired = verifyCodeExpiryDate > new Date();
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            console.log(user.isVerified)
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Account verified sucessfully",
                },
                {
                    status: 200
                }
            )
        }else if (!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired. Please signup again to get new code",
                },
                {
                    status: 400
                }
            )
        }else{
            return Response.json(
                {
                    success: false,
                    message: "Incorrect OTP(Verification) code",
                },
                {
                    status: 400
                }
            )
        }

    } catch (error) {
        console.error("Error verifying user: ", error)
        return Response.json(
            {
                success: false,
                message: "Error verifying user",
            },
            {
                status: 500
            }
        )
    }
}