"use client"
import { useEffect, useState } from 'react'
import { Music, SkipForward, ThumbsUp, ThumbsDown, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"

export default function Dashboard() {
  const [songLink, setSongLink] = useState('')

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Adding song:', songLink)
    setSongLink('')
  }
  const REFRESH_INTERVAL_MS = 10 * 1000;
  async function refreshStreams() {
    const res = await axios.get('api/streams/my',{
      withCredentials:true
    });
    console.log(res);
  }
  useEffect(()=>{
    refreshStreams();
    const interval = setInterval(() => {
      
    }, REFRESH_INTERVAL_MS);
  },[])
  return (
    <div className="min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-indigo-800 via-blue-900 to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 backdrop-blur-sm bg-white/5 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Music className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
              Suffle Play
            </h1>
          </div>
          <Avatar className="h-12 w-12 ring-2 ring-blue-500/30 transition-all hover:ring-blue-500/50">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
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
                <Button variant="secondary" 
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border-blue-500/30">
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enter New Song */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl text-blue-100">Add a Song</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSong} className="space-y-4">
                <Input 
                  type="url" 
                  placeholder="Paste song link here" 
                  value={songLink}
                  onChange={(e) => setSongLink(e.target.value)}
                  className="bg-white/10 border-blue-500/30 placeholder-blue-300/50 text-blue-100 focus:border-blue-500/50" 
                />
                <Button type="submit" 
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border-blue-500/30">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Song
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
                  {[
                    { id: 1, title: "Song Title 1", artist: "Artist Name 1", votes: 15, thumbnail: "/placeholder.svg" },
                    { id: 2, title: "Song Title 2", artist: "Artist Name 2", votes: 8, thumbnail: "/placeholder.svg" },
                    { id: 3, title: "Song Title 3", artist: "Artist Name 3", votes: 12, thumbnail: "/placeholder.svg" },
                  ].map((song) => (
                    <li key={song.id} 
                      className="flex items-center justify-between bg-blue-500/5 hover:bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 transition-all">
                      <div className="flex items-center">
                        <div className="relative group">
                          <img src={song.thumbnail} alt={`${song.title} thumbnail`} 
                            className="w-14 h-14 rounded-lg mr-4 ring-2 ring-blue-500/30 transition-all group-hover:ring-blue-500/50" />
                          <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-100">{song.title}</h4>
                          <p className="text-sm text-blue-300">{song.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium bg-blue-500/20 px-3 py-1 rounded-full text-blue-100">
                          {song.votes} votes
                        </span>
                        <Button size="sm" variant="outline" 
                          className="bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-400">
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" 
                          className="bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400">
                          <ThumbsDown className="w-4 h-4" />
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