import { IMessage } from "@/model/User";

export  default interface IApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<IMessage>;
}