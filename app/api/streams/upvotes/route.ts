import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const UpvoteSchema = z.object({
    streamId : z.string()
})
export async function POST(req:NextRequest){
        const session =await getServerSession();
        const user =await prismaClient.user.findFirst({
            where:{
                email:session?.user?.email ?? ""
            }
        })

        if(!user){
            return NextResponse.json({
                msg:"You are not authenticated"
            })
        }
        try{
            const data = UpvoteSchema.parse(await req.json());
            await prismaClient.upvote.create({
                data:{
                    streamId:data.streamId,
                    userId:user.id
                }
            })
            return NextResponse.json({
                msg:"done"
            })
        }catch(error: unknown) {
            if (error instanceof Error) {
                return NextResponse.json({
                    msg: "Error while upvoting: " + error.message
                }, {
                    status: 411
                });
            }
        
            return NextResponse.json({
                msg: "An unknown error occurred"
            }, {
                status: 411
            });
        }
        

}

export async function GET(req : NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where:{
            userId:creatorId ?? ""
        }
    })
    return NextResponse.json({
        streams
    })
}