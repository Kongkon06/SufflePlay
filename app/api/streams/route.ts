import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchai from "youtube-search-api";

const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string()
});

const isValidYouTubeUrl = (url: string): boolean => {
  const regex =  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
  return regex.test(url);
};

function extractVideoId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  
export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());
    const isYt = isValidYouTubeUrl(data.url);

    if (!isYt) {
      return NextResponse.json(
        { msg: "Wrong URL format" },
        { status: 411 }
      );
    }

    const extractedId = extractVideoId(data.url) ?? "";
    const res = await youtubesearchai.GetVideoDetails(extractedId);
    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a:{width : number}, b :{width : number}) =>a.width < b.width ? -1 : 1);
    console.log(res);
    await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title:res.title,
        smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length -2] : "https://th.bing.com/th?id=OSK.HEROQNxPStI-rMO8Bzi5IJIOr2sq2_c0F8qNwc-UdDY7ROw&w=472&h=280&c=13&rs=2&o=6&pid=SANGAM"),
        bigImg : thumbnails[thumbnails.length -1]
      }
    });

    return NextResponse.json({ msg: "Added stream" });
  } catch (e) {
    return NextResponse.json(
      { msg: "error in received body", error: e },
      { status: 411 }
    );
  }
}
