"use client"
import { useEffect, useState } from 'react'
import { Music, SkipForward, ThumbsUp, ThumbsDown, Plus, Loader2, SkipBack, Pause, Play,Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"
import { getSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Appbar from './Appbar'

interface Song{
  id: string,
  bigImg: string,
  smallImg: string,
  title: string,
  type:string,
    upvotes:number
    haveUpdated:boolean
}

export default function StreamView({
  creatorId,
  fetchFn,
}: {
  creatorId: string;
  fetchFn?: () => Promise<Song[]>;
}) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [Link , setLink] = useState("");
  const [Loading , setLoading] = useState(false);
  const [Playing , setPlay] = useState(false);
  const [shareUrl , setShareUrl] = useState('');

  const handleAddSong = async () => {
    setLoading(true);
   await axios.post('/api/streams',{
    creatorId:creatorId,
    url:Link
   }).then(()=>{setLoading(false);})
  }
  const REFRESH_INTERVAL_MS = 10 * 1000;
  async function refreshStreams() {
    const res = await axios.get(`/api/streams?spaceId=${creatorId}`,{
      withCredentials:true
    });
    setSongs(res.data.songs);
    console.log("inside refresh");
  }
  async function handleFetch() {
    if (fetchFn) {
      try {
        const res = await fetchFn();
        setSongs(res.sort((a,b)=>a.upvotes < b.upvotes ? -1 : 1));
      } catch (err) {
        console.error("Failed to fetch songs:", err);
      }
    }
  }
  useEffect(() => {
    if (fetchFn) {
     handleFetch();
    }else {refreshStreams();}
    async function fetchUserId() {
      const session = await getSession();
      const creatorId = session?.user?.db_id ?? "";
      setShareUrl(`${window.location.hostname}:3000/creator/${creatorId}`);
    }
    fetchUserId();
  }, []);
  

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "The dashboard link has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Failed to Copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleUpvote =async (id:string,haveUpdated:boolean) =>{
    setSongs(songs.map(song=>song.id==id?{
      ...song,
      upvotes: haveUpdated ? song.upvotes - 1 : song.upvotes + 1,
      haveUpdated: !song.haveUpdated
    }:song).sort((a,b)=>(b.upvotes) - (a.upvotes)))
    if(haveUpdated){
      const res = await axios.post('/api/streams/downvotes',{
        streamId:id
      });
    }else{
      const res = await axios.post('/api/streams/upvotes',{
        streamId:id
      })
    }

  }
  return (
    <div className="min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-indigo-800 via-blue-900 to-indigo-950 text-white">
      <Appbar/>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="flex justify-between items-center mt-12 mb-8 backdrop-blur-sm bg-white/5 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Music className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
              Suffle Play
            </h1>
          </div>
          <div className='flex gap-4 items-center'>
          <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white/20 hover:bg-white/30">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share dashboard</DialogTitle>
                  <DialogDescription>
                    Anyone with this link will be able to view and add songs to your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input value={shareUrl} readOnly className="bg-white/20 border-white/30" />
                  <Button type="submit" onClick={handleShare}>
                    Copy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          <Avatar className="h-12 w-12 ring-2 ring-blue-500/30 transition-all hover:ring-blue-500/50">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Currently Playing */}
          <Card className="md:col-span-3 bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl text-blue-100">Now Playing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative group">
                    <img src="/placeholder.svg" alt="Album cover" 
                      className="w-20 h-20 rounded-xl mr-6 ring-2 ring-blue-500/30 transition-all group-hover:ring-blue-500/50" />
                    <div className="absolute inset-0 bg-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-100">Song Title</h3>
                    <p className="text-sm text-blue-300">Artist Name</p>
                  </div>
                </div>
                <div className='flex gap-4'>
                <Button variant="secondary" 
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border-blue-500/30">
                    <SkipBack className="w-4 h-4"/>
                </Button>
                <Button onClick={()=>setPlay(!Playing)} variant="secondary" 
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border-blue-500/30">
                    {Playing ? <Pause className="w-4 h-4"/>: <Play className="w-4 h-4"/>}
                </Button>
                <Button variant="secondary" 
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border-blue-500/30">
                  <SkipForward className="w-4 h-4" />
                </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enter New Song */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl text-blue-100">Add a Song</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input 
                  type="url" 
                  placeholder="Paste song link here" 
                  value={Link}
                  onChange={(e) => {setLink(e.target.value)}}
                  className="bg-white/10 border-blue-500/30 placeholder-blue-300/50 text-blue-100 focus:border-blue-500/50" 
                />
                <Button type="button" onClick={handleAddSong} 
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border-blue-500/30">
                    {Loading ? <div><Loader2></Loader2></div> : <div className='flex'> <Plus className="w-4 h-4 mr-2"  /> Add Song</div>}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Vote for Songs */}
          <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl text-blue-100">Vote for Next Song</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <ul className="space-y-4">
                  {songs.map((song) => (
                    <li key={song.id} 
                      className="flex items-center justify-between bg-blue-500/5 hover:bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 transition-all">
                      <div className="flex items-center">
                        <div className="relative group">
                          <img src={song.smallImg} alt={`${song.title} thumbnail`} 
                            className="w-14 h-14 object-cover rounded-lg mr-4 ring-2 ring-blue-500/30 transition-all group-hover:ring-blue-500/50" />
                          <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                          <h4 className="ml-4 font-semibold text-blue-100">{song.title}</h4>
                          <p className="text-sm text-blue-300 ml-4">{song.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium bg-blue-500/20 px-3 py-1 rounded-full text-blue-100">
                          {song.upvotes}
                        </span>
                        <Button onClick={()=>{handleUpvote(song.id,song.haveUpdated)}} size="sm" variant="outline" 
                          className="bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-400">
                            {song.haveUpdated ?  <ThumbsDown className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" /> }
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}