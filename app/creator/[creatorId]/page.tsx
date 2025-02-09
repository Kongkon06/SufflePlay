"use client"
import axios from "axios"
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

interface Song{
  id: string,
  bigImg: string,
  smallImg: string,
  title: string,
  type:string,
    upvotes:number
    haveUpdated:boolean
}
interface StreamViewProps {
  creatorId: string;
}
const StreamView = dynamic(() => import('../../components/StreamView'), { ssr: false });
export default function Dashboard() {
  const params = useParams();
  if (!params.creatorId) {
    return <p>No Creator ID found!</p>;
  }
  async function refreshStreams() {
    const res = await axios.get(`/api/streams/test:${creatorId}`,{
      withCredentials:true
    });
    return res;
  }
  const creatorId = params.creatorId?.toString() ?? "";
  return <StreamView creatorId={creatorId} />;
}
