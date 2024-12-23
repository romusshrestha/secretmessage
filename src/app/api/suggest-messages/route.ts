import { GoogleGenerativeAI } from "@google/generative-ai";
import {  NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
// export const runtime = "edge";


export async function POST(): Promise<Response> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt: string = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. Make sure the questions are always random even with the same prompt.";
        const prompt2: string = "Generate a list of three unique, open-ended, and engaging questions formatted as a single string. Separate each question with '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should focus on universal, lighthearted themes that encourage friendly interaction. Ensure the questions are varied and imaginative, avoiding repetition or overly similar ideas. Include elements of randomness, so the output is different each time, even with the same prompt. For example, your output could be structured like this: 'What’s an interesting place you’d like to visit and why?||What’s a fun fact about something you’ve recently learned?||If you could master any skill instantly, what would it be?'. Make sure the questions foster curiosity, are non-sensitive, and contribute to a positive and welcoming environment."

        function selectRandomPrompt() {
            const randomNumber = Math.random();
            return randomNumber < 0.5 ? prompt : prompt2
        }
        const res = await model.generateContent(
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: selectRandomPrompt(),
                            }
                        ],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 400,
                    temperature: 1.0,
                }
            }
        );

        if (res && typeof res.response?.text() === "string") {
            return NextResponse.json(
                {
                    success: true,
                    messages: res.response.text(),

                },
                {
                    status: 200,
                }
            )
        } else {
            console.log(res.response.text());
            throw new Error("Unexpexted response structure");
        }
    } catch (error) {
        console.log("Error generating content: ", error)
        return NextResponse.json(
            {
                success: false,
                error: error,
            },
            {
                status: 500,
            }
        )
    }
}

