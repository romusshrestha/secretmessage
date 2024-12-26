'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"
import { useCompletion } from 'ai/react'
import { messageSchema } from "@/schemas/messageSchema"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import ApiResponse from "@/types/ApiResponse"
import { useParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const charToRemove = '||';
const pasreCharacter = (messageString: string): string[] => {
    return messageString.split(charToRemove);
}
const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

function SendMessage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const { toast } = useToast();

    const params = useParams<{ username: string }>();
    const username = params.username;

    //zod validation implementation for form
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    });

    //getting suggested message from api
    const { completion, setCompletion, } = useCompletion({
        initialCompletion: initialMessageString,

    })

    //for submitting messages 
    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/send-message`,
                {
                    ...data
                    , username,
                })
            console.log("Response: ", response.data)
            toast({
                title: String(response.data.messages),
                variant: "default"
            })
            form.reset({
                ...form.getValues(),
                content: ''
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.messages;
            if (axiosError.response?.status === 403) {
                toast({
                    title: 'Unable to send ',
                    description: String(errorMessage),
                    variant: "default"
                })
            }
            else {
                toast({
                    title: 'Error',
                    description: String(errorMessage),
                    variant: "destructive"
                })
            }
        } finally {
            setIsSubmitting(false);
        }
    }
    const messageContent = form.watch('content');
    //set selected message to textarea
    const onMessageClick = (message: string) => {
        form.setValue('content', message);
    }

    //fetch suggested message
    const fetchSuggestedMessage = async () => {
        try {

            setIsSuggestLoading(true);
            // complete('');
            const message = await axios.post<ApiResponse>(`/api/suggest-messages`);

            setCompletion(String(message.data.messages));
            setIsSuggestLoading(false);

        } catch (error) {
            console.error("Error in fetching suggested message: ", error)
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }
    }

    return (
        <div
            className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1
                className="text-4xl font-bold mb-3 text-center">
                Public Profile Link
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-semibold text-lg">Your Secret Message for <span className="bg-black text-white rounded-sm p-0.5 animate-pulse delay-1000">@{username}</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />

                                </FormControl>
                                <p>
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-center ">
                        {isSubmitting ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isSubmitting || !messageContent}>
                                Send
                            </Button>
                        )}
                    </div>


                </form>
            </Form>
            <Separator className="m-2" />
            <div
                className="space-y-4 my-8"
            >
                <div
                    className="space-y-2"
                >{isSuggestLoading ? 
                <Button
                    className="my-4"
                    onClick={fetchSuggestedMessage}
                    disabled={isSuggestLoading}
                >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <p className="animate-pulse">Generating...</p>
                </Button> : <Button
                    className="my-4"
                    onClick={fetchSuggestedMessage}
                    disabled={isSuggestLoading}
                >
                    AI Message Suggestion
                </Button>}

                    <p>
                        Click on any message below to select it.
                    </p>
                </div>
                <Card className="shadow-xl ">
                    <CardHeader>
                        <CardTitle className="text-center">Messages</CardTitle>
                        <Separator />
                    </CardHeader>
                    {
                        completion && pasreCharacter(completion).map((message, index) =>
                            <CardContent
                                key={index}
                                className="my-0.5 flex items-center justify-center "
                            >
                                <Button
                                    className=" w-full hover:translate-y-0.5 hover:scale-x-95
                                    hover:duration-300 "
                                    onClick={() => onMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            </CardContent>
                        )
                    }
                </Card>
            </div>
            <Separator className="my-6" />
            <div
                className="text-center">
                <div className="mb-6">
                    Get Your Message Board
                </div>
                <Link href={'/'} target="_blank">
                    <Button>Create Your Account</Button>
                </Link>
            </div>

        </div>
    )
}

export default SendMessage
