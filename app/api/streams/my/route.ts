import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth"; // Ensure you have this setup
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({
                error: "User not authenticated",
            }, { status: 401 });
        }

        const user = await prismaClient.user.findFirst({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            return NextResponse.json({
                error: "User not found",
            }, { status: 404 });
        }

        const streams = await prismaClient.stream.findMany({
            where: {
              userId: user.id,
            },
            include: {
              _count: {
                select: {
                  upvotes: true,
                },
              },
              upvotes:{
                where:{
                    userId: user.id
                }
              }
            },
          });
          

        return NextResponse.json({ songs: streams.map(({_count,...rest})=>({
            ...rest,
            upvotes: _count.upvotes,
            haveUpdated: rest.upvotes.length? true : false
        }) )
    });
    } catch (error) {
        console.error("Error fetching streams:", error);
        return NextResponse.json({
            error: "Internal server error",
        }, { status: 500 });
    }
}
