import { env } from "./env";
import {ChatGoogle} from '@langchain/google'
import type {BaseChatModel} from "@langchain/core/language_models/chat_models"

type modelOpts = {
    temperature?: number;
    maxToken?: number;
};

export function getChatModel(opts: modelOpts={}): BaseChatModel{
    const temperature = opts?.temperature ?? 0.2;

    switch (env.MODEL_PROVIDER) {
        case 'gemini':
            return new ChatGoogle({
                apiKey: env.GOOGLE_API_KEY,
                model: env.GEMINI_MODEL,
                temperature: temperature,
            });
        default:
            throw new Error(`Unsupported model provider: ${env.MODEL_PROVIDER}`);
    }
}