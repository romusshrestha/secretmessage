'use client';

import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ApiResponse from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    //zod validation implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const res = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            toast({
                title: 'User Verified Successfully',
                description: res.data?.message,
            })

            router.replace(`/sign-in`);

        } catch (error) {
            console.error("Error in signup of user: ", error)
            const axiosError = error as AxiosError<ApiResponse>;
            console.log(axiosError.response?.data.message)
            const errmsg= axiosError.response?.data.message;
            toast({
                title: 'Verification Failed',
                description: errmsg,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">
                        Enter OTP sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter OTP here..."
                                            {...field}
                                        />

                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="m-auto ml-40"
                            type="submit"
                        >
                            Verify
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
