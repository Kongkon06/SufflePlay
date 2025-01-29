import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { string, z } from "zod";

const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

const YT_REGEX = new RegExp("https?:\/\/(www\.)?youtu\.be\/[\w-]+");

export async function POST(req: NextRequest) {
    try {
        const data = createStreamSchema.parse(await req.json());
        const isYt = data.url.includes("youtube");
        if (!isYt) {
            return NextResponse.json({
                msg: "Wrong URL format"
            }, {
                status: 411
            })
        }

        const extractedId = data.url.split("?v=")[1];
        await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type:"Youtube"
            }
        })
    } catch (e) {
        return NextResponse.json({
            msg: "error in receieved body"
        }, {
            status: 411
        })
    }

}