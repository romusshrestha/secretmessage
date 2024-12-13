import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    //legacy code for old version of next 
    // if (request.method !== 'GET') {
    //     return Response.json(
    //         {
    //             success: false,
    //             message: "Request method not allowed(omly GET",
    //         },
    //         {
    //             status: 405
    //         }
    //     )
    // }

    await dbConnect();
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result);//remove later
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters",
                },
                {
                    status: 400
                }
            )
        }
        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {
                    status: 400
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Username is available",
            },
            {
                status: 200
            }
        )





    } catch (error) {
        console.error("Error checking username: ", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            {
                status: 500
            }
        )
    }

}