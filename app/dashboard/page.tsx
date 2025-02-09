"use client"
import { useEffect, useState } from 'react'
import StreamView from '../components/StreamView'
import { getSession } from 'next-auth/react'

interface Song{
  id: string,
  bigImg: string,
  smallImg: string,
  title: string,
  type:string,
    upvotes:number
    haveUpdated:boolean
}
export default function Dashboard() {
  const [creatorId , setcreatorId] = useState('');
  useEffect(()=>{
    async function fetchUserId() {
      const session = await getSession();
      setcreatorId(session?.user?.db_id ?? "");
    }
    fetchUserId();
  },[])
  return <StreamView creatorId={creatorId}></StreamView>
}