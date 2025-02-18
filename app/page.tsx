import Appbar from "./components/Appbar";
import { Music, Users, Star, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Redirect } from "./components/Redirect";

export default function Home() {
  console.log(process.env.GOOGLE_CLIENT_ID);
  return <main>
    <Appbar />
    <Redirect />
    <div className="min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-blue-800 via-blue-900 to-indigo-950 text-white p-4 overflow-auto">
      <div className="max-w-6xl mx-auto pt-6">
        {/* Hero Section */}
        <section className="text-center py-12">
          <div className="flex items-center justify-center mb-6">
            <Music className="w-12 h-12 mr-2" />
            <h1 className="text-4xl font-bold">SufflePlay</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your Fan-Powered Music Experience</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join the revolution in music streaming where fans choose what plays next!
          </p>
          <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-100">
            Get Started
          </Button>
        </section>

        {/* Loading Animation */}
        <div className="flex justify-center mb-12">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        </div>

        {/* Key Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-xl">
                <Users className="w-6 h-6 mr-2 " />
                Connect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white">
                Join a vibrant community of music lovers and creators. Share your taste and discover new favorites
                together.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-xl">
                <Star className="w-6 h-6 mr-2" />
                Influence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white">
                Your vote matters! Shape the stream by voting on what plays next and help curate the perfect playlist.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-xl">
                <Headphones className="w-6 h-6 mr-2 text-white" />
                Discover
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white">
                Expand your musical horizons with new tracks and artists, all curated by fans with tastes similar to
                yours.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Additional Info */}
        <section className="text-center mb-8">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <p className="text-lg mb-4">
            FanTune is loading up a world where your voice shapes the music stream. Whether you are a creator or a listener, get ready to be part of something revolutionary.
          </p>

          <p className="text-sm text-purple-200">Hang tight! We are tuning up your personalized music experience...</p>
        </section>
      </div>
    </div>
  </main>
}
