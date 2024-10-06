import OpenAI from "openai";
import { define } from "../../lib/utils.ts";

export const handler = define.handlers({
    async POST(ctx) {
        try {
            const openai = new OpenAI({
                baseURL: "https://api.groq.com/openai/v1",
                apiKey:
                    "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",
            });
            const { prompt } = await ctx.req.json();
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: prompt }],
                model: "llama-3.2-90b-text-preview",
            });
            return new Response(completion.choices[0].message.content);
        } catch (e) {
            console.error(e);
            return Response.error();
        }
    },
});
